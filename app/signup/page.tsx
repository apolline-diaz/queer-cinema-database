"use client";

import Link from "next/link";
import { signup } from "../login/actions";
import { useForm } from "react-hook-form";
import { SubmitButton } from "../components/submit-button";
import { useState } from "react";
import { PasswordInput } from "../components/password-input";

interface SignUpFormInputs {
  email: string;
  password: string;
  confirmPassword: string;
}

export default function SignUpPage() {
  const {
    register,
    handleSubmit,
    watch,
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

  const password = watch("password");

  return (
    <div className="w-screen min-h-screen flex items-center text-black justify-center bg-cover bg-center">
      <div className="bg-white border border-rose-500 backdrop-blur-md rounded-2xl shadow-xl p-10 m-10 max-w-md w-full">
        <form onSubmit={handleSubmit(onSubmit)}>
          <div className="flex flex-col gap-3 mb-10">
            <h1 className="text-center font-bold text-red-500 text-xl">
              Inscription
            </h1>
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
              className="appearance-none text-sm font-light border-black block w-full  border rounded py-3 px-4 leading-tight focus:outline-none focus:text-black"
              id="email"
              type="email"
              placeholder="Tapez votre adresse e-mail"
            />
            {errors.email && (
              <span className="text-rose-500 text-xs">
                {errors.email.message}
              </span>
            )}
            <p className="text-xs italic font-light border border-orange-400 text-orange-600 bg-yellow-50 p-2 rounded mb-3">
              La fonctionnalité{" "}
              <span className="font-medium">Mot de passe oublié</span>{" "}
              n&apos;est pas disponible. Veuillez bien noter votre mot de passe.
              Vous pourrez également le modifier dans vos paramètres, une fois
              inscrit-e.
            </p>
            {/* Password */}
            <PasswordInput
              label="Mot de passe"
              {...register("password", {
                required: "Le mot de passe est requis",
                pattern: {
                  value:
                    /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*(),.?":{}|<>]).{12,}$/,
                  message:
                    "Le mot de passe doit contenir au moins 12 caractères, avec une majuscule, une minuscule, un chiffre et un symbole",
                },
              })}
              error={errors.password?.message}
            />

            {/* Confirm Password */}
            <PasswordInput
              label="Confirmer le mot de passe"
              {...register("confirmPassword", {
                required: "Veuillez confirmer votre mot de passe",
                validate: (value) =>
                  value === password ||
                  "Les mots de passe ne correspondent pas",
              })}
              error={errors.confirmPassword?.message}
            />
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
