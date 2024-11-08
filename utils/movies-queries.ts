import { supabase } from "@/lib/supabase";

export const getTopMovies = async () => {
  return await supabase
    .from("movies")
    .select(`id, title, image_url, description, release_date`)
    .eq("boost", true)
    .range(0, 1);
};

export const getMoviesByGenre = async (genreId: number) => {
  return await supabase
    .from("movies")
    .select(
      `
        id, 
        title, 
        image_url, 
        release_date,
        movie_genres!inner(genre_id),
        genres:movie_genres!inner(genres(name))
      `
    )
    .eq("movie_genres.genre_id", genreId)
    .order("created_at", { ascending: false })
    .range(0, 10);
};

export const getMoviesByYearRange = async (
  startYear: string,
  endYear: string
) => {
  return await supabase
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
};
