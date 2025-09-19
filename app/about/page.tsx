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
    <div className="px-[clamp(1.25rem,5vw,2.5rem)] py-20 mb-5">
      <h2 className="text-rose-500 font-bold text-2xl mb-6">À propos</h2>
      <div className="text-black">
        <p className=" w-full font-light  mb-6">
          Ce site a pour vocation d’archiver et de mettre en valeur la richesse
          et la diversité du cinéma LGBTQI+. Il s’agit de dénicher des films,
          séries et archives audiovisuelles souvent méconnus, en allant au-delà
          des circuits traditionnels français et américains, ainsi que des
          récits récurrents centrés sur le coming out ou la transition.
          <br />
          <br />
          Notre sélection met en lumière des trajectoires multiples et
          singulières, qui ne se réduisent ni au genre ni à l’orientation
          sexuelle ou romantique, mais qui reflètent toute la complexité des
          expériences LGBTQI+. Le site met l'accent en particulier sur les
          œuvres réalisées par des communautés trop souvent marginalisées, y
          compris au sein du cinéma queer lui-même : les personnes trans,
          racisées, assignées handicapées. Une attention particulière est
          apportée aux films réalisés par des personnes issues de ces mêmes
          communautés, de part les expériences communes qu'elles partagent et
          qui permettent d'apporter une vision plus authentique de leurs
          réalités. <br />
          <br />
          Le cinéma présenté ici est donc résolument politique, mais il ne se
          limite pas à l’exposition des discriminations. Il est aussi traversé
          par des élans de joie, de solidarité, d'entraide, d'amour, d'amitié,
          mais aussi de rupture, de remise en question, d'expérimentation, de
          rébellion et de résistance, toujours.
        </p>

        <div className="">
          <div className="grid grid-col-1 gap-5">
            <div className="bg-rose-50 rounded-xl p-5">
              <h3 className="font-bold mb-2">Pourquoi indexer les films ?</h3>
              <p className="font-light text-black">
                Face à la masse de productions sur les sujets LGBTQI+ qui existe
                aujourd&apos;hui, il est difficile d'identifier le contenu d'une
                œuvre au-delà du simple label "LGBT" ou "queer". <br />
                Dans la plateforme, chaque film comprend des informations
                techniques, et des mots-clés leurs sont attribués afin d'avoir
                une compréhension plus complète des sujets qu'ils abordent.
                <br />
                Les mots-clés sont déterminés selon les sujets principaux des
                œuvres : les thématiques sociales, économiques, politiques,
                culturelles, l&apos;identité et l'expression de genre et
                l&apos;orientation relationnelle (sexuelle/romantique) des
                personnages, et celles avec qui ils flirtent.
                <br /> Sont aussi intégrés : les formats, les genres
                cinématographiques et les périodes (lorsque l'histoire ne se
                déroule pas à la même période que l'année de sortie).
                <br />
                L'identité de genre et l'orientation des réalisateur-ices ou
                leur profession ne sont pas spécifiées car elles ne peuvent pas
                être vérifiées et peuvent changer. <br />
                <br />
                Dans la page Films, vous trouverez tous les films de la base de
                données. Ils sont classés du plus récent ajout au plus ancien.
                Vous pouvez faire votre recherche en sélectionnant des filtres.
                <br />
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
