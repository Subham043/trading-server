import env from "./config/env";
import { buildServer } from "./utils/server";

const startServer = async () => {
  const app = await buildServer();

  try {
    await app.listen({ port: env.API_PORT, host: env.API_HOST });

    return app;
  } catch (err) {
    app.log.error(err);
    process.exit(1);
  }
};

export const fastifyApp = startServer();
