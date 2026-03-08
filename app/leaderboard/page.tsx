import { Button, Card } from "@once-ui-system/core";
import { LeaderboardCard } from "@/components/ui/LeaderboardCard";

const rankings = [
  { rank: 1, username: "MilaHelper", heroScore: 980, level: "Local Hero" },
  { rank: 2, username: "UrbanBuilder", heroScore: 920, level: "Champion" },
  { rank: 3, username: "CleanCityRun", heroScore: 875, level: "Builder" },
];

export default function LeaderboardPage() {
  return (
    <section className="space-y-4 animate-float-in">
      <h1 className="text-2xl font-bold text-white">Leaderboards</h1>
      <p className="text-sm text-slate-200">Monthly Hero, Quarterly Champion, Yearly Local Hero.</p>
      <Card className="rounded-2xl border border-emerald-300/40 bg-emerald-300/10 p-3">
        <p className="text-sm text-white">Climb the board and share your streak on Farcaster each day.</p>
        <div className="mt-3">
          <Button variant="primary" href="https://warpcast.com/~/compose">
            Share Hero Score
          </Button>
        </div>
      </Card>
      <div className="grid gap-3 md:grid-cols-3">
        {rankings.map((entry) => (
          <LeaderboardCard key={entry.rank} {...entry} />
        ))}
      </div>
    </section>
  );
}
