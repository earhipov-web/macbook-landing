// Каталог и характеристики. Цены в рублях — образец, замените своими перед запуском.

export type ModelId = "neo" | "air13" | "air15" | "pro14" | "pro16";

export type Model = {
  id: ModelId;
  name: string;
  chip: string;
  tagline: string;
  description: string;
  priceFrom: number;
  /** Реальная фотография с Wikimedia Commons; note — подпись, если на снимке прошлое поколение */
  photo: { src: string; alt: string; note?: string };
  facts: { label: string; value: string }[];
  specs: Record<SpecKey, string>;
};

export type SpecKey =
  | "chip"
  | "cpu"
  | "gpu"
  | "memory"
  | "storage"
  | "display"
  | "brightness"
  | "refresh"
  | "battery"
  | "ports"
  | "external"
  | "wireless"
  | "cooling"
  | "released";

export const specLabels: Record<SpecKey, string> = {
  chip: "Чип",
  cpu: "Процессор",
  gpu: "Графика",
  memory: "Память",
  storage: "Накопитель",
  display: "Экран",
  brightness: "Яркость",
  refresh: "Частота",
  battery: "Автономность",
  ports: "Порты",
  external: "Внешние мониторы",
  wireless: "Беспроводная связь",
  cooling: "Охлаждение",
  released: "Вышел",
};

export const models: Model[] = [
  {
    id: "neo",
    name: "MacBook Neo",
    chip: "A18 Pro",
    tagline: "Первый MacBook за разумные деньги",
    description:
      "Новая модель 2026 года на чипе A18 Pro. Для учёбы, почты, браузера и фильмов. Лёгкий, тихий, держит 16 часов. У базовой версии нет подсветки клавиатуры и Touch ID.",
    priceFrom: 69990,
    photo: {
      src: "/img/models/macbook-neo-on-display.jpg",
      alt: "MacBook Neo цвета Citrus с обоями macOS на столе в магазине",
    },
    facts: [
      { label: "Экран", value: "13″, 500 нит" },
      { label: "Батарея", value: "до 16 часов" },
      { label: "Память", value: "8 ГБ, 256 ГБ" },
    ],
    specs: {
      chip: "A18 Pro",
      cpu: "6 ядер",
      gpu: "5 ядер",
      memory: "8 ГБ",
      storage: "256 или 512 ГБ",
      display: "13″ Liquid Retina, sRGB",
      brightness: "500 нит",
      refresh: "60 Гц",
      battery: "до 16 часов",
      ports: "2 × USB-C (USB 3 и USB 2)",
      external: "1, до 4K 60 Гц",
      wireless: "Wi-Fi, Bluetooth",
      cooling: "Без вентилятора",
      released: "Март 2026",
    },
  },
  {
    id: "air13",
    name: "MacBook Air 13",
    chip: "M5",
    tagline: "Самый сбалансированный MacBook",
    description:
      "Чип M5, 16 ГБ памяти и 512 ГБ в базе. Без вентилятора, поэтому всегда беззвучный. Весит 1,24 кг и работает до 18 часов. Лучший выбор для работы, учёбы и поездок.",
    priceFrom: 119990,
    photo: {
      src: "/img/models/macbook-air-13-inch-m4-silver.jpg",
      alt: "Серебристый MacBook Air 13 с обоями macOS Tahoe",
      note: "На фото Air 13 на M4: корпус у M5 тот же",
    },
    facts: [
      { label: "Вес", value: "1,24 кг" },
      { label: "Батарея", value: "до 18 часов" },
      { label: "Память", value: "16 ГБ, 512 ГБ" },
    ],
    specs: {
      chip: "M5",
      cpu: "10 ядер",
      gpu: "до 10 ядер",
      memory: "16–32 ГБ",
      storage: "512 ГБ – 4 ТБ",
      display: "13,6″ Liquid Retina, P3, True Tone",
      brightness: "500 нит",
      refresh: "60 Гц",
      battery: "до 18 часов",
      ports: "2 × Thunderbolt 4, MagSafe 3",
      external: "до 2",
      wireless: "Wi-Fi 7, Bluetooth 6",
      cooling: "Без вентилятора",
      released: "Март 2026",
    },
  },
  {
    id: "air15",
    name: "MacBook Air 15",
    chip: "M5",
    tagline: "Большой экран без тяжёлого корпуса",
    description:
      "Та же начинка, что у Air 13, но экран 15,3 дюйма и батарея 66,5 Вт·ч. Удобно держать две программы рядом, смотреть кино и работать с таблицами.",
    priceFrom: 139990,
    photo: {
      src: "/img/models/macbook-air-15-inch-m4-silver.jpg",
      alt: "Серебристый MacBook Air 15 с обоями macOS Tahoe",
      note: "На фото Air 15 на M4: корпус у M5 тот же",
    },
    facts: [
      { label: "Экран", value: "15,3″, P3" },
      { label: "Батарея", value: "до 18 часов" },
      { label: "Память", value: "16 ГБ, 512 ГБ" },
    ],
    specs: {
      chip: "M5",
      cpu: "10 ядер",
      gpu: "до 10 ядер",
      memory: "16–32 ГБ",
      storage: "512 ГБ – 4 ТБ",
      display: "15,3″ Liquid Retina, P3, True Tone",
      brightness: "500 нит",
      refresh: "60 Гц",
      battery: "до 18 часов",
      ports: "2 × Thunderbolt 4, MagSafe 3",
      external: "до 2",
      wireless: "Wi-Fi 7, Bluetooth 6",
      cooling: "Без вентилятора",
      released: "Март 2026",
    },
  },
  {
    id: "pro14",
    name: "MacBook Pro 14",
    chip: "M6",
    tagline: "Новинка ноября: чип M6",
    description:
      "Показан 27 октября 2026 года, отгрузки с 6 ноября. 12 ядер CPU, графика до 30% быстрее M5, Wi-Fi 7 через новый чип N1 и до 24 часов работы. Для тех, кому нужно больше, есть версии на M5 Pro и M5 Max.",
    priceFrom: 189990,
    photo: {
      src: "/img/models/macbook-pro-14-inch-m5-space-black.jpg",
      alt: "MacBook Pro 14 цвета «космический чёрный» с обоями macOS Tahoe",
      note: "На фото Pro 14 на M5: у M6 корпус и экран те же",
    },
    facts: [
      { label: "Экран", value: "XDR, 120 Гц" },
      { label: "Батарея", value: "до 24 часов" },
      { label: "Память", value: "16 ГБ, 1 ТБ" },
    ],
    specs: {
      chip: "M6 (по заказу M5 Pro, M5 Max)",
      cpu: "12 ядер (M5 Pro и Max — до 18)",
      gpu: "12 ядер (M5 Max — до 40)",
      memory: "16–32 ГБ (M5 Max — до 128 ГБ)",
      storage: "1–4 ТБ (M5 Max — до 8 ТБ)",
      display: "14,2″ Liquid Retina XDR, mini-LED",
      brightness: "1000 нит SDR, 1600 нит HDR",
      refresh: "до 120 Гц, ProMotion",
      battery: "до 24 часов",
      ports: "3 × Thunderbolt 5, HDMI, SDXC, MagSafe 3",
      external: "до 2 (M5 Max — до 4)",
      wireless: "Wi-Fi 7, Bluetooth 6 (чип N1)",
      cooling: "Активное",
      released: "Ноябрь 2026",
    },
  },
  {
    id: "pro16",
    name: "MacBook Pro 16",
    chip: "M5 Pro, M5 Max",
    tagline: "Мастерская на коленях",
    description:
      "Самый большой экран и самая ёмкая батарея линейки, 100 Вт·ч. До 18 ядер CPU и 40 ядер графики, до 128 ГБ памяти. Монтаж 8K, 3D, музыка и нейросети без компромиссов.",
    priceFrom: 299990,
    photo: {
      src: "/img/models/macbook-pro-16-inch-m4-pro-silver.jpg",
      alt: "Серебристый MacBook Pro 16 с обоями macOS Tahoe",
      note: "На фото Pro 16 на M4 Pro: корпус у M5 Pro и M5 Max тот же",
    },
    facts: [
      { label: "Графика", value: "до 40 ядер" },
      { label: "Батарея", value: "до 24 часов" },
      { label: "Память", value: "до 128 ГБ" },
    ],
    specs: {
      chip: "M5 Pro или M5 Max",
      cpu: "до 18 ядер",
      gpu: "до 20 (Pro) или до 40 ядер (Max)",
      memory: "24–128 ГБ",
      storage: "1–8 ТБ",
      display: "16,2″ Liquid Retina XDR, mini-LED",
      brightness: "1000 нит SDR, 1600 нит HDR",
      refresh: "до 120 Гц, ProMotion",
      battery: "до 24 часов",
      ports: "3 × Thunderbolt 5, HDMI, SDXC, MagSafe 3",
      external: "до 4 (M5 Max)",
      wireless: "Wi-Fi 7, Bluetooth 6",
      cooling: "Активное",
      released: "Март 2026",
    },
  },
];

