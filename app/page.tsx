import { Card } from "@once-ui-system/core";
import Link from "next/link";
import { HeroQuestExperience } from "@/components/game/HeroQuestExperience";
import { LANDING_SECTIONS } from "@/lib/constants";

export default function Home() {
  return (
    <section className="space-y-6 pb-20 sm:space-y-8">
      <div className="space-y-4">
        <p className="inline-flex rounded-full border border-emerald-300/50 bg-emerald-300/10 px-3 py-1 text-xs font-semibold uppercase tracking-wider text-emerald-200">
          Local Hero / Hero Quest
        </p>
        <h1 className="text-3xl font-bold leading-tight text-white sm:text-5xl">
          Play daily. Help locally. Earn HERO.
        </h1>
        <p className="max-w-2xl text-sm leading-relaxed text-slate-200 sm:text-base">
          Mobile-first community missions with quest points, leaderboard loops, and Farcaster-friendly sharing.
        </p>
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
          <Link href="/quests" className="rounded-2xl bg-emerald-400 px-4 py-3 text-center font-semibold text-slate-950">
            Start Helping
          </Link>
          <Link href="/explore" className="rounded-2xl border border-yellow-300/60 bg-yellow-300/10 px-4 py-3 text-center font-semibold text-yellow-100">
            Explore Quests
          </Link>
          <Link href="/sponsor" className="rounded-2xl border border-white/30 bg-white/5 px-4 py-3 text-center font-semibold text-white">
            Become a Sponsor
          </Link>
        </div>
      </div>

      <HeroQuestExperience />

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {LANDING_SECTIONS.map((section) => (
          <Card key={section.title} className="rounded-2xl border border-white/10 bg-slate-900/50 p-4 backdrop-blur">
            <h2 className="text-lg font-semibold text-yellow-100">{section.title}</h2>
            <p className="mt-2 text-sm text-slate-200">{section.description}</p>
          </Card>
        ))}
      </div>
    </section>
  );
}
