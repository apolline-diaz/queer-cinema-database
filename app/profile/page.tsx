import { redirect } from "next/navigation";

import { createClient } from "@/utils/supabase/server";

export default async function ProfilePage() {
  const supabase = createClient();

  const { data, error } = await supabase.auth.getUser();
  if (error || !data?.user) {
    redirect("/login");
  }

  return (
    <div className="p-10">
      <p>Hello {data.user.email}</p>
    </div>
  );
}
