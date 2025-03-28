"use server";

import { createClient } from "@/utils/supabase/server";
import { redirect } from "next/navigation";
import { z } from "zod";
import { prisma } from "@/lib/prisma";
import { ensureUserExists } from "@/utils/ensure-user-exist";

export interface FormState {
  type: string; // Le type de la réponse (erreur ou succès).
  message: string; // Le message à afficher à l'utilisateur.
  errors: {
    // Les erreurs de validation (s'il y en a)
    title?: string[];
    description?: string[];
    movie_id?: string[];
  } | null;
}

// Création d'un schéma de validation des données avec Zod.
const ListSchema = z.object({
  title: z.string().min(1, "Le titre est requis"),
  description: z.string().optional(),
  movie_id: z.string().optional(),
});

// Fonction principale pour créer une nouvelle liste.
export async function createList(prevState: FormState, formData: FormData) {
  // Assurez-vous que l'utilisateur existe avant de créer la liste
  // (user présent dans la table users avec un user_id)
  const userSync = await ensureUserExists();

  if (!userSync.success) {
    return { type: "error", message: userSync.message, errors: null };
  }

  const supabase = createClient();
  const { data, error } = await supabase.auth.getUser();

  // Si une erreur survient ou si l'utilisateur n'est pas connecté, retourne une erreur.
  if (error || !data?.user) {
    return { type: "error", message: "You must be connected", errors: null };
  }

  // Récupère l'ID de l'utilisateur connecté.
  const userId = data.user.id;

  // Valide les données du formulaire à l'aide du schéma défini plus tôt
  const validatedFields = ListSchema.safeParse({
    title: formData.get("title"),
    description: formData.get("description"),
    movie_id: formData.get("movie_id"),
  });

  // Si la validation échoue, retourne les erreurs.
  if (!validatedFields.success) {
    return {
      type: "error",
      errors: validatedFields.error.flatten().fieldErrors, // Récupère et affiche les erreurs de validation.
      message: "Some fields are not valid",
    };
  }

  // Récupère les données validées pour les utiliser dans la création de la liste.
  const { title, description, movie_id } = validatedFields.data;

  // Crée une nouvelle liste dans la base de données avec Prisma.
  try {
    const newList = await prisma.lists.create({
      data: {
        title,
        description: description || undefined, // La description de la liste, ou "undefined" si elle n'est pas fournie.
        user_id: userId,
        lists_movies: movie_id
          ? {
              create: movie_id.split(",").map((id) => ({
                // Si "movie_id" est fourni, on crée des entrées pour chaque film.
                movie_id: id, // ID du film
                added_at: new Date(), // Date d'ajout du film à la liste.
              })),
            }
          : undefined, // Si aucun film n'est spécifié, cette section est ignorée.
      },
    });
    // Redirige l'utilisateur vers la page de la nouvelle liste créée.
    redirect(`/lists/${newList.id}`);
  } catch (err) {
    // Si une erreur survient lors de la création de la liste, affiche un message d'erreur.
    console.error("Error creating list:", err); // Affiche l'erreur dans la console.
    return {
      type: "error",
      message: "An error happened during the list creation",
      errors: null, // Pas d'erreurs spécifiques dans ce cas.
    };
  }
}
