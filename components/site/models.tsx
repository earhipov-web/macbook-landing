import Image from "next/image";
import { models, formatRub } from "@/lib/models";
import { ScrollPanel } from "./scroll-panel";

export function Models() {
  return (
    <div id="models" className="scroll-mt-6">
      <ScrollPanel labelledBy="models-h" tone="plain" className="px-2 py-10 md:px-6 md:py-16">
        <div className="grid items-end gap-8 md:grid-cols-12 md:gap-6">
          <div className="md:col-span-5">
            <h2 id="models-h" data-reveal className="font-display text-[length:var(--step-head)]">
              Линейка 2026
            </h2>
            <p data-reveal style={{ ["--i" as string]: 1 }} className="mt-6 max-w-[42ch] text-[length:var(--step-lead)] leading-snug">
              Пять ноутбуков: от MacBook Neo для учёбы до MacBook Pro 16 для монтажа и 3D.
            </p>
          </div>
          <figure data-slide="right" className="relative aspect-[16/9] overflow-hidden rounded-[28px] md:col-span-7">
            <Image
              src="/img/macbook-air-keyboard-1.jpg"
              alt="Подсвеченная клавиатура MacBook Air в тёмной комнате"
              fill
              sizes="(max-width: 768px) 100vw, 58vw"
              className="photo object-cover"
            />
          </figure>
        </div>
      </ScrollPanel>

      <ol>
        {models.map((m, i) => {
          const flip = i % 2 === 1;
          return (
            <li key={m.id} id={`model-${m.id}`} className="scroll-mt-6">
              <ScrollPanel labelledBy={`${m.id}-h`} className="p-4 md:p-8">
                <div className="grid items-center gap-8 md:grid-cols-12 md:gap-10">
                  <figure
                    data-slide={flip ? "right" : "left"}
                    className={`md:col-span-7 ${flip ? "md:order-2" : ""}`}
                  >
                    <div className="relative aspect-[4/3] overflow-hidden rounded-[22px] md:rounded-[30px]">
                      <Image
                        src={m.photo.src}
                        alt={m.photo.alt}
                        fill
                        sizes="(max-width: 768px) 100vw, 58vw"
                        className="object-cover"
                      />
                    </div>
                  </figure>
                  <div className={`px-2 pb-6 md:col-span-5 md:pb-0 ${flip ? "md:order-1 md:pl-6" : "md:pr-6"}`}>
                    <h3 id={`${m.id}-h`} data-reveal className="font-display text-[length:var(--step-head)] leading-none">
                      {m.name}
                    </h3>
                    <p data-reveal style={{ ["--i" as string]: 1 }} className="mt-3 text-[length:var(--step-lead)] text-sky-deep">
                      {m.tagline}
                    </p>
                    <p data-reveal style={{ ["--i" as string]: 2 }} className="mt-6 max-w-[52ch]">
                      {m.description}
                    </p>
                    <dl data-reveal style={{ ["--i" as string]: 3 }} className="mt-8 grid grid-cols-3 gap-3">
                      {m.facts.map((f) => (
                        <div key={f.label} className="rounded-2xl bg-ground-3 px-3 py-3">
                          <dt className="text-[length:var(--step-small)] text-ink-soft">{f.label}</dt>
                          <dd className="mt-1 text-[length:var(--step-body)] font-semibold">{f.value}</dd>
                        </div>
                      ))}
                    </dl>
                    <div data-reveal style={{ ["--i" as string]: 4 }} className="mt-8 flex flex-wrap items-center gap-x-6 gap-y-3">
                      <p className="tabular text-[length:var(--step-lead)] font-semibold">от {formatRub(m.priceFrom)} ₽</p>
                      <a href="#contact" className="btn min-h-11 px-6">
                        Заказать
                      </a>
                      <a href={`#compare-${m.id}`} className="link">
                        Сравнить
                      </a>
                    </div>
                    {m.photo.note ? (
                      <p className="mt-6 text-[length:var(--step-small)] text-ink-soft">{m.photo.note}</p>
                    ) : null}
                  </div>
                </div>
              </ScrollPanel>
            </li>
          );
        })}
      </ol>
    </div>
  );
}

/** Пауза между секциями: одна фотография во всю ширину. */
export function NightPhoto() {
  return (
    <ScrollPanel tone="plain">
      <figure data-slide="left" className="relative h-[60svh] min-h-[380px] overflow-hidden rounded-[28px] md:rounded-[40px]">
        <Image
          src="/img/reading-mail-at-night-unsplash.jpg"
          alt="Открытый ноутбук светится на кровати в тёмной комнате"
          fill
          sizes="100vw"
          className="photo drift object-cover"
        />
        <figcaption className="absolute bottom-5 left-5 max-w-[40ch] rounded-2xl bg-black/45 px-4 py-3 text-[length:var(--step-small)] text-[#f2f3f1] md:bottom-8 md:left-8">
          Ночная смена: экран без бликов, тихая клавиатура и батарея, которой хватает до утра.
        </figcaption>
      </figure>
    </ScrollPanel>
  );
}
