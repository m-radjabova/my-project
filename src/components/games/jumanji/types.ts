export type Team = {
  id: number;
  name: string;
  color: string;
  avatar: string;
  position: number;
  score: number;
  isActive: boolean;
};

export type Question = {
  id: string;
  subject: string;
  question: string;
  options: string[];
  correctAnswer: string;
  difficulty: "easy" | "medium" | "hard";
  timeLimit: number;
};

export type TileType = "question" | "bonus" | "trap" | "challenge" | "boss";

export type Tile = {
  id: number;
  type: TileType;
  icon: string;
  color: string;
  name: string;
};

export type Phase = "setup" | "game" | "question" | "result" | "finish";

export type ScoreAnnouncement = {
  teamId: number;
  teamName: string;
  points: number;
  title: string;
  detail: string;
};
