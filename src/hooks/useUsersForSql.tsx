import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import apiClient from "../apiClient/apiClient";
import type { ReqUserForSql, UserForSql } from "../types/types";

function useUsersForSql() {
  const queryClient = useQueryClient();
  const { data: users = [] } = useQuery({
    queryKey: ["users"],
    queryFn: async () => {
      const res = await apiClient.get<UserForSql[]>("/users");
      return res.data;
    },
  });

  const { mutate: addUser } = useMutation({
    mutationFn: async (newUser: ReqUserForSql) => {
      const res = await apiClient.post("/users", newUser);
      return res.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["users"] });
    },
  });


  const {mutate: deleteUser} = useMutation({
    mutationFn: async (userId: number) => {
      await apiClient.delete(`/users/${userId}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["users"] });
    }
  })

  const {mutate: updateUser} = useMutation({
    mutationFn: async (updatedUser: UserForSql) => {
      const res = await apiClient.put<UserForSql>(`/users/${updatedUser.id}`, updatedUser);
      return res.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["users"] });
    }

  })
  
  return { users, addUser, deleteUser, updateUser };
}

export default useUsersForSql;
