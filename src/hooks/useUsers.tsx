import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import apiClient from "../apiClient/apiClient";
import type { User } from "../types/types";

function useUsers() {
  const queryClient = useQueryClient();

  const { data: users = [], isLoading, error, refetch } = useQuery({
    queryKey: ["users"],
    queryFn: async () => {
      const response = await apiClient.get("/users");
      return response.data;
    }
  });

  const addUser = useMutation({
    mutationFn: (user: User) => apiClient.post("/users", user).then(res => res.data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["users"] });
    }
  });

  const updateUser = useMutation({
    mutationFn: (user: User) => apiClient.put(`/users/${user.id}`, user).then(res => res.data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["users"] });
    }
  });

  const deleteUser = useMutation({
    mutationFn: (id: number) => apiClient.delete(`/users/${id}`),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["users"] });
    }
  });

  const incrementAge = useMutation({
    mutationFn: (id: number) => apiClient.patch(`/users/${id}/increment`),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["users"] });
    }
  })

  const decrementAge = useMutation({
    mutationFn: (id : number) => apiClient.patch(`/users/${id}/decrement`),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["users"] });
    }
  })

  return {
    users,
    isLoading,
    error,
    refetch,
    addUser: addUser.mutate,
    incrementAge: incrementAge.mutate,
    decrementAge: decrementAge.mutate,
    updateUser: updateUser.mutate,
    deleteUser: deleteUser.mutate,
    isAdding: addUser.isPending,
    isUpdating: updateUser.isPending,
    isDeleting: deleteUser.isPending
  };
}

export default useUsers;