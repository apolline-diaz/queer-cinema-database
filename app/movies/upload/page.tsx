"use client";

import { useFormState, useFormStatus } from "react-dom"; // Remplacez le chemin par celui où vous avez enregistré le hook
import { addMovie } from "@/app/server-actions";
import { SubmitButton } from "@/app/components/submit-button";

const initialState = {
  type: "",
  message: "",
  errors: null,
};

const UploadFormPage: React.FC = () => {
  const [state, formAction] = useFormState<any>(addMovie as any, initialState);

  return (
    <div className="p-10">
      {state?.type === "error" && (
        <p id="title-error" className="text-red-500 text-xs italic">
          {state.message}
        </p>
      )}
      <form action={formAction} className="py-5">
        <div className="flex flex-wrap -mx-3 mb-6">
          <div className="w-full md:w-1/2 px-3 mb-6 md:mb-0">
            <label
              className="block uppercase tracking-wide text-gray-700 text-xs font-bold mb-2"
              htmlFor="title"
            >
              Titre
            </label>
            <input
              className="appearance-none block w-full bg-gray-200 text-gray-700 border  rounded py-3 px-4 mb-3 leading-tight focus:outline-none focus:bg-white"
              id="title"
              type="text"
              name="title"
            />
            {state?.errors?.title && (
              <span
                id="description-error"
                className="text-red-500 text-xs italic"
              >
                {state.errors.title.join(",")}
              </span>
            )}
          </div>
          <div className="w-full md:w-1/2 px-3">
            <label
              className="block uppercase tracking-wide text-gray-700 text-xs font-bold mb-2"
              htmlFor="description"
            >
              Synopsis
            </label>
            <textarea
              className="appearance-none block w-full bg-gray-200 text-gray-700 border border-gray-200 rounded py-3 px-4 leading-tight focus:outline-none focus:bg-white focus:border-gray-500"
              id="description"
              name="description"
            ></textarea>
            {state?.errors?.description && (
              <span
                id="description-error"
                className="text-red-500 text-xs italic"
              >
                {state.errors.description.join(",")}
              </span>
            )}
          </div>
        </div>
        <div className="flex flex-wrap -mx-3 mb-2">
          <div className="w-full md:w-1/3 px-3 mb-6 md:mb-0">
            <label
              className="block uppercase tracking-wide text-gray-700 text-xs font-bold mb-2"
              htmlFor="release_date"
            >
              Année de sortie
            </label>
            <input
              className="appearance-none block w-full bg-gray-200 text-gray-700 border border-gray-200 rounded py-3 px-4 leading-tight focus:outline-none focus:bg-white focus:border-gray-500"
              id="release_date"
              type="text"
              name="release_date"
            />
            {state?.errors?.release_date && (
              <span
                id="release_date-error"
                className="text-red-500 text-xs italic"
              >
                {state.errors.release_date.join(",")}
              </span>
            )}
          </div>
          {/* <div className="w-full md:w-1/3 px-3 mb-6 md:mb-0">
          <label
            className="block uppercase tracking-wide text-gray-700 text-xs font-bold mb-2"
            htmlFor="grid-state"
          >
            State
          </label>
          <div className="relative">
            <select
              className="block appearance-none w-full bg-gray-200 border border-gray-200 text-gray-700 py-3 px-4 pr-8 rounded leading-tight focus:outline-none focus:bg-white focus:border-gray-500"
              id="grid-state"
            >
              <option>New Mexico</option>
              <option>Missouri</option>
              <option>Texas</option>
            </select>
            <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-700">
              <svg
                className="fill-current h-4 w-4"
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 20 20"
              >
                <path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z" />
              </svg>
            </div>
          </div>
        </div> */}
          <div className="w-full md:w-1/3 px-3 mb-6 md:mb-0">
            <label
              className="block uppercase tracking-wide text-gray-700 text-xs font-bold mb-2"
              htmlFor="image_url"
            >
              Image
            </label>
            <input
              className="appearance-none block w-full hover:cursor"
              id="image_url"
              name="image_url"
              accept="image/*"
              type="file"
            />
            {state?.errors?.image_url && (
              <span
                id="image_url-error"
                className="text-red-500 text-xs italic"
              >
                {state.errors.image_url.join(",")}
              </span>
            )}
          </div>
        </div>
        <SubmitButton />
      </form>
    </div>
  );
};

export default UploadFormPage;
