import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import apiClient from "../apiClient/apiClient";
import type { ReqTask, ResponseTask } from "../types/types";

function useTasks() {
  const queryClient = useQueryClient();

  const { data: taskStatus = [] } = useQuery({
    queryKey: ["tasks-status"],
    queryFn: async () => {
      const res = await apiClient.get<string[]>("/tasks/task-status");
      return res.data;
    },
  });

  const { data: tasks = [] } = useQuery({
    queryKey: ["tasks"],
    queryFn: async () => {
      const res = await apiClient.get<ResponseTask[]>("/tasks");
      return res.data;
    },
  });

  const { mutate: addTask, isPending: adding } = useMutation({
    mutationFn: async (task: ReqTask) => {
      const res = await apiClient.post("/tasks", task);
      return res.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["tasks"] });
    },
  });

  const { mutate: updateTask, isPending: updating } = useMutation({
    mutationFn: async ({ id, data }: { id: number; data: ReqTask }) => {
      const res = await apiClient.put(`/tasks/${id}`, data);
      return res.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["tasks"] });
    },
  });

  const { mutate: deleteTask, isPending: deleting } = useMutation({
    mutationFn: async (id: number) => {
      await apiClient.delete(`/tasks/${id}`);
      return id;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["tasks"] });
    },
  });

  return {
    taskStatus,
    tasks,
    addTask,
    updateTask,
    deleteTask,
    loading: {
      adding,
      updating,
      deleting,
    },
  };
}

export default useTasks;
