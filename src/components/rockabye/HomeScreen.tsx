import { ArcadeButton } from "./ArcadeButton";

export function HomeScreen({
  bestScore,
  onStart,
  onHowToPlay,
}: {
  bestScore: number;
  onStart: () => void;
  onHowToPlay: () => void;
}) {
  return (
    <section className="animate-fade-up flex min-h-[100svh] flex-col items-center justify-center px-5 py-14 text-center">
      <p className="hud-label text-accent">SYSTEM ONLINE</p>

      <h1 className="font-display animate-glitch mt-4 text-5xl font-black tracking-[0.18em] text-glow-purple sm:text-7xl lg:text-8xl">
        ROCKABYE
      </h1>

      <p className="mt-4 max-w-md text-base text-muted-foreground sm:text-lg">Can your hands beat the machine?</p>

      <div className="mt-8 flex items-center gap-6 text-4xl sm:text-5xl" aria-hidden="true">
        <span className="animate-pop">✊</span>
        <span className="animate-pop [animation-delay:120ms]">✋</span>
        <span className="animate-pop [animation-delay:240ms]">✌️</span>
      </div>

      <div className="mt-10 flex w-full max-w-xs flex-col items-stretch gap-3">
        <ArcadeButton size="lg" onClick={onStart}>
          START GAME
        </ArcadeButton>
        <ArcadeButton variant="ghost" onClick={onHowToPlay}>
          HOW TO PLAY
        </ArcadeButton>
      </div>

      <div className="hud-panel mt-10 px-8 py-4">
        <p className="hud-label">BEST SCORE</p>
        <p className="font-display mt-1 text-3xl tracking-[0.14em] text-accent text-glow-cyan">
          {String(bestScore).padStart(4, "0")}
        </p>
      </div>

      <p className="hud-label mt-10 opacity-70">PLAYER 01 · CAMERA REQUIRED</p>
    </section>
  );
}
