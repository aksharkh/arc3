"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import { CHAPTERS, type Chapter } from "@/lib/chapters";
import { triquetraPath } from "@/lib/triquetra";
import Dial from "./Dial";
import Title from "./Title";

const EASE = [0.22, 1, 0.36, 1] as const;
const MARK = triquetraPath();
const LOCK_MS = 1250;

function useIsNarrow() {
  const [narrow, setNarrow] = useState(false);
  useEffect(() => {
    const mq = window.matchMedia("(max-width: 1023px)");
    const on = () => setNarrow(mq.matches);
    on();
    mq.addEventListener("change", on);
    return () => mq.removeEventListener("change", on);
  }, []);
  return narrow;
}

/** Fades + lifts in with the chapter, fades out as it leaves. */
const rise = (order: number) => ({
  enter: { opacity: 0, y: 28 },
  show: { opacity: 1, y: 0, transition: { duration: 0.9, ease: EASE, delay: 0.55 + order * 0.08 } },
  exit: { opacity: 0, y: -16, transition: { duration: 0.3 } },
});

const METHOD_NOTES = [
  "Maturity baselined, gaps ranked by exposure",
  "Policies, controls and owners, sized to fit",
  "Controls embedded where the work happens",
  "Independent testing and certification",
  "Horizon scanning, quarterly recalibration",
];

const FIGURES = [
  ["250+", "Engagements delivered"],
  ["98%", "First-submission audit pass rate"],
  ["40%", "Control redundancy removed"],
  ["0", "Regulatory penalties under our assurance"],
];

function Module({ c }: { c: Chapter }) {
  const line = "border-t border-current/20";
  switch (c.kind) {
    case "intro":
      return (
        <motion.div variants={rise(3)} className="meta flex items-center gap-4 opacity-70">
          <span className="flex gap-1.5">
            {["←", "→"].map((k) => (
              <kbd key={k} className="flex h-7 w-7 items-center justify-center rounded-md border border-current/30 font-sans text-[12px]">
                {k}
              </kbd>
            ))}
          </span>
          Scroll, swipe or use the keys
        </motion.div>
      );
    case "pillar":
      return (
        <ul>
          {c.points!.map((p, k) => (
            <motion.li key={p} variants={rise(3 + k)} className={`flex items-baseline gap-5 py-3 text-[15px] font-medium ${line}`}>
              <span className="meta opacity-50">{String(k + 1).padStart(2, "0")}</span>
              {p}
            </motion.li>
          ))}
        </ul>
      );
    case "method":
      return (
        <ol>
          {c.points!.map((p, k) => (
            <motion.li key={p} variants={rise(2 + k)} className={`grid grid-cols-[2rem_6.5rem_1fr] items-baseline gap-3 py-2.5 ${line}`}>
              <span className="meta opacity-50">{String(k + 1).padStart(2, "0")}</span>
              <span className="text-[17px] font-semibold tracking-[-0.01em]">{p}</span>
              <span className="text-[13px] leading-snug opacity-65">{METHOD_NOTES[k]}</span>
            </motion.li>
          ))}
        </ol>
      );
    case "proof":
      return (
        <div className="grid grid-cols-2 gap-x-8">
          {FIGURES.map(([n, l], k) => (
            <motion.div key={l} variants={rise(2 + k)} className={`py-4 ${line}`}>
              <p className="condensed text-[clamp(2.6rem,4.4vw,4.2rem)] font-extrabold leading-none" style={{ color: "var(--accent)" }}>
                {n}
              </p>
              <p className="mt-2 text-[13px] leading-snug opacity-65">{l}</p>
            </motion.div>
          ))}
        </div>
      );
    case "contact":
      return (
        <motion.div variants={rise(3)}>
          <a href="mailto:hello@triplearcgrc.com" className="group inline-flex items-center gap-4 text-[clamp(1.2rem,1.9vw,1.7rem)] font-semibold tracking-[-0.02em]">
            <span className="relative">
              hello@triplearcgrc.com
              <span className="absolute -bottom-1 left-0 h-[2px] w-full origin-left scale-x-100 transition-transform duration-500 group-hover:scale-x-0" style={{ background: "var(--accent)" }} />
            </span>
            <span
              className="flex h-11 w-11 items-center justify-center rounded-full transition-transform duration-500 group-hover:rotate-45"
              style={{ background: "var(--accent)", color: c.bg }}
            >
              <svg viewBox="0 0 14 14" className="h-3.5 w-3.5" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                <path d="M3 11 11 3M5 3h6v6" />
              </svg>
            </span>
          </a>
          <p className="meta mt-8 opacity-55">Mumbai · London · Dubai</p>
        </motion.div>
      );
  }
}

