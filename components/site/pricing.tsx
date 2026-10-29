import Image from "next/image";
import { prices, formatRub } from "@/lib/models";
import { ScrollPanel } from "./scroll-panel";

export function Pricing() {
  return (
    <ScrollPanel id="prices" labelledBy="prices-h" className="px-5 py-14 md:px-14 md:py-24">
      <div className="grid gap-10 md:grid-cols-12 md:gap-6">
        <div className="md:col-span-3">
          <h2 id="prices-h" data-reveal className="font-display text-[length:var(--step-head)]">
            Цены
          </h2>
          <p data-reveal style={{ ["--i" as string]: 1 }} className="mt-6 text-ink">
            Новые, запечатанные, с гарантией год. Другие конфигурации и цвета привезём под заказ.
          </p>
          <figure data-slide="left" className="relative mt-10 aspect-[4/5] w-3/5 overflow-hidden rounded-[28px] md:w-full">
            <Image
              src="/img/working-lat-t-e-3583874642.jpg"
              alt="Ноутбук и чашка на столе поздним вечером"
              fill
              sizes="(max-width: 768px) 60vw, 25vw"
              className="photo object-cover"
            />
          </figure>
        </div>

        <div className="columns-1 gap-16 md:col-span-8 md:col-start-5 lg:columns-2">
          {prices.map((g, gi) => (
            <div key={g.name} data-reveal style={{ ["--i" as string]: gi }} className="mb-12 break-inside-avoid">
              <h3 className="text-[length:var(--step-lead)] font-semibold">{g.name}</h3>
              <ul className="mt-5 space-y-[22px]">
                {g.items.map((it) => (
                  <li key={it.config}>
                    <div className="flex items-baseline justify-between gap-4 text-[length:var(--step-body)]">
                      <span>{it.config}</span>
                      <span className="tabular whitespace-nowrap">{formatRub(it.price)} ₽</span>
                    </div>
                    <p className="mt-1 max-w-[36ch] text-[length:var(--step-small)] text-ink-soft">{it.note}</p>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>
    </ScrollPanel>
  );
}
