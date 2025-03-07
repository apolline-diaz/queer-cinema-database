// Server Action for User's Movie Lists
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function getUserMovieLists(userId: string) {
  "use server";

  const lists = await prisma.lists.findMany({
    where: {
      user_id: userId,
    },
    include: {
      lists_movies: {
        include: {
          movies: {
            include: {
              movie_directors: {
                include: {
                  directors: true,
                },
              },
              movie_genres: {
                include: {
                  genres: true,
                },
              },
            },
          },
        },
      },
    },
  });

  return lists;
}
