"use client";

import dynamic from "next/dynamic";
import Image from "next/image";
import { Sacramento } from "next/font/google";
import { useEffect, useRef, useState } from "react";
import { site } from "@/lib/models";
import type { HeroProgress } from "./hero-macbook";

// Рукописное начертание для «hello» на экране ноутбука
const helloFont = Sacramento({ weight: "400", subsets: ["latin"], display: "block" });

const HeroMacbookCanvas = dynamic(() => import("./hero-macbook").then((m) => m.HeroMacbookCanvas), {
  ssr: false,
});

/** 3D только при WebGL2 и без «уменьшить движение»; null — ещё не проверено (SSR). */
function useCapabilityGate() {
  const [ok, setOk] = useState<boolean | null>(null);
  useEffect(() => {
    let webgl2 = false;
    try {
      webgl2 = !!document.createElement("canvas").getContext("webgl2");
    } catch {}
    setOk(webgl2 && !window.matchMedia("(prefers-reduced-motion: reduce)").matches);
  }, []);
  return ok;
}

/** Слабое устройство — класс `lite` ставит скрипт в <head> (см. layout.tsx). */
const isLite = () => typeof document !== "undefined" && document.documentElement.classList.contains("lite");

const nav = [
  { href: "#models", label: "Модели" },
  { href: "#compare", label: "Сравнение" },
  { href: "#prices", label: "Цены" },
];

export function Hero() {
  const capable = useCapabilityGate();
  const section = useRef<HTMLDivElement>(null);
  const intro = useRef<HTMLDivElement>(null);
  const cue = useRef<HTMLParagraphElement>(null);
  const progress = useRef<HeroProgress>({ target: 0, current: 0, open: 0, visible: true });

  // Прокрутка задаёт только цель и будит сцену; сцена догоняет цель сама с демпфированием.
  useEffect(() => {
    if (!capable) return;
    const state = progress.current;
    const onScroll = () => {
      const el = section.current;
      if (!el) return;
      const r = el.getBoundingClientRect();
      const run = el.offsetHeight - window.innerHeight;
      const target = Math.min(1, Math.max(0, -r.top / Math.max(1, run)));
      const visible = r.bottom > 0 && r.top < window.innerHeight;
      if (target === state.target && visible === state.visible) return;
      const wasVisible = state.visible;
      state.target = target;
      state.visible = visible;
      // ниже первого экрана сцену будим только один раз — чтобы она встала в итоговую позу и уснула
      if (visible || wasVisible) state.wake?.();
    };

    // Текст первого экрана уходит вверх, освобождая место открытому ноутбуку.
    // Обновляется из кадров сцены, отдельного вечного цикла нет; пишем стили, только когда значения меняются.
    let lastK = -1;
    let lastCue = -1;
    progress.current.onFrame = () => {
      const k = Math.round(Math.min(1, Math.max(0, (progress.current.current - 0.2) / 0.2)) * 100) / 100;
      if (k !== lastK && intro.current) {
        lastK = k;
        intro.current.style.opacity = String(1 - k);
        intro.current.style.transform = `translateY(${-k * 60}px)`;
        intro.current.style.pointerEvents = k > 0.6 ? "none" : "";
      }
      const c = Math.round(Math.max(0, 1 - progress.current.open * 6) * 100) / 100;
      if (c !== lastCue && cue.current) {
        lastCue = c;
        cue.current.style.opacity = String(c);
      }
    };

    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
      state.onFrame = undefined;
    };
  }, [capable]);

  const header = (
    <div className="frame absolute inset-x-0 top-0 z-20 flex items-center justify-between pt-6 text-[length:var(--step-small)] md:pt-8">
      <a href="#top" className="font-display text-[length:var(--step-lead)] font-normal leading-none">
        {site.name}
      </a>
      <nav aria-label="Разделы" className="flex items-center gap-6 md:gap-9">
        {nav.map((n) => (
          <a key={n.href} href={n.href} className="hidden hover:text-sky-deep sm:inline">
            {n.label}
          </a>
        ))}
        <a href="#contact" className="rounded-full bg-paper px-4 py-2 text-paper-ink transition-colors hover:bg-[#3a3d42]">
          Заявка
        </a>
      </nav>
    </div>
  );

  const title = (
    <div ref={intro} className="frame relative z-10 flex flex-col items-center pt-24 text-center md:pt-28">
      <h1 className="font-display text-[length:clamp(3rem,1rem+6vw,6.5rem)] leading-[0.92]">
        <span className="mask-line">
          <span>MacBook 2026</span>
        </span>
      </h1>
      <p
        className="fade-up mt-5 max-w-[44ch] text-[length:var(--step-lead)] leading-snug"
        style={{ ["--d" as string]: "300ms" }}
      >
        Вся линейка этого года: Neo, Air на M5 и новый Pro 14 с чипом M6. Оригинал, гарантия год,
        доставка по России.
      </p>
      <div className="fade-up mt-6 flex flex-wrap items-center justify-center gap-6" style={{ ["--d" as string]: "420ms" }}>
        <a href="#contact" className="btn">
          Оставить заявку
        </a>
        <a href="#models" className="link text-[length:var(--step-body)]">
          Смотреть модели
        </a>
      </div>
    </div>
  );

  // Без WebGL2 или при «уменьшить движение» — статичный кадр открытого ноутбука.
  if (capable === false) {
    return (
      <header id="top" className="relative pb-10">
        {header}
        {title}
        <div className="frame mt-10">
          <div className="relative mx-auto aspect-[4/3] max-w-4xl overflow-hidden rounded-[28px]">
            <Image
              src="/img/models/macbook-pro-14-inch-m5-space-black.jpg"
              alt="Открытый MacBook Pro 14"
              fill
              priority
              sizes="(max-width: 900px) 100vw, 900px"
              className="object-cover"
            />
          </div>
        </div>
      </header>
    );
  }

  return (
    <header id="top" ref={section} className="relative h-[250svh] md:h-[270svh]">
      <div className="sticky top-0 h-[100svh] overflow-hidden">
        {header}
        {title}
        <div className="absolute inset-0" aria-hidden>
          {capable ? (
            <HeroMacbookCanvas progress={progress} fontFamily={helloFont.style.fontFamily} lite={isLite()} />
          ) : null}
        </div>
        <p
          ref={cue}
          className="absolute inset-x-0 bottom-6 z-10 text-center text-[length:var(--step-small)] text-ink-soft"
        >
          Прокрутите вниз, чтобы открыть
        </p>
        {/* Подключает начертание «hello», чтобы canvas мог им рисовать */}
        <span className={`${helloFont.className} pointer-events-none absolute opacity-0`} aria-hidden>
          hello
        </span>
      </div>
    </header>
  );
}
