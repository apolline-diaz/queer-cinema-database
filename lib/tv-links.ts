import { createBrowserClient } from "@supabase/ssr";

const BUCKET = "tv-links";
const KEY = "links.json";

export async function readLinks() {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
  const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;
  const supabase = createBrowserClient(supabaseUrl, supabaseAnonKey);

  const { data, error } = await supabase.storage.from(BUCKET).download(KEY);
  if (error) throw new Error("Can't read links.json: " + error.message);

  const text = await data.text();
  return JSON.parse(text);
}
