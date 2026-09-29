"use client";

import { useEffect, useRef } from "react";
import dynamic from "next/dynamic";
import { animate, motion, useMotionValueEvent, useScroll, useTransform } from "motion/react";
import { lerpRange, EASE } from "./ui";

const HeroCanvas = dynamic(() => import("./scene/Canvases").then((m) => m.HeroCanvas), { ssr: false });

export default function Hero() {
  const ref = useRef<HTMLElement>(null);
  const progress = useRef(0);
  const fade = useRef(1);

  useEffect(() => {
    const c = animate(1, 0, { duration: 2.6, ease: "easeOut", onUpdate: (v) => (fade.current = v) });
    return () => c.stop();
  }, []);

  const { scrollYProgress } = useScroll({ target: ref, offset: ["start start", "end end"] });
  useMotionValueEvent(scrollYProgress, "change", (v) => (progress.current = v));

  const introOpacity = useTransform(scrollYProgress, (v) => lerpRange(v, [0, 0.22], [1, 0]));
  const introY = useTransform(scrollYProgress, (v) => lerpRange(v, [0, 0.22], [0, -40]));
  const outroOpacity = useTransform(scrollYProgress, (v) => lerpRange(v, [0.66, 0.84], [0, 1]));
  const outroScale = useTransform(scrollYProgress, (v) => lerpRange(v, [0.62, 0.95], [0.92, 1]));
  const outroSpacing = useTransform(scrollYProgress, (v) => `${lerpRange(v, [0.62, 0.95], [0.02, -0.03])}em`);

  return (
    <section ref={ref} id="top" data-theme="dark" className="relative h-[280vh] bg-ink">
      <div className="sticky top-0 h-[100svh] overflow-hidden">
        <HeroCanvas progress={progress} fade={fade} />

        <motion.div
          style={{ opacity: introOpacity, y: introY }}
          className="pointer-events-none absolute inset-x-0 bottom-0 mx-auto flex max-w-[1440px] flex-col gap-10 px-6 pb-10 md:flex-row md:items-end md:justify-between md:px-12 md:pb-14"
        >
          <h1 className="display text-[clamp(2.1rem,4.6vw,4.5rem)]">
            {["Governance, risk", "and compliance —", "engineered as one."].map((l, i) => (
              <span key={l} className="block overflow-hidden pb-[0.08em]">
                <motion.span
                  className={`block ${i === 2 ? "text-bone/55" : ""}`}
                  initial={{ y: "105%" }}
                  animate={{ y: 0 }}
                  transition={{ duration: 1.6, ease: EASE, delay: 0.9 + i * 0.1 }}
                >
                  {l}
                </motion.span>
              </span>
            ))}
          </h1>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 1.6, delay: 1.6 }}
            className="flex max-w-[19rem] flex-col gap-8 md:items-end md:text-right"
          >
            <p className="text-[14px] leading-relaxed text-bone/60">
              Independent GRC advisory for boards, risk leaders and the regulated enterprises they steward.
            </p>
            <span className="eyebrow flex items-center gap-4 !text-[10px] text-bone/50">
              Scroll to enter
              <span className="relative block h-8 w-px overflow-hidden bg-bone/15">
                <motion.span
                  className="absolute inset-x-0 top-0 h-3 bg-gold"
                  animate={{ y: ["-100%", "300%"] }}
                  transition={{ duration: 2.2, repeat: Infinity, ease: [0.65, 0, 0.35, 1] }}
                />
              </span>
            </span>
          </motion.div>
        </motion.div>

        {/* What you arrive at once you pass through the mark */}
        <motion.div
          style={{ opacity: outroOpacity, scale: outroScale }}
          className="pointer-events-none absolute inset-0 flex flex-col items-center justify-center px-6 text-center"
        >
          <p className="eyebrow mb-8 text-gold">TripleArc GRC Solutions</p>
          <motion.p style={{ letterSpacing: outroSpacing }} className="display max-w-4xl text-[clamp(2.4rem,6vw,6rem)]">
            Three disciplines.
            <br />
            <span className="text-bone/55">One structure.</span>
          </motion.p>
        </motion.div>
      </div>
    </section>
  );
}
