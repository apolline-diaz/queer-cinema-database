import db from "@/db";
import { lists, listsMovies, movies, users } from "@/db/schema";

export async function createList(data: {
  title: string;
  description: string;
  userId: string;
  movieIds: string[];
}) {
  const { title, description, userId, movieIds } = data;

  // Validation des entrées
  if (!title || !userId) {
    return { type: "error", message: "Title and user ID are required." };
  }

  // Ajouter la liste à la base de données
  try {
    // Créer la liste dans la base de données
    const createdList = await db
      .insert(lists)
      .values({
        title,
        description,
        userId,
      })
      .returning();

    const listId = createdList[0]?.id;

    if (!listId) {
      return { type: "error", message: "Failed to create the list." };
    }

    // Ajouter les films associés à la liste
    const values = movieIds.map((movieId) => ({
      listId,
      movieId,
    }));

    await db.insert(listsMovies).values(values);

    return { type: "success", message: "List created successfully!" };
  } catch (err) {
    console.error("Error creating list:", err);
    return {
      type: "error",
      message: "An error occurred while creating the list.",
    };
  }
}
