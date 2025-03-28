import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import Header from "./components/header";
import Footer from "./components/footer";
import { getCanonicalUrl } from "@/utils/index";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  metadataBase: new URL(getCanonicalUrl()),
  title: "Movie Diary",
  description:
    "Le site de référence des films LGBTQIA+ : découvrez l'histoire du cinéma et des représentations queer avec Movie Diary .",
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
        className={`${inter.className} bg-neutral-950 min-h-screen text-white flex flex-col`}
      >
        <div className="mb-10">
          <Header />
        </div>
        <main className="">{children}</main>
        <div className="mt-auto">
          <Footer />
        </div>
      </body>
    </html>
  );
}
