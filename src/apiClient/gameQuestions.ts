import apiClient from "./apiClient";
import { getAccessToken } from "../utils/auth";

type QuestionPayload<T> = {
  game_key: string;
  questions: T[];
};

const toPath = (gameKey: string) => `/game-questions/${encodeURIComponent(gameKey)}`;

export async function fetchGameQuestions<T>(gameKey: string): Promise<T[] | null> {
  if (!getAccessToken()) return null;
  try {
    const { data } = await apiClient.get<QuestionPayload<T>>(toPath(gameKey));
    if (!data || !Array.isArray(data.questions)) return null;
    return data.questions;
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
    const { data } = await apiClient.get<QuestionPayload<T>>(toPath(gameKey), {
      params: { teacher_id: teacherId },
    });
    if (!data || !Array.isArray(data.questions)) return null;
    return data.questions;
  } catch {
    return null;
  }
}

export async function saveGameQuestions<T>(gameKey: string, questions: T[]): Promise<boolean> {
  if (!getAccessToken()) return false;
  try {
    await apiClient.put<QuestionPayload<T>>(toPath(gameKey), { questions });
    return true;
  } catch {
    return false;
  }
}
