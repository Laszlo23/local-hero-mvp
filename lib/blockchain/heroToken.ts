import { createHash } from "crypto";

export type ClaimInput = {
  walletAddress: string;
  amount: number;
  ledgerId: string;
};

export type ClaimResult = {
  txHash: string;
};

export interface HeroTokenAdapter {
  claim(input: ClaimInput): Promise<ClaimResult>;
}

class MockHeroTokenAdapter implements HeroTokenAdapter {
  async claim(input: ClaimInput): Promise<ClaimResult> {
    const txHash = createHash("sha256")
      .update(`${input.walletAddress}:${input.amount}:${input.ledgerId}:${Date.now()}`)
      .digest("hex");

    return { txHash: `0xhero${txHash.slice(0, 60)}` };
  }
}

export const heroTokenAdapter: HeroTokenAdapter = new MockHeroTokenAdapter();
