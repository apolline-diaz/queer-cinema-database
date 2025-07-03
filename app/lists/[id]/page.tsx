import { auth } from "@/utils/auth";
import MoviesLists from "./client"; // Import the client-side form component
import { isAdmin } from "@/utils/is-user-admin";
import { getList } from "@/app/server-actions/lists/get-list";
import { redirect } from "next/navigation";

export default async function ListPage({
  params,
}: {
  params: { id: string; userIsAdmin: boolean };
}) {
  const session = await auth();
  const userIsAdmin = await isAdmin();
  const list = await getList(params.id);
  if (!list) {
    redirect("/404");
  }
  const userIsOwner =
    session && list.user_id === session.user.id ? true : false;

  // If authenticated, render the upload form
  return (
    <MoviesLists
      params={{
        id: params.id,
        userIsAdmin,
        userIsOwner,
      }}
    />
  );
}
