"use client";

import { useRef } from "react";
import dynamic from "next/dynamic";
import { motion, useMotionValueEvent, useScroll, useTransform } from "motion/react";
import { lerpRange, EASE, FadeUp, Lines, MarkArc, Rule, Words } from "./ui";
import { triquetraPath } from "@/lib/triquetra";

const MARK = triquetraPath();

const SilkCanvas = dynamic(() => import("./scene/Canvases").then((m) => m.SilkCanvas), { ssr: false });

/* ----------------------------------------------------------------- Statement */

export function Statement() {
  return (
    <section data-theme="light" className="relative z-10 bg-bone px-6 py-32 text-ink md:px-12 md:py-52">
      <div className="mx-auto grid max-w-[1440px] gap-12 md:grid-cols-12">
        <FadeUp className="md:col-span-3">
          <p className="eyebrow text-graphite/70">The practice</p>
        </FadeUp>
        <div className="md:col-span-9">
          <Words
            className="display max-w-[22ch] text-[clamp(1.9rem,3.6vw,3.5rem)] !leading-[1.12]"
            text="We replace fragmented controls with a single, accountable structure —"
            muted="so decisions move faster, exposure is known, and audits become routine."
          />
          <Rule className="mt-20 text-ink/15" />
          <div className="mt-10 grid gap-10 text-[14px] leading-relaxed text-graphite sm:grid-cols-3">
            {[
              ["Established", "Former regulators, Big Four partners and security leaders."],
              ["Offices", "Mumbai, London and Dubai — serving clients across three continents."],
              ["Clients", "Banks, insurers, fintechs, healthcare networks and listed enterprises."],
            ].map(([t, d], i) => (
              <FadeUp key={t} delay={0.1 + i * 0.08}>
                <p className="eyebrow mb-4 !text-[10px] text-ink">{t}</p>
                <p>{d}</p>
              </FadeUp>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

/* ------------------------------------------------------------ Expanding panel */

const FIGURES = [
  ["250+", "Engagements delivered"],
  ["98%", "First-submission audit pass rate"],
  ["40%", "Control redundancy removed"],
  ["0", "Regulatory penalties under our assurance"],
];

export function Expand() {
  const ref = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start start", "end end"] });
  const clip = useTransform(scrollYProgress, (v) => {
    const t = lerpRange(v, [0.05, 0.55], [1, 0]);
    const eased = t * t * (3 - 2 * t);
    return `inset(${24 * eased}% ${30 * eased}% ${24 * eased}% ${30 * eased}% round ${24 * eased}px)`;
  });
  const inner = useTransform(scrollYProgress, (v) => lerpRange(v, [0.05, 0.55], [1.3, 1]));
  const textO = useTransform(scrollYProgress, (v) => lerpRange(v, [0.6, 0.78], [0, 1]));
  const textY = useTransform(scrollYProgress, (v) => lerpRange(v, [0.6, 0.85], [40, 0]));
  // Once the panel has opened past halfway, the header should read as on-dark.
  useMotionValueEvent(scrollYProgress, "change", (v) => {
    if (ref.current) ref.current.dataset.theme = v > 0.45 ? "dark" : "light";
  });
  const hintO = useTransform(scrollYProgress, (v) => lerpRange(v, [0, 0.2], [1, 0]));

  return (
    <section ref={ref} data-theme="light" className="relative h-[240vh] bg-bone">
      <div className="sticky top-0 h-[100svh] overflow-hidden">
        <motion.p style={{ opacity: hintO }} className="eyebrow absolute inset-x-0 top-[15%] text-center text-graphite/60">
          Built for scrutiny
        </motion.p>
        <motion.div style={{ clipPath: clip }} className="absolute inset-0 bg-ink">
          <motion.div style={{ scale: inner }} className="absolute inset-0">
            <SilkCanvas />
          </motion.div>
          <div className="absolute inset-0 bg-gradient-to-t from-ink/80 via-transparent to-transparent" />
          <motion.div
            style={{ opacity: textO, y: textY }}
            className="absolute inset-x-0 bottom-0 mx-auto max-w-[1440px] px-6 pb-12 md:px-12 md:pb-16"
          >
            <p className="display mb-16 max-w-3xl text-[clamp(2rem,4.4vw,4.2rem)]">
              Evidence you can defend
              <br />
              <span className="text-bone/55">in front of any auditor.</span>
            </p>
            <div className="grid grid-cols-2 gap-y-10 border-t border-bone/15 pt-8 md:grid-cols-4">
              {FIGURES.map(([n, l]) => (
                <div key={l} className="pr-6">
                  <p className="text-[clamp(2.4rem,4vw,3.6rem)] font-light leading-none tracking-[-0.04em]">{n}</p>
                  <p className="mt-4 max-w-[13rem] text-[13px] leading-snug text-bone/60">{l}</p>
                </div>
              ))}
            </div>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}

/* ------------------------------------------------------------------ Expertise */

const PILLARS = [
  {
    name: "Governance",
    line: "Structures that decide.",
    body: "Board oversight made operational — charters, policies and accountabilities that turn intent into evidence.",
    items: ["GRC operating model", "Board & committee charters", "Policy architecture"],
  },
  {
    name: "Risk",
    line: "Measured before it is felt.",
    body: "Enterprise, cyber and third-party risk quantified in money and monitored continuously.",
    items: ["Enterprise risk registers", "Cyber risk quantification", "Third-party risk"],
  },
  {
    name: "Compliance",
    line: "Holds when it is tested.",
    body: "Every obligation mapped to a control, every control to its evidence — audit-ready every day.",
    items: ["DPDP · SEBI · RBI · GDPR", "ISO 27001 · SOC 2", "Internal audit"],
  },
];

export function Expertise() {
  return (
    <section id="expertise" data-theme="dark" className="relative bg-ink px-6 py-32 md:px-12 md:py-48">
      <div className="mx-auto max-w-[1440px]">
        <div className="grid gap-10 md:grid-cols-12">
          <FadeUp className="md:col-span-3">
            <p className="eyebrow text-bone/50">Expertise</p>
          </FadeUp>
          <Lines
            className="display text-[clamp(2rem,4vw,3.8rem)] md:col-span-9"
            lines={["Three arcs, woven", <span key="b" className="text-bone/45">so none can fail alone.</span>]}
          />
        </div>

        <div className="mt-24 grid border-t border-bone/10 md:mt-32 md:grid-cols-3">
          {PILLARS.map((p, i) => (
            <FadeUp
              key={p.name}
              delay={i * 0.12}
              className="group relative border-b border-bone/10 py-12 md:border-b-0 md:border-r md:px-10 md:py-16 md:first:pl-0 md:last:border-r-0 md:last:pr-0"
            >
              <MarkArc active={i} className="h-24 w-24 text-bone transition-transform duration-1000 ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:rotate-[120deg]" />
              <p className="eyebrow mt-14 text-gold">{String(i + 1).padStart(2, "0")}</p>
              <h3 className="mt-5 text-[2rem] font-light tracking-[-0.03em]">{p.name}</h3>
              <p className="mt-2 text-[15px] text-bone/80">{p.line}</p>
              <p className="mt-6 max-w-sm text-[14px] leading-relaxed text-bone/50">{p.body}</p>
              <ul className="mt-10 space-y-3 text-[13px] text-bone/65">
                {p.items.map((it) => (
                  <li key={it} className="flex items-center gap-3">
                    <span className="h-px w-4 bg-gold/70" />
                    {it}
                  </li>
                ))}
              </ul>
            </FadeUp>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ------------------------------------------------------------------- Approach */

const STEPS = [
  ["Diagnose", "Maturity baselined against the frameworks that bind you; gaps ranked by exposure."],
  ["Design", "A target structure of policies, controls and owners, sized to the business."],
  ["Deploy", "Controls embedded in workflows, with evidence captured where the work happens."],
  ["Assure", "Independent testing and certification support until nothing is left to ask."],
  ["Evolve", "Regulatory horizon scanning and quarterly recalibration."],
];

export function Approach() {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start 0.7", "end 0.6"] });
  const line = useTransform(scrollYProgress, (v) => lerpRange(v, [0, 1], [0, 1]));

  return (
    <section id="approach" data-theme="light" className="relative bg-bone px-6 py-32 text-ink md:px-12 md:py-48">
      <div className="mx-auto grid max-w-[1440px] gap-16 md:grid-cols-12">
        <div className="md:col-span-4">
          <div className="md:sticky md:top-36">
            <p className="eyebrow text-graphite/70">Approach</p>
            <Lines className="display mt-8 text-[clamp(2rem,3.6vw,3.4rem)]" lines={["A method,", <span key="b" className="text-graphite/50">not a template.</span>]} />
            <FadeUp delay={0.2}>
              <p className="mt-8 max-w-xs text-[14px] leading-relaxed text-graphite">
                Five moves, refined across more than two hundred and fifty engagements. Each closes with a signed artefact.
              </p>
            </FadeUp>
          </div>
        </div>

        <div ref={ref} className="relative md:col-span-7 md:col-start-6">
          <div className="absolute bottom-0 left-0 top-0 w-px bg-ink/10">
            <motion.div style={{ scaleY: line }} className="h-full w-full origin-top bg-gold" />
          </div>
          {STEPS.map(([t, d], i) => (
            <FadeUp key={t} className="relative grid grid-cols-[3.5rem_1fr] items-baseline gap-2 border-b border-ink/10 py-10 pl-8 last:border-b-0 md:grid-cols-[4rem_12rem_1fr] md:gap-6 md:py-12 md:pl-12">
              <span className="text-[12px] tabular-nums text-graphite/60">{String(i + 1).padStart(2, "0")}</span>
              <h3 className="text-[1.75rem] font-light tracking-[-0.03em]">{t}</h3>
              <p className="col-span-2 text-[14px] leading-relaxed text-graphite md:col-span-1">{d}</p>
            </FadeUp>
          ))}
        </div>
      </div>
    </section>
  );
}

/* -------------------------------------------------------------------- Contact */

function Ripples() {
  return (
    <div className="pointer-events-none absolute inset-0 flex items-center justify-center" aria-hidden>
      {[0, 1, 2, 3, 4].map((i) => (
        <motion.svg
          key={i}
          viewBox="-1.25 -1.2 2.5 2.35"
          className="absolute h-[46vmin] w-[46vmin] text-gold"
          initial={{ scale: 0.4, opacity: 0 }}
          animate={{ scale: [0.4, 4.2], opacity: [0, 0.32, 0] }}
          transition={{ duration: 10, repeat: Infinity, delay: i * 2, ease: [0.25, 0.1, 0.25, 1], times: [0, 0.25, 1] }}
        >
          <path d={MARK} fill="none" stroke="currentColor" strokeWidth={0.012} />
        </motion.svg>
      ))}
    </div>
  );
}

export function Contact() {
  return (
    <section id="contact" data-theme="dark" className="relative overflow-hidden bg-ink">
      <div className="relative flex min-h-[100svh] flex-col items-center justify-center px-6 py-40 text-center">
        <Ripples />
        <div className="absolute inset-0 bg-[radial-gradient(closest-side,rgba(7,17,31,0.92),rgba(7,17,31,0.4)_70%,transparent)]" />
        <div className="relative">
          <p className="eyebrow text-gold">Contact</p>
          <Lines
            className="display mt-10 text-[clamp(2.6rem,6.4vw,6.4rem)]"
            lines={["Begin with", <span key="b" className="text-bone/50">a conversation.</span>]}
          />
          <FadeUp delay={0.3} className="mt-14 flex flex-col items-center gap-6">
            <a
              href="mailto:hello@triplearcgrc.com"
              className="group relative inline-flex h-14 items-center overflow-hidden rounded-full border border-gold/60 px-9 text-[12px] font-medium uppercase tracking-[0.2em]"
            >
              <span className="absolute inset-0 origin-bottom scale-y-0 bg-gold transition-transform duration-700 ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:scale-y-100" />
              <span className="relative transition-colors duration-500 group-hover:text-ink">hello@triplearcgrc.com</span>
            </a>
            <p className="text-[13px] text-bone/45">Mumbai · London · Dubai</p>
          </FadeUp>
        </div>
      </div>
    </section>
  );
}

export function Footer() {
  return (
    <footer data-theme="dark" className="bg-ink px-6 pb-10 md:px-12">
      <motion.div
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 1.4, ease: EASE }}
        className="mx-auto flex max-w-[1440px] flex-col justify-between gap-6 border-t border-bone/10 pt-8 text-[12px] text-bone/45 md:flex-row"
      >
        <p>© {new Date().getFullYear()} TripleArc GRC Solutions</p>
        <p className="eyebrow !text-[10px]">Governance · Risk · Compliance</p>
        <div className="flex gap-8">
          <a href="#" className="transition-colors hover:text-bone">LinkedIn</a>
          <a href="#" className="transition-colors hover:text-bone">Privacy</a>
        </div>
      </motion.div>
    </footer>
  );
}
