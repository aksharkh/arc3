"use client";

import { useRef } from "react";
import { motion, useScroll, useTransform, type MotionValue } from "motion/react";
import { Mark, Rise, SectionTag } from "./ui";

const TEXT =
  "Most firms sell reassurance. We build the *conditions* under which reassurance is *justified* — governance that decides, risk that is measured before it is felt, compliance that *holds* when it is tested.";

function Word({ word, range, progress }: { word: string; range: [number, number]; progress: MotionValue<number> }) {
  const opacity = useTransform(progress, range, [0.1, 1]);
  const y = useTransform(progress, range, [8, 0]);
  const em = word.startsWith("*");
  const clean = word.replace(/\*/g, "");
  return (
    <motion.span style={{ opacity, y }} className={`mr-[0.24em] inline-block ${em ? "font-serif italic text-royal" : ""}`}>
      {clean}
    </motion.span>
  );
}

export default function Manifesto() {
  const ref = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start 0.8", "end 0.7"] });
  const words = TEXT.split(" ");
  const rotate = useTransform(scrollYProgress, [0, 1], [-30, 60]);

  return (
    <section ref={ref} className="relative overflow-hidden bg-pearl px-6 py-32 text-ink md:px-10 md:py-48">
      <motion.div style={{ rotate }} className="pointer-events-none absolute -right-40 top-10 h-[34rem] w-[34rem] opacity-[0.07] md:h-[48rem] md:w-[48rem]">
        <Mark className="h-full w-full" stroke="#0f4cb1" width={0.02} />
      </motion.div>

      <div className="relative mx-auto grid max-w-[1600px] gap-14 md:grid-cols-12">
        <div className="md:col-span-3">
          <SectionTag index="01" dark={false}>
            Manifesto
          </SectionTag>
        </div>
        <div className="md:col-span-9">
          <p className="text-[clamp(1.9rem,4.4vw,4.6rem)] font-light leading-[1.08] tracking-[-0.03em]">
            {words.map((w, i) => {
              const s = i / words.length;
              return <Word key={i} word={w} progress={scrollYProgress} range={[s * 0.9, s * 0.9 + 0.12]} />;
            })}
          </p>

          <div className="mt-20 grid gap-10 border-t border-ink/10 pt-10 sm:grid-cols-3">
            {[
              ["Former regulators", "People who wrote the rules now help you meet them."],
              ["Big Four rigour", "Audit-grade method without the audit-firm drag."],
              ["Engineers, not auditors", "Controls built into systems, not bolted onto them."],
            ].map(([t, d], i) => (
              <Rise key={t} delay={i * 0.1}>
                <p className="label text-royal">0{i + 1}</p>
                <p className="mt-4 text-lg font-semibold">{t}</p>
                <p className="mt-2 text-[15px] leading-relaxed text-ink/60">{d}</p>
              </Rise>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
