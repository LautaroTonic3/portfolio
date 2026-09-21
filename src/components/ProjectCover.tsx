import type { Project } from "@/data/projects";
import { asset } from "@/lib/stage";

/** Portada generativa por área (o la imagen del proyecto si existe). */
function hash(s: string) { let h = 2166136261; for (const c of s) h = Math.imul(h ^ c.charCodeAt(0), 16777619); return h >>> 0; }
function rng(seed: number) { return () => ((seed = (seed * 1664525 + 1013904223) >>> 0) / 4294967296); }

export default function ProjectCover({ project, large = false }: { project: Project; large?: boolean }) {
  if (project.image) {
    // eslint-disable-next-line @next/next/no-img-element
    return <img className="cover cover--img" src={asset(project.image)} alt="" loading="lazy" />;
  }
  const r = rng(hash(project.slug));
  const W = 400, H = 250;
  const els: React.ReactNode[] = [];

  if (project.area === "ia") {
    const layers = [3 + (r() * 2 | 0), 5 + (r() * 2 | 0), 4 + (r() * 3 | 0), 2 + (r() * 2 | 0)];
    const pts = layers.map((n, li) => Array.from({ length: n }, (_, k) => [70 + li * 87, H / 2 + (k - (n - 1) / 2) * 34]));
    pts.slice(0, -1).forEach((col, li) => col.forEach(([x1, y1]) => pts[li + 1].forEach(([x2, y2]) => {
      if (r() < 0.7) els.push(<line key={els.length} x1={x1} y1={y1} x2={x2} y2={y2} className="cv-line" strokeOpacity={0.15 + r() * 0.5} />);
    })));
    pts.flat().forEach(([x, y]) => els.push(<circle key={els.length} cx={x} cy={y} r={5 + r() * 2} className={r() < 0.2 ? "cv-hot" : "cv-node"} />));
  } else if (project.area === "frontend") {
    for (let l = 0; l < 3; l++) {
      const ox = 80 + l * 34, oy = 40 + l * 26;
      els.push(<rect key={els.length} x={ox} y={oy} width={200} height={130} rx={8} className="cv-panel" />);
      els.push(<rect key={els.length} x={ox + 12} y={oy + 12} width={176} height={14} rx={3} className="cv-fill" />);
      for (let k = 0; k < 3; k++) els.push(<rect key={els.length} x={ox + 12 + k * 60} y={oy + 38 + r() * 8} width={50} height={40 + r() * 30} rx={4} className={l === 2 && k === 1 ? "cv-hot-fill" : "cv-line-rect"} />);
    }
  } else if (project.area === "backend") {
    for (let d = 0; d < 3; d++) {
      const cy = 70 + d * 58;
      els.push(<ellipse key={els.length} cx={W / 2} cy={cy} rx={110} ry={22} className="cv-panel" />);
      els.push(<path key={els.length} d={`M${W / 2 - 110} ${cy} v34 a110 22 0 0 0 220 0 v-34`} className="cv-line-rect" />);
      for (let k = 0; k < 4; k++) els.push(<circle key={els.length} cx={W / 2 - 60 + k * 40} cy={cy + 30} r={3} className={r() < 0.3 ? "cv-hot" : "cv-node"} />);
    }
  } else {
    const cx = W / 2, cy = H / 2 + 6;
    for (let k = 0; k < 6; k++) {
      const s = 1 - k * 0.14;
      els.push(<path key={els.length} d={`M${cx} ${cy - 95 * s} L${cx + 80 * s} ${cy - 60 * s} L${cx + 70 * s} ${cy + 30 * s} L${cx} ${cy + 90 * s} L${cx - 70 * s} ${cy + 30 * s} L${cx - 80 * s} ${cy - 60 * s} Z`} className={k === 3 ? "cv-hot-stroke" : "cv-line-rect"} strokeOpacity={0.9 - k * 0.12} />);
    }
    for (let i = 0; i < 26; i++) els.push(<rect key={els.length} x={r() * W} y={r() * H} width={2} height={8 + r() * 18} className="cv-fill" opacity={0.3 + r() * 0.4} />);
  }

  return (
    <svg className={`cover ${large ? "cover--large" : ""}`} viewBox={`0 0 ${W} ${H}`} preserveAspectRatio="xMidYMid slice" aria-hidden="true">
      <rect width={W} height={H} className="cv-bg" />
      {els}
    </svg>
  );
}
