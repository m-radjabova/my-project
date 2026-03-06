import apiClient from "./apiClient";
import { getAccessToken } from "../utils/auth";

type QuestionPayload<T> = {
  game_key?: string;
  questions?: T[];
  data?: T[];
};

const toPath = (gameKey: string) => `/game-questions/${encodeURIComponent(gameKey)}`;

function extractQuestions<T>(payload: unknown): T[] | null {
  if (Array.isArray(payload)) return payload as T[];
  if (!payload || typeof payload !== "object") return null;
  const body = payload as QuestionPayload<T>;
  if (Array.isArray(body.questions)) return body.questions;
  if (Array.isArray(body.data)) return body.data;
  return null;
}

export async function fetchGameQuestions<T>(gameKey: string): Promise<T[] | null> {
  if (!getAccessToken()) return null;
  try {
    const { data } = await apiClient.get<QuestionPayload<T> | T[]>(toPath(gameKey));
    return extractQuestions<T>(data);
  } catch {
    return null;
  }
}

export async function fetchGameQuestionsByTeacher<T>(
  gameKey: string,
  teacherId: string,
): Promise<T[] | null> {
  if (!getAccessToken()) return null;
  try {
    const { data } = await apiClient.get<QuestionPayload<T> | T[]>(toPath(gameKey), {
      params: { teacher_id: teacherId },
    });
    return extractQuestions<T>(data);
  } catch {
    return null;
  }
}

export async function saveGameQuestions<T>(
  gameKey: string,
  questions: T[],
  _teacherId?: string,
): Promise<boolean> {
  if (!getAccessToken()) return false;
  const payload = { questions };

  try {
    await apiClient.put<QuestionPayload<T>>(toPath(gameKey), payload);
    return true;
  } catch {
    return false;
  }
}
