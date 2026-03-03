import type { Difficulty, PlayerId, PlayerStats } from "./types";

export const shuffleArray = <T,>(arr: T[]) => {
  const next = [...arr];
  for (let i = next.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [next[i], next[j]] = [next[j], next[i]];
  }
  return next;
};

export const clamp = (n: number, a: number, b: number) => Math.max(a, Math.min(b, n));

export const createDefaultStats = (): Record<PlayerId, PlayerStats> => ({
  0: {
    streak: 0,
    bestStreak: 0,
    correct: 0,
    wrong: 0,
    used5050: false,
    usedTime: false,
    shieldCharges: 1,
    shieldArmed: false,
    reducedOptions: null,
  },
  1: {
    streak: 0,
    bestStreak: 0,
    correct: 0,
    wrong: 0,
    used5050: false,
    usedTime: false,
    shieldCharges: 1,
    shieldArmed: false,
    reducedOptions: null,
  },
});

export const wrongPenalty = (difficulty: Difficulty) => {
  if (difficulty === "easy") return 0;
  if (difficulty === "medium") return 2;
  return 4;
};

export const nitroBonusFromStreak = (streakAfter: number) => {
  if (streakAfter >= 3) return 5;
  if (streakAfter >= 2) return 3;
  return 0;
};
