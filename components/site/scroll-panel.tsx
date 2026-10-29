"use client";

import { useEffect, useRef, useState, type ReactNode } from "react";
import { motion, useReducedMotion, useScroll, useTransform } from "framer-motion";

/**
 * Секция-панель с тем же эффектом, что у ноутбука на первом экране:
 * въезжает снизу с наклоном назад и выпрямляется, пока поднимается к середине экрана.
 */
export function ScrollPanel({
  id,
  labelledBy,
  tone = "light",
  className = "",
  children,
}: {
  id?: string;
  labelledBy?: string;
  tone?: "light" | "plain" | "dark";
  className?: string;
  children: ReactNode;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const reduceMotion = useReducedMotion();
  // На слабых устройствах наклон отключаем: семь больших 3D-слоёв с фото — заметная нагрузка на видеокарту.
  const [lite, setLite] = useState(false);
  useEffect(() => setLite(document.documentElement.classList.contains("lite")), []);
  const reduce = reduceMotion || lite;
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start end", "start 0.3"] });
  const rotateX = useTransform(scrollYProgress, [0, 1], [22, 0]);
  const scale = useTransform(scrollYProgress, [0, 1], [0.9, 1]);
  const y = useTransform(scrollYProgress, [0, 1], [90, 0]);

  const surface =
    tone === "dark"
      ? "bg-paper text-paper-ink"
      : tone === "plain"
        ? ""
        : "bg-ground-2";

  return (
    <div ref={ref} className="frame py-[clamp(20px,3vw,40px)]" style={reduce ? undefined : { perspective: "1400px" }}>
      <motion.section
        id={id}
        aria-labelledby={labelledBy}
        style={reduce ? undefined : { rotateX, scale, y, transformOrigin: "50% 0%" }}
        className={`scroll-mt-6 rounded-[28px] md:rounded-[40px] ${surface} ${className}`}
      >
        {children}
      </motion.section>
    </div>
  );
}
