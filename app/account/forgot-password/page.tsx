"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import Link from "next/link";
import { SubmitButton } from "../../components/submit-button";
import { supabase } from "@/utils/supabase/client";

interface ForgotPasswordFormInputs {
  email: string;
}

export default function ForgotPasswordPage() {
  const [isEmailSent, setIsEmailSent] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<ForgotPasswordFormInputs>();

  const onSubmit = async (data: ForgotPasswordFormInputs) => {
    try {
      setError(null);
      const { error: resetError } = await supabase.auth.resetPasswordForEmail(
        data.email,
        {
          redirectTo: `${window.location.origin}/account/reset-password`,
        }
      );

      if (resetError) {
        setError(resetError.message);
        return;
      }

      // Afficher le message de succès même si l'email n'existe pas
      // (pour éviter les attaques par énumération)
      setIsEmailSent(true);
    } catch (err: any) {
      console.error("Erreur:", err);
      setError(err.message || "Une erreur s'est produite. Veuillez réessayer.");
    }
  };

  return (
    <div
      className="w-screen min-h-screen flex items-center text-rose-500 justify-center bg-cover bg-center"
      style={{
        backgroundImage:
          "url('https://xcwrhyjbfgzsaslstssc.supabase.co/storage/v1/object/public/storage//watermelon-woman-background.webp')",
      }}
    >
      <div className="bg-red-100 border border-rose-500 bg-opacity-90 backdrop-blur-md rounded-2xl shadow-xl p-10 m-10 max-w-md w-full">
        {isEmailSent ? (
          <div className="flex flex-col gap-3">
            <h1 className="text-center font-medium text-xl">Email envoyé</h1>
            <p className="text-center font-light text-black">
              Si un compte existe avec cette adresse email, un lien de
              réinitialisation vous a été envoyé. <br />
              Veuillez vérifier votre boîte de réception et suivre les
              instructions.
            </p>
            <div className="mt-6 w-full justify-center items-center flex">
              <Link
                href="/login"
                className="rounded-md border px-6 py-2 border-rose-500 hover:bg-rose-500 hover:text-white transition-colors"
              >
                Retour à la connexion
              </Link>
            </div>
          </div>
        ) : (
          <form onSubmit={handleSubmit(onSubmit)}>
            <div className="flex flex-col gap-3 mb-10">
              <h1 className="text-center font-medium text-xl">
                Mot de passe oublié
              </h1>
              <p className="text-sm text-black font-light text-center mb-4">
                Entrez votre adresse e-mail et nous vous enverrons un lien pour
                réinitialiser votre mot de passe.
              </p>

              {error && (
                <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-2">
                  {error}
                </div>
              )}

              {/* Email */}
              <label htmlFor="email">Adresse e-mail</label>
              <input
                {...register("email", {
                  required: "L'email est requis",
                  pattern: {
                    value: /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/,
                    message: "Adresse e-mail invalide",
                  },
                })}
                className="appearance-none text-sm font-light border-rose-500 block w-full border rounded py-3 px-4 leading-tight focus:outline-none focus:text-black"
                id="email"
                type="email"
                placeholder="Tapez votre adresse e-mail"
              />
              {errors.email && (
                <span className="text-red-500 text-xs">
                  {errors.email.message}
                </span>
              )}
            </div>
            <div className="w-full justify-center items-center flex flex-col sm:flex-row gap-4">
              <SubmitButton
                defaultText="Envoyer le lien"
                loadingText="Envoi en cours..."
                isSubmitting={isSubmitting}
              />

              <div className="justify-center flex items-center w-full hover:underline underline-offset-8 p-2">
                <Link href="/login">Retour à la connexion</Link>
              </div>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}
