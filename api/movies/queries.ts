import { supabase } from "@/utils/supabase/client";

export const getTopMovies = async () => {
  const { data, error } = await supabase
    .from("movies")
    .select("id, title, image_url, description, release_date")
    .eq("boost", true)
    .range(0, 1);

  if (error)
    throw new Error("Erreur lors de la récupération des meilleurs films");
  return data || [];
};

export const getMoviesByGenre = async (genreId: number) => {
  const { data, error } = await supabase
    .from("movies")
    .select(
      `
      id, 
      title, 
      image_url, 
      release_date,
      genres:movie_genres!inner(genres(name))
    `
    )
    .eq("movie_genres.genre_id", genreId)
    .order("created_at", { ascending: false })
    .range(0, 10);

  if (error)
    throw new Error("Erreur lors de la récupération des films par genre");
  return data || [];
};

export const getMoviesByYearRange = async (
  startYear: string,
  endYear: string
) => {
  const { data, error } = await supabase
    .from("movies")
    .select(
      `
      id, 
      title, 
      image_url, 
      release_date,
      genres:movie_genres!inner(genres(name))
    `
    )
    .gte("release_date", startYear)
    .lte("release_date", endYear)
    .order("created_at", { ascending: false })
    .range(0, 10);

  if (error)
    throw new Error("Erreur lors de la récupération des films par année");
  return data || [];
};
