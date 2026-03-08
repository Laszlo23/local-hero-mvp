import { LeaderboardPeriod } from "@prisma/client";
import { z } from "zod";
import { getAuthContext, requireAdmin } from "@/lib/auth/privy";
import { fail, ok } from "@/lib/api/http";
import { rebuildLeaderboard } from "@/lib/leaderboard/scoring";
import { prisma } from "@/lib/prisma";

const querySchema = z.object({
  period: z.nativeEnum(LeaderboardPeriod).default(LeaderboardPeriod.MONTHLY),
  seasonLabel: z.string().default(new Date().toISOString().slice(0, 7)),
});

export async function GET(request: Request) {
  const url = new URL(request.url);
  const parsed = querySchema.safeParse({
    period: url.searchParams.get("period") ?? LeaderboardPeriod.MONTHLY,
    seasonLabel: url.searchParams.get("seasonLabel") ?? new Date().toISOString().slice(0, 7),
  });

  if (!parsed.success) {
    return fail("Invalid leaderboard query.", 422, parsed.error.flatten());
  }

  const leaderboard = await prisma.leaderboard.findMany({
    where: {
      period: parsed.data.period,
      seasonLabel: parsed.data.seasonLabel,
    },
    orderBy: { rank: "asc" },
    include: {
      user: {
        select: {
          username: true,
          level: true,
          avatarUrl: true,
        },
      },
    },
  });

  return ok({ leaderboard });
}

export async function POST(request: Request) {
  const auth = await getAuthContext();
  try {
    requireAdmin(auth);
  } catch (error) {
    return fail(error instanceof Error ? error.message : "Forbidden", 403);
  }

  const payload = await request.json();
  const parsed = querySchema.safeParse(payload);
  if (!parsed.success) {
    return fail("Invalid leaderboard rebuild payload.", 422, parsed.error.flatten());
  }

  const leaderboard = await rebuildLeaderboard({
    period: parsed.data.period,
    seasonLabel: parsed.data.seasonLabel,
  });

  return ok({ leaderboard }, 201);
}
