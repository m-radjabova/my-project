import { useMemo, useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "react-toastify";
import apiClient from "../apiClient/apiClient";

export type User = {
  id: string;
  name?: string;
  email?: string;
  roles?: string[];
};

async function fetchUsers(): Promise<User[]> {
  const { data } = await apiClient.get("/users/");
  return data;
}

async function patchUserRoles(userId: string, roles: string[]) {
  await apiClient.patch(`/users/${userId}/roles`, roles);
}


async function removeUser(userId: string) {
  await apiClient.delete(`/users/${userId}`);
}

export default function useUsers() {
  const qc = useQueryClient();
  const [searchTerm, setSearchTerm] = useState("");

  const usersQuery = useQuery({
    queryKey: ["users"],
    queryFn: fetchUsers,
  });

  const updateRoleMutation = useMutation({
    mutationFn: ({ userId, roles }: { userId: string; roles: string[] }) =>
      patchUserRoles(userId, roles),
    onSuccess: async () => {
      toast.success("User roles updated!");
      await qc.invalidateQueries({ queryKey: ["users"] });
    },
    onError: () => toast.error("Failed to update roles"),
  });

  const deleteMutation = useMutation({
    mutationFn: (userId: string) => removeUser(userId),
    onSuccess: async () => {
      toast.success("User deleted!");
      await qc.invalidateQueries({ queryKey: ["users"] });
    },
    onError: () => toast.error("Failed to delete user"),
  });

  const filteredUsers = useMemo(() => {
    const list = usersQuery.data ?? [];
    const t = searchTerm.trim().toLowerCase();
    if (!t) return list;
    return list.filter(
      (u) =>
        u.name?.toLowerCase().includes(t) ||
        u.email?.toLowerCase().includes(t)
    );
  }, [usersQuery.data, searchTerm]);

  return {
    users: filteredUsers,
    loading: usersQuery.isLoading,
    updateUserRole: (userId: string, newRoles: string[]) =>
      updateRoleMutation.mutateAsync({ userId, roles: newRoles }),
    deleteUser: (userId: string) => deleteMutation.mutateAsync(userId),
    searchTerm,
    setSearchTerm,
  };
}
