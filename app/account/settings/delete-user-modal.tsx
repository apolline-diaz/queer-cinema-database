"use client";

import { useState } from "react";

interface DeleteModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title: string;
  isLoading?: boolean;
}

export function DeleteUserModal({
  isOpen,
  onClose,
  onConfirm,
  title,
  isLoading = false,
}: DeleteModalProps) {
  const [confirmText, setConfirmText] = useState("");
  const expectedText = "SUPPRIMER";

  if (!isOpen) return null;

  const handleConfirm = () => {
    if (confirmText === expectedText) {
      onConfirm();
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 max-w-md w-full mx-4  border border-rose-500">
        <h2 className="text-xl text-center font-bold text-gray-900 mb-4">
          {title}
        </h2>

        <div className="mb-6">
          <p className="text-gray-600 mb-4">
            Cette action est <strong>irréversible</strong>. Toutes vos données
            seront supprimées définitivement.
          </p>

          <p className="text-sm text-gray-500 mb-2">
            Pour confirmer, tapez <strong>{expectedText}</strong> ci-dessous :
          </p>

          <input
            type="text"
            value={confirmText}
            onChange={(e) => setConfirmText(e.target.value)}
            className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm"
            placeholder={expectedText}
            disabled={isLoading}
          />
        </div>

        <div className="flex justify-center space-x-3">
          <button
            type="button"
            onClick={onClose}
            disabled={isLoading}
            className="px-4 py-2 text-rose-900 border border-rose-900 rounded-md hover:border-rose-500 hover:text-rose-500 disabled:opacity-50"
          >
            Annuler
          </button>
          <button
            type="button"
            onClick={handleConfirm}
            disabled={confirmText !== expectedText || isLoading}
            className="px-4 py-2 bg-rose-900 text-white rounded-md hover:bg-rose-500 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isLoading ? "Suppression..." : "Supprimer définitivement"}
          </button>
        </div>
      </div>
    </div>
  );
}
