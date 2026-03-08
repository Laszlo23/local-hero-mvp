import { SubmissionStatus } from "@prisma/client";
import { createHash } from "crypto";
import { prisma } from "@/lib/prisma";
import { zeroGAiVerifier } from "@/lib/ai/zeroGVerifier";
import { calculateReward, issueRewardLedgerEntry } from "@/lib/rewards/rewardEngine";

export async function runVerificationPipeline(submissionId: string) {
  const submission = await prisma.submission.findUnique({
    where: { id: submissionId },
    include: {
      quest: true,
      user: true,
    },
  });

  if (!submission) {
    throw new Error("Submission not found.");
  }

  const result = await zeroGAiVerifier.verifySubmission({
    questTitle: submission.quest.title,
    imageHash: submission.imageHash ?? "",
    textProof: submission.textProof,
    duplicateFound: Boolean(submission.duplicateOfId),
    spamScore: submission.spamScore,
  });

  const verificationHash = createHash("sha256")
    .update(`${submission.id}:${submission.imageHash}:${result.verified}:${result.confidence}:${result.reason}`)
    .digest("hex");

  const status = result.verified ? SubmissionStatus.VERIFIED : SubmissionStatus.REJECTED;

  const updatedSubmission = await prisma.submission.update({
    where: { id: submission.id },
    data: {
      status,
      aiVerified: result.verified,
      aiConfidence: result.confidence,
      aiReason: result.reason,
      aiVerificationHash: verificationHash,
    },
  });

  if (result.verified) {
    const rewardAmount = calculateReward(Number(submission.quest.rewardTokens), result.confidence);
    const walletAddress = submission.user.walletAddress ?? `wallet-${submission.userId}`;

    await issueRewardLedgerEntry({
      submissionId: submission.id,
      userId: submission.userId,
      questId: submission.questId,
      userWallet: walletAddress,
      verificationHash,
      rewardTokens: rewardAmount,
    });

    await prisma.user.update({
      where: { id: submission.userId },
      data: {
        xp: { increment: submission.quest.rewardXp },
        questsCompleted: { increment: 1 },
        tokensEarned: { increment: rewardAmount },
        heroScore: { increment: Math.round(submission.quest.rewardXp * 0.8 + rewardAmount) },
      },
    });
  }

  return updatedSubmission;
}
