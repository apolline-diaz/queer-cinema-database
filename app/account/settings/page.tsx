import { getUser } from "@/app/server-actions/users/get-user";
import SettingsPage from "./client";

export default async function Page() {
  const { user, error } = await getUser();

  if (error || !user) {
    return <div>Erreur : {error}</div>;
  }

  return <SettingsPage user={user} />;
}
