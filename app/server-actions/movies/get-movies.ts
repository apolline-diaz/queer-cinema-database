import { supabase } from "@/lib/supabase";

export const getMovies = async (filters: {
  title: string;
  keyword: string;
  director: string;
  country: string;
  genre: string;
  year: string;
}) => {
  const { data, error } = await supabase
    .from("movies")
    .select(
      "id, title, release_date, genres(name), directors(name), countries(name), keywords(name)"
    );
  if (error) {
    console.error("Erreur lors de la récupération des films :", error);
  }
  return data || [];
};
