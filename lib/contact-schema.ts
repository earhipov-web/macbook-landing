import { z } from "zod";

// Одна схема для браузера и сервера: сервер никогда не доверяет проверке на клиенте.
export const contactSchema = z.object({
  name: z
    .string()
    .trim()
    .min(2, "Укажите имя, хотя бы 2 буквы")
    .max(60, "Имя длиннее 60 символов")
    .regex(/^[\p{L}\p{M}' .-]+$/u, "Имя может содержать только буквы, пробел, дефис и апостроф"),
  email: z
    .string()
    .trim()
    .max(120, "Почта длиннее 120 символов")
    .pipe(z.email("Проверьте адрес почты, например name@mail.ru")),
  telegram: z
    .string()
    .trim()
    .regex(/^@?[A-Za-z0-9_]{5,32}$/, "Ник в Telegram: 5–32 латинские буквы, цифры или _, например @ivan_petrov")
    .transform((v) => (v.startsWith("@") ? v : `@${v}`)),
  message: z.string().trim().max(1000, "Сообщение длиннее 1000 символов").optional().default(""),
  // Ловушка для ботов: поле скрыто от людей и должно остаться пустым.
  website: z.string().max(0).optional().default(""),
});

export type ContactInput = z.input<typeof contactSchema>;
export type ContactData = z.output<typeof contactSchema>;
