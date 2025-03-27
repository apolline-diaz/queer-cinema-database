"use server";

import { createClient } from "@/utils/supabase/server";
import { redirect } from "next/navigation";
import { cachedQuery, prisma } from "@/lib/prisma";

export async function getLists() {
  const supabase = createClient();
  const { data, error } = await supabase.auth.getUser();

  if (error || !data?.user) {
    redirect("/login");
  }

  const userId = data.user.id;

  try {
    return cachedQuery(
      [`user-lists-${userId}`],
      async () => {
        const lists = await prisma.lists.findMany({
          where: { user_id: userId },
          include: {
            lists_movies: {
              include: {
                movies: {
                  select: { image_url: true, title: true },
                },
              },
              take: 1,
            },
          },
        });

        return lists.map((list) => ({
          id: list.id.toString(),
          title: list.title,
          description: list.description ?? undefined,
          lists_movies: list.lists_movies.map((lm) => ({
            movie: {
              image_url: lm.movies?.image_url,
              title: lm.movies?.title,
            },
          })),
        }));
      },
      {
        tags: [`user-lists-${userId}`],
        revalidate: 3600, // Cache for 1 hour
      }
    );
  } catch (err) {
    console.error("Error fetching lists:", err);
    redirect("/error");
  }
}
