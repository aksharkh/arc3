"use client";

import { useEffect, useRef, useState } from "react";
import { Canvas } from "@react-three/fiber";
import { Environment, Lightformer, Sparkles } from "@react-three/drei";
import WaveField from "./WaveField";
import Knot from "./Knot";

/** Pauses rendering while the canvas is off-screen. */
function useInView<T extends Element>() {
  const ref = useRef<T>(null);
  const [inView, setInView] = useState(true);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const io = new IntersectionObserver(([e]) => setInView(e.isIntersecting), { rootMargin: "100px" });
    io.observe(el);
    return () => io.disconnect();
  }, []);
  return [ref, inView] as const;
}

function Studio() {
  return (
    <Environment resolution={256} frames={1}>
      <color attach="background" args={["#2a1c08"]} />
      <Lightformer intensity={4} color="#fff1d0" position={[0, 5, -2]} rotation-x={Math.PI / 2} scale={[10, 3, 1]} />
      <Lightformer intensity={3} color="#ffffff" position={[-5, 1, 1]} rotation-y={Math.PI / 2} scale={[8, 1.4, 1]} />
      <Lightformer intensity={2.6} color="#ffe3a3" position={[5, -1, 1]} rotation-y={-Math.PI / 2} scale={[8, 1, 1]} />
      <Lightformer intensity={1.2} color="#ffd98a" position={[0, -4, 2]} rotation-x={-Math.PI / 2} scale={[10, 4, 1]} />
      <Lightformer form="ring" intensity={5} color="#ffffff" position={[2, 2, 6]} scale={2.4} />
      <Lightformer intensity={2} color="#fff6e0" position={[-3, -2, 5]} scale={[3, 3, 1]} />
      <Lightformer intensity={0.6} color="#6c9cff" position={[0, 0, -6]} scale={[14, 8, 1]} />
    </Environment>
  );
}

export function HeroScene({ progress, intro }: { progress: { current: number }; intro: boolean }) {
  const [ref, inView] = useInView<HTMLDivElement>();
  return (
    <div ref={ref} className="absolute inset-0">
      <Canvas
        frameloop={inView ? "always" : "never"}
        dpr={[1, 1.75]}
        camera={{ position: [0, 0, 6], fov: 35 }}
        gl={{ antialias: true, powerPreference: "high-performance" }}
      >
        <WaveField shift={0} fade={progress} />
        <Studio />
        <Knot progress={progress} intro={intro} />
        <Sparkles count={70} scale={[9, 5, 3]} size={2.2} speed={0.25} opacity={0.55} color="#f3d27a" />
      </Canvas>
    </div>
  );
}

export function WaveScene({ gold = 1, shift = -0.35 }: { gold?: number; shift?: number }) {
  const [ref, inView] = useInView<HTMLDivElement>();
  return (
    <div ref={ref} className="absolute inset-0">
      <Canvas frameloop={inView ? "always" : "never"} dpr={[1, 1.5]} gl={{ antialias: false }}>
        <WaveField gold={gold} shift={shift} />
      </Canvas>
    </div>
  );
}
