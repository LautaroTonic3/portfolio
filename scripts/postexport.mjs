// Pequeños ajustes después de exportar: .nojekyll para GitHub Pages
// y un resumen de lo que se generó en /out.
import { writeFileSync, readdirSync, statSync } from "node:fs";
import { join } from "node:path";

const out = "out";
writeFileSync(join(out, ".nojekyll"), "");

let files = 0, bytes = 0;
const walk = (d) => readdirSync(d).forEach((f) => {
  const p = join(d, f); const s = statSync(p);
  if (s.isDirectory()) walk(p); else { files++; bytes += s.size; }
});
walk(out);
console.log(`\n✔ Sitio estático listo en /out  (${files} archivos, ${(bytes / 1024 / 1024).toFixed(2)} MB)`);
console.log("  Pruébalo con: npm run preview  →  http://localhost:4173\n");
