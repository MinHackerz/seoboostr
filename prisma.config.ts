import "dotenv/config";
import { defineConfig, env } from "@prisma/config";

const dbUrl = process.env.DATABASE_URL || "postgresql://mock:mock@localhost:5432/mock";

export default defineConfig({
  schema: "prisma/schema.prisma",
  datasource: {
    url: dbUrl,
  },
});
