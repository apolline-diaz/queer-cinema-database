import { createClient } from "@/utils/supabase/server";
import { prisma } from "@/lib/prisma";
import type { UserRole } from "@/app/types/user";

// for access control
export async function getCurrentUserRole(): Promise<UserRole | null> {
  const supabase = createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) return null;

  const dbUser = await prisma.users.findUnique({
    where: { id: user.id },
    select: { role: true },
  });

  return dbUser?.role as UserRole | null;
}

// check if the user is admin
export async function isAdmin(): Promise<boolean> {
  const role = await getCurrentUserRole();
  return role === "admin";
}
