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
  title: "Queer Cinema Database",
  description:
    "Parcourez un catalogue mondial de films et archives LGBTQIA+, témoignant la diversité et la richesse des cinémas queer.",
  openGraph: {
    images: [`/assets/diary.svg`],
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
    <html lang="en">
      <body
        className={`${inter.className} bg-white min-h-screen text-white flex flex-col`}
      >
        <TopLoader
          color="#c42d50" // Rose foncé tirant vers le rouge
          initialPosition={0.08} // Position de départ
          crawlSpeed={200} // Vitesse de progression
          height={4} // Épaisseur de la barre
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
