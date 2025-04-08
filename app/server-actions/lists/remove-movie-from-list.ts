"use server";

import { prisma } from "@/lib/prisma";
import { createClient } from "@/utils/supabase/server";

export async function removeMovieFromList(listId: string, movieId: string) {
  const supabase = createClient();
  const { data, error } = await supabase.auth.getUser();

  if (error || !data?.user) {
    throw new Error("User not authenticated");
  }

  const userId = data.user.id;

  // Vérifier si la liste appartient bien à l'utilisateur
  const list = await prisma.lists.findFirst({
    where: {
      id: BigInt(listId),
      user_id: userId,
    },
  });

  if (!list) {
    throw new Error("List not found or not allowed");
  }

  // Supprimer le film de la liste
  await prisma.lists_movies.deleteMany({
    where: {
      list_id: BigInt(listId),
      movie_id: movieId,
    },
  });

  return { success: true };
}
