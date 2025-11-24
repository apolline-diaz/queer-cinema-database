import HomeCard from "@/app/components/home-card";
import { getImageUrl } from "@/utils";
import { Suspense } from "react";
import Hero from "./components/hero";
import { getLatestMovies, getTopMovies } from "@/app/server-actions/movies";
import { getMoviesToWatch } from "@/app/server-actions/movies/get-movies-to-watch";
import { getCollections } from "@/app/server-actions/lists/get-collections";
import Link from "next/link";
import { Icon } from "@iconify/react";
import React from "react";
import { WatchGrid } from "./components/watch-grid";
import { readLinks } from "@/lib/tv-links";
import { LatestMoviesGrid } from "./components/lastest-movies-grid";

export const revalidate = 3600; // revalidate every hour (Incremental Static Regeneration)

export default function HomePage() {
  return (
    <main className="w-full bg-white">
      <Suspense fallback={<HeroSkeleton />}>
        <HeroSection />
      </Suspense>
      <Suspense fallback={<MoviesSkeleton />}>
        <LatestMoviesSection />
      </Suspense>
      <Suspense fallback={<MoviesSkeleton />}>
        <WatchSection />
      </Suspense>
      <Suspense fallback={<CollectionsSkeleton />}>
        <CollectionsSection />
      </Suspense>
    </main>
  );
}

// Chaque section charge ses données indépendamment
async function HeroSection() {
  return (
    <div className="w-full">
      <Hero />
    </div>
  );
}

async function LatestMoviesSection() {
  try {
    const latestMovies = await getLatestMovies();
    const movies = latestMovies.slice(0, 3);
    return (
      <main className="w-full bg-white">
        <LatestMoviesGrid movies={movies} />
      </main>
    );
  } catch (error) {
    return (
      <p>Erreur lors du chargement des films : {(error as Error).message}</p>
    );
  }
}

async function getFeaturedMovies() {
  const tv = await readLinks();
  const ids = Object.keys(tv.items);
  if (ids.length === 0) return [];

  const movies = await getMoviesToWatch(ids.slice(0, 3)); // limiter à 3 films

  const moviesWithLinks = movies.map((m) => ({
    ...m,
    links: tv.items[m.id] || [],
  }));

  return moviesWithLinks;
}

async function WatchSection() {
  const moviesWithLinks = await getFeaturedMovies(); // récupère les 3 films à visionner

  if (moviesWithLinks.length === 0) return null;

  return (
    <div className="w-full">
      <WatchGrid movies={moviesWithLinks} />
    </div>
  );
}

