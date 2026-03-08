import { createHash } from "crypto";

export type LedgerWriteInput = {
  userWallet: string;
  questId: string;
  rewardAmount: number;
  verificationHash: string;
};

export type LedgerWriteResult = {
  chainTxHash: string;
  anchorHash: string;
};

export interface RewardLedgerChain {
  writeContribution(input: LedgerWriteInput): Promise<LedgerWriteResult>;
}

class MockZeroGRewardLedger implements RewardLedgerChain {
  async writeContribution(input: LedgerWriteInput): Promise<LedgerWriteResult> {
    const hashInput = `${input.userWallet}:${input.questId}:${input.rewardAmount}:${input.verificationHash}:${Date.now()}`;
    const anchorHash = createHash("sha256").update(hashInput).digest("hex");
    return {
      chainTxHash: `0xledger${anchorHash.slice(0, 58)}`,
      anchorHash,
    };
  }
}

export const rewardLedgerChain: RewardLedgerChain = new MockZeroGRewardLedger();
