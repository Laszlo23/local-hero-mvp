import { SubmissionStatus } from "@prisma/client";
import { getAuthContext } from "@/lib/auth/privy";
import { fail, ok } from "@/lib/api/http";
import { prisma } from "@/lib/prisma";
import { runVerificationPipeline } from "@/lib/ai/verificationPipeline";
import { findDuplicateSubmission, hashBuffer, computeSpamScore } from "@/lib/security/antiSpam";
import { applyRateLimit } from "@/lib/security/rateLimit";
import { uploadSubmissionAsset } from "@/lib/storage/objectStorage";

export async function POST(request: Request) {
  const rate = await applyRateLimit({ keyPrefix: "submission_create", limit: 12, windowSeconds: 60 });
  if (!rate.allowed) {
    return fail("Rate limit exceeded.", 429);
  }

  const auth = await getAuthContext();
  if (!auth.isAuthenticated) {
    return fail("Authentication required.", 401);
  }

  const formData = await request.formData();
  const questId = String(formData.get("questId") ?? "");
  const imageFile = formData.get("image");
  const videoFile = formData.get("video");
  const textProof = String(formData.get("textProof") ?? "");

  if (!questId || !(imageFile instanceof File)) {
    return fail("questId and image are required.", 422);
  }

  const quest = await prisma.quest.findUnique({ where: { id: questId } });
  if (!quest) {
    return fail("Quest not found.", 404);
  }

  const imageBuffer = Buffer.from(await imageFile.arrayBuffer());
  const imageHash = await hashBuffer(imageBuffer);
  const duplicate = await findDuplicateSubmission(imageHash);
  const spamScore = computeSpamScore(textProof);

  const imageUrl = await uploadSubmissionAsset(imageBuffer, imageFile.type || "image/jpeg", "images");
  let videoUrl: string | undefined;

  if (videoFile instanceof File && videoFile.size > 0) {
    const videoBuffer = Buffer.from(await videoFile.arrayBuffer());
    videoUrl = await uploadSubmissionAsset(videoBuffer, videoFile.type || "video/mp4", "videos");
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

  const submission = await prisma.submission.create({
    data: {
      userId: user.id,
      questId,
      imageUrl,
      videoUrl,
      textProof,
      imageHash,
      duplicateOfId: duplicate?.id,
      status: SubmissionStatus.PENDING,
      spamScore,
    },
  });

  if (quest.aiVerificationRequired) {
    await runVerificationPipeline(submission.id);
  }

  const finalSubmission = await prisma.submission.findUnique({ where: { id: submission.id } });

  return ok({ submission: finalSubmission }, 201);
}
