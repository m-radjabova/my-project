import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import apiClient from "../apiClient/apiClient";
import type { Status } from "../types/types";

function useTaskStatus() {

  const queryClient = useQueryClient(); 

  const {
    data: statusList = [],
  } = useQuery({
    queryKey: ["statusList"],
    queryFn: async () => {
      const res = await apiClient.get("/status/list");
      return res.data;
    },
    staleTime: 2 * 60 * 1000, 
    gcTime: 5 * 60 * 1000, 
    refetchInterval: 15 * 1000, 
  });

  const {
    data: statusType = [],
  } = useQuery({
    queryKey: ["statusTypes"],
    queryFn: async () => {
      const res = await apiClient.get("/status/types");
      return res.data;
    },
  });

  // console.log("statusType", statusType);

  const { mutate: addTaskStatus, isPending: isAdding } = useMutation({
    mutationFn: async (statusType: string) => {
      const existingStatusTypes = statusList.map((status: Status) => status.title);

      if (existingStatusTypes.includes(statusType)) {
        return Promise.reject("Status already exists");
      }

      const res = await apiClient.post(
        `/status/create?status_type=${statusType}`
      );
      return res.data;
    },

    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["statusList"] });  
      queryClient.invalidateQueries({ queryKey: ["statusTypes"] }); 
    }
  });

  const existingStatusTypes = statusList.map((status: Status) => status.title);

  const {mutate: deleteTaskStatus, isPending: isDeleting} = useMutation({
    mutationFn: async (id: number) => {
      const res = await apiClient.delete(`/status/delete/${id}`);
      return res.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["statusList"] });  
      queryClient.invalidateQueries({ queryKey: ["statusTypes"] }); 
    }
  })

  const {data: priorityType = []} = useQuery({
    queryKey: ["priority"],
    queryFn: async () => {
      const res = await apiClient.get("/tasks/priority");
      return res.data;
    },
  });

  // console.log("priorityType", priorityType);

  return {
    statusList,
    priorityType,
    statusType,
    existingStatusTypes,
    isAdding,
    addTaskStatus,
    isDeleting,
    deleteTaskStatus
  };
}

export default useTaskStatus;
