export const getCanonicalUrl = () => {
  return process.env.NODE_ENV !== "production"
    ? "https://movie-diary-ten.vercel.app/"
    : "http://localhost:3000";
};