function Content({ c, index }: { c: Chapter; index: number }) {
  return (
    <>
      <div className="absolute left-6 right-6 top-24 grid gap-6 lg:left-12 lg:right-auto lg:top-32 lg:w-[min(44vw,660px)] lg:grid-cols-2 lg:gap-10">
        <div>
          <motion.p variants={rise(0)} className="meta flex items-center gap-3">
            <span style={{ color: "var(--accent)" }}>{String(index).padStart(2, "0")}</span>
            <span className="h-px w-8 bg-current opacity-40" />
            <span className="opacity-70">{c.label}</span>
          </motion.p>
          <motion.p variants={rise(1)} className="mt-5 text-[clamp(1.45rem,2.1vw,2rem)] font-medium leading-[1.1] tracking-[-0.025em]">
            {c.lead}
          </motion.p>
          {c.body && (
            <motion.p variants={rise(2)} className="mt-5 max-w-sm text-[14px] leading-relaxed opacity-70 lg:hidden xl:block">
              {c.body}
            </motion.p>
          )}
        </div>
        <div className="lg:pt-9">
          <Module c={c} />
        </div>
      </div>
      <div className="absolute bottom-24 left-5 lg:bottom-28 lg:left-10">
        <Title text={c.title} />
      </div>
    </>
  );
}

