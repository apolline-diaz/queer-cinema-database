"use server";

import { prisma } from "@/lib/prisma";
import { createClient } from "@/utils/supabase/server";

export async function checkMovieInLists(movieId: string): Promise<string[]> {
  const supabase = createClient();
  const { data, error } = await supabase.auth.getUser();

  if (error || !data?.user) {
    return [];
  }

  const userId = data.user.id;

  // Récupérer les IDs des listes contenant ce film pour cet utilisateur
  const listMovies = await prisma.lists_movies.findMany({
    where: {
      movie_id: movieId,
      lists: {
        user_id: userId,
      },
    },
    select: {
      list_id: true,
    },
  });

  // Retourner les IDs des listes sous forme de strings
  return listMovies.map((item) => item.list_id.toString());
}
