import { useCallback, useEffect, useRef, useState } from "react";
import { ArcadeButton } from "./ArcadeButton";
import { useHandTracking } from "@/hooks/useHandTracking";
import {
  judge,
  MOVE_EMOJI,
  MOVE_LABEL,
  pointsFor,
  randomMove,
  streakMilestone,
  type Move,
  type Outcome,
} from "@/lib/rps";
import type { RunStats } from "./ResultsScreen";

type Phase = "arming" | "ready" | "three" | "two" | "one" | "show" | "reveal";

const COUNTDOWN_TEXT: Partial<Record<Phase, string>> = {
  ready: "READY?",
  three: "3",
  two: "2",
  one: "1",
  show: "SHOW!",
};

const OUTCOME_TEXT: Record<Outcome, string> = {
  win: "YOU WIN",
  loss: "THE MACHINE WINS",
  draw: "STALEMATE",
};

export function GameScreen({ onQuit }: { onQuit: (stats: RunStats) => void }) {
  const { videoRef, status, errorMessage, handVisible, liveMove, getCurrentMove } = useHandTracking(true);

  const [round, setRound] = useState(1);
  const [phase, setPhase] = useState<Phase>("arming");
  const [score, setScore] = useState(0);
  const [streak, setStreak] = useState(0);
  const [bestStreak, setBestStreak] = useState(0);
  const [wins, setWins] = useState(0);
  const [losses, setLosses] = useState(0);
  const [draws, setDraws] = useState(0);
  const [playerMove, setPlayerMove] = useState<Move | null>(null);
  const [machineMove, setMachineMove] = useState<Move | null>(null);
  const [outcome, setOutcome] = useState<Outcome | null>(null);
  const [earned, setEarned] = useState(0);
  const [milestone, setMilestone] = useState<string | null>(null);

  const timers = useRef<ReturnType<typeof setTimeout>[]>([]);
  const clearTimers = () => {
    timers.current.forEach(clearTimeout);
    timers.current = [];
  };
  const later = (fn: () => void, ms: number) => {
    timers.current.push(setTimeout(fn, ms));
  };

  const resolveRound = useCallback(() => {
    const player = getCurrentMove();
    setPlayerMove(player);
    if (!player) {
      setMachineMove(null);
      setOutcome(null);
      setEarned(0);
      setPhase("reveal");
      return;
    }
    const machine = randomMove();
    const result = judge(player, machine);
    const points = pointsFor(result);
    setMachineMove(machine);
    setOutcome(result);
    setEarned(points);
    setScore((s) => s + points);
    setStreak((prev) => {
      const next = result === "win" ? prev + 1 : result === "loss" ? 0 : prev;
      setBestStreak((b) => Math.max(b, next));
      setMilestone(result === "win" ? streakMilestone(next) : null);
      return next;
    });
    if (result === "win") setWins((v) => v + 1);
    else if (result === "loss") setLosses((v) => v + 1);
    else setDraws((v) => v + 1);
    setPhase("reveal");
  }, [getCurrentMove]);

  // Countdown timeline, starts once the camera + tracking are live.
  useEffect(() => {
    if (phase !== "arming" || status !== "ready") return;
    setPhase("ready");
  }, [phase, status]);

  useEffect(() => {
    if (phase === "arming" || phase === "reveal") return;
    const next: Partial<Record<Phase, Phase>> = { ready: "three", three: "two", two: "one", one: "show" };
    if (phase === "show") {
      later(resolveRound, 1200);
    } else {
      const target = next[phase]!;
      later(() => setPhase(target), phase === "ready" ? 900 : 800);
    }
    return clearTimers;
  }, [phase, resolveRound]);

  useEffect(() => clearTimers, []);

  const nextRound = () => {
    clearTimers();
    setPlayerMove(null);
    setMachineMove(null);
    setOutcome(null);
    setEarned(0);
    setMilestone(null);
    if (playerMove) setRound((r) => r + 1);
    setPhase("ready");
  };

  const quit = () => {
    clearTimers();
    onQuit({ score, wins, losses, draws, bestStreak });
  };

  const counting = phase in COUNTDOWN_TEXT;
  const statusLine =
    status === "loading"
      ? "INITIALISING CAMERA"
      : status === "denied" || status === "error"
        ? "CAMERA OFFLINE"
        : phase === "show"
          ? "SHOW YOUR HAND"
          : handVisible
            ? "SIGNAL DETECTED"
            : "CAMERA READY";

  return (
    <section className="animate-fade-up mx-auto flex min-h-[100svh] w-full max-w-6xl flex-col px-4 py-6 sm:px-6">
      <header className="hud-panel flex flex-wrap items-center gap-x-6 gap-y-3 px-4 py-3">
        <div>
          <p className="hud-label">PLAYER 01</p>
          <p className="font-display text-lg tracking-[0.2em] text-glow-purple">ROCKABYE</p>
        </div>
        <dl className="ml-auto grid grid-cols-3 gap-4 text-right sm:gap-8">
          <div>
            <dt className="hud-label">SCORE</dt>
            <dd key={score} className="font-display animate-pop text-xl text-accent">
              {String(score).padStart(4, "0")}
            </dd>
          </div>
          <div>
            <dt className="hud-label">STREAK</dt>
            <dd key={streak} className="font-display animate-pop text-xl">
              {streak}
            </dd>
          </div>
          <div>
            <dt className="hud-label">ROUND</dt>
            <dd className="font-display text-xl">{String(round).padStart(2, "0")}</dd>
          </div>
        </dl>
      </header>

      <div className="mt-5 grid grid-cols-1 items-center gap-4 md:grid-cols-[1fr_auto_1fr]">
        {/* Player */}
        <div className="hud-panel scanlines relative overflow-hidden">
          <div className="flex items-center justify-between px-4 py-2">
            <span className="hud-label text-accent">YOU</span>
            <span className="hud-label">{statusLine}</span>
          </div>
          <div className="relative aspect-4/3 w-full bg-black/60">
            <video
              ref={videoRef}
              playsInline
              muted
              autoPlay
              aria-label="Your camera feed"
              className="h-full w-full -scale-x-100 object-cover"
            />
            {(status === "denied" || status === "error") && (
              <div className="absolute inset-0 flex flex-col items-center justify-center gap-3 bg-background/90 px-6 text-center">
                <p className="font-display text-sm tracking-[0.2em] text-destructive">CAMERA OFFLINE</p>
                <p className="text-sm text-muted-foreground">{errorMessage}</p>
              </div>
            )}
            {status === "loading" && (
              <div className="absolute inset-0 flex items-center justify-center bg-background/80">
                <p className="font-display animate-pulse text-xs tracking-[0.3em] text-accent">LOADING VISION MODEL</p>
              </div>
            )}
            {status === "ready" && !handVisible && phase !== "reveal" && (
              <p className="font-display absolute inset-x-0 bottom-3 text-center text-[0.65rem] tracking-[0.25em] text-muted-foreground">
                NO HAND DETECTED — HOLD YOUR HAND UP
              </p>
            )}
            {status === "ready" && liveMove && phase !== "reveal" && (
              <div className="animate-pop absolute top-3 left-3 border border-accent/60 bg-background/70 px-3 py-1">
                <span className="font-display text-[0.65rem] tracking-[0.25em] text-accent">
                  {MOVE_EMOJI[liveMove]} {MOVE_LABEL[liveMove]}
                </span>
              </div>
            )}
          </div>
          {phase === "reveal" && playerMove && (
            <p className="animate-pop py-4 text-center text-5xl" aria-label={`You played ${MOVE_LABEL[playerMove]}`}>
              {MOVE_EMOJI[playerMove]}
            </p>
          )}
        </div>

        {/* VS / countdown */}
        <div className="flex flex-col items-center justify-center gap-4 px-2 py-4">
          <span className="font-display text-2xl tracking-[0.3em] text-muted-foreground">VS</span>
          {counting && (
            <p
              key={phase}
              className="font-display animate-count text-5xl tracking-[0.1em] text-glow-magenta sm:text-6xl"
              aria-live="polite"
            >
              {COUNTDOWN_TEXT[phase]}
            </p>
          )}
        </div>

        {/* Machine */}
        <div className="hud-panel scanlines relative overflow-hidden">
          <div className="flex items-center justify-between px-4 py-2">
            <span className="hud-label text-primary">THE MACHINE</span>
            <span className="hud-label">{phase === "reveal" ? "MOVE LOCKED" : "AI PROCESSING"}</span>
          </div>
          <div className="flex aspect-4/3 w-full items-center justify-center bg-black/40">
            {phase === "reveal" && machineMove ? (
              <span
                className="animate-pop text-7xl sm:text-8xl"
                aria-label={`The machine played ${MOVE_LABEL[machineMove]}`}
              >
                {MOVE_EMOJI[machineMove]}
              </span>
            ) : (
              <span className="font-display animate-pulse text-4xl text-primary/40 sm:text-6xl">?</span>
            )}
          </div>
        </div>
      </div>

      {/* Result bar */}
      <div className="mt-5" aria-live="polite">
        {phase === "reveal" && (
          <div className="hud-panel animate-fade-up flex flex-col items-center gap-3 px-4 py-6 text-center">
            {playerMove && outcome ? (
              <>
                <p className="hud-label">
                  YOU {MOVE_LABEL[playerMove]} · THE MACHINE {machineMove ? MOVE_LABEL[machineMove] : "—"}
                </p>
                <p
                  className={`font-display text-3xl tracking-[0.16em] sm:text-4xl ${
                    outcome === "win"
                      ? "text-accent text-glow-cyan"
                      : outcome === "loss"
                        ? "text-destructive"
                        : "text-foreground"
                  }`}
                >
                  {OUTCOME_TEXT[outcome]}
                </p>
                <p className="text-sm text-muted-foreground">+{earned} POINTS</p>
                {milestone && (
                  <p className="font-display animate-pulse-glow border border-neon-magenta/60 px-5 py-2 text-sm tracking-[0.3em] text-glow-magenta">
                    {milestone}
                  </p>
                )}
              </>
            ) : (
              <>
                <p className="font-display text-2xl tracking-[0.16em] text-muted-foreground">NO SIGNAL</p>
                <p className="text-sm text-muted-foreground">
                  The machine could not read your hand. Try again with your palm facing the camera.
                </p>
              </>
            )}
            <div className="mt-2 flex flex-col gap-3 sm:flex-row">
              <ArcadeButton onClick={nextRound}>{playerMove ? "NEXT ROUND" : "RETRY ROUND"}</ArcadeButton>
              <ArcadeButton variant="ghost" onClick={quit}>
                QUIT
              </ArcadeButton>
            </div>
          </div>
        )}
        {phase !== "reveal" && (
          <div className="flex justify-center">
            <ArcadeButton variant="ghost" size="sm" onClick={quit}>
              QUIT RUN
            </ArcadeButton>
          </div>
        )}
      </div>
    </section>
  );
}
