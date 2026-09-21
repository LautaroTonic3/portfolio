/**
 * Estado compartido entre el DOM y la escena WebGL.
 * No usa React a propósito: la escena lo lee en cada frame
 * sin provocar re-renders.
 */
export type Side = "left" | "right" | "center";
export type Theme = "day" | "night";

type Listener = () => void;

export const stage = {
  shape: 0,
  side: "right" as Side,
  override: null as number | null, // forzado desde la demo de "Cómo se hizo"
  theme: "night" as Theme,
  snapTheme: false,
  renderNow: null as null | (() => void),
  listeners: new Set<Listener>(),
  scrollVelocity: 0,
};

export function setStage(shape: number, side: Side) {
  stage.shape = shape;
  stage.side = side;
  stage.listeners.forEach((l) => l());
}

export function subscribeStage(l: Listener) {
  stage.listeners.add(l);
  return () => stage.listeners.delete(l);
}

export const basePath = process.env.NEXT_PUBLIC_BASE_PATH || "";
export const asset = (p: string) => (p.startsWith("http") ? p : `${basePath}${p}`);
