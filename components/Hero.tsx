"use client";

import { type ReactNode } from "react";
import { motion, useMotionValue, useSpring, useTransform, type MotionValue } from "motion/react";
import { BlurWords, Button, EASE, MARK, MARK_BOX } from "./ui";
import { Controls, Heatmap, ScoreRing } from "./Widgets";

/** Concentric outlines of the mark, drawn in and turning slowly. */
function Orbits() {
  return (
    <div className="pointer-events-none absolute left-1/2 top-[46%] h-[150vmin] w-[150vmin] -translate-x-1/2 -translate-y-1/2" aria-hidden>
      {[1, 0.68, 0.42].map((s, i) => (
        <motion.svg
          key={s}
          viewBox={MARK_BOX}
          className="absolute inset-0 h-full w-full"
          style={{ scale: s }}
          animate={{ rotate: i % 2 ? -360 : 360 }}
          transition={{ duration: 140 + i * 40, repeat: Infinity, ease: "linear" }}
        >
          <motion.path
            d={MARK}
            fill="none"
            stroke="white"
            strokeOpacity={0.1 + i * 0.05}
            strokeWidth={0.006 / s}
            initial={{ pathLength: 0 }}
            animate={{ pathLength: 1 }}
            transition={{ duration: 3, ease: EASE, delay: 0.3 + i * 0.25 }}
          />
        </motion.svg>
      ))}
    </div>
  );
}

function Float({
  children,
  mx,
  my,
  depth,
  delay,
  className,
}: {
  children: ReactNode;
  mx: MotionValue<number>;
  my: MotionValue<number>;
  depth: number;
  delay: number;
  className?: string;
}) {
  const x = useTransform(mx, (v) => v * depth);
  const y = useTransform(my, (v) => v * depth);
  return (
    <motion.div
      initial={{ opacity: 0, y: 120 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ type: "spring", stiffness: 70, damping: 16, delay }}
      className={className}
    >
      <motion.div style={{ x, y }}>
        <motion.div animate={{ y: [0, -8, 0] }} transition={{ duration: 6 + depth / 8, repeat: Infinity, ease: "easeInOut", delay }}>
          {children}
        </motion.div>
      </motion.div>
    </motion.div>
  );
}

export default function Hero() {
  const px = useMotionValue(0);
  const py = useMotionValue(0);
  const mx = useSpring(px, { stiffness: 60, damping: 18 });
  const my = useSpring(py, { stiffness: 60, damping: 18 });

  return (
    <section id="top" className="px-3 pt-3 md:px-4 md:pt-4">
      <div
        onPointerMove={(e) => {
          const r = e.currentTarget.getBoundingClientRect();
          px.set((e.clientX - r.left) / r.width - 0.5);
          py.set((e.clientY - r.top) / r.height - 0.5);
        }}
        className="relative overflow-hidden rounded-[32px] text-white md:rounded-[44px]"
        style={{ background: "radial-gradient(120% 90% at 50% 0%, #2a6fe0 0%, #0f4cb1 32%, #0a2f78 68%, #081a3a 100%)" }}
      >
        <div className="dots absolute inset-0 [mask-image:radial-gradient(70%_60%_at_50%_30%,#000,transparent)]" />
        <Orbits />

        <div className="relative mx-auto flex max-w-5xl flex-col items-center px-6 pt-32 text-center md:pt-36">
          <motion.a
            href="#results"
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: EASE, delay: 0.2 }}
            className="group inline-flex items-center gap-2.5 rounded-full bg-white/10 py-1.5 pl-1.5 pr-4 text-[13px] font-medium ring-1 ring-inset ring-white/20 backdrop-blur-md transition-colors hover:bg-white/15"
          >
            <span className="rounded-full bg-gold px-2.5 py-1 text-[11px] font-bold text-ink">New</span>
            AI governance practice — ISO 42001
            <span className="transition-transform duration-300 group-hover:translate-x-1">→</span>
          </motion.a>

          <h1 className="h-display mt-7 text-[clamp(2.6rem,6.2vw,5.4rem)]">
            <BlurWords text="Governance, risk &" delay={0.3} />
            <br className="hidden sm:block" />
            <BlurWords text="compliance," delay={0.5} />
            <BlurWords text="made clear." delay={0.62} className="text-white/55" />
          </h1>

          <motion.p
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.9, ease: EASE, delay: 0.8 }}
            className="mt-6 max-w-xl text-[16px] leading-relaxed text-white/70 md:text-[17px]"
          >
            One structure for every obligation, control and piece of evidence — so your board sees risk early and your audits become routine.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.9, ease: EASE, delay: 0.95 }}
            className="mt-8 flex flex-wrap items-center justify-center gap-3"
          >
            <Button href="#contact" variant="white">
              Book a consultation
            </Button>
            <Button href="#process" variant="ghost">
              See how it works
            </Button>
          </motion.div>
        </div>

        {/* dashboard composition rising out of the bottom edge */}
        <div className="relative mx-auto mt-16 grid max-w-[980px] grid-cols-1 items-end gap-4 px-6 sm:grid-cols-3 md:mt-14 md:gap-5">
          <Float mx={mx} my={my} depth={-26} delay={1.0} className="hidden sm:block sm:translate-y-10">
            <Heatmap />
          </Float>
          <Float mx={mx} my={my} depth={-44} delay={0.85} className="sm:translate-y-4">
            <ScoreRing />
          </Float>
          <Float mx={mx} my={my} depth={-26} delay={1.15} className="hidden sm:block sm:translate-y-12">
            <Controls />
          </Float>
        </div>
        <div className="pointer-events-none absolute inset-x-0 bottom-0 h-24 bg-gradient-to-t from-[#081a3a] to-transparent" />
      </div>
    </section>
  );
}
