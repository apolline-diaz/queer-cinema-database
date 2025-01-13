import {
  pgTable,
  pgPolicy,
  varchar,
  text,
  timestamp,
  numeric,
  uuid,
  boolean,
  unique,
  integer,
  bigint,
  foreignKey,
  primaryKey,
} from "drizzle-orm/pg-core";
import { sql } from "drizzle-orm";

export const moviesTable = pgTable(
  "movies",
  {
    title: varchar().notNull(),
    description: text(),
    releaseDate: text("release_date"),
    createdAt: timestamp("created_at", {
      withTimezone: true,
      mode: "string",
    }).defaultNow(),
    updatedAt: timestamp("updated_at", {
      withTimezone: true,
      mode: "string",
    }).defaultNow(),
    language: varchar(),
    runtime: numeric(),
    imageUrl: text("image_url"),
    id: uuid().defaultRandom().primaryKey().notNull(),
    boost: boolean().default(false),
    director: varchar(),
  },
  (table) => [
    pgPolicy("Enable read access for all users", {
      as: "permissive",
      for: "select",
      to: ["public"],
      using: sql`true`,
    }),
    pgPolicy("Enable insert for all users", {
      as: "permissive",
      for: "insert",
      to: ["public"],
    }),
  ]
);

export const countries = pgTable(
  "countries",
  {
    createdAt: timestamp("created_at", { withTimezone: true, mode: "string" })
      .defaultNow()
      .notNull(),
    name: varchar().notNull(),
    id: integer().primaryKey().generatedByDefaultAsIdentity({
      name: "countries_id_seq",
      startWith: 1,
      increment: 1,
      minValue: 1,
      maxValue: 2147483647,
      cache: 1,
    }),
    code: text(),
  },
  (table) => [
    unique("countries_name_key").on(table.name),
    pgPolicy("Enable read access for all users", {
      as: "permissive",
      for: "select",
      to: ["public"],
      using: sql`true`,
    }),
    pgPolicy("Enable insert for all users", {
      as: "permissive",
      for: "insert",
      to: ["public"],
    }),
  ]
);

export const keywords = pgTable(
  "keywords",
  {
    id: integer().primaryKey().generatedByDefaultAsIdentity({
      name: "keywords_id_seq",
      startWith: 1,
      increment: 1,
      minValue: 1,
      maxValue: 2147483647,
      cache: 1,
    }),
    createdAt: timestamp("created_at", { withTimezone: true, mode: "string" })
      .defaultNow()
      .notNull(),
    name: varchar(),
  },
  (table) => [
    pgPolicy("Enable read access for all users", {
      as: "permissive",
      for: "select",
      to: ["public"],
      using: sql`true`,
    }),
    pgPolicy("Enable insert for all users", {
      as: "permissive",
      for: "insert",
      to: ["public"],
    }),
  ]
);

export const directors = pgTable(
  "directors",
  {
    createdAt: timestamp("created_at", { withTimezone: true, mode: "string" })
      .defaultNow()
      .notNull(),
    name: varchar(),
    // You can use { mode: "bigint" } if numbers are exceeding js number limitations
    id: bigint({ mode: "number" }).primaryKey().generatedByDefaultAsIdentity({
      name: "directors_id_seq",
      startWith: 1,
      increment: 1,
      minValue: 1,
      maxValue: 9223372036854775807,
      cache: 1,
    }),
  },
  (table) => [
    unique("directors_id_key").on(table.id),
    pgPolicy("Enable read access for all users", {
      as: "permissive",
      for: "select",
      to: ["public"],
      using: sql`true`,
    }),
    pgPolicy("Enable insert for all users", {
      as: "permissive",
      for: "insert",
      to: ["public"],
    }),
  ]
);

export const genres = pgTable(
  "genres",
  {
    createdAt: timestamp("created_at", { withTimezone: true, mode: "string" })
      .defaultNow()
      .notNull(),
    name: varchar(),
    // You can use { mode: "bigint" } if numbers are exceeding js number limitations
    id: bigint({ mode: "number" }).primaryKey().generatedByDefaultAsIdentity({
      name: "genres_id_seq",
      startWith: 1,
      increment: 1,
      minValue: 1,
      maxValue: 9223372036854775807,
      cache: 1,
    }),
  },
  (table) => [
    unique("genres_name_key").on(table.name),
    pgPolicy("Enable read access for all users", {
      as: "permissive",
      for: "select",
      to: ["public"],
      using: sql`true`,
    }),
    pgPolicy("Enable insert for all users", {
      as: "permissive",
      for: "insert",
      to: ["public"],
    }),
  ]
);

