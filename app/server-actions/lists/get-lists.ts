"use server";

import { createClient } from "@/utils/supabase/server";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { cache } from "react";

export const getLists = cache(async () => {
  const supabase = createClient();
  const { data, error } = await supabase.auth.getUser();

  if (error || !data?.user) {
    redirect("/login");
  }

  const userId = data.user.id;

  try {
    const lists = await prisma.lists.findMany({
      where: { user_id: userId },
      include: {
        lists_movies: {
          include: {
            movies: {
              select: { id: true, image_url: true, title: true },
            },
          },
        },
      },
    });

    return lists.map((list) => ({
      id: list.id.toString(),
      title: list.title,
      description: list.description ?? undefined,
      is_collection: list.is_collection,
      lists_movies: list.lists_movies.map((lm) => ({
        movie: {
          id: lm.movies?.id,
          image_url: lm.movies?.image_url,
          title: lm.movies?.title,
        },
      })),
    }));
  } catch (err) {
    console.error("Error fetching lists:", err);
    redirect("/error");
  }
});
