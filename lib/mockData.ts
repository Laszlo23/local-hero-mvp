import { QuestType, type Quest } from "@/lib/types";

export const mockQuests: Quest[] = [
  {
    id: "q_help_1",
    title: "Help with grocery bags",
    description: "Assist an elderly neighbor with heavy groceries.",
    type: QuestType.HELP,
    rewardXp: 30,
    rewardTokens: 15,
    latitude: 48.137154,
    longitude: 11.576124,
    radius: 120,
    sponsorId: null,
    aiVerificationRequired: true,
  },
  {
    id: "q_ar_1",
    title: "Old town AR eco hunt",
    description: "Find the hidden AR artifact and answer the climate riddle.",
    type: QuestType.AR_HUNT,
    rewardXp: 50,
    rewardTokens: 30,
    latitude: 48.1422,
    longitude: 11.5756,
    radius: 150,
    sponsorId: "sponsor_cafe_1",
    aiVerificationRequired: true,
  },
];

export const mockIdeas = [
  {
    id: "idea_1",
    ideaTitle: "Bike-first school routes",
    ideaDescription: "Add protected bike lanes near schools to reduce traffic and emissions.",
    votesUp: 43,
    votesDown: 6,
  },
  {
    id: "idea_2",
    ideaTitle: "Neighborhood compost hubs",
    ideaDescription: "Create community compost spots tied to local garden projects.",
    votesUp: 35,
    votesDown: 4,
  },
];
