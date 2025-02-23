"use server";

import db from "@/db";
import { movies } from "@/db/schema";
import { ilike } from "drizzle-orm";

export async function searchMoviesByTitle(title: string) {
  try {
    console.log(" Recherche de films avec le titre :", title);

    if (!title.trim()) {
      // Si pas de titre fourni, renvoyer tous les films récents
      const allMovies = await db.query.movies.findMany({
        orderBy: (movies, { desc }) => [desc(movies.createdAt)],
        // .limit(500);
      });
      console.log("Films récents récupérés :", allMovies.length);

      return allMovies;
    }

    // Recherche des films correspondant au titre

    console.log("Recherche de films correspondant à :", title);

    const results = await db
      .select({
        id: movies.id,
        title: movies.title,
        imageUrl: movies.imageUrl,
        releaseDate: movies.releaseDate,
      })
      .from(movies)
      .where(ilike(movies.title, `%${title}%`))
      .limit(100);

    console.log("Nombre de films trouvés :", results.length);

    return results;
  } catch (error) {
    console.error("Erreur lors de la recherche par titre:", error);
    return [];
  }
}
