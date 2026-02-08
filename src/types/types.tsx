export interface User {
  id: string;
  username: string;
  email: string;
  password: string;
  avatar?: string | null;
  confirmPassword: string;
  roles: string[],
  uid: string;
}

export interface Category{
  id: string,
  name: string,
  description: string,
  icon: string
}

export type CourseApi = {
  id: string;
  title: string;
  description?: string | null;
  image?: string | null;
  level?: string | null;
  price: number;
  duration: number;
  rating: number;
  category_id: string;
};

export type LessonApi = {
  id: string;
  course_id: string;
  title: string;
  description?: string | null;
  order: number;
  is_free: boolean;
  video_url: string;
  duration_sec: number;
};


