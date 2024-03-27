import env from "./config/env";
import { migrate } from "drizzle-orm/node-postgres/migrator";
import { buildServer } from "./utils/server";
import db from "./db";

const startServer = async () => {
  const app = await buildServer();

  try {
    app.log.info("Migrating database...");
    await migrate(db, {
      migrationsFolder: "./migrations",
    });
    app.log.info("Database migrated successfully!");

    await app.listen({ port: env.API_PORT, host: env.API_HOST });

    return app;
  } catch (err) {
    app.log.error(err);
    process.exit(1);
  }
};

export const fastifyApp = startServer();
