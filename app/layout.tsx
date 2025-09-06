import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import Header from "./components/header";
import Footer from "./components/footer";
import { getCanonicalUrl } from "@/utils/index";
import TopLoader from "nextjs-toploader";
import { ToastProvider } from "./components/toast";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  metadataBase: new URL(getCanonicalUrl()),
  title: "Queer Cinema Database | Films et Archives LGBTQI+",
  description:
    "Une plateforme dédiée aux films et archives LGBTQI+ du monde entier. Explorez la diversité et la richesse des cinémas queer.",
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
      "Plateforme dédiée aux films et archives LGBTQI+ du monde entier. Explorez la diversité et la richesse des cinémas queer.",
    url: getCanonicalUrl(),
    siteName: "Queer Cinema",
    images: ["/assets/logo_pink.png"],
    locale: "fr_FR",
    type: "website",
  },
  alternates: {
    canonical: "/",
  },
  icons: {
    icon: [
      { url: "/assets/favicon-16x16.png", sizes: "16x16", type: "image/png" },
      { url: "/assets/favicon-32x32.png", sizes: "32x32", type: "image/png" },
    ],
    shortcut: "/assets/favicon.ico",
    apple: "/assets/apple-touch-icon.png",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="fr">
      <head>
        <link rel="icon" type="image/png" href="/assets/favicon.ico" />
        <link rel="shortcut icon" href="/assets/favicon.ico" />
      </head>
      <body
        className={`${inter.className} bg-white min-h-screen text-white flex flex-col`}
      >
        <ToastProvider>
          <TopLoader
            color="#f43f5e" // Rose foncé tirant vers le rouge
            initialPosition={0.08} // Position de départ
            crawlSpeed={200} // Vitesse de progression
            height={3} // Épaisseur de la barre
            easing="ease"
            speed={500}
            showSpinner={false}
          />
          <div className="">
            <Header />
          </div>
          <main className="bg-white">{children}</main>
          <div className="mt-auto">
            <Footer />
          </div>
        </ToastProvider>
      </body>
    </html>
  );
}
