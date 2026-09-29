"use client";

import { useLayoutEffect, useRef, useState } from "react";
import { motion, useScroll, useSpring, useTransform } from "motion/react";
import { RevealLines, SectionTag } from "./ui";

const STEPS = [
  { t: "Diagnose", d: "Maturity baselined against the frameworks that bind you. Gaps ranked by exposure, not by volume.", o: ["Maturity report", "Risk universe"] },
  { t: "Design", d: "A target architecture of policies, controls and owners — sized to your business, not to a template.", o: ["Control framework", "Risk charter"] },
  { t: "Deploy", d: "Controls embedded into workflows and systems. Evidence captured where the work happens.", o: ["Live registers", "Automated evidence"] },
  { t: "Assure", d: "Independent testing, internal audit and certification support — until the auditor has nothing left to ask.", o: ["Audit pack", "Certification"] },
  { t: "Evolve", d: "Regulatory horizon scanning and quarterly recalibration keep the system ahead of the rulebook.", o: ["Horizon briefings", "Board reporting"] },
];

export default function Method() {
  const section = useRef<HTMLElement>(null);
  const track = useRef<HTMLDivElement>(null);
  const [dist, setDist] = useState(0);

  useLayoutEffect(() => {
    const measure = () => {
      const el = track.current;
      if (el) setDist(Math.max(el.scrollWidth - window.innerWidth, 0));
    };
    measure();
    window.addEventListener("resize", measure);
    return () => window.removeEventListener("resize", measure);
  }, []);

  const { scrollYProgress } = useScroll({ target: section, offset: ["start start", "end end"] });
  const smooth = useSpring(scrollYProgress, { stiffness: 120, damping: 30, mass: 0.3 });
  const x = useTransform(smooth, (v) => -v * dist);
  const draw = useTransform(smooth, [0, 1], [0.02, 1]);

  return (
    <section
      ref={section}
      id="method"
      className="relative bg-ink md:h-[480vh]"
    >
      <div className="relative overflow-hidden md:sticky md:top-0 md:h-screen">
        <div
          className="pointer-events-none absolute inset-0"
          style={{ background: "radial-gradient(70% 60% at 80% 100%, rgba(22,119,201,0.28), transparent 70%)" }}
        />
        <motion.div
          ref={track}
          style={{ x }}
          className="relative flex h-full flex-col gap-6 px-6 py-28 md:w-max md:flex-row md:items-center md:gap-0 md:px-0 md:py-0"
        >
          {/* thread */}
          <svg className="pointer-events-none absolute left-0 top-1/2 hidden h-40 w-full -translate-y-1/2 md:block" viewBox="0 0 1000 100" preserveAspectRatio="none" aria-hidden>
            <path d="M0 50 C 60 10, 120 90, 200 50 S 340 10, 400 50 S 540 90, 600 50 S 740 10, 800 50 S 940 90, 1000 50" fill="none" stroke="rgba(245,247,250,0.08)" strokeWidth="1" vectorEffect="non-scaling-stroke" />
            <motion.path
              d="M0 50 C 60 10, 120 90, 200 50 S 340 10, 400 50 S 540 90, 600 50 S 740 10, 800 50 S 940 90, 1000 50"
              fill="none"
              stroke="#d4af37"
              strokeWidth="1.5"
              vectorEffect="non-scaling-stroke"
              style={{ pathLength: draw }}
            />
          </svg>

          <div className="relative flex shrink-0 flex-col justify-center md:h-full md:w-[46vw] md:pl-10 md:pr-16">
            <SectionTag index="04">The TripleArc method</SectionTag>
            <h2 className="mt-8 text-[clamp(2.6rem,6vw,6.4rem)] font-light leading-[0.95] tracking-[-0.045em]">
              <RevealLines lines={["Five moves.", <span key="b" className="gold-text font-serif italic">Zero drift.</span>]} />
            </h2>
            <p className="mt-8 max-w-md text-[16px] leading-relaxed text-pearl/60">
              A proven sequence refined across 250+ engagements. Each move closes with a signed artefact, so progress is never a matter of opinion.
            </p>
            <p className="label mt-12 hidden items-center gap-3 text-pearl/40 md:flex">
              Keep scrolling <span className="inline-block h-px w-10 bg-gold" />
            </p>
          </div>

          {STEPS.map((s, i) => (
            <article
              key={s.t}
              className="group relative flex shrink-0 flex-col justify-between rounded-3xl border border-white/10 bg-white/[0.03] p-8 backdrop-blur-sm transition-colors duration-700 hover:border-gold/40 hover:bg-white/[0.06] md:mr-8 md:h-[62vh] md:w-[28vw] md:min-w-[340px] md:p-10"
            >
              <div className="flex items-start justify-between">
                <span className="text-outline font-serif text-[7rem] leading-[0.8] transition-[-webkit-text-stroke-color] duration-700 group-hover:[-webkit-text-stroke-color:#d4af37] md:text-[9rem]">
                  {String(i + 1).padStart(2, "0")}
                </span>
                <span className="relative mt-3 flex h-3 w-3 items-center justify-center">
                  <span className="absolute h-3 w-3 animate-ping rounded-full bg-gold/40" />
                  <span className="h-2 w-2 rounded-full bg-gold" />
                </span>
              </div>
              <div className="mt-10">
                <h3 className="text-4xl font-light tracking-[-0.03em] md:text-5xl">{s.t}</h3>
                <p className="mt-5 text-[15px] leading-relaxed text-pearl/60">{s.d}</p>
                <div className="mt-8 flex flex-wrap gap-2">
                  {s.o.map((o) => (
                    <span key={o} className="label rounded-full border border-white/15 px-3 py-2 !text-[10px] text-pearl/70">
                      {o}
                    </span>
                  ))}
                </div>
              </div>
            </article>
          ))}
          <div className="hidden w-[10vw] shrink-0 md:block" />
        </motion.div>
      </div>
    </section>
  );
}
