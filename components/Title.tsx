"use client";

import { useEffect, useRef } from "react";
import { motion } from "motion/react";

const EASE = [0.22, 1, 0.36, 1] as const;
const LIGHT = 180;
const HEAVY = 900;

/**
 * Giant condensed title. Each letter's weight swells toward the cursor;
 * with no pointer (touch, or idle) a slow wave passes through instead.
 */
export default function Title({ text }: { text: string }) {
  const letters = useRef<(HTMLSpanElement | null)[]>([]);

  useEffect(() => {
    let raf = 0;
    let px = -1;
    let lastMove = -1e9;
    const current = letters.current.map(() => LIGHT);

    const onMove = (e: PointerEvent) => {
      if (e.pointerType === "touch") return;
      px = e.clientX;
      lastMove = performance.now();
    };
    window.addEventListener("pointermove", onMove);

    const tick = (now: number) => {
      const active = now - lastMove < 2500;
      const reach = window.innerWidth * 0.2;
      letters.current.forEach((el, k) => {
        if (!el) return;
        let target: number;
        if (active) {
          const r = el.getBoundingClientRect();
          const d = Math.abs(px - (r.left + r.width / 2));
          const t = Math.max(0, 1 - d / reach);
          target = LIGHT + (HEAVY - LIGHT) * t * t;
        } else {
          const w = Math.sin(now / 900 - k * 0.55) * 0.5 + 0.5;
          target = LIGHT + (HEAVY - LIGHT) * Math.pow(w, 3);
        }
        current[k] += (target - current[k]) * 0.12;
        el.style.fontVariationSettings = `"wght" ${current[k].toFixed(0)}, "wdth" 62`;
      });
      raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("pointermove", onMove);
    };
  }, [text]);

  return (
    <h1
      aria-label={text}
      className="flex select-none overflow-hidden uppercase leading-[0.8] tracking-[-0.01em]"
      // Sized so the word fills the available width, whatever its length.
      style={{ fontSize: `min(calc(var(--title-w) / ${(text.length * 0.5).toFixed(2)}), var(--title-max))`, paddingTop: "0.06em" }}
    >
      {text.split("").map((ch, k) => (
        <motion.span
          key={k}
          aria-hidden
          className="inline-block"
          variants={{
            enter: { y: "105%" },
            show: { y: "0%", transition: { duration: 1.1, ease: EASE, delay: 0.5 + k * 0.04 } },
            exit: { y: "-105%", transition: { duration: 0.45, ease: [0.7, 0, 0.84, 0], delay: k * 0.015 } },
          }}
        >
          <span
            ref={(el) => {
              letters.current[k] = el;
            }}
            className="inline-block"
            style={{ fontVariationSettings: `"wght" ${LIGHT}, "wdth" 62` }}
          >
            {ch}
          </span>
        </motion.span>
      ))}
    </h1>
  );
}
