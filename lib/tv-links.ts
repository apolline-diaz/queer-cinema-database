"use server";

import { supabaseAdmin } from "./supabase-admin";

export type TVLinks = {
  featuredId: string | null;
  items: Record<string, { url: string; label?: string; addedAt: string }[]>;
};

const BUCKET = "tv-links";
const KEY = "links.json";

async function ensureFile(): Promise<void> {
  const sb = supabaseAdmin();
  const { data, error } = await sb.storage.from(BUCKET).list("", { limit: 1 });
  if (error) throw error;
  const exists = data?.some((f) => f.name === KEY);
  if (!exists) {
    const empty: TVLinks = { featuredId: null, items: {} };
    await sb.storage.from(BUCKET).upload(
      KEY,
      new Blob([JSON.stringify(empty, null, 2)], {
        type: "application/json",
      }),
      { upsert: true }
    );
  }
}

export async function readLinks(): Promise<TVLinks> {
  const sb = supabaseAdmin();
  await ensureFile();
  const { data, error } = await sb.storage.from(BUCKET).download(KEY);
  if (error) throw error;
  const text = await data.text();
  return JSON.parse(text) as TVLinks;
}

export async function writeLinks(payload: TVLinks): Promise<void> {
  const sb = supabaseAdmin();
  await sb.storage.from(BUCKET).upload(
    KEY,
    new Blob([JSON.stringify(payload, null, 2)], {
      type: "application/json",
    }),
    { upsert: true }
  );
}
