"use client";

import { useEffect, useRef, useState } from "react";

const GLYPHS = "01<>/{}[]#$%&*+=?ABCDEFabcdef";

/** Texto que rota entre frases con efecto de "descifrado". */
export default function Scramble({ phrases, interval = 3200 }: { phrases: string[]; interval?: number }) {
  const [text, setText] = useState(phrases[0]);
  const idx = useRef(0);
  const cur = useRef(phrases[0]);

  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    let raf = 0;
    const run = (to: string) => {
      const from = cur.current;
      cur.current = to;
      const len = Math.max(from.length, to.length);
      const start = performance.now();
      const dur = 900;
      const tick = (now: number) => {
        const p = Math.min((now - start) / dur, 1);
        let out = "";
        for (let i = 0; i < len; i++) {
          const reveal = i / len < p;
          if (reveal) out += to[i] ?? "";
          else if (i / len < p + 0.25) out += to[i] === " " ? " " : GLYPHS[(Math.random() * GLYPHS.length) | 0];
          else out += from[i] ?? "";
        }
        setText(out);
        if (p < 1) raf = requestAnimationFrame(tick);
      };
      raf = requestAnimationFrame(tick);
    };
    const id = setInterval(() => {
      idx.current = (idx.current + 1) % phrases.length;
      run(phrases[idx.current]);
    }, interval);
    return () => { clearInterval(id); cancelAnimationFrame(raf); };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <span className="scramble" aria-live="off">
      <span className="sr-only">{phrases.join(", ")}</span>
      <span aria-hidden="true">{text}</span>
    </span>
  );
}
