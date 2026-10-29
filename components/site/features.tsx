"use client";

import { useState } from "react";
import { ScrollPanel } from "./scroll-panel";

type Item = { name: string; text: string };
type Group = { name: string; summary: string; items: Item[] };

const groups: Group[] = [
  {
    name: "Чип Apple",
    summary: "От бесшумного M5 в Air до M5 Max с 40 ядрами графики.",
    items: [
      { name: "M6: 12 ядер CPU", text: "Два «суперъядра», четыре производительных и шесть энергоэффективных в новом Pro 14." },
      { name: "Графика до 30% быстрее", text: "12-ядерный GPU M6 против M5 в том же корпусе Pro 14." },
      { name: "До 40 ядер графики", text: "M5 Max в Pro 14 и Pro 16: 3D, монтаж 8K и локальные нейросети." },
      { name: "До 128 ГБ памяти", text: "Единая память M5 Max: большие проекты и модели целиком в ОЗУ." },
      { name: "Air без вентилятора", text: "MacBook Air и Neo работают в полной тишине при любой нагрузке." },
      { name: "Нейросети на устройстве", text: "Нейронный движок обрабатывает фото, речь и текст прямо на ноутбуке." },
    ],
  },
  {
    name: "Экран",
    summary: "Mini-LED и 120 Гц у Pro, широкий цвет P3 у Air.",
    items: [
      { name: "Liquid Retina XDR", text: "Mini-LED у Pro 14 и Pro 16: 1000 нит в SDR и 1600 нит в HDR." },
      { name: "ProMotion 120 Гц", text: "Плавная прокрутка и анимации на обоих MacBook Pro." },
      { name: "Нано-текстура", text: "Матовое стекло для Pro по заказу: меньше бликов у окна и под лампой." },
      { name: "Цвет P3 и True Tone", text: "У Air и Pro фото и видео выглядят так, как были сняты." },
      { name: "500 нит у Air и Neo", text: "Достаточно яркости для работы днём у окна." },
    ],
  },
  {
    name: "Каждый день",
    summary: "До 24 часов без розетки, MagSafe, Wi-Fi 7 и связка с iPhone.",
    items: [
      { name: "До 24 часов работы", text: "MacBook Pro 14 и 16 по данным Apple при просмотре видео." },
      { name: "MagSafe 3", text: "Магнитная зарядка у Air и Pro: порты USB-C остаются свободными." },
      { name: "Thunderbolt 5", text: "Три порта у Pro: быстрые диски и мониторы без переходников." },
      { name: "Wi-Fi 7 и Bluetooth 6", text: "Новый беспроводной стандарт в Air M5 и Pro 14 M6." },
      { name: "Связка с iPhone", text: "AirDrop, звонки, общий буфер обмена и экран iPhone на Mac." },
      { name: "Долгая жизнь", text: "MacBook годами получает обновления macOS и хорошо держит цену." },
    ],
  },
];

export function Features() {
  const [active, setActive] = useState<Item>(groups[0].items[0]);

  return (
    <ScrollPanel id="why" labelledBy="why-h" className="px-6 py-14 md:px-14 md:py-24">
      <h2 id="why-h" data-reveal className="font-display text-[length:var(--step-head)]">
        Почему MacBook
      </h2>

      <div className="mt-12 grid grid-cols-1 gap-10 sm:grid-cols-3 sm:gap-x-6 md:mt-24 lg:grid-cols-12">
        {groups.map((g, gi) => (
          <div key={g.name} data-reveal style={{ ["--i" as string]: gi + 1 }} className="lg:col-span-3">
            <h3 className="text-[length:var(--step-body)] font-semibold text-ink">{g.name}</h3>
            <ul className="mt-6 space-y-2.5 md:space-y-1.5">
              {g.items.map((it) => (
                <li key={it.name}>
                  <button
                    type="button"
                    onMouseEnter={() => setActive(it)}
                    onFocus={() => setActive(it)}
                    onClick={() => setActive(it)}
                    aria-pressed={active.name === it.name}
                    className={`text-left text-[length:var(--step-body)] leading-tight text-ink transition-colors duration-200 hover:text-ink ${
                      active.name === it.name ? "lg:text-ink" : "lg:text-ink-soft"
                    }`}
                  >
                    {it.name}
                  </button>
                </li>
              ))}
            </ul>
            <p className="mt-5 text-ink-soft lg:hidden">{g.summary}</p>
          </div>
        ))}

        <div className="hidden lg:col-span-3 lg:block" aria-live="polite">
          <div className="rounded-3xl bg-ground-3 p-6">
            <p className="text-[length:var(--step-body)] font-semibold">{active.name}</p>
            <p className="mt-3 text-ink">{active.text}</p>
          </div>
        </div>
      </div>
    </ScrollPanel>
  );
}
