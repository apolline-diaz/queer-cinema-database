"use client";

import { useEffect, useRef } from "react";

interface DeleteModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title: string;
}

export const DeleteModal: React.FC<DeleteModalProps> = ({
  isOpen,
  onClose,
  onConfirm,
  title,
}) => {
  const modalRef = useRef<HTMLDivElement>(null);

  // Ferme le modal lors d'un clic en dehors
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        modalRef.current &&
        !modalRef.current.contains(event.target as Node)
      ) {
        onClose();
      }
    };

    if (isOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 text-center flex items-center justify-center z-50">
      <div
        ref={modalRef}
        className="bg-black p-6 rounded-xl shadow-xl max-w-md w-full border"
      >
        <p className="mb-6  ">
          Voulez-vous vraiment supprimer cet élément? <br />
          Cette action est irréversible.
        </p>
        <div className="flex justify-center space-x-3">
          <button
            onClick={onClose}
            className="px-4 py-2 bg-none border rounded-md hover:border-rose-500 hover:text-rose-500 transition-colors"
          >
            Annuler
          </button>
          <button
            onClick={onConfirm}
            className="px-4 py-2 bg-gradient-to-r from-rose-500 to-red-500 rounded-md hover:from-rose-600 hover:to-red-600 transition-colors disabled:opacity-50"
          >
            Confirmer la suppression
          </button>
        </div>
      </div>
    </div>
  );
};
