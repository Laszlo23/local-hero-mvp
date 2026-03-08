"use client";

import { create } from "zustand";
import type { Quest } from "@/lib/types";

type QuestState = {
  quests: Quest[];
  selectedQuest: Quest | null;
  setQuests: (quests: Quest[]) => void;
  selectQuest: (quest: Quest | null) => void;
};

export const useQuestStore = create<QuestState>((set) => ({
  quests: [],
  selectedQuest: null,
  setQuests: (quests) => set({ quests }),
  selectQuest: (quest) => set({ selectedQuest: quest }),
}));
