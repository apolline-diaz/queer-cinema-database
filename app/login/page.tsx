import Link from "next/link";
import { login, signup } from "./actions";

export default function LoginPage() {
  return (
    <div className="justify-center items-center p-10 flex flex-col">
      <div className="w-full md:w-[500px] text-left border border-pink-200 p-10 rounded-md">
        <form>
          <div className="flex flex-col gap-3 mb-10">
            <label htmlFor="email">Adresse e-mail</label>
            <input
              className="appearance-none text-lg font-light border-black block w-full bg-gray-200 text-gray-700 border rounded py-3 px-4 leading-tight focus:outline-none focus:bg-white"
              id="email"
              name="email"
              type="email"
              placeholder="Tapez votre adresse"
              required
            />
            <label htmlFor="password">Mot de passe</label>
            <input
              className="appearance-none text-lg font-light border-black block w-full bg-gray-200 text-gray-700 border rounded py-3 px-4 leading-tight focus:outline-none focus:bg-white"
              id="password"
              name="password"
              type="password"
              placeholder="Tapez votre mot de passe"
              required
            />
          </div>
          <div className="w-full justify-center flex flex-row-1 gap-4">
            <button
              className="rounded-full border border-black bg-white hover:bg-pink-200 p-2 "
              formAction={login}
            >
              Se connecter
            </button>

            <div className="items-center rounded-full bg-white hover:underline underline-offset-8 p-2">
              <Link href="/signup">Pas encore inscrit-e?</Link>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}
