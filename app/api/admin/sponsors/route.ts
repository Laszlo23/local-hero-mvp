import { z } from "zod";
import { getAuthContext, requireAdmin } from "@/lib/auth/privy";
import { fail, ok } from "@/lib/api/http";
import { prisma } from "@/lib/prisma";

const sponsorSchema = z.object({
  sponsorId: z.string().min(1),
  approved: z.boolean(),
});

export async function GET() {
  const auth = await getAuthContext();
  try {
    requireAdmin(auth);
  } catch (error) {
    return fail(error instanceof Error ? error.message : "Forbidden", 403);
  }

  const sponsors = await prisma.sponsor.findMany({
    orderBy: [{ approved: "asc" }, { createdAt: "desc" }],
    include: {
      owner: { select: { username: true, email: true } },
    },
  });

  return ok({ sponsors });
}

export async function PATCH(request: Request) {
  const auth = await getAuthContext();
  try {
    requireAdmin(auth);
  } catch (error) {
    return fail(error instanceof Error ? error.message : "Forbidden", 403);
  }

  const payload = await request.json();
  const parsed = sponsorSchema.safeParse(payload);
  if (!parsed.success) {
    return fail("Invalid sponsor moderation payload.", 422, parsed.error.flatten());
  }

  const sponsor = await prisma.sponsor.update({
    where: { id: parsed.data.sponsorId },
    data: { approved: parsed.data.approved },
  });

  return ok({ sponsor });
}
