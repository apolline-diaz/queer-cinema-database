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
  ];

  return (
    <div className="rounded-xl px-[clamp(1.25rem,5vw,2.5rem)] py-20">
      <h3 className="font-bold text-2xl mb-4 text-rose-500">Ressources</h3>
      <p className="font-light text-gray-700 mb-6">
        Toutes informations, synopsis et images des films sont tirés des sites
        suivants :
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
      {/* Section archives alternatives */}
      <div className="mt-10 pt-10 border-t border-rose-200">
        <h3 className="font-bold text-xl mb-4 text-rose-500">
          Archives, répertoires et bases de données de films queer
        </h3>
        <p className="font-light text-gray-700 mb-6">
          Des sites qui recensent et mettent en avant des films sur et par les
          personnes LGBTQI+.
        </p>
        <div className="flex flex-col sm:flex-row gap-3">
          {otherArchives.map((archive, idx) => (
            <div
              key={idx}
              className="bg-white border border-rose-200 rounded-2xl p-4 shadow-sm hover:shadow-md transition-shadow"
            >
              <a
                href={archive.url}
                target="_blank"
                rel="noopener noreferrer"
                className="flex flex-col items-start gap-2 text-black hover:text-rose-500"
              >
                <span className="flex flex-row gap-2 items-center font-semibold">
                  {archive.name}
                </span>

                <p className="text-sm text-gray-600 mt-2">
                  {archive.description}
                </p>
              </a>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default ResourcesSection;
