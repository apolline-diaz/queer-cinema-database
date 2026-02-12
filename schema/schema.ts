import {
  pgTable,
  serial,
  bigserial,
  varchar,
  text,
  integer,
  timestamp,
  uuid,
  boolean,
  numeric,
  primaryKey,
} from 'drizzle-orm/pg-core';
import { sql } from 'drizzle-orm';

// countries
export const countries = pgTable('countries', {
  id: integer('id')
    .primaryKey()
    .notNull()
    .default(sql`generated always as identity`),
  name: varchar('name').notNull().unique(),
  code: varchar('code'),
  createdAt: timestamp('created_at', { withTimezone: true, precision: 6 }).notNull().defaultNow(),
});

// directors
export const directors = pgTable('directors', {
  id: bigserial('id', { mode: 'number' }).primaryKey().unique(),
  name: varchar('name'),
  createdAt: timestamp('created_at', { withTimezone: true, precision: 6 }).notNull().defaultNow(),
});

// genres
export const genres = pgTable('genres', {
  id: bigserial('id', { mode: 'number' }).primaryKey(),
  name: varchar('name').unique(),
  createdAt: timestamp('created_at', { withTimezone: true, precision: 6 }).notNull().defaultNow(),
});

// keywords
export const keywords = pgTable('keywords', {
  id: integer('id')
    .primaryKey()
    .notNull()
    .default(sql`generated always as identity`),
  name: varchar('name'),
  createdAt: timestamp('created_at', { withTimezone: true, precision: 6 }).notNull().defaultNow(),
});

// users
export const users = pgTable('users', {
  id: uuid('id').primaryKey(),
  email: varchar('email', { length: 255 }).notNull().unique(),
  fullName: varchar('full_name', { length: 255 }),
  createdAt: timestamp('created_at', { precision: 6 }),
  role: varchar('role').notNull().default('user'),
});

// lists
export const lists = pgTable('lists', {
  id: bigserial('id', { mode: 'number' }).primaryKey(),
  title: varchar('title', { length: 255 }).notNull(),
  description: text('description'),
  createdAt: timestamp('created_at', { precision: 6 }).defaultNow(),
  updatedAt: timestamp('updated_at', { precision: 6 }).defaultNow(),
  userId: uuid('user_id')
    .notNull()
    .default(sql`gen_random_uuid()`),
  isCollection: boolean('is_collection').notNull().default(false),
});

// lists_movies (join)
export const listsMovies = pgTable(
  'lists_movies',
  {
    listId: bigserial('list_id', { mode: 'number' }).notNull(),
    movieId: uuid('movie_id').notNull(),
    addedAt: timestamp('added_at', { precision: 6 }).defaultNow(),
  },
  (t) => ({
    pk: primaryKey({ columns: [t.listId, t.movieId] }),
  })
);

// movies
export const movies = pgTable('movies', {
  id: uuid('id')
    .primaryKey()
    .notNull()
    .default(sql`gen_random_uuid()`),
  title: varchar('title').notNull(),
  originalTitle: varchar('original_title'),
  description: text('description'),
  releaseDate: varchar('release_date'),
  createdAt: timestamp('created_at', { withTimezone: true, precision: 6 }).defaultNow(),
  updatedAt: timestamp('updated_at', { withTimezone: true, precision: 6 }).defaultNow(),
  language: varchar('language'),
  runtime: numeric('runtime'),
  imageUrl: text('image_url'),
  boost: boolean('boost').default(false),
  type: varchar('type'),
});

// movies_countries (join)
export const moviesCountries = pgTable(
  'movies_countries',
  {
    movieId: uuid('movie_id').notNull(),
    countryId: integer('country_id').notNull(),
  },
  (t) => ({
    pk: primaryKey({ columns: [t.movieId, t.countryId] }),
  })
);

// movies_directors (join)
export const moviesDirectors = pgTable(
  'movies_directors',
  {
    movieId: uuid('movie_id').notNull(),
    directorId: bigserial('director_id', { mode: 'number' }).notNull(),
  },
  (t) => ({
    pk: primaryKey({ columns: [t.movieId, t.directorId] }),
  })
);

// movies_genres (join)
export const moviesGenres = pgTable(
  'movies_genres',
  {
    movieId: uuid('movie_id').notNull(),
    genreId: bigserial('genre_id', { mode: 'number' }).notNull(),
  },
  (t) => ({
    pk: primaryKey({ columns: [t.movieId, t.genreId] }),
  })
);

// movies_keywords (join)
export const moviesKeywords = pgTable(
  'movies_keywords',
  {
    movieId: uuid('movie_id').notNull(),
    keywordId: integer('keyword_id').notNull(),
  },
  (t) => ({
    pk: primaryKey({ columns: [t.movieId, t.keywordId] }),
  })
);
