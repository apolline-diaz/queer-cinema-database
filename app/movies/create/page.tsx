import { auth } from "@/utils/auth"; // Adjust the import path to your auth utility
import { redirect } from "next/navigation";
import CreateMoviePage from "./client"; // Import the client-side form component
import { isAdmin } from "@/utils/is-user-admin";

export default async function Page() {
  // Check user authentication
  const userIsAdmin = await isAdmin();

  // If no session exists, redirect to login page
  if (!userIsAdmin) {
    redirect("/login"); // Adjust the login path as needed
  }

  // If authenticated, render the upload form
  return <CreateMoviePage />;
}
