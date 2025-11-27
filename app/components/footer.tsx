import { Icon } from "@iconify/react/dist/iconify.js";
import Link from "next/link";

export default function Footer() {
  return (
    <footer className="bg-pink-50 border border-t-pink-500 text-black py-8">
      <div className="px-[clamp(1.25rem,5vw,2.5rem)] flex flex-col md:flex-row justify-between items-center">
        {/* Logo et description */}
        <div className="mb-6 md:mb-0 text-center md:text-left">
          <h1 className="text-lg font-semibold">queer cinema database</h1>
          <p className="mt-2 font-light max-w-xs">
            Une sélection de films et d&apos;archives LGBTQI+ pour mettre en
            lumière la diversité des regards et récits queer.
          </p>
        </div>

        {/* Liens */}
        <div className="flex flex-col md:items-end md:text-right gap-4 items-center">
          <Link href="/about" className="hover:text-pink-500 transition">
            À propos
          </Link>
          <Link href="/stats" className="hover:text-pink-500 transition">
            Statistiques
          </Link>
          <Link href="/contact" className="hover:text-pink-500 transition">
            Contact
          </Link>
          <Link
            href="https://www.instagram.com/queercinema.db/"
            target="_blank"
            rel="noopener noreferrer"
            className="hover:text-pink-500 transition"
          >
            <Icon icon="lucide:instagram" className="size-5" />
          </Link>
        </div>
      </div>

      <div className="mt-6 text-center font-light text-gray-700 text-xs">
        <Link
          href="/privacy"
          className="hover:text-pink-500 transition text-xs"
        >
          Politiques de confidentialité
        </Link>
      </div>
    </footer>
  );
}
