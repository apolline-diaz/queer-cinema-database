import { auth } from "@/utils/auth";
import MoviesLists from "./client";
import { isAdmin } from "@/utils/is-user-admin";
import { getList } from "@/app/server-actions/lists/get-list";
import { redirect } from "next/navigation";

interface ListPageParams {
  id: string;
}

export default async function ListPage({
  params,
}: {
  params: Promise<ListPageParams>;
}) {
  const { id } = await params;

  const session = await auth();
  const userIsAdmin = await isAdmin();
  const list = await getList(id);
  if (!list) {
    redirect("/error");
  }
  const userIsOwner =
    session && list.user_id === session.user.id ? true : false;

  return (
    <MoviesLists id={id} userIsAdmin={userIsAdmin} userIsOwner={userIsOwner} />
  );
}
