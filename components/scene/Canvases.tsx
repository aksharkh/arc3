"use client";

import { useEffect, useRef, useState } from "react";
import { Canvas } from "@react-three/fiber";
import { Environment, Lightformer } from "@react-three/drei";
import Silk from "./Silk";
import Knot from "./Knot";

function useOnScreen<T extends Element>() {
  const ref = useRef<T>(null);
  const [on, setOn] = useState(true);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const io = new IntersectionObserver(([e]) => setOn(e.isIntersecting), { rootMargin: "120px" });
    io.observe(el);
    return () => io.disconnect();
  }, []);
  return [ref, on] as const;
}

function Studio() {
  return (
    <Environment resolution={256} frames={1}>
      <color attach="background" args={["#1c1408"]} />
      <Lightformer intensity={3.2} color="#fff3da" position={[0, 5, -1]} rotation-x={Math.PI / 2} scale={[12, 3, 1]} />
      <Lightformer intensity={2.4} color="#ffffff" position={[-5, 0.5, 1]} rotation-y={Math.PI / 2} scale={[8, 1.2, 1]} />
      <Lightformer intensity={2} color="#ffe2a6" position={[5, -0.5, 1]} rotation-y={-Math.PI / 2} scale={[8, 0.8, 1]} />
      <Lightformer form="ring" intensity={4} color="#ffffff" position={[2.5, 2, 6]} scale={2} />
      <Lightformer intensity={1.2} color="#8fb4ff" position={[-2, -3, 4]} scale={[4, 1, 1]} />
    </Environment>
  );
}

type Ref = { current: number };

export function HeroCanvas({ progress, fade }: { progress: Ref; fade: Ref }) {
  const [ref, on] = useOnScreen<HTMLDivElement>();
  return (
    <div ref={ref} className="absolute inset-0">
      <Canvas
        frameloop={on ? "always" : "never"}
        dpr={[1, 1.75]}
        camera={{ position: [0, 0, 6], fov: 35, near: 0.05 }}
        gl={{ antialias: true, powerPreference: "high-performance" }}
      >
        <Silk fade={fade} zoom={progress} />
        <Studio />
        <Knot progress={progress} />
      </Canvas>
    </div>
  );
}

export function SilkCanvas({ warm = 1 }: { warm?: number }) {
  const [ref, on] = useOnScreen<HTMLDivElement>();
  return (
    <div ref={ref} className="absolute inset-0">
      <Canvas frameloop={on ? "always" : "never"} dpr={[1, 1.5]} gl={{ antialias: false }}>
        <Silk warm={warm} />
      </Canvas>
    </div>
  );
}
