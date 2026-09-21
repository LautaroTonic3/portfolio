import type { AreaId } from "./profile";

/**
 * ─────────────────────────────────────────────────────────────
 *  PROYECTOS DE EJEMPLO → reemplázalos por los tuyos.
 * ─────────────────────────────────────────────────────────────
 *  Cada proyecto genera automáticamente su propia página en
 *  /proyectos/<slug>/ al hacer `npm run build`.
 *
 *  - slug: la URL (sin espacios ni tildes)
 *  - area: "ia" | "frontend" | "backend" | "seguridad"
 *  - image: opcional. Si la pones (ej "/images/proyecto.jpg"),
 *    se usa como portada. Si no, se dibuja una portada generativa.
 *  - links: opcional, repo / demo.
 */

export type Project = {
  slug: string;
  title: string;
  area: AreaId;
  year: string;
  role: string;
  summary: string;
  problem: string;
  approach: string[];
  outcome: string[];
  stack: string[];
  image?: string;
  links?: { label: string; href: string }[];
  featured?: boolean;
};

export const projects: Project[] = [
  // ───────────── IA ─────────────
  {
    slug: "deteccion-fraude-transacciones",
    title: "Detección de fraude en transacciones",
    area: "ia",
    year: "2025",
    role: "Diseño del modelo, pipeline de datos y API",
    summary:
      "Red neuronal que marca transacciones sospechosas en tiempo real sobre un dataset muy desbalanceado.",
    problem:
      "Menos del 0,5 % de las transacciones eran fraude. Un modelo que dijera siempre “legítima” tenía 99,5 % de exactitud y no servía para nada.",
    approach: [
      "Exploración y limpieza con pandas: nulos, outliers y variables derivadas por hora, monto y frecuencia del cliente.",
      "Red densa en TensorFlow con pesos por clase y umbral ajustado sobre la curva precisión-recall, no sobre accuracy.",
      "Validación temporal (entrenar con el pasado, evaluar con el futuro) para no hacerse trampa.",
      "Servido con FastAPI y empaquetado en Docker.",
    ],
    outcome: [
      "Métrica guía: recall sobre la clase fraude con precisión aceptable para el equipo de revisión.",
      "Respuesta por transacción por debajo de 50 ms en la API.",
    ],
    stack: ["Python", "pandas", "TensorFlow", "scikit-learn", "FastAPI", "Docker"],
    featured: true,
  },
  {
    slug: "clasificador-imagenes-cnn",
    title: "Clasificador de imágenes con CNN propia",
    area: "ia",
    year: "2024",
    role: "Arquitectura, entrenamiento y evaluación",
    summary:
      "Red convolucional construida capa por capa, sin modelos preentrenados, para clasificar imágenes de productos.",
    problem:
      "Pocas imágenes por clase y fotos tomadas con celulares distintos: el modelo memorizaba el fondo en vez del producto.",
    approach: [
      "Aumento de datos (rotaciones, recortes, brillo) para forzar generalización.",
      "Arquitectura convolucional con batch normalization y dropout, ajustada a mano.",
      "Mapas de activación para comprobar qué miraba realmente la red.",
    ],
    outcome: [
      "La red dejó de fijarse en el fondo: los mapas de activación se concentran en el producto.",
      "Modelo exportado a TensorFlow Lite para correr en dispositivo.",
    ],
    stack: ["TensorFlow", "Keras", "NumPy", "OpenCV", "Matplotlib"],
  },
  {
    slug: "prediccion-demanda-series",
    title: "Predicción de demanda con series de tiempo",
    area: "ia",
    year: "2023",
    role: "Análisis de datos y modelado",
    summary:
      "Modelo LSTM que anticipa la demanda semanal por producto para planificar inventario.",
    problem:
      "Las compras se hacían por intuición: sobraba stock de unas cosas y faltaba de otras justo en temporada alta.",
    approach: [
      "Unificación de años de ventas en pandas, con calendario de feriados y promociones.",
      "Comparación honesta contra una línea base simple antes de complicar el modelo.",
      "LSTM en TensorFlow con ventanas deslizantes y reentrenamiento programado.",
    ],
    outcome: [
      "Pronóstico semanal por producto consumido desde un dashboard interno.",
      "Error medido contra la línea base en cada reentrenamiento.",
    ],
    stack: ["Python", "pandas", "TensorFlow", "LSTM", "PostgreSQL"],
  },

  // ───────────── FRONTEND ─────────────
  {
    slug: "portafolio-3d",
    title: "Este portafolio",
    area: "frontend",
    year: "2026",
    role: "Diseño y desarrollo completo",
    summary:
      "Sitio estático con una escena WebGL de partículas que cambia de forma según la sección y un modo día/noche que sigue tu hora local.",
    problem:
      "Quería algo que no se viera como otra plantilla, pero que cargara rápido y se pudiera subir gratis como sitio estático.",
    approach: [
      "Next.js con exportación estática: todo el sitio sale como HTML plano en /out.",
      "Un solo shader de partículas con ocho formas precalculadas y mezcla por pesos.",
      "Tema inicial según la hora del visitante y transición circular con View Transitions.",
    ],
    outcome: [
      "Se sube a cualquier hosting estático sin servidor Node.",
      "Respeta prefers-reduced-motion y ajusta la cantidad de partículas en celulares.",
    ],
    stack: ["Next.js", "TypeScript", "Three.js", "GLSL", "Lenis"],
    links: [{ label: "Cómo se hizo", href: "/como-se-hizo/" }],
    featured: true,
  },
  {
    slug: "dashboard-tiempo-real",
    title: "Dashboard de operaciones en tiempo real",
    area: "frontend",
    year: "2024",
    role: "Frontend lead",
    summary:
      "Panel que muestra miles de eventos por minuto sin que el navegador se congele.",
    problem:
      "La versión anterior re-renderizaba toda la tabla con cada evento y se volvía inutilizable a los pocos minutos.",
    approach: [
      "Virtualización de listas y agrupación de actualizaciones por frame.",
      "Gráficas en canvas en lugar de SVG para series largas.",
      "Estado del servidor separado del estado de la interfaz.",
    ],
    outcome: [
      "Interfaz fluida con el panel abierto durante horas.",
      "Componentes reutilizados en otros dos productos internos.",
    ],
    stack: ["React", "TypeScript", "WebSockets", "Canvas", "Vite"],
  },
  {
    slug: "design-system",
    title: "Sistema de diseño accesible",
    area: "frontend",
    year: "2023",
    role: "Arquitectura de componentes",
    summary:
      "Librería de componentes con tokens de diseño, tema claro y oscuro, y accesibilidad revisada.",
    problem:
      "Cada equipo tenía su propio botón. La interfaz se veía distinta en cada pantalla y nadie revisaba el contraste.",
    approach: [
      "Tokens de color, tipografía y espacio como única fuente de verdad.",
      "Componentes con navegación por teclado y roles ARIA desde el inicio.",
      "Documentación viva con ejemplos copiables.",
    ],
    outcome: [
      "Un solo lenguaje visual en todas las aplicaciones.",
      "Contraste AA verificado en ambos temas.",
    ],
    stack: ["React", "TypeScript", "CSS variables", "Storybook"],
  },

  // ───────────── BACKEND ─────────────
  {
    slug: "api-pagos-idempotente",
    title: "API de pagos idempotente",
    area: "backend",
    year: "2025",
    role: "Diseño de API y base de datos",
    summary:
      "Servicio que procesa cobros sin duplicarlos aunque el cliente reintente la misma petición diez veces.",
    problem:
      "Timeouts de red hacían que algunos usuarios pagaran dos veces. El problema no era el código de cobro: era la falta de idempotencia.",
    approach: [
      "Claves de idempotencia guardadas en PostgreSQL con restricción única.",
      "Transacciones y bloqueos a nivel de fila para evitar condiciones de carrera.",
      "Cola de eventos para notificar a otros servicios sin acoplarlos.",
    ],
    outcome: [
      "Cero cobros duplicados desde el despliegue.",
      "Contrato de API documentado con OpenAPI.",
    ],
    stack: ["Node.js", "PostgreSQL", "Redis", "Docker", "OpenAPI"],
    featured: true,
  },
  {
    slug: "servicio-modelos-ml",
    title: "Servicio para desplegar modelos de ML",
    area: "backend",
    year: "2024",
    role: "Backend y MLOps",
    summary:
      "Plataforma interna para publicar modelos de TensorFlow como endpoints versionados.",
    problem:
      "Cada modelo terminaba en un notebook distinto y pasarlo a producción tomaba semanas.",
    approach: [
      "Registro de modelos con versión, métricas y dataset de origen.",
      "Endpoints generados por versión, con rollback en un comando.",
      "Caché de predicciones repetidas en Redis.",
    ],
    outcome: [
      "Publicar un modelo nuevo pasó de semanas a una tarde.",
      "Cada predicción queda asociada a la versión que la produjo.",
    ],
    stack: ["Python", "FastAPI", "TensorFlow Serving", "Redis", "Docker"],
  },
  {
    slug: "chat-tiempo-real",
    title: "Mensajería en tiempo real",
    area: "backend",
    year: "2022",
    role: "Desarrollo backend",
    summary:
      "Servidor de chat con salas, presencia y mensajes que llegan en orden aunque haya varios nodos.",
    problem:
      "Con más de un servidor, los mensajes llegaban desordenados y la presencia de usuarios mentía.",
    approach: [
      "WebSockets con pub/sub en Redis para sincronizar nodos.",
      "Numeración de mensajes por sala para garantizar orden.",
      "Latidos y expiración para una presencia confiable.",
    ],
    outcome: [
      "Escala horizontalmente agregando nodos detrás del balanceador.",
    ],
    stack: ["Node.js", "WebSockets", "Redis", "Nginx", "Docker"],
  },

  // ───────────── CIBERSEGURIDAD ─────────────
  {
    slug: "ids-machine-learning",
    title: "Detección de intrusos con machine learning",
    area: "seguridad",
    year: "2025",
    role: "Investigación y modelo",
    summary:
      "Sistema que aprende cómo se ve el tráfico normal de una red y alerta cuando algo se sale del patrón.",
    problem:
      "Las reglas fijas solo detectaban ataques conocidos. Lo nuevo pasaba sin ruido.",
    approach: [
      "Captura y extracción de características de flujos de red.",
      "Autoencoder en TensorFlow entrenado solo con tráfico normal: lo que no sabe reconstruir es sospechoso.",
      "Umbral calibrado para no ahogar al equipo en falsos positivos.",
    ],
    outcome: [
      "Detecta escaneos de puertos y exfiltración lenta que las reglas no veían.",
      "Alertas con contexto enviadas al canal del equipo.",
    ],
    stack: ["Python", "TensorFlow", "pandas", "Wireshark", "Zeek"],
    featured: true,
  },
  {
    slug: "auditoria-owasp",
    title: "Auditoría de seguridad de aplicación web",
    area: "seguridad",
    year: "2024",
    role: "Pentesting y remediación",
    summary:
      "Revisión completa de una aplicación en producción siguiendo OWASP, con informe y correcciones.",
    problem:
      "La aplicación había crecido rápido y nadie sabía qué tan expuesta estaba.",
    approach: [
      "Mapeo de superficie de ataque y pruebas manuales con Burp Suite.",
      "Revisión de autenticación, control de acceso e inyecciones.",
      "Informe priorizado por riesgo y acompañamiento en las correcciones.",
    ],
    outcome: [
      "Hallazgos críticos corregidos y verificados con una segunda ronda.",
      "Checklist de seguridad incorporado al proceso de revisión de código.",
    ],
    stack: ["Burp Suite", "OWASP ZAP", "Nmap", "Kali Linux"],
  },
  {
    slug: "hardening-servidores",
    title: "Hardening de infraestructura Linux",
    area: "seguridad",
    year: "2023",
    role: "Seguridad de infraestructura",
    summary:
      "Endurecimiento de servidores y automatización para que la configuración segura no dependa de la memoria de nadie.",
    problem:
      "Servidores configurados a mano, cada uno distinto, con puertos abiertos que nadie recordaba haber abierto.",
    approach: [
      "Línea base de configuración: SSH con llaves, firewall, usuarios mínimos.",
      "Scripts reproducibles para aplicar y verificar la configuración.",
      "Monitoreo de logs y alertas ante intentos de acceso.",
    ],
    outcome: [
      "Superficie expuesta reducida a los servicios necesarios.",
      "Servidores nuevos nacen ya endurecidos.",
    ],
    stack: ["Linux", "Bash", "UFW", "Fail2ban", "Ansible"],
  },
];

export const areaLabels: Record<AreaId, string> = {
  ia: "Inteligencia artificial",
  frontend: "Frontend",
  backend: "Backend",
  seguridad: "Ciberseguridad",
};
