import { QuestStatus, QuestType } from "@prisma/client";
import { z } from "zod";
import { getAuthContext } from "@/lib/auth/privy";
import { ok, fail } from "@/lib/api/http";
import { prisma } from "@/lib/prisma";
import { applyRateLimit } from "@/lib/security/rateLimit";

const createQuestSchema = z.object({
  title: z.string().min(3),
  description: z.string().min(10),
  type: z.nativeEnum(QuestType),
  rewardXp: z.number().int().positive(),
  rewardTokens: z.number().positive(),
  latitude: z.number(),
  longitude: z.number(),
  radius: z.number().int().positive(),
  sponsorId: z.string().optional().nullable(),
  aiVerificationRequired: z.boolean().default(true),
});

export async function GET() {
  const quests = await prisma.quest.findMany({
    where: { status: QuestStatus.ACTIVE },
    orderBy: { createdAt: "desc" },
    include: { sponsor: true },
  });

  return ok({ quests });
}

export async function POST(request: Request) {
  const limit = await applyRateLimit({ keyPrefix: "quest_create", limit: 20, windowSeconds: 60 });
  if (!limit.allowed) {
    return fail("Rate limit exceeded", 429);
  }

  const auth = await getAuthContext();
  if (!auth.isAuthenticated) {
    return fail("Authentication required.", 401);
  }

  const payload = await request.json();
  const parsed = createQuestSchema.safeParse(payload);
  if (!parsed.success) {
    return fail("Invalid quest payload.", 422, parsed.error.flatten());
  }

  const quest = await prisma.quest.create({
    data: {
      title: parsed.data.title,
      description: parsed.data.description,
      type: parsed.data.type,
      rewardXp: parsed.data.rewardXp,
      rewardTokens: parsed.data.rewardTokens.toString(),
      latitude: parsed.data.latitude.toString(),
      longitude: parsed.data.longitude.toString(),
      radius: parsed.data.radius,
      sponsorId: parsed.data.sponsorId,
      aiVerificationRequired: parsed.data.aiVerificationRequired,
      status: QuestStatus.PENDING_APPROVAL,
    },
  });

  return ok({ quest }, 201);
}
