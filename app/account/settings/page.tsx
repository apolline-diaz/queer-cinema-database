import { getUser } from "@/app/server-actions/users/get-user";
import SettingsClientPage from "./client";
import { redirect } from "next/navigation";

export default async function SettingsPage() {
  const { user, error } = await getUser();

  if (error || !user) {
    redirect("/login");
  }

  return <SettingsClientPage user={user} />;
}
