export type Phase = "intro" | "play" | "finish";

export type Riddle = {
  id: string;
  title: string;
  story: string;
  question: string;
  options: [string, string, string, string];
  answerIndex: number;
  hint: string;
  reward: number;
};
