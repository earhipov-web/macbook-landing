import type { Metadata, Viewport } from "next";
import { Nunito } from "next/font/google";
import "./globals.css";

// Одна мягкая гарнитура со скруглёнными окончаниями: тонкое начертание для заголовков, обычное для текста.
const nunito = Nunito({
  variable: "--font-text",
  subsets: ["latin", "cyrillic"],
  weight: ["300", "400", "600"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "Графит — MacBook 2026: Neo, Air M5, Pro M6",
  description:
    "Вся линейка MacBook 2026 года: описание моделей, сравнение характеристик, цены и заявка на подбор. Оригинал, гарантия, доставка по России.",
};

export const viewport: Viewport = {
  themeColor: "#e9eae8",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="ru"
      className={nunito.variable}
      style={{ ["--font-display" as string]: "var(--font-text)" }}
      suppressHydrationWarning
    >
      <head>
        {/* js — скрипты работают; lite — слабое устройство (≤4 ядер, ≤4 ГБ памяти или режим экономии трафика):
            там отключаются тяжёлые эффекты прокрутки и снижается качество 3D */}
        <script
          dangerouslySetInnerHTML={{
            __html:
              "(function(){var d=document.documentElement,n=navigator;d.classList.add('js');" +
              "if((n.hardwareConcurrency&&n.hardwareConcurrency<=4)||(n.deviceMemory&&n.deviceMemory<=4)||(n.connection&&n.connection.saveData))d.classList.add('lite')})()",
          }}
        />
      </head>
      <body className="antialiased">{children}</body>
    </html>
  );
}
