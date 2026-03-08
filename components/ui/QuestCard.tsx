import { Badge, Button, Card, ProgressBar } from "@once-ui-system/core";

type QuestCardProps = {
  title: string;
  description: string;
  type: string;
  rewardXp: number;
  rewardTokens: number;
  completion: number;
};

export function QuestCard({
  title,
  description,
  type,
  rewardXp,
  rewardTokens,
  completion,
}: QuestCardProps) {
  return (
    <Card className="rounded-3xl border border-white/10 bg-slate-900/65 p-4 shadow-lg shadow-emerald-500/10">
      <div className="mb-3 flex items-center justify-between gap-3">
        <h3 className="text-lg font-semibold leading-tight text-white">{title}</h3>
        <Badge>{type}</Badge>
      </div>
      <p className="text-sm text-slate-200">{description}</p>
      <div className="mt-4 space-y-3">
        <div className="flex justify-between text-xs text-slate-100">
          <span>+{rewardXp} XP</span>
          <span>+{rewardTokens} HERO</span>
        </div>
        <ProgressBar value={completion} max={100} />
        <Button variant="primary" size="l" fillWidth className="min-h-12">
          Tap to Join Quest
        </Button>
      </div>
    </Card>
  );
}
