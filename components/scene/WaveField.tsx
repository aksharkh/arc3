"use client";

import { useMemo, useRef } from "react";
import { useFrame, useThree } from "@react-three/fiber";
import * as THREE from "three";
import { pointer } from "@/lib/store";

const vertex = /* glsl */ `
  varying vec2 vUv;
  void main() {
    vUv = uv;
    gl_Position = vec4(position.xy, 0.9999, 1.0);
  }
`;

// Domain-warped fbm read as liquid lapis marble, with thin gold veins.
const fragment = /* glsl */ `
  precision highp float;
  varying vec2 vUv;
  uniform float uTime;
  uniform vec2 uRes;
  uniform vec2 uMouse;
  uniform float uFade;
  uniform float uShift;   // pushes the brightest flow toward the right (hero) or centre
  uniform float uGold;

  vec2 hash(vec2 p) {
    p = vec2(dot(p, vec2(127.1, 311.7)), dot(p, vec2(269.5, 183.3)));
    return -1.0 + 2.0 * fract(sin(p) * 43758.5453123);
  }
  float noise(vec2 p) {
    vec2 i = floor(p), f = fract(p);
    vec2 u = f * f * (3.0 - 2.0 * f);
    return mix(mix(dot(hash(i), f), dot(hash(i + vec2(1, 0)), f - vec2(1, 0)), u.x),
               mix(dot(hash(i + vec2(0, 1)), f - vec2(0, 1)), dot(hash(i + vec2(1, 1)), f - vec2(1, 1)), u.x), u.y);
  }
  float fbm(vec2 p) {
    float f = 0.0, a = 0.5;
    mat2 m = mat2(1.6, 1.2, -1.2, 1.6);
    for (int i = 0; i < 5; i++) { f += a * noise(p); p = m * p; a *= 0.5; }
    return f;
  }
  float rnd(vec2 p) { return fract(sin(dot(p, vec2(12.9898, 78.233))) * 43758.5453); }

  void main() {
    float aspect = uRes.x / uRes.y;
    vec2 uv = vUv;
    vec2 p = (uv - 0.5) * vec2(aspect, 1.0) * 1.35;
    p = mat2(0.82, -0.57, 0.57, 0.82) * p;   // diagonal flow like the brand boards
    float t = uTime * 0.045;

    vec2 m = (uMouse - 0.5) * vec2(aspect, 1.0) * 1.35;
    m = mat2(0.82, -0.57, 0.57, 0.82) * m;
    float md = exp(-4.0 * length(p - m));

    vec2 q = vec2(fbm(p + vec2(0.0, t)), fbm(p + vec2(5.2, 1.3) - t));
    vec2 r = vec2(fbm(p + 3.0 * q + vec2(1.7, 9.2) + 0.15 * t + md * 0.35),
                  fbm(p + 3.0 * q + vec2(8.3, 2.8) - 0.12 * t));
    float f = fbm(p + 3.2 * r);

    float field = f + 0.6 * r.x;
    // agate strata: many thin parallel waves riding the warped field
    float phase = field * 9.0 + q.y * 2.5;
    float bands = sin(phase * 3.14159);
    float fine = sin(phase * 3.14159 * 4.0);
    float body = smoothstep(-0.25, 0.55, field);

    vec3 ink   = vec3(0.008, 0.024, 0.06);
    vec3 navy  = vec3(0.02, 0.07, 0.2);
    vec3 royal = vec3(0.03, 0.24, 0.72);
    vec3 ocean = vec3(0.08, 0.47, 0.88);
    vec3 ice   = vec3(0.72, 0.87, 1.0);
    vec3 gold  = vec3(0.95, 0.74, 0.30);

    vec3 col = mix(ink, navy, smoothstep(-0.55, 0.1, field));
    col = mix(col, royal, body * (0.55 + 0.45 * smoothstep(-0.6, 0.6, bands)));
    col = mix(col, ocean, smoothstep(0.35, 0.95, bands) * body * 0.8);
    col = mix(col, navy * 0.7, smoothstep(0.2, 0.95, -bands) * body * 0.55);
    col += ice * (1.0 - smoothstep(0.0, 0.08, abs(fine))) * 0.07 * body;
    col += ice * pow(max(bands, 0.0), 24.0) * 0.35 * body;

    // Gold veins: thin iso-lines of the warped field, masked to a few rivers.
    float iso = abs(fract(field * 2.4 + 0.25 * q.x) - 0.5);
    float vein = 1.0 - smoothstep(0.0, 0.018 + 0.01 * md, iso);
    float mask = smoothstep(0.15, 0.45, fbm(p * 0.7 + vec2(3.1, -t * 0.6)));
    vein *= mask;
    float glint = step(0.985, rnd(floor(gl_FragCoord.xy / 2.0) + floor(uTime * 3.0)));
    col = mix(col, gold * (0.8 + 0.6 * glint), vein * 0.85 * uGold);
    col += gold * vein * md * 0.6 * uGold;

    // Composition: brighter flow on one side, readable ink on the other.
    float side = smoothstep(-0.1 + uShift, 0.95 + uShift, uv.x);
    col *= mix(0.32, 1.05, side);
    float vig = smoothstep(1.25, 0.25, length((uv - vec2(0.62, 0.5)) * vec2(aspect * 0.8, 1.0)));
    col *= mix(0.35, 1.0, vig);

    col = mix(col, ink, uFade);
    gl_FragColor = vec4(col, 1.0);
  }
`;

type Props = {
  shift?: number;
  gold?: number;
  fade?: { current: number };
};

export default function WaveField({ shift = 0, gold = 1, fade }: Props) {
  const mat = useRef<THREE.ShaderMaterial>(null);
  const size = useThree((s) => s.size);
  const mouse = useRef(new THREE.Vector2(0.7, 0.5));

  const uniforms = useMemo(
    () => ({
      uTime: { value: 0 },
      uRes: { value: new THREE.Vector2(1, 1) },
      uMouse: { value: new THREE.Vector2(0.7, 0.5) },
      uFade: { value: 0 },
      uShift: { value: shift },
      uGold: { value: gold },
    }),
    [shift, gold],
  );

  useFrame((_, dt) => {
    const u = mat.current?.uniforms;
    if (!u) return;
    u.uTime.value += Math.min(dt, 0.05);
    u.uRes.value.set(size.width, size.height);
    mouse.current.lerp(new THREE.Vector2(pointer.u, pointer.v), 0.04);
    u.uMouse.value.copy(mouse.current);
    u.uFade.value = fade?.current ?? 0;
  });

  return (
    <mesh frustumCulled={false} renderOrder={-1}>
      <planeGeometry args={[2, 2]} />
      <shaderMaterial
        ref={mat}
        vertexShader={vertex}
        fragmentShader={fragment}
        uniforms={uniforms}
        depthWrite={false}
        depthTest={false}
      />
    </mesh>
  );
}
