"use client";
import React, { useRef } from "react";
import {
  useScroll,
  useTransform,
  motion,
  MotionValue,
  useReducedMotion,
  useMotionValue,
  animate,
} from "framer-motion";

export const ContainerScroll = ({
  titleComponent,
  children,
}: {
  titleComponent: string | React.ReactNode;
  children: React.ReactNode;
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: containerRef,
  });
  const reduce = useReducedMotion();
  const [isMobile, setIsMobile] = React.useState(false);

  React.useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth <= 768);
    };
    checkMobile();
    window.addEventListener("resize", checkMobile);
    return () => {
      window.removeEventListener("resize", checkMobile);
    };
  }, []);

  const scaleDimensions = () => {
    return isMobile ? [0.9, 1] : [0.95, 1];
  };

  // Крышка вращается на петле у клавиатуры: при загрузке сама приоткрывается из закрытого
  // положения, остаток хода открывается прокруткой.
  const opening = useMotionValue(reduce ? 0 : -62);
  React.useEffect(() => {
    if (reduce) return;
    const controls = animate(opening, 0, { duration: 1.8, delay: 0.5, ease: [0.16, 1, 0.3, 1] });
    return () => controls.stop();
  }, [opening, reduce]);
  const scrolled = useTransform(scrollYProgress, [0, 0.35], reduce ? [0, 0] : [-28, 0]);
  const rotate = useTransform<number, number>([opening, scrolled], ([a, b]) => a + b);
  const scale = useTransform(scrollYProgress, [0, 0.35], scaleDimensions());
  const translate = useTransform(scrollYProgress, [0, 1], [0, -100]);

  return (
    <div
      className="h-[50rem] sm:h-[58rem] md:h-[64rem] lg:h-[76rem] flex items-start justify-center relative p-2 md:px-20"
      ref={containerRef}
    >
      <div
        className="pt-6 w-full relative md:pt-4"
        style={{
          perspective: "1400px",
          perspectiveOrigin: "50% 30%",
        }}
      >
        <Header translate={translate} titleComponent={titleComponent} />
        <motion.div
          style={{ scale, transformStyle: "preserve-3d" }}
          className="mx-auto mt-4 w-full max-w-4xl md:mt-0"
        >
          <Card rotate={rotate} translate={translate} scale={scale}>
            {children}
          </Card>
          <Keyboard />
        </motion.div>
      </div>
    </div>
  );
};

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const Header = ({ translate, titleComponent }: any) => {
  return (
    <motion.div
      style={{
        translateY: translate,
      }}
      className="div max-w-5xl mx-auto text-center"
    >
      {titleComponent}
    </motion.div>
  );
};

export const Card = ({
  rotate,
  children,
}: {
  rotate: MotionValue<number>;
  scale: MotionValue<number>;
  translate: MotionValue<number>;
  children: React.ReactNode;
}) => {
  return (
    <motion.div
      style={{
        rotateX: rotate,
        transformOrigin: "50% 100%",
        transformStyle: "preserve-3d",
      }}
      className="relative mx-auto aspect-[16/10.4] w-[92%]"
    >
      {/* лицевая сторона: экран */}
      <div
        className="absolute inset-0 rounded-[18px] border-[3px] border-[#6C6C6C] bg-[#1b1c1f] p-[1.6%] md:rounded-[30px] md:border-4"
        style={{ backfaceVisibility: "hidden" }}
      >
        <div className="relative h-full w-full overflow-hidden rounded-[10px] bg-zinc-900 md:rounded-2xl">
          {children}
        </div>
      </div>
      {/* обратная сторона крышки видна, пока ноутбук закрыт */}
      <div
        aria-hidden
        className="absolute inset-0 rounded-[18px] bg-[#2f3135] md:rounded-[30px]"
        style={{ transform: "rotateX(180deg)", backfaceVisibility: "hidden" }}
      >
        <div className="absolute inset-[6%] rounded-[14px] bg-[#34363b] md:rounded-[24px]" />
      </div>
    </motion.div>
  );
};

const rows = [
  [14, 1],
  [13, 1.6],
  [13, 1.6],
  [12, 2.2],
  [11, 2.8],
];

/** Корпус с клавиатурой и тачпадом, лежит в перспективе под крышкой. */
export const Keyboard = () => {
  return (
    // Обёртка задаёт видимую высоту корпуса: повёрнутая плоскость не занимает места в потоке.
    <div
      role="img"
      aria-label="Клавиатура и тачпад ноутбука"
      className="relative h-[16vw] max-h-[190px]"
      style={{ transformStyle: "preserve-3d" }}
    >
    <div
      className="absolute inset-x-0 top-0 mx-auto w-full"
      style={{ transform: "rotateX(72deg)", transformOrigin: "50% 0%" }}
    >
      <div className="aspect-[16/10.4] w-full rounded-b-[22px] rounded-t-[6px] bg-[#3a3c40] px-[6%] pt-[4%] md:rounded-b-[40px]">
        <div className="mx-auto flex w-[86%] flex-col gap-[1.1%] rounded-[10px] bg-[#232427] p-[1.4%]">
          {rows.map(([count, wide], r) => (
            <div key={r} className="flex gap-[1%]">
              {Array.from({ length: count }).map((_, k) => (
                <span
                  key={k}
                  className="aspect-square flex-1 rounded-[3px] bg-[#111214] md:rounded-[6px]"
                  style={k === count - 1 ? { flexGrow: wide } : undefined}
                />
              ))}
            </div>
          ))}
          <div className="flex gap-[1%]">
            {[1, 1, 1, 1.3, 6, 1.3, 1, 1.6].map((g, k) => (
              <span
                key={k}
                className="aspect-square flex-1 rounded-[3px] bg-[#111214] md:rounded-[6px]"
                style={{ flexGrow: g }}
              />
            ))}
          </div>
        </div>
        <div className="mx-auto mt-[4%] aspect-[16/9.5] w-[44%] rounded-[12px] bg-[#444649] md:rounded-[20px]" />
      </div>
    </div>
    </div>
  );
};
