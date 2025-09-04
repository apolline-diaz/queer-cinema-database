"use server";

import { prisma } from "@/lib/prisma";

export async function getMoviesWithLinks() {
  const movies = await prisma.movies.findMany({
    where: {
      streaming_links: {
        some: { isActive: true },
      },
    },
    include: {
      movies_directors: {
        include: { directors: true },
      },
      movies_genres: {
        include: { genres: true },
      },
      streaming_links: {
        where: { isActive: true },
      },
    },
  });

  return movies.map((m) => ({
    id: m.id,
    title: m.title,
    original_title: m.original_title,
    description: m.description,
    release_date: m.release_date,
    language: m.language,
    runtime: m.runtime ? Number(m.runtime) : null,
    image_url: m.image_url,
    directors: m.movies_directors.map((d) => ({ name: d.directors.name })),
    genres: m.movies_genres.map((g) => ({ name: g.genres.name })),
    streamingLink: m.streaming_links[0] ?? null, // on prend le premier pour simplifier
  }));
}
