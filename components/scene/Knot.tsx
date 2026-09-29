"use client";

import { useMemo, useRef } from "react";
import { useFrame, useThree } from "@react-three/fiber";
import * as THREE from "three";
import { triquetraPoints } from "@/lib/triquetra";
import { pointer } from "@/lib/store";

/**
 * The mark as a polished band: an elliptical section swept along the
 * triquetra loop, widened at the tips so they stay crisp.
 */
function bandGeometry(width = 0.13, thickness = 0.055, seg = 28) {
  const pts = triquetraPoints(220, 0.34, 0.17).map((p) => new THREE.Vector3(...p));
  const N = pts.length;
  const Z = new THREE.Vector3(0, 0, 1);
  const pos = new Float32Array(N * seg * 3);
  const nor = new Float32Array(N * seg * 3);
  const idx: number[] = [];
  const a = width / 2;
  const b = thickness / 2;

  for (let i = 0; i < N; i++) {
    const P = pts[i];
    const tin = P.clone().sub(pts[(i - 1 + N) % N]).normalize();
    const tout = pts[(i + 1) % N].clone().sub(P).normalize();
    const T = tin.clone().add(tout).normalize();
    const miter = Math.min(1 / Math.max(T.dot(tout), 0.3), 2.2);
    const B = T.clone().cross(Z).normalize();
    const U = B.clone().cross(T).normalize();
    for (let j = 0; j < seg; j++) {
      const th = (j / seg) * Math.PI * 2;
      const c = Math.cos(th);
      const s = Math.sin(th);
      const k = (i * seg + j) * 3;
      const v = P.clone().addScaledVector(B, a * miter * c).addScaledVector(U, b * s);
      const n = B.clone().multiplyScalar(b * c).addScaledVector(U, a * miter * s).normalize();
      pos[k] = v.x; pos[k + 1] = v.y; pos[k + 2] = v.z;
      nor[k] = n.x; nor[k + 1] = n.y; nor[k + 2] = n.z;
    }
  }
  for (let i = 0; i < N; i++) {
    const i2 = (i + 1) % N;
    for (let j = 0; j < seg; j++) {
      const j2 = (j + 1) % seg;
      const p00 = i * seg + j, p01 = i * seg + j2, p10 = i2 * seg + j, p11 = i2 * seg + j2;
      idx.push(p00, p10, p11, p00, p11, p01);
    }
  }
  const g = new THREE.BufferGeometry();
  g.setAttribute("position", new THREE.BufferAttribute(pos, 3));
  g.setAttribute("normal", new THREE.BufferAttribute(nor, 3));
  g.setIndex(idx);
  return g;
}

const ease = (x: number) => 1 - Math.pow(1 - x, 4);

export default function Knot({ progress }: { progress: { current: number } }) {
  const outer = useRef<THREE.Group>(null);
  const inner = useRef<THREE.Group>(null);
  const geo = useMemo(() => bandGeometry(), []);
  const { viewport } = useThree();
  const born = useRef<number | null>(null);

  // Size to the smaller of height/width so it sits well on phones too.
  const base = Math.min((viewport.height * 0.44) / 1.5, (viewport.width * 0.62) / 1.73);

  useFrame((state, dt) => {
    const o = outer.current;
    const n = inner.current;
    if (!o || !n) return;
    const time = state.clock.elapsedTime;
    if (born.current === null) born.current = time;
    const intro = ease(Math.min((time - born.current) / 3.2, 1));
    const p = progress.current;
    const fly = p * p * (3 - 2 * p); // smoothstep
    const idle = 1 - fly;

    // Fly the camera through the central opening: forward + slight growth.
    o.scale.setScalar(base * (0.82 + 0.18 * intro) * (1 + fly * 0.8));
    o.position.set(0, (0.1 * viewport.height - 0.25 * base) * idle, -1.2 * (1 - intro) + fly * 5.6);

    const ry = (Math.sin(time * 0.3) * 0.32 + pointer.x * 0.22) * idle + (1 - intro) * 1.4;
    const rx = (Math.sin(time * 0.23) * 0.1 - pointer.y * 0.14) * idle;
    n.rotation.y = THREE.MathUtils.damp(n.rotation.y, ry, 2.5, dt);
    n.rotation.x = THREE.MathUtils.damp(n.rotation.x, rx, 2.5, dt);
    n.rotation.z = fly * 0.9;
  });

  return (
    <group ref={outer} scale={0.001}>
      <group ref={inner}>
        <mesh geometry={geo}>
          <meshPhysicalMaterial
            color="#e2b65b"
            metalness={1}
            roughness={0.17}
            clearcoat={0.4}
            clearcoatRoughness={0.1}
            envMapIntensity={1.5}
          />
        </mesh>
      </group>
    </group>
  );
}
