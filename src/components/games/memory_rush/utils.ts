import { PAIRS_POOL } from "./constants";
import type { CardItem } from "./types";

export function shuffle<T>(arr: T[]) {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

export function formatTime(total: number) {
  const s = Math.max(0, total);
  const mm = Math.floor(s / 60);
  const ss = s % 60;
  return `${String(mm).padStart(2, "0")}:${String(ss).padStart(2, "0")}`;
}

export function buildDeck(totalCards: number) {
  const pairsNeeded = Math.floor(totalCards / 2);
  const selectedPairs = shuffle(PAIRS_POOL).slice(0, pairsNeeded);

  const cards: CardItem[] = [];
  selectedPairs.forEach((p) => {
    cards.push({
      id: `${p.pairId}-a-${Math.random().toString(16).slice(2)}`,
      pairId: p.pairId,
      label: p.a,
    });
    cards.push({
      id: `${p.pairId}-b-${Math.random().toString(16).slice(2)}`,
      pairId: p.pairId,
      label: p.b,
    });
  });

  return shuffle(cards);
}
