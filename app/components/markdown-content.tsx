"use client";

import { ReactNode } from "react";

interface MarkdownContentProps {
  content: string;
  title?: string;
  lastUpdated?: string;
  children?: ReactNode;
}

export function MarkdownContent({
  content,
  title,
  lastUpdated,
  children,
}: MarkdownContentProps) {
  return (
    <div className="max-w-4xl mx-auto p-10 py-20">
      {title && (
        <header className="mb-8 border-b border-gray-200 pb-6">
          <h1 className="text-2xl font-bold text-gray-900 mb-2">{title}</h1>
          {lastUpdated && (
            <p className="text-sm text-gray-500">
              Dernière mise à jour : {lastUpdated}
            </p>
          )}
        </header>
      )}

      {children}

      <div className="space-y-8">
        <article
          className={`text-black prose prose-lg max-w-none
            prose-headings:text-gray-900 
            prose-p:text-gray-700 
            prose-a:text-blue-600 
            prose-a:no-underline 
            hover:prose-a:underline
            prose-strong:text-gray-900
            prose-ul:text-gray-700
            prose-ol:text-gray-700`}
          dangerouslySetInnerHTML={{ __html: content }}
        />
      </div>

      <style jsx>{`
        /* Styles pour les sections h2 */
        :global(article h2) {
          background-color: #f8fafc;
          border: 1px solid #e2e8f0;
          border-radius: 0.5rem;
          padding: 1rem;
          margin-top: 2rem;
          margin-bottom: 0.5rem;
          font-size: 1.25rem;
          font-weight: 600;
          box-shadow: 0 1px 3px 0 rgba(0, 0, 0, 0.1);
        }

        /* Styles pour le contenu qui suit h2 */
        :global(article h2 + p),
        :global(article h2 + ul),
        :global(article h2 + ol) {
          background-color: white;
          border: 1px solid #f1f5f9;
          border-radius: 0.5rem;
          padding: 1rem;
          margin-top: 0.5rem;
          margin-left: 1rem;
          box-shadow: 0 1px 2px 0 rgba(0, 0, 0, 0.05);
        }

        /* Styles pour les listes dans les sections */
        :global(article h2 ~ ul),
        :global(article h2 ~ ol) {
          background-color: white;
          border: 1px solid #f1f5f9;
          border-radius: 0.5rem;
          padding: 1rem;
          margin-left: 1rem;
          margin-top: 0.5rem;
        }

        /* Styles pour les paragraphes qui suivent les listes */
        :global(article h2 ~ p) {
          background-color: white;
          border: 1px solid #f1f5f9;
          border-radius: 0.5rem;
          padding: 1rem;
          margin-left: 1rem;
          margin-top: 0.5rem;
        }
      `}</style>
    </div>
  );
}
