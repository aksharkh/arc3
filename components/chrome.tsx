"use client";

import { useEffect, useRef, useState, type ReactNode } from "react";
import { ReactLenis, useLenis } from "lenis/react";
import {
  AnimatePresence,
  animate,
  motion,
  useMotionValue,
  useMotionValueEvent,
  useScroll,
  useSpring,
} from "motion/react";
import { EASE, EASE_IO, Mark, Wordmark } from "./ui";
import { setLoaded, trackPointer, useLoaded } from "@/lib/store";

export function Providers({ children }: { children: ReactNode }) {
  return (
    <ReactLenis root options={{ lerp: 0.085, anchors: { offset: 0 }, wheelMultiplier: 0.95 }}>
      {children}
      <Preloader />
      <Cursor />
      <div className="grain" aria-hidden />
    </ReactLenis>
  );
}

/* ---------------------------------------------------------------- Preloader */

function Preloader() {
  const [n, setN] = useState(0);
  const [done, setDone] = useState(false);
  const lenis = useLenis();

  useEffect(() => {
    lenis?.stop();
    window.scrollTo(0, 0);
  }, [lenis]);

  useEffect(() => {
    const c = animate(0, 100, {
      duration: 2.6,
      ease: [0.65, 0, 0.35, 1],
      onUpdate: (v) => setN(Math.round(v)),
      onComplete: () => {
        setTimeout(() => {
          setDone(true);
          setLoaded();
        }, 250);
      },
    });
    return () => c.stop();
  }, []);

  useEffect(() => {
    if (done) lenis?.start();
  }, [done, lenis]);

  return (
    <AnimatePresence>
      {!done && (
        <motion.div
          key="pre"
          className="fixed inset-0 z-[100] flex flex-col bg-ink text-pearl"
          exit={{ clipPath: "inset(0 0 100% 0)" }}
          initial={{ clipPath: "inset(0 0 0% 0)" }}
          transition={{ duration: 1.1, ease: EASE_IO }}
        >
          <div className="flex items-center justify-between px-6 pt-6 md:px-10 md:pt-8">
            <span className="label text-pearl/50">TripleArc GRC Solutions</span>
            <span className="label text-pearl/50">Governance · Risk · Compliance</span>
          </div>
          <div className="flex flex-1 flex-col items-center justify-center gap-8">
            <Mark draw className="h-28 w-28 md:h-36 md:w-36" width={0.09} />
            <motion.div
              initial={{ opacity: 0, letterSpacing: "0.6em" }}
              animate={{ opacity: 1, letterSpacing: "0.18em" }}
              transition={{ duration: 1.6, ease: EASE, delay: 0.4 }}
              className="text-lg font-medium md:text-xl"
            >
              <Wordmark />
            </motion.div>
          </div>
          <div className="flex items-end justify-between px-6 pb-6 md:px-10 md:pb-8">
            <span className="label max-w-[16rem] text-pearl/40">Assembling the architecture of assurance</span>
            <span className="font-serif text-7xl leading-none tabular-nums text-gold md:text-9xl">
              {String(n).padStart(3, "0")}
            </span>
          </div>
          <motion.div
            className="absolute bottom-0 left-0 h-[2px] bg-gold"
            style={{ width: `${n}%` }}
          />
        </motion.div>
      )}
    </AnimatePresence>
  );
}

/* ------------------------------------------------------------------- Cursor */

function Cursor() {
  const x = useMotionValue(-100);
  const y = useMotionValue(-100);
  const rx = useSpring(x, { stiffness: 260, damping: 28, mass: 0.5 });
  const ry = useSpring(y, { stiffness: 260, damping: 28, mass: 0.5 });
  const [mode, setMode] = useState<"idle" | "link" | "hide" | "label">("idle");
  const [label, setLabel] = useState("");

  useEffect(() => {
    const move = (e: PointerEvent) => {
      trackPointer(e);
      x.set(e.clientX);
      y.set(e.clientY);
      const el = (e.target as HTMLElement)?.closest?.("[data-cursor], a, button") as HTMLElement | null;
      const c = el?.getAttribute("data-cursor");
      if (!el) setMode("idle");
      else if (c === "hide") setMode("hide");
      else if (c) {
        setMode("label");
        setLabel(c);
      } else setMode("link");
    };
    window.addEventListener("pointermove", move);
    return () => window.removeEventListener("pointermove", move);
  }, [x, y]);

  const size = { idle: 40, link: 72, hide: 0, label: 96 }[mode];

  return (
    <>
      <motion.div
        className="cursor-ui pointer-events-none fixed left-0 top-0 z-[95] flex items-center justify-center rounded-full border"
        style={{ x: rx, y: ry, translateX: "-50%", translateY: "-50%" }}
        animate={{
          width: size,
          height: size,
          backgroundColor: mode === "label" ? "rgba(212,175,55,1)" : mode === "link" ? "rgba(212,175,55,0.14)" : "rgba(212,175,55,0)",
          borderColor: mode === "label" ? "rgba(212,175,55,0)" : "rgba(212,175,55,0.7)",
        }}
        transition={{ duration: 0.45, ease: EASE }}
      >
        <AnimatePresence>
          {mode === "label" && (
            <motion.span
              key={label}
              initial={{ opacity: 0, scale: 0.6 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0 }}
              className="label !text-[10px] font-medium text-ink"
            >
              {label}
            </motion.span>
          )}
        </AnimatePresence>
      </motion.div>
      <motion.div
        className="cursor-ui pointer-events-none fixed left-0 top-0 z-[96] h-1.5 w-1.5 rounded-full bg-gold"
        style={{ x, y, translateX: "-50%", translateY: "-50%" }}
        animate={{ opacity: mode === "label" ? 0 : 1 }}
      />
    </>
  );
}

