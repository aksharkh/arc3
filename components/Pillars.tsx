"use client";

import { useEffect, useRef, useState } from "react";
import { AnimatePresence, motion, useInView, useMotionValueEvent, useScroll } from "motion/react";
import { triquetraArcPaths } from "@/lib/triquetra";
import { EASE, RevealLines, SectionTag } from "./ui";

const ARCS = triquetraArcPaths();

const PILLARS = [
  {
    name: "Governance",
    line: ["Frameworks", "that decide."],
    body: "Board-level oversight made operational. We design the structures, charters and accountabilities that turn intent into decisions — and decisions into evidence.",
    caps: ["GRC strategy & operating model", "Board & committee charters", "Policy architecture & lifecycle", "Three-lines-of-defence design"],
    out: "Governance charter · RACI · Policy library",
  },
  {
    name: "Risk",
    line: ["Measured before", "it is felt."],
    body: "Enterprise, cyber, operational and third-party risk — identified, quantified in money, and monitored continuously so exposure is a number, not a surprise.",
    caps: ["Enterprise risk registers", "Cyber risk quantification (FAIR)", "Third-party & vendor risk", "Continuous control monitoring"],
    out: "Risk appetite · Heatmaps · Key risk indicators",
  },
  {
    name: "Compliance",
    line: ["Holds when", "it is tested."],
    body: "Every obligation mapped to a control, every control to its evidence. Audits stop being events and become a formality you can run any Tuesday.",
    caps: ["Regulatory mapping — DPDP, SEBI, RBI, GDPR", "ISO 27001 / SOC 2 readiness", "Internal audit & control testing", "Evidence automation"],
    out: "Control matrix · Audit pack · Certification",
  },
];

function Triad({ active, className }: { active: number; className?: string }) {
  return (
    <svg viewBox="-1.25 -1.2 2.5 2.35" className={className} aria-hidden>
      <defs>
        <linearGradient id="pg" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stopColor="#fbe7a6" />
          <stop offset="0.5" stopColor="#d4af37" />
          <stop offset="1" stopColor="#a47a22" />
        </linearGradient>
        <filter id="glow" x="-50%" y="-50%" width="200%" height="200%">
          <feGaussianBlur stdDeviation="0.04" result="b" />
          <feMerge>
            <feMergeNode in="b" />
            <feMergeNode in="SourceGraphic" />
          </feMerge>
        </filter>
      </defs>
      {ARCS.map((d, i) => (
        <path key={`base${i}`} d={d} fill="none" stroke="rgba(245,247,250,0.1)" strokeWidth={0.06} strokeLinecap="round" />
      ))}
      {ARCS.map((d, i) =>
        i === active ? (
          <motion.path
            key={`on${i}-${active}`}
            d={d}
            fill="none"
            stroke="url(#pg)"
            strokeWidth={0.075}
            strokeLinecap="round"
            filter="url(#glow)"
            initial={{ pathLength: 0 }}
            animate={{ pathLength: 1 }}
            transition={{ duration: 1.2, ease: EASE }}
          />
        ) : null,
      )}
      <circle r={0.035} fill="#d4af37" />
    </svg>
  );
}

function Panel({ p, i, onActive }: { p: (typeof PILLARS)[number]; i: number; onActive: (i: number) => void }) {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { margin: "-45% 0px -45% 0px" });
  useEffect(() => {
    if (inView) onActive(i);
  }, [inView, i, onActive]);
  return (
    <div ref={ref} className="flex min-h-[80vh] flex-col justify-center py-20 md:min-h-screen">
      <Triad active={i} className="mb-10 h-28 w-28 md:hidden" />
      <p className="label text-gold">
        0{i + 1} — {p.name}
      </p>
      <h3 className="mt-6 text-[clamp(2.6rem,5.4vw,5.5rem)] font-light leading-[0.95] tracking-[-0.04em]">
        <RevealLines lines={[p.line[0], <span key="s" className="font-serif italic text-gold-soft">{p.line[1]}</span>]} />
      </h3>
      <p className="mt-8 max-w-lg text-[16px] leading-relaxed text-pearl/65">{p.body}</p>
      <ul className="mt-10 max-w-lg border-t border-white/10">
        {p.caps.map((c, k) => (
          <li key={c} className="group flex items-center justify-between border-b border-white/10 py-4 text-[15px] text-pearl/85">
            <span className="flex items-center gap-4">
              <span className="font-mono text-[11px] text-pearl/35">{String(k + 1).padStart(2, "0")}</span>
              <span className="transition-transform duration-500 group-hover:translate-x-2">{c}</span>
            </span>
            <span className="h-1.5 w-1.5 rounded-full bg-gold/0 transition-colors duration-500 group-hover:bg-gold" />
          </li>
        ))}
      </ul>
      <p className="label mt-8 text-pearl/40">
        Output <span className="text-pearl/70">— {p.out}</span>
      </p>
    </div>
  );
}

export default function Pillars() {
  const [active, setActive] = useState(0);
  const ref = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start start", "end end"] });
  const [pct, setPct] = useState(0);
  useMotionValueEvent(scrollYProgress, "change", (v) => setPct(v));

  return (
    <section
      ref={ref}
      id="pillars"
      className="relative bg-navy-2 px-6 md:px-10"
      style={{ backgroundImage: "radial-gradient(60% 50% at 20% 40%, rgba(15,76,177,0.35), transparent 70%)" }}
    >
      <div className="mx-auto max-w-[1600px] pt-28 md:pt-40">
        <SectionTag index="02">Three pillars · One system</SectionTag>
        <h2 className="mt-8 max-w-4xl text-[clamp(2.2rem,4.6vw,4.4rem)] font-light leading-[1.02] tracking-[-0.035em]">
          <RevealLines lines={["Three arcs.", <span key="b" className="text-pearl/40">Woven so none can fail alone.</span>]} />
        </h2>
      </div>

      <div className="mx-auto grid max-w-[1600px] md:grid-cols-2 md:gap-20">
        <div className="relative hidden md:block">
          <div className="sticky top-0 flex h-screen flex-col items-center justify-center">
            <div className="relative">
              <Triad active={active} className="h-[min(56vh,34rem)] w-[min(56vh,34rem)]" />
              <AnimatePresence mode="wait">
                <motion.p
                  key={active}
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -30 }}
                  transition={{ duration: 0.6, ease: EASE }}
                  className="text-outline pointer-events-none absolute -left-10 -top-10 font-serif text-[12rem] leading-none"
                >
                  0{active + 1}
                </motion.p>
              </AnimatePresence>
            </div>
            <div className="mt-12 flex w-full max-w-md items-center gap-4">
              {PILLARS.map((p, i) => (
                <span key={p.name} className={`label transition-colors duration-500 ${i === active ? "text-gold" : "text-pearl/35"}`}>
                  {p.name}
                </span>
              ))}
              <span className="relative ml-auto h-px w-24 bg-white/15">
                <span className="absolute inset-y-0 left-0 bg-gold" style={{ width: `${pct * 100}%` }} />
              </span>
            </div>
          </div>
        </div>
        <div>
          {PILLARS.map((p, i) => (
            <Panel key={p.name} p={p} i={i} onActive={setActive} />
          ))}
        </div>
      </div>
    </section>
  );
}
