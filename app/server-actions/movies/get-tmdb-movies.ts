//api.themoviedb.org/3/discover/movie?api_key=4167b87055ac256fb149485d86ca5b86&language=en-US&sort_by=popularity.desc&with_keywords=158718

"use server";

import { Movie } from "@/app/types/movie";

const TMDB_API_KEY = "4167b87055ac256fb149485d86ca5b86";
const BASE_URL = "https://api.themoviedb.org/3";
const IMAGE_BASE_URL = "https://image.tmdb.org/t/p/w500";

// Function to convert TMDB movie format to your app's Movie type
function convertTmdbMovie(tmdbMovie: any): Movie {
  return {
    id: `tmdb-${tmdbMovie.id}`, // Prefix with 'tmdb-' to distinguish from your DB movies
    title: tmdbMovie.title,
    release_date: tmdbMovie.release_date,
    description: tmdbMovie.overview,
    image_url: tmdbMovie.backdrop_path
      ? `${IMAGE_BASE_URL}${tmdbMovie.backdrop_path}`
      : null,
    // Map other fields as needed
    source: "tmdb", // Add a field to indicate the source
  };
}

// Get movies by title from TMDB
export async function getTmdbMoviesByTitle(title: string): Promise<Movie[]> {
  try {
    const response = await fetch(
      `${BASE_URL}/search/movie?api_key=${TMDB_API_KEY}&language=fr-FR&query=${encodeURIComponent(
        title
      )}&page=1&include_adult=false`,
      { next: { revalidate: 3600 } } // Cache for 1 hour
    );

    if (!response.ok) {
      throw new Error(`TMDB API error: ${response.status}`);
    }

    const data = await response.json();
    return data.results.map(convertTmdbMovie);
  } catch (error) {
    console.error("Error fetching TMDB movies by title:", error);
    return [];
  }
}

// Get movies by keyword from TMDB
export async function getTmdbMoviesByKeyword(
  keyword: string
): Promise<Movie[]> {
  try {
    // First, search for the keyword ID
    const keywordResponse = await fetch(
      `${BASE_URL}/search/keyword?api_key=${TMDB_API_KEY}&query=${encodeURIComponent(
        keyword
      )}&page=1`,
      { next: { revalidate: 3600 } }
    );

    if (!keywordResponse.ok) {
      throw new Error(`TMDB Keyword API error: ${keywordResponse.status}`);
    }

    const keywordData = await keywordResponse.json();

    if (keywordData.results.length === 0) {
      return [];
    }

    const keywordId = keywordData.results[0].id;

    // Then get movies with that keyword
    const moviesResponse = await fetch(
      `${BASE_URL}/discover/movie?api_key=${TMDB_API_KEY}&language=fr-FR&with_keywords=${keywordId}&page=1&include_adult=false`,
      { next: { revalidate: 3600 } }
    );

    if (!moviesResponse.ok) {
      throw new Error(`TMDB Movies API error: ${moviesResponse.status}`);
    }

    const moviesData = await moviesResponse.json();
    return moviesData.results.map(convertTmdbMovie);
  } catch (error) {
    console.error("Error fetching TMDB movies by keyword:", error);
    return [];
  }
}

// Get LGBT movies from TMDB using your specific keyword (158718)
export async function getLgbtTmdbMovies(
  page: number = 1
): Promise<{ movies: Movie[]; totalPages: number }> {
  try {
    const response = await fetch(
      `${BASE_URL}/discover/movie?api_key=${TMDB_API_KEY}&language=fr-FR&sort_by=popularity.desc&with_keywords=158718&page=${page}&include_adult=false`,
      { next: { revalidate: 3600 } }
    );

    if (!response.ok) {
      throw new Error(`TMDB API error: ${response.status}`);
    }

    const data = await response.json();
    return {
      movies: data.results.map(convertTmdbMovie),
      totalPages: data.total_pages,
    };
  } catch (error) {
    console.error("Error fetching LGBT TMDB movies:", error);
    return { movies: [], totalPages: 0 };
  }
}

// Function for advanced search with filters
export async function searchTmdbMovies({
  query = "",
  year = "",
  genreId = "",
  keywordIds = [],
  page = 1,
}: {
  query?: string;
  year?: string;
  genreId?: string;
  keywordIds?: string[];
  page?: number;
}): Promise<{ movies: Movie[]; totalPages: number }> {
  try {
    let url = `${BASE_URL}/discover/movie?api_key=${TMDB_API_KEY}&language=fr-FR&sort_by=popularity.desc&page=${page}&include_adult=false`;

    if (query) {
      url = `${BASE_URL}/search/movie?api_key=${TMDB_API_KEY}&language=fr-FR&query=${encodeURIComponent(
        query
      )}&page=${page}&include_adult=false`;
    }

    if (year) {
      url += `&primary_release_year=${year}`;
    }

    if (genreId) {
      url += `&with_genres=${genreId}`;
    }

    if (keywordIds.length > 0) {
      url += `&with_keywords=${keywordIds.join(",")}`;
    }

    const response = await fetch(url, { next: { revalidate: 3600 } });

    if (!response.ok) {
      throw new Error(`TMDB API error: ${response.status}`);
    }

    const data = await response.json();
    return {
      movies: data.results.map(convertTmdbMovie),
      totalPages: data.total_pages,
    };
  } catch (error) {
    console.error("Error searching TMDB movies:", error);
    return { movies: [], totalPages: 0 };
  }
}
