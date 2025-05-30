import Link from "next/link";

export default function Header() {
  return (
    <footer className="h-full footer bg-rose-700 text-white px-10 pb-2 pt-4 border-t border-rose-600 b-0">
      <nav className="flex justify-between mb-4">
        <Link
          href="/contact"
          className="link link-hover hover:underline hover:underline-offset-8"
        >
          Contact
        </Link>
      </nav>
      <p className="font-light text-xs text-center mb-2">
        © 2024 Queer Cinema Database. Tous droits réservés.
      </p>
    </footer>
  );
}
