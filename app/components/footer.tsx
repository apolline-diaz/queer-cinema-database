import Link from "next/link";

export default function Header() {
  return (
    <footer className="footer bg-base-300 text-base-content p-10">
      <nav className="flex justify-between">
        <Link href="/about" className="link link-hover">
          A propos
        </Link>
        <Link href="/contact" className="link link-hover">
          Contact
        </Link>
      </nav>
    </footer>
  );
}
