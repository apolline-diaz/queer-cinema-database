"use server";

import { prisma } from "@/lib/prisma"; // Assurez-vous que vous avez bien configuré Prisma

export async function getList(id: string) {
  try {
    const list = await prisma.lists.findUnique({
      where: {
        id: parseInt(id), // Assurez-vous que l'ID est un nombre
      },
      include: {
        lists_movies: {
          include: {
            movies: true, // Inclure les films associés
          },
        },
      },
    });

    return list;
  } catch (error) {
    console.error("Error fetching list:", error);
    throw new Error("Could not fetch list data");
  }
}
