export enum QuestType {
  HELP = "HELP",
  LEARN = "LEARN",
  MOVE = "MOVE",
  AR_HUNT = "AR_HUNT",
  BUSINESS_SPONSORED = "BUSINESS_SPONSORED",
}

export type Quest = {
  id: string;
  title: string;
  description: string;
  type: QuestType;
  rewardXp: number;
  rewardTokens: number;
  latitude: number;
  longitude: number;
  radius: number;
  sponsorId?: string | null;
  aiVerificationRequired: boolean;
};

export type VerificationResult = {
  verified: boolean;
  confidence: number;
  reason: string;
};
