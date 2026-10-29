"use client";

import { useState, type FormEvent } from "react";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { contactSchema } from "@/lib/contact-schema";
import { site } from "@/lib/models";
import { ScrollPanel } from "./scroll-panel";

type Field = "name" | "email" | "telegram" | "message";
type Status = { kind: "idle" | "sending" | "sent" } | { kind: "error"; text: string };

const fieldClass =
  "mt-2 h-12 rounded-2xl border-0 bg-white/10 px-4 text-[length:var(--step-body)] text-paper-ink placeholder:text-paper-soft/70 focus-visible:ring-2 focus-visible:ring-sky aria-invalid:ring-2 aria-invalid:ring-[#f0b4a8] md:text-[length:var(--step-body)]";
const errClass = "mt-2 text-[length:var(--step-small)] text-[#f0b4a8]";

export function Contact() {
  const [errors, setErrors] = useState<Partial<Record<Field, string>>>({});
  const [status, setStatus] = useState<Status>({ kind: "idle" });

  async function onSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const form = e.currentTarget;
    const values = Object.fromEntries(new FormData(form)) as Record<string, string>;

    const parsed = contactSchema.safeParse(values);
    if (!parsed.success) {
      const next: Partial<Record<Field, string>> = {};
      for (const i of parsed.error.issues) {
        const k = i.path[0] as Field;
        if (!next[k]) next[k] = i.message;
      }
      setErrors(next);
      const first = Object.keys(next)[0];
      if (first) form.querySelector<HTMLElement>(`[name="${first}"]`)?.focus();
      return;
    }

    setErrors({});
    setStatus({ kind: "sending" });
    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(values),
      });
      const json = (await res.json().catch(() => ({}))) as { error?: string; fields?: Partial<Record<Field, string>> };
      if (!res.ok) {
        if (json.fields) setErrors(json.fields);
        setStatus({ kind: "error", text: json.error ?? "Заявка не отправилась. Попробуйте ещё раз." });
        return;
      }
      form.reset();
      setStatus({ kind: "sent" });
    } catch {
      setStatus({ kind: "error", text: "Нет связи с сервером. Проверьте интернет и отправьте ещё раз." });
    }
  }

  const err = (f: Field) =>
    errors[f] ? (
      <p id={`${f}-err`} className={errClass}>
        {errors[f]}
      </p>
    ) : null;

  return (
    <ScrollPanel
      id="contact"
      labelledBy="contact-h"
      tone="dark"
      className="flex flex-col gap-[clamp(64px,10vh,140px)] px-5 py-14 md:px-14 md:py-24"
    >
      <div className="grid gap-12 md:grid-cols-12 md:gap-6">
        <div className="md:col-span-5">
          <h2 id="contact-h" className="font-display text-[length:var(--step-head)]">
            Подберём MacBook
          </h2>
          <p className="mt-6 max-w-[34ch] text-[length:var(--step-lead)] leading-snug">
            Напишите, для чего нужен ноутбук. Ответим в Telegram в течение часа и предложим две-три
            конфигурации. Можно и сразу в чат: ссылка ниже.
          </p>
        </div>

        {status.kind === "sent" ? (
          <div role="status" className="md:col-span-6 md:col-start-7">
            <p className="font-display text-[length:var(--step-head)] leading-none">Заявка отправлена</p>
            <p className="mt-4 max-w-[40ch]">
              Мы напишем вам в Telegram. Если удобнее сразу, откройте чат по ссылке ниже.
            </p>
            <button type="button" className="link mt-6 text-paper-ink" onClick={() => setStatus({ kind: "idle" })}>
              Отправить ещё одну
            </button>
          </div>
        ) : (
          <form noValidate onSubmit={onSubmit} className="grid gap-7 md:col-span-6 md:col-start-7" aria-describedby="form-status">
            <div className="grid gap-7 sm:grid-cols-2 sm:gap-6">
              <div>
                <Label htmlFor="name" className="text-[length:var(--step-small)] font-normal text-paper-soft">
                  Имя
                </Label>
                <Input
                  id="name"
                  name="name"
                  autoComplete="name"
                  maxLength={60}
                  required
                  aria-invalid={!!errors.name}
                  aria-describedby={errors.name ? "name-err" : undefined}
                  className={fieldClass}
                />
                {err("name")}
              </div>
              <div>
                <Label htmlFor="email" className="text-[length:var(--step-small)] font-normal text-paper-soft">
                  Почта
                </Label>
                <Input
                  id="email"
                  name="email"
                  type="email"
                  inputMode="email"
                  autoComplete="email"
                  maxLength={120}
                  required
                  placeholder="name@mail.ru"
                  aria-invalid={!!errors.email}
                  aria-describedby={errors.email ? "email-err" : undefined}
                  className={fieldClass}
                />
                {err("email")}
              </div>
            </div>
            <div>
              <Label htmlFor="telegram" className="text-[length:var(--step-small)] font-normal text-paper-soft">
                Ник в Telegram
              </Label>
              <Input
                id="telegram"
                name="telegram"
                autoComplete="off"
                autoCapitalize="none"
                spellCheck={false}
                maxLength={33}
                required
                placeholder="@ivan_petrov"
                aria-invalid={!!errors.telegram}
                aria-describedby={errors.telegram ? "telegram-err" : "telegram-hint"}
                className={fieldClass}
              />
              {errors.telegram ? (
                err("telegram")
              ) : (
                <p id="telegram-hint" className="mt-2 text-[length:var(--step-small)] text-paper-soft">
                  Латинские буквы, цифры и _, от 5 символов
                </p>
              )}
            </div>
            <div>
              <Label htmlFor="message" className="text-[length:var(--step-small)] font-normal text-paper-soft">
                Что ищете (необязательно)
              </Label>
              <Textarea
                id="message"
                name="message"
                rows={3}
                maxLength={1000}
                placeholder="Например: Air 13 для учёбы, бюджет до 130 тысяч"
                aria-invalid={!!errors.message}
                aria-describedby={errors.message ? "message-err" : undefined}
                className={`${fieldClass} h-auto min-h-24 resize-y py-3`}
              />
              {err("message")}
            </div>

            {/* Ловушка для ботов, скрыта от людей и скринридеров */}
            <div aria-hidden="true" className="sr-only">
              <label htmlFor="website">Сайт</label>
              <input id="website" name="website" type="text" tabIndex={-1} autoComplete="off" />
            </div>

            <div className="flex flex-wrap items-center gap-6">
              <button
                type="submit"
                disabled={status.kind === "sending"}
                className="btn bg-sky text-sky-ink hover:bg-[#cddae4]"
              >
                {status.kind === "sending" ? "Отправляем…" : "Отправить заявку"}
              </button>
              <p id="form-status" role="status" className="text-[length:var(--step-small)]">
                {status.kind === "error" ? <span className="text-[#f0b4a8]">{status.text}</span> : null}
              </p>
            </div>
            <p className="text-[length:var(--step-small)] text-paper-soft">
              Нажимая «Отправить заявку», вы соглашаетесь на обработку имени, почты и ника в Telegram
              для ответа на заявку.
            </p>
          </form>
        )}
      </div>

      <div>
        <a
          href={`https://t.me/${site.telegram}`}
          target="_blank"
          rel="noopener noreferrer"
          aria-label={`Написать в Telegram @${site.telegram}`}
          className="font-display block break-all text-[length:clamp(2.5rem,0.6rem+9vw,10rem)] leading-[0.95] tracking-[-0.02em] transition-colors duration-300 hover:text-sky"
        >
          @{site.telegram}
        </a>
        <div className="mt-8 flex flex-wrap justify-between gap-4 text-[length:var(--step-small)]">
          <p>
            {site.phone}, {site.city}
          </p>
          <p>Ежедневно с 10 до 21</p>
        </div>
      </div>
    </ScrollPanel>
  );
}
