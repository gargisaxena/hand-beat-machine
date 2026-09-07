import { useEffect, useRef } from "react";
import { ArcadeButton } from "./ArcadeButton";

const RULES = [
  { emoji: "✊", label: "ROCK", note: "Closed fist" },
  { emoji: "✋", label: "PAPER", note: "Open palm" },
  { emoji: "✌️", label: "SCISSORS", note: "Two extended fingers" },
];

export function HowToPlayModal({ open, onClose }: { open: boolean; onClose: () => void }) {
  const closeRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    if (!open) return;
    closeRef.current?.focus();
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open, onClose]);

  if (!open) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-background/85 p-4 backdrop-blur-sm"
      role="dialog"
      aria-modal="true"
      aria-label="How to play Rockabye"
      onClick={onClose}
    >
      <div
        className="hud-panel scanlines animate-pop w-full max-w-lg overflow-hidden p-6 sm:p-8"
        onClick={(e) => e.stopPropagation()}
      >
        <p className="hud-label">SYSTEM BRIEFING</p>
        <h2 className="font-display mt-1 text-2xl tracking-[0.18em] text-glow-purple">HOW TO PLAY</h2>

        <ul className="mt-6 space-y-3">
          {RULES.map((r) => (
            <li key={r.label} className="flex items-center gap-4 border border-border/70 bg-card/40 px-4 py-3">
              <span className="text-3xl" aria-hidden="true">
                {r.emoji}
              </span>
              <span className="font-display text-sm tracking-[0.2em] text-accent">{r.label}</span>
              <span className="ml-auto text-sm text-muted-foreground">{r.note}</span>
            </li>
          ))}
        </ul>

        <div className="mt-6 space-y-1 text-sm text-muted-foreground">
          <p>Rock beats Scissors.</p>
          <p>Scissors beats Paper.</p>
          <p>Paper beats Rock.</p>
        </div>

        <p className="mt-4 text-sm text-foreground/80">
          Hold your hand clearly in front of the camera during <span className="text-accent">SHOW!</span> — good light
          and a plain background help the machine read you.
        </p>

        <div className="mt-6 flex justify-end">
          <button
            ref={closeRef}
            onClick={onClose}
            className="font-display border border-accent/60 bg-accent/10 px-6 py-3 text-xs tracking-[0.22em] text-accent uppercase transition-colors hover:bg-accent/20"
          >
            CLOSE
          </button>
        </div>

      </div>
    </div>
  );
}
