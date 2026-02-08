import { useQuery } from "@tanstack/react-query";
import apiClient from "../apiClient/apiClient";
import type { CourseApi } from "../types/types";

export function useCourseDetail(courseId: string) {
  return useQuery<CourseApi>({
    queryKey: ["course", courseId],
    queryFn: async () =>
      (await apiClient.get(`/courses/${courseId}`)).data,
    enabled: !!courseId,
  });
}
