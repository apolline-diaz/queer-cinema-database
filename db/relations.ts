import { relations } from "drizzle-orm/relations";
import {
  users,
  lists,
  directors,
  movieDirectors,
  movies,
  keywords,
  movieKeywords,
  countries,
  movieCountries,
  genres,
  movieGenres,
  listsMovies,
} from "./schema";

export const listsRelations = relations(lists, ({ one, many }) => ({
  users: one(users, {
    fields: [lists.userId],
    references: [users.id],
  }),
  listsMovies: many(listsMovies),
}));

export const usersRelations = relations(users, ({ many }) => ({
  lists: many(lists),
}));

export const movieDirectorsRelations = relations(movieDirectors, ({ one }) => ({
  director: one(directors, {
    fields: [movieDirectors.directorId],
    references: [directors.id],
  }),
  movie: one(movies, {
    fields: [movieDirectors.movieId],
    references: [movies.id],
  }),
}));

export const directorsRelations = relations(directors, ({ many }) => ({
  movieDirectors: many(movieDirectors),
}));

export const moviesRelations = relations(movies, ({ many }) => ({
  movieDirectors: many(movieDirectors),
  movieKeywords: many(movieKeywords),
  movieCountries: many(movieCountries),
  movieGenres: many(movieGenres),
  listsMovies: many(listsMovies),
}));

export const movieKeywordsRelations = relations(movieKeywords, ({ one }) => ({
  keyword: one(keywords, {
    fields: [movieKeywords.keywordId],
    references: [keywords.id],
  }),
  movie: one(movies, {
    fields: [movieKeywords.movieId],
    references: [movies.id],
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
  movie: one(movies, {
    fields: [movieCountries.movieId],
    references: [movies.id],
  }),
}));

export const countriesRelations = relations(countries, ({ many }) => ({
  movieCountries: many(movieCountries),
}));

export const movieGenresRelations = relations(movieGenres, ({ one }) => ({
  genre: one(genres, {
    fields: [movieGenres.genreId],
    references: [genres.id],
  }),
  movie: one(movies, {
    fields: [movieGenres.movieId],
    references: [movies.id],
  }),
}));

export const genresRelations = relations(genres, ({ many }) => ({
  movieGenres: many(movieGenres),
}));

export const listsMoviesRelations = relations(listsMovies, ({ one }) => ({
  list: one(lists, {
    fields: [listsMovies.listId],
    references: [lists.id],
  }),
  movie: one(movies, {
    fields: [listsMovies.movieId],
    references: [movies.id],
  }),
}));
