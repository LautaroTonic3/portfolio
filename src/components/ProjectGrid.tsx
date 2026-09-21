"use client";

import Link from "next/link";
import { useState } from "react";
import { projects, areaLabels } from "@/data/projects";
import type { AreaId } from "@/data/profile";
import ProjectCover from "./ProjectCover";
import Tilt from "./Tilt";

const filters: ("todos" | AreaId)[] = ["todos", "ia", "frontend", "backend", "seguridad"];

export default function ProjectGrid() {
  const [f, setF] = useState<(typeof filters)[number]>("todos");
  const list = f === "todos" ? projects : projects.filter((p) => p.area === f);

  return (
    <>
      <div className="filters" role="tablist" aria-label="Filtrar proyectos por área">
        {filters.map((k) => {
          const n = k === "todos" ? projects.length : projects.filter((p) => p.area === k).length;
          return (
            <button key={k} role="tab" aria-selected={f === k} className="chip" onClick={() => setF(k)}>
              {k === "todos" ? "Todos" : areaLabels[k]} <span className="chip-n">{n}</span>
            </button>
          );
        })}
      </div>
      <ul className="grid" key={f}>
        {list.map((p, i) => (
          <li key={p.slug} style={{ "--i": i } as React.CSSProperties}>
            <Tilt className="card-tilt" max={7}>
              <Link href={`/proyectos/${p.slug}/`} className="card">
                <div className="card-cover"><ProjectCover project={p} /></div>
                <div className="card-body">
                  <p className="card-meta">{areaLabels[p.area]}, {p.year}</p>
                  <h3 className="card-title">{p.title}</h3>
                  <p className="card-summary">{p.summary}</p>
                  <p className="card-stack">{p.stack.slice(0, 4).join(" / ")}</p>
                </div>
              </Link>
            </Tilt>
          </li>
        ))}
      </ul>
    </>
  );
}