/* ---------------------------------------------------------------------- Nav */

const LINKS = [
  { href: "#pillars", label: "Pillars" },
  { href: "#services", label: "Services" },
  { href: "#method", label: "Method" },
  { href: "#proof", label: "Proof" },
];

function RollText({ children }: { children: string }) {
  return (
    <span className="relative block overflow-hidden">
      <span className="block transition-transform duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:-translate-y-full">
        {children}
      </span>
      <span className="absolute left-0 top-full block text-gold transition-transform duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:-translate-y-full">
        {children}
      </span>
    </span>
  );
}

export function Nav() {
  const loaded = useLoaded();
  const { scrollY } = useScroll();
  const [hidden, setHidden] = useState(false);
  const [solid, setSolid] = useState(false);
  const [open, setOpen] = useState(false);
  const last = useRef(0);
  const lenis = useLenis();

  useMotionValueEvent(scrollY, "change", (v) => {
    setHidden(v > last.current && v > 400 && !open);
    setSolid(v > 60);
    last.current = v;
  });

  useEffect(() => {
    if (open) lenis?.stop();
    else if (loaded) lenis?.start();
  }, [open, lenis, loaded]);

  return (
    <>
      <motion.header
        initial={{ y: -100 }}
        animate={{ y: loaded && !hidden ? 0 : -110 }}
        transition={{ duration: 0.9, ease: EASE, delay: hidden ? 0 : 0.2 }}
        className="fixed inset-x-0 top-0 z-50 px-4 pt-4 md:px-8 md:pt-5"
      >
        <div
          className={`mx-auto flex h-16 max-w-[1600px] items-center justify-between rounded-full pl-5 pr-2 transition-[background-color,border-color,backdrop-filter] duration-700 ${
            solid || open ? "border border-white/10 bg-ink/55 backdrop-blur-xl" : "border border-transparent"
          }`}
        >
          <a href="#top" className="flex items-center gap-3" aria-label="TripleArc home">
            <Mark className="h-8 w-8" width={0.14} />
            <span className="text-[13px] font-semibold">
              <Wordmark />
            </span>
          </a>
          <nav className="hidden items-center gap-9 lg:flex">
            {LINKS.map((l) => (
              <a key={l.href} href={l.href} className="group text-[12px] font-medium uppercase tracking-[0.16em] text-pearl/80">
                <RollText>{l.label}</RollText>
              </a>
            ))}
          </nav>
          <div className="flex items-center gap-2">
            <a
              href="#contact"
              className="group hidden h-12 items-center gap-2 rounded-full bg-gold px-6 text-[12px] font-semibold uppercase tracking-[0.14em] text-ink md:inline-flex"
            >
              <RollText>Book a consultation</RollText>
            </a>
            <button
              onClick={() => setOpen((o) => !o)}
              className="flex h-12 w-12 flex-col items-center justify-center gap-1.5 rounded-full border border-white/15 lg:hidden"
              aria-label={open ? "Close menu" : "Open menu"}
            >
              <motion.span animate={open ? { rotate: 45, y: 4 } : { rotate: 0, y: 0 }} className="block h-px w-5 bg-pearl" />
              <motion.span animate={open ? { rotate: -45, y: -3 } : { rotate: 0, y: 0 }} className="block h-px w-5 bg-pearl" />
            </button>
          </div>
        </div>
      </motion.header>

      <AnimatePresence>
        {open && (
          <motion.div
            className="fixed inset-0 z-40 flex flex-col justify-end bg-ink px-6 pb-10 pt-28"
            initial={{ clipPath: "circle(0% at 92% 6%)" }}
            animate={{ clipPath: "circle(150% at 92% 6%)" }}
            exit={{ clipPath: "circle(0% at 92% 6%)" }}
            transition={{ duration: 0.9, ease: EASE_IO }}
          >
            <Mark className="pointer-events-none absolute -right-24 top-24 h-96 w-96 opacity-[0.07]" width={0.05} />
            {[...LINKS, { href: "#contact", label: "Contact" }].map((l, i) => (
              <div key={l.href} className="overflow-hidden border-b border-white/10">
                <motion.a
                  href={l.href}
                  onClick={() => setOpen(false)}
                  initial={{ y: "100%" }}
                  animate={{ y: 0 }}
                  transition={{ duration: 0.8, ease: EASE, delay: 0.25 + i * 0.06 }}
                  className="flex items-baseline justify-between py-4 font-serif text-5xl"
                >
                  {l.label}
                  <span className="label text-gold">0{i + 1}</span>
                </motion.a>
              </div>
            ))}
            <p className="label mt-8 text-pearl/40">hello@triplearcgrc.com</p>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