export const movieGenres = pgTable(
  "movie_genres",
  {
    movieId: uuid("movie_id").notNull(),
    // You can use { mode: "bigint" } if numbers are exceeding js number limitations
    genreId: bigint("genre_id", { mode: "number" }).notNull(),
  },
  (table) => [
    foreignKey({
      columns: [table.genreId],
      foreignColumns: [genres.id],
      name: "movie_genres_genre_id_fkey",
    }).onDelete("cascade"),
    foreignKey({
      columns: [table.movieId],
      foreignColumns: [moviesTable.id],
      name: "movie_genres_movie_id_fkey",
    }).onDelete("cascade"),
    primaryKey({
      columns: [table.movieId, table.genreId],
      name: "movie_genres_pkey",
    }),
    pgPolicy("Enable read access for all users", {
      as: "permissive",
      for: "select",
      to: ["public"],
      using: sql`true`,
    }),
    pgPolicy("Enable insert for all users", {
      as: "permissive",
      for: "insert",
      to: ["public"],
    }),
  ]
);

export const movieKeywords = pgTable(
  "movie_keywords",
  {
    movieId: uuid("movie_id").notNull(),
    keywordId: integer("keyword_id").notNull(),
  },
  (table) => [
    foreignKey({
      columns: [table.keywordId],
      foreignColumns: [keywords.id],
      name: "movie_keywords_keyword_id_fkey",
    }).onDelete("cascade"),
    foreignKey({
      columns: [table.movieId],
      foreignColumns: [moviesTable.id],
      name: "movie_keywords_movie_id_fkey",
    }).onDelete("cascade"),
    primaryKey({
      columns: [table.movieId, table.keywordId],
      name: "movie_keywords_pkey",
    }),
    pgPolicy("Enable read access for all users", {
      as: "permissive",
      for: "select",
      to: ["public"],
      using: sql`true`,
    }),
    pgPolicy("Enable insert for all users", {
      as: "permissive",
      for: "insert",
      to: ["public"],
    }),
  ]
);

export const movieCountries = pgTable(
  "movie_countries",
  {
    movieId: uuid("movie_id").notNull(),
    // You can use { mode: "bigint" } if numbers are exceeding js number limitations
    countryId: bigint("country_id", { mode: "number" }).notNull(),
  },
  (table) => [
    foreignKey({
      columns: [table.countryId],
      foreignColumns: [countries.id],
      name: "movie_countries_country_id_fkey",
    }).onDelete("cascade"),
    foreignKey({
      columns: [table.movieId],
      foreignColumns: [moviesTable.id],
      name: "movie_countries_movie_id_fkey",
    }).onDelete("cascade"),
    primaryKey({
      columns: [table.movieId, table.countryId],
      name: "movie_countries_pkey",
    }),
    pgPolicy("Enable read access for all users", {
      as: "permissive",
      for: "select",
      to: ["public"],
      using: sql`true`,
    }),
    pgPolicy("Enable insert for all users", {
      as: "permissive",
      for: "insert",
      to: ["public"],
    }),
  ]
);

export const movieDirectors = pgTable(
  "movie_directors",
  {
    movieId: uuid("movie_id").notNull(),
    // You can use { mode: "bigint" } if numbers are exceeding js number limitations
    directorId: bigint("director_id", { mode: "number" }).notNull(),
  },
  (table) => [
    foreignKey({
      columns: [table.directorId],
      foreignColumns: [directors.id],
      name: "movie_directors_director_id_fkey",
    }).onDelete("cascade"),
    foreignKey({
      columns: [table.movieId],
      foreignColumns: [moviesTable.id],
      name: "movie_directors_movie_id_fkey",
    }).onDelete("cascade"),
    primaryKey({
      columns: [table.movieId, table.directorId],
      name: "movie_directors_pkey",
    }),
    pgPolicy("Enable read access for all users", {
      as: "permissive",
      for: "select",
      to: ["public"],
      using: sql`true`,
    }),
    pgPolicy("Enable insert for all users", {
      as: "permissive",
      for: "insert",
      to: ["public"],
    }),
  ]
);
