export type Team = {
  id: number;
  name: string;
  color: string;
  avatar: string;
  score: number;
  isActive: boolean;
  streak: number;
  timeLeft: number;
};

export type Question = {
  id: string;
  level: 1 | 2 | 3 | 4;
  question: string;
  options: string[];
  correctAnswer: string;
  explanation: string;
};

export type Phase = "teacher" | "game" | "result" | "finish";
