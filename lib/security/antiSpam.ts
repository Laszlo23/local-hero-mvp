import { createHash } from "crypto";
import { prisma } from "@/lib/prisma";

export async function hashBuffer(buffer: Buffer): Promise<string> {
  return createHash("sha256").update(buffer).digest("hex");
}

export async function findDuplicateSubmission(imageHash: string) {
  return prisma.submission.findFirst({
    where: { imageHash },
    select: { id: true, createdAt: true, userId: true },
    orderBy: { createdAt: "desc" },
  });
}

export function computeSpamScore(textProof: string | null | undefined): number {
  if (!textProof) {
    return 0;
  }

  const repeatedCharacters = /(.)\1{7,}/.test(textProof) ? 0.3 : 0;
  const manyLinks = (textProof.match(/https?:\/\//g)?.length ?? 0) > 2 ? 0.4 : 0;
  const lowSignal = textProof.trim().length < 8 ? 0.2 : 0;

  return Math.min(repeatedCharacters + manyLinks + lowSignal, 1);
}
