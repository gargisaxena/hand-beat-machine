import { ArcadeButton } from "./ArcadeButton";

export type RunStats = {
  score: number;
  wins: number;
  losses: number;
  draws: number;
  bestStreak: number;
};

export function ResultsScreen({
  stats,
  bestScore,
  onPlayAgain,
  onHome,
}: {
  stats: RunStats;
  bestScore: number;
  onPlayAgain: () => void;
  onHome: () => void;
}) {
  const rounds = stats.wins + stats.losses + stats.draws;
  const newRecord = stats.score > 0 && stats.score >= bestScore;

  return (
    <section className="animate-fade-up flex min-h-[100svh] flex-col items-center justify-center px-5 py-14">
      <p className="hud-label text-accent">RUN COMPLETE</p>
      <h1 className="font-display animate-glitch mt-3 text-4xl tracking-[0.2em] text-glow-magenta sm:text-6xl">
        GAME OVER
      </h1>

      <div className="hud-panel scanlines mt-8 w-full max-w-lg overflow-hidden p-6 sm:p-8">
        <p className="hud-label">FINAL SCORE</p>
        <p className="font-display text-6xl tracking-[0.1em] text-glow-purple sm:text-7xl">
          {String(stats.score).padStart(4, "0")}
        </p>
        {newRecord && <p className="font-display mt-2 text-xs tracking-[0.3em] text-accent">NEW BEST SCORE</p>}

        <dl className="mt-8 grid grid-cols-3 gap-3 text-center">
          {[
            { label: "WINS", value: stats.wins },
            { label: "LOSSES", value: stats.losses },
            { label: "DRAWS", value: stats.draws },
          ].map((item) => (
            <div key={item.label} className="border border-border/70 bg-card/40 px-2 py-4">
              <dt className="hud-label">{item.label}</dt>
              <dd className="font-display mt-1 text-2xl">{item.value}</dd>
            </div>
          ))}
        </dl>

        <div className="mt-4 flex items-center justify-between border border-border/70 bg-card/40 px-4 py-4">
          <span className="hud-label">BEST STREAK</span>
          <span className="font-display text-2xl text-accent text-glow-cyan">{stats.bestStreak}</span>
        </div>

        <p className="mt-4 text-sm text-muted-foreground">
          {rounds} round{rounds === 1 ? "" : "s"} played this run.
        </p>
      </div>

      <div className="mt-8 flex w-full max-w-lg flex-col gap-3 sm:flex-row">
        <ArcadeButton className="flex-1" size="lg" onClick={onPlayAgain}>
          PLAY AGAIN
        </ArcadeButton>
        <ArcadeButton className="flex-1" size="lg" variant="ghost" onClick={onHome}>
          HOME
        </ArcadeButton>
      </div>
    </section>
  );
}