export default function Experience() {
  const [index, setIndex] = useState(0);
  const idx = useRef(0);
  const lockedUntil = useRef(0);
  const narrow = useIsNarrow();
  const c = CHAPTERS[index];
  const last = CHAPTERS.length - 1;

  const go = useCallback(
    (to: number) => {
      const now = performance.now();
      const n = Math.max(0, Math.min(last, to));
      if (n === idx.current || now < lockedUntil.current) return;
      lockedUntil.current = now + LOCK_MS;
      idx.current = n;
      setIndex(n);
    },
    [last],
  );

  useEffect(() => {
    let prevAbs = 0;
    let prevTime = 0;
    const onWheel = (e: WheelEvent) => {
      const abs = Math.abs(e.deltaY);
      const now = performance.now();
      // Ignore the decaying tail of a trackpad fling so one gesture = one turn.
      const decaying = abs <= prevAbs && now - prevTime < 90;
      prevAbs = abs;
      prevTime = now;
      if (abs < 16 || decaying) return;
      go(idx.current + (e.deltaY > 0 ? 1 : -1));
    };
    const onKey = (e: KeyboardEvent) => {
      if (["ArrowRight", "ArrowDown", "PageDown", " "].includes(e.key)) go(idx.current + 1);
      else if (["ArrowLeft", "ArrowUp", "PageUp"].includes(e.key)) go(idx.current - 1);
      else if (e.key === "Home") go(0);
      else if (e.key === "End") go(last);
    };
    let sx = 0;
    let sy = 0;
    const onStart = (e: TouchEvent) => {
      sx = e.touches[0].clientX;
      sy = e.touches[0].clientY;
    };
    const onEnd = (e: TouchEvent) => {
      const dx = e.changedTouches[0].clientX - sx;
      const dy = e.changedTouches[0].clientY - sy;
      const d = Math.abs(dx) > Math.abs(dy) ? dx : dy;
      if (Math.abs(d) > 48) go(idx.current + (d < 0 ? 1 : -1));
    };
    window.addEventListener("wheel", onWheel, { passive: true });
    window.addEventListener("keydown", onKey);
    window.addEventListener("touchstart", onStart, { passive: true });
    window.addEventListener("touchend", onEnd, { passive: true });
    return () => {
      window.removeEventListener("wheel", onWheel);
      window.removeEventListener("keydown", onKey);
      window.removeEventListener("touchstart", onStart);
      window.removeEventListener("touchend", onEnd);
    };
  }, [go, last]);

  // Each new chapter opens outward from the dial's centre.
  const at = narrow ? "50% 79%" : "72% 50%";

  return (
    <main className="fixed inset-0 overflow-hidden [--title-max:20svh] [--title-w:90vw] lg:[--title-max:30vh] lg:[--title-w:64vw]">
      <AnimatePresence>
        <motion.section
          key={c.id}
          aria-label={c.title}
          className="absolute inset-0"
          style={{ background: c.bg, color: c.fg, ["--accent" as string]: c.accent }}
          initial="enter"
          animate="show"
          exit="exit"
          variants={{
            enter: { clipPath: `circle(0% at ${at})` },
            show: { clipPath: `circle(150% at ${at})`, transition: { duration: 1.25, ease: [0.65, 0, 0.2, 1] } },
            // Stay put underneath while the next chapter covers this one.
            exit: { opacity: 0.999, transition: { duration: 1.3 } },
          }}
        >
          <Content c={c} index={index} />
        </motion.section>
      </AnimatePresence>

      {/* chrome: sits above every chapter and takes its colours */}
      <div
        className="pointer-events-none absolute inset-0 z-10 transition-colors delay-300 duration-700"
        style={{ color: c.fg, ["--accent" as string]: c.accent }}
      >
        <div
          className="absolute aspect-square -translate-x-1/2 -translate-y-1/2"
          style={narrow ? { left: "50%", top: "79%", width: "100vw" } : { left: "72%", top: "50%", height: "82vh" }}
        >
          <Dial index={index} count={CHAPTERS.length} arc={c.arc} onArc={(k) => go(k + 1)} />
        </div>

        <header className="absolute inset-x-0 top-0 flex h-20 items-center justify-between px-6 lg:h-24 lg:px-12">
          <button onClick={() => go(0)} className="pointer-events-auto flex items-center gap-3" aria-label="TripleArc — back to start">
            <svg viewBox="-1.25 -1.2 2.5 2.35" className="h-7 w-7" aria-hidden>
              <path d={MARK} fill="none" stroke="var(--accent)" strokeWidth={0.13} strokeLinejoin="miter" strokeMiterlimit={8} style={{ transition: "stroke 0.7s 0.3s" }} />
            </svg>
            <span className="meta !text-[12px] !tracking-[0.26em]">TripleArc</span>
          </button>
          <button onClick={() => go(last)} className="meta pointer-events-auto group flex items-center gap-3">
            Book a call
            <span className="h-px w-8 origin-left bg-current transition-transform duration-500 group-hover:scale-x-150" />
          </button>
        </header>

        <footer className="absolute inset-x-0 bottom-0 flex h-20 items-center justify-between px-6 lg:h-24 lg:px-12">
          <div className="condensed flex items-baseline gap-2 text-[28px] font-bold tabular-nums leading-none">
            <span className="relative inline-block h-[1em] w-[1.1em] overflow-hidden">
              <AnimatePresence initial={false}>
                <motion.span
                  key={index}
                  className="absolute inset-0"
                  initial={{ y: "100%" }}
                  animate={{ y: "0%" }}
                  exit={{ y: "-100%" }}
                  transition={{ duration: 0.7, ease: EASE }}
                >
                  {String(index).padStart(2, "0")}
                </motion.span>
              </AnimatePresence>
            </span>
            <span className="text-[14px] font-medium opacity-50">/ {String(last).padStart(2, "0")}</span>
          </div>

          <nav className="pointer-events-auto hidden items-center gap-7 lg:flex">
            {CHAPTERS.map((ch, k) => (
              <button key={ch.id} onClick={() => go(k)} className={`meta group relative py-2 transition-opacity duration-500 ${k === index ? "opacity-100" : "opacity-45 hover:opacity-100"}`}>
                {ch.id}
                {k === index && <motion.span layoutId="nav-mark" className="absolute -bottom-0.5 left-0 h-[2px] w-full" style={{ background: "var(--accent)" }} transition={{ duration: 0.7, ease: EASE }} />}
              </button>
            ))}
          </nav>

          <div className="pointer-events-auto flex gap-2">
            {[-1, 1].map((d) => {
              const off = d < 0 ? index === 0 : index === last;
              return (
                <motion.button
                  key={d}
                  whileTap={{ scale: 0.9 }}
                  onClick={() => go(index + d)}
                  disabled={off}
                  aria-label={d < 0 ? "Previous chapter" : "Next chapter"}
                  className={`flex h-12 w-12 items-center justify-center rounded-full border border-current/30 transition-opacity duration-500 hover:border-current ${off ? "opacity-25" : ""}`}
                >
                  <svg viewBox="0 0 16 10" className={`h-2.5 w-4 ${d < 0 ? "rotate-180" : ""}`} fill="none" stroke="currentColor" strokeWidth="1.4">
                    <path d="M0 5h15M11 1l4 4-4 4" />
                  </svg>
                </motion.button>
              );
            })}
          </div>
        </footer>
      </div>
    </main>
  );
}
