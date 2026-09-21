"use client";

import { useEffect, useRef } from "react";
import * as THREE from "three";
import { buildShapes, SHAPE_COUNT } from "@/lib/shapes";
import { stage } from "@/lib/stage";

/**
 * Escena de fondo: una sola geometría de partículas con 8 formas
 * precalculadas como atributos. El shader mezcla las formas con
 * pesos (uW) que se animan suavemente hacia la forma activa.
 */

const vertex = /* glsl */ `
  attribute vec3 aS0; attribute vec3 aS1; attribute vec3 aS2; attribute vec3 aS3;
  attribute vec3 aS4; attribute vec3 aS5; attribute vec3 aS6; attribute vec3 aS7;
  attribute float aRand;

  uniform float uW[8];
  uniform float uTime;
  uniform float uTurb;
  uniform float uSize;
  uniform float uPixelRatio;
  uniform float uDay;
  uniform vec3 uMouse;
  uniform float uMouseStrength;
  uniform float uDim;

  varying vec3 vColor;
  varying float vAlpha;

  // Colores: noche (bioluminiscente) y día (tinta)
  const vec3 N1 = vec3(0.50, 0.85, 1.00);
  const vec3 N2 = vec3(0.56, 0.50, 1.00);
  const vec3 N3 = vec3(1.00, 0.77, 0.42);
  const vec3 D1 = vec3(0.07, 0.11, 0.22);
  const vec3 D2 = vec3(0.18, 0.36, 0.92);
  const vec3 D3 = vec3(0.85, 0.38, 0.17);

  vec3 hash3(float n) {
    return fract(sin(vec3(n, n + 1.7, n + 3.1)) * vec3(43758.5453, 22578.1459, 19642.3490)) - 0.5;
  }

  void main() {
    vec3 p = aS0 * uW[0] + aS1 * uW[1] + aS2 * uW[2] + aS3 * uW[3]
           + aS4 * uW[4] + aS5 * uW[5] + aS6 * uW[6] + aS7 * uW[7];
    float wsum = uW[0]+uW[1]+uW[2]+uW[3]+uW[4]+uW[5]+uW[6]+uW[7];
    p /= max(wsum, 0.0001);

    // Turbulencia: fuerte durante la transición, casi nula en reposo
    float t = uTime * 0.6;
    vec3 flow = vec3(
      sin(p.y * 1.7 + t + aRand * 6.28),
      cos(p.z * 1.5 + t * 1.2 + aRand * 4.0),
      sin(p.x * 1.3 + t * 0.8 + aRand * 5.0)
    );
    p += flow * (0.025 + uTurb * 0.9);
    p += hash3(aRand * 100.0) * uTurb * 1.2;

    // Repulsión del cursor
    vec3 d = p - uMouse;
    float dist = length(d);
    float f = smoothstep(1.3, 0.0, dist) * uMouseStrength;
    p += normalize(d + 0.0001) * f * 0.55;

    vec4 mv = modelViewMatrix * vec4(p, 1.0);
    gl_Position = projectionMatrix * mv;
    float size = uSize * (0.55 + aRand * 0.9) * (1.0 + f * 1.5);
    gl_PointSize = size * uPixelRatio / -mv.z;

    float pick = fract(aRand * 7.31);
    vec3 night = pick < 0.06 ? N3 : mix(N1, N2, smoothstep(-1.8, 1.8, p.y + aRand));
    vec3 day   = pick < 0.06 ? D3 : mix(D1, D2, smoothstep(-1.5, 2.0, p.y + aRand));
    vColor = mix(night, day, uDay);
    vAlpha = (mix(0.85, 0.9, uDay) * (0.55 + aRand * 0.45) + f * 0.4) * uDim;
  }
`;

const fragment = /* glsl */ `
  uniform float uDay;
  varying vec3 vColor;
  varying float vAlpha;
  void main() {
    vec2 c = gl_PointCoord - 0.5;
    float d = length(c);
    if (d > 0.5) discard;
    // noche: halo suave; día: punto más definido
    float glow = pow(1.0 - d * 2.0, 1.6);
    float dot  = smoothstep(0.5, 0.3, d);
    float a = mix(glow, dot, uDay) * vAlpha;
    // Premultiplicado + uDay en alfa: aditivo de noche, normal de día,
    // con transición continua (ver "Cómo se hizo").
    gl_FragColor = vec4(vColor * a, a * uDay);
  }
`;

const starVertex = /* glsl */ `
  attribute float aRand;
  uniform float uTime; uniform float uPixelRatio;
  varying float vA;
  void main() {
    vec4 mv = modelViewMatrix * vec4(position, 1.0);
    gl_Position = projectionMatrix * mv;
    gl_PointSize = (1.0 + aRand * 2.2) * uPixelRatio;
    vA = 0.35 + 0.65 * (0.5 + 0.5 * sin(uTime * (0.6 + aRand * 1.8) + aRand * 40.0));
  }
`;
const starFragment = /* glsl */ `
  uniform float uDay;
  varying float vA;
  void main() {
    float d = length(gl_PointCoord - 0.5);
    if (d > 0.5) discard;
    float a = smoothstep(0.5, 0.0, d) * vA;
    vec3 night = vec3(0.85, 0.9, 1.0);
    vec3 day = vec3(0.2, 0.3, 0.55);
    float k = mix(0.9, 0.18, uDay);
    gl_FragColor = vec4(mix(night, day, uDay) * a * k, a * k * uDay);
  }
`;

