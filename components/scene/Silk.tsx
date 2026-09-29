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

// Slow-moving blue silk: a smooth height field lit like satin, with one
// cool key light that follows the pointer and a faint warm (gold) rim.
const fragment = /* glsl */ `
  precision highp float;
  varying vec2 vUv;
  uniform float uTime;
  uniform vec2 uRes;
  uniform vec2 uMouse;
  uniform float uFade;
  uniform float uZoom;
  uniform float uWarm;

  float h(vec2 p, float t) {
    vec2 q = p;
    q += 0.30 * vec2(sin(p.y * 1.2 + t * 0.9), cos(p.x * 1.05 - t * 0.7));
    q += 0.12 * vec2(sin(q.y * 2.3 - t * 0.6), cos(q.x * 2.0 + t * 0.5));
    float v = sin(q.x * 1.35 + q.y * 0.85 + t) * 0.55;
    v += sin(-q.x * 0.6 + q.y * 1.9 - t * 0.8) * 0.35;
    v += sin((q.x + q.y) * 2.9 + t * 1.2) * 0.06;
    return v;
  }

  float rnd(vec2 p) { return fract(sin(dot(p, vec2(12.9898, 78.233))) * 43758.5453); }

  void main() {
    float aspect = uRes.x / uRes.y;
    vec2 p = (vUv - 0.5) * vec2(aspect, 1.0) * 3.4 / (1.0 + uZoom);
    p = mat2(0.88, -0.47, 0.47, 0.88) * p;
    float t = uTime * 0.16;

    float e = 0.004;
    float hx = (h(p + vec2(e, 0.0), t) - h(p - vec2(e, 0.0), t)) / (2.0 * e);
    float hy = (h(p + vec2(0.0, e), t) - h(p - vec2(0.0, e), t)) / (2.0 * e);
    vec3 n = normalize(vec3(-hx * 1.25, -hy * 1.25, 1.0));

    vec2 m = uMouse - 0.5;
    vec3 V = vec3(0.0, 0.0, 1.0);
    vec3 L = normalize(vec3(-0.55 + m.x * 0.7, 0.5 + m.y * 0.5, 0.62));
    vec3 W = normalize(vec3(0.75, -0.45, 0.5));

    float d = clamp(dot(n, L), 0.0, 1.0);
    float s = pow(clamp(dot(n, normalize(L + V)), 0.0, 1.0), 28.0);
    float w = pow(clamp(dot(n, normalize(W + V)), 0.0, 1.0), 140.0);
    float sheen = pow(1.0 - n.z, 1.4);

    vec3 deep  = vec3(0.010, 0.024, 0.055);
    vec3 navy  = vec3(0.020, 0.070, 0.190);
    vec3 royal = vec3(0.045, 0.240, 0.660);

    vec3 col = mix(deep, navy, smoothstep(0.25, 0.85, d));
    col = mix(col, royal, pow(d, 4.0) * 0.8);
    col += vec3(0.55, 0.72, 1.0) * s * 0.38;
    col += vec3(1.0, 0.78, 0.42) * w * 0.45 * uWarm;
    col += vec3(0.08, 0.26, 0.62) * sheen * 0.22;

    float vig = smoothstep(1.55, 0.25, length((vUv - 0.5) * vec2(aspect, 1.0)));
    col *= mix(0.45, 1.0, vig);
    col += (rnd(gl_FragCoord.xy + fract(uTime)) - 0.5) / 255.0;
    col = mix(col, deep, uFade);
    gl_FragColor = vec4(col, 1.0);
  }
`;

type Props = {
  fade?: { current: number };
  zoom?: { current: number };
  warm?: number;
};

export default function Silk({ fade, zoom, warm = 1 }: Props) {
  const mat = useRef<THREE.ShaderMaterial>(null);
  const size = useThree((s) => s.size);
  const mouse = useRef(new THREE.Vector2(0.5, 0.5));
  const target = useMemo(() => new THREE.Vector2(), []);

  const uniforms = useMemo(
    () => ({
      uTime: { value: 0 },
      uRes: { value: new THREE.Vector2(1, 1) },
      uMouse: { value: new THREE.Vector2(0.5, 0.5) },
      uFade: { value: 0 },
      uZoom: { value: 0 },
      uWarm: { value: warm },
    }),
    [warm],
  );

  useFrame((_, dt) => {
    const u = mat.current?.uniforms;
    if (!u) return;
    u.uTime.value += Math.min(dt, 0.05);
    u.uRes.value.set(size.width, size.height);
    mouse.current.lerp(target.set(pointer.u, pointer.v), 0.03);
    u.uMouse.value.copy(mouse.current);
    u.uFade.value = fade?.current ?? 0;
    u.uZoom.value = zoom?.current ?? 0;
  });

  return (
    <mesh frustumCulled={false} renderOrder={-1}>
      <planeGeometry args={[2, 2]} />
      <shaderMaterial ref={mat} vertexShader={vertex} fragmentShader={fragment} uniforms={uniforms} depthWrite={false} depthTest={false} />
    </mesh>
  );
}
