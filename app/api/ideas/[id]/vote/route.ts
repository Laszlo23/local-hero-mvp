import { z } from "zod";
import { getAuthContext } from "@/lib/auth/privy";
import { fail, ok } from "@/lib/api/http";
import { prisma } from "@/lib/prisma";
import { applyRateLimit } from "@/lib/security/rateLimit";

const voteSchema = z.object({
  value: z.union([z.literal(1), z.literal(-1)]),
});

type RouteContext = {
  params: { id: string };
};

export async function POST(request: Request, context: RouteContext) {
  const rate = await applyRateLimit({ keyPrefix: "idea_vote", limit: 60, windowSeconds: 60 });
  if (!rate.allowed) {
    return fail("Rate limit exceeded.", 429);
  }

  const auth = await getAuthContext();
  if (!auth.isAuthenticated) {
    return fail("Authentication required.", 401);
  }

  const payload = await request.json();
  const parsed = voteSchema.safeParse(payload);
  if (!parsed.success) {
    return fail("Invalid vote payload.", 422, parsed.error.flatten());
  }

  const user = await prisma.user.findUnique({ where: { privyUserId: auth.userId } });
  if (!user) {
    return fail("User not found.", 404);
  }

  const vote = await prisma.vote.upsert({
    where: {
      ideaId_userId: {
        ideaId: context.params.id,
        userId: user.id,
      },
    },
    update: { value: parsed.data.value },
    create: {
      ideaId: context.params.id,
      userId: user.id,
      value: parsed.data.value,
    },
  });

  const aggregate = await prisma.vote.groupBy({
    by: ["value"],
    where: { ideaId: context.params.id },
    _count: { value: true },
  });

  const votesUp = aggregate.find((entry) => entry.value === 1)?._count.value ?? 0;
  const votesDown = aggregate.find((entry) => entry.value === -1)?._count.value ?? 0;

  await prisma.idea.update({
    where: { id: context.params.id },
    data: { votesUp, votesDown },
  });

  return ok({ vote, votesUp, votesDown });
}
