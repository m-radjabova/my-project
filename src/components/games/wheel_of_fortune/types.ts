export type Student = { id: string; name: string; score: number };

export type Question = {
  id: string;
  question: string;
  options: [string, string, string, string];
  answerIndex: number;
  points: number;
  category: string;
  timeLimit: number;
};

export type Phase = "setup" | "spinning" | "question" | "finish";
