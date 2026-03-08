import { prisma } from "@/lib/prisma";
import { heroTokenAdapter } from "@/lib/blockchain/heroToken";

export async function claimLedgerReward(ledgerId: string, userId: string) {
  const ledger = await prisma.rewardLedger.findFirst({
    where: {
      id: ledgerId,
      userId,
      claimed: false,
    },
  });

  if (!ledger) {
    throw new Error("No unclaimed reward found.");
  }

  const claimResult = await heroTokenAdapter.claim({
    walletAddress: ledger.userWallet,
    amount: Number(ledger.rewardAmount),
    ledgerId: ledger.id,
  });

  return prisma.rewardLedger.update({
    where: { id: ledger.id },
    data: {
      claimed: true,
      claimedAt: new Date(),
      claimTxHash: claimResult.txHash,
    },
  });
}
