import { createHash } from "crypto";
import type { VerificationResult } from "@/lib/types";

export type ZeroGAiVerifier = {
  verifySubmission: (input: {
    questTitle: string;
    imageHash: string;
    textProof?: string | null;
    duplicateFound: boolean;
    spamScore: number;
  }) => Promise<VerificationResult>;
};

class MockZeroGAiVerifier implements ZeroGAiVerifier {
  async verifySubmission(input: {
    questTitle: string;
    imageHash: string;
    textProof?: string | null;
    duplicateFound: boolean;
    spamScore: number;
  }): Promise<VerificationResult> {
    if (input.duplicateFound) {
      return {
        verified: false,
        confidence: 0.12,
        reason: "Potential duplicate image detected.",
      };
    }

    const heuristicSeed = createHash("sha256")
      .update(`${input.questTitle}:${input.imageHash}:${input.textProof ?? ""}`)
      .digest("hex");
    const confidence = Number.parseInt(heuristicSeed.slice(0, 2), 16) / 255;

    if (input.spamScore > 0.6) {
      return {
        verified: false,
        confidence: Math.max(0.1, confidence - 0.4),
        reason: "Submission flagged by anti-spam heuristics.",
      };
    }

    const isPlausible = confidence > 0.45;
    return {
      verified: isPlausible,
      confidence: Number(confidence.toFixed(2)),
      reason: isPlausible ? "Scene plausibility check passed (mock 0G AI)." : "Image does not confidently match quest context.",
    };
  }
}

export const zeroGAiVerifier: ZeroGAiVerifier = new MockZeroGAiVerifier();
