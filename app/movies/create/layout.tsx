import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Ajouter un film | Queer Cinema Database",
  description: "Ajoutez un nouveau film à la base de données.",
};

export default function Layout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return <>{children}</>;
}
