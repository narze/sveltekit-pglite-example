import { defineConfig } from "drizzle-kit"
// if (!process.env.PUBLIC_IDB_NAME) throw new Error("PUBLIC_IDB_NAME is not set")

export default defineConfig({
  schema: "./src/lib/db/schema.ts",

  // Not needed for IndexDB in-browser database
  // dbCredentials: {
  //   url: process.env.PUBLIC_IDB_NAME,
  // },

  verbose: true,
  strict: true,
  dialect: "postgresql",

  out: "./src/lib/db/migrations",
})
