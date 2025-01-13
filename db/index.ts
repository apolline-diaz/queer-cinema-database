import "dotenv/config";
import { drizzle } from "drizzle-orm/postgres-js";
import { eq } from "drizzle-orm";
import { moviesTable } from "./schema";

const db = drizzle(process.env.DATABASE_URL!);

async function main() {
  const movie: typeof moviesTable.$inferInsert = {
    title: "Shinjuku Boys",
    description:
      "Shinjuku Boys explore le quotidien de Gaish, Kazuki et Tatsu, trois onnabe travaillant comme escort au New Marilyn Club à Tokyo. Ils y parlent de leur désirs, de leur masculinité, de leur rapport aux clients, de leur attentes et trajectoires, au sein d'une société où l'expérience trans est traversé par le prisme de la pathologie.",
    releaseDate: "1995",
    language: "Anglais",
    runtime: "53",
    imageUrl: "",
    boost: false,
    director: "Kim Longinotto",
  };

  // insert new movie
  await db.insert(moviesTable).values(movie);
  console.log("New movie created!");

  // read all movies list
  const movies = await db.select().from(moviesTable);
  console.log("Getting all movies from the database: ", movies);

  /*
    const users: {
      id: number;
      name: string;
      age: number;
      email: string;
    }[]
    */

  // update movie
  // await db
  //   .update(moviesTable)
  //   .set({ description: "Updated description" })
  //   .where(eq(moviesTable.title, movie.title));
  // console.log("Movie info updated!");

  // // delete movie
  // await db.delete(moviesTable).where(eq(moviesTable.title, movie.title));
  // console.log("Movie deleted!");
}
main();
