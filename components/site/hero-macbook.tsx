"use client";

import { Suspense, useEffect, useMemo, useRef, type MutableRefObject } from "react";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import * as THREE from "three";
import { RoomEnvironment } from "three/examples/jsm/environments/RoomEnvironment.js";
import {
  Macbook,
  MacbookLighting,
  easeInOut,
  lerp,
  ramp,
  smoothDamp,
} from "rigged-macbook-3d";
import { createHelloScreen } from "./hello-screen";

/*
 * Хореография по прогрессу прокрутки блока (0–1):
 *   0.00–0.04  ноутбук закрыт, ждёт первого движения колеса
 *   0.04–0.42  крышка открывается (плавная кривая, около 90% высоты экрана прокрутки)
 *   0.30–0.50  ноутбук разворачивается к зрителю и приближается
 *   после 0.42 на экране пишется «hello» (по времени, 2,2 с), блок держится до конца
 * Прокрутка не двигает крышку напрямую: за ней «следует» демпфер с ограничением скорости,
 * поэтому даже резкий рывок колесом открывает крышку не быстрее чем за ~1,2 с.
 * Кадры рисуются только пока что-то движется (frameloop="demand").
 */
const OPEN_FROM = 0.04;
const OPEN_TO = 0.42;
const SMOOTH_TIME = 0.35;
// Потолок скорости: 0.38 прогресса открытия / 0.32 ≈ 1,2 с — быстрее крышка не откроется даже от рывка.
const MAX_SPEED = 0.32; // прогресс в секунду
const HELLO_SECONDS = 2.2;

/** Корпус — светлый «серый космос»: на светлой странице читается как металл, а не чёрный силуэт. */
function finishBody(root: THREE.Object3D) {
  root.traverse((o) => {
    const mesh = o as THREE.Mesh;
    if (!mesh.isMesh) return;
    const mats = Array.isArray(mesh.material) ? mesh.material : [mesh.material];
    for (const m of mats) {
      const std = m as THREE.MeshStandardMaterial;
      if (!std || !("metalness" in std)) continue;
      if (!std.userData?.spaceBlack) continue;
      std.color.set("#9a9da2");
      std.metalness = 0.6;
      std.roughness = 0.34;
      std.envMapIntensity = 1.2;
      std.needsUpdate = true;
    }
  });
}

export type HeroProgress = {
  target: number;
  current: number;
  open: number;
  /** Виден ли первый экран; вне экрана сцена не анимируется, а сразу встаёт в итоговую позу. */
  visible: boolean;
  /** Ставит сцене в очередь новый кадр (её задаёт Scene); вызывается при прокрутке. */
  wake?: () => void;
  /** Вызывается после каждого кадра — для DOM-подписей поверх сцены. */
  onFrame?: () => void;
};

