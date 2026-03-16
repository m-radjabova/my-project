import type { MathQuestion } from "./types";

export const RACE_TRACK_LENGTH = 100;
export const BASE_MOVE_AMOUNT = 10;
export const TIME_BONUS_MULTIPLIER = 0.3;
export const ROUND_TIME = 15;
export const MATH_RACE_GAME_KEY = "math_race";
export const MATH_RACE_RESULT_KEY = "math-race";

export const DEFAULT_QUESTIONS: MathQuestion[] = [
  { id: "1", question: "5 + 3 = ?", answer: 8, difficulty: "easy", points: 10 },
  { id: "2", question: "12 - 7 = ?", answer: 5, difficulty: "easy", points: 10 },
  { id: "3", question: "4 × 3 = ?", answer: 12, difficulty: "easy", points: 10 },
  { id: "4", question: "15 ÷ 3 = ?", answer: 5, difficulty: "easy", points: 10 },
  { id: "5", question: "9 + 6 = ?", answer: 15, difficulty: "easy", points: 10 },
  { id: "6", question: "18 - 9 = ?", answer: 9, difficulty: "medium", points: 15 },
  { id: "7", question: "7 × 6 = ?", answer: 42, difficulty: "medium", points: 15 },
  { id: "8", question: "24 ÷ 4 = ?", answer: 6, difficulty: "medium", points: 15 },
  { id: "9", question: "13 + 18 = ?", answer: 31, difficulty: "medium", points: 15 },
  { id: "10", question: "45 - 17 = ?", answer: 28, difficulty: "medium", points: 15 },
  { id: "11", question: "16 × 3 = ?", answer: 48, difficulty: "hard", points: 20 },
  { id: "12", question: "56 ÷ 7 = ?", answer: 8, difficulty: "hard", points: 20 },
  { id: "13", question: "84 - 39 = ?", answer: 45, difficulty: "hard", points: 20 },
  { id: "14", question: "12 × 12 = ?", answer: 144, difficulty: "hard", points: 20 },
  { id: "15", question: "125 ÷ 5 = ?", answer: 25, difficulty: "hard", points: 20 },
];
