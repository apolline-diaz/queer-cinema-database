import { supabase } from "@/lib/supabase";

export const getGenres = async () => {
  try {
    const genres = await prisma.genres.findMany({
      orderBy: {
        name: "asc", // Tri par nom en ordre alphabétique croissant
      },
      select: {
        id: true,
        name: true,
      },
    });
    return genres;
  } catch (error) {
    console.error("Erreur lors de la récupération des genres :", error);
    return [];
  }
};

import { prisma } from "@/lib/prisma"; // Assurez-vous d'importer votre instance Prisma

export const getCountries = async () => {
  try {
    // Récupérer les pays triés par nom en ordre croissant (A-Z)
    const countries = await prisma.countries.findMany({
      orderBy: {
        name: "asc", // Tri par nom en ordre alphabétique croissant
      },
      select: {
        id: true,
        name: true,
      },
    });
    return countries;
  } catch (error) {
    console.error("Erreur lors de la récupération des pays :", error);
    return [];
  }
};

export const getKeywords = async () => {
  try {
    const keywords = await prisma.keywords.findMany({
      orderBy: {
        name: "asc", // Tri par nom en ordre alphabétique croissant
      },
      select: {
        id: true,
        name: true,
      },
    });
    return keywords;
  } catch (error) {
    console.error("Erreur lors de la récupération des mots-clés :", error);
    return [];
  }
};
