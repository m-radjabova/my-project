import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import type { CarouselItem } from "../types/types";
import apiClient from "../apiClient/apiClient";

type CarouselPayload = {
  title1: string;
  title2: string;
  description?: string;
  img?: File; 
};

function buildFormData(payload: CarouselPayload) {
  const fd = new FormData();
  fd.append("title1", payload.title1);
  fd.append("title2", payload.title2);
  if (payload.description) fd.append("description", payload.description);
  if (payload.img) fd.append("img", payload.img);
  return fd;
}

function useCarousel() {
  const queryClient = useQueryClient();

  const {
    data: carousel = [],
    isLoading: loading,
    isError,
    error,
  } = useQuery<CarouselItem[]>({
    queryKey: ["carousel"],
    queryFn: async () => (await apiClient.get("/carousels")).data,
  });

  const addCarousel = useMutation({
    mutationFn: async (payload: CarouselPayload) => {
      const fd = buildFormData(payload);
      const { data } = await apiClient.post("/carousels", fd, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      return data;
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["carousel"] }),
  });

  const updateCarousel = useMutation({
    mutationFn: async ({ id, payload }: { id: string; payload: CarouselPayload }) => {
      const fd = buildFormData(payload);
      const { data } = await apiClient.put(`/carousels/${id}`, fd, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      return data;
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["carousel"] }),
  });

  const deleteCarousel = useMutation({
    mutationFn: async (id: string) => {
      await apiClient.delete(`/carousels/${id}`);
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["carousel"] }),
  });

  return {
    carousel,
    loading,
    isError,
    error,

    addCarousel: addCarousel.mutateAsync,
    updateCarousel: (id: string, payload: CarouselPayload) =>
      updateCarousel.mutateAsync({ id, payload }),
    deleteCarousel: deleteCarousel.mutateAsync,

    isAdding: addCarousel.isPending,
    isUpdating: updateCarousel.isPending,
    isDeleting: deleteCarousel.isPending,
  };
}

export default useCarousel;
