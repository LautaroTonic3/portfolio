/**
 * Exportación 100% estática.
 * `npm run build` genera la carpeta /out con HTML, CSS, JS e imágenes
 * listos para subir a cualquier hosting estático (Netlify, GitHub Pages,
 * Cloudflare Pages, Vercel, un bucket S3, Apache/Nginx...).
 *
 * BASE_PATH: si publicas en GitHub Pages dentro de un repo que NO es
 * usuario.github.io (ej: usuario.github.io/portfolio) define
 * BASE_PATH=/portfolio al construir. En cualquier otro hosting déjalo vacío.
 */
const basePath = process.env.BASE_PATH || "";

/** @type {import('next').NextConfig} */
const nextConfig = {
  output: "export",
  trailingSlash: true,
  basePath,
  assetPrefix: basePath || undefined,
  images: { unoptimized: true },
  env: { NEXT_PUBLIC_BASE_PATH: basePath },
  reactStrictMode: true,
};

export default nextConfig;
