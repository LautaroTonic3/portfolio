"use client";

import { useEffect, useState } from "react";
import { stage } from "@/lib/stage";
import { shapeNames } from "@/lib/shapes";

/** Botones para forzar cada forma de la escena (página "Cómo se hizo"). */
export default function ShapeDemo() {
  const [active, setActive] = useState<number | null>(null);
  useEffect(() => () => { stage.override = null; }, []);
  const pick = (i: number) => {
    const next = active === i ? null : i;
    stage.override = next;
    setActive(next);
  };
  return (
    <div className="shape-demo">
      <p className="shape-demo-hint">Toca una forma y mira el fondo. Vuelve a tocarla para soltarla.</p>
      <div className="shape-demo-buttons">
        {shapeNames.map((n, i) => (
          <button key={n} className="chip" aria-pressed={active === i} onClick={() => pick(i)}>
            <span className="chip-n">{i}</span> {n}
          </button>
        ))}
      </div>
    </div>
  );
}
