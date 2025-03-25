export const getCanonicalUrl = () => {
  return process.env.NODE_ENV !== "production"
    ? "https://movie-diary-ten.vercel.app/"
    : "http://localhost:3000";
};

export const getImageUrl = (image_url: string | null | undefined): string => {
  // If no image URL is provided, return the default missing image
  if (!image_url || image_url.trim() === "No image available") {
    return "/missing_image.png";
  }

  // Check for fully qualified URLs
  if (
    image_url.trim().startsWith("http://") ||
    image_url.trim().startsWith("https://")
  ) {
    return image_url.trim();
  }

  // Sanitize the image path
  const sanitizedPath = image_url
    .trim()
    .replace(/^\/+/, "") // Remove leading slashes
    .replace(/\s+/g, "%20"); // Replace spaces with URL encoding

  // Construct Supabase URL
  return `${process.env.NEXT_PUBLIC_SUPABASE_URL}/storage/v1/object/public/storage/${sanitizedPath}`;
};
