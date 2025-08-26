"use client";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { SubmitButton } from "@/app/components/submit-button";

interface ContactFormData {
  name: string;
  email: string;
  message: string;
}

export default function ContactForm() {
  const [status, setStatus] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm({
    defaultValues: {
      name: "",
      email: "",
      message: "",
    },
  });

  const onSubmit = async (data: ContactFormData) => {
    setIsSubmitting(true);

    try {
      const response = await fetch("/api/contact", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      });

      if (response.ok) {
        setStatus("success");
        reset(); // reset form after sending
      } else {
        setStatus("error");
      }
    } catch (error) {
      console.error("Erreur lors de l'envoi:", error);
      setStatus("error");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="px-10 py-20">
      <h2 className="text-2xl text-rose-500 font-bold mb-4">Contact</h2>
      <p className="text-sm text-black font-light mb-4 italic">
        Des suggestions de films ou séries, des corrections à indiquer ou toute
        autre question concernant le site... N&apos;hésitez pas à nous
        contacter.
      </p>
      <div className="sm:w-1/2 w-full">
        {status === "success" && (
          <div className="mb-4 py-3 text-rose-800 font-light">
            Votre message a été envoyé avec succès!
          </div>
        )}

        {status === "error" && (
          <div className="mb-4 p-3 bg-rose-50 text-red-700 rounded">
            Une erreur est survenue. Veuillez réessayer plus tard.
          </div>
        )}

        <form onSubmit={handleSubmit(onSubmit)} className="text-rose-900">
          <div className=" mb-4">
            <label htmlFor="name" className="block font-medium mb-2">
              Nom
            </label>
            <input
              id="name"
              className={`w-full px-3 py-2 border font-light bg-white border-rose-900 text-black rounded-md ${
                errors.name ? "border-red-500" : "border-gray-300"
              }`}
              {...register("name", { required: "Le nom est requis" })}
            />
            {errors.name && (
              <p className="mt-1 text-red-500 text-sm">{errors.name.message}</p>
            )}
          </div>

          <div className="mb-4">
            <label htmlFor="email" className="block font-medium mb-2">
              Email
            </label>
            <input
              id="email"
              className={`w-full px-3 py-2 border font-light bg-white border-rose-900 text-black rounded-md ${
                errors.email ? "border-red-500" : "border-gray-300"
              }`}
              {...register("email", {
                required: "L'email est requis",
                pattern: {
                  value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                  message: "Adresse email invalide",
                },
              })}
            />
            {errors.email && (
              <p className="mt-1 text-red-500 text-sm">
                {errors.email.message}
              </p>
            )}
          </div>

          <div className="mb-4">
            <label htmlFor="message" className="block font-medium mb-2">
              Message
            </label>
            <textarea
              id="message"
              className={`w-full px-3 text-black border-rose-900 font-light  py-2 border rounded-md ${
                errors.message ? "border-red-500" : "border-gray-300"
              }`}
              rows={4}
              {...register("message", { required: "Le message est requis" })}
            ></textarea>
            {errors.message && (
              <p className="mt-1 text-red-500 text-sm">
                {errors.message.message}
              </p>
            )}
          </div>

          <SubmitButton
            defaultText="Envoyer"
            loadingText="Envoi en cours..."
            isSubmitting={isSubmitting}
          />
        </form>
      </div>
    </div>
  );
}
