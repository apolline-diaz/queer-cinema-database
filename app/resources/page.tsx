import React from "react";
import { ExternalLink } from "lucide-react";

const ResourcesSection = () => {
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
        {
          name: "Fringe!",
          url: "https://www.fringefilmfest.com/",
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
      name: "Otherness Archive",
      url: "https://othernessarchive.com",
      description:
        "Base de données de films d’hommes trans et de récits alternatifs.",
    },
  ];

  return (
    <div className="rounded-xl px-[clamp(1.25rem,5vw,2.5rem)] py-20">
      <h3 className="font-bold text-2xl mb-4 text-rose-500">Ressources</h3>
      <p className="font-light text-gray-700 mb-6">
        Les informations des films sont tirées de sites et d&apos;organisations
        dédiés au cinéma :
      </p>

      <div className="space-y-5">
        {resources.map((category, index) => (
          <div key={index} className="border-l-3 border-rose-200">
            <h4 className="font-semibold text-black mb-2">
              {category.category}
            </h4>
            <div className="flex flex-wrap gap-2">
              {category.items.map((item, itemIndex) => (
                <a
                  key={itemIndex}
                  href={item.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1 px-3 py-1 bg-white rounded-full border border-rose-200 hover:bg-rose-100 hover:border-rose-300 transition-colors text-sm text-gray-700 hover:text-rose-800"
                >
                  {item.name}
                  <ExternalLink className="w-3 h-3" />
                </a>
              ))}
            </div>
          </div>
        ))}
      </div>
      {/* Nouvelle section archives alternatives */}
      <div className="mt-10 pt-10 border-t border-rose-200">
        <h3 className="font-bold text-xl mb-4 text-rose-500">
          Archives alternatives
        </h3>
        <p className="font-light text-gray-700 mb-6">
          D&apos;autres initiatives qui travaillent à documenter et rendre
          visibles des films qui mettent en scène les récits et personnages
          queer :
        </p>
        <div className="flex flex-wrap gap-3">
          {otherArchives.map((archive, idx) => (
            <a
              key={idx}
              href={archive.url}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-4 py-2 bg-white rounded-full border border-rose-200 hover:bg-rose-100 hover:border-rose-300 transition-colors text-sm text-gray-700 hover:text-rose-800"
            >
              {archive.name}
              <ExternalLink className="w-4 h-4" />
            </a>
          ))}
        </div>
      </div>
    </div>
  );
};

export default ResourcesSection;
