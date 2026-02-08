import { useQuery } from "@tanstack/react-query";
import apiClient from "../apiClient/apiClient";
import type { LessonApi } from "../types/types";

export function useCourseLessons(courseId: string) {
  return useQuery<LessonApi[]>({
    queryKey: ["lessons", courseId],
    queryFn: async () =>
      (await apiClient.get(`/courses/${courseId}/lessons`)).data,
    enabled: !!courseId,
  });
}
