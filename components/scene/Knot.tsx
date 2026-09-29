"use client";

import { useMemo, useRef } from "react";
import { useFrame, useThree } from "@react-three/fiber";
import * as THREE from "three";
import { triquetraPoints } from "@/lib/triquetra";
import { pointer } from "@/lib/store";

/**
 * A flat metal band swept along the triquetra loop — the brand mark as an
 * object. Rectangular section, mitred at the three tips so they stay sharp.
 */
function ribbonGeometry(width = 0.15, thickness = 0.06) {
  const pts = triquetraPoints(180, 0.34, 0.19).map((p) => new THREE.Vector3(...p));
  const N = pts.length;
  const Z = new THREE.Vector3(0, 0, 1);
  const pos: number[] = [];
  const nor: number[] = [];
  const idx: number[] = [];

  const rings: { c: THREE.Vector3[]; n: THREE.Vector3[] }[] = [];
  for (let i = 0; i < N; i++) {
    const P = pts[i];
    const tin = P.clone().sub(pts[(i - 1 + N) % N]).normalize();
    const tout = pts[(i + 1) % N].clone().sub(P).normalize();
    const T = tin.clone().add(tout).normalize();
    const miter = 1 / Math.max(T.dot(tout), 0.3);
    const B = T.clone().cross(Z).normalize();
    const U = B.clone().cross(T).normalize();
    const hw = (width / 2) * Math.min(miter, 2.4);
    const hh = thickness / 2;
    const c0 = P.clone().addScaledVector(B, hw).addScaledVector(U, hh);
    const c1 = P.clone().addScaledVector(B, -hw).addScaledVector(U, hh);
    const c2 = P.clone().addScaledVector(B, -hw).addScaledVector(U, -hh);
    const c3 = P.clone().addScaledVector(B, hw).addScaledVector(U, -hh);
    rings.push({ c: [c0, c1, c2, c3], n: [U, B.clone().negate(), U.clone().negate(), B] });
  }

  // 4 faces, each a strip of (a, b) pairs with its own flat normal.
  for (let f = 0; f < 4; f++) {
    const base = pos.length / 3;
    for (let i = 0; i < N; i++) {
      const { c, n } = rings[i];
      const a = c[f];
      const b = c[(f + 1) % 4];
      pos.push(a.x, a.y, a.z, b.x, b.y, b.z);
      nor.push(n[f].x, n[f].y, n[f].z, n[f].x, n[f].y, n[f].z);
    }
    for (let i = 0; i < N; i++) {
      const j = (i + 1) % N;
      const ai = base + i * 2, bi = ai + 1;
      const aj = base + j * 2, bj = aj + 1;
      idx.push(ai, bj, bi, ai, aj, bj);
    }
  }

  const g = new THREE.BufferGeometry();
  g.setAttribute("position", new THREE.Float32BufferAttribute(pos, 3));
  g.setAttribute("normal", new THREE.Float32BufferAttribute(nor, 3));
  g.setIndex(idx);
  return g;
}

type Props = {
  progress?: { current: number };
  intro?: boolean;
};

export default function Knot({ progress, intro = true }: Props) {
  const group = useRef<THREE.Group>(null);
  const inner = useRef<THREE.Group>(null);
  const geo = useMemo(() => ribbonGeometry(), []);
  const viewport = useThree((s) => s.viewport);
  const t0 = useRef<number | null>(null);

  const wide = viewport.aspect > 1.05;
  const baseX = wide ? viewport.width * 0.2 : 0;
  const baseY = wide ? 0 : viewport.height * 0.16;
  const baseS = wide ? Math.min(viewport.height * 0.27, viewport.width * 0.16) : viewport.width * 0.3;

  useFrame((state, dt) => {
    const g = group.current;
    const i = inner.current;
    if (!g || !i) return;
    const time = state.clock.elapsedTime;
    if (intro && t0.current === null) t0.current = time;
    const k = intro ? Math.min((time - (t0.current ?? time)) / 2.4, 1) : 0;
    const e = 1 - Math.pow(1 - k, 4);
    const p = progress?.current ?? 0;

    // Intro: arrive from depth, unwinding a half turn.
    const s = baseS * (0.55 + 0.45 * e) * (1 - p * 0.25);
    g.scale.setScalar(s);
    g.position.set(baseX - p * (wide ? viewport.width * 0.2 : 0), baseY + p * viewport.height * 0.35, -2 * (1 - e));

    const targetX = -pointer.y * 0.28 + Math.sin(time * 0.4) * 0.08;
    const targetY = pointer.x * 0.45 + Math.sin(time * 0.25) * 0.35;
    i.rotation.x = THREE.MathUtils.damp(i.rotation.x, targetX, 3, dt);
    i.rotation.y = THREE.MathUtils.damp(i.rotation.y, targetY + (1 - e) * Math.PI, 3, dt);
    i.rotation.z = Math.sin(time * 0.18) * 0.06 + p * 1.2;
    i.position.y = Math.sin(time * 0.8) * 0.04;
  });

  return (
    <group ref={group} scale={0.001}>
      <group ref={inner}>
        <mesh geometry={geo}>
          <meshPhysicalMaterial
            color="#e8b84a"
            metalness={1}
            roughness={0.24}
            clearcoat={0.5}
            clearcoatRoughness={0.15}
            envMapIntensity={1.9}
          />
        </mesh>
      </group>
    </group>
  );
}
