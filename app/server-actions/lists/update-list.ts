"use server";

import { prisma } from "@/lib/prisma";
import { z } from "zod";

const ListSchema = z.object({
  title: z.string().min(1, "Le titre est requis"),
  description: z.string().optional(),
  movie_id: z.string().optional(),
});

export async function updateList(id: string, formData: FormData) {
  const validatedFields = ListSchema.safeParse({
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

  const { title, description, movie_id } = validatedFields.data;

  try {
    const updatedList = await prisma.lists.update({
      where: { id: parseInt(id) },
      data: {
        title,
        description: description || undefined,
        lists_movies: movie_id
          ? {
              deleteMany: {},
              create: movie_id.split(",").map((id: string) => ({
                movie_id: id,
                added_at: new Date(),
              })),
            }
          : undefined,
      },
    });

    return { type: "success", message: "Liste mise à jour", updatedList };
  } catch (err) {
    console.error("Error updating list:", err);
    return {
      type: "error",
      message: "An error occurred while updating the list",
      errors: null,
    };
  }
}
