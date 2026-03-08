import { QuestStatus } from "@prisma/client";
import { z } from "zod";
import { getAuthContext, requireAdmin } from "@/lib/auth/privy";
import { fail, ok } from "@/lib/api/http";
import { prisma } from "@/lib/prisma";

const moderationSchema = z.object({
  questId: z.string().min(1),
  status: z.nativeEnum(QuestStatus),
});

export async function GET() {
  const auth = await getAuthContext();
  try {
    requireAdmin(auth);
  } catch (error) {
    return fail(error instanceof Error ? error.message : "Forbidden", 403);
  }

  const quests = await prisma.quest.findMany({
    where: {
      status: { in: [QuestStatus.PENDING_APPROVAL, QuestStatus.DRAFT] },
    },
    orderBy: { createdAt: "desc" },
  });

  return ok({ quests });
}

export async function PATCH(request: Request) {
  const auth = await getAuthContext();
  try {
    requireAdmin(auth);
  } catch (error) {
    return fail(error instanceof Error ? error.message : "Forbidden", 403);
  }

  const payload = await request.json();
  const parsed = moderationSchema.safeParse(payload);
  if (!parsed.success) {
    return fail("Invalid moderation payload.", 422, parsed.error.flatten());
  }

  const quest = await prisma.quest.update({
    where: { id: parsed.data.questId },
    data: { status: parsed.data.status },
  });

  return ok({ quest });
}
