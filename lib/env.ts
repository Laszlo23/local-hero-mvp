import { z } from "zod";

const envSchema = z.object({
  NODE_ENV: z.enum(["development", "test", "production"]).default("development"),
  DATABASE_URL: z.string().min(1).default("postgresql://localhost:5432/localhero"),
  REDIS_URL: z.string().min(1).default("redis://127.0.0.1:6379"),
  NEXT_PUBLIC_PRIVY_APP_ID: z.string().min(1).default("local-hero-dev-app-id"),
  PRIVY_APP_ID: z.string().min(1).default("local-hero-dev-app-id"),
  PRIVY_APP_SECRET: z.string().min(1).default("local-hero-dev-secret"),
  NEXT_PUBLIC_MAPBOX_ACCESS_TOKEN: z.string().min(1).default("pk.localhero.dev"),
  S3_BUCKET_NAME: z.string().min(1).default("localhero-mvp"),
  S3_REGION: z.string().min(1).default("auto"),
  S3_ACCESS_KEY_ID: z.string().min(1).default("dev-access-key"),
  S3_SECRET_ACCESS_KEY: z.string().min(1).default("dev-secret-key"),
  S3_ENDPOINT: z.string().url().optional(),
  HERO_REWARD_BASE: z.coerce.number().default(10),
  ADMIN_USER_IDS: z.string().default(""),
});

const parsed = envSchema.safeParse(process.env);

if (!parsed.success) {
  throw new Error(`Invalid environment variables: ${parsed.error.message}`);
}

export const env = parsed.data;
