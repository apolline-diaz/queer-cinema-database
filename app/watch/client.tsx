"use client";

import { useMemo, useState } from "react";
import Image from "next/image";
import { getImageUrl } from "@/utils";
import Link from "next/link";

function InfoRow({ label, value }: { label: string; value?: string | null }) {
  if (!value) return null;
  return (
    <div className="text-sm opacity-80">
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

        <div className="absolute inset-0 bg-gradient-to-t from-black via-black/40 to-black/10" />
        <div className="relative z-10 max-w-5xl mx-auto px-6 py-15 flex flex-col justify-end h-full">
          <h1 className="text-3xl md:text-5xl font-bold">{current.title}</h1>
          <div className="mt-2 flex flex-wrap gap-4 text-sm opacity-90">
            <InfoRow label="Réal." value={current.directors} />
            <InfoRow label="Année" value={current.release_date} />
            <InfoRow label="Durée" value={current.runtime} />
            <InfoRow label="Langue" value={current.language} />
          </div>
          <p className="text-sm font-medium py-4 line-clamp-3">
            {current.description}
          </p>
          <Link
            href={`/movies/${current.id}`}
            className="inline-block mt-4 px-5 py-2 hover:bg-rose-500 hover:text-white text-rose-500 shadow-md border border-rose-500 rounded-xl transition-colors duration-200"
          >
            Voir la fiche
          </Link>

          {/* Boutons de visionnage */}
          <div className="mt-4 flex flex-wrap gap-2">
            {current.links.map((l: any) => (
              <a
                key={l.url}
                href={l.url}
                target="_blank"
                className="px-4 py-2 bg-white text-black hover:bg-rose-900 rounded-xl hover:opacity-90"
              >
                {l.label || "Voir le film"}
              </a>
            ))}
          </div>
        </div>
      </section>

      {/* Rail / vignettes */}
      <section className="max-w-6xl mx-auto px-6 py-6">
        <h2 className="text-lg font-semibold mb-3">Aussi disponible</h2>
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-3">
          {others.map((m) => (
            <button
              key={m.id}
              onClick={() => setCurrentId(m.id)}
              className="group relative rounded-xl overflow-hidden border border-white/10"
            >
              {m.image_url ? (
                <div className="aspect-[2/3] relative">
                  <Image
                    src={getImageUrl(m.image_url)}
                    alt={m.title}
                    fill
                    className="object-cover group-hover:scale-[1.02] transition"
                  />
                </div>
              ) : (
                <div className="aspect-[2/3] bg-neutral-800" />
              )}
              <div className="absolute bottom-0 left-0 right-0 p-4 text-left bg-gradient-to-t from-black/70 to-transparent text-md fond-bold">
                {m.title}
              </div>
            </button>
          ))}
        </div>
      </section>
    </div>
  );
}
