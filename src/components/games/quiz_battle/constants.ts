import type { QuestionDraft } from "./types";

export const SECONDS_PER_QUESTION = 18;
export const BASE_POINTS = 10;
export const STREAK_BONUS = 5;
export const QUIZ_BATTLE_GAME_KEY = "quiz_battle";

export const createEmptyDraft = (): QuestionDraft => ({
  question: "",
  options: ["", "", "", ""],
  answerIndex: 0,
  category: "Umumiy",
});
