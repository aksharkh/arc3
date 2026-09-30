export type Chapter = {
  id: string;
  title: string;
  label: string;
  lead: string;
  body: string;
  /** which arc of the mark this chapter lights (pillars only) */
  arc: number | null;
  bg: string;
  fg: string;
  accent: string;
  kind: "intro" | "pillar" | "method" | "proof" | "contact";
  points?: string[];
};

const INK = "#07111f";
const BONE = "#f1efe9";
const GOLD = "#d4af37";
const ROYAL = "#0f4cb1";

export const CHAPTERS: Chapter[] = [
  {
    id: "intro",
    title: "TRIPLEARC",
    label: "GRC Solutions",
    lead: "Governance, risk and compliance — held in one structure.",
    body: "Turn the dial. Each position opens one part of the practice.",
    arc: null,
    bg: INK,
    fg: BONE,
    accent: GOLD,
    kind: "intro",
  },
  {
    id: "governance",
    title: "GOVERNANCE",
    label: "First arc",
    lead: "Structures that decide.",
    body: "Charters, policies and accountabilities that turn board intent into decisions — and decisions into evidence.",
    arc: 0,
    bg: ROYAL,
    fg: "#ffffff",
    accent: GOLD,
    kind: "pillar",
    points: ["GRC operating model", "Board & committee charters", "Policy architecture"],
  },
  {
    id: "risk",
    title: "RISK",
    label: "Second arc",
    lead: "Measured before it is felt.",
    body: "Enterprise, cyber and third-party exposure quantified in money and watched continuously.",
    arc: 1,
    bg: BONE,
    fg: INK,
    accent: ROYAL,
    kind: "pillar",
    points: ["Enterprise risk registers", "Cyber risk quantification", "Third-party risk"],
  },
  {
    id: "compliance",
    title: "COMPLIANCE",
    label: "Third arc",
    lead: "Holds when it is tested.",
    body: "Every obligation mapped to a control, every control to its evidence. Audit-ready on any given Tuesday.",
    arc: 2,
    bg: GOLD,
    fg: INK,
    accent: INK,
    kind: "pillar",
    points: ["DPDP · SEBI · RBI · GDPR", "ISO 27001 · SOC 2", "Internal audit"],
  },
  {
    id: "method",
    title: "METHOD",
    label: "How we work",
    lead: "Five moves. Each ends with a signed artefact.",
    body: "",
    arc: null,
    bg: "#0a1d2f",
    fg: BONE,
    accent: "#5b9bff",
    kind: "method",
    points: ["Diagnose", "Design", "Deploy", "Assure", "Evolve"],
  },
  {
    id: "proof",
    title: "PROOF",
    label: "The record",
    lead: "Numbers we can defend in front of any auditor.",
    body: "",
    arc: null,
    bg: "#e6eefb",
    fg: INK,
    accent: ROYAL,
    kind: "proof",
  },
  {
    id: "contact",
    title: "CONTACT",
    label: "Open the vault",
    lead: "Begin with a thirty-minute conversation.",
    body: "No deck, no pitch — your exposure, and what we would do about it.",
    arc: null,
    bg: INK,
    fg: BONE,
    accent: GOLD,
    kind: "contact",
  },
];
