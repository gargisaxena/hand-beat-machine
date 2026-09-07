export type Move = "rock" | "paper" | "scissors";
export type Outcome = "win" | "loss" | "draw";

export const MOVE_EMOJI: Record<Move, string> = {
  rock: "✊",
  paper: "✋",
  scissors: "✌️",
};

export const MOVE_LABEL: Record<Move, string> = {
  rock: "ROCK",
  paper: "PAPER",
  scissors: "SCISSORS",
};

export const MOVES: Move[] = ["rock", "paper", "scissors"];

export function randomMove(): Move {
  return MOVES[Math.floor(Math.random() * MOVES.length)]!;
}

export function judge(player: Move, machine: Move): Outcome {
  if (player === machine) return "draw";
  if (
    (player === "rock" && machine === "scissors") ||
    (player === "scissors" && machine === "paper") ||
    (player === "paper" && machine === "rock")
  )
    return "win";
  return "loss";
}

export function pointsFor(outcome: Outcome): number {
  return outcome === "win" ? 10 : outcome === "draw" ? 3 : 0;
}

export function nextStreak(current: number, outcome: Outcome): number {
  if (outcome === "win") return current + 1;
  if (outcome === "loss") return 0;
  return current;
}

export function streakMilestone(streak: number): string | null {
  if (streak >= 5) return "ON FIRE";
  if (streak >= 3) return "ON A ROLL";
  return null;
}

export const BEST_SCORE_KEY = "rockabye:best-score";
