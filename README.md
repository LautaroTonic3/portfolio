# Portafolio 3D (Next.js + three.js)

Portafolio con una escena de 14.000 partículas que cambia de forma según la sección
(núcleo, doble hélice, red neuronal, capas de interfaz, base de datos, candado, galaxia y onda),
modo día/noche que arranca según la hora del visitante y exportación **100 % estática**.

## Requisitos

- Node.js 20.9 o superior (recomendado 22)

## Correrlo en local

```bash
npm install
npm run dev          # http://localhost:3000 con recarga en caliente
```

## Generar el sitio estático

```bash
npm run export       # compila y deja TODO el sitio en la carpeta /out
npm run preview      # sirve /out en http://localhost:4173 para probarlo
```

La carpeta `out/` es HTML, CSS, JS e imágenes. No necesita Node ni servidor: se sube tal cual.

## Personalizar (lo primero que tienes que tocar)

| Qué | Dónde |
| --- | --- |
| Nombre, rol, textos, correo, redes, CV | `src/data/profile.ts` |
| Tu foto | Pon tu imagen en `public/images/` (ej. `foto.jpg`, vertical ~900×1100) y cambia `photo` en `profile.ts` |
| Proyectos (**los que vienen son ejemplos, reemplázalos**) | `src/data/projects.ts`. Cada proyecto genera su página `/proyectos/<slug>/` |
| Imagen de un proyecto | Campo `image: "/images/mi-proyecto.jpg"`. Si no hay, se dibuja una portada generativa |
| Colores de cada tema | Variables al inicio de `src/styles/globals.css` |
| Colores de las partículas | Constantes `N1..N3` (noche) y `D1..D3` (día) en `src/components/Scene.tsx` |
| Formas 3D | `src/lib/shapes.ts` |
| Texto de "Cómo se hizo" | `src/app/como-se-hizo/page.tsx` |

## Subirlo gratis

### Opción 1: Netlify Drop (2 minutos, sin cuenta de Git)
1. `npm run export`
2. Entra a https://app.netlify.com/drop y arrastra la carpeta `out`.

### Opción 2: Netlify o Cloudflare Pages conectado a GitHub (se actualiza solo)
- **Netlify:** importa el repo. `netlify.toml` ya trae el comando (`npm run export`) y la carpeta (`out`).
- **Cloudflare Pages:** Build command `npm run export`, output directory `out`, variable `NODE_VERSION=22`.

### Opción 3: GitHub Pages
1. Sube el proyecto a un repo de GitHub.
2. En el repo: **Settings → Pages → Source: GitHub Actions**.
3. Haz push a `main`. El workflow `.github/workflows/deploy.yml` construye y publica.

Si el repo se llama `tu-usuario.github.io`, el sitio queda en la raíz. Si se llama distinto
(por ejemplo `portfolio`), queda en `tu-usuario.github.io/portfolio/` y el workflow configura
`BASE_PATH` automáticamente. Para probar eso en local: `BASE_PATH=/portfolio npm run export`.

### Opción 4: Vercel
Importa el repo. Vercel detecta Next.js; con `output: "export"` publica el resultado estático.

### Cualquier hosting (cPanel, Apache, Nginx, S3)
Sube el contenido de `out/` a la carpeta pública. `trailingSlash: true` hace que cada ruta
sea una carpeta con su `index.html`, así funciona sin reglas de reescritura.

## Estructura

```
src/
  app/
    layout.tsx               # layout global: escena 3D, nav, tema, scroll suave
    page.tsx                 # inicio: hero, sobre mí, áreas, proyectos, contacto
    proyectos/[slug]/page.tsx# una página estática por proyecto
    como-se-hizo/page.tsx    # cómo se construyó el sitio
    not-found.tsx            # 404
  components/
    Scene.tsx                # three.js + shaders GLSL de las partículas
    Stage.tsx                # le dice a la escena qué forma mostrar por sección
    ThemeToggle.tsx          # día/noche con transición circular
    ThemeScript.tsx          # elige el tema antes de pintar (sin parpadeo)
    ...
  data/
    profile.ts               # TUS DATOS
    projects.ts              # TUS PROYECTOS
  lib/
    shapes.ts                # generadores de las 8 formas
    stage.ts                 # estado compartido DOM ↔ escena
  styles/globals.css
```

## Notas

- Respeta `prefers-reduced-motion`: sin scroll suave, sin turbulencia, cambios instantáneos.
- En celulares usa la mitad de partículas y limita la resolución.
- Si el navegador no tiene WebGL, el sitio funciona igual sin el fondo 3D.
- El contacto es un `mailto:`. Si quieres un formulario real en un sitio estático, puedes
  usar Formspree o Netlify Forms sin cambiar de hosting.
