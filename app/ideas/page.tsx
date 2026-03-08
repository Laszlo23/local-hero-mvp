import { Badge, Button, Card } from "@once-ui-system/core";
import { mockIdeas } from "@/lib/mockData";

export default function IdeasPage() {
  return (
    <section className="space-y-4 animate-float-in">
      <h1 className="text-2xl font-bold text-white">Community Solutions</h1>
      <div className="grid gap-4">
        {mockIdeas.map((idea) => (
          <Card key={idea.id} className="rounded-3xl border border-white/10 bg-slate-900/65 p-4">
            <div className="flex items-center justify-between gap-2">
              <h2 className="text-lg font-semibold text-white">{idea.ideaTitle}</h2>
              <Badge>City Idea</Badge>
            </div>
            <p className="mt-2 text-sm text-slate-200">{idea.ideaDescription}</p>
            <div className="mt-3 flex gap-2">
              <Button variant="secondary" size="m" className="min-h-11">
                👍 {idea.votesUp}
              </Button>
              <Button variant="tertiary" size="m" className="min-h-11">
                👎 {idea.votesDown}
              </Button>
            </div>
          </Card>
        ))}
      </div>
    </section>
  );
}
