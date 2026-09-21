"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import ThemeToggle from "./ThemeToggle";
import { profile } from "@/data/profile";

const links = [
  { href: "/#sobre-mi", label: "Sobre mí" },
  { href: "/#areas", label: "Áreas" },
  { href: "/#proyectos", label: "Proyectos" },
  { href: "/como-se-hizo/", label: "Cómo se hizo" },
  { href: "/#contacto", label: "Contacto" },
];

export default function Nav() {
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const pathname = usePathname();

  useEffect(() => setOpen(false), [pathname]);
  useEffect(() => {
    const on = () => setScrolled(window.scrollY > 40);
    on(); window.addEventListener("scroll", on, { passive: true });
    return () => window.removeEventListener("scroll", on);
  }, []);
  useEffect(() => {
    document.documentElement.classList.toggle("menu-open", open);
  }, [open]);

  return (
    <header className={`nav ${scrolled ? "nav--scrolled" : ""}`}>
      <Link href="/" className="nav-logo" aria-label={`${profile.name}, inicio`}>
        <span className="nav-logo-mark">{profile.initials}</span>
        <span className="nav-logo-name">{profile.name}</span>
      </Link>
      <nav className={`nav-links ${open ? "is-open" : ""}`} aria-label="Principal">
        {links.map((l) => (
          <Link key={l.href} href={l.href} onClick={() => setOpen(false)}
            aria-current={l.href === pathname ? "page" : undefined}>{l.label}</Link>
        ))}
      </nav>
      <div className="nav-actions">
        <ThemeToggle />
        <button className="nav-burger" aria-expanded={open} aria-label={open ? "Cerrar menú" : "Abrir menú"} onClick={() => setOpen(!open)}>
          <span /><span />
        </button>
      </div>
    </header>
  );
}
