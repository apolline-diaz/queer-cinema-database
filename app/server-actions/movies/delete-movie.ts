"use server";

import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";
import { isAdmin } from "@/utils/is-user-admin";

export async function deleteMovie(movieId: string) {
  const userIsAdmin = await isAdmin();

  if (!userIsAdmin) {
    return {
      type: "error",
      message: "You must be admin to update a movie",
      errors: null,
    };
  }
  try {
    // Vérifier si le film existe
    const movie = await prisma.movies.findUnique({
      where: { id: movieId },
    });

    if (!movie) {
      return { success: false, message: "Le film n'existe pas." };
    }

    // Supprimer les dépendances liées au film
    await prisma.movie_countries.deleteMany({ where: { movie_id: movieId } });
    await prisma.movie_directors.deleteMany({ where: { movie_id: movieId } });
    await prisma.movie_genres.deleteMany({ where: { movie_id: movieId } });
    await prisma.movie_keywords.deleteMany({ where: { movie_id: movieId } });

    // Supprimer le film
    await prisma.movies.delete({ where: { id: movieId } });

    // Rafraîchir la page
    revalidatePath("/");

    return { success: true, message: "Film supprimé avec succès." };
  } catch (err) {
    console.error("Erreur lors de la suppression du film:", err);
    return {
      success: false,
      message: "Erreur interne lors de la suppression du film.",
    };
  }
}
