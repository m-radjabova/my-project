export type Difficulty = "easy" | "normal" | "hard";
export type Phase = "setup" | "preview" | "play" | "finish";
export type PlayerId = 0 | 1;

export type CardItem = {
  id: string;
  pairId: string;
  label: string;
};

export type CardState = {
  isFaceUp: boolean;
  isMatched: boolean;
  shake: boolean;
};
