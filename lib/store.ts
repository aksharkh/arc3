"use client";

/** Normalised pointer shared with the WebGL scenes (u/v: 0..1, x/y: -1..1, y up). */
export const pointer = { x: 0, y: 0, u: 0.5, v: 0.5 };

let bound = false;

export function bindPointer() {
  if (bound || typeof window === "undefined") return;
  bound = true;
  window.addEventListener("pointermove", (e) => {
    pointer.u = e.clientX / window.innerWidth;
    pointer.v = 1 - e.clientY / window.innerHeight;
    pointer.x = pointer.u * 2 - 1;
    pointer.y = pointer.v * 2 - 1;
  });
}
