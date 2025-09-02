import { auth } from "@/utils/auth";
import EditListForm from "./client";
import { isAdmin } from "@/utils/is-user-admin";
import { redirect } from "next/navigation";

export default async function EditListPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const session = await auth();
  if (!session) redirect("/login");

  const admin = await isAdmin();

  return <EditListForm params={{ id }} isAdmin={admin} />;
}
