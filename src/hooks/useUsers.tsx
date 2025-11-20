import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import apiClient from "../apiClient/apiClient";
import type { ReqUser, User } from "../types/types";

function useUsers() {
  const queryClient = useQueryClient();
  const { data: users = [] } = useQuery({
    queryKey: ["users"],
    queryFn: async () => {
      const res = await apiClient.get<User[]>("/users");
      return res.data;
    },
  });

  const {mutate: addUser, isPending: adding } = useMutation({
    mutationFn: async (newUser: ReqUser) => {
      const res = await apiClient.post("/users", newUser);
      return res.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["users"] });
    },
  })

  const {mutate: deleteUser} = useMutation({
    mutationFn: async (userId: number) => {
      await apiClient.delete(`/users/${userId}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["users"] });
    }
  })

  const {mutate: updateUser} = useMutation({
    mutationFn: async (updatedUser: User) => {
      const res = await apiClient.put<User>(`/users/${updatedUser.id}`, updatedUser);
      return res.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["users"] });
    }

  })
  
  return { users, addUser, adding, deleteUser, updateUser };
}

export default useUsers;
