import { redirect } from "next/navigation";
import CreateMoviePage from "./client";
import { isAdmin } from "@/utils/is-user-admin";

export default async function Page() {
  const userIsAdmin = await isAdmin();

  if (!userIsAdmin) {
    redirect("/login");
  }

  return <CreateMoviePage />;
}
