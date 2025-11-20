export interface User {
  id: number;
  username: string;
  email: string;
}

export interface ReqUser {
  username: string;
  email: string;
}

export interface ResponseTask{
  status : string;
  tasks : Task[];
}

export interface Task {
  id: number;
  title: string;
  description: string;
  assignees: User[];
  status: string;
  priority: string;     
  created_date: string;
  end_date: string;
}

export interface ReqTask {
  title: string;
  description: string;
  assignees: User[];
  status: string;
  priority: string;      
  end_date: string;
}
