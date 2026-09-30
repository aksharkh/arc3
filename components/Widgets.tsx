"use client";

import { useEffect, useRef, useState } from "react";
import { motion, useInView } from "motion/react";
import { CountUp, EASE } from "./ui";

/** Small product-style widgets used in the hero and the bento grid. */

export function ScoreRing({ value = 98 }: { value?: number }) {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true });
  const R = 52;
  const C = 2 * Math.PI * R;
  return (
    <div ref={ref} className="rounded-3xl bg-white p-5 text-ink shadow-lift">
      <div className="flex items-center justify-between">
        <p className="text-[13px] font-semibold">Audit readiness</p>
        <span className="tag rounded-full bg-emerald-50 px-2.5 py-1 !text-[11px] text-emerald-700">+12 pts</span>
      </div>
      <div className="relative mx-auto mt-4 h-36 w-36">
        <svg viewBox="0 0 120 120" className="h-full w-full -rotate-90">
          <circle cx="60" cy="60" r={R} fill="none" stroke="var(--sky)" strokeWidth="9" />
          <motion.circle
            cx="60"
            cy="60"
            r={R}
            fill="none"
            stroke="var(--royal)"
            strokeWidth="9"
            strokeLinecap="round"
            strokeDasharray={C}
            initial={{ strokeDashoffset: C }}
            animate={inView ? { strokeDashoffset: C * (1 - value / 100) } : undefined}
            transition={{ duration: 1.8, ease: EASE, delay: 0.5 }}
          />
        </svg>
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <span className="text-[34px] font-bold leading-none tracking-[-0.04em]">
            <CountUp to={value} suffix="%" />
          </span>
          <span className="mt-1 text-[11px] text-slate">ready</span>
        </div>
      </div>
      <div className="mt-4 flex gap-2">
        {["ISO 27001", "SOC 2", "DPDP"].map((f, i) => (
          <motion.span
            key={f}
            initial={{ opacity: 0, scale: 0.8 }}
            animate={inView ? { opacity: 1, scale: 1 } : undefined}
            transition={{ delay: 1.2 + i * 0.12, type: "spring", stiffness: 300, damping: 20 }}
            className="flex-1 rounded-full bg-paper py-1.5 text-center text-[11px] font-semibold text-slate"
          >
            {f}
          </motion.span>
        ))}
      </div>
    </div>
  );
}

const heat = (score: number) =>
  score > 19 ? "#d4af37" : score > 14 ? "#0f4cb1" : score > 9 ? "#4d8be6" : score > 4 ? "#a9c8f6" : "#dfeafc";

export function Heatmap({ bare = false }: { bare?: boolean }) {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true });
  return (
    <div ref={ref} className={bare ? "" : "rounded-3xl bg-white p-5 text-ink shadow-lift"}>
      {!bare && (
        <div className="flex items-center justify-between">
          <p className="text-[13px] font-semibold">Risk heatmap</p>
          <span className="text-[11px] text-slate">12 open · 3 critical</span>
        </div>
      )}
      <div className={`grid grid-cols-5 gap-1.5 ${bare ? "" : "mt-4"}`}>
        {Array.from({ length: 25 }, (_, k) => {
          const row = Math.floor(k / 5);
          const col = k % 5;
          const score = (5 - row) * (col + 1);
          const hot = k === 4 || k === 8;
          return (
            <motion.span
              key={k}
              className="relative aspect-square rounded-[7px]"
              style={{ background: heat(score) }}
              initial={{ opacity: 0, scale: 0.4 }}
              animate={inView ? { opacity: 1, scale: 1 } : undefined}
              transition={{ delay: 0.4 + (row + col) * 0.06, type: "spring", stiffness: 260, damping: 20 }}
            >
              {hot && (
                <>
                  <motion.span
                    className="absolute inset-0 rounded-[7px] ring-2 ring-gold"
                    animate={{ scale: [1, 1.5], opacity: [0.8, 0] }}
                    transition={{ duration: 1.8, repeat: Infinity, ease: "easeOut", delay: k * 0.1 }}
                  />
                  <span className="absolute left-1/2 top-1/2 h-1.5 w-1.5 -translate-x-1/2 -translate-y-1/2 rounded-full bg-white" />
                </>
              )}
            </motion.span>
          );
        })}
      </div>
      {!bare && (
        <div className="mt-3 flex justify-between text-[10px] font-medium uppercase tracking-wider text-slate">
          <span>Impact →</span>
          <span>Likelihood ↑</span>
        </div>
      )}
    </div>
  );
}

