import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

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
    // Créer la liste et les associations avec les films en une seule transaction
    const result = await prisma.$transaction(async (tx) => {
      // Créer la liste dans la base de données
      const createdList = await tx.lists.create({
        data: {
          title,
          description,
          user_id: userId,
        },
      });

      // Ajouter les films associés à la liste
      if (movieIds.length > 0) {
        await tx.lists_movies.createMany({
          data: movieIds.map((movieId) => ({
            list_id: createdList.id,
            movie_id: movieId,
          })),
        });
      }

      return createdList;
    });

    return { type: "success", message: "List created successfully!" };
  } catch (err) {
    console.error("Error creating list:", err);
    return {
      type: "error",
      message: "An error occurred while creating the list.",
    };
  } finally {
    // Bonnes pratiques : déconnexion de Prisma
    // Mais on peut généralement laisser le client Prisma en vie pendant la durée de vie de l'application
    // await prisma.$disconnect();
  }
}
