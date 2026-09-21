import Link from "next/link";
import Stage from "@/components/Stage";

export default function NotFound() {
  return (
    <Stage as="header" shape={6} side="center" className="hero notfound">
      <div className="wrap hero-inner" style={{ textAlign: "center" }}>
        <h1 className="h2">Esta página se perdió en la galaxia</h1>
        <p className="hero-intro" style={{ marginInline: "auto" }}>La dirección no existe o cambió de lugar.</p>
        <p><Link href="/" className="btn btn--solid">Volver al inicio</Link></p>
      </div>
    </Stage>
  );
}
