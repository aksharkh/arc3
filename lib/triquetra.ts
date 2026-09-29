/**
 * Geometry for the TripleArc mark: a triquetra drawn as one closed loop
 * of three circular arcs. Each arc joins two outer tips and bows past the
 * centre toward the third tip, so the arcs cross and form three leaves.
 */

export type Vec2 = [number, number];
export type Vec3 = [number, number, number];

const TIP_ANGLES = [90, -30, 210].map((d) => (d * Math.PI) / 180);

function circleThrough(a: Vec2, b: Vec2, c: Vec2) {
  const d = 2 * (a[0] * (b[1] - c[1]) + b[0] * (c[1] - a[1]) + c[0] * (a[1] - b[1]));
  const a2 = a[0] ** 2 + a[1] ** 2;
  const b2 = b[0] ** 2 + b[1] ** 2;
  const c2 = c[0] ** 2 + c[1] ** 2;
  const x = (a2 * (b[1] - c[1]) + b2 * (c[1] - a[1]) + c2 * (a[1] - b[1])) / d;
  const y = (a2 * (c[0] - b[0]) + b2 * (a[0] - c[0]) + c2 * (b[0] - a[0])) / d;
  return { x, y, r: Math.hypot(a[0] - x, a[1] - y) };
}

/** Samples an arc from `a` to `b` passing through `via`; `inclusive` adds the end point. */
function sampleArc(a: Vec2, via: Vec2, b: Vec2, steps: number, inclusive = false): Vec2[] {
  const { x, y, r } = circleThrough(a, via, b);
  const ang = (p: Vec2) => Math.atan2(p[1] - y, p[0] - x);
  const norm = (t: number) => ((t % (2 * Math.PI)) + 2 * Math.PI) % (2 * Math.PI);
  const a0 = ang(a);
  let a1 = ang(b);
  const ccw = norm(ang(via) - a0) < norm(a1 - a0);
  a1 = ccw ? a0 + norm(a1 - a0) : a0 - norm(a0 - a1);
  const pts: Vec2[] = [];
  const n = inclusive ? steps + 1 : steps;
  for (let i = 0; i < n; i++) {
    const t = a0 + ((a1 - a0) * i) / steps;
    pts.push([x + r * Math.cos(t), y + r * Math.sin(t)]);
  }
  return pts;
}

function tips(): Vec2[] {
  return TIP_ANGLES.map((t) => [Math.cos(t), Math.sin(t)] as Vec2);
}

function arcFor(k: number, bow: number, steps: number, inclusive = false) {
  const t = tips();
  const a = t[k];
  const b = t[(k + 1) % 3];
  const c = t[(k + 2) % 3];
  return sampleArc(a, [c[0] * bow, c[1] * bow], b, steps, inclusive);
}

/**
 * Closed loop as [x, y, z] (y up). z weaves over/under so the three
 * crossings alternate like a true knot.
 */
export function triquetraPoints(stepsPerArc = 160, bow = 0.34, weave = 0.2): Vec3[] {
  const out: Vec3[] = [];
  const total = stepsPerArc * 3;
  for (let k = 0; k < 3; k++) {
    arcFor(k, bow, stepsPerArc).forEach((p, i) => {
      const s = (k * stepsPerArc + i) / total;
      out.push([p[0], p[1], weave * Math.sin(6 * Math.PI * s)]);
    });
  }
  return out;
}

const toPath = (pts: Vec2[], close = false) =>
  pts.map((p, i) => `${i ? "L" : "M"}${p[0].toFixed(4)} ${(-p[1]).toFixed(4)}`).join(" ") + (close ? " Z" : "");

/** Full mark as one SVG path, viewBox "-1.2 -1.2 2.4 2.4". */
export function triquetraPath(bow = 0.34) {
  const pts: Vec2[] = [];
  for (let k = 0; k < 3; k++) pts.push(...arcFor(k, bow, 80));
  return toPath(pts, true);
}

/** The three arcs as separate SVG paths (same viewBox). */
export function triquetraArcPaths(bow = 0.34) {
  return [0, 1, 2].map((k) => toPath(arcFor(k, bow, 80, true)));
}
