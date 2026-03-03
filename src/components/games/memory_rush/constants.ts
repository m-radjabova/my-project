import type { Difficulty } from "./types";

export const PREVIEW_SECONDS = 3;
export const TURN_TIME_LIMIT_SECONDS = 0;
export const GAME_TIME_LIMIT_SECONDS = 8 * 60;

export const DIFFICULTY_SIZES: Record<Difficulty, number> = {
  easy: 12,
  normal: 16,
  hard: 20,
};

export const DIFFICULTY_GAME_TIME_SECONDS: Record<Difficulty, number> = {
  easy: 160,
  normal: 200,
  hard: 240,
};

export const PAIRS_POOL: Array<{ pairId: string; a: string; b: string }> = [
  { pairId: "p1", a: "🍎", b: "🍎" },
  { pairId: "p2", a: "🐱", b: "🐱" },
  { pairId: "p3", a: "🚗", b: "🚗" },
  { pairId: "p4", a: "🏀", b: "🏀" },
  { pairId: "p5", a: "📘", b: "📘" },
  { pairId: "p6", a: "🎵", b: "🎵" },
  { pairId: "p7", a: "🌞", b: "🌞" },
  { pairId: "p8", a: "🧩", b: "🧩" },
  { pairId: "p9", a: "🧪", b: "🧪" },
  { pairId: "p10", a: "🗺️", b: "🗺️" },
  { pairId: "p11", a: "🌳", b: "🌳" },
  { pairId: "p12", a: "🏫", b: "🏫" },
  { pairId: "p13", a: "⏳", b: "⏳" },
  { pairId: "p14", a: "💡", b: "💡" },
  { pairId: "p15", a: "🏹", b: "🏹" },
  { pairId: "p16", a: "🦋", b: "🦋" },
];
