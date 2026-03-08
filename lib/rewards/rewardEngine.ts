import { prisma } from "@/lib/prisma";
import { env } from "@/lib/env";
import { rewardLedgerChain } from "@/lib/blockchain/rewardLedger";

type RewardContext = {
  submissionId: string;
  userId: string;
  questId: string;
  userWallet: string;
  verificationHash: string;
  rewardTokens: number;
};

export function calculateReward(baseReward: number, confidence: number): number {
  const multiplier = 0.6 + confidence * 0.8;
  return Number((baseReward * multiplier + env.HERO_REWARD_BASE * 0.1).toFixed(4));
}

export async function issueRewardLedgerEntry(context: RewardContext) {
  const chainResult = await rewardLedgerChain.writeContribution({
    userWallet: context.userWallet,
    questId: context.questId,
    rewardAmount: context.rewardTokens,
    verificationHash: context.verificationHash,
  });

  return prisma.rewardLedger.create({
    data: {
      userId: context.userId,
      submissionId: context.submissionId,
      questId: context.questId,
      userWallet: context.userWallet,
      rewardAmount: context.rewardTokens.toString(),
      verificationHash: chainResult.anchorHash,
      chainTxHash: chainResult.chainTxHash,
      claimed: false,
    },
  });
}