function Scene({ progress, fontFamily }: { progress: MutableRefObject<HeroProgress>; fontFamily: string }) {
  const group = useRef<THREE.Group>(null);
  const body = useRef<THREE.Group>(null);
  const vel = useRef({ current: 0 });
  const hello = useMemo(() => createHelloScreen(fontFamily), [fontFamily]);
  const helloStart = useRef<number | null>(null);
  const lastHello = useRef(-1);
  const warm = useRef(40);
  const { size, invalidate } = useThree();

  // Сцена рисуется только по запросу: прокрутка будит её, а пока что-то движется,
  // каждый кадр сам заказывает следующий. В покое — ноль кадров и ноль нагрузки.
  useEffect(() => {
    const state = progress.current;
    state.wake = invalidate;
    return () => {
      state.wake = undefined;
    };
  }, [invalidate, progress]);

  useEffect(() => {
    let alive = true;
    document.fonts?.load(`100px ${fontFamily}`).then(() => {
      if (!alive) return;
      hello.refreshFont();
      lastHello.current = -1;
      invalidate();
    });
    return () => {
      alive = false;
      hello.dispose();
    };
  }, [hello, fontFamily, invalidate]);

  useFrame((state, dt) => {
    const p = progress.current;
    p.current = smoothDamp(p.current, p.target, vel.current, SMOOTH_TIME, Math.min(dt, 0.05), MAX_SPEED);
    const settled =
      !p.visible || (Math.abs(p.current - p.target) < 1e-4 && Math.abs(vel.current.current) < 1e-4);
    if (settled) {
      p.current = p.target;
      vel.current.current = 0;
    }
    const open = easeInOut(ramp(p.current, OPEN_FROM, OPEN_TO));
    p.open = open;

    // «hello» начинается, когда крышка почти открыта, и дописывается по времени
    const now = state.clock.elapsedTime;
    if (open > 0.9 && helloStart.current === null) helloStart.current = now;
    if (open < 0.5) helloStart.current = null;
    const t = helloStart.current === null ? 0 : Math.min(1, (now - helloStart.current) / HELLO_SECONDS);
    // экран перерисовывается и грузится в видеокарту, только когда надпись меняется
    if (t !== lastHello.current) {
      hello.draw(t);
      lastHello.current = t;
    }
    const writing = p.visible && helloStart.current !== null && t < 1;

    p.onFrame?.();
    // первые кадры после появления сцены рисуем подряд: модель, текстура и окружение
    // готовятся в разные моменты, и без прогрева ноутбук мог не появиться до первой прокрутки
    if (warm.current > 0) warm.current -= 1;
    if (!settled || writing || warm.current > 0) state.invalidate();

    const turn = easeInOut(ramp(p.current, 0.28, 0.5));
    const g = group.current;
    if (g) {
      // на узких экранах ноутбук меньше, чтобы целиком помещаться по ширине
      const fit = Math.min(1, size.width / size.height / 1.25);
      g.rotation.x = lerp(0.5, 0.14, turn);
      g.rotation.y = lerp(-0.38, 0, turn);
      // открытый ноутбук шире закрытого в кадре, поэтому на телефоне ужимаем его сильнее
      const s = lerp(0.44 * Math.max(0.6, fit), 0.74 * Math.max(0.38, fit), turn);
      g.scale.setScalar(s);
      g.position.y = lerp(-0.55, 0.04, turn);
    }
  });

  return (
    <group ref={group}>
      <Macbook
        ref={body}
        onLoad={() => {
          if (body.current) finishBody(body.current);
          warm.current = 40;
          invalidate();
        }}
        modelSrc="/models/macbook-rigged.glb"
        screen={hello.texture}
        frameDriver={() => ({
          open: progress.current.open,
          brightness: ramp(progress.current.open, 0.35, 0.85),
        })}
      />
    </group>
  );
}

/** Светлая «комната» для отражений: металл и зеркальный логотип отражают её, а не чёрную пустоту. */
function RoomLight() {
  const { gl, scene, invalidate } = useThree();
  useEffect(() => {
    const pmrem = new THREE.PMREMGenerator(gl);
    const room = new RoomEnvironment();
    const env = pmrem.fromScene(room, 0.04).texture;
    scene.environment = env;
    scene.environmentIntensity = 0.9;
    invalidate();
    return () => {
      scene.environment = null;
      env.dispose();
      room.dispose();
      pmrem.dispose();
    };
  }, [gl, scene, invalidate]);
  return null;
}

export function HeroMacbookCanvas({
  progress,
  fontFamily,
  lite,
}: {
  progress: MutableRefObject<HeroProgress>;
  fontFamily: string;
  /** Слабое устройство: плотность пикселей 1 и без сглаживания — в разы меньше работы видеокарте. */
  lite: boolean;
}) {
  return (
    <Canvas
      frameloop="demand"
      camera={{ position: [0, 0, 6], fov: 32 }}
      dpr={lite ? 1 : [1, 1.5]}
      gl={{ antialias: !lite, alpha: true, powerPreference: "high-performance" }}
      onCreated={({ gl }) => {
        gl.toneMapping = THREE.ACESFilmicToneMapping;
        gl.toneMappingExposure = 1.05;
      }}
      style={{ position: "absolute", inset: 0 }}
    >
      {/* Свои лампы вместо пресета: дети MacbookLighting заменяют его целиком */}
      <MacbookLighting>
        <ambientLight intensity={0.35} />
        <directionalLight position={[4, 7, 6]} intensity={1.1} />
        <directionalLight position={[-6, 3, 2]} intensity={0.35} color="#eef2ff" />
      </MacbookLighting>
      <RoomLight />
      <Suspense fallback={null}>
        <Scene progress={progress} fontFamily={fontFamily} />
      </Suspense>
    </Canvas>
  );
}
