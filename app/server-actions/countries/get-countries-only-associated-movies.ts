"use server";

import { PrismaClient } from "@prisma/client";

export async function getCountriesOnlyAssociatedToMovies() {
  const prisma = new PrismaClient();

  try {
    const countries = await prisma.countries.findMany({
      where: {
        movies_countries: {
          some: {},
        },
      },
      orderBy: {
        name: "asc",
      },
    });

    return countries;
  } catch (error) {
    console.error("Error fetching countries:", error);
    return [];
  } finally {
    await prisma.$disconnect();
  }
}
