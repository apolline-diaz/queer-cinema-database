CREATE TABLE "lists" (
	"id" bigint PRIMARY KEY GENERATED ALWAYS AS IDENTITY (sequence name "lists_id_seq" INCREMENT BY 1 MINVALUE 1 MAXVALUE 92233720368547 START WITH 1 CACHE 1),
	"title" varchar(255) NOT NULL,
	"description" text,
	"created_at" timestamp DEFAULT now(),
	"updated_at" timestamp DEFAULT now(),
	"user_id" uuid DEFAULT gen_random_uuid() NOT NULL
);
--> statement-breakpoint
ALTER TABLE "lists" ENABLE ROW LEVEL SECURITY;--> statement-breakpoint
CREATE TABLE "lists_movies" (
	"list_id" bigint NOT NULL,
	"movie_id" uuid NOT NULL,
	"added_at" timestamp DEFAULT now(),
	CONSTRAINT "lists_movies_pkey" PRIMARY KEY("list_id","movie_id")
);
--> statement-breakpoint
ALTER TABLE "lists_movies" ENABLE ROW LEVEL SECURITY;--> statement-breakpoint
CREATE TABLE "users" (
	"id" uuid PRIMARY KEY NOT NULL,
	"email" varchar(255) NOT NULL,
	"full_name" varchar(255),
	"created_at" timestamp NOT NULL,
	CONSTRAINT "users_email_unique" UNIQUE("email")
);
--> statement-breakpoint
ALTER TABLE "directors" ALTER COLUMN "id" SET MAXVALUE 92233720368547;--> statement-breakpoint
ALTER TABLE "genres" ALTER COLUMN "id" SET MAXVALUE 92233720368547;--> statement-breakpoint
ALTER TABLE "lists" ADD CONSTRAINT "lists_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "lists_movies" ADD CONSTRAINT "fk_list" FOREIGN KEY ("list_id") REFERENCES "public"."lists"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "lists_movies" ADD CONSTRAINT "fk_movie" FOREIGN KEY ("movie_id") REFERENCES "public"."movies"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
CREATE POLICY "Enable insert for all users" ON "lists" AS PERMISSIVE FOR INSERT TO public WITH CHECK (true);--> statement-breakpoint
CREATE POLICY "Enable read access for all users" ON "lists" AS PERMISSIVE FOR SELECT TO public;--> statement-breakpoint
CREATE POLICY "Enable insert for all users" ON "lists_movies" AS PERMISSIVE FOR INSERT TO public WITH CHECK (true);--> statement-breakpoint
CREATE POLICY "Enable read access for all users" ON "lists_movies" AS PERMISSIVE FOR SELECT TO public;--> statement-breakpoint
ALTER POLICY "Enable read access for all users" ON "movies" TO public USING (true);--> statement-breakpoint
ALTER POLICY "Enable insert for all users" ON "movies" TO public WITH CHECK (true);--> statement-breakpoint
ALTER POLICY "Enable read access for all users" ON "countries" TO public USING (true);--> statement-breakpoint
ALTER POLICY "Enable insert for all users" ON "countries" TO public WITH CHECK (true);--> statement-breakpoint
ALTER POLICY "Enable read access for all users" ON "keywords" TO public USING (true);--> statement-breakpoint
ALTER POLICY "Enable insert for all users" ON "keywords" TO public WITH CHECK (true);--> statement-breakpoint
ALTER POLICY "Enable read access for all users" ON "directors" TO public USING (true);--> statement-breakpoint
ALTER POLICY "Enable insert for all users" ON "directors" TO public WITH CHECK (true);--> statement-breakpoint
ALTER POLICY "Enable read access for all users" ON "genres" TO public USING (true);--> statement-breakpoint
ALTER POLICY "Enable insert for all users" ON "genres" TO public WITH CHECK (true);--> statement-breakpoint
ALTER POLICY "Enable read access for all users" ON "movie_genres" TO public USING (true);--> statement-breakpoint
ALTER POLICY "Enable insert for all users" ON "movie_genres" TO public WITH CHECK (true);--> statement-breakpoint
ALTER POLICY "Enable read access for all users" ON "movie_keywords" TO public USING (true);--> statement-breakpoint
ALTER POLICY "Enable insert for all users" ON "movie_keywords" TO public WITH CHECK (true);--> statement-breakpoint
ALTER POLICY "Enable read access for all users" ON "movie_countries" TO public USING (true);--> statement-breakpoint
ALTER POLICY "Enable insert for all users" ON "movie_countries" TO public WITH CHECK (true);--> statement-breakpoint
ALTER POLICY "Enable read access for all users" ON "movie_directors" TO public USING (true);--> statement-breakpoint
ALTER POLICY "Enable insert for all users" ON "movie_directors" TO public WITH CHECK (true);