"use client";

import Image from "next/image";
import { useEffect, useState } from "react";
import { ChevronDown } from "lucide-react";
import { ScrollPanel } from "./scroll-panel";
import { models, specLabels, formatRub, type ModelId, type SpecKey } from "@/lib/models";

const keys = Object.keys(specLabels) as SpecKey[];
const byId = (id: ModelId) => models.find((m) => m.id === id)!;

function Picker({
  label,
  value,
  onChange,
}: {
  label: string;
  value: ModelId;
  onChange: (v: ModelId) => void;
}) {
  return (
    <label className="block">
      <span className="text-[length:var(--step-small)] text-ink-soft">{label}</span>
      <span className="relative mt-2 block">
        <select
          value={value}
          onChange={(e) => onChange(e.target.value as ModelId)}
          className="block w-full cursor-pointer appearance-none truncate rounded-2xl bg-ground-3 py-3 pl-4 pr-9 text-[length:var(--step-body)] text-ink transition-colors hover:bg-[#d0d2d0] md:pl-5 md:text-[length:var(--step-lead)]"
        >
          {models.map((m) => (
            <option key={m.id} value={m.id}>
              {m.name}
            </option>
          ))}
        </select>
        <ChevronDown aria-hidden className="pointer-events-none absolute right-3 top-1/2 size-5 -translate-y-1/2 text-ink-soft" />
      </span>
    </label>
  );
}

export function Compare() {
  const [a, setA] = useState<ModelId>("air13");
  const [b, setB] = useState<ModelId>("pro14");

  // Ссылка «Сравнить» у модели ставит её в левую колонку.
  useEffect(() => {
    const apply = () => {
      const m = window.location.hash.match(/^#compare-(\w+)$/);
      const id = m?.[1] as ModelId | undefined;
      if (!id || !models.some((x) => x.id === id)) return;
      setA(id);
      setB((prev) => (prev === id ? (id === "pro14" ? "air13" : "pro14") : prev));
      document.getElementById("compare")?.scrollIntoView({ behavior: "smooth" });
    };
    apply();
    window.addEventListener("hashchange", apply);
    return () => window.removeEventListener("hashchange", apply);
  }, []);

  const A = byId(a);
  const B = byId(b);

  return (
    <ScrollPanel id="compare" labelledBy="compare-h" className="px-5 py-14 md:px-14 md:py-24">
      <div className="grid gap-10 md:grid-cols-12 md:gap-6">
        <div className="md:col-span-4">
          <h2 id="compare-h" data-reveal className="font-display text-[length:var(--step-head)]">
            Сравнить модели
          </h2>
          <p data-reveal style={{ ["--i" as string]: 1 }} className="mt-6 max-w-[36ch]">
            Выберите два MacBook. Строки, где они отличаются, выделены жирным.
          </p>
          <figure data-slide="left" className="relative mt-10 hidden aspect-[4/5] overflow-hidden rounded-[28px] md:block">
            <Image
              src="/img/keyboard-in-dark.jpg"
              alt="Клавиши с подсветкой крупным планом"
              fill
              sizes="30vw"
              className="photo object-cover"
            />
          </figure>
        </div>

        <div className="md:col-span-8">
          <div className="grid grid-cols-2 gap-4 md:gap-6">
            <Picker label="Первая модель" value={a} onChange={setA} />
            <Picker label="Вторая модель" value={b} onChange={setB} />
          </div>

          <table className="mt-8 w-full border-collapse text-left">
            <caption className="sr-only">
              Характеристики {A.name} и {B.name}
            </caption>
            <thead className="sr-only">
              <tr>
                <th scope="col">Параметр</th>
                <th scope="col">{A.name}</th>
                <th scope="col">{B.name}</th>
              </tr>
            </thead>
            <tbody>
              {keys.map((k) => {
                const same = A.specs[k] === B.specs[k];
                return (
                  <tr key={k} className="border-b border-ground-3 align-top" /* taste-skill-ignore: строки настоящей таблицы */>
                    <th
                      scope="row"
                      className="block pt-4 text-[length:var(--step-small)] font-normal text-ink-soft md:table-cell md:w-[22%] md:py-4"
                    >
                      {specLabels[k]}
                    </th>
                    {[A, B].map((m) => (
                      <td
                        key={m.id + k}
                        className={`inline-block w-1/2 pb-4 pr-4 pt-1 align-top md:table-cell md:w-[39%] md:py-4 ${
                          same ? "text-ink-soft" : "font-semibold text-ink"
                        }`}
                      >
                        {m.specs[k]}
                      </td>
                    ))}
                  </tr>
                );
              })}
              <tr className="align-top">
                <th scope="row" className="block pt-4 text-[length:var(--step-small)] font-normal text-ink-soft md:table-cell md:py-5">
                  Цена
                </th>
                {[A, B].map((m) => (
                  <td key={m.id + "price"} className="tabular inline-block w-1/2 pt-1 text-[length:var(--step-lead)] font-semibold md:table-cell md:py-5">
                    от {formatRub(m.priceFrom)} ₽
                  </td>
                ))}
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </ScrollPanel>
  );
}
