/**
 * Pepperis motion primitives.
 * Shared easings, durations, and Framer Motion variant helpers so every
 * component animates with the same silky, restrained feel (PEPPERIS_BRAND_SPEC.md § Motion).
 */
import type { Transition, Variants } from "framer-motion";

/** Cubic-bezier easing curves (Framer Motion `ease` tuples). */
export const easing = {
  /** Silky exit — the Pepperis default. */
  easeOut: [0.16, 1, 0.3, 1],
  /** Symmetric in/out for loops and reversible motion. */
  easeInOutQuart: [0.76, 0, 0.24, 1],
} as const;

/** Standard durations in seconds. */
export const duration = {
  fast: 0.18,
  base: 0.32,
  slow: 0.6,
} as const;

/** Base transition: Pepperis default easing over `base` duration. */
export const baseTransition: Transition = {
  duration: duration.base,
  ease: easing.easeOut,
};

/**
 * Fade + 8px Y-rise. Pass a custom delay/duration via `transition` override.
 */
export const fadeInUp: Variants = {
  hidden: { opacity: 0, y: 8 },
  visible: {
    opacity: 1,
    y: 0,
    transition: baseTransition,
  },
};

/** Simple opacity fade. */
export const fade: Variants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: baseTransition },
};

/**
 * Stagger container: animates children in sequence.
 * @param stagger seconds between each child (default 0.06)
 * @param delayChildren seconds before the first child (default 0)
 */
export const staggerContainer = (
  stagger = 0.06,
  delayChildren = 0,
): Variants => ({
  hidden: {},
  visible: {
    transition: {
      staggerChildren: stagger,
      delayChildren,
    },
  },
});

/**
 * Single staggered child — pair with `staggerContainer` on the parent.
 * @param y vertical offset to rise from (default 8px)
 */
export const staggerItem = (y = 8): Variants => ({
  hidden: { opacity: 0, y },
  visible: { opacity: 1, y: 0, transition: baseTransition },
});
