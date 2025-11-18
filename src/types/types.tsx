export interface User {
  id: number;
  username: string;
  email: string;
}

export const StatusType = {
  TODO: "TODO",
  INPROGRESS: "INPROGRESS",
  VERIFIED: "VERIFIED",
  DONE: "DONE",
} as const;

export type StatusType = typeof StatusType[keyof typeof StatusType];

export interface Status {
  id: number;
  title: StatusType;
}

export const PriorityType = {
  LOW: "LOW",
  MEDIUM: "MEDIUM",
  HIGH: "HIGH",
} as const;

export type PriorityType = typeof PriorityType[keyof typeof PriorityType];

export interface Task {
  id: number;
  title: string;
  description: string;
  assignee: string | string[];          
  status: StatusType;         
  priority: PriorityType[];    
  end_date: string;
  created_date: string;
}
