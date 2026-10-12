"use client";

import dynamic from "next/dynamic";
import { useEffect, useState } from "react";

const HeroScene = dynamic(() => import("./HeroScene"), { ssr: false });

function hasWebGL() {
  try {
    const c = document.createElement("canvas");
    return !!(window.WebGLRenderingContext && (c.getContext("webgl2") || c.getContext("webgl")));
  } catch {
    return false;
  }
}

export default function Hero3D() {
  const [mode, setMode] = useState("pending"); // pending | 3d | fallback
  const [animate, setAnimate] = useState(true);

  useEffect(() => {
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    setAnimate(!mq.matches);
    setMode(hasWebGL() ? "3d" : "fallback");
    const onChange = (e) => setAnimate(!e.matches);
    mq.addEventListener("change", onChange);
    return () => mq.removeEventListener("change", onChange);
  }, []);

  return (
    <div className="hero-scene">
      <div className="hero-fallback" />
      {mode === "3d" && <HeroScene animate={animate} />}
    </div>
  );
}
