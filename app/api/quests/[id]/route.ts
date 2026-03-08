import { QuestStatus } from "@prisma/client";
import { z } from "zod";
import { getAuthContext } from "@/lib/auth/privy";
import { fail, ok } from "@/lib/api/http";
import { prisma } from "@/lib/prisma";

const updateQuestSchema = z.object({
  title: z.string().min(3).optional(),
  description: z.string().min(10).optional(),
  status: z.nativeEnum(QuestStatus).optional(),
  rewardXp: z.number().int().positive().optional(),
  rewardTokens: z.number().positive().optional(),
});

type RouteContext = {
  params: { id: string };
};

export async function GET(_request: Request, context: RouteContext) {
  const quest = await prisma.quest.findUnique({
    where: { id: context.params.id },
    include: { sponsor: true },
  });

  if (!quest) {
    return fail("Quest not found.", 404);
  }

  return ok({ quest });
}

export async function PATCH(request: Request, context: RouteContext) {
  const auth = await getAuthContext();
  if (!auth.isAuthenticated) {
    return fail("Authentication required.", 401);
  }

  const payload = await request.json();
  const parsed = updateQuestSchema.safeParse(payload);
  if (!parsed.success) {
    return fail("Invalid quest update payload.", 422, parsed.error.flatten());
  }

  const quest = await prisma.quest.update({
    where: { id: context.params.id },
    data: {
      ...(parsed.data.title ? { title: parsed.data.title } : {}),
      ...(parsed.data.description ? { description: parsed.data.description } : {}),
      ...(parsed.data.status ? { status: parsed.data.status } : {}),
      ...(parsed.data.rewardXp ? { rewardXp: parsed.data.rewardXp } : {}),
      ...(parsed.data.rewardTokens ? { rewardTokens: parsed.data.rewardTokens.toString() } : {}),
    },
  });

  return ok({ quest });
}
