"use server";

import { createClient } from "@/utils/supabase/server";

export type TVLinks = {
  featuredId: string | null;
  items: Record<string, { url: string; label?: string; addedAt: string }[]>;
};

const BUCKET = "tv-links";
const KEY = "links.json";

export async function readLinks(): Promise<TVLinks> {
  const supabase = createClient();
  const { data, error } = await supabase.storage.from(BUCKET).download(KEY);
  if (error) throw error;
  const text = await data.text();
  return JSON.parse(text) as TVLinks;
}
