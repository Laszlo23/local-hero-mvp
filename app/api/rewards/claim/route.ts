import { z } from "zod";
import { getAuthContext } from "@/lib/auth/privy";
import { fail, ok } from "@/lib/api/http";
import { prisma } from "@/lib/prisma";
import { claimLedgerReward } from "@/lib/rewards/claimService";

const claimSchema = z.object({
  ledgerId: z.string().min(1),
});

export async function POST(request: Request) {
  const auth = await getAuthContext();
  if (!auth.isAuthenticated) {
    return fail("Authentication required.", 401);
  }

  const payload = await request.json();
  const parsed = claimSchema.safeParse(payload);
  if (!parsed.success) {
    return fail("Invalid claim payload.", 422, parsed.error.flatten());
  }

  const user = await prisma.user.findUnique({ where: { privyUserId: auth.userId } });
  if (!user) {
    return fail("User not found.", 404);
  }

  const claim = await claimLedgerReward(parsed.data.ledgerId, user.id);
  return ok({ claim });
}
