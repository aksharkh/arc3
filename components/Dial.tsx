"use client";

import { motion } from "motion/react";
import { triquetraArcPaths } from "@/lib/triquetra";

const ARCS = triquetraArcPaths();
const BOX = "-1.62 -1.62 3.24 3.24";
const TICKS = 84;
// Heavy, slightly under-damped: reads as a mechanical dial settling.
const TURN = { type: "spring", stiffness: 46, damping: 12, mass: 1.1 } as const;

type Props = {
  index: number;
  count: number;
  /** arc to light, or null to show all three evenly */
  arc: number | null;
  onArc: (arc: number) => void;
};

/**
 * The mark as a vault dial: a numbered bezel that turns the active
 * chapter to the pointer, and the three arcs rotating inside it.
 */
export default function Dial({ index, count, arc, onArc }: Props) {
  const step = 360 / count;

  return (
    <div className="relative h-full w-full">
      {/* fixed parts: rings + pointer */}
      <svg viewBox={BOX} className="absolute inset-0 h-full w-full overflow-visible" aria-hidden>
        <circle r={1.6} fill="none" stroke="currentColor" strokeOpacity={0.18} strokeWidth={0.004} />
        <circle r={1.2} fill="none" stroke="currentColor" strokeOpacity={0.18} strokeWidth={0.004} />
        <path d="M-0.035 -1.66 L0.035 -1.66 L0 -1.585 Z" fill="var(--accent)" />
      </svg>

      {/* bezel */}
      <motion.div className="absolute inset-0" initial={{ rotate: 90 }} animate={{ rotate: -index * step }} transition={TURN}>
        <svg viewBox={BOX} className="h-full w-full overflow-visible" aria-hidden>
          {Array.from({ length: TICKS }, (_, k) => {
            const major = k % (TICKS / count) === 0;
            return (
              <line
                key={k}
                x1={0}
                y1={-1.555}
                x2={0}
                y2={major ? -1.47 : -1.52}
                stroke="currentColor"
                strokeOpacity={major ? 0.9 : 0.35}
                strokeWidth={major ? 0.008 : 0.004}
                transform={`rotate(${(k * 360) / TICKS})`}
              />
            );
          })}
          {Array.from({ length: count }, (_, k) => (
            <text
              key={k}
              y={-1.33}
              textAnchor="middle"
              fontSize={0.085}
              fontWeight={600}
              letterSpacing={0.01}
              transform={`rotate(${k * step})`}
              fill={k === index ? "var(--accent)" : "currentColor"}
              fillOpacity={k === index ? 1 : 0.45}
              style={{ transition: "fill 0.6s, fill-opacity 0.6s" }}
            >
              {String(k).padStart(2, "0")}
            </text>
          ))}
        </svg>
      </motion.div>

      {/* the three arcs */}
      <motion.div className="absolute inset-0" initial={{ rotate: -120, scale: 0.8, opacity: 0 }} animate={{ rotate: -index * 120, scale: 1, opacity: 1 }} transition={TURN}>
        <svg viewBox={BOX} className="h-full w-full overflow-visible">
          <g transform="scale(1.12)">
            {ARCS.map((d, k) => (
              <path
                key={`b${k}`}
                d={d}
                fill="none"
                stroke="currentColor"
                strokeOpacity={arc === null ? 0.85 : 0.28}
                strokeWidth={arc === null ? 0.016 : 0.01}
                strokeLinecap="round"
                style={{ transition: "stroke-opacity 0.8s, stroke-width 0.8s" }}
              />
            ))}
            {arc !== null && (
              <motion.path
                key={`on${arc}`}
                d={ARCS[arc]}
                fill="none"
                stroke="var(--accent)"
                strokeWidth={0.045}
                strokeLinecap="round"
                initial={{ pathLength: 0 }}
                animate={{ pathLength: 1 }}
                transition={{ duration: 1.3, ease: [0.22, 1, 0.36, 1], delay: 0.45 }}
              />
            )}
            {/* generous hit areas: click an arc to jump to its chapter */}
            {ARCS.map((d, k) => (
              <path
                key={`h${k}`}
                d={d}
                fill="none"
                stroke="transparent"
                strokeWidth={0.16}
                className="cursor-pointer"
                style={{ pointerEvents: "stroke" }}
                onClick={() => onArc(k)}
              >
                <title>{["Governance", "Risk", "Compliance"][k]}</title>
              </path>
            ))}
          </g>
          <circle r={0.022} fill="var(--accent)" />
        </svg>
      </motion.div>
    </div>
  );
}
