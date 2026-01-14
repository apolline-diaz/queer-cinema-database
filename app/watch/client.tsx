"use client";

import { useMemo, useState } from "react";
import Image from "next/image";
import { getImageUrl } from "@/utils";
import Link from "next/link";
import { Icon } from "@iconify/react/dist/iconify.js";
import { Play } from "lucide-react";

export function TVClient({
  initialData,
  featuredId,
  genres,
}: {
  initialData: any[];
  featuredId: string;
  genres: { id: bigint; name: string }[]; // type correct
}) {
  const byId = useMemo(
    () => new Map(initialData.map((m) => [m.id, m])),
    [initialData]
  );
  const [currentId, setCurrentId] = useState<string>(featuredId);
  const current = byId.get(currentId)!;
  const [search, setSearch] = useState("");

  const [genreFilter, setGenreFilter] = useState("");
  const [yearFilter, setYearFilter] = useState("");
  const [languageFilter, setLanguageFilter] = useState("");

  const filteredMovies = useMemo(() => {
    return initialData.filter((m) => {
      const matchesSearch =
        m.title.toLowerCase().includes(search.toLowerCase()) ||
        m.directors?.toLowerCase().includes(search.toLowerCase());

      const matchesGenre =
        !genreFilter || (m.genreIds || []).includes(genreFilter);

      const matchesYear = !yearFilter || m.release_date?.startsWith(yearFilter);

      const matchesLang = !languageFilter || m.language === languageFilter;

      return matchesSearch && matchesGenre && matchesYear && matchesLang;
    });
  }, [search, genreFilter, yearFilter, languageFilter, initialData]);

  return (
    <div className="min-h-dvh bg-black text-white">
      {/* Hero Section - Film mis en avant */}
      <section className="relative h-[80dvh] w-full">
        {current.image_url ? (
          <Image
            src={getImageUrl(current.image_url)}
            alt={current.title}
            fill
            className="object-cover opacity-50"
            priority
          />
        ) : (
          <div className="absolute inset-0 bg-neutral-800" />
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-black via-black/60 to-transparent" />

        <div className="relative z-10 max-w-7xl mx-auto px-6 flex flex-col justify-end h-full pb-16">
          <div className="mb-6 inline-flex w-fit bg-pink-500/10 backdrop-blur-sm text-white px-3 py-1 rounded-full text-xs tracking-wide uppercase border border-white/20">
            Nouveau
          </div>
          <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold mb-4 max-w-4xl">
            {current.title}
          </h1>
          <div className="flex flex-wrap items-center gap-2 text-base md:text-lg opacity-90 mb-3">
            {current.directors && (
              <p className="font-medium">{current.directors}</p>
            )}
            {current.release_date && (
              <>
                <span className="text-neutral-500">•</span>
                <p>{new Date(current.release_date).getFullYear()}</p>
              </>
            )}
            {current.runtime && (
              <>
                <span className="text-neutral-500">•</span>
                <p>{current.runtime} min</p>
              </>
            )}
            {current.language && (
              <>
                <span className="text-neutral-500">•</span>
                <p>{current.language}</p>
              </>
            )}
          </div>
          <p className="text-sm md:text-md max-w-3xl mb-8 line-clamp-3 leading-relaxed">
            {current.description}
          </p>
          <Link
            href={`/movies/${current.id}`}
            className="inline-flex w-fit  items-center gap-2 bg-gradient-to-r from-pink-500 to-purple-500 text-white px-6 py-3 rounded-full font-semibold text-base hover:shadow-xl hover:shadow-pink-500/50 transition-all duration-300"
          >
            <Play className="w-5 h-5" />
            Voir le film
          </Link>
        </div>
      </section>

      {/* Section de recherche et filtres */}
      <section className="max-w-7xl mx-auto px-6 pb-12">
        <h2 className="text-2xl md:text-3xl font-bold mb-4 text-pink-500">
          Explorer le catalogue
        </h2>
        <p className="text-neutral-400 text-lg mb-5">
          Visionner des films queer en accès libre et en VOD
        </p>
        {/* Barre de recherche */}
        <div className="relative mb-6 text-sm">
          <Icon
            icon="mdi:magnify"
            className="absolute left-4 top-1/2 -translate-y-1/2 text-neutral-400 text-xl"
          />
          <input
            type="text"
            placeholder="Rechercher un film, un·e réalisateur·ice…"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-12 pr-4 py-3 bg-neutral-900 rounded-2xl border border-neutral-800 focus:border-white outline-none transition-colors"
          />
        </div>

        {/* Filtres */}
        <div className="flex flex-wrap gap-3 text-sm">
          <select
            value={genreFilter}
            onChange={(e) => setGenreFilter(e.target.value)}
            className="px-3 py-2 bg-neutral-900 rounded-xl border border-neutral-800 focus:border-white outline-none cursor-pointer transition-colors"
          >
            <option value="">Tous les genres</option>
            {genres.map((genre) => (
              <option key={genre.id.toString()} value={genre.id.toString()}>
                {genre.name}
              </option>
            ))}{" "}
          </select>

          <select
            value={yearFilter}
            onChange={(e) => setYearFilter(e.target.value)}
            className="px-4 py-3 bg-neutral-900 rounded-xl border border-neutral-800 focus:border-white outline-none cursor-pointer transition-colors"
          >
            <option value="">Toutes les années</option>
            {Array.from(
              new Set(initialData.map((m) => m.release_date?.slice(0, 4)))
            )
              .filter(Boolean)
              .sort((a, b) => Number(b) - Number(a))
              .map((year) => (
                <option key={year} value={year}>
                  {year}
                </option>
              ))}
          </select>

          <select
            value={languageFilter}
            onChange={(e) => setLanguageFilter(e.target.value)}
            className="px-4 py-3 bg-neutral-900 rounded-xl border border-neutral-800 focus:border-white outline-none cursor-pointer transition-colors"
          >
            <option value="">Toutes les langues</option>
            {Array.from(new Set(initialData.map((m) => m.language)))
              .filter(Boolean)
              .map((lang) => (
                <option key={lang} value={lang}>
                  {lang}
                </option>
              ))}
          </select>

          {(search || genreFilter || yearFilter || languageFilter) && (
            <button
              onClick={() => {
                setSearch("");
                setGenreFilter("");
                setYearFilter("");
                setLanguageFilter("");
              }}
              className="px-4 py-3 bg-neutral-800 hover:bg-neutral-700 rounded-xl transition-colors flex items-center gap-2"
            >
              <Icon icon="mdi:close" />
              Réinitialiser
            </button>
          )}
        </div>
      </section>

      {/* Grille de films */}
      <section className="max-w-7xl mx-auto px-6 pb-16">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {filteredMovies.map((movie) => (
            <Link
              key={movie.id}
              href={`/movies/${movie.id}`}
              className="group relative rounded-2xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-500 block"
            >
              <div className="aspect-[16/9] relative">
                {movie.image_url ? (
                  <Image
                    src={getImageUrl(movie.image_url)}
                    alt={movie.title}
                    fill
                    className="object-cover transition-transform duration-700 group-hover:scale-110"
                  />
                ) : (
                  <div className="w-full h-full bg-neutral-800" />
                )}

                {/* Overlay hover */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

                {/* Infos du film */}
                <div className="absolute inset-0 p-5 flex flex-col justify-end">
                  <h3 className="text-xl font-bold text-white drop-shadow-md line-clamp-2 mb-1">
                    {movie.title}
                  </h3>

                  {(movie.directors || movie.release_date) && (
                    <p className="text-white/90 text-sm transition-opacity duration-300">
                      {movie.directors}
                      {movie.directors && movie.release_date && " • "}
                      {movie.release_date &&
                        new Date(movie.release_date).getFullYear()}
                    </p>
                  )}
                </div>
              </div>
            </Link>
          ))}
        </div>

        {/* Message si aucun résultat */}
        {filteredMovies.length === 0 && (
          <div className="text-center py-16">
            <Icon
              icon="mdi:film-outline"
              className="text-6xl text-neutral-700 mx-auto mb-4"
            />
            <p className="text-neutral-400 text-lg">
              Aucun film ne correspond à vos critères
            </p>
          </div>
        )}
      </section>
    </div>
  );
}
