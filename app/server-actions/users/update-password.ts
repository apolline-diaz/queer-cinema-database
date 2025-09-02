"use server";

import { createClient } from "@/utils/supabase/server";
import { revalidatePath } from "next/cache";

export async function updatePassword(formData: FormData) {
  const supabase = createClient();

  try {
    // Vérifier la session utilisateur
    const {
      data: { session },
      error: sessionError,
    } = await supabase.auth.getSession();

    if (sessionError || !session) {
      return { error: "Session non valide. Veuillez vous reconnecter." };
    }

    const currentPassword = formData.get("current_password") as string;
    const newPassword = formData.get("new_password") as string;
    const confirmPassword = formData.get("confirm_password") as string;

    // Validation des mots de passe
    if (!currentPassword || !newPassword || !confirmPassword) {
      return { error: "Tous les champs sont requis." };
    }

    if (newPassword !== confirmPassword) {
      return { error: "Les nouveaux mots de passe ne correspondent pas." };
    }

    // Validation de complexité côté serveur
    const passwordRegex =
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*(),.?":{}|<>]).{12,}$/;

    if (!passwordRegex.test(newPassword)) {
      return {
        error:
          "Le mot de passe doit contenir au moins 12 caractères, avec une majuscule, une minuscule, un chiffre et un symbole.",
      };
    }

    // Vérifier le mot de passe actuel en tentant une connexion
    const { error: signInError } = await supabase.auth.signInWithPassword({
      email: session.user.email!,
      password: currentPassword,
    });

    if (signInError) {
      return { error: "Mot de passe actuel incorrect." };
    }

    // Mettre à jour le mot de passe
    const { error: updateError } = await supabase.auth.updateUser({
      password: newPassword,
    });

    if (updateError) {
      return { error: "Erreur lors de la mise à jour du mot de passe." };
    }

    revalidatePath("/account/settings");
    return { success: "Mot de passe mis à jour avec succès !" };
  } catch (error) {
    console.error("Erreur updatePassword:", error);
    return { error: "Une erreur inattendue s'est produite." };
  }
}
