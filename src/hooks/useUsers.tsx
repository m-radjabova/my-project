import { useQuery } from "@tanstack/react-query";
import apiClient from "../apiClient/apiClient";

function useUsers() {
  const { data: users = [] } = useQuery({
    queryKey: ["users"],
    queryFn: async () => {
      const res = await apiClient.get("/users");
      return res.data;
    },
  });
  
  return { users };
}

export default useUsers;
