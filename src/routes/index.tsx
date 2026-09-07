import { createFileRoute } from "@tanstack/react-router";
import { useCallback, useEffect, useState } from "react";
import { HomeScreen } from "@/components/rockabye/HomeScreen";
import { GameScreen } from "@/components/rockabye/GameScreen";
import { ResultsScreen, type RunStats } from "@/components/rockabye/ResultsScreen";
import { HowToPlayModal } from "@/components/rockabye/HowToPlayModal";
import { BEST_SCORE_KEY } from "@/lib/rps";

const TITLE = "ROCKABYE — Webcam Rock Paper Scissors";
const DESCRIPTION =
  "Can your hands beat the machine? Play Rock Paper Scissors with real hand gestures through your webcam in a cyberpunk arcade arena.";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: TITLE },
      { name: "description", content: DESCRIPTION },
      { property: "og:title", content: TITLE },
      { property: "og:description", content: DESCRIPTION },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: Rockabye,
});

type Screen = "home" | "game" | "results";

const EMPTY_STATS: RunStats = { score: 0, wins: 0, losses: 0, draws: 0, bestStreak: 0 };

function Rockabye() {
  const [screen, setScreen] = useState<Screen>("home");
  const [stats, setStats] = useState<RunStats>(EMPTY_STATS);
  const [bestScore, setBestScore] = useState(0);
  const [howTo, setHowTo] = useState(false);

  useEffect(() => {
    const stored = Number(window.localStorage.getItem(BEST_SCORE_KEY) ?? 0);
    if (!Number.isNaN(stored)) setBestScore(stored);
  }, []);

  const finishRun = useCallback((run: RunStats) => {
    setStats(run);
    setBestScore((prev) => {
      const next = Math.max(prev, run.score);
      window.localStorage.setItem(BEST_SCORE_KEY, String(next));
      return next;
    });
    setScreen("results");
  }, []);

  return (
    <main className="arcade-bg scanlines relative min-h-[100svh] overflow-hidden">
      {screen === "home" && (
        <HomeScreen bestScore={bestScore} onStart={() => setScreen("game")} onHowToPlay={() => setHowTo(true)} />
      )}
      {screen === "game" && <GameScreen onQuit={finishRun} />}
      {screen === "results" && (
        <ResultsScreen
          stats={stats}
          bestScore={bestScore}
          onPlayAgain={() => setScreen("game")}
          onHome={() => setScreen("home")}
        />
      )}
      <HowToPlayModal open={howTo} onClose={() => setHowTo(false)} />
    </main>
  );
}
