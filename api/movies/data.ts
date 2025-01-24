import { supabase } from "@/utils/supabase/client";

export const getGenres = async () => {
  const { data, error } = await supabase.from("genres").select("id, name");
  if (error) throw new Error("Erreur lors de la récupération des genres");
  return data || [];
};

export const getCountries = async () => {
  const { data, error } = await supabase.from("countries").select("id, name");
  if (error) throw new Error("Erreur lors de la récupération des pays");
  return data || [];
};

export const getKeywords = async () => {
  const { data, error } = await supabase.from("keywords").select("id, name");
  if (error) throw new Error("Erreur lors de la récupération des mots-clés");
  return data || [];
};
