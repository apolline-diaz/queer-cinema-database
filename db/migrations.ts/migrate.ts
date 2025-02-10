import { drizzle } from "drizzle-orm/postgres-js";
import { migrate } from "drizzle-orm/postgres-js/migrator";
import postgres, { Sql } from "postgres";

// ensure process.env.DATABASE_URL exists and is a string

const DATABASE_URL = process.env.DATABASE_URL;

if (!DATABASE_URL) {
  throw new Error("DATABASE_URL is not defined");
}

// to push migration to the database
const pushMigration = async (): Promise<void> => {
  const migrationClient = postgres(DATABASE_URL, {
    max: 1,
  });

  // assuming drizzle() is correctly typed for your database client
  const migrationDB = drizzle(migrationClient);

  // Assuming you have a migrate function, ensure it is imported or defined
  await migrate(migrationDB, {
    migrationsFolder: "./src/drizzle",
  });

  await migrationClient.end();
};

// Call the pushMigration function
pushMigration().catch((error) => {
  console.error("Migration failed:", error);
});
