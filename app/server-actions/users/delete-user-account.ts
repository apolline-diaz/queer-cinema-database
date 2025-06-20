"use server";

import { createClient } from "@/utils/supabase/server";
import { redirect } from "next/navigation";

// Action pour supprimer le compte utilisateur
export async function deleteUserAccount() {
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

    const userId = session.user.id;

    // Supprimer les données utilisateur de vos tables personnalisées
    // (ajustez selon votre schéma de base de données)

    // Exemple : supprimer le compte utilisateur
    await supabase.from("users").delete().eq("id", userId);

    // Exemple : supprimer les listes
    await supabase.from("lists_movies").delete().eq("user_id", userId);

    // Note : La suppression du compte Auth Supabase doit être faite côté admin
    // ou via RLS (Row Level Security) avec une fonction PostgreSQL
    // Pour l'instant, on peut désactiver le compte

    // Déconnecter l'utilisateur
    await supabase.auth.signOut();

    // Rediriger vers la page d'accueil
    redirect("/");
  } catch (error) {
    console.error("Erreur deleteUserAccount:", error);
    return {
      error: "Une erreur inattendue s'est produite lors de la suppression.",
    };
  }
}
