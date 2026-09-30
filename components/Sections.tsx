"use client";

import { useEffect, useRef, useState } from "react";
import { AnimatePresence, motion, useInView, useScroll, useTransform } from "motion/react";
import { ARCS, Arrow, BlurWords, Button, CountUp, EASE, lerpRange, Logo, MARK, MARK_BOX, Mark, Pill, Reveal, SectionHead, spotMove } from "./ui";
import { Bars, Controls, Heatmap } from "./Widgets";

const WRAP = "mx-auto max-w-[1280px] px-5 md:px-8";

/* ------------------------------------------------------------------ Frameworks */

const FRAMEWORKS = ["ISO 27001:2022", "SOC 2 Type II", "DPDP Act", "SEBI CSCRF", "RBI IT Governance", "GDPR", "NIST CSF 2.0", "PCI DSS 4.0", "ISO 42001", "DORA", "HIPAA"];

export function Frameworks() {
  return (
    <section className="py-16 md:py-20">
      <Reveal className="text-center text-[13px] font-medium text-slate">Fluent in the frameworks that bind you</Reveal>
      <div className="relative mt-8 overflow-hidden [mask-image:linear-gradient(90deg,transparent,#000_12%,#000_88%,transparent)]">
        <div className="marquee" style={{ ["--dur" as string]: "50s" }}>
          {[0, 1].map((k) => (
            <div key={k} className="flex shrink-0 gap-3 pr-3">
              {FRAMEWORKS.map((f) => (
                <span
                  key={f + k}
                  className="flex items-center gap-2.5 rounded-full border border-line bg-white px-5 py-3 text-[14px] font-semibold text-ink transition-colors duration-300 hover:border-royal hover:text-royal"
                >
                  <Mark className="h-4 w-4 text-royal" width={0.16} />
                  {f}
                </span>
              ))}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ----------------------------------------------------------------------- Bento */

const CARD = "spot group overflow-hidden rounded-[28px] border border-line bg-white p-7 transition-[transform,box-shadow] duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] hover:-translate-y-1 hover:shadow-lift md:p-8";

function CornerArrow({ dark = false }: { dark?: boolean }) {
  return (
    <span
      className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-full transition-all duration-500 group-hover:rotate-45 ${
        dark ? "bg-white/10 text-white group-hover:bg-white group-hover:text-royal" : "bg-paper text-ink group-hover:bg-royal group-hover:text-white"
      }`}
    >
      <Arrow className="h-3.5 w-3.5" />
    </span>
  );
}

/** Board → committees → policies, with connectors that draw themselves. */
function OrgDiagram() {
  const ref = useRef<SVGSVGElement>(null);
  const inView = useInView(ref, { once: true, margin: "0px 0px -10% 0px" });
  const node = (x: number, y: number, w: number, label: string, i: number, main = false) => (
    <motion.g
      key={label}
      initial={{ opacity: 0, y: 8 }}
      animate={inView ? { opacity: 1, y: 0 } : undefined}
      transition={{ delay: 0.2 + i * 0.12, duration: 0.6, ease: EASE }}
    >
      <rect x={x - w / 2} y={y} width={w} height={34} rx={17} fill={main ? "var(--royal)" : "#fff"} stroke={main ? "none" : "var(--line)"} />
      <text x={x} y={y + 21.5} textAnchor="middle" fontSize="12" fontWeight="600" fill={main ? "#fff" : "var(--ink)"}>
        {label}
      </text>
    </motion.g>
  );
  const line = (d: string, i: number) => (
    <motion.path
      key={d}
      d={d}
      fill="none"
      stroke="var(--royal)"
      strokeOpacity={0.35}
      strokeWidth={1.5}
      initial={{ pathLength: 0 }}
      animate={inView ? { pathLength: 1 } : undefined}
      transition={{ delay: 0.4 + i * 0.12, duration: 0.8, ease: EASE }}
    />
  );
  return (
    <svg ref={ref} viewBox="0 0 520 210" className="w-full">
      {[
        "M260 44 V66 H90 V88",
        "M260 44 V88",
        "M260 44 V66 H430 V88",
        "M90 122 V166",
        "M260 122 V166",
        "M430 122 V166",
      ].map(line)}
      {node(260, 10, 120, "Board", 0, true)}
      {node(90, 88, 130, "Risk committee", 1)}
      {node(260, 88, 138, "Audit committee", 2)}
      {node(430, 88, 130, "Compliance", 3)}
      {node(90, 166, 120, "Risk appetite", 4)}
      {node(260, 166, 120, "Audit plan", 5)}
      {node(430, 166, 130, "Policy library", 6)}
    </svg>
  );
}

/** The mark with its three arcs lighting up in turn. */
function CyclingMark() {
  const [a, setA] = useState(0);
  useEffect(() => {
    const id = setInterval(() => setA((v) => (v + 1) % 3), 1800);
    return () => clearInterval(id);
  }, []);
  return (
    <svg viewBox={MARK_BOX} className="h-36 w-36">
      {ARCS.map((d, i) => (
        <motion.path
          key={i}
          d={d}
          fill="none"
          strokeWidth={0.09}
          strokeLinecap="round"
          animate={{ stroke: i === a ? "#d4af37" : "rgba(255,255,255,0.22)" }}
          transition={{ duration: 0.8 }}
        />
      ))}
    </svg>
  );
}

export function Bento() {
  return (
    <section id="services" className={`${WRAP} py-20 md:py-28`}>
      <SectionHead tag="What we do" title="Three disciplines, one clear structure." accentFrom={3}>
        Each practice stands alone. Together they give the board a single, defensible picture of the enterprise.
      </SectionHead>

      <div className="mt-14 grid gap-4 md:grid-cols-6 md:gap-5">
        <Reveal className={`${CARD} md:col-span-4`} onPointerMove={spotMove}>
          <div className="flex items-start justify-between gap-6">
            <div>
              <p className="tag text-royal">01 · Governance</p>
              <h3 className="mt-3 text-[26px] font-semibold tracking-[-0.03em]">Structures that decide</h3>
              <p className="mt-2 max-w-md text-[15px] leading-relaxed text-slate">
                Charters, policies and accountabilities that turn board intent into decisions — and decisions into evidence.
              </p>
            </div>
            <CornerArrow />
          </div>
          <div className="mt-8 rounded-2xl bg-paper p-4 md:p-6">
            <OrgDiagram />
          </div>
        </Reveal>

        <Reveal delay={0.08} className={`${CARD} md:col-span-2`} onPointerMove={spotMove}>
          <div className="flex items-start justify-between gap-6">
            <p className="tag text-royal">02 · Risk</p>
            <CornerArrow />
          </div>
          <h3 className="mt-3 text-[26px] font-semibold tracking-[-0.03em]">Measured before it is felt</h3>
          <p className="mt-2 text-[15px] leading-relaxed text-slate">Exposure quantified in money and tracked continuously.</p>
          <div className="mx-auto mt-8 max-w-[220px]">
            <Heatmap bare />
          </div>
        </Reveal>

        <Reveal className={`${CARD} md:col-span-2`} onPointerMove={spotMove}>
          <div className="flex items-start justify-between gap-6">
            <p className="tag text-royal">03 · Compliance</p>
            <CornerArrow />
          </div>
          <h3 className="mt-3 text-[26px] font-semibold tracking-[-0.03em]">Holds when it is tested</h3>
          <p className="mt-2 text-[15px] leading-relaxed text-slate">Every obligation mapped to a control, every control to its evidence.</p>
          <div className="mt-7">
            <Controls bare />
          </div>
        </Reveal>

        <Reveal delay={0.08} className={`${CARD} md:col-span-2`} onPointerMove={spotMove}>
          <p className="tag text-royal">Residual risk</p>
          <p className="mt-3 text-[44px] font-bold leading-none tracking-[-0.05em]">
            −<CountUp to={62} suffix="%" />
          </p>
          <p className="mt-2 text-[15px] text-slate">Average reduction within two quarters.</p>
          <div className="mt-8">
            <Bars />
          </div>
        </Reveal>

        <Reveal
          delay={0.16}
          onPointerMove={spotMove}
          style={{ ["--spot" as string]: "rgba(255,255,255,0.12)" }}
          className="spot group flex flex-col justify-between overflow-hidden rounded-[28px] bg-deep p-7 text-white transition-[transform,box-shadow] duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] hover:-translate-y-1 hover:shadow-lift md:col-span-2 md:p-8"
        >
          <div className="flex items-start justify-between">
            <CyclingMark />
            <CornerArrow dark />
          </div>
          <div>
            <h3 className="text-[26px] font-semibold tracking-[-0.03em]">Three arcs, woven</h3>
            <p className="mt-2 text-[15px] leading-relaxed text-white/60">So none can fail alone. That is the idea behind the name.</p>
          </div>
        </Reveal>
      </div>
    </section>
  );
}

/* --------------------------------------------------------------------- Process */

const STEPS = [
  { t: "Diagnose", d: "We baseline maturity against the frameworks that bind you and rank every gap by exposure — not by volume.", out: ["Maturity report", "Risk universe"], tone: "bg-white text-ink border border-line", sub: "text-slate", chip: "bg-paper text-ink" },
  { t: "Design", d: "A target structure of policies, controls and owners, sized to the business rather than copied from a template.", out: ["Control framework", "Risk charter"], tone: "bg-sky text-ink", sub: "text-slate", chip: "bg-white text-ink" },
  { t: "Deploy", d: "Controls are embedded in the workflows people already use, with evidence captured where the work happens.", out: ["Live registers", "Automated evidence"], tone: "bg-royal text-white", sub: "text-white/70", chip: "bg-white/15 text-white" },
  { t: "Assure", d: "Independent testing, internal audit and certification support — until the auditor has nothing left to ask.", out: ["Audit pack", "Certification"], tone: "bg-deep text-white", sub: "text-white/60", chip: "bg-white/10 text-white" },
];

function StepCard({ s, i, total }: { s: (typeof STEPS)[number]; i: number; total: number }) {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start 0.25", "end start"] });
  // As the next card slides over, this one eases back a little.
  const scale = useTransform(scrollYProgress, (v) => (i === total - 1 ? 1 : lerpRange(v, [0, 1], [1, 0.92])));
  const dark = i >= 2;
  return (
    <div ref={ref} className="sticky pb-6" style={{ top: `${7 + i * 1.5}rem` }}>
      <motion.div
        style={{ scale }}
        className={`grid origin-top gap-8 overflow-hidden rounded-[32px] p-8 shadow-soft md:min-h-[400px] md:grid-cols-2 md:p-12 ${s.tone}`}
      >
        <div className="flex flex-col justify-between gap-10">
          <span className={`tag ${dark ? "text-white/60" : "text-royal"}`}>Step {String(i + 1).padStart(2, "0")} / 04</span>
          <div>
            <h3 className="h-display text-[clamp(2.4rem,4.4vw,3.8rem)]">{s.t}</h3>
            <p className={`mt-5 max-w-md text-[16px] leading-relaxed ${s.sub}`}>{s.d}</p>
            <div className="mt-7 flex flex-wrap gap-2">
              {s.out.map((o) => (
                <span key={o} className={`tag rounded-full px-4 py-2 ${s.chip}`}>
                  {o}
                </span>
              ))}
            </div>
          </div>
        </div>
        <div className="relative hidden items-center justify-center md:flex">
          <svg viewBox={MARK_BOX} className="h-64 w-64">
            {ARCS.map((d, k) => (
              <path key={k} d={d} fill="none" stroke="currentColor" strokeOpacity={0.12} strokeWidth={0.05} strokeLinecap="round" />
            ))}
            {ARCS.map((d, k) =>
              k <= Math.min(i, 2) ? (
                <motion.path
                  key={`on${k}`}
                  d={d}
                  fill="none"
                  stroke={dark ? "var(--gold)" : "var(--royal)"}
                  strokeWidth={0.07}
                  strokeLinecap="round"
                  initial={{ pathLength: 0 }}
                  whileInView={{ pathLength: 1 }}
                  viewport={{ once: true, margin: "-20%" }}
                  transition={{ duration: 1.4, ease: EASE, delay: 0.2 + k * 0.25 }}
                />
              ) : null,
            )}
            {i === 3 && (
              <motion.circle
                r={1.12}
                cy={-0.03}
                fill="none"
                stroke="var(--gold)"
                strokeOpacity={0.5}
                strokeWidth={0.02}
                initial={{ pathLength: 0 }}
                whileInView={{ pathLength: 1 }}
                viewport={{ once: true, margin: "-20%" }}
                transition={{ duration: 1.6, ease: EASE, delay: 1 }}
              />
            )}
          </svg>
          <span className={`absolute right-0 top-0 text-[120px] font-bold leading-none tracking-[-0.06em] ${dark ? "text-white/[0.06]" : "text-ink/[0.05]"}`}>
            {i + 1}
          </span>
        </div>
      </motion.div>
    </div>
  );
}

export function Process() {
  return (
    <section id="process" className={`${WRAP} py-20 md:py-28`}>
      <SectionHead tag="How we work" title="Four moves from exposure to assurance." accentFrom={5}>
        Every move closes with a signed artefact, so progress is never a matter of opinion.
      </SectionHead>
      <div className="mt-14">
        {STEPS.map((s, i) => (
          <StepCard key={s.t} s={s} i={i} total={STEPS.length} />
        ))}
      </div>
    </section>
  );
}

/* --------------------------------------------------------------------- Results */

const STATS = [
  { n: 250, s: "+", l: "Engagements delivered" },
  { n: 98, s: "%", l: "First-submission audit pass rate" },
  { n: 40, s: "%", l: "Control redundancy removed" },
  { n: 0, s: "", l: "Regulatory penalties under our assurance" },
];

const QUOTES = [
  { q: "TripleArc turned compliance from a cost we tolerated into the first thing our board asks about.", a: "Chief Risk Officer", o: "Tier-1 private bank", i: "CR" },
  { q: "We passed ISO 27001 and SOC 2 in the same quarter — with fewer controls than we started with.", a: "Chief Information Security Officer", o: "Listed fintech platform", i: "CI" },
  { q: "The first advisors who spoke the regulator's language and our engineers' language in the same meeting.", a: "Group General Counsel", o: "Healthcare network", i: "GC" },
];

const SLIDE_MS = 6000;

export function Results() {
  const [idx, setIdx] = useState(0);
  const [dir, setDir] = useState(1);
  const go = (d: number) => {
    setDir(d);
    setIdx((v) => (v + d + QUOTES.length) % QUOTES.length);
  };
  useEffect(() => {
    const id = setTimeout(() => go(1), SLIDE_MS);
    return () => clearTimeout(id);
  }, [idx]);
  const q = QUOTES[idx];

  return (
    <section id="results" className={`${WRAP} py-20 md:py-28`}>
      <SectionHead tag="Results" title="Numbers we can defend." accentFrom={3} />

      <div className="mt-14 grid grid-cols-2 gap-4 md:grid-cols-4 md:gap-5">
        {STATS.map((s, i) => (
          <Reveal key={s.l} delay={i * 0.07} className="rounded-[28px] border border-line bg-white p-6 md:p-8">
            <p className="text-[clamp(2.6rem,5vw,4.2rem)] font-bold leading-none tracking-[-0.05em] text-royal">
              <CountUp to={s.n} suffix={s.s} />
            </p>
            <p className="mt-4 text-[14px] leading-snug text-slate">{s.l}</p>
          </Reveal>
        ))}
      </div>

      <Reveal className="mt-5 overflow-hidden rounded-[32px] bg-white p-8 shadow-soft md:p-14">
        <div className="grid gap-10 md:grid-cols-[1fr_auto] md:items-end">
          <div className="min-h-[15rem] md:min-h-[13rem]">
            <svg viewBox="0 0 40 30" className="h-8 w-10 text-royal" fill="currentColor" aria-hidden>
              <path d="M0 30V17C0 7 5 1 15 0v6c-5 1-7 4-7 9h7v15H0Zm22 0V17C22 7 27 1 37 0v6c-5 1-7 4-7 9h7v15H22Z" />
            </svg>
            <AnimatePresence mode="wait" custom={dir}>
              <motion.figure
                key={idx}
                custom={dir}
                variants={{
                  enter: (d: number) => ({ opacity: 0, x: 40 * d, filter: "blur(8px)" }),
                  show: { opacity: 1, x: 0, filter: "blur(0px)" },
                  exit: (d: number) => ({ opacity: 0, x: -40 * d, filter: "blur(8px)" }),
                }}
                initial="enter"
                animate="show"
                exit="exit"
                transition={{ duration: 0.5, ease: EASE }}
              >
                <blockquote className="mt-6 max-w-3xl text-[clamp(1.4rem,2.8vw,2.3rem)] font-medium leading-[1.25] tracking-[-0.025em]">{q.q}</blockquote>
                <figcaption className="mt-8 flex items-center gap-4">
                  <span className="flex h-12 w-12 items-center justify-center rounded-full bg-sky text-[14px] font-bold text-royal">{q.i}</span>
                  <span>
                    <span className="block text-[15px] font-semibold">{q.a}</span>
                    <span className="block text-[13px] text-slate">{q.o}</span>
                  </span>
                </figcaption>
              </motion.figure>
            </AnimatePresence>
          </div>
          <div className="flex items-center gap-3">
            {[-1, 1].map((d) => (
              <motion.button
                key={d}
                whileTap={{ scale: 0.9 }}
                onClick={() => go(d)}
                aria-label={d < 0 ? "Previous quote" : "Next quote"}
                className="flex h-12 w-12 items-center justify-center rounded-full border border-line text-ink transition-colors duration-300 hover:border-royal hover:bg-royal hover:text-white"
              >
                <Arrow className={`h-3.5 w-3.5 ${d < 0 ? "-rotate-[135deg]" : "rotate-45"}`} />
              </motion.button>
            ))}
          </div>
        </div>
        <div className="mt-10 flex gap-2">
          {QUOTES.map((_, k) => (
            <button key={k} onClick={() => { setDir(k > idx ? 1 : -1); setIdx(k); }} aria-label={`Quote ${k + 1}`} className="h-1 flex-1 overflow-hidden rounded-full bg-line">
              {k === idx && (
                <motion.span
                  key={idx}
                  className="block h-full origin-left bg-royal"
                  initial={{ scaleX: 0 }}
                  animate={{ scaleX: 1 }}
                  transition={{ duration: SLIDE_MS / 1000, ease: "linear" }}
                />
              )}
            </button>
          ))}
        </div>
      </Reveal>
    </section>
  );
}

/* ------------------------------------------------------------------------- FAQ */

const FAQS = [
  ["How long does a typical engagement take?", "Most programmes run eight to twelve weeks from diagnosis to a signed-off control framework. Certification support adds four to six weeks, depending on the auditor's calendar."],
  ["Do you replace our internal risk and compliance team?", "No. We work alongside your team, transfer the method as we go, and leave you with a structure you can run without us."],
  ["Which regulators and frameworks do you cover?", "RBI, SEBI, IRDAI and the DPDP Act in India; GDPR, DORA and NIS2 in Europe; plus ISO 27001, ISO 42001, SOC 2, PCI DSS and NIST CSF."],
  ["Can you work with the GRC tooling we already have?", "Yes. We are tool-agnostic and regularly implement on ServiceNow, Archer, MetricStream, OneTrust and lighter-weight platforms."],
  ["How do you price?", "Fixed fee per outcome. You know the cost before we start, and each phase ends with an artefact you sign off."],
];

export function Faq() {
  const [open, setOpen] = useState<number | null>(0);
  return (
    <section id="faq" className={`${WRAP} py-20 md:py-28`}>
      <div className="grid gap-12 md:grid-cols-12">
        <div className="md:col-span-5">
          <div className="md:sticky md:top-32">
            <Reveal y={12}>
              <Pill>Questions</Pill>
            </Reveal>
            <h2 className="h-display mt-6 text-[clamp(2.2rem,4.6vw,4rem)]">
              <BlurWords text="Asked before every engagement." accent={{ from: 2, className: "text-royal" }} />
            </h2>
            <Reveal delay={0.2} className="mt-8">
              <Button href="#contact" variant="outline">
                Ask us anything
              </Button>
            </Reveal>
          </div>
        </div>
        <div className="space-y-3 md:col-span-7">
          {FAQS.map(([q, a], i) => {
            const on = open === i;
            return (
              <Reveal key={q} delay={i * 0.05}>
                <div className={`rounded-3xl border transition-colors duration-500 ${on ? "border-transparent bg-white shadow-soft" : "border-line bg-transparent hover:bg-white"}`}>
                  <button onClick={() => setOpen(on ? null : i)} aria-expanded={on} className="flex w-full items-center justify-between gap-6 p-6 text-left md:px-8">
                    <span className="text-[17px] font-semibold tracking-[-0.01em]">{q}</span>
                    <motion.span
                      animate={{ rotate: on ? 45 : 0, backgroundColor: on ? "#0f4cb1" : "#e8f0fd", color: on ? "#ffffff" : "#0f4cb1" }}
                      transition={{ type: "spring", stiffness: 300, damping: 22 }}
                      className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full"
                    >
                      <svg viewBox="0 0 12 12" className="h-3 w-3" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round">
                        <path d="M6 1v10M1 6h10" />
                      </svg>
                    </motion.span>
                  </button>
                  <AnimatePresence initial={false}>
                    {on && (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: "auto", opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.45, ease: EASE }}
                        className="overflow-hidden"
                      >
                        <p className="max-w-xl px-6 pb-7 text-[15px] leading-relaxed text-slate md:px-8">{a}</p>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              </Reveal>
            );
          })}
        </div>
      </div>
    </section>
  );
}

/* ------------------------------------------------------------------ CTA + Footer */

export function Cta() {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start end", "end end"] });
  const scale = useTransform(scrollYProgress, (v) => lerpRange(v, [0, 0.8], [0.9, 1]));
  const radius = useTransform(scrollYProgress, (v) => `${lerpRange(v, [0, 0.8], [64, 40])}px`);

  return (
    <section id="contact" ref={ref} className="px-3 pb-3 md:px-4 md:pb-4">
      <motion.div
        style={{ scale, borderRadius: radius, background: "radial-gradient(110% 120% at 50% 100%, #2a6fe0 0%, #0f4cb1 35%, #0a2f78 70%, #081a3a 100%)" }}
        className="relative overflow-hidden px-6 py-24 text-center text-white md:py-36"
      >
        <div className="dots absolute inset-0 [mask-image:radial-gradient(60%_70%_at_50%_70%,#000,transparent)]" />
        <div className="pointer-events-none absolute left-1/2 top-1/2 h-[120vmin] w-[120vmin] -translate-x-1/2 -translate-y-1/2" aria-hidden>
          {[0, 1, 2].map((i) => (
            <motion.svg
              key={i}
              viewBox={MARK_BOX}
              className="absolute inset-0 h-full w-full"
              animate={{ scale: [0.3, 1.3], opacity: [0, 0.35, 0] }}
              transition={{ duration: 9, repeat: Infinity, delay: i * 3, ease: "easeOut", times: [0, 0.3, 1] }}
            >
              <path d={MARK} fill="none" stroke="white" strokeWidth={0.008} />
            </motion.svg>
          ))}
        </div>
        <div className="relative mx-auto max-w-3xl">
          <Pill className="bg-white/10 text-white ring-1 ring-inset ring-white/20">Let&apos;s talk</Pill>
          <h2 className="h-display mt-7 text-[clamp(2.6rem,6.4vw,5.4rem)]">
            <BlurWords text="Ready when the" />
            <br />
            <BlurWords text="regulator is." delay={0.2} className="text-white/60" />
          </h2>
          <Reveal delay={0.3} className="mx-auto mt-6 max-w-md text-[16px] leading-relaxed text-white/70">
            A thirty-minute call with a partner. No deck, no pitch — just your exposure and what we would do about it.
          </Reveal>
          <Reveal delay={0.4} className="mt-9 flex flex-wrap justify-center gap-3">
            <Button href="mailto:hello@triplearcgrc.com" variant="white">
              Book a consultation
            </Button>
            <Button href="mailto:hello@triplearcgrc.com" variant="ghost">
              hello@triplearcgrc.com
            </Button>
          </Reveal>
        </div>
      </motion.div>
    </section>
  );
}

const FOOT = [
  ["Practice", ["Governance", "Risk", "Compliance", "AI governance"]],
  ["Company", ["About", "Insights", "Careers", "Contact"]],
  ["Offices", ["Mumbai", "London", "Dubai"]],
] as const;

export function Footer() {
  return (
    <footer className={`${WRAP} pb-10 pt-16 md:pt-24`}>
      <div className="grid gap-12 md:grid-cols-12">
        <div className="md:col-span-5">
          <Logo />
          <p className="mt-5 max-w-xs text-[14px] leading-relaxed text-slate">Independent governance, risk and compliance advisory for regulated enterprises.</p>
        </div>
        {FOOT.map(([h, items]) => (
          <div key={h} className="md:col-span-2">
            <p className="tag text-slate">{h}</p>
            <ul className="mt-5 space-y-3">
              {items.map((it) => (
                <li key={it}>
                  <a href="#top" className="group relative text-[15px] font-medium">
                    {it}
                    <span className="absolute -bottom-0.5 left-0 h-px w-full origin-right scale-x-0 bg-royal transition-transform duration-500 ease-out group-hover:origin-left group-hover:scale-x-100" />
                  </a>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>
      <div className="mt-16 flex flex-col justify-between gap-3 border-t border-line pt-6 text-[13px] text-slate sm:flex-row">
        <p>© {new Date().getFullYear()} TripleArc GRC Solutions</p>
        <p>Governance · Risk · Compliance</p>
      </div>
    </footer>
  );
}
