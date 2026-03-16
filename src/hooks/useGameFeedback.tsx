import { useCallback, useEffect, useState } from "react";
import apiClient from "../apiClient/apiClient";
import type { GameComment, GameRatingSummary } from "../types/types";
import { getAccessToken } from "../utils/auth";

type RatingSummaryResponse = {
  game_key: string;
  average_rating: number;
  ratings_count: number;
  my_rating?: number | null;
};

type CommentsResponse = {
  items?: GameComment[];
  comments?: GameComment[];
};

const toSummaryPath = (gameKey: string) =>
  `/game-feedback/${encodeURIComponent(gameKey)}/summary`;
const toCommentsPath = (gameKey: string) =>
  `/game-feedback/${encodeURIComponent(gameKey)}/comments`;
const toMyFeedbackPath = (gameKey: string) =>
  `/game-feedback/${encodeURIComponent(gameKey)}/my`;

export async function fetchGameRatingSummary(
  gameKey: string,
): Promise<GameRatingSummary | null> {
  try {
    const { data } = await apiClient.get<RatingSummaryResponse>(toSummaryPath(gameKey));
    if (!data || typeof data.average_rating !== "number" || typeof data.ratings_count !== "number") {
      return null;
    }
    return {
      game_key: data.game_key || gameKey,
      average_rating: data.average_rating,
      ratings_count: data.ratings_count,
      my_rating: data.my_rating ?? null,
    };
  } catch {
    return null;
  }
}

export async function fetchGameComments(gameKey: string): Promise<GameComment[]> {
  try {
    const { data } = await apiClient.get<CommentsResponse>(toCommentsPath(gameKey));
    const items = data?.items ?? data?.comments ?? [];
    return Array.isArray(items) ? items : [];
  } catch {
    return [];
  }
}

export async function submitMyGameFeedback(
  gameKey: string,
  payload: { rating: number; comment: string },
): Promise<boolean> {
  if (!getAccessToken()) return false;
  try {
    await apiClient.put(toMyFeedbackPath(gameKey), payload);
    return true;
  } catch {
    return false;
  }
}

export default function useGameFeedback(gameKey: string) {
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [summary, setSummary] = useState<GameRatingSummary | null>(null);
  const [comments, setComments] = useState<GameComment[]>([]);

  const reload = useCallback(async () => {
    setLoading(true);
    const [summaryData, commentsData] = await Promise.all([
      fetchGameRatingSummary(gameKey),
      fetchGameComments(gameKey),
    ]);
    setSummary(summaryData);
    setComments(commentsData);
    setLoading(false);
    return { summary: summaryData, comments: commentsData };
  }, [gameKey]);

  const submitFeedback = useCallback(
    async (payload: { rating: number; comment: string }) => {
      setSubmitting(true);
      const ok = await submitMyGameFeedback(gameKey, payload);
      if (ok) {
        await reload();
      }
      setSubmitting(false);
      return ok;
    },
    [gameKey, reload],
  );

  useEffect(() => {
    void reload();
  }, [reload]);

  return {
    loading,
    submitting,
    summary,
    comments,
    reload,
    submitFeedback,
  };
}
