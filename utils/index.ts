export const getCanonicalUrl = () => {
    return process.env.NODE_ENV !== "production" 
    ? "http://localhost:3000" 
    : "http://localhost:3000"
}

export const getImageUrl = (image_url: string) => {
      return `${process.env.NEXT_PUBLIC_SUPABASE_URL}/storage/v1/object/public/storage/${image_url}`
}
