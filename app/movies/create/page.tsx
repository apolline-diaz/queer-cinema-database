import { redirect } from "next/navigation";
import CreateMovieForm from "./client";
import { isAdmin } from "@/utils/is-user-admin";
import { Metadata } from "next";

export default async function CreateMoviePage() {
  const userIsAdmin = await isAdmin(); // Auth check

  if (!userIsAdmin) {
    redirect("/login"); // Redirect to login page if not admin
  }

  // Renders the movie form if authorized
  return <CreateMovieForm />;
}
