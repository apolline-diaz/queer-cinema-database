"use server";

import { createClient } from "@/lib/supabase/server";
import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";

export async function deleteList(listId: bigint) {
  const supabase = createClient();
  const { data, error } = await supabase.auth.getUser();

  if (error || !data?.user) {
    return { success: false, message: "Not connected" };
  }

  try {
    // Vérifier que l'utilisateur est propriétaire de la liste
    const list = await prisma.lists.findUnique({
      where: { id: listId },
      select: { user_id: true },
    });

    if (!list) {
      return { success: false, message: "Unfound list" };
    }

    if (list.user_id !== data.user.id) {
      return {
        success: false,
        message: "Not allowed to delete this list",
      };
    }

    // Supprimer d'abord les relations lists_movies
    await prisma.lists_movies.deleteMany({
      where: { list_id: listId },
    });

    // Puis supprimer la liste
    await prisma.lists.delete({
      where: { id: listId },
    });

    // Revalider le chemin pour mettre à jour l'UI
    revalidatePath("/lists");

    return { success: true, message: "List deleted with success" };
  } catch (err) {
    console.error("Error when list delete:", err);
    return {
      success: false,
      message: "An error happened when delete",
    };
  }
}
