"use server";

import { createClient } from "@/utils/supabase/server";
import { z } from "zod";
import { prisma } from "@/lib/prisma";
import { ensureUserExists } from "@/utils/ensure-user-exist";

export interface FormState {
  type: string;
  message: string;
  id?: string | number | bigint | null; // Make it accept multiple types to be safe
  errors: {
    title?: string[];
    description?: string[];
    movie_id?: string[];
  } | null;
}

const ListSchema = z.object({
  title: z.string().min(1, "Le titre est requis"),
  description: z.string().optional(),
  movie_id: z.string().optional(),
});

export async function createList(formData: FormData) {
  // Assurez-vous que l'utilisateur existe avant de créer la liste
  const userSync = await ensureUserExists();

  if (!userSync.success) {
    return { type: "error", message: userSync.message, errors: null };
  }

  const supabase = createClient();
  const { data, error } = await supabase.auth.getUser();

  if (error || !data?.user) {
    return { type: "error", message: "You must be connected", errors: null };
  }

  const userId = data.user.id;
  const validatedFields = ListSchema.safeParse({
    title: formData.get("title"),
    description: formData.get("description"),
    movie_id: formData.get("movie_id"),
  });

  if (!validatedFields.success) {
    return {
      type: "error",
      errors: validatedFields.error.flatten().fieldErrors,
      message: "Some fields are not valid",
    };
  }

  const { title, description, movie_id } = validatedFields.data;

  try {
    const newList = await prisma.lists.create({
      data: {
        title,
        description: description || undefined,
        user_id: userId,
        lists_movies: movie_id
          ? {
              create: movie_id.split(",").map((id) => ({
                movie_id: id,
                added_at: new Date(),
              })),
            }
          : undefined,
      },
    });

    return {
      type: "success",
      message: "List created successfully",
      errors: null,
      id: String(newList.id),
    };
  } catch (err) {
    console.error("Error creating list:", err);
    return {
      type: "error",
      message: "An error happened during the list creation",
      errors: null,
    };
  }
}
