"use client";

import { useRef, useState } from "react";
import { AnimatePresence, motion, useScroll, useTransform } from "motion/react";
import { Counter, EASE, Mark, RevealLines, Rise, SectionTag } from "./ui";

const STATS = [
  { n: 250, s: "+", l: "Engagements delivered", d: "Across BFSI, fintech, healthcare and SaaS." },
  { n: 98, s: "%", l: "First-submission audit pass rate", d: "Certifications won at the first attempt." },
  { n: 40, s: "%", l: "Control redundancy removed", d: "Fewer controls, stronger coverage." },
  { n: 0, s: "", l: "Regulatory penalties", d: "For clients under active assurance." },
];

const SECTORS = ["Banking", "Capital Markets", "Insurance", "Fintech", "Healthcare", "SaaS", "Manufacturing", "Public Sector"];

const QUOTES = [
  {
    q: "TripleArc turned our compliance function from a cost we tolerated into an asset the board asks about first.",
    a: "Chief Risk Officer",
    o: "Tier-1 private bank",
  },
  {
    q: "We passed ISO 27001 and SOC 2 in the same quarter — with fewer controls than we started with.",
    a: "Chief Information Security Officer",
    o: "Listed fintech platform",
  },
  {
    q: "The first advisors who spoke the regulator's language and our engineers' language in the same meeting.",
    a: "Group General Counsel",
    o: "Healthcare network",
  },
];

export function Proof() {
  const ref = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start end", "end start"] });
  const x1 = useTransform(scrollYProgress, [0, 1], ["0%", "-30%"]);
  const x2 = useTransform(scrollYProgress, [0, 1], ["-30%", "0%"]);

  return (
    <section ref={ref} id="proof" className="relative overflow-hidden bg-pearl pt-28 text-ink md:pt-40">
      <div className="mx-auto max-w-[1600px] px-6 md:px-10">
        <div className="flex flex-col justify-between gap-10 md:flex-row md:items-end">
          <div>
            <SectionTag index="05" dark={false}>
              Ledger of evidence
            </SectionTag>
            <h2 className="mt-8 text-[clamp(2.6rem,6.5vw,6.8rem)] font-light leading-[0.95] tracking-[-0.045em]">
              <RevealLines lines={["Built for", <span key="b" className="font-serif italic text-royal">scrutiny.</span>]} />
            </h2>
          </div>
          <Rise className="max-w-sm text-[15px] leading-relaxed text-ink/60">
            Numbers we are prepared to defend in front of any auditor — because we built the evidence trail behind each one.
          </Rise>
        </div>

        <div className="mt-20 grid border-t border-ink/15 sm:grid-cols-2 lg:grid-cols-4">
          {STATS.map((s, i) => (
            <Rise
              key={s.l}
              delay={i * 0.08}
              className="group relative border-b border-ink/15 py-10 sm:px-6 lg:border-b-0 lg:border-r lg:py-14 lg:first:pl-0 lg:last:border-r-0"
            >
              <p className="font-mono text-[11px] text-ink/40">REF TA-0{198 + i * 7}</p>
              <p className="mt-6 text-[clamp(4.5rem,8vw,8.5rem)] font-light leading-none tracking-[-0.06em]">
                <Counter to={s.n} suffix={s.s} />
              </p>
              <p className="mt-6 text-[15px] font-semibold">{s.l}</p>
              <p className="mt-2 text-[14px] text-ink/55">{s.d}</p>
              <span className="absolute bottom-0 left-0 h-[2px] w-0 bg-gold transition-all duration-700 group-hover:w-full" />
            </Rise>
          ))}
        </div>
      </div>

      {/* sectors — counter-scrolling lines */}
      <div className="mt-28 space-y-2 border-y border-ink/10 py-10 md:mt-40">
        <motion.div style={{ x: x1 }} className="flex whitespace-nowrap text-[clamp(3rem,8vw,8rem)] font-light leading-none tracking-[-0.04em]">
          {[...SECTORS, ...SECTORS].map((s, i) => (
            <span key={i} className="flex items-center">
              <span className={i % 2 ? "font-serif italic text-royal" : ""}>{s}</span>
              <Mark className="mx-8 h-[0.5em] w-[0.5em]" width={0.16} />
            </span>
          ))}
        </motion.div>
        <motion.div
          style={{ x: x2 }}
          className="flex whitespace-nowrap text-[clamp(3rem,8vw,8rem)] font-light leading-none tracking-[-0.04em] text-transparent [-webkit-text-stroke:1px_rgba(10,29,47,0.25)]"
        >
          {[...SECTORS].reverse().concat([...SECTORS].reverse()).map((s, i) => (
            <span key={i} className="px-8">
              {s}
            </span>
          ))}
        </motion.div>
      </div>
    </section>
  );
}

export function Voices() {
  const [i, setI] = useState(0);
  const q = QUOTES[i];
  return (
    <section className="relative overflow-hidden bg-navy px-6 py-28 md:px-10 md:py-40">
      <Mark className="pointer-events-none absolute -left-40 -bottom-40 h-[40rem] w-[40rem] opacity-[0.05]" width={0.03} />
      <div className="relative mx-auto grid max-w-[1600px] gap-14 md:grid-cols-12">
        <div className="md:col-span-3">
          <SectionTag index="06">In their words</SectionTag>
          <div className="mt-10 flex gap-3">
            {QUOTES.map((_, k) => (
              <button
                key={k}
                onClick={() => setI(k)}
                className={`label flex h-12 w-12 items-center justify-center rounded-full border transition-colors duration-500 ${
                  k === i ? "border-gold bg-gold text-ink" : "border-white/15 text-pearl/60 hover:border-gold/60"
                }`}
                aria-label={`Show quote ${k + 1}`}
              >
                0{k + 1}
              </button>
            ))}
          </div>
        </div>
        <div className="min-h-[22rem] md:col-span-9">
          <span className="font-serif text-8xl leading-none text-gold">“</span>
          <AnimatePresence mode="wait">
            <motion.figure key={i} initial="h" animate="s" exit="x">
              <blockquote className="-mt-8 text-[clamp(1.8rem,3.8vw,3.9rem)] font-light leading-[1.12] tracking-[-0.03em]">
                {q.q.split(" ").map((w, k) => (
                  <span key={k} className="inline-block overflow-hidden pb-1 align-top">
                    <motion.span
                      className="mr-[0.25em] inline-block"
                      variants={{ h: { y: "100%" }, s: { y: 0 }, x: { y: "-100%" } }}
                      transition={{ duration: 0.7, ease: EASE, delay: k * 0.018 }}
                    >
                      {w}
                    </motion.span>
                  </span>
                ))}
              </blockquote>
              <motion.figcaption
                variants={{ h: { opacity: 0 }, s: { opacity: 1 }, x: { opacity: 0 } }}
                transition={{ duration: 0.6, delay: 0.4 }}
                className="mt-10 flex items-center gap-4"
              >
                <span className="h-px w-12 bg-gold" />
                <span className="text-[15px] font-semibold">{q.a}</span>
                <span className="label text-pearl/45">{q.o}</span>
              </motion.figcaption>
            </motion.figure>
          </AnimatePresence>
        </div>
      </div>
    </section>
  );
}
