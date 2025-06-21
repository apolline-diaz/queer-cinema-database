import { getUser } from "@/app/server-actions/users/get-user";
import SettingsPage from "./client";
import { redirect } from "next/navigation";

export default async function Page() {
  const { user, error } = await getUser();

  if (error || !user) {
    redirect("/login");
  }

  return <SettingsPage user={user} />;
}
