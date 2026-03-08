import { PrismaClient, LeaderboardPeriod, QuestStatus, QuestType, UserLevel } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  const admin = await prisma.user.upsert({
    where: { username: "admin_localhero" },
    update: {},
    create: {
      username: "admin_localhero",
      email: "admin@localhero.app",
      role: "ADMIN",
      level: UserLevel.CHAMPION,
      xp: 4500,
      heroScore: 1400,
      trustScore: 90,
      questsCompleted: 112,
      tokensEarned: "2000",
      walletAddress: "0xAdminLocalHero0000000000000000000000000001",
    },
  });

  const sponsorOwner = await prisma.user.upsert({
    where: { username: "green_cafe_owner" },
    update: {},
    create: {
      username: "green_cafe_owner",
      email: "owner@greencafe.local",
      role: "SPONSOR",
      level: UserLevel.BUILDER,
      xp: 1700,
      heroScore: 880,
      trustScore: 85,
      questsCompleted: 42,
      tokensEarned: "550",
      walletAddress: "0xSponsor0000000000000000000000000000000002",
    },
  });

  const sponsor = await prisma.sponsor.upsert({
    where: { ownerId: sponsorOwner.id },
    update: {},
    create: {
      name: "Green Cafe",
      description: "Sustainable coffee and community events",
      rewardDetails: "10% voucher + bonus HERO",
      approved: true,
      ownerId: sponsorOwner.id,
    },
  });

  await prisma.quest.createMany({
    data: [
      {
        title: "Help carry groceries",
        description: "Help a neighbor carry groceries to their home.",
        type: QuestType.HELP,
        status: QuestStatus.ACTIVE,
        rewardXp: 35,
        rewardTokens: "15",
        latitude: "48.1371540",
        longitude: "11.5761240",
        radius: 120,
        aiVerificationRequired: true,
      },
      {
        title: "Sustainable coffee AR mission",
        description: "Visit Green Cafe and complete the AR sustainability clue.",
        type: QuestType.BUSINESS_SPONSORED,
        status: QuestStatus.ACTIVE,
        rewardXp: 55,
        rewardTokens: "28",
        latitude: "48.1395000",
        longitude: "11.5791000",
        radius: 150,
        sponsorId: sponsor.id,
        sponsorOwnerId: sponsorOwner.id,
        aiVerificationRequired: true,
      },
    ],
    skipDuplicates: true,
  });

  const topUser = await prisma.user.upsert({
    where: { username: "mila_helper" },
    update: {},
    create: {
      username: "mila_helper",
      email: "mila@localhero.app",
      level: UserLevel.LOCAL_HERO,
      xp: 5200,
      heroScore: 1600,
      trustScore: 94,
      questsCompleted: 138,
      tokensEarned: "2600",
      walletAddress: "0xHero000000000000000000000000000000000003",
    },
  });

  await prisma.leaderboard.upsert({
    where: {
      period_seasonLabel_rank: {
        period: LeaderboardPeriod.MONTHLY,
        seasonLabel: "2026-03",
        rank: 1,
      },
    },
    update: {},
    create: {
      period: LeaderboardPeriod.MONTHLY,
      seasonLabel: "2026-03",
      rank: 1,
      userId: topUser.id,
      heroScore: topUser.heroScore,
      questsCompleted: topUser.questsCompleted,
      communityVotes: 88,
    },
  });

  await prisma.user.update({
    where: { id: admin.id },
    data: { trustScore: 92 },
  });
}

main()
  .catch((error) => {
    console.error(error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
