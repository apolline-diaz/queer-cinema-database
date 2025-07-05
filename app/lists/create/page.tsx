import { auth } from "@/lib/auth/auth";
import { redirect } from "next/navigation";
import CreateListForm from "./client";
import { isAdmin } from "@/utils/is-user-admin";

export default async function CreateListPage() {
  const session = await auth();

  if (!session) {
    redirect("/login");
  }

  const adminStatus = await isAdmin();

  return <CreateListForm isAdmin={adminStatus} />;
}
