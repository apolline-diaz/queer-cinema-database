"use client";

import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { useRouter } from "next/navigation";
import { SubmitButton } from "../../components/submit-button";
import { supabase } from "@/utils/supabase/client";

interface ResetPasswordFormInputs {
  password: string;
  confirmPassword: string;
}

export default function ResetPasswordPage() {
  const [isResetComplete, setIsResetComplete] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();

  // Vérifier si l'utilisateur est authentifié avec un accès de récupération
  useEffect(() => {
    const checkSession = async () => {
      setIsLoading(true);
      const { data } = await supabase.auth.getSession();

      // Si l'utilisateur n'a pas de session ou n'est pas dans un flux de récupération,
      // on pourrait ajouter une vérification supplémentaire ici
      setIsLoading(false);
    };

    checkSession();
  }, []);

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors, isSubmitting },
  } = useForm<ResetPasswordFormInputs>();

  const onSubmit = async (data: ResetPasswordFormInputs) => {
    try {
      setError(null);
      const { error: updateError } = await supabase.auth.updateUser({
        password: data.password,
      });

      if (updateError) {
        setError(updateError.message);
        return;
      }

      // Afficher le message de succès
      setIsResetComplete(true);

      // Rediriger vers la page de connexion après 3 secondes
      setTimeout(() => {
        router.push("/login");
      }, 3000);
    } catch (err: any) {
      console.error("Erreur:", err);
      setError(
        err.message ||
          "Une erreur s'est produite lors de la réinitialisation du mot de passe."
      );
    }
  };

  const password = watch("password", "");

  if (isLoading) {
    return (
      <div
        className="w-screen min-h-screen flex items-center text-rose-500 justify-center bg-cover bg-center"
        style={{
          backgroundImage:
            "url('https://xcwrhyjbfgzsaslstssc.supabase.co/storage/v1/object/public/storage//watermelon-woman-background.webp')",
        }}
      >
        <div className="bg-red-100 border border-rose-500 bg-opacity-90 backdrop-blur-md rounded-2xl shadow-xl p-10 m-10 max-w-md w-full">
          <div className="flex justify-center">
            <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-rose-500"></div>
          </div>
          <p className="text-center mt-4">Chargement...</p>
        </div>
      </div>
    );
  }

  return (
    <div
      className="w-screen min-h-screen flex items-center text-rose-500 justify-center bg-cover bg-center"
      style={{
        backgroundImage:
          "url('https://xcwrhyjbfgzsaslstssc.supabase.co/storage/v1/object/public/storage//watermelon-woman-background.webp')",
      }}
    >
      <div className="bg-red-100 border border-rose-500 bg-opacity-90 backdrop-blur-md rounded-2xl shadow-xl p-10 m-10 max-w-md w-full">
        {isResetComplete ? (
          <div className="flex flex-col gap-3">
            <h1 className="text-center font-medium text-xl">
              Mot de passe modifié
            </h1>
            <p className="text-center text-black ">
              Votre mot de passe a été réinitialisé avec succès. Vous allez être
              redirigé vers la page de connexion.
            </p>
          </div>
        ) : (
          <form onSubmit={handleSubmit(onSubmit)}>
            <div className="flex flex-col gap-3 mb-10">
              <h1 className="text-center font-medium text-xl">
                Réinitialiser votre mot de passe
              </h1>
              <p className="text-sm font-light text-black text-center mb-4">
                Veuillez créer un nouveau mot de passe pour votre compte.
              </p>

              {error && (
                <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
                  {error}
                </div>
              )}

              {/* Nouveau mot de passe */}
              <label htmlFor="password">Nouveau mot de passe</label>
              <input
                {...register("password", {
                  required: "Le mot de passe est requis",
                  minLength: {
                    value: 8,
                    message:
                      "Le mot de passe doit contenir au moins 8 caractères",
                  },
                })}
                className="appearance-none text-sm font-light border-rose-500 block w-full border rounded py-3 px-4 leading-tight focus:outline-none focus:text-black"
                id="password"
                type="password"
                placeholder="Tapez votre nouveau mot de passe"
              />
              {errors.password && (
                <span className="text-red-500 text-xs">
                  {errors.password.message}
                </span>
              )}

              {/* Confirmation du mot de passe */}
              <label htmlFor="confirmPassword">Confirmer le mot de passe</label>
              <input
                {...register("confirmPassword", {
                  required: "Veuillez confirmer votre mot de passe",
                  validate: (value) =>
                    value === password ||
                    "Les mots de passe ne correspondent pas",
                })}
                className="appearance-none text-sm font-light border-rose-500 block w-full border rounded py-3 px-4 leading-tight focus:outline-none focus:text-black"
                id="confirmPassword"
                type="password"
                placeholder="Confirmez votre nouveau mot de passe"
              />
              {errors.confirmPassword && (
                <span className="text-red-500 text-xs">
                  {errors.confirmPassword.message}
                </span>
              )}
            </div>
            <div className="w-full justify-center items-center flex">
              <SubmitButton
                defaultText="Réinitialiser le mot de passe"
                loadingText="Réinitialisation..."
                isSubmitting={isSubmitting}
              />
            </div>
          </form>
        )}
      </div>
    </div>
  );
}
