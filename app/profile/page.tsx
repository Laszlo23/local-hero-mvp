import { Badge, Button, Card, ProgressBar } from "@once-ui-system/core";

export default function ProfilePage() {
  return (
    <section className="space-y-4 animate-float-in">
      <h1 className="text-2xl font-bold text-white">Hero Profile</h1>
      <Card className="space-y-4 rounded-3xl border border-white/10 bg-slate-900/70 p-4">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm text-slate-300">Wallet</p>
            <p className="font-mono text-xs text-white">0x31D4...A991</p>
          </div>
          <Badge>Builder</Badge>
        </div>
        <div className="grid grid-cols-2 gap-3 text-sm text-slate-100">
          <p>XP: 1320</p>
          <p>Hero score: 910</p>
          <p>Trust score: 84</p>
          <p>Quests completed: 37</p>
          <p>Tokens earned: 510 HERO</p>
          <p>Level: Builder</p>
        </div>
        <ProgressBar value={70} max={100} />
        <Button variant="primary" size="l" fillWidth>
          Claim HERO Rewards
        </Button>
      </Card>
    </section>
  );
}
