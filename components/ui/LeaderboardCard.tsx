import { Badge, Card, ProgressBar } from "@once-ui-system/core";

type LeaderboardCardProps = {
  rank: number;
  username: string;
  heroScore: number;
  level: string;
};

export function LeaderboardCard({ rank, username, heroScore, level }: LeaderboardCardProps) {
  return (
    <Card className="rounded-3xl border border-white/10 bg-slate-900/65 p-4 shadow-lg shadow-yellow-400/10">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-xs uppercase tracking-wide text-yellow-200/90">Rank #{rank}</p>
          <p className="text-base font-semibold text-white">{username}</p>
        </div>
        <Badge>{level}</Badge>
      </div>
      <div className="mt-3">
        <p className="mb-2 text-xs text-slate-100">Hero score: {heroScore}</p>
        <ProgressBar value={Math.min(heroScore, 1000)} max={1000} />
      </div>
    </Card>
  );
}
