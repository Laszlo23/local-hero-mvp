import { Button, Card, Input, Textarea } from "@once-ui-system/core";

export default function SubmitPage() {
  return (
    <section className="space-y-4 animate-float-in">
      <h1 className="text-2xl font-bold text-white">Submit Quest Proof</h1>
      <p className="text-sm text-slate-200">
        Upload image proof, optional short video, and contextual text for AI verification.
      </p>
      <Card className="rounded-3xl border border-white/10 bg-slate-900/70 p-4">
        <form className="space-y-3">
          <Input id="quest-id" label="Quest ID" placeholder="q_help_1" />
          <Input id="quest-image" label="Proof image" type="file" />
          <Input id="quest-video" label="Short video (optional)" type="file" />
          <Textarea id="quest-notes" label="Optional notes" placeholder="What did you do?" lines={4} />
          <Button type="submit" variant="primary" size="l" fillWidth className="min-h-12">
            Send for verification
          </Button>
        </form>
      </Card>
      <div className="rounded-2xl border border-yellow-300/40 bg-yellow-300/10 p-3 text-xs text-yellow-100">
        Frame-ready tip: add one clear photo with the local context for faster AI verification.
      </div>
    </section>
  );
}
