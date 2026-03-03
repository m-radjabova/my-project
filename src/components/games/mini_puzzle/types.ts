export type Team = {
  id: number;
  name: string;
  color: string;
  avatar: string;
  score: number;
  isActive: boolean;
  completedPuzzles: number;
  currentPuzzleId: string | null;
  puzzlePieces: PuzzlePiece[];
  placedPieces: number[];
  timeLeft: number;
  streak: number;
  hintsLeft: number;
};

export type PuzzlePiece = {
  id: number;
  imageId: string;
  correctPosition: number;
  currentPosition: number;
  imageUrl: string;
  width: number;
  height: number;
  x: number;
  y: number;
};

export type Puzzle = {
  id: string;
  name: string;
  imageUrl: string;
  pieces: PuzzlePiece[];
  difficulty: "easy" | "medium" | "hard";
  pieceCount: number;
  viewTransform: {
    zoom: number;
    offsetX: number;
    offsetY: number;
  };
};

export type Phase = "teacher" | "game" | "result" | "finish";
