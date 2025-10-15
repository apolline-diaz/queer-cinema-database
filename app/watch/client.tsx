"use client";

import { useMemo, useState } from "react";
import Image from "next/image";
import { getImageUrl } from "@/utils";
import Link from "next/link";
import { Icon } from "@iconify/react/dist/iconify.js";

function InfoRow({ label, value }: { label: string; value?: string | null }) {
  if (!value) return null;
  return (
    <div className="text-sm opacity-80 mr-2">
      <span className="opacity-60">{label}:</span> {value}
    </div>
  );
}

export function TVClient({
  initialData,
  featuredId,
}: {
  initialData: any[];
  featuredId: string;
}) {
  const byId = useMemo(
    () => new Map(initialData.map((m) => [m.id, m])),
    [initialData]
  );
  const [currentId, setCurrentId] = useState<string>(featuredId);
  const current = byId.get(currentId)!;

  const others = initialData.filter((m) => m.id !== currentId);

  return (
    <div className="min-h-dvh bg-black text-white">
      {/* Hero */}
      <section className="relative h-[70dvh] w-full">
        {current.image_url ? (
          <Image
            src={getImageUrl(current.image_url)}
            alt={current.title}
            fill
            className="object-cover opacity-60"
            priority
          />
        ) : (
          <div className="absolute inset-0 bg-neutral-800" />
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-black via-black/20 to-transparent" />
        <div className="relative z-10 max-w-6xl mx-auto px-6 flex flex-col justify-end h-full">
          <h1 className="text-3xl md:text-5xl font-bold">{current.title}</h1>
          {/* <div className="my-2 flex flex-wrap gap-1 text-sm opacity-90">
            <InfoRow label="Réal." value={current.directors} />
            <InfoRow label="Année" value={current.release_date} />
            <InfoRow label="Durée" value={current.runtime} />
            <InfoRow label="Langue" value={current.language} />
          </div> */}
          <div className="my-2 flex flex-col gap-1 text-sm opacity-90">
            <p className="text-xl">{current.directors} </p>
            <div className="flex flex-row gap-3">
              <p>{current.release_date} </p>
              <p>{current.runtime} min</p>
              <p>{current.language} </p>
            </div>
          </div>
          <p className="text-sm font-medium line-clamp-3">
            {current.description}
          </p>
        </div>
      </section>
      <div className="max-w-6xl mx-auto px-6 pb-6">
        <Link
          href={`/movies/${current.id}`}
          className="inline-flex mt-4 px-3 py-1 border border-rose-500 text-rose-500 rounded-xl hover:border-white hover:text-white transition-colors duration-200 w-fit"
        >
          Voir la fiche
        </Link>
        {/* Boutons de visionnage */}
        <div className="flex flex-wrap gap-2 mt-3">
          {current.links?.map((l: any, index: number) => (
            <Link
              key={l.url}
              href={l.url}
              target="_blank"
              className="flex-row flex justify-between items-center gap-2 transition-colors duration-200 px-4 py-2 bg-rose-500 text-white hover:bg-rose-700 rounded-full hover:opacity-90"
            >
              {l.label || "Voir le film"}
              <Icon icon="lsicon:play-outline" className="size-5" />
            </Link>
          ))}
        </div>
      </div>
      {/* Rail / vignettes */}
      <section className="max-w-6xl mx-auto px-6 pb-6">
        <h2 className="text-lg font-semibold mb-3">Aussi disponibles</h2>

        <div className="flex gap-3 overflow-x-auto pb-2 snap-x snap-mandatory">
          {others.length === 0
            ? // Skeletons pendant le "chargement"
              Array.from({ length: 5 }).map((_, index) => (
                <div
                  key={index}
                  className="relative animate-pulse bg-neutral-800 rounded-xl flex-shrink-0 snap-start"
                  style={{ width: "150px", height: "225px" }} // même ratio que tes affiches
                >
                  <div className="absolute bottom-0 left-0 right-0 p-2">
                    <div className="h-4 bg-neutral-700 rounded w-3/4 mb-1"></div>
                    <div className="h-3 bg-neutral-700 rounded w-1/2"></div>
                  </div>
                </div>
              ))
            : others.map((m) => (
                <button
                  key={m.id}
                  onClick={() => setCurrentId(m.id)}
                  className="group relative rounded-xl overflow-hidden flex-shrink-0 snap-start"
                  style={{ width: "150px", height: "225px" }} // ratio 2/3
                >
                  <div className="relative w-full h-full">
                    {m.image_url ? (
                      <Image
                        src={getImageUrl(m.image_url)}
                        alt={m.title}
                        fill
                        className="object-cover group-hover:scale-[1.02] transition"
                      />
                    ) : (
                      <div className="w-full h-full bg-neutral-800" />
                    )}
                  </div>
                  <div className="absolute bottom-0 left-0 right-0 p-2 text-left bg-gradient-to-t from-black/70 to-transparent text-sm font-bold">
                    {m.title}
                  </div>
                </button>
              ))}
        </div>
      </section>
    </div>
  );
}
