/**
 * Generadores de formas para las partículas.
 * Cada función devuelve un Float32Array de N*3 posiciones.
 * Todas las formas tienen exactamente N puntos, así el shader puede
 * mezclar cualquier forma con cualquier otra punto a punto.
 *
 *  0 núcleo (hero / contacto)      4 base de datos (backend)
 *  1 doble hélice (sobre mí)       5 candado (ciberseguridad)
 *  2 red neuronal (IA)             6 galaxia (proyectos)
 *  3 capas de interfaz (frontend)  7 onda (cómo se hizo)
 */

export const SHAPE_COUNT = 8;

// PRNG determinista: mismas formas en cada carga
function mulberry32(seed: number) {
  return () => {
    seed |= 0; seed = (seed + 0x6d2b79f5) | 0;
    let t = Math.imul(seed ^ (seed >>> 15), 1 | seed);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

type Gen = (n: number, r: () => number) => Float32Array;

const gauss = (r: () => number) => {
  const u = Math.max(r(), 1e-6), v = r();
  return Math.sqrt(-2 * Math.log(u)) * Math.cos(2 * Math.PI * v);
};

// 0 — Núcleo: esfera de Fibonacci + anillo orbital
const core: Gen = (n, r) => {
  const a = new Float32Array(n * 3);
  const sphereN = Math.floor(n * 0.78);
  const golden = Math.PI * (3 - Math.sqrt(5));
  for (let i = 0; i < n; i++) {
    let x, y, z;
    if (i < sphereN) {
      const t = i / sphereN;
      const yy = 1 - 2 * t;
      const rad = Math.sqrt(1 - yy * yy);
      const th = golden * i;
      const R = 1.75 + gauss(r) * 0.03;
      x = Math.cos(th) * rad * R; y = yy * R; z = Math.sin(th) * rad * R;
    } else {
      const th = r() * Math.PI * 2;
      const R = 2.7 + gauss(r) * 0.12;
      x = Math.cos(th) * R; y = gauss(r) * 0.03; z = Math.sin(th) * R;
      // inclinar el anillo
      const tilt = 0.42;
      const y2 = y * Math.cos(tilt) - z * Math.sin(tilt);
      const z2 = y * Math.sin(tilt) + z * Math.cos(tilt);
      y = y2; z = z2;
    }
    a.set([x, y, z], i * 3);
  }
  return a;
};

// 1 — Doble hélice
const helix: Gen = (n, r) => {
  const a = new Float32Array(n * 3);
  const turns = 2.2, h = 5.6, R = 1.8;
  for (let i = 0; i < n; i++) {
    const t = r();
    const ang = t * turns * Math.PI * 2;
    const y = (t - 0.5) * h;
    let x, z;
    const kind = r();
    if (kind < 0.36) {
      x = Math.cos(ang) * R; z = Math.sin(ang) * R;
    } else if (kind < 0.72) {
      x = Math.cos(ang + Math.PI) * R; z = Math.sin(ang + Math.PI) * R;
    } else {
      // peldaños
      const step = Math.round(t * 34) / 34;
      const a2 = step * turns * Math.PI * 2;
      const s = r() * 2 - 1;
      x = Math.cos(a2) * R * s; z = Math.sin(a2) * R * s;
      a.set([x + gauss(r) * 0.02, (step - 0.5) * h, z + gauss(r) * 0.02], i * 3);
      continue;
    }
    a.set([x + gauss(r) * 0.05, y, z + gauss(r) * 0.05], i * 3);
  }
  return a;
};

// 2 — Red neuronal: capas de nodos + conexiones
const network: Gen = (n, r) => {
  const a = new Float32Array(n * 3);
  const layers = [5, 8, 8, 3];
  const xs = [-2.4, -0.8, 0.8, 2.4];
  const nodes: [number, number, number][][] = layers.map((count, li) =>
    Array.from({ length: count }, (_, k) => {
      const y = (k - (count - 1) / 2) * 0.62;
      return [xs[li], y, Math.sin(k * 1.7 + li) * 0.35] as [number, number, number];
    })
  );
  for (let i = 0; i < n; i++) {
    if (r() < 0.38) {
      const li = Math.floor(r() * layers.length);
      const nd = nodes[li][Math.floor(r() * layers[li])];
      const u = r() * Math.PI * 2, v = Math.acos(2 * r() - 1), R = 0.13 + r() * 0.03;
      a.set([nd[0] + R * Math.sin(v) * Math.cos(u), nd[1] + R * Math.cos(v), nd[2] + R * Math.sin(v) * Math.sin(u)], i * 3);
    } else {
      const li = Math.floor(r() * (layers.length - 1));
      const p = nodes[li][Math.floor(r() * layers[li])];
      const q = nodes[li + 1][Math.floor(r() * layers[li + 1])];
      const t = r();
      a.set([p[0] + (q[0] - p[0]) * t, p[1] + (q[1] - p[1]) * t, p[2] + (q[2] - p[2]) * t], i * 3);
    }
  }
  return a;
};

// 3 — Capas de interfaz: tres paneles flotantes con componentes
const uiLayers: Gen = (n, r) => {
  const a = new Float32Array(n * 3);
  const W = 3.2, H = 2.1;
  // rectángulos internos (x, y, w, h) relativos al panel
  const inner: number[][][] = [
    [[-1.4, 0.7, 2.8, 0.25], [-1.4, -0.9, 1.2, 1.3], [0.0, -0.2, 1.4, 0.6], [0.0, -0.9, 1.4, 0.45]],
    [[-1.4, 0.55, 0.8, 0.4], [-0.4, 0.55, 1.8, 0.4], [-1.4, -0.9, 2.8, 1.1]],
    [[-1.4, -0.9, 0.9, 1.8], [-0.3, 0.3, 1.7, 0.6], [-0.3, -0.9, 0.8, 0.9], [0.7, -0.9, 0.7, 0.9]],
  ];
  const perim = (x: number, y: number, w: number, h: number, t: number) => {
    const P = 2 * (w + h); let d = t * P;
    if (d < w) return [x + d, y];
    d -= w; if (d < h) return [x + w, y + d];
    d -= h; if (d < w) return [x + w - d, y + h];
    d -= w; return [x, y + h - d];
  };
  for (let i = 0; i < n; i++) {
    const layer = i % 3;
    const z = (layer - 1) * 0.9;
    const ox = (layer - 1) * 0.45, oy = (1 - layer) * 0.3;
    let x, y;
    if (r() < 0.45) {
      [x, y] = perim(-W / 2, -H / 2, W, H, r());
    } else {
      const rects = inner[layer];
      const rc = rects[Math.floor(r() * rects.length)];
      [x, y] = perim(rc[0], rc[1], rc[2], rc[3], r());
    }
    a.set([x + ox, y + oy, z + gauss(r) * 0.015], i * 3);
  }
  return a;
};

// 4 — Base de datos: tres discos apilados
const database: Gen = (n, r) => {
  const a = new Float32Array(n * 3);
  const R = 1.55, dh = 0.62, gap = 0.28;
  for (let i = 0; i < n; i++) {
    const disc = Math.floor(r() * 3);
    const cy = (disc - 1) * (dh + gap);
    const th = r() * Math.PI * 2;
    const k = r();
    let x, y, z;
    if (k < 0.55) { // pared lateral
      x = Math.cos(th) * R; z = Math.sin(th) * R; y = cy + (r() - 0.5) * dh;
    } else if (k < 0.8) { // bordes (anillos)
      x = Math.cos(th) * R; z = Math.sin(th) * R; y = cy + (r() < 0.5 ? -dh / 2 : dh / 2);
    } else { // tapa superior
      const rr = Math.sqrt(r()) * R;
      x = Math.cos(th) * rr; z = Math.sin(th) * rr; y = cy + dh / 2;
    }
    a.set([x, y + 0.1, z], i * 3);
  }
  return a;
};

// 5 — Candado
const padlock: Gen = (n, r) => {
  const a = new Float32Array(n * 3);
  const bw = 2.6, bh = 2.0, bd = 0.8, by = -0.75;
  for (let i = 0; i < n; i++) {
    let x = 0, y = 0, z = 0;
    if (r() < 0.3) {
      // arco (medio toro)
      const th = r() * Math.PI;
      const phi = r() * Math.PI * 2;
      const R = 0.85, tube = 0.16;
      const cx = Math.cos(th) * (R + tube * Math.cos(phi));
      const cy = Math.sin(th) * (R + tube * Math.cos(phi));
      x = cx; y = by + bh / 2 + 0.35 + cy; z = tube * Math.sin(phi);
      if (r() < 0.25) { // patas del arco
        const side = r() < 0.5 ? -R : R;
        x = side + Math.cos(phi) * tube; z = Math.sin(phi) * tube;
        y = by + bh / 2 + r() * 0.35;
      }
    } else {
      // cuerpo: superficie de una caja
      let found = false;
      while (!found) {
        const face = r();
        if (face < 0.62) { // frente/atrás
          x = (r() - 0.5) * bw; y = by + (r() - 0.5) * bh; z = (r() < 0.5 ? -1 : 1) * bd / 2;
          // cerradura: hueco en el frente
          const kx = x, ky = y - by;
          const inHole = z > 0 && (kx * kx + (ky - 0.18) ** 2 < 0.05 || (Math.abs(kx) < 0.08 && ky < 0.18 && ky > -0.45));
          found = !inHole;
        } else if (face < 0.82) {
          x = (r() < 0.5 ? -1 : 1) * bw / 2; y = by + (r() - 0.5) * bh; z = (r() - 0.5) * bd; found = true;
        } else {
          x = (r() - 0.5) * bw; y = by + (r() < 0.5 ? -1 : 1) * bh / 2; z = (r() - 0.5) * bd; found = true;
        }
      }
    }
    a.set([x, y + 0.2, z], i * 3);
  }
  return a;
};

// 6 — Galaxia espiral
const galaxy: Gen = (n, r) => {
  const a = new Float32Array(n * 3);
  const arms = 3;
  for (let i = 0; i < n; i++) {
    const arm = i % arms;
    const t = Math.pow(r(), 0.7);
    const rad = 0.15 + t * 3.1;
    const ang = arm * (Math.PI * 2 / arms) + t * 5.2;
    const spread = 0.08 + t * 0.35;
    const x = Math.cos(ang) * rad + gauss(r) * spread;
    const z = Math.sin(ang) * rad + gauss(r) * spread;
    const y = gauss(r) * 0.12 * (1 - t) + gauss(r) * 0.03;
    // inclinada hacia la cámara
    const tilt = 1.0;
    a.set([x, y * Math.cos(tilt) - z * Math.sin(tilt), y * Math.sin(tilt) + z * Math.cos(tilt)], i * 3);
  }
  return a;
};

// 7 — Onda: malla ondulada
const wave: Gen = (n, r) => {
  const a = new Float32Array(n * 3);
  const side = Math.ceil(Math.sqrt(n));
  for (let i = 0; i < n; i++) {
    const gx = (i % side) / (side - 1), gz = Math.floor(i / side) / (side - 1);
    const x = (gx - 0.5) * 5.2, z = (gz - 0.5) * 3.8;
    const y = Math.sin(x * 1.1) * 0.35 + Math.cos(z * 1.6 + x * 0.4) * 0.3 + gauss(r) * 0.01;
    // un poco inclinada
    const tilt = 0.55;
    a.set([x, y * Math.cos(tilt) - z * Math.sin(tilt) - 0.2, y * Math.sin(tilt) + z * Math.cos(tilt)], i * 3);
  }
  return a;
};

const gens: Gen[] = [core, helix, network, uiLayers, database, padlock, galaxy, wave];

export function buildShapes(n: number): Float32Array[] {
  return gens.map((g, i) => g(n, mulberry32(1337 + i * 7919)));
}

export const shapeNames = [
  "Núcleo", "Doble hélice", "Red neuronal", "Capas de interfaz",
  "Base de datos", "Candado", "Galaxia", "Onda",
];