export type PriceGroup = {
  name: string;
  items: { config: string; note: string; price: number }[];
};

export const prices: PriceGroup[] = [
  {
    name: "MacBook Neo",
    items: [
      { config: "A18 Pro, 8 ГБ, 256 ГБ", note: "Базовая версия, без подсветки клавиатуры", price: 69990 },
      { config: "A18 Pro, 8 ГБ, 512 ГБ", note: "С Touch ID и подсветкой клавиатуры", price: 82990 },
    ],
  },
  {
    name: "MacBook Air 13",
    items: [
      { config: "M5, 16 ГБ, 512 ГБ", note: "Хватит для работы и учёбы на годы", price: 119990 },
      { config: "M5, 24 ГБ, 1 ТБ", note: "Для фото, кода и десятков вкладок", price: 149990 },
    ],
  },
  {
    name: "MacBook Air 15",
    items: [
      { config: "M5, 16 ГБ, 512 ГБ", note: "Большой экран, та же тишина", price: 139990 },
      { config: "M5, 32 ГБ, 1 ТБ", note: "Максимальная память для Air", price: 179990 },
    ],
  },
  {
    name: "MacBook Pro 14",
    items: [
      { config: "M6, 16 ГБ, 1 ТБ", note: "Новинка, отгрузки с 6 ноября", price: 189990 },
      { config: "M6, 32 ГБ, 1 ТБ", note: "Быстрая память 170 ГБ/с", price: 229990 },
      { config: "M5 Pro, 24 ГБ, 1 ТБ", note: "До 18 ядер CPU", price: 239990 },
      { config: "M5 Max, 36 ГБ, 2 ТБ", note: "До 40 ядер графики", price: 349990 },
    ],
  },
  {
    name: "MacBook Pro 16",
    items: [
      { config: "M5 Pro, 24 ГБ, 1 ТБ", note: "Большой экран и батарея 100 Вт·ч", price: 299990 },
      { config: "M5 Max, 36 ГБ, 2 ТБ", note: "Для 8K, 3D и нейросетей", price: 419990 },
    ],
  },
];

export const formatRub = (n: number) =>
  new Intl.NumberFormat("ru-RU", { maximumFractionDigits: 0 }).format(n).replace(/ /g, " ");

export const site = {
  name: "Графит",
  telegram: "grafit_mac",
  phone: "+7 900 000-00-00",
  city: "Москва",
};
