"use server";

import { prisma } from "@/lib/prisma"; // Assurez-vous que vous avez bien configuré Prisma
import { createClient } from "@/utils/supabase/server";

export async function getList(id: string) {
  const supabase = createClient();

  // Vérifier l'utilisateur authentifié avec Supabase
  const { data, error } = await supabase.auth.getUser();

  if (error || !data?.user) {
    // Rediriger l'utilisateur si non authentifié
    throw new Error("User not authenticated");
  }

  const userId = data.user.id;
  try {
    const list = await prisma.lists.findUnique({
      where: {
        id: parseInt(id), // Assurez-vous que l'ID est un nombre
      },
      include: {
        lists_movies: {
          include: {
            movies: true, // Inclure les films associés
          },
        },
      },
    });

    return list;
  } catch (error) {
    console.error("Error fetching list:", error);
    throw new Error("Could not fetch list data");
  }
}
