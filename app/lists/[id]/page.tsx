import { redirect } from "next/navigation";
import MoviesLists from "./client"; // Import the client-side form component
import { isAdmin } from "@/utils/is-user-admin";

export default async function ListPage({
  params,
}: {
  params: { id: string; userIsAdmin: boolean };
}) {
  // Check user authentication
  const userIsAdmin = await isAdmin();

  // If authenticated, render the upload form
  return (
    <MoviesLists
      params={{
        id: params.id,
        userIsAdmin,
      }}
    />
  );
}
