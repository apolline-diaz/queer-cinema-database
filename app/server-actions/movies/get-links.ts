"use server";

import { readLinks } from "@/lib/tv-links"; // ta fonction qui lit links.json

export async function getMovieLinks(movieId: string) {
  try {
    const tv = await readLinks();

    if (!tv || !tv.items) return [];

    return tv.items[movieId] || [];
  } catch (error) {
    console.error("Erreur lors de la récupération des liens :", error);
    return [];
  }
}
