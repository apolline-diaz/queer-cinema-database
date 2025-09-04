import {
  addLinkAction,
  removeLinkAction,
  setFeaturedAction,
  removeMovieFromTVAction,
  searchMoviesByTitle,
} from "./actions";
import { readLinks } from "@/lib/tv-links";
import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";

export default async function AdminTVPage({
  searchParams,
}: {
  searchParams: { q?: string };
}) {
  const q = searchParams?.q ?? "";
  const results = q ? await searchMoviesByTitle(q) : [];
  const tv = await readLinks();

  const movieIds = Object.keys(tv.items);
  const movies = movieIds.length
    ? await prisma.movies.findMany({
        where: { id: { in: movieIds } },
        include: {
          movies_directors: { include: { directors: true } },
        },
      })
    : [];

  const map = new Map(movies.map((m) => [m.id, m]));

  // UI minimal (no shadcn to keep it tiny)
  return (
    <div className="p-6 space-y-8">
      <h1 className="text-2xl font-bold">Admin · TV</h1>

      {/* Recherche */}
      <form action="/admin/tv" method="get" className="flex gap-2">
        <input
          name="q"
          defaultValue={q}
          placeholder="Chercher un film par titre…"
          className="input input-bordered w-full p-2 border rounded"
        />
        <button className="px-3 py-2 rounded bg-black text-white">
          Rechercher
        </button>
      </form>

      {q ? (
        <div className="space-y-3">
          <h2 className="font-semibold">Résultats</h2>
          <ul className="space-y-3">
            {results.map((r) => (
              <li key={r.id} className="border rounded p-3">
                <div className="flex items-center justify-between">
                  <div>
                    <div className="font-medium">{r.title}</div>
                    <div className="text-sm opacity-70">{r.release_date}</div>
                  </div>
                  <details className="w-full max-w-lg ml-4">
                    <summary className="cursor-pointer select-none">
                      Ajouter un lien
                    </summary>
                    <form
                      action={async (fd) => {
                        await addLinkAction(fd);
                        revalidatePath("/admin/tv");
                      }}
                      className="mt-2 flex gap-2"
                    >
                      <input type="hidden" name="movieId" value={r.id} />
                      <input
                        name="url"
                        placeholder="https://…"
                        className="flex-1 p-2 border rounded"
                        required
                      />
                      <input
                        name="label"
                        placeholder="YouTube / VOD…"
                        className="w-48 p-2 border rounded"
                      />
                      <button className="px-3 py-2 rounded bg-emerald-600 text-white">
                        + Ajouter
                      </button>
                    </form>
                  </details>
                </div>
              </li>
            ))}
          </ul>
        </div>
      ) : null}

      {/* Liste des films actuellement sur la page TV */}
      <div className="space-y-3">
        <h2 className="font-semibold">Films avec liens (TV)</h2>
        <ul className="space-y-4">
          {movieIds.map((id) => {
            const m = map.get(id);
            const links = tv.items[id] || [];
            if (!m) return null;
            return (
              <li key={id} className="border rounded p-3">
                <div className="flex items-center justify-between">
                  <div>
                    <div className="font-medium">{m.title}</div>
                    <div className="text-sm opacity-70">{m.release_date}</div>
                  </div>
                  <form
                    action={async (fd) => {
                      await setFeaturedAction(fd);
                      revalidatePath("/admin/tv");
                    }}
                  >
                    <input type="hidden" name="movieId" value={id} />
                    <button
                      className={
                        "px-3 py-2 rounded " +
                        (tv.featuredId === id
                          ? "bg-indigo-700 text-white"
                          : "bg-indigo-100")
                      }
                    >
                      {tv.featuredId === id
                        ? "★ En vedette"
                        : "Mettre en vedette"}
                    </button>
                  </form>
                </div>

                <div className="mt-3 space-y-2">
                  {links.map((l) => (
                    <div key={l.url} className="flex items-center gap-2">
                      <a
                        href={l.url}
                        target="_blank"
                        className="underline truncate flex-1"
                      >
                        {l.label || l.url}
                      </a>
                      <form
                        action={async (fd) => {
                          await removeLinkAction(fd);
                          revalidatePath("/admin/tv");
                        }}
                      >
                        <input type="hidden" name="movieId" value={id} />
                        <input type="hidden" name="url" value={l.url} />
                        <button className="px-2 py-1 rounded bg-red-600 text-white text-sm">
                          Supprimer
                        </button>
                      </form>
                    </div>
                  ))}
                </div>

                <form
                  className="mt-3"
                  action={async (fd) => {
                    await removeMovieFromTVAction(fd);
                    revalidatePath("/admin/tv");
                  }}
                >
                  <input type="hidden" name="movieId" value={id} />
                  <button className="px-3 py-2 rounded bg-neutral-200">
                    Retirer ce film de la TV
                  </button>
                </form>
              </li>
            );
          })}
        </ul>
      </div>
    </div>
  );
}
