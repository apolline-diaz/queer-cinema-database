/* eslint-disable react/no-unescaped-entities */
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "À propos | Queer Cinema Database",
  description:
    "En savoir plus sur Queer Cinema Database, son objectif, sa ligne éditoriale et ses ressources.",
  alternates: {
    canonical: "/about",
  },
};

export default function AboutPage() {
  return (
    <div className="px-10 py-20 mb-5">
      <h2 className="text-rose-500 font-bold text-2xl mb-6">À propos</h2>
      <div className="text-black">
        <p className=" w-full font-light  mb-4">
          Ce site a pour vocation d'archiver et de valoriser la diversité du
          cinéma LGBTQI+, en mettant l'accent sur des œuvres sélectionnées pour
          leur singularité artistique, leur engagement politique et leur vision
          incarnée depuis des regards situés. L'objectif est de dénicher des
          films, séries et archives audiovisuelles souvent méconnus du grand
          public, en explorant les productions au-delà des circuits
          traditionnels français et américains.
          <br />
          Cette démarche vise particulièrement à mettre en lumière des
          représentations authentiques et nuancées de populations insuffisamment
          représentées à l'écran : les femmes, les personnes trans, les
          personnes racisées et les personnes assignées handicapées.
          <br />
          Les images et les récits audiovisuels portent en eux une part
          importante de notre histoire collective et de notre compréhension du
          monde contemporain. En rassemblant ces références dans une base de
          données accessible, ce site souhaite contribuer à préserver et
          diffuser cette diversité cinématographique.
        </p>

        <div className="text-rose-900 ">
          <div className="grid grid-col-1 gap-5">
            <div className="bg-rose-50 rounded-xl p-5">
              <h3 className="font-bold mb-2">Le choix des films</h3>
              <p className="font-light text-black">
                Cette base de données n&apos;a pas pour objectif d&apos;être
                exhaustive et d&apos;inclure toutes les oeuvres existantes. Elle
                provient de recherches personnelles et collectives.
                L&apos;intérêt est de présenter des oeuvres qui portent un
                certain travail cinématographique, un discours, ou faisant
                partie d&apos;une certaine histoire des communautés LGBQTI+ à
                travers le monde.
                <br /> Ce projet est né en France et le travail de recherche se
                fait depuis cette localisation.
                <br /> Un intérêt particulier est porté à la période des années
                90 et 2000.
                <br /> <br />
                <span className="italic font-light text-xs">
                  Les films érotiques et pornographiques mainstream ne sont pas
                  traités.
                </span>
              </p>
            </div>
            <div className="bg-rose-50 rounded-xl p-5">
              <h3 className="font-bold mb-2">Pourquoi indexer les films?</h3>
              <p className="font-light text-black">
                L&apos;indexation permet une recherche plus spécifique des
                films. Face à la masse de productions sur les sujets LGBTQI+ qui
                existe aujourd&apos;hui, il est difficile de trouver une oeuvre
                qui correspond à des critères et sujets spécifiques. <br />
                C'est pourquoi il est essentiel d&apos;indexer les films en leur
                associant des mots-clés et en utilisant d&apos;autres
                informations clés (lea réalisateur-ice, le genre, l&apos;année
                de sortie la durée, le pays de production, le format, la
                langue). Cela permet une meilleure compréhension du contenu des
                oeuvres et apporte des informations plus complètes au-delà du
                simple label "queer".
                <br />
                Dans la page Films, vous trouverez tous les films de la base de
                données. Ils sont classés du plus récent ajout au plus ancien.
              </p>
              <br />
            </div>
            <div className="bg-rose-50 rounded-xl p-5">
              <h3 className="font-bold mb-2">Le choix des mots-clés</h3>
              <p className="font-light text-black">
                Afin de mieux répertorier les films, les mots-clés qui leur sont
                associés permettent à l&apos;utilisateur d&apos;avoir une vision
                globale des sujets abordés.
                <br />
                Sont mis en avant : les thématiques (sociales, économiques,
                politiques, culturelles), l&apos;identité de genre et
                l&apos;orientation sexuelle/romantique des personnages, et
                celles avec qui ils flirtent.
                <br /> Sont aussi intégrés : les expériences de vie, les formats
                et genres cinématographiques et les régions géographiques.
                <br />
                L'identité de genre et l'orientation des réalisateur-ices ou
                leur profession n'est pas spécifiée car elle ne peut pas être
                vérifiée et peut changer.
              </p>
            </div>
            <div className="bg-rose-50 rounded-xl p-5">
              <h3 className="font-bold mb-2">Les ressources</h3>
              <p className="font-light text-black">
                Les informations des films sont tirées de sites et
                d'organisations dédiés au cinéma tels que :
                <br /> - Plateformes communautaires : Letterboxd, Mubi, Tënk,
                SensCritique, AlloCiné
                <br /> - Plateformes VOD : Mubi, Tënk
                <br /> - Bases de données : The Movie Database, IMDB, UniFrance,
                Film documentaire
                <br /> - Distributeurs : Frameline, Women Make Movies, Vucavu,
                Video Data Bank, VTape, CFMDC, Optimale, OutPlay,
                <br /> - Festivals : Chéries Chéris, Cineffable, Pink Screens
                <br /> - Archives nationales : BFI, UCLA, INA, Centre Simone de
                Beauvoir
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
