import { z } from "zod";
import { getAuthContext } from "@/lib/auth/privy";
import { fail, ok } from "@/lib/api/http";
import { prisma } from "@/lib/prisma";
import { applyRateLimit } from "@/lib/security/rateLimit";

const ideaSchema = z.object({
  ideaTitle: z.string().min(5),
  ideaDescription: z.string().min(20),
});

export async function GET() {
  const ideas = await prisma.idea.findMany({
    orderBy: [{ votesUp: "desc" }, { createdAt: "desc" }],
    include: {
      author: {
        select: { username: true, avatarUrl: true },
      },
    },
  });

  return ok({ ideas });
}

export async function POST(request: Request) {
  const rate = await applyRateLimit({ keyPrefix: "idea_create", limit: 20, windowSeconds: 60 });
  if (!rate.allowed) {
    return fail("Rate limit exceeded.", 429);
  }

  const auth = await getAuthContext();
  if (!auth.isAuthenticated) {
    return fail("Authentication required.", 401);
  }

  const payload = await request.json();
  const parsed = ideaSchema.safeParse(payload);
  if (!parsed.success) {
    return fail("Invalid idea payload.", 422, parsed.error.flatten());
  }

  const user = await prisma.user.upsert({
    where: { privyUserId: auth.userId },
    update: {},
    create: {
      privyUserId: auth.userId,
      username: `hero_${auth.userId.slice(0, 8)}`,
      walletAddress: auth.walletAddress,
    },
  });

  const idea = await prisma.idea.create({
    data: {
      ideaTitle: parsed.data.ideaTitle,
      ideaDescription: parsed.data.ideaDescription,
      authorId: user.id,
    },
  });

  return ok({ idea }, 201);
}
