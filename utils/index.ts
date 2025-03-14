export const getCanonicalUrl = () => {
  return process.env.NODE_ENV !== "production"
    ? "https://movie-diary-ten.vercel.app/"
    : "http://localhost:3000";
};

export const getImageUrl = (image_url: string | null | undefined) => {
  // Handle missing image URLs
  if (!image_url) {
    return "/public/assets/no_image_found.png";
  }

  // For absolute URLs (starts with http:// or https://)
  if (image_url.startsWith("http://") || image_url.startsWith("https://")) {
    return image_url;
  }

  // Get Supabase URL from environment variables
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;

  // Safety check for missing environment variable
  if (!supabaseUrl) {
    console.error("NEXT_PUBLIC_SUPABASE_URL is not defined");
    return image_url; // Return the original URL as fallback
  }

  // Clean up the Supabase URL (remove trailing slash if present)
  const baseUrl = supabaseUrl.endsWith("/")
    ? supabaseUrl.slice(0, -1)
    : supabaseUrl;

  // Check if image_url already contains part of the path
  // This handles cases where the database might store partial paths
  if (image_url.includes("/storage/") || image_url.startsWith("storage/")) {
    // Ensure proper formatting with no double slashes
    const formattedPath = image_url.startsWith("/")
      ? image_url
      : `/${image_url}`;
    return `${baseUrl}${formattedPath}`;
  }

  // Handle the case where image_url is just a filename
  return `${baseUrl}/storage/v1/object/public/storage/${image_url}`;
};

// export const getImageUrl = (image_url: string) => {
//   // Si l'URL commence par "https://" ou "http://", on considère que c'est une URL externe complète
//   if (image_url.startsWith("http://") || image_url.startsWith("https://")) {
//     return image_url; // URL externe (ex: image MUBI), on la retourne telle quelle
//   }

//   // Sinon, on considère que c'est une image stockée dans Supabase et on ajoute l'URL de base de Supabase
//   return `${process.env.NEXT_PUBLIC_SUPABASE_URL}/storage/v1/object/public/storage/${image_url}`;
// };
