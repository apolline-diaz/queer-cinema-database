import { relations } from "drizzle-orm/relations";
import {
  genres,
  movieGenres,
  moviesTable,
  keywords,
  movieKeywords,
  countries,
  movieCountries,
  directors,
  movieDirectors,
} from "./schema";

export const movieGenresRelations = relations(movieGenres, ({ one }) => ({
  genre: one(genres, {
    fields: [movieGenres.genreId],
    references: [genres.id],
  }),
  movie: one(moviesTable, {
    fields: [movieGenres.movieId],
    references: [moviesTable.id],
  }),
}));

export const genresRelations = relations(genres, ({ many }) => ({
  movieGenres: many(movieGenres),
}));

export const moviesRelations = relations(moviesTable, ({ many }) => ({
  movieGenres: many(movieGenres),
  movieKeywords: many(movieKeywords),
  movieCountries: many(movieCountries),
  movieDirectors: many(movieDirectors),
}));

export const movieKeywordsRelations = relations(movieKeywords, ({ one }) => ({
  keyword: one(keywords, {
    fields: [movieKeywords.keywordId],
    references: [keywords.id],
  }),
  movie: one(moviesTable, {
    fields: [movieKeywords.movieId],
    references: [moviesTable.id],
  }),
}));

export const keywordsRelations = relations(keywords, ({ many }) => ({
  movieKeywords: many(movieKeywords),
}));

export const movieCountriesRelations = relations(movieCountries, ({ one }) => ({
  country: one(countries, {
    fields: [movieCountries.countryId],
    references: [countries.id],
  }),
  movie: one(moviesTable, {
    fields: [movieCountries.movieId],
    references: [moviesTable.id],
  }),
}));

export const countriesRelations = relations(countries, ({ many }) => ({
  movieCountries: many(movieCountries),
}));

export const movieDirectorsRelations = relations(movieDirectors, ({ one }) => ({
  director: one(directors, {
    fields: [movieDirectors.directorId],
    references: [directors.id],
  }),
  movie: one(moviesTable, {
    fields: [movieDirectors.movieId],
    references: [moviesTable.id],
  }),
}));

export const directorsRelations = relations(directors, ({ many }) => ({
  movieDirectors: many(movieDirectors),
}));
