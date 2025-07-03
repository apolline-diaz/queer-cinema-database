import { getMarkdownContent } from "@/lib/markdown";
import { MarkdownContent } from "@/app/components/markdown-content";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Politique de Confidentialité",
  description: "Notre politique de confidentialité et protection des données",
};

export default async function PrivacyPolicyPage() {
  const content = await getMarkdownContent("privacy-policy.md");

  if (!content) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-8">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">
            Politique de Confidentialité
          </h1>
          <p className="text-gray-600">
            Impossible de charger la politique de confidentialité.
          </p>
        </div>
      </div>
    );
  }

  return (
    <MarkdownContent
      content={content}
      title="Politique de Confidentialité"
      lastUpdated={new Date().toLocaleDateString("fr-FR")}
    >
      {/* Vous pouvez ajouter du contenu supplémentaire ici */}
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
        <p className="text-sm text-blue-800">
          <strong>Note :</strong> Cette politique s&apos;applique à tous les
          services proposés par notre plateforme.
        </p>
      </div>
    </MarkdownContent>
  );
}
