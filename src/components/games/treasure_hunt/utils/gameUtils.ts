import type { Riddle } from "../types";

export function clamp(n: number, min: number, max: number) {
  return Math.max(min, Math.min(max, n));
}

export function rand(min: number, max: number) {
  return Math.random() * (max - min) + min;
}

export function formatTime(totalSeconds: number) {
  const s = Math.max(0, totalSeconds);
  const mm = Math.floor(s / 60);
  const ss = s % 60;
  return `${String(mm).padStart(2, "0")}:${String(ss).padStart(2, "0")}`;
}

function shuffleArray<T>(arr: T[]): T[] {
  const copy = [...arr];
  for (let i = copy.length - 1; i > 0; i -= 1) {
    const j = Math.floor(Math.random() * (i + 1));
    [copy[i], copy[j]] = [copy[j], copy[i]];
  }
  return copy;
}

export function randomizeRiddlesForRun(riddles: Riddle[]): Riddle[] {
  return riddles.map((riddle) => {
    const tagged = riddle.options.map((option, index) => ({ option, index }));
    const shuffled = shuffleArray(tagged);
    const options = shuffled.map((item) => item.option) as [string, string, string, string];
    const answerIndex = shuffled.findIndex((item) => item.index === riddle.answerIndex);

    return {
      ...riddle,
      options,
      answerIndex,
    };
  });
}
