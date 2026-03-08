"use client";

import { Badge, Button, Card } from "@once-ui-system/core";
import Map, { Marker } from "react-map-gl/mapbox";
import { useMemo, useState } from "react";
import { ArHuntScene } from "@/components/ar/ArHuntScene";
import type { Quest } from "@/lib/types";

type ExploreMapProps = {
  quests: Quest[];
};

const defaultPosition = {
  latitude: 48.137154,
  longitude: 11.576124,
};

function getDistanceMeters(aLat: number, aLon: number, bLat: number, bLon: number): number {
  const toRad = (value: number) => (value * Math.PI) / 180;
  const earthRadius = 6371000;
  const latDistance = toRad(bLat - aLat);
  const lonDistance = toRad(bLon - aLon);

  const haversine =
    Math.sin(latDistance / 2) * Math.sin(latDistance / 2) +
    Math.cos(toRad(aLat)) *
      Math.cos(toRad(bLat)) *
      Math.sin(lonDistance / 2) *
      Math.sin(lonDistance / 2);

  return 2 * earthRadius * Math.atan2(Math.sqrt(haversine), Math.sqrt(1 - haversine));
}

export function ExploreMap({ quests }: ExploreMapProps) {
  const [selectedQuest, setSelectedQuest] = useState<Quest | null>(null);
  const [userPosition] = useState(defaultPosition);

  const insideRadius = useMemo(() => {
    if (!selectedQuest) {
      return false;
    }

    const distance = getDistanceMeters(
      userPosition.latitude,
      userPosition.longitude,
      selectedQuest.latitude,
      selectedQuest.longitude,
    );

    return distance <= selectedQuest.radius;
  }, [selectedQuest, userPosition.latitude, userPosition.longitude]);

  return (
    <div className="space-y-4">
      <div className="h-[420px] overflow-hidden rounded-3xl border border-white/10 shadow-lg shadow-emerald-500/10">
        <Map
          mapboxAccessToken={process.env.NEXT_PUBLIC_MAPBOX_ACCESS_TOKEN}
          initialViewState={{ ...defaultPosition, zoom: 12 }}
          mapStyle="mapbox://styles/mapbox/dark-v11"
        >
          {quests.map((quest) => (
            <Marker
              key={quest.id}
              latitude={quest.latitude}
              longitude={quest.longitude}
              anchor="bottom"
              onClick={(event) => {
                event.originalEvent.stopPropagation();
                setSelectedQuest(quest);
              }}
            >
              <button
                type="button"
                className="rounded-full border border-white/20 bg-emerald-400 px-3 py-2 text-xs font-bold text-slate-950 shadow-md transition active:scale-95"
              >
                {quest.type}
              </button>
            </Marker>
          ))}
        </Map>
      </div>

      {selectedQuest ? (
        <div className="space-y-3">
          <Card className="rounded-2xl border border-white/10 bg-slate-900/60 p-4">
            <div className="mb-2 flex items-center justify-between">
              <h3 className="font-semibold text-white">{selectedQuest.title}</h3>
              <Badge>{selectedQuest.type}</Badge>
            </div>
            <p className="text-sm text-slate-200">{selectedQuest.description}</p>
            <div className="mt-3 flex gap-2">
              <Button variant="primary" size="l" className="min-h-11">
                Navigate
              </Button>
              <Button variant="secondary" size="l" className="min-h-11">
                Save Quest
              </Button>
            </div>
          </Card>
          <ArHuntScene questTitle={selectedQuest.title} insideRadius={insideRadius} />
        </div>
      ) : (
        <p className="text-sm text-slate-200">Tap a map marker to preview the AR mission.</p>
      )}
    </div>
  );
}
