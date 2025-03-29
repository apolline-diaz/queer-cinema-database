"use client";

import { getImageUrl } from "@/utils";
import { Image } from "@/app/components/image";
import Link from "next/link";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { deleteMovie } from "../server-actions/movies/delete-movie";
import { DeleteModal } from "./delete-modal";

interface CardProps {
  id: string;
  title: string;
  release_date?: string | null;
  image_url?: string | null;
}

export default function Card({
  id,
  title,
  release_date,
  image_url,
}: CardProps) {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const router = useRouter();

  const handleDeleteClick = (e: React.MouseEvent) => {
    e.preventDefault(); // Empêche la navigation vers la page de liste
    e.stopPropagation(); // Empêche la propagation jusqu'au lien parent
    setIsModalOpen(true);
  };

  const handleConfirmDelete = async () => {
    setIsDeleting(true);
    try {
      const result = await deleteMovie(id);

      if (result.success) {
        // La revalidation du chemin se fait dans la server action
        router.refresh(); // Force un rafraîchissement de la page
      } else {
        // Gérer l'erreur (vous pourriez ajouter un state pour afficher l'erreur)
        console.error(result.message);
      }
    } catch (error) {
      console.error("Erreur lors de la suppression:", error);
    } finally {
      setIsDeleting(false);
      setIsModalOpen(false);
    }
  };
  return (
    <>
      {" "}
      <div className="gap-4 relative group">
        <div className="group rounded-xl overflow-hidden flex flex-col transition-transform">
          <div className="relative h-48 overflow-hidden">
            <Link href={`/movies/${id}`}>
              <Image
                src={getImageUrl(image_url)}
                fill="true"
                alt={title}
                className="object-cover w-full h-full  transform transition-transform duration-700 ease-in-out group-hover:scale-110 group-hover:brightness-50"
                title={title}
              />
            </Link>
            <div className="absolute bottom-0 left-0 w-full p-5 bg-gradient-to-t via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300">
              <div className="text-md font-semibold uppercase">{title}</div>
              <p className="text-sm text-gray-300">{release_date}</p>
              {/* <p className="absolute text-sm text-gray-200 mt-2">{description}</p> */}
            </div>
            <button
              onClick={handleDeleteClick}
              className="absolute top-2 right-2 z-10 bg-black bg-opacity-60 p-2 rounded-full text-rose-500 transition-all duration-300 ease-in-out opacity-100 visible hover:bg-rose-500 hover:text-white"
              title="Supprimer cette liste"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="16"
                height="16"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M3 6h18"></path>
                <path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6"></path>
                <path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2"></path>
              </svg>
            </button>
          </div>
        </div>
        {/* Modal de confirmation de suppression */}
        <DeleteModal
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          onConfirm={handleConfirmDelete}
          title={title}
        />
      </div>
    </>
  );
}
