import zennv from "zennv";
import { z } from "zod";

const env = zennv({
  dotenv: true,
  schema: z.object({
    NODE_ENV: z.string().default("development"),
    APP_NAME: z.string().default("trading"),
    CLOSE_GRACE_DELAY: z.number().default(500),
    API_PORT: z.number().default(8000),
    API_HOST: z.string().default("0.0.0.0"),
    MAIN_URL: z.string().default("http://localhost:8000"),
    CLIENT_URL: z.string().default("http://localhost:5173"),
    DATABASE_HOST: z.string().default("localhost"),
    DATABASE_PORT: z.number().default(5432),
    DATABASE_NAME: z.string(),
    DATABASE_USER: z.string(),
    DATABASE_PASSWORD: z.string(),
    DATABASE_URL: z.string(),
    MAIL_HOST: z.string(),
    MAIL_PORT: z.number(),
    MAIL_USERNAME: z.string(),
    MAIL_PASSWORD: z.string(),
    JWT_KEY: z.string().default("supersecretkey"),
  }),
});

export default env;
