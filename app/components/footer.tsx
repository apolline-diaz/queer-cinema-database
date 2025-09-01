import Link from "next/link";

export default function Header() {
  return (
    <footer className="h-full footer flex flex-col gap-3 bg-gray-200 text-black px-10 pb-2 pt-4 border-t border-gray-500 b-0">
      <div className="flex flex-col sm:flex-row justify-between">
        <div className="py-2">
          <div className="flex flex-row text-xl mb-2">
            <p className="font-medium">queer cinema</p>
            <span className="px-2 font-extralight">database</span>
          </div>
          <p className="w-3/4 font-extralight">
            Une sélection de films et d&apos;archives LGBTQI+ pour célébrer la
            pluralité des regards queer dans le monde.
          </p>
        </div>
        <nav className="flex flex-col font-light text-sm w-1/4 sm:justify-end sm:items-end sm:text-right text-left gap-3 sm:m-4 my-2">
          <Link
            href="/about"
            className="link link-hover hover:underline hover:underline-offset-8"
          >
            À propos
          </Link>

          <Link
            href="/contact"
            className="link link-hover hover:underline hover:underline-offset-8"
          >
            Contact
          </Link>
          <Link
            href="/privacy-policy"
            className="link link-hover hover:underline hover:underline-offset-8"
          >
            Politiques de confidentialité
          </Link>
        </nav>
      </div>
      <p className="font-light text-xs text-center mb-2">
        © 2025 Queer Cinema Database. Tous droits réservés.
      </p>
    </footer>
  );
}
