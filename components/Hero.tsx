"use client";

import { useRef } from "react";
import dynamic from "next/dynamic";
import { motion, useMotionValueEvent, useScroll, useTransform } from "motion/react";
import { EASE, PillButton, RevealLines } from "./ui";
import { useLoaded } from "@/lib/store";

const HeroScene = dynamic(() => import("./scene/Scenes").then((m) => m.HeroScene), { ssr: false });

const REGIMES = [
  "ISO 27001:2022",
  "SOC 2 Type II",
  "DPDP Act 2023",
  "SEBI CSCRF",
  "RBI IT Governance",
  "GDPR",
  "NIST CSF 2.0",
  "PCI DSS 4.0",
  "ISO 42001",
  "DORA",
  "NIS2",
  "HIPAA",
];

export default function Hero() {
  const ref = useRef<HTMLElement>(null);
  const loaded = useLoaded();
  const progress = useRef(0);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start start", "end start"] });
  useMotionValueEvent(scrollYProgress, "change", (v) => (progress.current = v));

  const textY = useTransform(scrollYProgress, [0, 1], ["0%", "-35%"]);
  const textO = useTransform(scrollYProgress, [0, 0.6], [1, 0]);

  return (
    <section ref={ref} id="top" className="relative h-[100svh] min-h-[640px] overflow-hidden bg-ink">
      <HeroScene progress={progress} intro={loaded} />

      {/* legibility wash on small screens */}
      <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-ink via-ink/30 to-transparent md:hidden" />

      <motion.div
        style={{ y: textY, opacity: textO }}
        className="pointer-events-none relative z-10 mx-auto flex h-full max-w-[1600px] flex-col justify-end px-6 pb-36 md:justify-center md:px-10 md:pb-0"
      >
        <motion.div
          initial={{ opacity: 0 }}
          animate={loaded ? { opacity: 1 } : undefined}
          transition={{ duration: 1, delay: 0.3 }}
          className="label mb-8 flex items-center gap-4 text-pearl/60"
        >
          <span className="h-px w-12 bg-gold" />
          GRC Solutions — Advisory &amp; Assurance
        </motion.div>

        <h1 className="text-[clamp(3.2rem,9.4vw,10.5rem)] font-light leading-[0.9] tracking-[-0.045em]">
          <RevealLines
            delay={0.35}
            stagger={0.12}
            lines={[
              <span key="a">Control,</span>,
              <span key="b" className="gold-text font-serif font-normal italic tracking-[-0.02em]">
                engineered.
              </span>,
            ]}
          />
        </h1>

        <div className="pointer-events-auto mt-10 flex max-w-xl flex-col gap-8 md:mt-12">
          <RevealLines
            delay={0.75}
            stagger={0.05}
            className="text-[15px] leading-relaxed text-pearl/70 md:text-[17px]"
            lines={[
              "Governance that decides. Risk measured before it is felt.",
              "Compliance that holds when it is tested — unified into",
              "one living architecture for regulated enterprises.",
            ]}
          />
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={loaded ? { opacity: 1, y: 0 } : undefined}
            transition={{ duration: 1, ease: EASE, delay: 1.1 }}
            className="flex flex-wrap items-center gap-3"
          >
            <PillButton href="#contact">Book a consultation</PillButton>
            <PillButton href="#pillars" variant="ghost">
              Explore the system
            </PillButton>
          </motion.div>
        </div>
      </motion.div>

      {/* bottom rail */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={loaded ? { opacity: 1 } : undefined}
        transition={{ duration: 1.2, delay: 1.3 }}
        className="absolute inset-x-0 bottom-0 z-10 border-t border-white/10 bg-ink/30 backdrop-blur-md"
      >
        <div className="flex items-center">
          <div className="label hidden shrink-0 items-center gap-3 border-r border-white/10 px-10 py-5 text-pearl/50 md:flex">
            <motion.span
              className="block h-6 w-px origin-top bg-gold"
              animate={{ scaleY: [0, 1, 0], y: [0, 0, 12] }}
              transition={{ duration: 2.2, repeat: Infinity, ease: "easeInOut" }}
            />
            Scroll
          </div>
          <div className="relative flex-1 overflow-hidden py-5 [mask-image:linear-gradient(90deg,transparent,#000_8%,#000_92%,transparent)]">
            <div className="marquee" style={{ ["--dur" as string]: "55s" }}>
              {[0, 1].map((k) => (
                <div key={k} className="flex shrink-0 items-center">
                  {REGIMES.map((r) => (
                    <span key={r + k} className="label flex items-center gap-10 pr-10 text-pearl/55">
                      {r}
                      <svg viewBox="0 0 10 10" className="h-2 w-2 text-gold" aria-hidden>
                        <path d="M5 0 L10 5 L5 10 L0 5Z" fill="currentColor" />
                      </svg>
                    </span>
                  ))}
                </div>
              ))}
            </div>
          </div>
          <div className="label hidden shrink-0 border-l border-white/10 px-10 py-5 text-pearl/50 lg:block">
            Mumbai · London · Dubai
          </div>
        </div>
      </motion.div>
    </section>
  );
}
