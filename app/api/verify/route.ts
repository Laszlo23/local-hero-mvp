import { z } from "zod";
import { getAuthContext } from "@/lib/auth/privy";
import { fail, ok } from "@/lib/api/http";
import { runVerificationPipeline } from "@/lib/ai/verificationPipeline";
import { applyRateLimit } from "@/lib/security/rateLimit";

const verifySchema = z.object({
  submissionId: z.string().min(1),
});

export async function POST(request: Request) {
  const rate = await applyRateLimit({ keyPrefix: "verify_submission", limit: 30, windowSeconds: 60 });
  if (!rate.allowed) {
    return fail("Rate limit exceeded.", 429);
  }

  const auth = await getAuthContext();
  if (!auth.isAuthenticated) {
    return fail("Authentication required.", 401);
  }

  const payload = await request.json();
  const parsed = verifySchema.safeParse(payload);
  if (!parsed.success) {
    return fail("Invalid verify payload.", 422, parsed.error.flatten());
  }

  const submission = await runVerificationPipeline(parsed.data.submissionId);
  return ok({ submission });
}
