"use client";

import Link from "next/link";
import { login } from "./actions";
import { useForm } from "react-hook-form";
import { SubmitButton } from "../components/submit-button";
import { useEffect, useState } from "react";
import { redirect, useRouter, useSearchParams } from "next/navigation";
import { PasswordInput } from "../components/password-input";
import { useToast, useAuthToasts } from "@/app/components/toast";

interface LoginFormInputs {
  email: string;
  password: string;
}

export default function LoginPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [authError, setAuthError] = useState<string | null>(null);

  // Hooks pour les toasts
  const { loginSuccess, emailConfirmed, loginError } = useAuthToasts();
  const { error: showErrorToast } = useToast();

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<LoginFormInputs>();

  // Gérer les paramètres URL pour les confirmations d'email
  useEffect(() => {
    const confirmed = searchParams.get("confirmed");
    const error = searchParams.get("error");
    const message = searchParams.get("message");

    if (confirmed === "true") {
      emailConfirmed();
      // Nettoyer l'URL après avoir affiché le toast
      const url = new URL(window.location.href);
      url.searchParams.delete("confirmed");
      window.history.replaceState({}, "", url.toString());
    }

    if (error) {
      const errorMessage =
        message || "Erreur lors de la confirmation de l'email";
      showErrorToast(errorMessage, "Erreur");
      // Nettoyer l'URL
      const url = new URL(window.location.href);
      url.searchParams.delete("error");
      url.searchParams.delete("message");
      window.history.replaceState({}, "", url.toString());
    }
  }, [searchParams, emailConfirmed, showErrorToast]);

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
      loginSuccess();
      // Petite pause pour laisser le toast s'afficher avant la redirection
      setTimeout(() => {
        router.push("/");
      }, 500);
    }
  };

  return (
    <div className="w-screen min-h-screen flex items-center text-black justify-center bg-cover bg-center">
      <div className="p-10 m-10 max-w-md w-full">
        <form onSubmit={handleSubmit(onSubmit)} data-testid="login-form">
          <div className="flex flex-col gap-3 mb-10">
            <h1 className="text-center font-bold text-pink-500 text-xl">
              Connexion
            </h1>
            {authError && (
              <div
                className="text-sm text-red-600 bg-red-100 border border-red-400 p-3 rounded"
                data-testid="auth-error"
              >
                {authError}
              </div>
            )}
            {/* Mail */}
            <label htmlFor="email" className="text-sm">
              Adresse e-mail
            </label>
            <input
              {...register("email", {
                required: "L'email est requis",
                pattern: {
                  value: /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/,
                  message: "Adresse e-mail invalide",
                },
              })}
              className="appearance-none text-sm font-light border-black block w-full  border rounded py-3 px-4 leading-tight focus:outline-none focus:text-black"
              id="email"
              type="email"
              placeholder="Tapez votre adresse e-mail"
              data-testid="email-input"
            />
            {errors.email && (
              <span className="text-red-500 text-xs">
                {errors.email.message}
              </span>
            )}
            {/* Password */}
            <PasswordInput
              label="Mot de passe"
              placeholder="Tapez votre mot de passe"
              {...register("password", {
                required: "Le mot de passe est requis",
              })}
              error={errors.password?.message}
              data-testid="password-input"
            />
            <Link
              href="/account/forgot-password"
              className="text-xs hover:underline"
              data-testid="forgot-password-link"
            >
              Mot de passe oublié?{" "}
              <span className="italic text-gray-500">
                (Actuellement indisponible)
              </span>
            </Link>
          </div>
          <div className="w-full justify-center items-center flex flex-col sm:flex-row gap-4">
            <SubmitButton
              defaultText="Se connecter"
              loadingText="Connexion..."
              isSubmitting={isSubmitting}
              data-testid="login-submit-button"
            />

            <div className="items-center rounded-full  hover:underline underline-offset-8 p-2">
              <Link href="/signup" data-testid="signup-link">
                Pas encore inscrit-e?
              </Link>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}
