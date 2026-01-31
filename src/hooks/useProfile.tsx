import { useMutation, useQueryClient } from "@tanstack/react-query";
import { isAxiosError } from "axios";
import { toast } from "react-toastify";
import apiClient from "../apiClient/apiClient";
import useContextPro from "./useContextPro";

type UpdateProfilePayload = { name?: string; email?: string };
type ChangePasswordPayload = { old_password: string; new_password: string };

async function updateUser(userId: string, payload: UpdateProfilePayload) {
  const { data } = await apiClient.put(`/users/${userId}`, payload);
  return data; 
}

async function updatePassword(userId: string, payload: ChangePasswordPayload) {
  const { data } = await apiClient.patch(`/users/${userId}`, payload);
  return data;
}

export function useProfile() {
  const qc = useQueryClient();
  const { dispatch } = useContextPro(); 

  const updateProfileMutation = useMutation({
    mutationFn: ({ userId, payload }: { userId: string; payload: UpdateProfilePayload }) =>
      updateUser(userId, payload),

    onSuccess: async (data, vars) => {
      dispatch({ type: "UPDATE_USER", payload: vars.payload });

      toast.success("Profile updated successfully!");
      await qc.invalidateQueries({ queryKey: ["me"] }); 
    },

    onError: (err: unknown) => {
      const responseData = isAxiosError(err) ? err.response?.data : undefined;
      console.log("Update profile error:", responseData);
      toast.error("Failed to update profile");
    },
  });

  const changePasswordMutation = useMutation({
    mutationFn: ({ userId, payload }: { userId: string; payload: ChangePasswordPayload }) =>
      updatePassword(userId, payload),

    onSuccess: () => toast.success("🔐 Parol muvaffaqiyatli o‘zgartirildi!"),

    onError: (err: unknown) => {
      const responseData = isAxiosError(err) ? err.response?.data : undefined;
      console.log("Update password error:", responseData);
      toast.error("Failed to update password");
    },
  });

  return {
    updateProfile: updateProfileMutation.mutateAsync,
    changePassword: changePasswordMutation.mutateAsync,
    updatingProfile: updateProfileMutation.isPending,
    updatingPassword: changePasswordMutation.isPending,
  };
}
