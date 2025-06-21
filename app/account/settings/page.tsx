import { getUser } from "@/app/server-actions/users/get-user";
import SettingsPage from "./client";
import { redirect } from "next/navigation";

export default async function Page() {
  const { user, session, error } = await getUser();

  if (error || !user || !session) {
    redirect("/login");
  }

  return <SettingsPage user={user} />;
}
