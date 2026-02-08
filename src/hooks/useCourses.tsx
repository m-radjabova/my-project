import { useQuery } from "@tanstack/react-query";
import apiClient from "../apiClient/apiClient";
import type { CourseApi } from "../types/types";

function useCourses() {
  const {
    data: courses = [],
    isLoading: loading,
    isError,
    error,
  } = useQuery<CourseApi[]>({
    queryKey: ["courses"],
    queryFn: async () => (await apiClient.get("/courses")).data,
  });

  return {
    courses,
    loading,
    isError,
    error,
  };
}

export default useCourses;
