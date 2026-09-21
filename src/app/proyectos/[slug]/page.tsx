import Link from "next/link";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import Stage from "@/components/Stage";
import ProjectCover from "@/components/ProjectCover";
import { projects, areaLabels } from "@/data/projects";
import { areas } from "@/data/profile";

// Genera una página estática por proyecto en el build
export const dynamicParams = false;
export function generateStaticParams() {
  return projects.map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const p = projects.find((x) => x.slug === slug);
  return p ? { title: p.title, description: p.summary } : {};
}

export default async function ProjectPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const idx = projects.findIndex((x) => x.slug === slug);
  if (idx < 0) notFound();
  const p = projects[idx];
  const next = projects[(idx + 1) % projects.length];
  const shape = areas.find((a) => a.id === p.area)?.shape ?? 0;

  return (
    <article className="project">
      <Stage as="header" shape={shape} side="right" className="project-hero">
        <div className="wrap">
          <Link href={`/#area-${p.area}`} className="back">Volver a {areaLabels[p.area]}</Link>
          <h1 className="project-title">{p.title}</h1>
          <p className="project-summary">{p.summary}</p>
          <dl className="project-meta">
            <div><dt>Año</dt><dd>{p.year}</dd></div>
            <div><dt>Rol</dt><dd>{p.role}</dd></div>
            <div><dt>Área</dt><dd>{areaLabels[p.area]}</dd></div>
          </dl>
        </div>
      </Stage>

      <Stage shape={shape} side="right" className="project-body">
        <div className="wrap project-grid">
          <div className="project-cover"><ProjectCover project={p} large /></div>
          <div className="prose">
            <h2>El problema</h2>
            <p>{p.problem}</p>
            <h2>Cómo lo resolví</h2>
            <ol className="steps">{p.approach.map((s, i) => <li key={i}>{s}</li>)}</ol>
            <h2>Resultado</h2>
            <ul>{p.outcome.map((s, i) => <li key={i}>{s}</li>)}</ul>
            <h2>Tecnologías</h2>
            <ul className="tools">{p.stack.map((t) => <li key={t}>{t}</li>)}</ul>
            {p.links && p.links.length > 0 && (
              <div className="project-links">
                {p.links.map((l) =>
                  l.href.startsWith("/") ? (
                    <Link key={l.href} href={l.href} className="btn btn--solid">{l.label}</Link>
                  ) : (
                    <a key={l.href} href={l.href} className="btn btn--solid" target="_blank" rel="noreferrer">{l.label}</a>
                  )
                )}
              </div>
            )}
          </div>
        </div>
      </Stage>

      <Stage shape={6} side="center" className="next-project">
        <div className="wrap">
          <Link href={`/proyectos/${next.slug}/`} className="next-link">
            <span className="next-label">Siguiente proyecto</span>
            <span className="next-title">{next.title}</span>
          </Link>
        </div>
      </Stage>
    </article>
  );
}
