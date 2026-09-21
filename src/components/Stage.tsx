"use client";

import { useEffect, useRef, type ReactNode } from "react";
import { setStage, type Side } from "@/lib/stage";

/**
 * Envuelve una sección. Cuando la sección cruza el centro de la
 * pantalla, le dice a la escena 3D qué forma tomar y de qué lado
 * ubicarse (el contenido va del lado contrario).
 */
export default function Stage({
  shape, side = "right", id, className = "", children, as: Tag = "section", label,
}: {
  shape: number; side?: Side; id?: string; className?: string; children: ReactNode;
  as?: "section" | "header" | "div" | "footer"; label?: string;
}) {
  const ref = useRef<HTMLElement>(null);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const io = new IntersectionObserver(
      (entries) => entries.forEach((e) => e.isIntersecting && setStage(shape, side)),
      { rootMargin: "-48% 0px -48% 0px" }
    );
    io.observe(el);
    return () => io.disconnect();
  }, [shape, side]);

  return (
    <Tag ref={ref as never} id={id} aria-label={label} className={`stage stage--${side} ${className}`}>
      {children}
    </Tag>
  );
}
