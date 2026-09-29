"use client";

import { useRef, useState } from "react";
import { AnimatePresence, motion, useMotionValue, useSpring } from "motion/react";
import { Arrow, EASE, Mark, RevealLines, Rise, SectionTag } from "./ui";

const SERVICES = [
  { name: "GRC Strategy", regime: "COSO · ISO 31000", time: "4–6 wks", out: "Model signed off", note: "One target state for governance, risk and compliance — owned by the board." },
  { name: "Internal Audit", regime: "IIA · ISO 19011", time: "6–8 wks", out: "Audit report accepted", note: "Risk-based audit plans that find what matters before the regulator does." },
  { name: "Cyber Risk", regime: "NIST CSF · ISO 27001", time: "8–12 wks", out: "Risk register signed off", note: "Cyber exposure quantified in currency, prioritised by business impact." },
  { name: "Regulatory Advisory", regime: "RBI · SEBI · IRDAI", time: "Ongoing", out: "Readiness signed off", note: "Circulars decoded into controls within days of publication." },
  { name: "Data Privacy", regime: "DPDP · GDPR", time: "6–10 wks", out: "Privacy programme live", note: "Consent, data maps and DPIAs that survive a Data Protection Board inquiry." },
  { name: "Third-Party Risk", regime: "SOC 2 · ISO 27036", time: "4–8 wks", out: "Vendor framework live", note: "Every vendor tiered, assessed and monitored — without questionnaire fatigue." },
  { name: "ESG Assurance", regime: "BRSR · GRI · ISSB", time: "6–12 wks", out: "Assured disclosures", note: "Sustainability data held to the same standard as financial data." },
  { name: "AI Governance", regime: "ISO 42001 · EU AI Act", time: "6–10 wks", out: "AI risk policy adopted", note: "Guardrails for models in production — inventory, risk tiers and oversight." },
];

export default function Services() {
  const [hover, setHover] = useState<number | null>(null);
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const sx = useSpring(x, { stiffness: 150, damping: 20, mass: 0.4 });
  const sy = useSpring(y, { stiffness: 150, damping: 20, mass: 0.4 });
  const listRef = useRef<HTMLDivElement>(null);

  return (
    <section id="services" className="relative bg-pearl px-6 py-28 text-ink md:px-10 md:py-40">
      <div className="mx-auto max-w-[1600px]">
        <div className="flex flex-col justify-between gap-10 md:flex-row md:items-end">
          <div>
            <SectionTag index="03" dark={false}>
              Index of services
            </SectionTag>
            <h2 className="mt-8 text-[clamp(2.6rem,6.5vw,6.8rem)] font-light leading-[0.95] tracking-[-0.045em]">
              <RevealLines lines={["Precision,", <span key="b" className="font-serif italic text-royal">not paperwork.</span>]} />
            </h2>
          </div>
          <Rise className="max-w-sm text-[15px] leading-relaxed text-ink/60">
            Eight practices, one methodology. Every engagement ends with a signed-off outcome — never a slide deck left in a drawer.
          </Rise>
        </div>

        <div
          ref={listRef}
          className="relative mt-20"
          onPointerMove={(e) => {
            x.set(e.clientX);
            y.set(e.clientY);
          }}
          onPointerLeave={() => setHover(null)}
        >
          <div className="label hidden grid-cols-12 gap-6 border-b border-ink/15 pb-4 text-ink/45 md:grid">
            <span className="col-span-1">No.</span>
            <span className="col-span-4">Service</span>
            <span className="col-span-3">Regime</span>
            <span className="col-span-2">Duration</span>
            <span className="col-span-2 text-right">Outcome</span>
          </div>
          {SERVICES.map((s, i) => (
            <motion.a
              href="#contact"
              key={s.name}
              data-cursor="Enquire"
              onPointerEnter={() => setHover(i)}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "0px 0px -8% 0px" }}
              transition={{ duration: 0.9, ease: EASE, delay: i * 0.04 }}
              className="group relative grid grid-cols-12 items-center gap-2 overflow-hidden border-b border-ink/15 py-6 md:gap-6 md:py-8"
            >
              <span className="absolute inset-0 origin-bottom scale-y-0 bg-navy transition-transform duration-700 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:scale-y-100" />
              <span className="relative col-span-2 font-mono text-[12px] text-ink/40 transition-colors duration-500 group-hover:text-gold md:col-span-1 md:pl-4">
                {String(i + 1).padStart(2, "0")}
              </span>
              <span className="relative col-span-10 text-[clamp(1.5rem,3vw,2.6rem)] font-light tracking-[-0.03em] transition-all duration-700 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:translate-x-4 group-hover:text-pearl md:col-span-4">
                {s.name}
              </span>
              <span className="label relative col-span-12 mt-2 text-ink/55 transition-colors duration-500 group-hover:text-pearl/60 md:col-span-3 md:mt-0">
                {s.regime}
              </span>
              <span className="label relative hidden text-ink/55 transition-colors duration-500 group-hover:text-pearl/60 md:col-span-2 md:block">
                {s.time}
              </span>
              <span className="relative hidden items-center justify-end gap-3 text-[13px] font-medium transition-colors duration-500 group-hover:text-gold md:col-span-2 md:flex md:pr-4">
                {s.out}
                <Arrow className="h-3.5 w-3.5 -rotate-45 transition-transform duration-500 group-hover:rotate-0" />
              </span>
            </motion.a>
          ))}
        </div>
      </div>

      {/* floating preview */}
      <motion.div
        className="pointer-events-none fixed left-0 top-0 z-30 hidden md:block"
        style={{ x: sx, y: sy }}
      >
        <AnimatePresence>
          {hover !== null && (
            <motion.div
              key="card"
              initial={{ opacity: 0, scale: 0.7, rotate: -6 }}
              animate={{ opacity: 1, scale: 1, rotate: 0 }}
              exit={{ opacity: 0, scale: 0.7, rotate: 6 }}
              transition={{ duration: 0.5, ease: EASE }}
              className="relative ml-10 -mt-32 h-64 w-80 overflow-hidden rounded-2xl text-pearl shadow-[0_40px_80px_-20px_rgba(5,13,26,0.6)]"
              style={{
                background:
                  "radial-gradient(120% 90% at 100% 0%, #1677c9 0%, transparent 55%), radial-gradient(90% 80% at 0% 100%, #0f4cb1 0%, transparent 60%), linear-gradient(135deg, #0a1d2f, #050d1a)",
              }}
            >
              <svg className="absolute inset-0 h-full w-full opacity-70" viewBox="0 0 320 256" preserveAspectRatio="none" aria-hidden>
                <path d="M-10 190 C 70 150, 120 230, 200 170 S 300 90, 340 120" fill="none" stroke="#d4af37" strokeWidth="1.2" />
                <path d="M-10 210 C 80 170, 130 250, 210 190 S 300 120, 340 150" fill="none" stroke="#d4af37" strokeOpacity=".4" strokeWidth=".8" />
              </svg>
              <Mark className="absolute right-5 top-5 h-10 w-10" width={0.14} />
              <AnimatePresence mode="popLayout">
                <motion.div
                  key={hover}
                  initial={{ y: 30, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  exit={{ y: -30, opacity: 0 }}
                  transition={{ duration: 0.45, ease: EASE }}
                  className="absolute inset-x-6 bottom-6"
                >
                  <p className="label text-gold">{SERVICES[hover].time}</p>
                  <p className="mt-3 text-[15px] leading-snug text-pearl/90">{SERVICES[hover].note}</p>
                </motion.div>
              </AnimatePresence>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
    </section>
  );
}
