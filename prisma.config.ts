import { defineConfig, env } from "prisma/config";
import { config } from 'dotenv';
import { join } from 'path';

config({ path: join(__dirname, '.env') });

export default defineConfig({
  schema: "prisma/schema.prisma",
  migrations: {
    path: "prisma/migrations",
  },
  engine: "classic",
  datasource: {
    url: env("DATABASE_URL"),
  },
});
