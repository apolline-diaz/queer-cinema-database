"use server";

import { prisma } from "@/lib/prisma"; // Assurez-vous que vous avez bien configuré Prisma
import { createClient } from "@/utils/supabase/server";

export async function getList(id: string) {
  const supabase = createClient();

  // Vérifier l'utilisateur authentifié avec Supabase
  const { data } = await supabase.auth.getUser();

  const userId = data?.user?.id || null;
  try {
    const list = await prisma.lists.findUnique({
      where: {
        id: parseInt(id),
      },
      include: {
        lists_movies: {
          include: {
            movies: true, // Inclure les films associés
          },
        },
      },
    });

    // Vérifier si la liste appartient bien à l'utilisateur connecté ou s'il s'agit d'une collection
    const isOwner = list?.user_id === userId;
    const isPublic = list?.is_collection === true;

    if (!isOwner && !isPublic) {
      throw new Error("Vous n'avez pas la permission d'accéder à cette liste.");
    }

    return {
      ...list,
      lists_movies: list.lists_movies || [],
    };
  } catch (error) {
    console.error("Error fetching list:", error);
    throw new Error("Could not fetch list data");
  }
}
