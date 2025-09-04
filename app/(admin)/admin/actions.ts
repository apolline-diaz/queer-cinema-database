"use server";

import { z } from "zod";
import { readLinks, writeLinks, type TVLinks } from "@/lib/tv-links";
import { prisma } from "@/lib/prisma"; // ton client prisma existant
// Optionnel: sécuriser par rôle
import { createServerComponentClient } from "@supabase/auth-helpers-nextjs";
import { cookies } from "next/headers";

const supabase = createServerComponentClient({ cookies });

async function assertAdmin() {
  const cookieStore = cookies();
  const supabase = createServerComponentClient({ cookies });

  const { data } = await supabase.auth.getUser();
  const userId = data.user?.id;
  if (!userId) throw new Error("Non authentifié");
  const user = await prisma.users.findUnique({ where: { id: userId } });
  if (user?.role !== "admin") throw new Error("Accès refusé");
}

const addLinkSchema = z.object({
  movieId: z.string().uuid(),
  url: z.string().url(),
  label: z.string().trim().min(1).max(40).optional(),
});

export const addLinkAction = async (formData: FormData) => {
  await assertAdmin();
  const parsed = addLinkSchema.safeParse({
    movieId: formData.get("movieId"),
    url: formData.get("url"),
    label: formData.get("label") || undefined,
  });
  if (!parsed.success) throw new Error("Entrées invalides");

  const { movieId, url, label } = parsed.data;

  // vérifie que le film existe
  const exists = await prisma.movies.findUnique({
    where: { id: movieId },
    select: { id: true },
  });
  if (!exists) throw new Error("Film introuvable");

  const data = await readLinks();
  const arr = data.items[movieId] ?? [];
  arr.push({ url, label, addedAt: new Date().toISOString() });
  data.items[movieId] = arr;
  await writeLinks(data);
};

const removeLinkSchema = z.object({
  movieId: z.string().uuid(),
  url: z.string().url(),
});

export const removeLinkAction = async (formData: FormData) => {
  await assertAdmin();
  const parsed = removeLinkSchema.safeParse({
    movieId: formData.get("movieId"),
    url: formData.get("url"),
  });
  if (!parsed.success) throw new Error("Entrées invalides");

  const { movieId, url } = parsed.data;
  const data = await readLinks();
  data.items[movieId] = (data.items[movieId] ?? []).filter(
    (l) => l.url !== url
  );
  if (data.items[movieId].length === 0) delete data.items[movieId];
  if (data.featuredId === movieId && !data.items[movieId])
    data.featuredId = null;
  await writeLinks(data);
};

const setFeaturedSchema = z.object({
  movieId: z.string().uuid().nullable(),
});

export const setFeaturedAction = async (formData: FormData) => {
  await assertAdmin();
  const movieId = (formData.get("movieId") as string) || null;
  const parsed = setFeaturedSchema.safeParse({ movieId });
  if (!parsed.success) throw new Error("Entrées invalides");
  const data = await readLinks();
  data.featuredId = parsed.data.movieId;
  await writeLinks(data);
};

const removeMovieSchema = z.object({
  movieId: z.string().uuid(),
});

export const removeMovieFromTVAction = async (formData: FormData) => {
  await assertAdmin();
  const parsed = removeMovieSchema.safeParse({
    movieId: formData.get("movieId"),
  });
  if (!parsed.success) throw new Error("Entrées invalides");
  const data = await readLinks();
  delete data.items[parsed.data.movieId];
  if (data.featuredId === parsed.data.movieId) data.featuredId = null;
  await writeLinks(data);
};

// Recherche simple par titre (pour l'admin form)
export async function searchMoviesByTitle(q: string) {
  await assertAdmin();
  if (!q.trim()) return [];
  return prisma.movies.findMany({
    where: { title: { contains: q, mode: "insensitive" } },
    select: { id: true, title: true, release_date: true },
    take: 12,
  });
}
