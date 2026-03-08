import { Badge, Card } from "@once-ui-system/core";
import { QuestCard } from "@/components/ui/QuestCard";
import { mockQuests } from "@/lib/mockData";

export default function QuestsPage() {
  return (
    <section className="space-y-4 animate-float-in">
      <h1 className="text-2xl font-bold text-white">Available Missions</h1>
      <Card className="rounded-2xl border border-white/10 bg-slate-900/55 p-3">
        <div className="flex flex-wrap gap-2">
          <Badge>HELP</Badge>
          <Badge>LEARN</Badge>
          <Badge>MOVE</Badge>
          <Badge>AR_HUNT</Badge>
          <Badge>BUSINESS_SPONSORED</Badge>
        </div>
        <p className="mt-2 text-xs text-slate-200">Tap cards to join • Swipe feed on mobile</p>
      </Card>
      <div className="grid gap-4 md:grid-cols-2">
        {mockQuests.map((quest) => (
          <QuestCard
            key={quest.id}
            title={quest.title}
            description={quest.description}
            type={quest.type}
            rewardXp={quest.rewardXp}
            rewardTokens={quest.rewardTokens}
            completion={30}
          />
        ))}
      </div>
    </section>
  );
}
