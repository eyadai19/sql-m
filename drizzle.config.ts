import { defineConfig } from "drizzle-kit";

export default defineConfig({
	schema: "./src/lib/schema.ts",
	out: "./src/lib/migrations",
	dialect: "postgresql",
	dbCredentials: {
		url: process.env.DB_URL!,
	},
});