const damp = (a: number, b: number, lambda: number, dt: number) =>
  a + (b - a) * (1 - Math.exp(-lambda * dt));

export default function Scene() {
  const ref = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = ref.current!;
    stage.theme = document.documentElement.dataset.theme === "day" ? "day" : "night";
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const isSmall = window.innerWidth < 800;
    const lowPower = isSmall || (navigator.hardwareConcurrency || 8) <= 4;
    const COUNT = lowPower ? 7000 : 14000;

    let renderer: THREE.WebGLRenderer;
    try {
      renderer = new THREE.WebGLRenderer({ canvas, antialias: false, alpha: true, powerPreference: "high-performance" });
    } catch {
      canvas.style.display = "none"; // sin WebGL el sitio sigue funcionando
      return;
    }
    const dpr = Math.min(window.devicePixelRatio || 1, lowPower ? 1.5 : 1.75);
    renderer.setPixelRatio(dpr);
    renderer.setClearColor(0x000000, 0);

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(42, 1, 0.1, 100);
    camera.position.set(0, 0, 9.5);

    // ── Partículas ─────────────────────────────
    const shapes = buildShapes(COUNT);
    const geo = new THREE.BufferGeometry();
    geo.setAttribute("position", new THREE.BufferAttribute(shapes[0], 3));
    shapes.forEach((s, i) => geo.setAttribute(`aS${i}`, new THREE.BufferAttribute(s, 3)));
    const rand = new Float32Array(COUNT);
    for (let i = 0; i < COUNT; i++) rand[i] = Math.random();
    geo.setAttribute("aRand", new THREE.BufferAttribute(rand, 1));
    geo.boundingSphere = new THREE.Sphere(new THREE.Vector3(), 6);

    const weights = new Array(SHAPE_COUNT).fill(0);
    weights[stage.shape] = 1;
    const initialDay = stage.theme === "day" ? 1 : 0;

    const uniforms = {
      uW: { value: weights },
      uTime: { value: 0 },
      uTurb: { value: 0.6 },
      uSize: { value: lowPower ? 34 : 30 },
      uPixelRatio: { value: dpr },
      uDay: { value: initialDay },
      uMouse: { value: new THREE.Vector3(99, 99, 99) },
      uMouseStrength: { value: 0 },
      uDim: { value: 1 },
    };
    const mat = new THREE.ShaderMaterial({
      vertexShader: vertex,
      fragmentShader: fragment,
      uniforms,
      transparent: true,
      depthWrite: false,
      blending: THREE.CustomBlending,
      blendSrc: THREE.OneFactor,
      blendDst: THREE.OneMinusSrcAlphaFactor,
    });
    const points = new THREE.Points(geo, mat);
    const group = new THREE.Group();
    group.add(points);
    scene.add(group);

    // ── Estrellas ─────────────────────────────
    const STARS = lowPower ? 700 : 1400;
    const sp = new Float32Array(STARS * 3), sr = new Float32Array(STARS);
    for (let i = 0; i < STARS; i++) {
      const u = Math.random() * Math.PI * 2, v = Math.acos(2 * Math.random() - 1);
      const R = 18 + Math.random() * 20;
      sp.set([R * Math.sin(v) * Math.cos(u), R * Math.cos(v), -Math.abs(R * Math.sin(v) * Math.sin(u)) - 4], i * 3);
      sr[i] = Math.random();
    }
    const sgeo = new THREE.BufferGeometry();
    sgeo.setAttribute("position", new THREE.BufferAttribute(sp, 3));
    sgeo.setAttribute("aRand", new THREE.BufferAttribute(sr, 1));
    const smat = new THREE.ShaderMaterial({
      vertexShader: starVertex, fragmentShader: starFragment,
      uniforms: { uTime: uniforms.uTime, uPixelRatio: uniforms.uPixelRatio, uDay: uniforms.uDay },
      transparent: true, depthWrite: false,
      blending: THREE.CustomBlending, blendSrc: THREE.OneFactor, blendDst: THREE.OneMinusSrcAlphaFactor,
    });
    const stars = new THREE.Points(sgeo, smat);
    scene.add(stars);

    // ── Interacción ─────────────────────────────
    const pointer = new THREE.Vector2(0, 0);
    const pointerSmooth = new THREE.Vector2(0, 0);
    let pointerActive = false;
    const raycaster = new THREE.Raycaster();
    const plane = new THREE.Plane(new THREE.Vector3(0, 0, 1), 0);
    const hit = new THREE.Vector3();
    const inv = new THREE.Matrix4();

    const onMove = (e: PointerEvent) => {
      pointer.set((e.clientX / window.innerWidth) * 2 - 1, -(e.clientY / window.innerHeight) * 2 + 1);
      pointerActive = e.pointerType === "mouse";
    };
    const onLeave = () => (pointerActive = false);
    window.addEventListener("pointermove", onMove, { passive: true });
    document.addEventListener("pointerleave", onLeave);

    let lastScroll = window.scrollY;

    const resize = () => {
      const w = window.innerWidth, h = window.innerHeight;
      renderer.setSize(w, h, false);
      camera.aspect = w / h;
      camera.position.z = w < 800 ? 11.5 : 9.5;
      camera.updateProjectionMatrix();
    };
    resize();
    window.addEventListener("resize", resize);

    // ── Bucle ─────────────────────────────
    let last = performance.now();
    const delta = () => { const now = performance.now(); const d = (now - last) / 1000; last = now; return d; };
    let offsetX = 0, rotY = 0, raf = 0, running = true;
    const dayTarget = () => (stage.theme === "day" ? 1 : 0);

    const frame = (dt: number) => {
      const target = stage.override ?? stage.shape;
      const speed = reduced ? 60 : 3.2;
      let maxW = 0;
      for (let i = 0; i < SHAPE_COUNT; i++) {
        weights[i] = damp(weights[i], i === target ? 1 : 0, speed, dt);
        maxW = Math.max(maxW, weights[i]);
      }
      // velocidad de scroll → un poco de viento en las partículas
      const sy = window.scrollY;
      const vel = Math.min(Math.abs(sy - lastScroll) / Math.max(dt, 0.001) / 4000, 1);
      lastScroll = sy;
      stage.scrollVelocity = damp(stage.scrollVelocity, vel, 4, dt);
      const turbTarget = reduced ? 0 : (1 - maxW) * 1.4 + stage.scrollVelocity * 0.25;
      uniforms.uTurb.value = damp(uniforms.uTurb.value, turbTarget, 6, dt);

      if (stage.snapTheme) { uniforms.uDay.value = dayTarget(); stage.snapTheme = false; }
      uniforms.uDay.value = damp(uniforms.uDay.value, dayTarget(), 3, dt);

      const small = window.innerWidth < 800;
      const sideX = small ? 0 : stage.side === "right" ? 2.5 : stage.side === "left" ? -2.5 : 0;
      offsetX = damp(offsetX, sideX, 2.2, dt);
      // centrado = detrás del texto → más tenue
      const dimTarget = stage.override !== null ? 1 : stage.side === "center" ? 0.38 : 1;
      uniforms.uDim.value = damp(uniforms.uDim.value, dimTarget, 3, dt);
      group.position.x = offsetX;
      group.position.y = small ? 0.6 : 0;
      group.scale.setScalar(small ? 0.82 : 1);

      pointerSmooth.lerp(pointer, 1 - Math.exp(-5 * dt));
      if (!reduced) rotY += dt * 0.08;
      group.rotation.y = rotY + pointerSmooth.x * 0.35;
      group.rotation.x = -pointerSmooth.y * 0.2;
      stars.rotation.y = rotY * 0.15;

      // posición del cursor en el espacio local de las partículas
      if (pointerActive && !reduced) {
        raycaster.setFromCamera(pointer, camera);
        if (raycaster.ray.intersectPlane(plane, hit)) {
          group.updateMatrixWorld();
          inv.copy(group.matrixWorld).invert();
          uniforms.uMouse.value.copy(hit.applyMatrix4(inv));
        }
      }
      uniforms.uMouseStrength.value = damp(uniforms.uMouseStrength.value, pointerActive && !reduced ? 1 : 0, 4, dt);

      renderer.render(scene, camera);
    };

    const loop = () => {
      if (!running) return;
      const dt = Math.min(delta(), 0.05);
      uniforms.uTime.value += dt;
      frame(dt);
      raf = requestAnimationFrame(loop);
    };
    loop();

    // render inmediato (lo usa la transición de tema)
    stage.renderNow = () => { stage.snapTheme = true; frame(0.016); };

    const onVis = () => {
      running = !document.hidden;
      if (running) { delta(); loop(); } else cancelAnimationFrame(raf);
    };
    document.addEventListener("visibilitychange", onVis);

    canvas.classList.add("is-ready");

    return () => {
      running = false;
      cancelAnimationFrame(raf);
      window.removeEventListener("pointermove", onMove);
      document.removeEventListener("pointerleave", onLeave);
      window.removeEventListener("resize", resize);
      document.removeEventListener("visibilitychange", onVis);
      stage.renderNow = null;
      geo.dispose(); mat.dispose(); sgeo.dispose(); smat.dispose(); renderer.dispose();
    };
  }, []);

  return <canvas ref={ref} className="scene" aria-hidden="true" />;
}
