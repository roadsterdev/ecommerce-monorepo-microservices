import { defineConfig } from "drizzle-kit";

import "dotenv/config";

export default defineConfig({
  out: "./drizzle",
  dialect: "postgresql",
  schema: "./src/models/schema.ts",
  dbCredentials: {
    url: process.env.DATABASE_URL!,
  },
});
