import { useCallback, useEffect, useMemo, useState } from "react";
import apiClient from "../apiClient/apiClient";
import type {
  GameLeaderboardEntry,
  SubmitGameResultPayload,
} from "../types/types";

type LeaderboardResponse = {
  items?: GameLeaderboardEntry[];
  results?: GameLeaderboardEntry[];
};

const LOCAL_KEY_PREFIX = "game-leaderboard:";

const toLeaderboardPath = (gameKey: string) =>
  `/game-results/${encodeURIComponent(gameKey)}/leaderboard`;
const toSubmitPath = (gameKey: string) =>
  `/game-results/${encodeURIComponent(gameKey)}`;

function getLocalKey(gameKey: string) {
  return `${LOCAL_KEY_PREFIX}${gameKey}`;
}

function readLocalEntries(gameKey: string): GameLeaderboardEntry[] {
  if (typeof window === "undefined") {
    return [];
  }

  const raw = window.localStorage.getItem(getLocalKey(gameKey));
  if (!raw) {
    return [];
  }

  try {
    const parsed = JSON.parse(raw) as GameLeaderboardEntry[];
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

function saveLocalEntries(gameKey: string, entries: GameLeaderboardEntry[]) {
  if (typeof window === "undefined") {
    return;
  }

  window.localStorage.setItem(getLocalKey(gameKey), JSON.stringify(entries));
}

function normalizeKeyPart(value: string | undefined) {
  return (value ?? "").trim().toLowerCase();
}

function getBestEntries(entries: GameLeaderboardEntry[]) {
  const bestByParticipant = new Map<string, GameLeaderboardEntry>();

  for (const entry of entries) {
    const participantKey = [
      normalizeKeyPart(entry.participant_name),
      normalizeKeyPart(entry.participant_mode),
    ].join("::");
    const current = bestByParticipant.get(participantKey);

    if (!current || entry.score > current.score) {
      bestByParticipant.set(participantKey, entry);
      continue;
    }

    if (
      entry.score === current.score &&
      new Date(entry.created_at ?? 0).getTime() > new Date(current.created_at ?? 0).getTime()
    ) {
      bestByParticipant.set(participantKey, entry);
    }
  }

  return Array.from(bestByParticipant.values()).sort((left, right) => right.score - left.score);
}

export async function fetchGameLeaderboard(
  gameKey: string,
  limit = 10,
): Promise<GameLeaderboardEntry[]> {
  try {
    const { data } = await apiClient.get<LeaderboardResponse>(
      toLeaderboardPath(gameKey),
      { params: { limit } },
    );
    const items = data?.items ?? data?.results ?? [];
    if (Array.isArray(items) && items.length > 0) {
      return items.slice(0, limit);
    }
  } catch {
    // fall back to local cache
  }

  return readLocalEntries(gameKey)
    .sort((left, right) => right.score - left.score)
    .slice(0, limit);
}

export async function submitGameResult(
  gameKey: string,
  payload: SubmitGameResultPayload,
): Promise<boolean> {
  try {
    await apiClient.post(toSubmitPath(gameKey), payload);
    return true;
  } catch {
    const nextEntry: GameLeaderboardEntry = {
      id: `${gameKey}-${Date.now()}`,
      game_key: gameKey,
      participant_name: payload.participant_name,
      participant_mode: payload.participant_mode,
      score: payload.score,
      metadata: payload.metadata ?? null,
      created_at: new Date().toISOString(),
    };

    const localEntries = readLocalEntries(gameKey);
    saveLocalEntries(gameKey, [...localEntries, nextEntry]);
    return true;
  }
}

export default function useGameLeaderboard(gameKey: string, limit = 100) {
  const [entries, setEntries] = useState<GameLeaderboardEntry[]>([]);
  const [loading, setLoading] = useState(true);

  const reload = useCallback(async () => {
    setLoading(true);
    const data = await fetchGameLeaderboard(gameKey, limit);
    const nextEntries = getBestEntries(
      data.filter((entry) => !entry.game_key || entry.game_key === gameKey),
    );
    setEntries(nextEntries);
    setLoading(false);
    return nextEntries;
  }, [gameKey, limit]);

  useEffect(() => {
    void reload();
  }, [reload]);

  const topThree = useMemo(() => entries.slice(0, 3), [entries]);

  return {
    entries,
    topThree,
    loading,
    reload,
  };
}
