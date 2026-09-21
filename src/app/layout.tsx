import type { Metadata, Viewport } from "next";
import "@fontsource-variable/bricolage-grotesque/index.css";
import "@fontsource-variable/instrument-sans/index.css";
import "@/styles/globals.css";
import ThemeScript from "@/components/ThemeScript";
import SceneLoader from "@/components/SceneLoader";
import SmoothScroll from "@/components/SmoothScroll";
import Nav from "@/components/Nav";
import Footer from "@/components/Footer";
import { profile } from "@/data/profile";

export const metadata: Metadata = {
  title: { default: `${profile.name}, ${profile.role}`, template: `%s | ${profile.name}` },
  description: profile.intro,
  openGraph: { title: profile.name, description: profile.intro, type: "website" },
  icons: { icon: `${process.env.NEXT_PUBLIC_BASE_PATH || ""}/favicon.svg` },
};

export const viewport: Viewport = {
  themeColor: [
    { media: "(prefers-color-scheme: dark)", color: "#0a0f1e" },
    { media: "(prefers-color-scheme: light)", color: "#e4eaf1" },
  ],
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="es" suppressHydrationWarning>
      <head><ThemeScript /></head>
      <body>
        <a href="#contenido" className="skip">Saltar al contenido</a>
        <div className="sky" aria-hidden="true" />
        <SceneLoader />
        <SmoothScroll />
        <Nav />
        <main id="contenido">{children}</main>
        <Footer />
      </body>
    </html>
  );
}
