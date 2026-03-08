import { z } from "zod";
import { getAuthContext, requireAdmin } from "@/lib/auth/privy";
import { fail, ok } from "@/lib/api/http";
import { prisma } from "@/lib/prisma";

const userModerationSchema = z.object({
  userId: z.string().min(1),
  ban: z.boolean(),
  reason: z.string().optional(),
});

export async function GET() {
  const auth = await getAuthContext();
  try {
    requireAdmin(auth);
  } catch (error) {
    return fail(error instanceof Error ? error.message : "Forbidden", 403);
  }

  const users = await prisma.user.findMany({
    orderBy: { createdAt: "desc" },
    select: {
      id: true,
      username: true,
      email: true,
      walletAddress: true,
      isBanned: true,
      banReason: true,
      role: true,
    },
  });

  return ok({ users });
}

export async function PATCH(request: Request) {
  const auth = await getAuthContext();
  try {
    requireAdmin(auth);
  } catch (error) {
    return fail(error instanceof Error ? error.message : "Forbidden", 403);
  }

  const payload = await request.json();
  const parsed = userModerationSchema.safeParse(payload);
  if (!parsed.success) {
    return fail("Invalid user moderation payload.", 422, parsed.error.flatten());
  }

  const user = await prisma.user.update({
    where: { id: parsed.data.userId },
    data: {
      isBanned: parsed.data.ban,
      banReason: parsed.data.ban ? parsed.data.reason ?? "Policy violation." : null,
    },
  });

  return ok({ user });
}
