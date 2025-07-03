import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import Header from "./components/header";
import Footer from "./components/footer";
import { getCanonicalUrl } from "@/utils/index";
import TopLoader from "nextjs-toploader";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  metadataBase: new URL(getCanonicalUrl()),
  title: "Queer Cinema Database | Films et Archives LGBTQI+",
  description:
    "QueerCinema.fr : base de données mondiale dédiée aux films et archives LGBTQI+. Explorez la diversité et la richesse des cinémas queer.",
  keywords: [
    "cinéma queer",
    "films LGBTQI+",
    "archives LGBTQI+",
    "queer cinema",
    "cinéma LGBT",
    "film LGBT",
    "queer",
    "LGBT",
    "base de données cinéma",
  ],
  authors: [{ name: "QueerCinema" }],
  creator: "QueerCinema",
  publisher: "QueerCinema",
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  openGraph: {
    title: "Queer Cinema Database",
    description:
      "Base de données mondiale dédiée aux films et archives LGBTQI+. Explorez la diversité et la richesse des cinémas queer.",
    url: getCanonicalUrl(),
    siteName: "Queer Cinema",
    images: ["/assets/diary.svg"],
    locale: "fr_FR",
    type: "website",
  },
  alternates: {
    canonical: "/",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="fr">
      <body
        className={`${inter.className} bg-white min-h-screen text-white flex flex-col`}
      >
        <TopLoader
          color="#c42d50" // Rose foncé tirant vers le rouge
          initialPosition={0.08} // Position de départ
          crawlSpeed={200} // Vitesse de progression
          height={3} // Épaisseur de la barre
          easing="ease"
          speed={500}
        />

        <div className="">
          <Header />
        </div>
        <main className="bg-white">{children}</main>
        <div className="mt-auto">
          <Footer />
        </div>
      </body>
    </html>
  );
}
