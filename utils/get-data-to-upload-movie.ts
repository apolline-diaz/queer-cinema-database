import { supabase } from "@/lib/supabase";

export const getGenres = async () => {
  const { data, error } = await supabase.from("genres").select("id, name");
  if (error) {
    console.error("Erreur lors de la récupération des genres :", error);
  }
  return data || [];
};

export const getCountries = async () => {
  const { data, error } = await supabase.from("countries").select("id, name");
  if (error) {
    console.error("Erreur lors de la récupération des pays :", error);
  }
  return data || [];
};

export const getKeywords = async () => {
  const { data, error } = await supabase.from("keywords").select("id, name");
  if (error) {
    console.error("Erreur lors de la récupération des mots-clés :", error);
  }
  return data || [];
};
