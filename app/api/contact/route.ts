import { NextResponse, type NextRequest } from "next/server";
import { contactSchema, type ContactData } from "@/lib/contact-schema";

const MAX_BODY_BYTES = 4096;
const WINDOW_MS = 10 * 60 * 1000;
const MAX_PER_WINDOW = 5;

// Простое ограничение частоты в памяти процесса. На нескольких серверах замените на Redis/KV.
const hits = new Map<string, { count: number; reset: number }>();

function clientIp(req: NextRequest) {
  return req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() || req.headers.get("x-real-ip") || "unknown";
}

function rateLimited(ip: string) {
  const now = Date.now();
  if (hits.size > 5000) {
    for (const [k, v] of hits) if (v.reset < now) hits.delete(k);
  }
  const h = hits.get(ip);
  if (!h || h.reset < now) {
    hits.set(ip, { count: 1, reset: now + WINDOW_MS });
    return false;
  }
  h.count += 1;
  return h.count > MAX_PER_WINDOW;
}

function sameOrigin(req: NextRequest) {
  const origin = req.headers.get("origin");
  const host = req.headers.get("x-forwarded-host") ?? req.headers.get("host");
  if (!origin || !host) return false;
  try {
    return new URL(origin).host === host;
  } catch {
    return false;
  }
}

async function deliver(data: ContactData) {
  const token = process.env.TELEGRAM_BOT_TOKEN;
  const chatId = process.env.TELEGRAM_CHAT_ID;

  if (!token || !chatId) {
    if (process.env.NODE_ENV !== "production") {
      console.info("[contact] TELEGRAM_* не заданы, заявка не отправлена (dev):", data.name, data.telegram);
      return true;
    }
    console.error("[contact] TELEGRAM_BOT_TOKEN или TELEGRAM_CHAT_ID не заданы");
    return false;
  }
  // Токен попадает в путь запроса: проверяем формат, чтобы нельзя было подменить адрес.
  if (!/^\d{5,16}:[A-Za-z0-9_-]{30,64}$/.test(token) || !/^-?\d{1,20}$|^@[A-Za-z0-9_]{5,32}$/.test(chatId)) {
    console.error("[contact] Неверный формат TELEGRAM_BOT_TOKEN или TELEGRAM_CHAT_ID");
    return false;
  }

  // Без parse_mode: текст уходит как есть, разметка из полей формы не исполняется.
  const text = [
    "Новая заявка с сайта",
    `Имя: ${data.name}`,
    `Почта: ${data.email}`,
    `Telegram: ${data.telegram}`,
    data.message ? `Сообщение: ${data.message}` : null,
  ]
    .filter(Boolean)
    .join("\n");

  try {
    const res = await fetch(`https://api.telegram.org/bot${token}/sendMessage`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ chat_id: chatId, text, disable_web_page_preview: true }),
      signal: AbortSignal.timeout(8000),
      cache: "no-store",
    });
    if (!res.ok) console.error("[contact] Telegram ответил", res.status);
    return res.ok;
  } catch (e) {
    console.error("[contact] Не удалось связаться с Telegram:", (e as Error).name);
    return false;
  }
}

export async function POST(req: NextRequest) {
  if (!sameOrigin(req)) {
    return NextResponse.json({ error: "Запрос отклонён" }, { status: 403 });
  }
  if (!req.headers.get("content-type")?.includes("application/json")) {
    return NextResponse.json({ error: "Ожидается JSON" }, { status: 415 });
  }
  const declared = Number(req.headers.get("content-length") ?? 0);
  if (declared > MAX_BODY_BYTES) {
    return NextResponse.json({ error: "Слишком длинная заявка" }, { status: 413 });
  }
  if (rateLimited(clientIp(req))) {
    return NextResponse.json(
      { error: "Слишком много заявок подряд. Попробуйте через 10 минут или напишите в Telegram." },
      { status: 429 },
    );
  }

  const raw = await req.text();
  if (raw.length > MAX_BODY_BYTES) {
    return NextResponse.json({ error: "Слишком длинная заявка" }, { status: 413 });
  }

  let body: unknown;
  try {
    body = JSON.parse(raw);
  } catch {
    return NextResponse.json({ error: "Не удалось прочитать заявку" }, { status: 400 });
  }

  const parsed = contactSchema.safeParse(body);
  if (!parsed.success) {
    const fields: Record<string, string> = {};
    for (const issue of parsed.error.issues) {
      const key = String(issue.path[0] ?? "form");
      if (key !== "website" && !fields[key]) fields[key] = issue.message;
    }
    // Бот заполнил ловушку: отвечаем как обычно, но ничего не отправляем.
    if (parsed.error.issues.some((i) => i.path[0] === "website")) {
      return NextResponse.json({ ok: true });
    }
    return NextResponse.json({ error: "Проверьте поля формы", fields }, { status: 422 });
  }

  const ok = await deliver(parsed.data);
  if (!ok) {
    return NextResponse.json(
      { error: "Заявка не отправилась. Напишите нам в Telegram, мы ответим там." },
      { status: 502 },
    );
  }
  return NextResponse.json({ ok: true });
}
