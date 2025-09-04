import { readLinks } from "@/lib/tv-links";
import { prisma } from "@/lib/prisma";
import { Suspense } from "react";
import { TVClient } from "./client";

export default async function TVPage() {
  const tv = await readLinks();
  const ids = Object.keys(tv.items);
  if (ids.length === 0) {
    return <div className="p-8">Aucun film disponible pour le moment.</div>;
  }

  const movies = await prisma.movies.findMany({
    where: { id: { in: ids } },
    include: {
      movies_directors: { include: { directors: true } },
      movies_genres: { include: { genres: true } },
      movies_countries: { include: { countries: true } },
    },
  });

  // map + featured fallback
  const map = new Map(movies.map((m) => [m.id, m]));
  const featured =
    tv.featuredId && map.get(tv.featuredId)
      ? map.get(tv.featuredId)!
      : map.get(ids[0])!;

  // precompute a plain object for client component
  const payload = ids
    .map((id) => map.get(id))
    .filter(Boolean)
    .map((m) => ({
      id: m!.id,
      title: m!.title,
      image_url: m!.image_url || undefined,
      release_date: m!.release_date || undefined,
      language: m!.language || undefined,
      runtime: m!.runtime ? String(m!.runtime) : undefined,
      directors: m!.movies_directors
        .map((d) => d.directors.name)
        .filter(Boolean)
        .join(", "),
      links: tv.items[m!.id] || [],
    }));

  return (
    <Suspense fallback={<div className="p-8">Chargement…</div>}>
      <TVClient initialData={payload} featuredId={featured.id} />
    </Suspense>
  );
}
