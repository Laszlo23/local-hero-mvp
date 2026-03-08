import { createHash } from "crypto";
import { headers } from "next/headers";
import { redis } from "@/lib/redis";

type RateLimitResult = {
  allowed: boolean;
  remaining: number;
};

type RateLimitConfig = {
  keyPrefix: string;
  limit: number;
  windowSeconds: number;
};

function getClientId(): string {
  const headerStore = headers();
  const forwarded = headerStore.get("x-forwarded-for") ?? "local";
  const agent = headerStore.get("user-agent") ?? "unknown";
  return createHash("sha256").update(`${forwarded}:${agent}`).digest("hex");
}

export async function applyRateLimit(config: RateLimitConfig): Promise<RateLimitResult> {
  const clientId = getClientId();
  const key = `${config.keyPrefix}:${clientId}`;

  try {
    await redis.connect();
  } catch {
    return { allowed: true, remaining: config.limit };
  }

  const current = await redis.incr(key);
  if (current === 1) {
    await redis.expire(key, config.windowSeconds);
  }

  return {
    allowed: current <= config.limit,
    remaining: Math.max(config.limit - current, 0),
  };
}
