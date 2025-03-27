import { createClient } from "@/utils/supabase/server";
import { prisma } from "@/lib/prisma";
import { z } from "zod";
import { ensureUserExists } from "@/utils/ensure-user-exist";

const ListSchema = z.object({
  title: z.string().min(1, "Le titre est requis"),
  description: z.string().optional(),
  movie_id: z.string().optional(),
});

export const config = {
  runtime: "nodejs", // Utilisation du runtime Node.js
};

export default async function handler(
  req: { method: string; body: unknown },
  res: {
    status: (arg0: number) => {
      (): any;
      new (): any;
      json: {
        (arg0: {
          error?: string;
          errors?: {
            title?: string[] | undefined;
            description?: string[] | undefined;
            movie_id?: string[] | undefined;
          };
          message?: string;
          list?: {
            title: string;
            description: string | null;
            created_at: Date | null;
            id: bigint;
            updated_at: Date | null;
            user_id: string;
          };
        }): void;
        new (): any;
      };
    };
  }
) {
  if (req.method === "POST") {
    const userSync = await ensureUserExists();

    if (!userSync.success) {
      return res.status(400).json({ error: userSync.message });
    }

    const supabase = createClient();
    const { data, error } = await supabase.auth.getUser();

    if (error || !data?.user) {
      return res.status(401).json({ error: "You must be connected" });
    }

    const userId = data.user.id;
    const validatedFields = ListSchema.safeParse(req.body);

    if (!validatedFields.success) {
      return res.status(400).json({
        errors: validatedFields.error.flatten().fieldErrors,
        message: "Some fields are not valid",
      });
    }

    const { title, description, movie_id } = validatedFields.data;

    try {
      const newList = await prisma.lists.create({
        data: {
          title,
          description: description || undefined,
          user_id: userId,
          lists_movies: movie_id
            ? {
                create: movie_id.split(",").map((id) => ({
                  movie_id: id,
                  added_at: new Date(),
                })),
              }
            : undefined,
        },
      });

      return res
        .status(200)
        .json({ message: "List created successfully", list: newList });
    } catch (err) {
      console.error("Error creating list:", err);
      return res
        .status(500)
        .json({ error: "An error happened during the list creation" });
    }
  } else {
    res.status(405).json({ error: "Method Not Allowed" });
  }
}
