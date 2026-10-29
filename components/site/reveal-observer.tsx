"use client";

import { useEffect } from "react";

/** Один раз показывает элементы с data-reveal, когда они входят в экран. */
export function RevealObserver() {
  useEffect(() => {
    const pending = new Set(document.querySelectorAll<HTMLElement>("[data-reveal], [data-slide]"));
    const show = (el: HTMLElement) => {
      el.classList.add("is-in");
      pending.delete(el);
    };

    // IntersectionObserver может молчать (фоновая вкладка, быстрый скролл),
    // поэтому дублируем его простой проверкой положения при прокрутке.
    const check = () => {
      const limit = window.innerHeight * 0.92;
      for (const el of pending) {
        const r = el.getBoundingClientRect();
        if (r.top < limit) show(el);
      }
      if (!pending.size) cleanup();
    };

    const io =
      "IntersectionObserver" in window
        ? new IntersectionObserver(
            (entries) => {
              for (const e of entries) if (e.isIntersecting) show(e.target as HTMLElement);
            },
            { rootMargin: "0px 0px -8% 0px" },
          )
        : null;
    pending.forEach((el) => io?.observe(el));

    let last = 0;
    let trailing: ReturnType<typeof setTimeout> | undefined;
    const onScroll = () => {
      const now = Date.now();
      clearTimeout(trailing);
      if (now - last > 120) {
        last = now;
        check();
      } else {
        trailing = setTimeout(check, 140);
      }
    };
    const cleanup = () => {
      clearTimeout(trailing);
      io?.disconnect();
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", check);
    };

    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", check);
    check();
    return cleanup;
  }, []);
  return null;
}
