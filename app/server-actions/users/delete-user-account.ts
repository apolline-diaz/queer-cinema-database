"use server";

import { prisma } from "@/lib/prisma";
import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";

export async function deleteUserAccountWithoutAuth() {
  const supabase = createClient();

  try {
    const {
      data: { session },
      error: sessionError,
    } = await supabase.auth.getSession();

    if (sessionError || !session) {
      return { error: "Session non valide. Veuillez vous reconnecter." };
    }

    const userId = session.user.id;

    // Delete movies from user lists
    await prisma.lists_movies.deleteMany({
      where: {
        list_id: {
          in: await prisma.lists
            .findMany({
              where: { user_id: userId },
              select: { id: true },
            })
            .then((lists) => lists.map((list) => list.id)),
        },
      },
    });

    // Delete user lists
    await prisma.lists.deleteMany({
      where: { user_id: userId },
    });

    // Delete user
    await prisma.users.delete({
      where: { id: userId },
    });

    await supabase.auth.signOut();
    return { success: true };
  } catch (error) {
    console.error("Erreur deleteUserAccountWithoutAuth:", error);
    return {
      error: "Une erreur inattendue s'est produite lors de la suppression.",
    };
  }
}
