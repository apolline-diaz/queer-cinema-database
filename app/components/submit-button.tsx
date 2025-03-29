import { useFormStatus } from "react-dom";

interface SubmitButtonProps {
  defaultText?: string;
  loadingText?: string;
  formAction?: (formData: FormData) => Promise<void>;
}

export function SubmitButton({
  defaultText = "Ajouter",
  loadingText = "Chargement...",
  formAction,
}: SubmitButtonProps) {
  const { pending } = useFormStatus();

  return (
    <button
      type="submit"
      className="bg-gradient-to-r from-rose-500 to-red-500 text-white px-4 py-2 rounded-md hover:from-rose-600 hover:to-red-600 disabled:opacity-50"
      disabled={pending}
      formAction={formAction}
    >
      {pending ? loadingText : defaultText}
    </button>
  );
}
