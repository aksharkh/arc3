"use client";

import { useRef, type ReactNode } from "react";
import { motion, useInView, type HTMLMotionProps } from "motion/react";
import { triquetraArcPaths, triquetraPath } from "@/lib/triquetra";

export const EASE = [0.22, 1, 0.36, 1] as const;

/**
 * Clamped linear map. Used via `useTransform(mv, fn)` rather than the
 * array form so Motion doesn't hand opacity to a native ScrollTimeline,
 * which drifts out of sync with Lenis.
 */
export function lerpRange(v: number, [a, b]: number[], [c, d]: number[]) {
  const t = Math.min(Math.max((v - a) / (b - a), 0), 1);
  return c + (d - c) * t;
}

const MARK = triquetraPath();
const ARCS = triquetraArcPaths();

/** The TripleArc mark as a single stroke. */
export function Mark({ className, color = "currentColor", width = 0.12 }: { className?: string; color?: string; width?: number }) {
  return (
    <svg viewBox="-1.25 -1.2 2.5 2.35" className={className} aria-hidden>
      <path d={MARK} fill="none" stroke={color} strokeWidth={width} strokeLinejoin="miter" strokeMiterlimit={8} />
    </svg>
  );
}

/** The mark with one arc picked out; the others recede. */
export function MarkArc({ active, className, draw = true }: { active: number; className?: string; draw?: boolean }) {
  const ref = useRef<SVGSVGElement>(null);
  const inView = useInView(ref, { once: true, margin: "0px 0px -15% 0px" });
  return (
    <svg ref={ref} viewBox="-1.25 -1.2 2.5 2.35" className={className} aria-hidden>
      {ARCS.map((d, i) => (
        <path key={i} d={d} fill="none" stroke="currentColor" strokeOpacity={0.18} strokeWidth={0.035} strokeLinecap="round" />
      ))}
      <motion.path
        d={ARCS[active]}
        fill="none"
        stroke="var(--gold)"
        strokeWidth={0.05}
        strokeLinecap="round"
        initial={{ pathLength: draw ? 0 : 1 }}
        animate={inView ? { pathLength: 1 } : undefined}
        transition={{ duration: 1.8, ease: EASE, delay: 0.2 }}
      />
    </svg>
  );
}

/** "TRIPLEΛRC" — the A drawn as a chevron, as in the logo. */
export function Wordmark({ className, arcClass = "text-gold" }: { className?: string; arcClass?: string }) {
  return (
    <span className={`inline-flex items-baseline whitespace-nowrap tracking-[0.22em] ${className ?? ""}`}>
      TRIPLE
      <span className={`inline-flex items-baseline ${arcClass}`}>
        <svg viewBox="0 0 10 10" className="mx-[0.03em] inline-block h-[0.72em] w-[0.7em]" aria-hidden>
          <path d="M0.7 10 L5 0.7 L9.3 10" fill="none" stroke="currentColor" strokeWidth="1.2" />
        </svg>
        <span className="tracking-[0.22em]">RC</span>
      </span>
    </span>
  );
}

/** Each line rises out of its own mask. */
export function Lines({ lines, className, delay = 0, stagger = 0.08 }: { lines: ReactNode[]; className?: string; delay?: number; stagger?: number }) {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: "0px 0px -10% 0px" });
  return (
    <div ref={ref} className={className}>
      {lines.map((l, i) => (
        <span key={i} className="block overflow-hidden pb-[0.1em] -mb-[0.1em]">
          <motion.span
            className="block"
            initial={{ y: "105%" }}
            animate={inView ? { y: "0%" } : undefined}
            transition={{ duration: 1.3, ease: EASE, delay: delay + i * stagger }}
          >
            {l}
          </motion.span>
        </span>
      ))}
    </div>
  );
}

/** Words rise in sequence; `muted` continues the sentence in a softer tone. */
export function Words({ text, muted, className }: { text: string; muted?: string; className?: string }) {
  const ref = useRef<HTMLParagraphElement>(null);
  const inView = useInView(ref, { once: true, margin: "0px 0px -10% 0px" });
  const words = [
    ...text.split(" ").map((w) => ({ w, m: false })),
    ...(muted ? muted.split(" ").map((w) => ({ w, m: true })) : []),
  ];
  return (
    <p ref={ref} className={className}>
      {words.map(({ w, m }, i) => (
        <span key={i} className="inline-block overflow-hidden pb-[0.1em] -mb-[0.1em] align-top">
          <motion.span
            className={`mr-[0.26em] inline-block ${m ? "opacity-45" : ""}`}
            initial={{ y: "105%" }}
            animate={inView ? { y: "0%" } : undefined}
            transition={{ duration: 1.2, ease: EASE, delay: i * 0.025 }}
          >
            {w}
          </motion.span>
        </span>
      ))}
    </p>
  );
}

export function FadeUp({ children, delay = 0, ...rest }: HTMLMotionProps<"div"> & { delay?: number }) {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: "0px 0px -8% 0px" });
  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 24 }}
      animate={inView ? { opacity: 1, y: 0 } : undefined}
      transition={{ duration: 1.2, ease: EASE, delay }}
      {...rest}
    >
      {children}
    </motion.div>
  );
}

/** Hairline that draws itself across. */
export function Rule({ className, delay = 0 }: { className?: string; delay?: number }) {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: "0px 0px -5% 0px" });
  return (
    <div ref={ref} className={`h-px overflow-hidden ${className ?? ""}`}>
      <motion.div
        className="h-full w-full origin-left bg-current"
        initial={{ scaleX: 0 }}
        animate={inView ? { scaleX: 1 } : undefined}
        transition={{ duration: 1.6, ease: EASE, delay }}
      />
    </div>
  );
}

/** Understated text link with an underline that sweeps through on hover. */
export function TextLink({ href, children, className }: { href: string; children: ReactNode; className?: string }) {
  return (
    <a href={href} className={`group relative inline-flex items-center gap-3 pb-1.5 ${className ?? ""}`}>
      <span>{children}</span>
      <svg viewBox="0 0 16 10" className="h-2.5 w-4 transition-transform duration-500 ease-out group-hover:translate-x-1" fill="none" stroke="currentColor" strokeWidth="1.2" aria-hidden>
        <path d="M0 5h15M11 1l4 4-4 4" />
      </svg>
      <span className="absolute bottom-0 left-0 h-px w-full origin-right scale-x-100 bg-current opacity-40 transition-transform duration-700 ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:origin-left group-hover:scale-x-0" />
      <span className="absolute bottom-0 left-0 h-px w-full origin-left scale-x-0 bg-gold transition-transform delay-100 duration-700 ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:scale-x-100" />
    </a>
  );
}
