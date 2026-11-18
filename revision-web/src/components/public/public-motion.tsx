"use client";

import { useEffect, useRef, type ReactNode } from "react";

export function PublicMotion({ children }: { children: ReactNode }) {
  const root = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const scope = root.current;
    if (!scope || !("IntersectionObserver" in window) || !("animate" in Element.prototype)) return;

    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)");
    if (reduced.matches) return;

    const animations = new Set<Animation>();
    const observer = new IntersectionObserver(entries => {
      if (reduced.matches) return;
      for (const entry of entries) {
        if (!entry.isIntersecting) continue;
        const element = entry.target;
        observer.unobserve(element);
        if (element.matches(":focus-within")) continue;

        const animation = element.animate(
          [{ opacity: 0.75, transform: "translateY(14px)" }, { opacity: 1, transform: "translateY(0)" }],
          { duration: 420, easing: "cubic-bezier(.2,.75,.25,1)" },
        );
        animations.add(animation);
        animation.onfinish = () => { animations.delete(animation); };
      }
    }, { rootMargin: "0px 0px -28px" });

    for (const element of scope.querySelectorAll("[data-motion-reveal]")) {
      if (element.getBoundingClientRect().top >= window.innerHeight) observer.observe(element);
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
