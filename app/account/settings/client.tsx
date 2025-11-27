"use client";

import { DeleteUserModal } from "./delete-user-modal";
import { SubmitButton } from "@/app/components/submit-button";
import { updateUserName } from "@/app/server-actions/users/update-user-name";
import { updatePassword } from "@/app/server-actions/users/update-password";
import { deleteUserAccountWithoutAuth } from "@/app/server-actions/users/delete-user-account";
import { useState, useTransition } from "react";
import { PasswordInput } from "@/app/components/password-input";

type User = {
  id: string;
  email: string;
  full_name: string;
};

export default function SettingsClientPage({ user }: { user: User }) {
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);
  const [message, setMessage] = useState<{
    type: "success" | "error";
    text: string;
  } | null>(null);

  const [isUpdatingName, startNameTransition] = useTransition();
  const [isUpdatingPassword, startPasswordTransition] = useTransition();
  const [nameError, setNameError] = useState<string | null>(null);
  const [passwordError, setPasswordError] = useState<string | null>(null);
  const [newPasswordError, setNewPasswordError] = useState<string | null>(null);

  // Fonction de validation du mot de passe
  const validatePassword = (password: string): string | null => {
    const passwordRegex =
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*(),.?":{}|<>]).{12,}$/;

    if (!passwordRegex.test(password)) {
      return "Le mot de passe ne remplit pas tous les critères.";
    }

    return null;
  };

  const handleNameUpdate = async (formData: FormData) => {
    const fullName = (formData.get("full_name") as string) || "";

    // Validation côté client
    if (fullName.trim().length < 5) {
      setNameError("Le nom doit contenir au moins 5 caractères.");
      return; // on arrête ici sans envoyer la requête
    } else {
      setNameError(null);
    }

    startNameTransition(async () => {
      const result = await updateUserName(formData);
      if (result.error) {
        setMessage({ type: "error", text: result.error });
      } else if (result.success) {
        setMessage({ type: "success", text: result.success });
      }
    });
  };

  const handlePasswordUpdate = async (formData: FormData) => {
    const newPassword = (formData.get("new_password") as string) || "";
    const confirmPassword = (formData.get("confirm_password") as string) || "";

    // Validation de la complexité du nouveau mot de passe
    const passwordValidationError = validatePassword(newPassword);
    if (passwordValidationError) {
      setNewPasswordError(passwordValidationError);
      return;
    } else {
      setNewPasswordError(null);
    }

    // Validation côté client pour vérifier si les mots de passe correspondent
    if (newPassword !== confirmPassword) {
      setPasswordError("Les mots de passe ne correspondent pas.");
      return; // stop la soumission
    } else {
      setPasswordError(null);
    }

    startPasswordTransition(async () => {
      const result = await updatePassword(formData);
      if (result.error) {
        setMessage({ type: "error", text: result.error });
      } else if (result.success) {
        setMessage({ type: "success", text: result.success });
        // reset formulaire
        const form = document.getElementById(
          "password-form"
        ) as HTMLFormElement;
        form?.reset();
        // Reset aussi les erreurs
        setNewPasswordError(null);
        setPasswordError(null);
      }
    });
  };

  // Fonction pour valider en temps réel le nouveau mot de passe
  const handleNewPasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const password = e.target.value;
    if (password) {
      const error = validatePassword(password);
      setNewPasswordError(error);
    } else {
      setNewPasswordError(null);
    }
  };

  const handleDeleteConfirm = async () => {
    try {
      await deleteUserAccountWithoutAuth();
    } catch (error) {
      setMessage({
        type: "error",
        text: "Erreur lors de la suppression du compte",
      });
    }
  };

  return (
    <div className="px-10 py-20 text-sm w-full sm:w-1/2 text-black">
      <h1 className="tracking-wide text-black text-2xl mb-5 font-medium">
        {user.full_name}
      </h1>

      {/* Formulaire : modifier le nom */}
      <form action={handleNameUpdate} className="mb-5 py-5">
        <h2 className="text-lg font-semibold mb-6">Modifier le nom</h2>
        <div className="mb-4">
          <label className="block font-medium mb-2">Nom complet</label>
          <input
            className={`w-full text-black font-light bg-transparent border rounded-md p-2 placeholder-gray-500 border-black ${
              nameError ? "border-red-500" : ""
            }`}
            name="full_name"
            placeholder="Votre nom ou pseudo"
          />
          {nameError && (
            <p className="text-pink-500 text-sm my-2">{nameError}</p>
          )}
        </div>
        <SubmitButton
          defaultText="Mettre à jour"
          loadingText="Mise à jour..."
          isSubmitting={isUpdatingName}
        />
      </form>
      <hr className="my-5 border-t border-pink-200" />

      {/* Formulaire : modifier le mot de passe */}
      <form
        action={handlePasswordUpdate}
        id="password-form"
        className="mb-5 py-5"
      >
        <h2 className="text-lg font-semibold mb-6">Modifier le mot de passe</h2>
        <div className="mb-4">
          <PasswordInput
            name="current_password"
            label="Mot de passe actuel"
            placeholder="Mot de passe actuel"
          />
        </div>
        <div className="mb-4">
          <PasswordInput
            name="new_password"
            label="Nouveau mot de passe"
            placeholder="Nouveau mot de passe"
            className={newPasswordError ? "border-red-500" : ""}
            onChange={handleNewPasswordChange}
          />
          {newPasswordError && (
            <p className="text-pink-500 text-sm my-2">{newPasswordError}</p>
          )}
          {/* Message d'aide toujours visible */}
          <p className="text-gray-500 text-xs mt-2">
            Le mot de passe doit contenir au moins 12 caractères, avec une
            majuscule, une minuscule, un chiffre et un symbole.
          </p>
        </div>
        <div className="mb-4">
          <PasswordInput
            name="confirm_password"
            label="Confirmer le mot de passe"
            placeholder="Confirmer le mot de passe"
            className={passwordError ? "border-red-500" : ""}
          />
          {passwordError && (
            <p className="text-pink-500 text-sm my-2">{passwordError}</p>
          )}
        </div>
        <SubmitButton
          defaultText="Changer le mot de passe"
          loadingText="Mise à jour..."
          isSubmitting={isUpdatingPassword}
        />
      </form>
      <hr className="my-5 border-t border-pink-200" />

      {/* Suppression du compte */}
      <form className="p-5 rounded-md bg-pink-50 border border-pink-500">
        <h2 className="text-lg font-semibold text-black mb-4">
          Désactiver le compte
        </h2>
        <p className="text-sm text-gray-600 mb-4">
          Cette action est <strong>irréversible</strong>. Toutes vos données
          seront supprimées définitivement.
        </p>
        <button
          type="button"
          onClick={() => setIsDeleteOpen(true)}
          className=" text-pink-500 border-pink-500 hover:text-white border px-4 py-2 transition-colors duration-200 ease-in-out rounded-md hover:bg-pink-500 disabled:opacity-50"
        >
          Désactiver mon compte
        </button>
      </form>
      <DeleteUserModal
        isOpen={isDeleteOpen}
        onClose={() => setIsDeleteOpen(false)}
        onConfirm={handleDeleteConfirm}
        title="Désactivation du compte"
      />
    </div>
  );
}
