"use client";

import { useEffect, useRef, type ReactNode } from "react";

export function PublicMotion({ children }: { children: ReactNode }) {
  const root = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const scope = root.current;
    if (!scope || !("IntersectionObserver" in window) || !("animate" in Element.prototype)) return;

    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)");
    if (reduced.matches) return;

    const triggerInset = 56;
    const wide = window.matchMedia("(min-width: 761px)");
    const animations = new Set<Animation>();
    const observer = new IntersectionObserver(entries => {
      if (reduced.matches) return;
      for (const entry of entries) {
        if (!entry.isIntersecting) continue;
        const element = entry.target;
        observer.unobserve(element);
        if (element.matches(":focus-within")) continue;

        const kind = element.getAttribute("data-motion-reveal");
        const heading = kind === "heading";
        const offset = heading ? 24 : 42;
        const delay = kind === "card" && wide.matches
          ? Number(element.getAttribute("data-motion-order")) * 75
          : 0;
        const animation = element.animate(
          [
            { opacity: 0.28, transform: `translateY(${offset}px) scale(${heading ? 1 : 0.975})` },
            { opacity: 1, transform: "translateY(0) scale(1)" },
          ],
          { duration: heading ? 620 : 690, delay, easing: "cubic-bezier(.2,.78,.23,1)", fill: "backwards" },
        );
        animations.add(animation);
        animation.onfinish = () => { animations.delete(animation); };
      }
    }, { rootMargin: `0px 0px -${triggerInset}px` });

    for (const element of scope.querySelectorAll("[data-motion-reveal]")) {
      if (element.getBoundingClientRect().top >= window.innerHeight - triggerInset) observer.observe(element);
    }

    function stopMotion() {
      observer.disconnect();
      for (const animation of animations) animation.cancel();
      animations.clear();
    }

    function updatePreference() {
      if (reduced.matches) stopMotion();
    }

    reduced.addEventListener("change", updatePreference);
    return () => {
      reduced.removeEventListener("change", updatePreference);
      stopMotion();
    };
  }, []);

  return <div ref={root}>{children}</div>;
}
