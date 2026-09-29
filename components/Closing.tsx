"use client";

import { useRef, useState, type FormEvent } from "react";
import dynamic from "next/dynamic";
import { AnimatePresence, motion, useScroll, useTransform } from "motion/react";
import { Arrow, EASE, Magnetic, Mark, RevealLines, Wordmark } from "./ui";

const WaveScene = dynamic(() => import("./scene/Scenes").then((m) => m.WaveScene), { ssr: false });

function RingButton() {
  const text = "Start the conversation · Start the conversation · ";
  return (
    <Magnetic strength={0.4}>
      <a
        href="mailto:hello@triplearcgrc.com"
        data-cursor="hide"
        className="group relative flex h-44 w-44 items-center justify-center rounded-full bg-gold text-ink md:h-52 md:w-52"
      >
        <span className="absolute inset-0 scale-0 rounded-full bg-pearl transition-transform duration-700 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:scale-100" />
        <motion.svg
          viewBox="0 0 200 200"
          className="absolute inset-2"
          animate={{ rotate: 360 }}
          transition={{ duration: 18, repeat: Infinity, ease: "linear" }}
          aria-hidden
        >
          <defs>
            <path id="ring" d="M100,100 m-80,0 a80,80 0 1,1 160,0 a80,80 0 1,1 -160,0" />
          </defs>
          <text className="fill-ink font-mono text-[11.5px] uppercase tracking-[0.2em]">
            <textPath href="#ring">{text}</textPath>
          </text>
        </motion.svg>
        <Arrow className="relative h-7 w-7 -rotate-45 transition-transform duration-700 group-hover:rotate-0" />
      </a>
    </Magnetic>
  );
}

function ContactForm() {
  const [sent, setSent] = useState(false);
  const submit = (e: FormEvent) => {
    e.preventDefault();
    setSent(true);
  };
  const field =
    "peer w-full border-b border-white/20 bg-transparent pb-3 pt-6 text-[16px] text-pearl outline-none transition-colors placeholder-transparent focus:border-gold";
  const lab =
    "label pointer-events-none absolute left-0 top-6 text-pearl/45 transition-all duration-300 peer-focus:top-0 peer-focus:text-gold peer-[:not(:placeholder-shown)]:top-0";
  return (
    <div className="relative rounded-3xl border border-white/10 bg-ink/50 p-8 backdrop-blur-xl md:p-10">
      <AnimatePresence mode="wait">
        {sent ? (
          <motion.div key="ok" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="flex min-h-[22rem] flex-col items-start justify-center">
            <Mark draw className="h-16 w-16" width={0.12} />
            <p className="mt-8 font-serif text-4xl italic">Thank you.</p>
            <p className="mt-3 text-pearl/60">A partner will respond within one business day.</p>
          </motion.div>
        ) : (
          <motion.form key="f" onSubmit={submit} exit={{ opacity: 0, y: -20 }} className="grid gap-6 md:grid-cols-2">
            {[
              ["name", "Full name", "text"],
              ["company", "Organisation", "text"],
              ["email", "Work email", "email"],
              ["role", "Role", "text"],
            ].map(([n, l, t]) => (
              <label key={n} className="relative block">
                <input name={n} type={t} required={n !== "role"} placeholder={l} className={field} />
                <span className={lab}>{l}</span>
              </label>
            ))}
            <label className="relative block md:col-span-2">
              <textarea name="msg" rows={3} placeholder="What are you solving for?" className={`${field} resize-none`} />
              <span className={lab}>What are you solving for?</span>
            </label>
            <div className="flex flex-wrap items-center justify-between gap-4 md:col-span-2">
              <p className="label text-pearl/35">Confidential · NDA on request</p>
              <button type="submit" className="group inline-flex h-14 items-center gap-3 rounded-full bg-pearl px-7 text-[12px] font-semibold uppercase tracking-[0.14em] text-ink transition-colors duration-500 hover:bg-gold">
                Send brief
                <Arrow className="h-3.5 w-3.5 transition-transform duration-500 group-hover:translate-x-1" />
              </button>
            </div>
          </motion.form>
        )}
      </AnimatePresence>
    </div>
  );
}

