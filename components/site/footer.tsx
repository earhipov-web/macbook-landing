import { site } from "@/lib/models";

const credits = [
  { title: "MacBook Neo on display", by: "Seasider53", lic: "CC BY 4.0", url: "https://commons.wikimedia.org/wiki/File:MacBook_Neo_on_display.jpg" },
  { title: "MacBook Air (13-inch, M4, Silver)", by: "AzureSaturn", lic: "CC0", url: "https://commons.wikimedia.org/wiki/File:MacBook_Air_(13-inch,_M4,_Silver).jpg" },
  { title: "MacBook Air (15-inch, M4, Silver)", by: "AzureSaturn", lic: "CC0", url: "https://commons.wikimedia.org/wiki/File:MacBook_Air_(15-inch,_M4,_Silver).jpg" },
  { title: "MacBook Pro (14-inch, M5, Space Black)", by: "AzureSaturn", lic: "CC0", url: "https://commons.wikimedia.org/wiki/File:MacBook_Pro_(14-inch,_M5,_Space_Black).jpg" },
  { title: "MacBook Pro (16-inch, M4 Pro, Silver)", by: "AzureSaturn", lic: "CC0", url: "https://commons.wikimedia.org/wiki/File:MacBook_Pro_(16-inch,_M4_Pro,_Silver).jpg" },
  { title: "MacBook Air keyboard 1", by: "TheumasNL", lic: "CC BY-SA 4.0", url: "https://commons.wikimedia.org/wiki/File:MacBook_Air_keyboard_1.jpg" },
  { title: "Reading mail at night", by: "Jay Wennington", lic: "CC0", url: "https://commons.wikimedia.org/wiki/File:Reading_mail_at_night_(Unsplash).jpg" },
  { title: "Keyboard in dark", by: "The indian dev", lic: "CC BY-SA 4.0", url: "https://commons.wikimedia.org/wiki/File:Keyboard_in_dark.png" }, // в проекте — сжатая серая копия .jpg
  { title: "Working lat(t)e", by: "Kuba Bożanowski", lic: "CC BY 2.0", url: "https://commons.wikimedia.org/wiki/File:Working_lat(t)e_(3583874642).jpg" },
];

export function Footer() {
  return (
    <footer className="frame pb-8 pt-[14svh] text-[length:var(--step-small)] text-ink-soft">
      <div className="grid gap-2 md:grid-cols-[1fr_auto_1fr] md:items-baseline md:gap-6">
        <p>{site.name}: MacBook с гарантией</p>
        <nav aria-label="Нижнее меню" className="flex flex-wrap gap-6 text-ink">
          <a className="link" href="#models">Модели</a>
          <a className="link" href="#compare">Сравнение</a>
          <a className="link" href="#prices">Цены</a>
          <a className="link" href="#contact">Заявка</a>
        </nav>
        <p className="md:text-right">© 2026, данные о моделях по материалам Apple</p>
      </div>
      <p className="mt-6 max-w-[120ch] leading-relaxed">
        Фото:{" "}
        {credits.map((c, i) => (
          <span key={c.url}>
            <a className="link" href={c.url} target="_blank" rel="noopener noreferrer">
              «{c.title}»
            </a>
            , {c.by}, {c.lic}, Wikimedia Commons{i < credits.length - 1 ? "; " : "."}
          </span>
        ))}{" "}
        3D-модель:{" "}
        <a
          className="link"
          href="https://sketchfab.com/3d-models/macbook-pro-m3-16-inch-2024-8e34fc2b303144f78490007d91ff57c4"
          target="_blank"
          rel="noopener noreferrer"
        >
          «MacBook Pro M3 16-inch 2024»
        </a>
        , jackbaeten, CC BY 4.0; петля и перекраска — William Laverty (rigged-macbook-3d), корпус
        перекрашен в серебристый. Атмосферные снимки переведены в
        оттенки серого. MacBook — товарный знак Apple Inc.; сайт не связан с Apple.
      </p>
    </footer>
  );
}
