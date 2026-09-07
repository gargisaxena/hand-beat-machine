import type { Move } from "./rps";

type Landmark = { x: number; y: number; z: number };

const TIPS = { thumb: 4, index: 8, middle: 12, ring: 16, pinky: 20 };
const PIPS = { thumb: 2, index: 6, middle: 10, ring: 14, pinky: 18 };

function dist(a: Landmark, b: Landmark) {
  return Math.hypot(a.x - b.x, a.y - b.y);
}

/**
 * Classify a 21-point hand landmark set into a Rock/Paper/Scissors move.
 * Uses distance-from-wrist ratios so it works at any hand rotation.
 */
export function classifyGesture(lm: Landmark[]): Move | null {
  if (!lm || lm.length < 21) return null;
  const wrist = lm[0]!;
  const scale = dist(wrist, lm[9]!) || 1; // wrist -> middle MCP

  const extended = (tip: number, pip: number) =>
    dist(wrist, lm[tip]!) / scale > dist(wrist, lm[pip]!) / scale + 0.28;

  const index = extended(TIPS.index, PIPS.index);
  const middle = extended(TIPS.middle, PIPS.middle);
  const ring = extended(TIPS.ring, PIPS.ring);
  const pinky = extended(TIPS.pinky, PIPS.pinky);
  const thumb = dist(lm[TIPS.thumb]!, lm[PIPS.pinky]!) / scale > 0.9;

  const fingers = [index, middle, ring, pinky].filter(Boolean).length;

  if (fingers === 0) return "rock";
  if (index && middle && !ring && !pinky) return "scissors";
  if (fingers >= 4 || (fingers === 3 && thumb)) return "paper";
  if (fingers === 1) return null;
  return null;
}

/** Rolling stabilizer: only reports a move seen consistently. */
export class GestureStabilizer {
  private buffer: (Move | null)[] = [];
  constructor(
    private size = 8,
    private threshold = 5,
  ) {}

  push(move: Move | null): Move | null {
    this.buffer.push(move);
    if (this.buffer.length > this.size) this.buffer.shift();
    const counts = new Map<Move, number>();
    for (const m of this.buffer) if (m) counts.set(m, (counts.get(m) ?? 0) + 1);
    let best: Move | null = null;
    let bestCount = 0;
    for (const [m, c] of counts)
      if (c > bestCount) {
        best = m;
        bestCount = c;
      }
    return bestCount >= this.threshold ? best : null;
  }

  reset() {
    this.buffer = [];
  }
}
