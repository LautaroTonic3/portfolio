"use client";

import { useEffect, useState } from "react";
import { stage, type Theme } from "@/lib/stage";

/**
 * Día / noche.
 * - Sin preferencia guardada, el tema lo decide la hora local del visitante
 *   (script inline en <head>, así no hay parpadeo).
 * - Al cambiar, un círculo se expande desde el botón (View Transitions API).
 */
export default function ThemeToggle() {
  const [theme, setTheme] = useState<Theme>("night");

  useEffect(() => {
    setTheme(document.documentElement.dataset.theme === "day" ? "day" : "night");
  }, []);

  const apply = (next: Theme) => {
    document.documentElement.dataset.theme = next;
    stage.theme = next;
    setTheme(next);
    try { localStorage.setItem("theme", next); } catch {}
  };

  const toggle = (e: React.MouseEvent<HTMLButtonElement>) => {
    const next: Theme = theme === "day" ? "night" : "day";
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const doc = document as Document & { startViewTransition?: (cb: () => void) => { ready: Promise<void> } };
    if (!doc.startViewTransition || reduced) { apply(next); return; }

    const r = e.currentTarget.getBoundingClientRect();
    const x = r.left + r.width / 2, y = r.top + r.height / 2;
    const end = Math.hypot(Math.max(x, innerWidth - x), Math.max(y, innerHeight - y));

    const t = doc.startViewTransition(() => {
      apply(next);
      stage.renderNow?.(); // la escena se pinta ya con los colores nuevos
    });
    t.ready.then(() => {
      document.documentElement.animate(
        { clipPath: [`circle(0px at ${x}px ${y}px)`, `circle(${end}px at ${x}px ${y}px)`] },
        { duration: 850, easing: "cubic-bezier(.7,0,.2,1)", pseudoElement: "::view-transition-new(root)" }
      );
    });
  };

  const isDay = theme === "day";
  return (
    <button
      className="theme-toggle"
      onClick={toggle}
      aria-label={isDay ? "Cambiar a modo noche" : "Cambiar a modo día"}
      title={isDay ? "Modo noche" : "Modo día"}
      data-day={isDay}
    >
      <svg viewBox="0 0 24 24" width="22" height="22" aria-hidden="true">
        <mask id="moon-mask">
          <rect width="24" height="24" fill="#fff" />
          <circle className="tt-cut" cx="17" cy="7" r="6" fill="#000" />
        </mask>
        <circle className="tt-core" cx="12" cy="12" r="5.5" fill="currentColor" mask="url(#moon-mask)" />
        <g className="tt-rays" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round">
          {Array.from({ length: 8 }).map((_, i) => {
            const a = (i * Math.PI) / 4;
            return <line key={i} x1={12 + Math.cos(a) * 8.2} y1={12 + Math.sin(a) * 8.2} x2={12 + Math.cos(a) * 10.4} y2={12 + Math.sin(a) * 10.4} />;
          })}
        </g>
      </svg>
    </button>
  );
}
