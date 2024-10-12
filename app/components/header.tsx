import Link from "next/link";

export default function Header() {
  return (
    <>
      <div className="flex flex-rows items-center justify-between mx-5 p-5 gap-10">
        <Link href="/" className="text-xl">
          movie diary
        </Link>
        <div className="flex justify-center items-center gap-10">
          <ul className="">
            <li>
              <Link
                href="/movies/upload"
                className="hover:underline underline-offset-8"
              >
                Ajouter un film
              </Link>
            </li>
          </ul>
          <Link href="/login" className="hover:underline underline-offset-8 ">
            Connexion
          </Link>
        </div>
      </div>
    </>
  );
}
