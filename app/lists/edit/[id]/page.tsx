import { auth } from "@/utils/auth";
import EditListPage from "./client";
import { isAdmin } from "@/utils/is-user-admin";
import { redirect } from "next/navigation";

export default async function Page({ params }: { params: { id: string } }) {
  const session = await auth();
  if (!session) redirect("/login");

  const admin = await isAdmin();

  return <EditListPage params={params} isAdmin={admin} />;
}
