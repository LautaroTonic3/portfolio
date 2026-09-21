import Link from "next/link";
import { profile } from "@/data/profile";

export default function Footer() {
  return (
    <footer className="footer">
      <p>© {new Date().getFullYear()} {profile.name}</p>
      <p>
        Hecho a mano con Next.js y three.js. <Link href="/como-se-hizo/">Así se construyó</Link>
      </p>
    </footer>
  );
}
