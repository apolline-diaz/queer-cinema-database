import { useFormStatus } from "react-dom";

export function SubmitButton() {
  const { pending } = useFormStatus();

  return (
    <button
      type="submit"
      className="bg-gradient-to-r from-rose-500 to-red-500 text-white px-4 py-2 rounded-md hover:from-rose-600  hover:to-red-600"
      disabled={pending}
    >
      {pending ? "Téléchargement..." : "Ajouter"}
    </button>
  );
}
