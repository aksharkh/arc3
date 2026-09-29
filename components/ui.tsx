"use client";

import { useEffect, useRef, useState, type ReactNode } from "react";
import {
  animate,
  motion,
  useInView,
  useMotionValue,
  useSpring,
  type HTMLMotionProps,
} from "motion/react";
import { triquetraPath } from "@/lib/triquetra";
import { useLoaded } from "@/lib/store";

export const EASE = [0.16, 1, 0.3, 1] as const;
export const EASE_IO = [0.76, 0, 0.24, 1] as const;

const MARK = triquetraPath();

/** The TripleArc mark as a stroked SVG. */
export function Mark({
  className,
  stroke = "url(#ta-gold)",
  width = 0.13,
  draw,
}: {
  className?: string;
  stroke?: string;
  width?: number;
  draw?: boolean;
}) {
  return (
    <svg viewBox="-1.25 -1.2 2.5 2.35" className={className} aria-hidden>
      <defs>
        <linearGradient id="ta-gold" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stopColor="#f6e3a1" />
          <stop offset="0.45" stopColor="#d4af37" />
          <stop offset="1" stopColor="#9c7424" />
        </linearGradient>
      </defs>
      <motion.path
        d={MARK}
        fill="none"
        stroke={stroke}
        strokeWidth={width}
        strokeLinejoin="miter"
        strokeMiterlimit={8}
        initial={draw ? { pathLength: 0 } : false}
        animate={draw ? { pathLength: 1 } : undefined}
        transition={{ duration: 2.2, ease: EASE_IO }}
      />
    </svg>
  );
}

/** "TRIPLEΛRC" wordmark — the A is drawn as a chevron like the logo. */
export function Wordmark({ className, arcClass = "text-gold" }: { className?: string; arcClass?: string }) {
  return (
    <span className={`inline-flex items-baseline whitespace-nowrap tracking-[0.18em] ${className ?? ""}`}>
      TRIPLE
      <span className={`inline-flex items-baseline ${arcClass}`}>
        <svg viewBox="0 0 10 10" className="mx-[0.02em] inline-block h-[0.72em] w-[0.72em] self-baseline" style={{ transform: "translateY(0.02em)" }} aria-hidden>
          <path d="M0.6 10 L5 0.6 L9.4 10" fill="none" stroke="currentColor" strokeWidth="1.25" />
        </svg>
        <span className="tracking-[0.18em]">RC</span>
      </span>
    </span>
  );
}

/** Lines slide up out of a mask. Waits for the intro to finish. */
export function RevealLines({
  lines,
  className,
  lineClass,
  delay = 0,
  stagger = 0.09,
  once = true,
}: {
  lines: ReactNode[];
  className?: string;
  lineClass?: string;
  delay?: number;
  stagger?: number;
  once?: boolean;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once, margin: "0px 0px -12% 0px" });
  const loaded = useLoaded();
  const show = inView && loaded;
  return (
    <div ref={ref} className={className}>
      {lines.map((l, i) => (
        <span key={i} className="block overflow-hidden pb-[0.08em] -mb-[0.08em]">
          <motion.span
            className={`block ${lineClass ?? ""}`}
            initial={{ y: "110%", rotate: 2 }}
            animate={show ? { y: "0%", rotate: 0 } : { y: "110%", rotate: 2 }}
            transition={{ duration: 1.2, ease: EASE, delay: delay + i * stagger }}
          >
            {l}
          </motion.span>
        </span>
      ))}
    </div>
  );
}

/** Fades + lifts in when scrolled into view. */
export function Rise({ children, delay = 0, y = 40, ...rest }: HTMLMotionProps<"div"> & { delay?: number; y?: number }) {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: "0px 0px -10% 0px" });
  const loaded = useLoaded();
  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y }}
      animate={inView && loaded ? { opacity: 1, y: 0 } : undefined}
      transition={{ duration: 1.1, ease: EASE, delay }}
      {...rest}
    >
      {children}
    </motion.div>
  );
}

/** Element that leans toward the cursor. */
export function Magnetic({ children, strength = 0.35, className }: { children: ReactNode; strength?: number; className?: string }) {
  const ref = useRef<HTMLDivElement>(null);
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const sx = useSpring(x, { stiffness: 180, damping: 14, mass: 0.2 });
  const sy = useSpring(y, { stiffness: 180, damping: 14, mass: 0.2 });
  return (
    <motion.div
      ref={ref}
      className={`inline-block ${className ?? ""}`}
      style={{ x: sx, y: sy }}
      onPointerMove={(e) => {
        const r = ref.current!.getBoundingClientRect();
        x.set((e.clientX - (r.left + r.width / 2)) * strength);
        y.set((e.clientY - (r.top + r.height / 2)) * strength);
      }}
      onPointerLeave={() => {
        x.set(0);
        y.set(0);
      }}
    >
      {children}
    </motion.div>
  );
}

/** Pill button with a liquid fill that rises from the cursor side. */
export function PillButton({
  children,
  href = "#contact",
  variant = "gold",
  className,
}: {
  children: ReactNode;
  href?: string;
  variant?: "gold" | "ghost" | "dark";
  className?: string;
}) {
  const styles = {
    gold: "bg-gold text-ink",
    ghost: "border border-white/25 text-pearl",
    dark: "bg-ink text-pearl",
  }[variant];
  const fill = { gold: "bg-pearl", ghost: "bg-gold", dark: "bg-gold" }[variant];
  const hoverText = { gold: "group-hover:text-ink", ghost: "group-hover:text-ink", dark: "group-hover:text-ink" }[variant];
  return (
    <Magnetic strength={0.25}>
      <a
        href={href}
        data-cursor="hide"
        className={`group relative inline-flex h-14 items-center gap-3 overflow-hidden rounded-full px-7 text-[13px] font-semibold uppercase tracking-[0.14em] ${styles} ${className ?? ""}`}
      >
        <span
          className={`absolute left-1/2 top-full aspect-square w-[160%] -translate-x-1/2 rounded-full ${fill} transition-transform duration-700 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:-translate-y-[70%]`}
        />
        <span className={`relative z-10 flex items-center gap-3 transition-colors duration-500 ${hoverText}`}>
          {children}
          <Arrow className="h-3.5 w-3.5 transition-transform duration-500 group-hover:-rotate-45" />
        </span>
      </a>
    </Magnetic>
  );
}

export function Arrow({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 16 16" className={className} fill="none" stroke="currentColor" strokeWidth="1.5" aria-hidden>
      <path d="M1 8h13M9 3l5 5-5 5" />
    </svg>
  );
}

/** Counts up once in view. */
export function Counter({ to, suffix = "", duration = 2.2 }: { to: number; suffix?: string; duration?: number }) {
  const ref = useRef<HTMLSpanElement>(null);
  const inView = useInView(ref, { once: true, margin: "0px 0px -15% 0px" });
  const [v, setV] = useState(0);
  useEffect(() => {
    if (!inView) return;
    const c = animate(0, to, { duration, ease: EASE, onUpdate: (n) => setV(Math.round(n)) });
    return () => c.stop();
  }, [inView, to, duration]);
  return (
    <span ref={ref}>
      {v}
      {suffix}
    </span>
  );
}

export function SectionTag({ index, children, dark = true }: { index: string; children: ReactNode; dark?: boolean }) {
  return (
    <div className={`label flex items-center gap-4 ${dark ? "text-pearl/60" : "text-navy/60"}`}>
      <span className="text-gold">{index}</span>
      <span className={`h-px w-10 ${dark ? "bg-pearl/25" : "bg-navy/25"}`} />
      <span>{children}</span>
    </div>
  );
}
