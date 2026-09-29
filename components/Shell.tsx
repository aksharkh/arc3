"use client";

import { useEffect, useState, type ReactNode } from "react";
import { ReactLenis } from "lenis/react";
import { motion } from "motion/react";
import { EASE, Mark, Wordmark } from "./ui";
import { bindPointer } from "@/lib/store";

export function Shell({ children }: { children: ReactNode }) {
  useEffect(bindPointer, []);
  return (
    <ReactLenis root options={{ lerp: 0.08, anchors: true }}>
      {children}
    </ReactLenis>
  );
}

const LINKS = [
  { href: "#expertise", label: "Expertise" },
  { href: "#approach", label: "Approach" },
  { href: "#contact", label: "Contact" },
];

/** Minimal header that switches ink colour with the section beneath it. */
export function Nav() {
  const [light, setLight] = useState(false);
  const [hidden, setHidden] = useState(false);

  useEffect(() => {
    let last = window.scrollY;
    const check = () => {
      const y = window.scrollY;
      if (Math.abs(y - last) > 4) {
        setHidden(y > last && y > window.innerHeight * 0.5);
        last = y;
      }
      const sections = document.querySelectorAll<HTMLElement>("[data-theme]");
      for (const s of sections) {
        const r = s.getBoundingClientRect();
        if (r.top <= 40 && r.bottom > 40) {
          setLight(s.dataset.theme === "light");
          return;
        }
      }
    };
    check();
    window.addEventListener("scroll", check, { passive: true });
    return () => window.removeEventListener("scroll", check);
  }, []);

  return (
    <motion.header
      initial={{ opacity: 0, y: -12 }}
      animate={{ opacity: hidden ? 0 : 1, y: hidden ? -24 : 0 }}
      transition={{ duration: hidden ? 0.5 : 1.1, ease: EASE }}
      className={`fixed inset-x-0 top-0 z-50 transition-colors duration-700 ${light ? "text-ink" : "text-bone"} ${hidden ? "pointer-events-none" : ""}`}
    >
      <div className="mx-auto flex h-20 max-w-[1440px] items-center justify-between px-6 md:h-24 md:px-12">
        <a href="#top" className="flex items-center gap-3" aria-label="TripleArc — home">
          <Mark className="h-7 w-7 text-gold" width={0.11} />
          <span className="text-[12px] font-medium">
            <Wordmark />
          </span>
        </a>
        <nav className="flex items-center gap-8 md:gap-12">
          {LINKS.map((l, i) => (
            <a
              key={l.href}
              href={l.href}
              className={`eyebrow group relative !text-[10.5px] ${i < 2 ? "hidden md:block" : ""}`}
            >
              {l.label}
              <span className="absolute -bottom-1.5 left-0 h-px w-full origin-right scale-x-0 bg-gold transition-transform duration-500 ease-out group-hover:origin-left group-hover:scale-x-100" />
            </a>
          ))}
        </nav>
      </div>
    </motion.header>
  );
}
