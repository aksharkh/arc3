"use client";

import { useState, type ReactNode } from "react";
import { ReactLenis } from "lenis/react";
import { AnimatePresence, motion, useMotionValueEvent, useScroll, useSpring } from "motion/react";
import { Arrow, EASE, Logo } from "./ui";

export function Shell({ children }: { children: ReactNode }) {
  const { scrollYProgress } = useScroll();
  const bar = useSpring(scrollYProgress, { stiffness: 140, damping: 28, mass: 0.4 });
  return (
    <ReactLenis root options={{ lerp: 0.09, anchors: { offset: -96 } }}>
      <motion.div style={{ scaleX: bar }} className="fixed inset-x-0 top-0 z-[60] h-[3px] origin-left bg-royal" />
      {children}
    </ReactLenis>
  );
}

const LINKS = [
  { href: "#services", label: "Services" },
  { href: "#process", label: "Process" },
  { href: "#results", label: "Results" },
  { href: "#faq", label: "FAQ" },
];

/** Floating pill header; the hover highlight glides between links. */
export function Nav() {
  const [hover, setHover] = useState<string | null>(null);
  const [open, setOpen] = useState(false);
  const [compact, setCompact] = useState(false);
  const { scrollY } = useScroll();
  useMotionValueEvent(scrollY, "change", (v) => setCompact(v > 40));

  return (
    <motion.header
      initial={{ y: -80, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 1, ease: EASE, delay: 0.1 }}
      className="fixed inset-x-0 top-4 z-50 px-4"
    >
      <div
        className={`mx-auto flex h-16 items-center justify-between rounded-full border border-white/60 bg-white/90 pl-4 pr-2 shadow-soft backdrop-blur-xl transition-[max-width] duration-700 ease-[cubic-bezier(0.22,1,0.36,1)] ${
          compact ? "max-w-[860px]" : "max-w-[1280px]"
        }`}
      >
        <a href="#top" aria-label="TripleArc — home">
          <Logo />
        </a>
        <nav className="hidden items-center md:flex" onPointerLeave={() => setHover(null)}>
          {LINKS.map((l) => (
            <a
              key={l.href}
              href={l.href}
              onPointerEnter={() => setHover(l.href)}
              className="relative px-4 py-2 text-[14px] font-medium text-slate transition-colors hover:text-ink"
            >
              {hover === l.href && (
                <motion.span layoutId="nav-hover" className="absolute inset-0 rounded-full bg-sky" transition={{ type: "spring", stiffness: 400, damping: 32 }} />
              )}
              <span className="relative">{l.label}</span>
            </a>
          ))}
        </nav>
        <div className="flex items-center gap-2">
          <a
            href="#contact"
            className="group hidden h-12 items-center gap-2 rounded-full bg-ink px-5 text-[14px] font-semibold text-white transition-colors duration-300 hover:bg-royal sm:inline-flex"
          >
            Book a call
            <Arrow className="h-3 w-3 transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
          </a>
          <button
            onClick={() => setOpen((o) => !o)}
            aria-label={open ? "Close menu" : "Open menu"}
            className="flex h-12 w-12 flex-col items-center justify-center gap-[5px] rounded-full bg-sky md:hidden"
          >
            <motion.span animate={open ? { rotate: 45, y: 3.5 } : { rotate: 0, y: 0 }} className="block h-[2px] w-5 rounded bg-ink" />
            <motion.span animate={open ? { rotate: -45, y: -3.5 } : { rotate: 0, y: 0 }} className="block h-[2px] w-5 rounded bg-ink" />
          </button>
        </div>
      </div>

      <AnimatePresence>
        {open && (
          <motion.nav
            initial={{ opacity: 0, y: -12, scale: 0.97 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -12, scale: 0.97 }}
            transition={{ duration: 0.35, ease: EASE }}
            className="mx-auto mt-2 flex origin-top flex-col rounded-3xl border border-white/60 bg-white/95 p-3 shadow-lift backdrop-blur-xl md:hidden"
          >
            {[...LINKS, { href: "#contact", label: "Book a call" }].map((l, i) => (
              <motion.a
                key={l.href}
                href={l.href}
                onClick={() => setOpen(false)}
                initial={{ opacity: 0, x: -12 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.05 * i, duration: 0.4, ease: EASE }}
                className="flex items-center justify-between rounded-2xl px-4 py-3.5 text-[16px] font-semibold active:bg-sky"
              >
                {l.label}
                <Arrow className="h-3.5 w-3.5 text-royal" />
              </motion.a>
            ))}
          </motion.nav>
        )}
      </AnimatePresence>
    </motion.header>
  );
}
