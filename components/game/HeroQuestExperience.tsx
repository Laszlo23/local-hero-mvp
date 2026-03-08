"use client";

import { Badge, Button, Card, Dialog, List, ProgressBar } from "@once-ui-system/core";
import Image from "next/image";
import { useMemo, useState } from "react";
import { dailyChallenges, getLevelFromScore, type ChallengeOption, type DailyChallenge } from "@/lib/game";

type Stage = "WELCOME" | "QUESTION" | "RESULT" | "LEADERBOARD";

const leaderboardPreview = [
  { rank: 1, username: "MilaHelper", points: 1240 },
  { rank: 2, username: "GreenRunner", points: 1110 },
  { rank: 3, username: "CityBuilder", points: 980 },
];

function stageTitle(stage: Stage): string {
  switch (stage) {
    case "WELCOME":
      return "Welcome Hero";
    case "QUESTION":
      return "Daily Challenge";
    case "RESULT":
      return "Your Result";
    case "LEADERBOARD":
      return "Leaderboard Preview";
    default: {
      const exhaustiveCheck: never = stage;
      return exhaustiveCheck;
    }
  }
}

function findChallengeById(challengeId: string): DailyChallenge {
  const challenge = dailyChallenges.find((item) => item.id === challengeId);
  return challenge ?? dailyChallenges[0];
}

export function HeroQuestExperience() {
  const [stage, setStage] = useState<Stage>("WELCOME");
  const [challengeId] = useState(dailyChallenges[0].id);
  const [selectedOption, setSelectedOption] = useState<ChallengeOption | null>(null);
  const [showShare, setShowShare] = useState(false);

  const challenge = useMemo(() => findChallengeById(challengeId), [challengeId]);
  const currentPoints = selectedOption?.points ?? 0;
  const heroScore = 640 + currentPoints;
  const progress = Math.min(100, Math.round((heroScore / 1400) * 100));
  const level = getLevelFromScore(heroScore);

  return (
    <Card className="relative overflow-hidden rounded-3xl border border-white/15 bg-slate-950/75 p-5 shadow-xl shadow-emerald-500/10 sm:p-6">
      <div className="pointer-events-none absolute -right-16 -top-16 h-52 w-52 rounded-full bg-emerald-400/20 blur-3xl" />
      <div className="pointer-events-none absolute -left-12 bottom-0 h-40 w-40 rounded-full bg-yellow-300/20 blur-3xl" />

      <div className="relative space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Image src="/local-hero-logo.png" alt="Local Hero logo" width={52} height={52} className="h-12 w-12 rounded-xl" />
            <div>
              <p className="text-xs uppercase tracking-widest text-emerald-200/80">Hero Quest</p>
              <h2 className="text-xl font-bold text-white">{stageTitle(stage)}</h2>
            </div>
          </div>
          <Badge>{level}</Badge>
        </div>

        <ProgressBar value={progress} max={100} />

        {stage === "WELCOME" && (
          <div className="space-y-4">
            <p className="text-sm leading-relaxed text-slate-200">
              Complete one local mission each day, earn HERO points, and share your impact on Farcaster.
            </p>
            <div className="grid grid-cols-3 gap-2 text-xs text-slate-200">
              <Card className="rounded-xl bg-emerald-500/20 p-3 text-center">🦸 Hero</Card>
              <Card className="rounded-xl bg-yellow-400/20 p-3 text-center">🏙️ City</Card>
              <Card className="rounded-xl bg-green-300/20 p-3 text-center">🤝 Community</Card>
            </div>
            <Button variant="primary" size="l" fillWidth onClick={() => setStage("QUESTION")}>
              Start Daily Challenge
            </Button>
          </div>
        )}

        {stage === "QUESTION" && (
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <Badge>{challenge.category}</Badge>
              <p className="text-xs text-slate-300">Touch-friendly action selection</p>
            </div>
            <p className="text-base font-semibold leading-6 text-white">{challenge.prompt}</p>
            <List className="gap-3">
              {challenge.options.map((option) => (
                <Button
                  key={option.id}
                  fillWidth
                  size="l"
                  variant="secondary"
                  className="min-h-14 justify-between rounded-2xl border border-white/10 bg-white/5 p-4 text-left transition duration-200 active:scale-[0.98]"
                  onClick={() => setSelectedOption(option)}
                >
                  <span>{option.label}</span>
                </Button>
              ))}
            </List>
            <Button
              variant="primary"
              size="l"
              fillWidth
              disabled={!selectedOption}
              onClick={() => setStage("RESULT")}
            >
              Confirm Choice
            </Button>
          </div>
        )}

        {stage === "RESULT" && selectedOption && (
          <div className="space-y-4">
            <Card className="rounded-2xl border border-yellow-300/30 bg-yellow-300/10 p-4">
              <p className="text-xs uppercase tracking-widest text-yellow-100">Points Earned</p>
              <p className="mt-1 text-3xl font-bold text-yellow-200">+{selectedOption.points}</p>
              <p className="text-sm text-yellow-50/90">{selectedOption.impactTag}</p>
            </Card>

            <div className="space-y-2 text-sm text-slate-200">
              <p>Selected action: {selectedOption.label}</p>
              <p>Current Hero score: {heroScore}</p>
              <p>Level status: {level}</p>
            </div>

            <div className="flex gap-3">
              <Button variant="secondary" fillWidth size="l" onClick={() => setStage("LEADERBOARD")}>
                See Leaderboard
              </Button>
              <Button variant="primary" fillWidth size="l" onClick={() => setShowShare(true)}>
                Share
              </Button>
            </div>
          </div>
        )}

        {stage === "LEADERBOARD" && (
          <div className="space-y-3">
            {leaderboardPreview.map((entry) => (
              <Card
                key={entry.rank}
                className="flex items-center justify-between rounded-2xl border border-white/10 bg-white/5 p-3"
              >
                <div>
                  <p className="text-xs text-slate-300">#{entry.rank}</p>
                  <p className="font-semibold text-white">{entry.username}</p>
                </div>
                <Badge>{entry.points} pts</Badge>
              </Card>
            ))}
            <div className="flex gap-3">
              <Button variant="secondary" fillWidth size="l" onClick={() => setStage("QUESTION")}>
                Play Again
              </Button>
              <Button variant="primary" fillWidth size="l" href="/leaderboard">
                Full Board
              </Button>
            </div>
          </div>
        )}
      </div>

      <Dialog
        isOpen={showShare}
        onClose={() => setShowShare(false)}
        title="Share your Hero moment"
        description="Frame-friendly social loop for Farcaster sharing."
        footer={
          <div className="flex w-full gap-2">
            <Button fillWidth variant="secondary" onClick={() => setShowShare(false)}>
              Close
            </Button>
            <Button fillWidth variant="primary" href="https://warpcast.com/~/compose">
              Share on Farcaster
            </Button>
          </div>
        }
      >
        <Card className="rounded-2xl border border-emerald-400/40 bg-emerald-400/10 p-4">
          <p className="text-sm text-white">
            I just earned <strong>+{currentPoints} HERO</strong> in Local Hero by helping my city today.
          </p>
          <p className="mt-2 text-xs text-emerald-100/90">
            Local Hero • Challenge: {challenge.category} • Level: {level}
          </p>
        </Card>
      </Dialog>
    </Card>
  );
}
