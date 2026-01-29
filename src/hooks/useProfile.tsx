import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "react-toastify";
import apiClient from "../apiClient/apiClient";
import useContextPro from "./useContextPro"; // sizdagi hook

type UpdateProfilePayload = { name?: string; email?: string };
type ChangePasswordPayload = { old_password: string; new_password: string };

async function updateUser(userId: string, payload: UpdateProfilePayload) {
  const { data } = await apiClient.put(`/users/${userId}`, payload);
  return data; // backend updated user qaytarsa yaxshi
}

async function updatePassword(userId: string, payload: ChangePasswordPayload) {
  const { data } = await apiClient.patch(`/users/${userId}`, payload);
  return data;
}

export function useProfile() {
  const qc = useQueryClient();
  const { dispatch } = useContextPro(); // ✅ context dispatch

  const updateProfileMutation = useMutation({
    mutationFn: ({ userId, payload }: { userId: string; payload: UpdateProfilePayload }) =>
      updateUser(userId, payload),

    onSuccess: async (data, vars) => {
      // ✅ UI darrov o'zgarsin: dispatch bilan state.user ni update qilamiz
      dispatch({ type: "UPDATE_USER", payload: vars.payload });

      // agar backend updated user qaytarsa, shuni ham ishlatsangiz bo'ladi:
      // dispatch({ type: "SET_USER", payload: data });

      toast.success("Profile updated successfully!");
      await qc.invalidateQueries({ queryKey: ["me"] }); // agar siz 'me' query qo'ysangiz
    },

    onError: (err: any) => {
      console.log("Update profile error:", err?.response?.data);
      toast.error("Failed to update profile");
    },
  });

  const changePasswordMutation = useMutation({
    mutationFn: ({ userId, payload }: { userId: string; payload: ChangePasswordPayload }) =>
      updatePassword(userId, payload),

    onSuccess: () => toast.success("🔐 Parol muvaffaqiyatli o‘zgartirildi!"),

    onError: (err: any) => {
      console.log("Update password error:", err?.response?.data);
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
