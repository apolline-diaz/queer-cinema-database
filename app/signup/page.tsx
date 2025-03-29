"use client";

import Link from "next/link";
import { signup } from "../login/actions";
import { SubmitButton } from "../components/submit-button";

export default function SignUpPage() {
  return (
    <div className="justify-center items-center p-10 flex flex-col">
      <form className="w-full md:w-[500px] text-left border border-pink-200 p-10 rounded-xl">
        <div className="flex flex-col gap-3 mb-10">
          <label htmlFor="email">Adresse e-mail</label>
          <input
            className="appearance-none text-sm font-light border-white block w-full bg-neutral-950 text-gray-700 border rounded py-3 px-4 leading-tight focus:outline-none focus:text-white"
            id="email"
            name="email"
            type="email"
            placeholder="Tapez votre adresse e-mail"
            required
          />
          <label htmlFor="password">Mot de passe</label>
          <input
            className="appearance-none text-sm font-light border-white block w-full bg-neutral-950 text-gray-700 border rounded py-3 px-4 leading-tight focus:outline-none focus:text-white"
            id="password"
            name="password"
            type="password"
            placeholder="Choisissez votre mot de passe"
            required
          />
        </div>
        <div className="w-full justify-center flex flex-wrap gap-4">
          <SubmitButton
            defaultText="S'inscrire"
            loadingText="Envoi..."
            formAction={signup}
          />
          <div className="rounded-full  hover:underline underline-offset-8 p-2 ">
            <Link href="/login">Déjà inscrit-e?</Link>
          </div>
        </div>
      </form>
    </div>
  );
}
