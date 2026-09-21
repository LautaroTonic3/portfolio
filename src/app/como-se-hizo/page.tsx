import type { Metadata } from "next";
import Link from "next/link";
import Stage from "@/components/Stage";
import ShapeDemo from "@/components/ShapeDemo";

export const metadata: Metadata = {
  title: "Cómo se hizo",
  description: "Cómo está construido este portafolio: Next.js estático, un shader de partículas con ocho formas y un modo día/noche que sigue tu hora local.",
};

const chapters = [
  { id: "idea", title: "La idea" },
  { id: "stack", title: "El stack y por qué" },
  { id: "estatico", title: "Next.js como sitio estático" },
  { id: "particulas", title: "Las partículas" },
  { id: "dia-noche", title: "Día y noche" },
  { id: "rendimiento", title: "Rendimiento y accesibilidad" },
  { id: "problemas", title: "Lo que se rompió y cómo le busqué la vuelta" },
];

export default function Making() {
  return (
    <article className="making-page">
      <Stage as="header" shape={7} side="right" className="making-hero">
        <div className="wrap">
          <h1 className="project-title">Cómo se hizo este sitio</h1>
          <p className="project-summary">
            Decisiones, código y los problemas que aparecieron en el camino. Si eres
            desarrollador, aquí está todo lo que necesitas para entender cómo funciona.
          </p>
          <nav className="toc" aria-label="Capítulos">
            <ol>
              {chapters.map((c) => <li key={c.id}><a href={`#${c.id}`}>{c.title}</a></li>)}
            </ol>
          </nav>
        </div>
      </Stage>

      <Stage id="idea" shape={0} side="right" className="chapter">
        <div className="wrap"><div className="prose">
          <h2>La idea</h2>
          <p>
            Un portafolio suele ser una lista de tarjetas. Quería que este mostrara lo que sé hacer
            mientras lo recorres: que el fondo cambiara según de qué te estoy hablando. Cuando lees
            sobre IA, las partículas forman una red neuronal. En backend, una base de datos. En
            ciberseguridad, un candado.
          </p>
          <p>
            La restricción era clara: tenía que ser un sitio estático, para poder subirlo gratis a
            cualquier hosting, y tenía que cargar rápido incluso en un celular de gama media.
          </p>
        </div></div>
      </Stage>

      <Stage id="stack" shape={3} side="right" className="chapter">
        <div className="wrap"><div className="prose">
          <h2>El stack y por qué</h2>
          <ul>
            <li><strong>Next.js (App Router) + TypeScript.</strong> Rutas por archivos, una página por proyecto generada en el build y componentes de servidor que no mandan JavaScript al navegador.</li>
            <li><strong>three.js directo, sin React Three Fiber.</strong> La escena es una sola malla de puntos; un <code>useEffect</code> con el bucle de render alcanza y ahorra dependencias.</li>
            <li><strong>GLSL propio.</strong> Toda la animación de las partículas ocurre en la GPU.</li>
            <li><strong>Lenis</strong> para el scroll suave. Se desactiva si el sistema pide menos movimiento.</li>
            <li><strong>CSS plano con variables.</strong> Los dos temas son dos juegos de variables sobre <code>html[data-theme]</code>.</li>
            <li><strong>Fuentes locales</strong> con Fontsource: se empaquetan en el build y no dependen de Google Fonts en tiempo de ejecución.</li>
          </ul>
        </div></div>
      </Stage>

      <Stage id="estatico" shape={4} side="right" className="chapter">
        <div className="wrap"><div className="prose">
          <h2>Next.js como sitio estático</h2>
          <p>
            Next.js puede exportar todo a HTML plano. Sin servidor Node, sin funciones: una carpeta
            <code>out/</code> que se sube a Netlify, GitHub Pages, Cloudflare Pages o a un Apache
            cualquiera. La configuración completa es esta:
          </p>
          <pre><code>{`// next.config.mjs
const basePath = process.env.BASE_PATH || "";

export default {
  output: "export",          // genera /out con HTML estático
  trailingSlash: true,       // /proyectos/x/index.html → funciona en cualquier hosting
  basePath,                  // para GitHub Pages en un subdirectorio
  images: { unoptimized: true }, // no hay servidor que optimice imágenes
};`}</code></pre>
          <p>Para que eso funcione hubo que respetar algunas reglas:</p>
          <ul>
            <li>Las rutas dinámicas declaran <code>generateStaticParams</code> y <code>dynamicParams = false</code>. Así cada proyecto de <code>src/data/projects.ts</code> sale como su propia página.</li>
            <li>Nada de API routes, cookies ni headers en tiempo de petición. El formulario de contacto es un <code>mailto:</code>.</li>
            <li>Las imágenes se sirven tal cual. Las rutas a <code>/public</code> pasan por un helper <code>asset()</code> que antepone el <code>basePath</code> cuando hace falta.</li>
          </ul>
          <pre><code>{`npm run export   # next build + ajustes → carpeta /out
npm run preview  # sirve /out en http://localhost:4173`}</code></pre>
        </div></div>
      </Stage>

      <Stage id="particulas" shape={2} side="right" className="chapter">
        <div className="wrap"><div className="prose">
          <h2>Las partículas</h2>
          <p>
            Lo obvio habría sido recalcular posiciones en JavaScript en cada frame. Con 14.000
            puntos eso se come el hilo principal. En su lugar, al cargar calculo las ocho formas una
            sola vez y las subo a la GPU como ocho atributos de la misma geometría. Cada forma
            tiene exactamente la misma cantidad de puntos, así que el punto 523 del núcleo sabe
            dónde está el punto 523 del candado.
          </p>
          <p>
            Desde JavaScript solo mando ocho números: el peso de cada forma. Cuando una sección
            entra en pantalla, su peso tiende a 1 y el resto a 0, con amortiguación exponencial.
            El shader hace la mezcla:
          </p>
          <pre><code>{`vec3 p = aS0*uW[0] + aS1*uW[1] + aS2*uW[2] + aS3*uW[3]
       + aS4*uW[4] + aS5*uW[5] + aS6*uW[6] + aS7*uW[7];
p /= sum(uW);

// turbulencia: alta a mitad de la transición, casi cero en reposo
p += flow * (0.025 + uTurb * 0.9);`}</code></pre>
          <p>
            <code>uTurb</code> vale <code>1 − max(uW)</code>: cuando ninguna forma domina, las
            partículas se dispersan, y cuando llegan a la nueva forma se calman. Eso le da el
            aspecto de que se desarman y se vuelven a armar. La velocidad del scroll suma un poco
            de viento, y el cursor empuja los puntos cercanos: proyecto el mouse sobre un plano,
            lo paso al espacio local del grupo con la matriz inversa y el shader aparta lo que
            queda a menos de 1,3 unidades.
          </p>
          <p>
            Quién decide la forma es un <code>IntersectionObserver</code> por sección con
            <code>rootMargin: &quot;-48% 0px -48% 0px&quot;</code>: una franja fina en el centro de la
            pantalla. La sección que la cruza manda. Pruébalo:
          </p>
          <ShapeDemo />
        </div></div>
      </Stage>

      <Stage id="dia-noche" shape={0} side="right" className="chapter">
        <div className="wrap"><div className="prose">
          <h2>Día y noche</h2>
          <p>
            Si nunca elegiste un tema, el sitio mira tu reloj: entre las 6:00 y las 18:59 es de día.
            Eso lo decide un script diminuto dentro del <code>&lt;head&gt;</code>, antes de que se
            pinte nada, para que no haya un destello del tema equivocado.
          </p>
          <p>
            Al cambiarlo, un círculo se expande desde el botón. Es la View Transitions API: el
            navegador toma una captura del estado viejo, aplico el tema nuevo y animo un
            <code>clip-path</code> sobre la captura nueva. El truco es que el canvas también tiene
            que estar pintado con los colores nuevos en ese instante, así que dentro del callback
            fuerzo un frame de la escena.
          </p>
          <p>
            El problema más interesante fue el blending. De noche las partículas se ven mejor
            sumando luz (blending aditivo), pero sobre un fondo claro lo aditivo es invisible.
            Cambiar de modo a mitad de la animación produce un salto. La solución fue usar alfa
            premultiplicado y meter el tema dentro del alfa:
          </p>
          <pre><code>{`// blend: src * 1 + dst * (1 - src.a)
gl_FragColor = vec4(color * a, a * uDay);
// uDay = 0 → dst * 1: aditivo (noche)
// uDay = 1 → mezcla normal (día)
// cualquier valor intermedio: transición continua`}</code></pre>
        </div></div>
      </Stage>

      <Stage id="rendimiento" shape={5} side="right" className="chapter">
        <div className="wrap"><div className="prose">
          <h2>Rendimiento y accesibilidad</h2>
          <ul>
            <li>En pantallas chicas o equipos con 4 núcleos o menos se usan 7.000 partículas en lugar de 14.000 y se limita la densidad de píxeles.</li>
            <li>Cuando la pestaña no está visible, el bucle de render se detiene.</li>
            <li>Con <code>prefers-reduced-motion</code> no hay scroll suave, ni turbulencia, ni rotación: las formas cambian de golpe.</li>
            <li>Si el navegador no tiene WebGL, el canvas se oculta y el sitio sigue siendo completamente usable.</li>
            <li>Todo el texto es HTML real, navegable con teclado y con foco visible. El 3D es decoración: <code>aria-hidden</code>.</li>
            <li>El contenido de cada página se renderiza en el build, así que los buscadores lo leen sin ejecutar JavaScript.</li>
          </ul>
        </div></div>
      </Stage>

      <Stage id="problemas" shape={1} side="right" className="chapter">
        <div className="wrap"><div className="prose">
          <h2>Lo que se rompió y cómo le busqué la vuelta</h2>
          <dl className="issues">
            <div>
              <dt>React Three Fiber y un árbol de dependencias en conflicto</dt>
              <dd>La instalación chocaba con dependencias opcionales pensadas para React Native. En vez de forzar la instalación con <code>--legacy-peer-deps</code> (que deja el problema escondido para el próximo que clone el repo), bajé a three.js puro. La escena es una sola malla: no necesitaba un reconciliador.</dd>
            </div>
            <div>
              <dt>three.js en el servidor</dt>
              <dd>Durante el build, Next.js renderiza en Node, donde no existe <code>window</code> ni WebGL. La escena se carga con <code>dynamic(..., {"{ ssr: false }"})</code> desde un componente cliente, y todo el acceso a la GPU vive dentro de un <code>useEffect</code>.</dd>
            </div>
            <div>
              <dt>El destello del tema equivocado</dt>
              <dd>Leer el tema en React llega tarde: la página ya se pintó. El script inline en el <code>&lt;head&gt;</code> fija <code>data-theme</code> antes del primer pintado.</dd>
            </div>
            <div>
              <dt>Rutas rotas al publicar en GitHub Pages</dt>
              <dd>En un repo de proyecto el sitio vive en <code>/nombre-repo/</code>. <code>next/link</code> respeta el <code>basePath</code>, pero las etiquetas <code>&lt;img&gt;</code> no. De ahí el helper <code>asset()</code> y la variable <code>BASE_PATH</code> en el workflow.</dd>
            </div>
            <div>
              <dt>Texto ilegible sobre las partículas en celulares</dt>
              <dd>En escritorio la forma se aparta hacia el lado contrario al texto. En móvil no hay lado contrario, así que la escena se centra, se achica y los paneles de contenido llevan un fondo translúcido con desenfoque.</dd>
            </div>
            <div>
              <dt>Formas que se veían como una nube</dt>
              <dd>Las primeras versiones repartían los puntos en volúmenes y no se reconocía nada. Las formas se leen cuando los puntos viven en superficies y bordes: el candado es la cáscara de una caja con el hueco de la cerradura recortado, la interfaz son los perímetros de los rectángulos.</dd>
            </div>
          </dl>
          <p className="making-end">
            Todo el código está organizado para que cambiar el contenido no requiera tocar la
            escena: los datos viven en <code>src/data</code>. <Link href="/#proyectos">Ver los proyectos</Link>.
          </p>
        </div></div>
      </Stage>
    </article>
  );
}
