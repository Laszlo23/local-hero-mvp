import { QuestStatus } from "@prisma/client";
import { z } from "zod";
import { fail, ok } from "@/lib/api/http";
import { prisma } from "@/lib/prisma";

const nearbySchema = z.object({
  latitude: z.coerce.number(),
  longitude: z.coerce.number(),
  maxDistance: z.coerce.number().default(5000),
});

function roughDistanceMeters(aLat: number, aLon: number, bLat: number, bLon: number): number {
  const metersPerDegree = 111_000;
  const latDelta = (aLat - bLat) * metersPerDegree;
  const lonDelta = (aLon - bLon) * metersPerDegree;
  return Math.sqrt(latDelta * latDelta + lonDelta * lonDelta);
}

export async function GET(request: Request) {
  const url = new URL(request.url);
  const parsed = nearbySchema.safeParse({
    latitude: url.searchParams.get("latitude"),
    longitude: url.searchParams.get("longitude"),
    maxDistance: url.searchParams.get("maxDistance") ?? 5000,
  });

  if (!parsed.success) {
    return fail("Invalid nearby query params.", 422, parsed.error.flatten());
  }

  const quests = await prisma.quest.findMany({
    where: { status: QuestStatus.ACTIVE },
    include: { sponsor: true },
  });

  const nearby = quests.filter((quest) => {
    const distance = roughDistanceMeters(
      parsed.data.latitude,
      parsed.data.longitude,
      Number(quest.latitude),
      Number(quest.longitude),
    );
    return distance <= Math.max(parsed.data.maxDistance, quest.radius);
  });

  return ok({ quests: nearby });
}
