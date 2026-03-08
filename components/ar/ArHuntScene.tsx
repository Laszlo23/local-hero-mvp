"use client";

import { Card } from "@once-ui-system/core";
import { useMemo } from "react";

type ArHuntSceneProps = {
  questTitle: string;
  insideRadius: boolean;
};

export function ArHuntScene({ questTitle, insideRadius }: ArHuntSceneProps) {
  const status = useMemo(() => {
    if (!insideRadius) {
      return "Move closer to the quest location to unlock AR content.";
    }

    return "AR object unlocked. Solve the clue on-site to complete this hunt.";
  }, [insideRadius]);

  return (
    <Card className="rounded-3xl border border-emerald-400/40 bg-slate-900/70 p-4">
      <h3 className="text-lg font-semibold text-emerald-200">AR Hunt: {questTitle}</h3>
      <p className="mt-2 text-sm text-slate-100">{status}</p>
      <div className="mt-4 rounded-xl border border-yellow-200/30 bg-yellow-200/10 p-4 text-xs text-yellow-100">
        Camera overlay preview for AR.js / 8thWall interaction.
      </div>
    </Card>
  );
}
