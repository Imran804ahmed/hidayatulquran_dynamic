"use client";

// animate from "motion/mini" (~2.5 kB, runs on the browser's Web Animations API); inView/stagger are tiny.
import { animate } from "motion/mini";
import { inView, stagger } from "motion";
import { useEffect, useRef, type ReactNode } from "react";

/**
 * Scroll reveal built on Motion (https://motion.dev), the only client code the animation system
 * needs. Pages stay server-rendered: these wrappers render ordinary elements with the server
 * markup inside.
 *
 * Content is never hidden by default. The server HTML is fully visible, so it still works
 * without JavaScript, before hydration and for search engines. After hydration, only content
 * that is still below the fold is hidden, then revealed once on first entry. Content already on
 * screen, and every visitor who prefers reduced motion, gets no animation at all.
 */

/** Brand easing: a calm ease-out with no overshoot. Matches --hq-ease in design.css. */
export const EASE = [0.22, 1, 0.36, 1] as const;
const DURATION = 0.55;
const OFFSET = "translateY(16px)";

function useReveal(ref: React.RefObject<HTMLElement | null>, group: boolean, delay: number) {
  useEffect(() => {
    const root = ref.current;
    if (!root) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    // Already (partly) on screen when the page becomes interactive: leave it as it is.
    if (root.getBoundingClientRect().top < window.innerHeight * 0.9) return;

    const targets = (group ? Array.from(root.children) : [root]) as HTMLElement[];
    if (!targets.length) return;
    for (const t of targets) {
      t.style.opacity = "0";
      t.style.transform = OFFSET;
    }
    const clear = () => {
      for (const t of targets) {
        t.style.removeProperty("opacity");
        t.style.removeProperty("transform");
      }
    };

    // The callback runs asynchronously (IntersectionObserver), after stopObserving is assigned.
    const stopObserving: VoidFunction = inView(
      root,
      () => {
        stopObserving(); // first entry only
        const controls = animate(
          targets,
          { opacity: [0, 1], transform: [OFFSET, "translateY(0px)"] },
          { duration: DURATION, ease: EASE, delay: group ? stagger(0.07, { startDelay: delay }) : delay },
        );
        // Drop the inline styles afterwards, so hover transforms in CSS work as before.
        controls.then(clear, clear);
      },
      { amount: 0.15 },
    );

    return () => {
      stopObserving();
      clear();
    };
  }, [ref, group, delay]);
}

type BaseProps = { children: ReactNode; className?: string; id?: string; delay?: number };

/** Reveals one block (a section heading, a paragraph group…) on first scroll into view. */
export function Reveal({ children, className, id, delay = 0 }: BaseProps) {
  const ref = useRef<HTMLDivElement>(null);
  useReveal(ref, false, delay);
  return (
    <div ref={ref} className={className} id={id}>
      {children}
    </div>
  );
}

/**
 * A list whose items reveal with a short stagger. Renders the list element itself, so
 * `<RevealGroup as="ul" className=…><li>…</li></RevealGroup>` keeps the markup and semantics.
 */
export function RevealGroup({
  children,
  className,
  id,
  delay = 0,
  as = "ul",
  "aria-label": ariaLabel,
}: BaseProps & { as?: "ul" | "ol" | "div"; "aria-label"?: string }) {
  const ref = useRef<HTMLElement>(null);
  useReveal(ref, true, delay);
  const Tag = as;
  return (
    <Tag ref={ref as React.Ref<never>} className={className} id={id} aria-label={ariaLabel}>
      {children}
    </Tag>
  );
}
