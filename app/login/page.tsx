"use client";

import Link from "next/link";
import { login } from "./actions";
import { useForm } from "react-hook-form";
import { SubmitButton } from "../components/submit-button";
import { useState } from "react";
import { redirect } from "next/navigation";

interface LoginFormInputs {
  email: string;
  password: string;
}

export default function LoginPage() {
  const [authError, setAuthError] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<LoginFormInputs>();

  const onSubmit = async (data: LoginFormInputs) => {
    setAuthError(null);
    const formData = new FormData();
    formData.append("email", data.email);
    formData.append("password", data.password);

    const result = await login(formData);

    if (result?.error) {
      setAuthError(
        "Mot de passe ou adresse e-mail incorrecte. Si vous n'avez pas encore validé votre inscription, veuillez vérifier votre boîte mail."
      );
    } else {
      redirect("/");
    }
  };

  return (
    <div
      className="w-screen min-h-screen flex items-center text-rose-900 justify-center bg-cover bg-center"
      style={{
        backgroundImage:
          "url('https://xcwrhyjbfgzsaslstssc.supabase.co/storage/v1/object/public/storage//watermelon-woman-background.webp')",
      }}
    >
      <div className="bg-rose-50 border border-rose-900 bg-opacity-90 backdrop-blur-md rounded-2xl shadow-xl p-10 m-10 max-w-md w-full">
        <form onSubmit={handleSubmit(onSubmit)}>
          <div className="flex flex-col gap-3 mb-10">
            <h1 className="text-center font-medium text-xl">Connexion</h1>
            {authError && (
              <div className="text-sm text-red-600 bg-red-100 border border-red-400 p-3 rounded">
                {authError}
              </div>
            )}
            {/* Mail */}
            <label htmlFor="email">Adresse e-mail</label>
            <input
              {...register("email", {
                required: "L'email est requis",
                pattern: {
                  value: /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/,
                  message: "Adresse e-mail invalide",
                },
              })}
              className="appearance-none text-sm font-light border-rose-900 block w-full  border rounded py-3 px-4 leading-tight focus:outline-none focus:text-black"
              id="email"
              type="email"
              placeholder="Tapez votre adresse e-mail"
            />
            {errors.email && (
              <span className="text-red-500 text-xs">
                {errors.email.message}
              </span>
            )}
            {/* Password */}
            <label htmlFor="password">Mot de passe</label>
            <input
              {...register("password", {
                required: "Le mot de passe est requis",
              })}
              className="appearance-none text-sm font-light border-rose-900 block w-full text-rose-900 border rounded py-3 px-4 leading-tight focus:outline-none focus:text-black"
              id="password"
              type="password"
              placeholder="Tapez votre mot de passe"
            />
            {errors.password && (
              <span className="text-red-500 text-xs">
                {errors.password.message}
              </span>
            )}
            <Link
              href="/account/forgot-password"
              className="text-xs hover:underline"
            >
              Mot de passe oublié?
            </Link>
          </div>
          <div className="w-full justify-center items-center flex flex-col sm:flex-row gap-4">
            <SubmitButton
              defaultText="Se connecter"
              loadingText="Connexion..."
              isSubmitting={isSubmitting}
            />

            <div className="items-center rounded-full  hover:underline underline-offset-8 p-2">
              <Link href="/signup">Pas encore inscrit-e?</Link>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}
