export type Team = {
  id: number;
  name: string;
  color: string;
  avatar: string;
  score: number;
  isActive: boolean;
  completedPuzzles: number;
  timeLeft: number;
  grid: (string | null)[][];
};

export type Phase = "teacher" | "game" | "result" | "finish";
