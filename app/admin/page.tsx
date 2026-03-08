import { Card } from "@once-ui-system/core";
import Link from "next/link";

const moderationItems = [
  { label: "Approve quests", href: "/api/admin/quests" },
  { label: "Review submissions", href: "/api/admin/submissions" },
  { label: "Manage sponsors", href: "/api/admin/sponsors" },
  { label: "Moderate users", href: "/api/admin/users" },
];

export default function AdminPage() {
  return (
    <section className="space-y-4 animate-float-in">
      <h1 className="text-2xl font-bold text-white">Admin Moderation Dashboard</h1>
      <div className="grid gap-3 sm:grid-cols-2">
        {moderationItems.map((item) => (
          <Link key={item.label} href={item.href}>
            <Card className="rounded-2xl border border-white/10 bg-slate-900/70 p-4 text-sm text-slate-100 transition hover:border-emerald-300/50">
              {item.label}
            </Card>
          </Link>
        ))}
      </div>
    </section>
  );
}
