import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import apiClient from "../apiClient/apiClient";
import type { FieldValues } from "react-hook-form";
import type { Task } from "../types/types";

function useTasks() {
  const queryClient = useQueryClient();

  const { data: tasks = [] } = useQuery({
    queryKey: ["tasks"],
    queryFn: async () => {
      const res = await apiClient.get<Task[]>("/tasks");
      return res.data;
    },
    staleTime: 2 * 60 * 1000, 
    gcTime: 5 * 60 * 1000, 
    refetchInterval: 15 * 1000, 
  });

  const { mutate: addTask } = useMutation({
    mutationFn: async (task: FieldValues) => {
      const res = await apiClient.post("/tasks", task);
      return res.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["tasks"] });
    },
  });

  const useTasksByStatus = (status: string) => {
    return useQuery({
      queryKey: ["tasks", status],
      queryFn: async () => {
        const res = await apiClient.get<Task[]>(`/tasks/status/${status}`);
        return res.data;
      },
      staleTime: 1 * 60 * 1000, 
      gcTime: 3 * 60 * 1000, 
      refetchInterval: 20 * 1000, 
    });
  };

  const { mutate: deleteTask } = useMutation({
    mutationFn: async (task_id: number) => {
      const res = await apiClient.delete(`/tasks/${task_id}`);
      return res.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["tasks"] });
    },
  })

  const { mutate: updateTask } = useMutation({
    mutationFn: async (task: FieldValues) => {
      const res = await apiClient.put(`/tasks/${task.id}`, task);
      return res.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["tasks"] });
    },
  })

  return { tasks, addTask, useTasksByStatus, deleteTask, updateTask };
}

export default useTasks;