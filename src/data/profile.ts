/**
 * ─────────────────────────────────────────────────────────────
 *  TUS DATOS. Edita este archivo y todo el sitio se actualiza.
 * ─────────────────────────────────────────────────────────────
 *  - La foto va en /public/images/ (cambia `photo` por tu archivo,
 *    ej: "/images/foto.jpg"). Recomendado: 900×1100 px, vertical.
 *  - Los proyectos están en src/data/projects.ts
 */

export const profile = {
  name: "Lautaro Griguelo",
  shortName: "Lautaro",
  initials: "LG",
  role: "Ingeniero de software",
  // Frases que rotan en el hero con efecto de "descifrado"
  roles: [
    "modelos de IA desde cero",
    "APIs que aguantan tráfico real",
    "interfaces que se sienten vivas",
    "sistemas que no se dejan romper",
  ],
  location: "Latinoamérica, trabajo remoto",
  available: true,
  availabilityText: "Disponible para proyectos nuevos",
  photo: "/images/foto.svg",
  photoAlt: "Retrato de Lautaro Griguelo",

  // Texto del hero (1–2 frases)
  intro:
    "Diseño y construyo software de punta a punta: desde el modelo que aprende de los datos hasta la interfaz que lo muestra, pasando por la API que lo sirve y la seguridad que lo protege.",

  // Sección "Sobre mí" (párrafos)
  about: [
    "Llevo varios años escribiendo software en producción. Empecé por el frontend, bajé al backend porque quería entender qué pasaba detrás del botón, y de ahí terminé en dos lugares donde casi nadie mira: los datos y la seguridad.",
    "He entrenado modelos desde cero con pandas y TensorFlow: limpiar datasets sucios, elegir arquitecturas, pelear con el overfitting y llevar el resultado a una API que alguien pueda usar. En ciberseguridad me interesa pensar como atacante para construir como defensor.",
    "Lo que me diferencia es que veo el sistema completo. Cuando diseño una pantalla ya estoy pensando en la consulta que la alimenta, en cómo se podría abusar de ese endpoint y en qué métrica me va a decir si funciona.",
  ],

  facts: [
    { value: "6+", label: "años construyendo software" },
    { value: "4", label: "áreas en las que entrego" },
    { value: "30+", label: "proyectos terminados" },
  ],

  email: "griguelolautaro@gmail.com",
  socials: [
    { label: "GitHub", href: "https://github.com/" },
    { label: "LinkedIn", href: "https://www.linkedin.com/" },
    { label: "Correo", href: "mailto:griguelolautaro@gmail.com" },
  ],
  cvUrl: "", // ej: "/cv.pdf" (ponlo en /public). Vacío = no se muestra el botón
};

export type AreaId = "ia" | "frontend" | "backend" | "seguridad";

export const areas: {
  id: AreaId;
  title: string;
  kicker: string;
  description: string;
  tools: string[];
  shape: number; // forma 3D que toman las partículas en esta sección
}[] = [
  {
    id: "ia",
    title: "Inteligencia artificial",
    kicker: "Modelos entrenados desde cero",
    description:
      "Del CSV crudo al modelo en producción. Limpieza y exploración con pandas, redes con TensorFlow y Keras, evaluación honesta y despliegue detrás de una API.",
    tools: ["Python", "pandas", "NumPy", "TensorFlow", "Keras", "scikit-learn", "Jupyter", "FastAPI"],
    shape: 2,
  },
  {
    id: "frontend",
    title: "Frontend",
    kicker: "Interfaces con intención",
    description:
      "Aplicaciones web rápidas y accesibles, con animación y 3D cuando suman. Componentes pensados para crecer y medidos con Lighthouse, no a ojo.",
    tools: ["React", "Next.js", "TypeScript", "Three.js", "WebGL", "CSS moderno", "Vite"],
    shape: 3,
  },
  {
    id: "backend",
    title: "Backend",
    kicker: "Servicios que aguantan",
    description:
      "APIs REST y tiempo real, modelado de datos, colas y caché. Diseño para que el sistema siga en pie cuando el tráfico se multiplica.",
    tools: ["Node.js", "Python", "PostgreSQL", "Redis", "Docker", "REST", "WebSockets", "Linux"],
    shape: 4,
  },
  {
    id: "seguridad",
    title: "Ciberseguridad",
    kicker: "Pensar como atacante",
    description:
      "Auditorías de aplicaciones web, hardening de servidores y detección de anomalías con machine learning. OWASP Top 10 como punto de partida, no de llegada.",
    tools: ["OWASP", "Burp Suite", "Nmap", "Wireshark", "Kali Linux", "JWT/OAuth", "Hardening"],
    shape: 5,
  },
];
