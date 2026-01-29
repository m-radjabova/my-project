import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import type { Category } from "../types/types";
import apiClient from "../apiClient/apiClient";

function useCategories() {
  const queryClient = useQueryClient();

  const {
    data: categories = [],
    isLoading: loading,
    isError,
    error,
  } = useQuery<Category[]>({
    queryKey: ["categories"],
    queryFn: async () => (await apiClient.get("/categories")).data,
  });

  const addCategory = useMutation({
    mutationFn: async (name: string) =>
      (await apiClient.post("/categories", { name })).data,
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["categories"] }),
  });

  const updateCategory = useMutation({
    mutationFn: async ({ id, name }: { id: string; name: string }) =>
      (await apiClient.put(`/categories/${id}`, { name })).data,
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["categories"] }),
  });

  const deleteCategory = useMutation({
    mutationFn: async (id: string) => {
      await apiClient.delete(`/categories/${id}`);
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["categories"] }),
  });

  return {
    categories,
    loading,
    isError,
    error,
    addCategory: addCategory.mutateAsync,
    updateCategory: updateCategory.mutateAsync,
    deleteCategory: deleteCategory.mutateAsync,
  };
}

export default useCategories;
