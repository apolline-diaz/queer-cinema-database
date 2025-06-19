/* eslint-disable react/no-unescaped-entities */

import Link from "next/link";

export default function About() {
  return (
    <div className="px-10 py-20 mb-5">
      <h2 className="text-rose-900 font-medium text-2xl mb-6">À propos</h2>
      <div className="text-black">
        <p className=" w-full font-light  mb-4">
          Ce site est né du souhait d&apos;archiver le compte Instagram
          <a
            className="text-rose-500 px-1 hover:underline"
            href="https://www.instagram.com/lawrens_shyboi/"
          >
            @lawrens_shyboi
          </a>
          que j&apos;ai créé en fin 2019 et que j&apos;ai géré jusqu&apos;en
          2023. J&apos;y partageais des références de films, de séries et
          d&apos;émissions télé qui mettaient en scène des personnes LGBTQI+ ou
          traitaient de sujets multiples entourant ces communautés.
          <br /> Je crois que les images ont beaucoup à nous dire de
          l&apos;histoire qui nous précède et du présent dans lequel nous
          vivons. Alors montrer la richesse et la diversité des films qui
          existent et des sujets abordés semblait essentiel.
          <br /> Afin de préserver les multiples références collectées et
          partagées au fil du temps grâce aux communautés (LGBTQI+ et
          d&apos;autres), j&apos;ai pensé que développer un site avec une base
          de données propre serait la solution la plus viable et accessible.
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
                <br /> Ce projet est né en France et donc le travail de
                recherche se fait depuis cette localisation et ce point de vue.
                <br /> Mon intérêt se porte surtout sur les oeuvres datées, avec
                un intérêt plus fort pour les années 90 et 2000.
                <br /> <br />
                <span className="italic font-light text-xs">
                  J&apos;ai exclu les films érotiques et pornographiques
                  mainstream.
                </span>
              </p>
            </div>
            <div className="bg-rose-50 rounded-xl p-5">
              <h3 className="font-bold mb-2">Pourquoi indexer les films?</h3>
              <p className="font-light text-black">
                L&apos;indexation permet une recherche plus spécifique des
                films. Face à la masse de productions sur les sujets LGBTQI+ qui
                existe aujourd&apos;hui, il est difficile de trouver une oeuvre
                qui correspond à nos envies ou à des sujets qui nous
                intéressent. <br />
                J&apos;ai donc choisi d&apos;indexer les films en leur associant
                des mots-clés et en utilisant d&apos;autres informations clés
                (le genre, l&apos;année de sortie, le pays de production, lea
                réalisateur-ice, le type).
                <br />
                Dans la page Catalogue, vous trouverez tous les films de la base
                de données. Ils sont classés du plus récent ajout au plus
                ancien.
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
                J&apos;ai surtout mis en avant les thématiques (sociales,
                économiques, politiques, culturelles), l&apos;identité de genre
                et l&apos;orientation sexuelle/romantique des personnages, et
                celles avec qui ils flirtent. J&apos;ai aussi intégré les
                expériences de vie, les formats et genres cinématographiques et
                les régions géographiques.
                <br />
                J&apos;ai choisi de ne pas identifier les réalisateur-ices sur
                leur identité de genre, orientation ou profession car les
                informations ne peuvent pas être vérifiées et elles peuvent
                évoluer dans le temps.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
