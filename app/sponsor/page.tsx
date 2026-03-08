import { Badge, Button, Card, Input, Textarea } from "@once-ui-system/core";

export default function SponsorPage() {
  return (
    <section className="space-y-4 animate-float-in">
      <h1 className="text-2xl font-bold text-white">Business Sponsor Onboarding</h1>
      <p className="text-sm text-slate-200">
        Launch sponsor quests with rewards like discounts, vouchers, free products, and HERO tokens.
      </p>
      <Card className="rounded-3xl border border-white/10 bg-slate-900/65 p-4">
        <form className="space-y-3">
          <Input id="sponsor-business-name" label="Business name" placeholder="Green Cafe" />
          <Input id="sponsor-quest-title" label="Quest title" placeholder="Discover our sustainable coffee" />
          <Textarea id="sponsor-reward-details" label="Reward details" placeholder="Voucher, free product, HERO bonus" lines={4} />
          <Button type="submit" variant="primary" size="l" fillWidth className="min-h-12">
            Create sponsor profile
          </Button>
        </form>
      </Card>
      <div className="flex gap-2 text-xs">
        <Badge>Discount</Badge>
        <Badge>Voucher</Badge>
        <Badge>Free Product</Badge>
        <Badge>HERO Tokens</Badge>
      </div>
    </section>
  );
}
