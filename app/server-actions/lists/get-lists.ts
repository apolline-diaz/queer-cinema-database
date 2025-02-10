// Server Action for User's Movie Lists

import db from "@/db";
import { eq } from "drizzle-orm";
import * as schema from "@/db/schema";

export async function getUserMovieLists(userId: string) {
  "use server";

  const lists = await db.query.lists.findMany({
    where: eq(schema.lists.userId, userId),
    with: {
      listsMovies: {
        with: {
          movie: {
            with: {
              movieDirectors: {
                with: {
                  director: true,
                },
              },
              movieGenres: {
                with: {
                  genre: true,
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
