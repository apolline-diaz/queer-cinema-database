// import { prisma } from "@/lib/prisma";
// import { auth } from "@/utils/auth"; // Assurez-vous d'avoir une fonction auth pour obtenir la session

// export async function checkUserRole(requiredRole: string) {
//   // Obtenez l'utilisateur actuellement authentifié via Supabase
//   const session = await auth();
//   if (!session) {
//     throw new Error("Utilisateur non authentifié");
//   }

//   // Vérifiez le rôle de l'utilisateur dans la base de données
//   const user = await prisma.users.findUnique({
//     where: { id: session.user.id },
//     select: { role: true },
//   });

//   if (!user || user.role !== requiredRole) {
//     throw new Error("Not allowed : role user, you need to be admin");
//   }

//   return user; // L'utilisateur est autorisé à accéder à la ressource
// }
