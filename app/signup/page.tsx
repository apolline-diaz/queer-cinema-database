"use client";

import Link from "next/link";
import { signup } from "../login/actions";
import { useForm } from "react-hook-form";
import { SubmitButton } from "../components/submit-button";
import { useState } from "react";

interface SignUpFormInputs {
  email: string;
  password: string;
}
export default function SignUpPage() {
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<SignUpFormInputs>();

  const [confirmationMessage, setConfirmationMessage] = useState("");

  const onSubmit = async (data: SignUpFormInputs) => {
    const formData = new FormData();
    formData.append("email", data.email);
    formData.append("password", data.password);

    try {
      await signup(formData);
      setConfirmationMessage(
        "Un mail de confirmation a été envoyé dans votre boîte mail."
      );
    } catch (error) {
      console.error("Erreur lors de l'inscription :", error);
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
            <h1 className="text-center font-medium text-xl">Inscription</h1>
            {confirmationMessage && (
              <p className="font-light text-sm text-black mt-2">
                {confirmationMessage}
              </p>
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
          </div>

          <div className="w-full justify-center items-center flex flex-col sm:flex-row gap-4">
            <SubmitButton
              defaultText="S'inscrire"
              loadingText="En cours d'envoi..."
              isSubmitting={isSubmitting}
            />
            <div className="rounded-full  hover:underline underline-offset-8 p-2 ">
              <Link href="/login">Déjà inscrit-e?</Link>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}
