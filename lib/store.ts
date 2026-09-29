"use client";

import { useSyncExternalStore } from "react";

/** Tiny global state: whether the intro has finished, plus a live pointer. */

let loaded = false;
const listeners = new Set<() => void>();

export function setLoaded() {
  loaded = true;
  listeners.forEach((l) => l());
}

export function useLoaded() {
  return useSyncExternalStore(
    (l) => {
      listeners.add(l);
      return () => listeners.delete(l);
    },
    () => loaded,
    () => false,
  );
}

/** Normalised pointer, -1..1 on both axes (y up). Updated by <Cursor />. */
export const pointer = { x: 0, y: 0, u: 0.5, v: 0.5 };

export function trackPointer(e: PointerEvent) {
  pointer.u = e.clientX / window.innerWidth;
  pointer.v = 1 - e.clientY / window.innerHeight;
  pointer.x = pointer.u * 2 - 1;
  pointer.y = pointer.v * 2 - 1;
}
