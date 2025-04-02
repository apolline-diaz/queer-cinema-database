import { createClient } from "@supabase/supabase-js";

// Crée une instance du client Supabase
const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

export const uploadImage = async (image: File, movie_title: string) => {
  if (!image) {
    throw new Error("No image file provided");
  }

  // Préparer le nom du fichier avec un timestamp pour éviter les conflits de nom
  const filename = `${Date.now()}-${movie_title.replace(/\s+/g, "-")}`;

  try {
    // Upload de l'image dans le stockage Supabase
    const { data, error } = await supabase.storage
      .from("storage") // Nom du bucket
      .upload(filename, image, { cacheControl: "3600", upsert: true });

    if (error) {
      throw new Error(`Error uploading image: ${error.message}`);
    }

    // Générer l'URL publique pour accéder à l'image
    const imageUrl = `${process.env.SUPABASE_URL}/storage/v1/object/public/${data?.path}`;
    return imageUrl;
  } catch (error) {
    console.error("Error during image upload:", error);
    throw error; // Renvoie l'erreur pour gestion dans l'appelant
  }
};
