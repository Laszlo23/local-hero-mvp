import { SubmissionStatus } from "@prisma/client";
import { z } from "zod";
import { getAuthContext, requireAdmin } from "@/lib/auth/privy";
import { fail, ok } from "@/lib/api/http";
import { prisma } from "@/lib/prisma";

const moderationSchema = z.object({
  submissionId: z.string().min(1),
  status: z.nativeEnum(SubmissionStatus),
});

export async function GET() {
  const auth = await getAuthContext();
  try {
    requireAdmin(auth);
  } catch (error) {
    return fail(error instanceof Error ? error.message : "Forbidden", 403);
  }

  const submissions = await prisma.submission.findMany({
    where: {
      status: { in: [SubmissionStatus.PENDING, SubmissionStatus.FLAGGED] },
    },
    orderBy: { createdAt: "desc" },
    include: {
      quest: { select: { title: true, type: true } },
      user: { select: { username: true, walletAddress: true } },
    },
  });

  return ok({ submissions });
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

  const submission = await prisma.submission.update({
    where: { id: parsed.data.submissionId },
    data: { status: parsed.data.status },
  });

  return ok({ submission });
}
