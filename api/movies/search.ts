import { supabase } from "@/utils/supabase/client";

export interface Movie {
  id: number;
  title: string;
  image_url: string;
  release_date: string;
}

export const searchMoviesByTitle = async (search: string): Promise<Movie[]> => {
  if (!search.trim()) {
    const { data, error } = await supabase
      .from("movies")
      .select("id, title, image_url, release_date")
      .order("created_at", { ascending: false })
      .range(0, 100);

    if (error) throw new Error("Erreur lors de la récupération des films");
    return data || [];
  }

  const { data, error } = await supabase
    .from("movies")
    .select("id, title, image_url, release_date")
    .ilike("title", `%${search}%`);

  if (error) throw new Error("Erreur lors de la recherche par titre");
  return data || [];
};

export const searchMoviesByKeyword = async (
  search: string
): Promise<Movie[]> => {
  if (!search.trim()) return [];

  const { data: keywords, error: keywordError } = await supabase
    .from("keywords")
    .select("id")
    .ilike("name", `%${search}%`);

  if (keywordError) throw new Error("Erreur lors de la recherche par mot-clé");

  if (!keywords?.length) return [];

  const keywordIds = keywords.map((k) => k.id);
  const { data: movieKeywords, error: movieKeywordError } = await supabase
    .from("movie_keywords")
    .select("movie_id")
    .in("keyword_id", keywordIds);

  if (movieKeywordError)
    throw new Error("Erreur lors de la recherche des films");

  const movieIds = movieKeywords.map((mk) => mk.movie_id);
  const { data: movies, error: movieError } = await supabase
    .from("movies")
    .select("id, title, image_url, release_date")
    .in("id", movieIds);

  if (movieError) throw new Error("Erreur lors de la récupération des films");
  return movies || [];
};
