export type ChallengeOption = {
  id: string;
  label: string;
  points: number;
  impactTag: string;
};

export type DailyChallenge = {
  id: string;
  prompt: string;
  category: "HELP" | "LEARN" | "MOVE" | "COMMUNITY";
  options: ChallengeOption[];
};

export const dailyChallenges: DailyChallenge[] = [
  {
    id: "challenge-help-elder",
    prompt: "You see an older neighbor carrying heavy bags in the rain. What do you do?",
    category: "HELP",
    options: [
      { id: "help-now", label: "Offer immediate help and walk them home", points: 40, impactTag: "High impact" },
      { id: "call-someone", label: "Call a friend to assist", points: 22, impactTag: "Medium impact" },
      { id: "ignore", label: "Keep walking, no action", points: 0, impactTag: "No impact" },
    ],
  },
  {
    id: "challenge-move-cleanup",
    prompt: "Your local park has litter after a weekend event. What is your move?",
    category: "MOVE",
    options: [
      { id: "cleanup-group", label: "Organize a quick cleanup walk", points: 34, impactTag: "Community boost" },
      { id: "solo-cleanup", label: "Pick up what you can while jogging", points: 26, impactTag: "Healthy impact" },
      { id: "report-only", label: "Only report to city services", points: 12, impactTag: "Low impact" },
    ],
  },
];

export function getLevelFromScore(heroScore: number): string {
  if (heroScore >= 1400) return "Local Hero";
  if (heroScore >= 1000) return "Champion";
  if (heroScore >= 650) return "Builder";
  if (heroScore >= 350) return "Helper";
  return "Rookie";
}
