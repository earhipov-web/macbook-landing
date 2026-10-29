import * as THREE from "three";

/**
 * Экран приветствия на canvas-текстуре: мягкий градиент и слово «hello»,
 * которое проявляется слева направо, будто его пишут от руки.
 * Фон и надпись рисуются один раз в отдельные холсты; кадр анимации — это
 * только две копии готовых картинок, без пересчёта градиентов и текста.
 */
export function createHelloScreen(fontFamily: string) {
  const W = 1600;
  const H = 1000;
  const make = () => {
    const c = document.createElement("canvas");
    c.width = W;
    c.height = H;
    return [c, c.getContext("2d")!] as const;
  };
  const [canvas, ctx] = make();
  const [bg, bctx] = make();
  const [word, wctx] = make();

  const texture = new THREE.CanvasTexture(canvas);
  texture.colorSpace = THREE.SRGBColorSpace;
  texture.anisotropy = 4;
  texture.generateMipmaps = false;
  texture.minFilter = THREE.LinearFilter;

  let wordBox = { left: 0, right: W };

  function paintBackground() {
    const g = bctx.createLinearGradient(0, 0, W, H);
    g.addColorStop(0, "#5f86b8");
    g.addColorStop(0.45, "#7fb3c9");
    g.addColorStop(1, "#c9b8dc");
    bctx.fillStyle = g;
    bctx.fillRect(0, 0, W, H);
    const blob = (x: number, y: number, r: number, c: string) => {
      const rg = bctx.createRadialGradient(x, y, 0, x, y, r);
      rg.addColorStop(0, c);
      rg.addColorStop(1, "rgba(255,255,255,0)");
      bctx.fillStyle = rg;
      bctx.fillRect(0, 0, W, H);
    };
    blob(W * 0.2, H * 0.85, H * 0.7, "rgba(160, 215, 200, 0.55)");
    blob(W * 0.85, H * 0.15, H * 0.6, "rgba(235, 200, 225, 0.5)");
  }

  function paintWord() {
    wctx.clearRect(0, 0, W, H);
    wctx.font = `${Math.round(H * 0.42)}px ${fontFamily}`;
    wctx.textAlign = "center";
    wctx.textBaseline = "middle";
    wctx.fillStyle = "#ffffff";
    wctx.shadowColor = "rgba(20, 40, 70, 0.25)";
    wctx.shadowBlur = 18;
    wctx.fillText("hello", W / 2, H * 0.5);
    const m = wctx.measureText("hello");
    wordBox = { left: W / 2 - m.width / 2 - 30, right: W / 2 + m.width / 2 + 45 };
  }

  /** t: 0 — пустой экран, 1 — слово написано целиком. */
  function draw(t: number) {
    ctx.drawImage(bg, 0, 0);
    if (t > 0) {
      // мягкая кривая «пера»: плавный разгон и плавный конец слова
      const k = Math.min(1, t);
      const eased = k < 0.5 ? 2 * k * k : 1 - Math.pow(-2 * k + 2, 2) / 2;
      const feather = 70;
      const x = wordBox.left + (wordBox.right - wordBox.left + feather * 2) * eased;
      const solid = Math.max(0, Math.min(W, x - feather));
      if (solid > 0) ctx.drawImage(word, 0, 0, solid, H, 0, 0, solid, H);
      // мягкий край пера — полупрозрачная полоса
      const edge = Math.max(0, Math.min(feather, W - solid));
      if (edge > 0) {
        ctx.globalAlpha = 0.5;
        ctx.drawImage(word, solid, 0, edge, H, solid, 0, edge, H);
        ctx.globalAlpha = 1;
      }
    }
    texture.needsUpdate = true;
  }

  paintBackground();
  paintWord();
  draw(0);

  return {
    texture,
    draw,
    /** Перерисовать надпись после загрузки шрифта. */
    refreshFont: () => paintWord(),
    dispose: () => texture.dispose(),
  };
}
