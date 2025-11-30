/* eslint-disable react/no-unescaped-entities */
import { Metadata } from "next";
import React from "react";
import { ExternalLink } from "lucide-react";

export const metadata: Metadata = {
  title: "Ressources | Queer Cinema Database",
  description:
    "Découvrir les ressources utilisées pour les informations des films de Queer Cinema Database, et d'autres projets d'archives queer.",
  alternates: {
    canonical: "/resources",
  },
};

const ResourcesSection = () => {
  const resources = [
    {
      category: "Plateformes collaboratives et catalogues de référence",
      items: [
        { name: "AlloCiné", url: "https://www.allocine.fr" },
        { name: "Film documentaire", url: "https://www.film-documentaire.fr" },
        { name: "IMDb", url: "https://www.imdb.com" },
        { name: "Letterboxd", url: "https://letterboxd.com" },
        { name: "Mubi", url: "https://mubi.com" },
        { name: "SensCritique", url: "https://www.senscritique.com" },
        { name: "Tënk", url: "https://www.tenk.fr" },
        { name: "The Movie Database", url: "https://www.themoviedb.org" },
        { name: "UniFrance", url: "https://www.unifrance.org" },
      ],
    },
    {
      category: "Plateformes de streaming et vidéo à la demande VOD",
      items: [
        { name: "Mubi", url: "https://mubi.com" },
        { name: "Tënk", url: "https://www.tenk.fr" },
      ],
    },

    {
      category: "Distributeurs",
      items: [
        { name: "Frameline", url: "https://www.frameline.org" },
        { name: "Women Make Movies", url: "https://www.wmm.com" },
        { name: "Collectif Jeune Cinéma", url: "https://www.cjcinema.org/" },
        { name: "LightCone", url: "https://lightcone.org/fr" },
        { name: "Vucavu", url: "https://www.vucavu.com" },
        { name: "Video Data Bank", url: "https://www.vdb.org" },
        { name: "VTape", url: "https://www.vtape.org" },
        { name: "CFMDC", url: "https://www.cfmdc.org" },
        { name: "Optimale", url: "http://optimale-distribution.fr/" },
        { name: "OutPlay", url: "https://outplay.fr" },
      ],
    },
    {
      category: "Festivals et programmations queer",
      items: [
        { name: "Chéries Chéris", url: "https://www.cheries-cheris.com" },
        { name: "Cineffable", url: "https://www.cineffable.fr" },
        {
          name: "Pink Screens",
          url: "https://pinkscreens.org/fr/pink-screens",
        },
        {
          name: "Fringe!",
          url: "https://www.fringefilmfest.com/",
        },
        {
          name: "Dirty Looks",
          url: "https://dirtylooksla.org/events",
        },
      ],
    },
    {
      category: "Archives nationales",
      items: [
        { name: "BFI", url: "https://www.bfi.org.uk" },
        {
          name: "UCLA Film & Television Archive",
          url: "https://www.cinema.ucla.edu",
        },
        { name: "INA", url: "https://www.ina.fr" },
        {
          name: "Centre Simone de Beauvoir",
          url: "https://www.centre-simone-de-beauvoir.com/",
        },
      ],
    },
  ];

  const otherArchives = [
    {
      name: "LezWatch.TV",
      url: "https://lezwatchtv.com/",
      description:
        "Le site répertorie et documente les personnages queer féminins, non binaires et transgenres, ainsi que les séries télévisées, les sites web et les plateformes de streaming sur lesquels vous pouvez les trouver. ",
    },
    {
      name: "Otherness Archive",
      url: "https://othernessarchive.com",
      description:
        "Archive audiovisuelle qui documente les films queer et leurs pionnier-ères, ainsi qu'un espace dédié aux cinéastes contemporain-es.",
    },
    {
      name: "Transgender Media Portal",
      url: "https://www.transgendermediaportal.org/",
      description:
        "Transgender Media Portal est similaire à IMDb, mais il se concentre exclusivement sur la mise en avant du travail des créateur-ices trans+.",
    },
    {
      name: "Black Film Archive",
      url: "https://blackfilmarchive.com/",
      description:
        "Black Film Archive est un registre vivant des films noirs. Dans sa version actuelle, il présente les films noirs réalisés entre 1898 et 1999 actuellement disponibles en streaming.",
    },
  ];

  return (
    <div className="px-[clamp(1.25rem,5vw,2.5rem)] py-20 max-w-5xl mx-auto">
      <h3 className="font-bold text-3xl mb-4 text-pink-600">Ressources</h3>
      <p className="font-light text-gray-700 mb-8 max-w-xl">
        Toutes les informations, les synopsis et les images des films
        proviennent de plateformes et bases de données spécialisées.
      </p>

      <div className="space-y-10">
        {resources.map((category, index) => (
          <div
            key={index}
            className="p-6 rounded-2xl bg-white border border-pink-100 shadow-sm hover:shadow-md transition-shadow"
          >
            <h4 className="font-semibold text-lg text-pink-500 mb-3">
              {category.category}
            </h4>
            <div className="flex flex-wrap gap-3">
              {category.items.map((item, itemIndex) => (
                <a
                  key={itemIndex}
                  href={item.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-gradient-to-br from-white to-pink-50 border border-pink-200 text-gray-700 hover:from-pink-50 hover:to-white hover:text-pink-600 hover:border-pink-400 transition-colors text-sm shadow-sm"
                >
                  {item.name}
                  <ExternalLink className="w-4 h-4" />
                </a>
              ))}
            </div>
          </div>
        ))}
      </div>

      <div className="mt-16 pt-10 border-t border-pink-200">
        <h3 className="font-bold text-2xl mb-4 text-pink-600">
          Archives et bases de données queer
        </h3>
        <p className="font-light text-gray-700 mb-6 max-w-xl">
          Des projets qui documentent, préservent et diffusent les créations
          LGBTQI+.
        </p>

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {otherArchives.map((archive, idx) => (
            <a
              key={idx}
              href={archive.url}
              target="_blank"
              rel="noopener noreferrer"
              className="p-5 rounded-2xl bg-white border border-pink-200 shadow-sm hover:shadow-lg hover:border-pink-400 transition-all flex flex-col gap-2 group"
            >
              <div className="flex flex-row gap-2 items-center">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={`https://www.google.com/s2/favicons?sz=64&domain_url=${archive.url}`}
                  alt={`${archive.name} favicon`}
                  className="w-6 h-6 rounded-sm"
                />
                <span className="font-semibold text-black group-hover:text-pink-600 flex items-center gap-2">
                  {archive.name}
                  <ExternalLink className="w-4 h-4 opacity-70 group-hover:opacity-100" />
                </span>
              </div>
              <p className="text-sm text-gray-600 mt-1">
                {archive.description}
              </p>
            </a>
          ))}
        </div>
      </div>
    </div>
  );
};

export default ResourcesSection;
