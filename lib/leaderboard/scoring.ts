import { LeaderboardPeriod } from "@prisma/client";
import { prisma } from "@/lib/prisma";

type LeaderboardInput = {
  period: LeaderboardPeriod;
  seasonLabel: string;
};

export function computeHeroScore(questCount: number, xp: number, trustScore: number, communityVotes: number): number {
  return Math.round(questCount * 10 + xp * 0.25 + trustScore * 4 + communityVotes * 2.5);
}

export async function rebuildLeaderboard(input: LeaderboardInput) {
  const users = await prisma.user.findMany({
    where: { isBanned: false },
    select: {
      id: true,
      xp: true,
      trustScore: true,
      questsCompleted: true,
      ideas: {
        select: { votesUp: true, votesDown: true },
      },
    },
  });

  const scored = users
    .map((user) => {
      const communityVotes = user.ideas.reduce((sum, idea) => sum + (idea.votesUp - idea.votesDown), 0);
      const heroScore = computeHeroScore(user.questsCompleted, user.xp, user.trustScore, communityVotes);
      return {
        userId: user.id,
        heroScore,
        questsCompleted: user.questsCompleted,
        communityVotes,
      };
    })
    .sort((a, b) => b.heroScore - a.heroScore)
    .slice(0, 100);

  await prisma.leaderboard.deleteMany({
    where: { period: input.period, seasonLabel: input.seasonLabel },
  });

  await prisma.leaderboard.createMany({
    data: scored.map((entry, index) => ({
      period: input.period,
      seasonLabel: input.seasonLabel,
      rank: index + 1,
      userId: entry.userId,
      heroScore: entry.heroScore,
      questsCompleted: entry.questsCompleted,
      communityVotes: entry.communityVotes,
    })),
  });

  return scored;
}
