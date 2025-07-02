import { getCanonicalUrl } from "@/utils";
import { Metadata } from "next";

export const metadata: Metadata = {
  metadataBase: new URL(getCanonicalUrl()),
  title: "Queer Cinema Database - Ajout",
  description:
    "Ajoutez et référencez vos films facilement en utilisant Queer Cinema Database",
  alternates: {
    canonical: `/movies/create`,
  },
};

export default function Layout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return <>{children}</>;
}
