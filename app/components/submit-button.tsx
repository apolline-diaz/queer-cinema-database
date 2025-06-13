import { useFormStatus } from "react-dom";

interface SubmitButtonProps {
  defaultText?: string;
  loadingText?: string;
  isSubmitting: boolean;
}

export function SubmitButton({
  defaultText = "Ajouter",
  loadingText = "Chargement...",
  isSubmitting,
}: SubmitButtonProps) {
  const { pending } = useFormStatus();

  return (
    <button
      type="submit"
      className="bg-rose-900  text-white px-4 py-2 transition-colors duration-200 ease-in-out rounded-xl hover:bg-rose-500 disabled:opacity-50"
      disabled={isSubmitting}
    >
      {isSubmitting ? loadingText : defaultText}
    </button>
  );
}
