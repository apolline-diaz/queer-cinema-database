import { getCanonicalUrl } from "@/utils";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Movie Diary - Ajout",
  description:
    "Ajoutez et référencez vos films facilement en utilisant Movie Diary",
  alternates: {
    canonical: `/movies/contribute`,
  },
};

export default function Layout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return <>{children}</>;
}