export default function Closing() {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start end", "end end"] });
  const wordY = useTransform(scrollYProgress, [0, 1], ["40%", "0%"]);

  return (
    <>
      <section id="contact" className="relative overflow-hidden bg-ink">
        <WaveScene shift={-0.45} />
        <div className="pointer-events-none absolute inset-0 bg-gradient-to-b from-ink via-transparent to-ink" />
        <div className="relative mx-auto grid max-w-[1600px] gap-16 px-6 py-32 md:px-10 md:py-48 lg:grid-cols-12">
          <div className="lg:col-span-6">
            <p className="label flex items-center gap-4 text-pearl/60">
              <span className="h-px w-12 bg-gold" /> 07 — Contact
            </p>
            <h2 className="mt-8 text-[clamp(3rem,7.6vw,8.4rem)] font-light leading-[0.92] tracking-[-0.05em]">
              <RevealLines lines={["Uncertainty", "is a", <span key="c" className="gold-text font-serif italic">choice.</span>]} />
            </h2>
            <div className="mt-14 flex items-center gap-8">
              <RingButton />
              <div className="text-[15px] leading-relaxed text-pearl/65">
                <p>hello@triplearcgrc.com</p>
                <p>+91 22 4000 3000</p>
              </div>
            </div>
          </div>
          <motion.div
            className="self-end lg:col-span-6"
            initial={{ opacity: 0, y: 60 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-10%" }}
            transition={{ duration: 1.2, ease: EASE }}
          >
            <ContactForm />
          </motion.div>
        </div>
      </section>

      <footer ref={ref} className="relative overflow-hidden bg-ink px-6 pt-24 md:px-10">
        <div className="mx-auto grid max-w-[1600px] gap-12 border-t border-white/10 pt-16 sm:grid-cols-2 lg:grid-cols-5">
          <div className="lg:col-span-2">
            <div className="flex items-center gap-4">
              <Mark className="h-12 w-12" width={0.12} />
              <div>
                <p className="text-sm font-semibold"><Wordmark /></p>
                <p className="label mt-1 !text-[9px] text-gold">GRC Solutions</p>
              </div>
            </div>
            <p className="mt-8 max-w-sm text-[15px] leading-relaxed text-pearl/55">
              Independent advisory for boards, risk leaders and regulators&apos; favourite auditees.
            </p>
          </div>
          {[
            ["Offices", ["Mumbai — BKC", "London — EC2", "Dubai — DIFC"]],
            ["Practice", ["Governance", "Risk", "Compliance", "Insights"]],
            ["Follow", ["LinkedIn", "X / Twitter", "Newsletter"]],
          ].map(([h, items]) => (
            <div key={h as string}>
              <p className="label text-pearl/40">{h}</p>
              <ul className="mt-6 space-y-3">
                {(items as string[]).map((it) => (
                  <li key={it}>
                    <a href="#top" className="group inline-flex items-center text-[15px] text-pearl/80 transition-colors hover:text-gold">
                      <span className="mr-0 h-px w-0 bg-gold transition-all duration-500 group-hover:mr-2 group-hover:w-4" />
                      {it}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <motion.div style={{ y: wordY }} className="mx-auto mt-24 max-w-[1600px] select-none text-center">
          <p className="bg-gradient-to-b from-pearl/90 to-pearl/0 bg-clip-text text-[13.6vw] font-semibold leading-[0.8] tracking-[-0.02em] text-transparent">
            <Wordmark arcClass="text-gold/85" className="!tracking-[0.04em]" />
          </p>
        </motion.div>

        <div className="relative mx-auto flex max-w-[1600px] flex-col justify-between gap-4 border-t border-white/10 py-8 sm:flex-row">
          <p className="label text-pearl/35">© {new Date().getFullYear()} TripleArc GRC Solutions</p>
          <p className="label text-pearl/35">Governance · Risk · Compliance</p>
          <a href="#top" className="label text-pearl/60 transition-colors hover:text-gold">
            Back to top ↑
          </a>
        </div>
      </footer>
    </>
  );
}
