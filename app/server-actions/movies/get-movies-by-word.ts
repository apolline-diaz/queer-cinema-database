"use server";

import { Movie } from "@/app/types/movie";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

/**
 * Recherche unifiée qui cherche dans tous les champs associés aux films
 */
export const getMoviesByWord = async (search: string): Promise<Movie[]> => {
  // Si la recherche est vide, retourner les films récents
  if (search.trim() === "") {
    const movies = await prisma.movies.findMany({
      select: {
        id: true,
        title: true,
        image_url: true,
        release_date: true,
      },
      orderBy: {
        created_at: "desc",
      },
    });

    return movies;
  }

  // 1. Trouver les films par titre
  const moviesByTitle = await prisma.movies.findMany({
    select: {
      id: true,
      title: true,
      image_url: true,
      release_date: true,
    },
    where: {
      title: {
        contains: search,
        mode: "insensitive",
      },
    },
  });

  // 2. Trouver les films par description
  const moviesByDescription = await prisma.movies.findMany({
    select: {
      id: true,
      title: true,
      image_url: true,
      release_date: true,
    },
    where: {
      description: {
        contains: search,
        mode: "insensitive",
      },
    },
  });

  // 3. Trouver les films par mot-clé
  // D'abord chercher les mots-clés correspondants
  const keywords = await prisma.keywords.findMany({
    where: {
      name: {
        contains: search,
        mode: "insensitive",
      },
    },
    select: {
      id: true,
    },
  });

  // Ensuite trouver les films associés à ces mots-clés
  let moviesByKeyword: Movie[] = [];
  if (keywords.length > 0) {
    const keywordIds = keywords.map((k) => k.id);

    const movieKeywords = await prisma.movies_keywords.findMany({
      where: {
        keyword_id: {
          in: keywordIds,
        },
      },
      select: {
        movie_id: true,
      },
    });

    const movieIds = movieKeywords.map((mk) => mk.movie_id);

    moviesByKeyword = await prisma.movies.findMany({
      where: {
        id: {
          in: movieIds,
        },
      },
      select: {
        id: true,
        title: true,
        image_url: true,
        release_date: true,
      },
    });
  }

  // 4. Trouver les films par réalisateur
  // D'abord chercher les réalisateurs correspondants
  const directors = await prisma.directors.findMany({
    where: {
      name: {
        contains: search,
        mode: "insensitive",
      },
    },
    select: {
      id: true,
    },
  });

  // Ensuite trouver les films associés à ces réalisateurs
  let moviesByDirector: Movie[] = [];
  if (directors.length > 0) {
    const directorIds = directors.map((d) => d.id);

    const movieDirectors = await prisma.movies_directors.findMany({
      where: {
        director_id: {
          in: directorIds,
        },
      },
      select: {
        movie_id: true,
      },
    });

    const movieIds = movieDirectors.map((md) => md.movie_id);

    moviesByDirector = await prisma.movies.findMany({
      where: {
        id: {
          in: movieIds,
        },
      },
      select: {
        id: true,
        title: true,
        image_url: true,
        release_date: true,
      },
    });
  }

  // 5. Trouver les films par pays
  // D'abord chercher les pays correspondants
  const countries = await prisma.countries.findMany({
    where: {
      name: {
        contains: search,
        mode: "insensitive",
      },
    },
    select: {
      id: true,
    },
  });

  // Ensuite trouver les films associés à ces pays
  let moviesByCountry: Movie[] = [];
  if (countries.length > 0) {
    const countryIds = countries.map((c) => c.id);

    const movieCountries = await prisma.movies_countries.findMany({
      where: {
        country_id: {
          in: countryIds,
        },
      },
      select: {
        movie_id: true,
      },
    });

    const movieIds = movieCountries.map((mc) => mc.movie_id);

    moviesByCountry = await prisma.movies.findMany({
      where: {
        id: {
          in: movieIds,
        },
      },
      select: {
        id: true,
        title: true,
        image_url: true,
        release_date: true,
      },
    });
  }

  // 6. Trouver les films par genre
  // D'abord chercher les genres correspondants
  const genres = await prisma.genres.findMany({
    where: {
      name: {
        contains: search,
        mode: "insensitive",
      },
    },
    select: {
      id: true,
    },
  });

  // Ensuite trouver les films associés à ces genres
  let moviesByGenre: Movie[] = [];
  if (genres.length > 0) {
    const genreIds = genres.map((g) => g.id);

    const movieGenres = await prisma.movies_genres.findMany({
      where: {
        genre_id: {
          in: genreIds,
        },
      },
      select: {
        movie_id: true,
      },
    });

    const movieIds = movieGenres.map((mg) => mg.movie_id);

    moviesByGenre = await prisma.movies.findMany({
      where: {
        id: {
          in: movieIds,
        },
      },
      select: {
        id: true,
        title: true,
        image_url: true,
        release_date: true,
      },
    });
  }

  // 7. Trouver les films par langue
  //   const moviesByLanguage = await prisma.movies.findMany({
  //     select: {
  //       id: true,
  //       title: true,
  //       image_url: true,
  //       release_date: true,
  //     },
  //     where: {
  //       language: {
  //         contains: search,
  //         mode: "insensitive",
  //       },
  //     },
  //   });

  // 8. Combiner tous les résultats et supprimer les doublons
  const allMovies = [
    ...moviesByTitle,
    ...moviesByDescription,
    ...moviesByKeyword,
    ...moviesByDirector,
    ...moviesByCountry,
    ...moviesByGenre,
    // ...moviesByLanguage,
  ];

  // Utiliser un Map pour éliminer les doublons basés sur l'ID du film
  const uniqueMovies = Array.from(
    new Map(allMovies.map((movie) => [movie.id, movie])).values()
  );

  return uniqueMovies;
};

// Conserver les anciennes fonctions pour rétrocompatibilité si nécessaire
export const getMoviesByTitle = async (search: string): Promise<Movie[]> => {
  return getMoviesByWord(search); // Rediriger vers la nouvelle fonction unifiée
};

export const getMoviesByKeyword = async (search: string): Promise<Movie[]> => {
  return getMoviesByWord(search); // Rediriger vers la nouvelle fonction unifiée
};
