import { redirect } from "next/navigation";
import CreateMoviePage from "./client";
import { isAdmin } from "@/utils/is-user-admin";

export default async function Page() {
  const userIsAdmin = await isAdmin(); // Auth check

  if (!userIsAdmin) {
    redirect("/login"); // Redirect to login page if not admin
  }

  // Renders the movie form if authorized
  return <CreateMoviePage />;
}
