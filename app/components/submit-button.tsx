import { useFormStatus } from "react-dom";

export function SubmitButton() {
    const { pending } = useFormStatus();

    return (
        <button
        type="submit"
        className="bg-white hover:bg-gray-100 text-gray-800 font-semibold py-2 px-4 border border-gray-400 rounded-full"
      disabled={pending}
      >
        {pending ? "Téléchargement..." : "Ajouter"}
      </button>
    )
}