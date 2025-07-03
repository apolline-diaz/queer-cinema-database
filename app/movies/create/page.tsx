import { redirect } from "next/navigation";
import CreateMovieForm from "./client";
import { isAdmin } from "@/utils/is-user-admin";

export default async function CreateMoviePage() {
  const userIsAdmin = await isAdmin();

  if (!userIsAdmin) {
    redirect("/login");
  }
  return <CreateMovieForm />;
}
