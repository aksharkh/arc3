"use client";

import { useEffect, useRef, useState, type PointerEvent, type ReactNode } from "react";
import { animate, motion, useInView, type HTMLMotionProps } from "motion/react";
import { triquetraArcPaths, triquetraPath } from "@/lib/triquetra";

export const EASE = [0.22, 1, 0.36, 1] as const;
export const SPRING = { type: "spring", stiffness: 260, damping: 26 } as const;

export const MARK = triquetraPath();
export const ARCS = triquetraArcPaths();
export const MARK_BOX = "-1.25 -1.2 2.5 2.35";

/** Clamped linear map, for scroll-linked values via `useTransform(mv, fn)`. */
export function lerpRange(v: number, [a, b]: number[], [c, d]: number[]) {
  const t = Math.min(Math.max((v - a) / (b - a), 0), 1);
  return c + (d - c) * t;
}

export function Mark({ className, width = 0.13 }: { className?: string; width?: number }) {
  return (
    <svg viewBox={MARK_BOX} className={className} aria-hidden>
      <path d={MARK} fill="none" stroke="currentColor" strokeWidth={width} strokeLinejoin="miter" strokeMiterlimit={8} />
    </svg>
  );
}

export function Logo({ className }: { className?: string }) {
  return (
    <span className={`inline-flex items-center gap-2.5 ${className ?? ""}`}>
      <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-royal text-white">
        <Mark className="h-5 w-5" width={0.16} />
      </span>
      <span className="text-[17px] font-bold tracking-[-0.03em]">
        Triple<span className="text-royal">Arc</span>
      </span>
    </span>
  );
}

/** Words drift up out of a blur, one after another. */
export function BlurWords({
  text,
  className,
  delay = 0,
  accent,
}: {
  text: string;
  className?: string;
  delay?: number;
  /** words (0-based indices) to render in the accent style */
  accent?: { from: number; className: string };
}) {
  const ref = useRef<HTMLSpanElement>(null);
  const inView = useInView(ref, { once: true, margin: "0px 0px -10% 0px" });
  return (
    <span ref={ref} className={className}>
      {text.split(" ").map((w, i) => (
        <motion.span
          key={i}
          className={`mr-[0.24em] inline-block ${accent && i >= accent.from ? accent.className : ""}`}
          initial={{ opacity: 0, y: "0.4em", filter: "blur(12px)" }}
          animate={inView ? { opacity: 1, y: 0, filter: "blur(0px)" } : undefined}
          transition={{ duration: 0.9, ease: EASE, delay: delay + i * 0.06 }}
        >
          {w}
        </motion.span>
      ))}
    </span>
  );
}

export function Reveal({ children, delay = 0, y = 28, ...rest }: HTMLMotionProps<"div"> & { delay?: number; y?: number }) {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: "0px 0px -8% 0px" });
  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y }}
      animate={inView ? { opacity: 1, y: 0 } : undefined}
      transition={{ duration: 0.9, ease: EASE, delay }}
      {...rest}
    >
      {children}
    </motion.div>
  );
}

/** Counts to `to` once in view. */
export function CountUp({ to, suffix = "", duration = 1.8 }: { to: number; suffix?: string; duration?: number }) {
  const ref = useRef<HTMLSpanElement>(null);
  const inView = useInView(ref, { once: true, margin: "0px 0px -10% 0px" });
  const [v, setV] = useState(0);
  useEffect(() => {
    if (!inView) return;
    const c = animate(0, to, { duration, ease: EASE, onUpdate: (n) => setV(Math.round(n)) });
    return () => c.stop();
  }, [inView, to, duration]);
  return (
    <span ref={ref} className="tabular-nums">
      {v}
      {suffix}
    </span>
  );
}

export function Arrow({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 14 14" className={className} fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
      <path d="M3 11 11 3M5 3h6v6" />
    </svg>
  );
}

/** Pill button whose arrow badge rolls over on hover. */
export function Button({
  href,
  children,
  variant = "primary",
  className,
}: {
  href: string;
  children: ReactNode;
  variant?: "primary" | "white" | "ghost" | "outline";
  className?: string;
}) {
  const v = {
    primary: "bg-royal text-white hover:bg-[#0c3f96]",
    white: "bg-white text-ink hover:bg-sky",
    ghost: "bg-white/10 text-white ring-1 ring-inset ring-white/25 hover:bg-white/20",
    outline: "bg-transparent text-ink ring-1 ring-inset ring-line hover:bg-white",
  }[variant];
  const badge = {
    primary: "bg-white text-royal",
    white: "bg-royal text-white",
    ghost: "bg-white text-royal",
    outline: "bg-ink text-white",
  }[variant];
  return (
    <motion.a
      href={href}
      whileTap={{ scale: 0.97 }}
      className={`group inline-flex h-[52px] items-center gap-3 rounded-full pl-6 pr-2 text-[14px] font-semibold transition-colors duration-300 ${v} ${className ?? ""}`}
    >
      {children}
      <span className={`relative flex h-9 w-9 items-center justify-center overflow-hidden rounded-full ${badge}`}>
        <Arrow className="absolute h-3.5 w-3.5 transition-transform duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:translate-x-5 group-hover:-translate-y-5" />
        <Arrow className="absolute h-3.5 w-3.5 -translate-x-5 translate-y-5 transition-transform duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:translate-x-0 group-hover:translate-y-0" />
      </span>
    </motion.a>
  );
}

export function Pill({ children, className }: { children: ReactNode; className?: string }) {
  return (
    <span className={`tag inline-flex items-center gap-2 rounded-full px-3.5 py-1.5 ${className ?? "bg-sky text-royal"}`}>
      <span className="h-1.5 w-1.5 rounded-full bg-current" />
      {children}
    </span>
  );
}

/** Feeds the cursor position to the `.spot` highlight. */
export function spotMove(e: PointerEvent<HTMLElement>) {
  const r = e.currentTarget.getBoundingClientRect();
  e.currentTarget.style.setProperty("--mx", `${e.clientX - r.left}px`);
  e.currentTarget.style.setProperty("--my", `${e.clientY - r.top}px`);
}

export function SectionHead({ tag, title, accentFrom, children }: { tag: string; title: string; accentFrom?: number; children?: ReactNode }) {
  return (
    <div className="flex flex-col justify-between gap-8 md:flex-row md:items-end">
      <div className="max-w-2xl">
        <Reveal y={12}>
          <Pill>{tag}</Pill>
        </Reveal>
        <h2 className="h-display mt-6 text-[clamp(2.2rem,4.6vw,4rem)]">
          <BlurWords text={title} accent={accentFrom !== undefined ? { from: accentFrom, className: "text-royal" } : undefined} />
        </h2>
      </div>
      {children && (
        <Reveal delay={0.15} className="max-w-sm text-[15px] leading-relaxed text-slate">
          {children}
        </Reveal>
      )}
    </div>
  );
}
