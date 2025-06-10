import { auth } from "@/utils/auth"; // Adjust the import path to your auth utility
import { redirect } from "next/navigation";
import CreateListPage from "./client"; // Import the client-side form component
import { isAdmin } from "@/utils/is-user-admin";

export default async function Page() {
  // Check user authentication
  const session = await auth();

  // If no session exists, redirect to login page
  if (!session) {
    redirect("/login"); // Adjust the login path as needed
  }

  const adminStatus = await isAdmin();

  // If authenticated, render the upload form
  return <CreateListPage isAdmin={adminStatus} />;
}
