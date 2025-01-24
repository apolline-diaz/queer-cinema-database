import { supabase } from "@/utils/supabase/client";

export const getMovies = async () => {
  const { data, error } = await supabase
    .from("movies")
    .select(
      "id, title, release_date, genres(name), countries(name), keywords(name)"
    );

  if (error) throw new Error("Erreur lors de la récupération des films");
  return data || [];
};
