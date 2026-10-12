"use client";

import { useMemo, useRef } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import * as THREE from "three";

// A field of 3D candlesticks receding to the horizon, with the prior-day-high
// level drawn as a glowing plane the copilot is "proposing".
const ROWS = 9;
const COLS = 46;
const UP = new THREE.Color("#5AA9FF");
const DOWN = new THREE.Color("#FF9F43");
const LEVEL_Y = 2.35;

function seeded(seed) {
  let s = seed;
  return () => {
    s = (s * 16807) % 2147483647;
    return (s - 1) / 2147483646;
  };
}

function useCandles() {
  return useMemo(() => {
    const rand = seeded(11);
    const items = [];
    for (let r = 0; r < ROWS; r++) {
      let price = 0.4 + rand() * 0.4;
      for (let c = 0; c < COLS; c++) {
        const open = price;
        let close = open + (rand() - 0.46) * 0.42 + (c < COLS * 0.6 ? 0.035 : -0.012);
        close = Math.min(close, LEVEL_Y - 0.25 - rand() * 0.2);
        close = Math.max(close, -0.6);
        const high = Math.min(Math.max(open, close) + rand() * 0.18, LEVEL_Y - 0.08);
        const low = Math.min(open, close) - rand() * 0.18;
        items.push({ r, c, open, close, high, low, up: close >= open, phase: rand() * Math.PI * 2 });
        price = close;
      }
    }
    return items;
  }, []);
}

function Candles({ animate }) {
  const bodies = useRef();
  const wicks = useRef();
  const candles = useCandles();
  const dummy = useMemo(() => new THREE.Object3D(), []);
  const spacing = 0.34;
  const rowGap = 1.15;

  const place = (t) => {
    candles.forEach((k, i) => {
      const x = (k.c - COLS / 2) * spacing;
      const z = -k.r * rowGap;
      const breathe = animate ? Math.sin(t * 0.6 + k.phase) * 0.04 : 0;
      const top = Math.max(k.open, k.close) + breathe;
      const bottom = Math.min(k.open, k.close);
      const h = Math.max(0.04, top - bottom);
      dummy.position.set(x, bottom + h / 2, z);
      dummy.scale.set(0.2, h, 0.2);
      dummy.updateMatrix();
      bodies.current.setMatrixAt(i, dummy.matrix);

      const wh = k.high - k.low;
      dummy.position.set(x, k.low + wh / 2, z);
      dummy.scale.set(0.035, wh, 0.035);
      dummy.updateMatrix();
      wicks.current.setMatrixAt(i, dummy.matrix);
    });
    bodies.current.instanceMatrix.needsUpdate = true;
    wicks.current.instanceMatrix.needsUpdate = true;
  };

  const ready = useRef(false);
  useFrame(({ clock }) => {
    if (!bodies.current || !wicks.current) return;
    if (!ready.current) {
      candles.forEach((k, i) => {
        const fade = 1 - k.r / (ROWS + 2);
        const col = (k.up ? UP : DOWN).clone().multiplyScalar(0.35 + 0.65 * fade);
        bodies.current.setColorAt(i, col);
        wicks.current.setColorAt(i, col);
      });
      bodies.current.instanceColor.needsUpdate = true;
      wicks.current.instanceColor.needsUpdate = true;
      place(0);
      ready.current = true;
    }
    if (animate) place(clock.elapsedTime);
  });

  return (
    <group>
      <instancedMesh ref={bodies} args={[undefined, undefined, candles.length]}>
        <boxGeometry args={[1, 1, 1]} />
        <meshStandardMaterial roughness={0.35} metalness={0.25} emissiveIntensity={0.25} toneMapped={false} />
      </instancedMesh>
      <instancedMesh ref={wicks} args={[undefined, undefined, candles.length]}>
        <boxGeometry args={[1, 1, 1]} />
        <meshStandardMaterial roughness={0.6} toneMapped={false} />
      </instancedMesh>
    </group>
  );
}

function LevelPlane({ animate }) {
  const mat = useRef();
  const line = useRef();
  useFrame(({ clock }) => {
    if (!animate || !mat.current) return;
    const t = clock.elapsedTime;
    mat.current.opacity = 0.07 + Math.sin(t * 1.4) * 0.025;
    if (line.current) line.current.opacity = 0.75 + Math.sin(t * 1.4) * 0.2;
  });
  return (
    <group position={[0, LEVEL_Y, -4.2]}>
      <mesh rotation={[-Math.PI / 2, 0, 0]}>
        <planeGeometry args={[17, 11]} />
        <meshBasicMaterial ref={mat} color="#8C9BFF" transparent opacity={0.08} side={THREE.DoubleSide} depthWrite={false} />
      </mesh>
      <mesh position={[0, 0, 5.4]}>
        <boxGeometry args={[17, 0.018, 0.018]} />
        <meshBasicMaterial ref={line} color="#AEB8FF" transparent opacity={0.85} />
      </mesh>
    </group>
  );
}

function Rig({ animate }) {
  useFrame(({ camera, pointer }) => {
    const tx = animate ? pointer.x * 0.9 : 0;
    const ty = animate ? 1.9 + pointer.y * 0.35 : 1.9;
    camera.position.x += (tx + 1.6 - camera.position.x) * 0.04;
    camera.position.y += (ty - camera.position.y) * 0.04;
    camera.lookAt(0.6, 1.2, -4);
  });
  return null;
}

export default function HeroScene({ animate = true }) {
  return (
    <Canvas
      dpr={[1, 1.75]}
      camera={{ position: [1.6, 1.9, 5.2], fov: 46, near: 0.1, far: 60 }}
      gl={{ antialias: true, alpha: true, powerPreference: "high-performance" }}
      frameloop={animate ? "always" : "demand"}
      aria-hidden="true"
    >
      <fog attach="fog" args={["#070B14", 6, 17]} />
      <ambientLight intensity={0.5} />
      <directionalLight position={[4, 6, 5]} intensity={1.4} color="#DDE3FF" />
      <pointLight position={[-3, 3, 2]} intensity={6} color="#8C9BFF" distance={12} />
      <Candles animate={animate} />
      <LevelPlane animate={animate} />
      <gridHelper args={[30, 60, "#1F2A41", "#121a2b"]} position={[0, -0.7, -4]} />
      <Rig animate={animate} />
    </Canvas>
  );
}
