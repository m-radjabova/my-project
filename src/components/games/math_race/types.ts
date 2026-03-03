export type Phase = "teacher" | "play" | "finish";
export type PlayerId = 0 | 1;
export type Difficulty = "easy" | "medium" | "hard";

export type Player = {
  id: PlayerId;
  name: string;
  position: number;
};

export type MathQuestion = {
  id: string;
  question: string;
  answer: number;
  difficulty: Difficulty;
  points: number;
};

export type QuestionDraft = {
  question: string;
  answer: string;
  difficulty: Difficulty;
  points: number;
};

export type PlayerStats = {
  streak: number;
  bestStreak: number;
  correct: number;
  wrong: number;
  used5050: boolean;
  usedTime: boolean;
  shieldCharges: number;
  shieldArmed: boolean;
  reducedOptions: number[] | null;
};
