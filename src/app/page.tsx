import Link from "next/link";
import Stage from "@/components/Stage";
import Scramble from "@/components/Scramble";
import Tilt from "@/components/Tilt";
import ProjectGrid from "@/components/ProjectGrid";
import { profile, areas } from "@/data/profile";
import { projects } from "@/data/projects";
import { asset } from "@/lib/stage";

export default function Home() {
  const [first, ...rest] = profile.name.split(" ");
  const last = rest.join(" ");

  return (
    <>
      {/* ── HERO ── */}
      <Stage as="header" shape={0} side="right" className="hero" label="Presentación">
        <div className="wrap hero-inner">
          {profile.available && (
            <p className="pill"><span className="pill-dot" />{profile.availabilityText}</p>
          )}
          <h1 className="hero-name" aria-label={profile.name}>
            <span className="hero-line">
              {first.split("").map((c, i) => (
                <span key={i} className="ch" style={{ "--d": i } as React.CSSProperties}>{c}</span>
              ))}
            </span>
            <span className="hero-line">
              {last.split("").map((c, i) => (
                <span key={i} className="ch" style={{ "--d": i + first.length } as React.CSSProperties}>{c === " " ? " " : c}</span>
              ))}
            </span>
          </h1>
          <p className="hero-role">
            {profile.role}. Construyo <Scramble phrases={profile.roles} />
          </p>
          <p className="hero-intro">{profile.intro}</p>
          <div className="hero-cta">
            <Link href="/#proyectos" className="btn btn--solid">Ver proyectos</Link>
            <Link href="/#contacto" className="btn">Escribirme</Link>
          </div>
        </div>
        <div className="scroll-cue" aria-hidden="true"><span /></div>
      </Stage>

      {/* ── SOBRE MÍ ── */}
      <Stage id="sobre-mi" shape={1} side="left" className="section about" label="Sobre mí">
        <div className="wrap about-grid">
          <Tilt className="photo-tilt" max={9}>
            <figure className="photo">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={asset(profile.photo)} alt={profile.photoAlt} width={900} height={1100} />
              <figcaption>{profile.location}</figcaption>
            </figure>
          </Tilt>
          <div className="about-text">
            <h2 className="h2">Sobre mí</h2>
            {profile.about.map((p, i) => <p key={i} className={i === 0 ? "lead" : ""}>{p}</p>)}
            <dl className="facts">
              {profile.facts.map((f) => (
                <div key={f.label}><dt>{f.label}</dt><dd>{f.value}</dd></div>
              ))}
            </dl>
          </div>
        </div>
      </Stage>

      {/* ── ÁREAS ── */}
      <div id="areas">
        {areas.map((a, i) => {
          const list = projects.filter((p) => p.area === a.id);
          const side = i % 2 === 0 ? "right" : "left";
          return (
            <Stage key={a.id} id={`area-${a.id}`} shape={a.shape} side={side} className="section area" label={a.title}>
              <div className="wrap">
                <div className={`area-panel area-panel--${side}`}>
                  <p className="area-kicker">{a.kicker}</p>
                  <h2 className="h2 area-title">{a.title}</h2>
                  <p className="area-desc">{a.description}</p>
                  <ul className="tools" aria-label="Herramientas">
                    {a.tools.map((t) => <li key={t}>{t}</li>)}
                  </ul>
                  <ul className="area-projects">
                    {list.map((p) => (
                      <li key={p.slug}>
                        <Link href={`/proyectos/${p.slug}/`}>
                          <span className="ap-title">{p.title}</span>
                          <span className="ap-year">{p.year}</span>
                        </Link>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </Stage>
          );
        })}
      </div>

      {/* ── PROYECTOS ── */}
      <Stage id="proyectos" shape={6} side="center" className="section projects" label="Proyectos">
        <div className="wrap">
          <div className="section-head">
            <h2 className="h2">Proyectos</h2>
            <p>Cada uno tiene su página con el problema, cómo lo resolví y qué salió. Filtra por área.</p>
          </div>
          <ProjectGrid />
        </div>
      </Stage>

      {/* ── CÓMO SE HIZO (teaser) ── */}
      <Stage id="como" shape={7} side="right" className="section making" label="Cómo se hizo este sitio">
        <div className="wrap">
          <div className="making-panel">
            <h2 className="h2">Este sitio también es un proyecto</h2>
            <p>
              Las partículas del fondo son 14.000 puntos en un solo shader que sabe ocho formas.
              El modo día o noche arranca según tu hora local. Todo el sitio es HTML estático:
              no hay servidor detrás.
            </p>
            <p>Escribí cómo lo armé, qué se rompió en el camino y cómo le busqué la vuelta.</p>
            <Link href="/como-se-hizo/" className="btn btn--solid">Leer cómo se hizo</Link>
          </div>
        </div>
      </Stage>

      {/* ── CONTACTO ── */}
      <Stage id="contacto" shape={0} side="center" className="section contact" label="Contacto">
        <div className="wrap contact-inner">
          <h2 className="contact-title">¿Construimos algo?</h2>
          <p className="contact-sub">Respondo en menos de 48 horas.</p>
          <a href={`mailto:${profile.email}`} className="contact-mail">{profile.email}</a>
          <ul className="socials">
            {profile.socials.map((s) => (
              <li key={s.label}><a href={s.href} target={s.href.startsWith("http") ? "_blank" : undefined} rel="noreferrer">{s.label}</a></li>
            ))}
            {profile.cvUrl && <li><a href={asset(profile.cvUrl)} download>Descargar CV</a></li>}
          </ul>
        </div>
      </Stage>
    </>
  );
}
