import "dotenv/config";

export default {
  out: "./drizzle",
  schema: "./src/server/db/schema.ts",
  driver: "pg",
  dbCredentials: {
    url: process.env.DATABASE_URL ?? "",
  },
};
