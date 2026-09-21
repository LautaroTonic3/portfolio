"use client";
import dynamic from "next/dynamic";
// three.js necesita `window`: se carga solo en el navegador.
const Scene = dynamic(() => import("./Scene"), { ssr: false });
export default function SceneLoader() { return <Scene />; }
