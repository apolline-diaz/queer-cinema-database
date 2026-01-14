"use client";

/* eslint-disable react/no-unescaped-entities */
// import { Metadata } from "next";
import React, { useState } from "react";
import {
  ExternalLink,
  ChevronDown,
  ChevronUp,
  Film,
  Users,
  Database,
  Package,
  Calendar,
  Archive,
} from "lucide-react";

// export const metadata: Metadata = {
//   title: "Ressources | Queer Cinema Database",
//   description:
//     "Découvrir les ressources utilisées pour les informations des films de Queer Cinema Database, et d'autres projets d'archives queer.",
//   alternates: {
//     canonical: "/resources",
//   },
// };

const ResourcesSection = () => {
  const [expandedCategories, setExpandedCategories] = useState<
    Record<string, boolean>
  >({});

  const getCategoryIcon = (category: string) => {
    const icons: Record<string, any> = {
      "Plateformes communautaires": Users,
      "Plateformes VOD": Film,
      "Bases de données": Database,
      Distributeurs: Package,
      Festivals: Calendar,
      "Archives nationales": Archive,
    };
    return icons[category] || Database;
  };

  const resources = [
    {
      category: "Plateformes communautaires",
      items: [
        { name: "Letterboxd", url: "https://letterboxd.com" },
        { name: "Mubi", url: "https://mubi.com" },
        { name: "Tënk", url: "https://www.tenk.fr" },
        { name: "SensCritique", url: "https://www.senscritique.com" },
        { name: "AlloCiné", url: "https://www.allocine.fr" },
      ],
    },
    {
      category: "Plateformes VOD",
      items: [
        { name: "Mubi", url: "https://mubi.com" },
        { name: "Tënk", url: "https://www.tenk.fr" },
        { name: "Prime Video", url: "https://www.primevideo.com/" },
      ],
    },
    {
      category: "Bases de données",
      items: [
        { name: "The Movie Database", url: "https://www.themoviedb.org" },
        { name: "IMDb", url: "https://www.imdb.com" },
        { name: "UniFrance", url: "https://www.unifrance.org" },
        { name: "Film documentaire", url: "https://www.film-documentaire.fr" },
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
      category: "Festivals",
      items: [
        { name: "Chéries Chéris", url: "https://www.cheries-cheris.com" },
        { name: "Cineffable", url: "https://www.cineffable.fr" },
        {
          name: "Pink Screens",
          url: "https://pinkscreens.org/fr/pink-screens",
        },
        { name: "Fringe!", url: "https://www.fringefilmfest.com/" },
        { name: "Queer East", url: "https://queereast.org.uk/" },
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
        "Le site répertorie et documente les personnages queer féminins, non binaires et transgenres, ainsi que les séries télévisées, les sites web et les plateformes de streaming sur lesquels vous pouvez les trouver.",
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
      name: "Archivo de la Mermoria Trans",
      url: "https://archivotrans.ar/",
      description:
        "Les Archives de la Mémoire Trans (AMT) préservent l’histoire des personnes trans en Argentine à travers plus de 15 000 documents et objets. Fondées par María Belén Correa, elles visent à lutter contre la transphobie, promouvoir l’éducation et l’intégration sociale, et servir de ressource documentaire et mémoire collective pour la communauté trans.",
    },
    {
      name: "Queer Documentaries",
      url: "https://queerdocumentaries.org/en/mainpage/",
      description:
        "Queer Documentaries (QDocs), lancée en 2013, est une plateforme qui rassemble des documentaires LGBTI+ du monde entier pour les rendre visibles et contribuer à la mémoire queer. Elle diffuse des récits qui questionnent les normes de genre et offrent un espace aux histoires complexes des personnes LGBTI+, soutenant leur expression dans un contexte de liberté d’expression limitée.",
    },
  ];

  const toggleCategory = (category: string) => {
    setExpandedCategories((prev) => ({
      ...prev,
      [category]: !prev[category],
    }));
  };

  return (
    <div className="bg-gradient-to-br from-pink-50 to-purple-50 px-[clamp(1.25rem,5vw,2.5rem)] py-20">
      <div className="max-w-6xl mx-auto">
        <div className="mb-12">
          <h1 className="font-bold text-4xl mb-4 text-pink-600">Ressources</h1>
          <p className="text-gray-700 text-lg">
            Toutes les informations, les synopsis et les images des films sont
            tirés des sites suivants
          </p>
        </div>

        {/* Grille de cartes pour les catégories */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-16">
          {resources.map((category, index) => {
            const Icon = getCategoryIcon(category.category);
            const isExpanded = expandedCategories[category.category];

            return (
              <div
                key={index}
                className="bg-white rounded-2xl shadow-sm hover:shadow-md transition-all border border-pink-100 overflow-hidden"
              >
                <button
                  onClick={() => toggleCategory(category.category)}
                  className="w-full px-6 py-4 flex items-center justify-between transition-colors"
                >
                  <div className="flex items-center gap-3">
                    <div className="bg-pink-100 p-2 rounded-lg">
                      <Icon className="w-5 h-5 text-pink-600" />
                    </div>
                    <h3 className="font-semibold text-lg text-gray-900">
                      {category.category}
                    </h3>
                    <span className="text-sm text-gray-500 bg-gray-100 px-2 py-1 rounded-full">
                      {category.items.length}
                    </span>
                  </div>
                  {isExpanded ? (
                    <ChevronUp className="w-5 h-5 text-pink-600" />
                  ) : (
                    <ChevronDown className="w-5 h-5 text-pink-600" />
                  )}
                </button>

                {isExpanded && (
                  <div className="px-6 pb-6 pt-2">
                    <div className="flex flex-wrap gap-2">
                      {category.items.map((item, itemIndex) => (
                        <a
                          key={itemIndex}
                          href={item.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-pink-50 rounded-full border border-pink-200 hover:bg-pink-100 hover:border-pink-300 transition-colors text-sm text-gray-700 hover:text-pink-800"
                        >
                          {item.name}
                          <ExternalLink className="w-3 h-3" />
                        </a>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {/* Section archives alternatives */}
        <div className="bg-white rounded-2xl shadow-sm border border-pink-100 p-8">
          <h2 className="font-bold text-2xl mb-3 text-pink-600">
            Archives, répertoires et bases de données de films queer
          </h2>
          <p className="text-gray-700 mb-6">
            Des sites qui recensent et mettent en avant des films sur et par les
            personnes LGBTQI+
          </p>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {otherArchives.map((archive, idx) => (
              <a
                key={idx}
                href={archive.url}
                target="_blank"
                rel="noopener noreferrer"
                className="bg-gradient-to-br from-pink-50 to-purple-50 border border-pink-200 rounded-xl p-5 hover:shadow-lg transition-all group"
              >
                <h3 className="font-semibold text-lg text-gray-900 group-hover:text-pink-600 transition-colors mb-2 flex items-center gap-2">
                  {archive.name}
                  <ExternalLink className="w-4 h-4 opacity-0 group-hover:opacity-100 transition-opacity" />
                </h3>
                <p className="text-sm text-gray-600 leading-relaxed">
                  {archive.description}
                </p>
              </a>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ResourcesSection;
