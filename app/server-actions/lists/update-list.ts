"use server";

import { prisma } from "@/lib/prisma";
import { createClient } from "@/utils/supabase/server";
import { z } from "zod";
import { redirect } from "next/navigation";

// Validation Schema
const ListUpdateSchema = z.object({
  title: z.string().min(1, "Le titre est requis"),
  description: z.string().optional(),
  movie_id: z.string().optional(),
  is_collection: z.string(),
});

export async function updateList(id: string, formData: FormData) {
  // Create Supabase client
  const supabase = createClient();

  // Authenticate user
  const { data, error } = await supabase.auth.getUser();

  if (error || !data?.user) {
    redirect("/login");
  }

  const userId = data.user.id;

  // Validate form data
  const validatedFields = ListUpdateSchema.safeParse({
    title: formData.get("title"),
    description: formData.get("description"),
    movie_id: formData.get("movie_id"),
  });

  if (!validatedFields.success) {
    return {
      type: "error",
      message: "Some fields are not valid",
      errors: validatedFields.error.flatten().fieldErrors,
    };
  }

  const { title, description, movie_id, is_collection } = validatedFields.data;

  try {
    // Convert id to BigInt and ensure list belongs to user
    const listId = BigInt(id);

    // First, verify the list belongs to the user
    const existingList = await prisma.lists.findUnique({
      where: {
        id: listId,
        user_id: userId,
      },
    });

    if (!existingList) {
      return {
        type: "error",
        message: "Liste non trouvée ou autorisation insuffisante",
      };
    }

    // Perform the update
    const updatedList = await prisma.lists.update({
      where: {
        id: listId,
        user_id: userId,
      },
      data: {
        title,
        description: description || undefined,
        is_collection: is_collection === "true",
        updated_at: new Date(),
        lists_movies: movie_id
          ? {
              // Delete existing movie associations
              deleteMany: {},
              // Create new movie associations
              create: movie_id.split(",").map((movieId: string) => ({
                movie_id: movieId,
                added_at: new Date(),
              })),
            }
          : undefined,
      },
      include: {
        lists_movies: {
          include: {
            movies: true,
          },
        },
      },
    });

    return {
      type: "success",
      message: "Liste mise à jour",
      updatedList: {
        id: updatedList.id.toString(),
        title: updatedList.title,
        description: updatedList.description,
        lists_movies: updatedList.lists_movies.map((lm) => ({
          movie_id: lm.movie_id,
          movie_title: lm.movies.title,
        })),
      },
    };
  } catch (err) {
    console.error("Error updating list:", err);
    return {
      type: "error",
      message: "Une erreur s'est produite lors de la mise à jour de la liste",
      errors: null,
    };
  }
}