async function CollectionsSection() {
  const collections = await getCollections(); // Se charge en arrière-plan

  return (
    <div className="px-[clamp(1.25rem,5vw,2.5rem)] pt-8 py-5">
      <h2 className="text-3xl lg:text-4xl font-bold text-black mb-5">
        Collections
      </h2>
      {collections.length > 0 && (
        <div className="flex flex-col space-y-5 mb-10">
          {collections.map((collection) => (
            <div key={collection.id.toString()} className="flex flex-col">
              <div className="flex flex-row justify-between items-end mb-4 gap-2">
                <div className="flex flex-col gap-3 min-w-0 flex-1">
                  <h2 className="text-xl sm:text-2xl font-semibold leading-tight text-rose-500 line-clamp-3">
                    {collection.title}
                  </h2>
                </div>

                <Link
                  href={`/lists/${collection.id}`}
                  className="border rounded-xl px-2 py-1 border-rose-500 text-rose-500 hover:border-rose-500 hover:bg-rose-500 hover:text-white text-sm whitespace-nowrap flex-shrink-0"
                >
                  Tout voir{" "}
                  <Icon icon="mdi:chevron-right" className="inline size-4" />
                </Link>
              </div>

              {"lists_movies" in collection && collection.lists_movies && (
                <div className="flex flex-row-1 mb-3 gap-3 overflow-auto max-h-[400px]">
                  {collection.lists_movies.map((listMovie) => (
                    <HomeCard
                      key={`${listMovie.movies.title}-${listMovie.movies.id}`}
                      id={listMovie.movies.id}
                      title={listMovie.movies.title}
                      release_date={listMovie.movies.release_date || ""}
                      image_url={getImageUrl(listMovie.movies.image_url || "")}
                    />
                  ))}
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

// Skeletons pour l'affichage immédiat
function HeroSkeleton() {
  return (
    <div className="w-full h-[500px] bg-gradient-to-br from-rose-100 via-pink-50 to-purple-100 relative overflow-hidden">
      {/* Animated background */}
      <div className="absolute inset-0 bg-gradient-to-r from-rose-200/50 to-purple-200/50 animate-pulse"></div>

      {/* Content skeleton */}
      <div className="absolute inset-0 flex items-center justify-center">
        <div className="text-center space-y-4 z-10">
          <div className="w-80 h-12 bg-white/30 rounded-lg animate-pulse backdrop-blur-sm"></div>
          <div className="w-96 h-6 bg-white/20 rounded animate-pulse backdrop-blur-sm"></div>
          <div className="w-32 h-10 bg-rose-300/50 rounded-lg animate-pulse backdrop-blur-sm mx-auto mt-6"></div>
        </div>
      </div>

      {/* Decorative elements */}
      <div className="absolute top-10 right-10 w-20 h-20 bg-white/10 rounded-full animate-bounce"></div>
      <div className="absolute bottom-10 left-10 w-16 h-16 bg-rose-300/20 rounded-full animate-pulse"></div>
    </div>
  );
}

function MoviesSkeleton() {
  return (
    <div className="w-full p-10">
      {/* Title skeleton */}
      <div className="flex flex-row justify-between mb-6">
        <div className="w-40 h-8 bg-gradient-to-r from-rose-300 to-rose-200 rounded animate-pulse"></div>
      </div>

      {/* Carousel skeleton */}
      <div className="mb-8 h-80 bg-gradient-to-br from-gray-100 to-gray-200 rounded-xl relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/50 to-transparent animate-shimmer"></div>
        <div className="absolute inset-4 space-y-4">
          <div className="w-2/3 h-6 bg-gray-300/60 rounded"></div>
          <div className="w-1/2 h-4 bg-gray-300/40 rounded"></div>
          <div className="w-1/3 h-10 bg-rose-300/40 rounded-lg mt-8"></div>
        </div>
      </div>

      {/* Movie grid skeleton */}
      <div className="flex gap-4 overflow-x-auto pb-4">
        {[...Array(8)].map((_, i) => (
          <div key={i} className="flex-shrink-0 group">
            <div className="w-44 h-64 bg-gradient-to-br from-gray-200 to-gray-300 rounded-xl relative overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-t from-gray-400/20 to-transparent"></div>
              <div className="absolute bottom-4 left-4 right-4">
                <div className="w-full h-4 bg-white/60 rounded mb-2"></div>
                <div className="w-2/3 h-3 bg-white/40 rounded"></div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function CollectionsSkeleton() {
  return (
    <div className="pl-10 space-y-8 pb-10">
      {[...Array(3)].map((_, i) => (
        <div key={i} className="flex flex-col">
          {/* Collection header */}
          <div className="flex flex-row justify-between items-end pr-10 mb-6 gap-4">
            <div className="flex flex-col gap-3 min-w-0 flex-1">
              <div className="w-64 h-8 bg-gradient-to-r from-rose-300 to-pink-300 rounded animate-pulse"></div>
              <div className="w-24 h-6 bg-rose-200 rounded-full animate-pulse"></div>
            </div>
            <div className="w-28 h-10 bg-gradient-to-r from-rose-200 to-rose-300 rounded-xl animate-pulse"></div>
          </div>

          {/* Movies row */}
          <div className="flex gap-4 overflow-auto">
            {[...Array(6)].map((_, j) => (
              <div key={j} className="flex-shrink-0">
                <div className="w-40 h-60 bg-gradient-to-br from-gray-200 to-gray-300 rounded-lg relative overflow-hidden">
                  <div className="absolute inset-0 bg-gradient-to-t from-gray-400/30 to-transparent"></div>
                  <div className="absolute bottom-3 left-3 right-3">
                    <div className="w-full h-3 bg-white/70 rounded mb-1"></div>
                    <div className="w-3/4 h-2 bg-white/50 rounded"></div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}
