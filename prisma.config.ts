import { defineConfig } from "prisma/config";
import fs from "fs";
import path from "path";

// Manually parse .env file if process.env.DATABASE_URL is not set during CLI bootstrap
let databaseUrl = process.env.DATABASE_URL;
if (!databaseUrl) {
  try {
    const envPath = path.resolve(process.cwd(), ".env");
    if (fs.existsSync(envPath)) {
      const envContent = fs.readFileSync(envPath, "utf-8");
      const match = envContent.match(/DATABASE_URL=["']?([^"'\r\n]+)["']?/);
      if (match && match[1]) {
        databaseUrl = match[1];
      }
    }
  } catch (e) {
    // Ignore error
  }
}

export default defineConfig({
  schema: "prisma/schema.prisma",
  migrations: {
    seed: "npx tsx prisma/seed.ts",
  },
  datasource: {
    url: databaseUrl,
  },
});