const CONTROLS = ["Access reviews", "Vendor due diligence", "Incident response", "Data retention"];

export function Controls({ bare = false }: { bare?: boolean }) {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true });
  const [done, setDone] = useState(0);

  // Tick controls off one by one, pause, then start over.
  useEffect(() => {
    if (!inView) return;
    const id = setInterval(() => setDone((d) => (d > CONTROLS.length + 1 ? 0 : d + 1)), 900);
    return () => clearInterval(id);
  }, [inView]);

  const pct = Math.round((Math.min(done, CONTROLS.length) / CONTROLS.length) * 100);

  return (
    <div ref={ref} className={bare ? "" : "rounded-3xl bg-white p-5 text-ink shadow-lift"}>
      {!bare && (
        <div className="flex items-center justify-between">
          <p className="text-[13px] font-semibold">Control testing</p>
          <span className="text-[11px] tabular-nums text-slate">{pct}%</span>
        </div>
      )}
      <div className={`h-1.5 overflow-hidden rounded-full bg-sky ${bare ? "" : "mt-3"}`}>
        <motion.div className="h-full rounded-full bg-royal" animate={{ width: `${pct}%` }} transition={{ duration: 0.6, ease: EASE }} />
      </div>
      <ul className="mt-4 space-y-2">
        {CONTROLS.map((c, i) => {
          const on = i < done;
          return (
            <li key={c} className="flex items-center gap-3 rounded-2xl bg-paper px-3 py-2.5 text-[13px] font-medium">
              <motion.span
                animate={{ backgroundColor: on ? "#0f4cb1" : "#ffffff", borderColor: on ? "#0f4cb1" : "#cfd8e6" }}
                className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full border"
              >
                <svg viewBox="0 0 12 12" className="h-3 w-3" fill="none" stroke="#fff" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <motion.path d="M2.5 6.2 5 8.5l4.5-5" animate={{ pathLength: on ? 1 : 0 }} transition={{ duration: 0.35 }} />
                </svg>
              </motion.span>
              <span className={`transition-colors duration-500 ${on ? "text-ink" : "text-slate"}`}>{c}</span>
              <motion.span animate={{ opacity: on ? 1 : 0, x: on ? 0 : 6 }} className="ml-auto text-[11px] font-semibold text-royal">
                Effective
              </motion.span>
            </li>
          );
        })}
      </ul>
    </div>
  );
}

/** Bars that grow in, with a trend line drawn across them. */
export function Bars() {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: "0px 0px -10% 0px" });
  const data = [78, 64, 58, 44, 37, 26, 18];
  return (
    <div ref={ref} className="relative flex h-36 items-end gap-2.5">
      {data.map((h, i) => (
        <motion.div
          key={i}
          className={`flex-1 rounded-t-lg ${i === data.length - 1 ? "bg-royal" : "bg-sky"}`}
          initial={{ height: 0 }}
          animate={inView ? { height: `${h}%` } : undefined}
          transition={{ duration: 0.9, ease: EASE, delay: 0.15 + i * 0.07 }}
        />
      ))}
      <svg viewBox="0 0 100 100" preserveAspectRatio="none" className="pointer-events-none absolute inset-0 h-full w-full overflow-visible">
        <motion.path
          d="M7 16 C 22 30, 34 38, 50 50 S 80 72, 93 77"
          fill="none"
          stroke="var(--gold)"
          strokeWidth="1.6"
          strokeLinecap="round"
          initial={{ pathLength: 0 }}
          animate={inView ? { pathLength: 1 } : undefined}
          transition={{ duration: 1.4, ease: EASE, delay: 0.6 }}
        />
      </svg>
    </div>
  );
}
