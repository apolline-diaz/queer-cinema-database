"use server";

import { createClient } from "@/utils/supabase/server";
import { prisma } from "@/lib/prisma";

export async function ensureUserExists() {
  const supabase = createClient();
  const { data, error } = await supabase.auth.getUser();

  if (error || !data?.user) {
    return { success: false, message: "User not authenticated" };
  }

  try {
    // Tente de créer l'utilisateur, ignorera silencieusement s'il existe déjà
    await prisma.users.upsert({
      where: { id: data.user.id },
      update: {}, // Ne met à jour aucun champ existant
      create: {
        id: data.user.id,
        email: data.user.email!,
        created_at: new Date(),
        // Ajoutez d'autres champs par défaut si nécessaire
        // Par exemple :
        // name: data.user.user_metadata?.name,
        // createdAt: new Date()
      },
    });

    return { success: true, message: "User synchronized" };
  } catch (err) {
    console.error("Errror when user synchronization:", err);
    return { success: false, message: "Erreur of synchronzsation" };
  }
}
