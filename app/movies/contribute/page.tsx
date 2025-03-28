import { auth } from "@/utils/auth"; // Adjust the import path to your auth utility
import { redirect } from "next/navigation";
import UploadFormPage from "./client"; // Import the client-side form component

export default async function UploadMoviePage() {
  // Check user authentication
  const session = await auth();

  // If no session exists, redirect to login page
  if (!session) {
    redirect("/login"); // Adjust the login path as needed
  }

  // If authenticated, render the upload form
  return <UploadFormPage />;
}
