"use client";

import Link from "next/link";
import { login } from "./actions";
import { useForm } from "react-hook-form";
import { SubmitButton } from "../components/submit-button";
import { useState } from "react";
import { redirect, useRouter } from "next/navigation";
import { PasswordInput } from "../components/password-input";

interface LoginFormInputs {
  email: string;
  password: string;
}

export default function LoginPage() {
  const router = useRouter();

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
      router.push("/");
    }
  };

  return (
    <div className="w-screen min-h-screen flex items-center text-black justify-center bg-cover bg-center">
      <div className="p-10 m-10 max-w-md w-full">
        <form onSubmit={handleSubmit(onSubmit)} data-testid="login-form">
          <div className="flex flex-col gap-3 mb-10">
            <h1 className="text-center font-bold text-rose-500 text-xl">
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
