"use server";

import { prisma } from "@/lib/prisma";
import { Prisma } from "@prisma/client";

// Définir le type avec les relations incluses
type CollectionWithMovies = Prisma.listsGetPayload<{
  include: {
    lists_movies: {
      include: {
        movies: {
          select: {
            id: true;
            image_url: true;
            title: true;
            release_date: true;
            description: true;
          };
        };
      };
    };
  };
}>;

export const getCollections = async (): Promise<CollectionWithMovies[]> => {
  try {
    const collections = await prisma.lists.findMany({
      where: {
        is_collection: true,
      },
      include: {
        lists_movies: {
          include: {
            movies: {
              select: {
                id: true,
                image_url: true,
                title: true,
                release_date: true,
                description: true,
              },
            },
          },
        },
      },
      orderBy: {
        created_at: "desc",
      },
    });

    return collections;
  } catch (err) {
    console.error("Erreur lors de la récupération des collections :", err);
    return [];
  }
};
