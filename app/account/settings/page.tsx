"use client";

import { DeleteModal } from "@/app/components/delete-modal";
import { SubmitButton } from "@/app/components/submit-button";
import { useState } from "react";

export default function SettingsPage() {
  const isSubmitting = false; // à remplacer par de la logique réelle
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);

  const handleDeleteConfirm = () => {
    // Ajouter ici la logique de suppression réelle (API call, etc.)
    console.log("Compte supprimé");
  };
  return (
    <div className="px-10 py-20 text-sm w-full sm:w-1/2 text-rose-900">
      <h1 className="tracking-wide text-rose-900 text-2xl mb-10 font-medium">
        Paramètres de l&apos;utilisateur
      </h1>

      {/* Formulaire : modifier le nom */}
      <form className="mb-5 py-5">
        <h2 className="text-lg font-semibold mb-6">Modifier le nom</h2>
        <div className="mb-4">
          <label className="block font-medium mb-2">Nom complet</label>
          <input
            className="w-full text-black font-light bg-transparent border rounded-md p-2 placeholder-gray-500 border-rose-900"
            name="full_name"
            placeholder="Votre nom complet"
            defaultValue="Jean Dupont"
          />
        </div>
        <SubmitButton
          defaultText="Mettre à jour"
          loadingText="Mise à jour..."
          isSubmitting={isSubmitting}
        />
      </form>
      <hr className="my-5 border-t border-rose-200" />

      {/* Formulaire : modifier le mot de passe */}
      <form className="mb-5 py-5">
        <h2 className="text-lg font-semibold mb-6">Modifier le mot de passe</h2>
        <div className="mb-4">
          <label className="block font-medium mb-2">Mot de passe actuel</label>
          <input
            type="password"
            className="w-full text-black font-light bg-transparent border rounded-md p-2 placeholder-gray-500 border-rose-900"
            placeholder="Mot de passe actuel"
            name="current_password"
          />
        </div>
        <div className="mb-4">
          <label className="block font-medium mb-2">Nouveau mot de passe</label>
          <input
            type="password"
            className="w-full text-black font-light bg-transparent border rounded-md p-2 placeholder-gray-500 border-rose-900"
            placeholder="Nouveau mot de passe"
            name="new_password"
          />
        </div>
        <div className="mb-4">
          <label className="block font-medium mb-2">
            Confirmer le mot de passe
          </label>
          <input
            type="password"
            className="w-full text-black font-light bg-transparent border rounded-md p-2 placeholder-gray-500 border-rose-900"
            placeholder="Confirmer le nouveau mot de passe"
            name="confirm_password"
          />
        </div>
        <SubmitButton
          defaultText="Changer le mot de passe"
          loadingText="Mise à jour..."
          isSubmitting={isSubmitting}
        />
      </form>
      <hr className="my-5 border-t border-rose-200" />

      {/* Suppression du compte */}
      <form className="p-5 rounded-md bg-rose-50 border border-rose-500">
        <h2 className="text-lg font-semibold text-rose-900 mb-4">
          Supprimer le compte
        </h2>
        <p className="text-sm text-gray-600 mb-4">
          Cette action est <strong>irréversible</strong>. Toutes vos données
          seront supprimées définitivement.
        </p>
        <button
          type="button"
          onClick={() => setIsDeleteOpen(true)}
          className=" text-rose-500 border-rose-500 hover:text-white border px-4 py-2 transition-colors duration-200 ease-in-out rounded-md hover:bg-rose-500 disabled:opacity-50"
        >
          Supprimer mon compte
        </button>
      </form>
      <DeleteModal
        isOpen={isDeleteOpen}
        onClose={() => setIsDeleteOpen(false)}
        onConfirm={handleDeleteConfirm}
        title="Suppression du compte"
      />
    </div>
  );
}
