import { useMemo, useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import type { Product, Reviews } from "../types/types";
import apiClient from "../apiClient/apiClient";

export type ReviewWithUser = Reviews & {
  user?: {
    id: string;
    name?: string;
    email?: string;
  } | null;
};


type ProductPayload = {
  name: string;
  price: number;        // swagger: integer
  category_id: number;  // swagger: integer
  description?: string;
  weight?: string;
  image?: File;         // swagger: binary
};

function buildProductFormData(p: ProductPayload) {
  const fd = new FormData();
  fd.append("name", p.name);
  fd.append("price", String(p.price));
  fd.append("category_id", String(p.category_id));
  if (p.description) fd.append("description", p.description);
  if (p.weight) fd.append("weight", p.weight);
  if (p.image) fd.append("image", p.image);
  return fd;
}

type AddReviewPayload = { title: string; rating: number };

function useProducts() {
  const queryClient = useQueryClient();

  const [selectedCategory, setSelectedCategory] = useState<string>("");
  const [activeProductId, setActiveProductId] = useState<string>("");

  const {
    data: products = [],
    isLoading: loading,
    isError: isProductsError,
    error: productsError,
  } = useQuery<Product[]>({
    queryKey: ["products", selectedCategory],
    queryFn: async () => {
      const { data } = await apiClient.get<Product[]>("/products", {
        params: selectedCategory ? { category_id: Number(selectedCategory) } : {},
      });
      return data;
    },
  });

  const {
    data: reviewsRaw = [],
    isLoading: loadingReviews,
    isError: isReviewsError,
    error: reviewsError,
  } = useQuery<Reviews[]>({
    queryKey: ["productReviews", activeProductId],
    enabled: !!activeProductId,
    queryFn: async () => (await apiClient.get(`/products/${activeProductId}/reviews`)).data,
  });

  const userIds = useMemo(() => {
    const ids = reviewsRaw
      .map((r: any) => r.user_id ?? r.userId)
      .filter(Boolean);
    return Array.from(new Set(ids));
  }, [reviewsRaw]);

  const { data: usersMap = {}, isLoading: loadingUsers } = useQuery<Record<string, any>>({
    queryKey: ["reviewUsers", userIds],
    enabled: userIds.length > 0,
    queryFn: async () => {
      const results = await Promise.all(
        userIds.map(async (id) => {
          const { data } = await apiClient.get(`/users/${id}`);
          return [id, data] as const;
        })
      );
      return Object.fromEntries(results);
    },
  });

  const reviews: ReviewWithUser[] = useMemo(() => {
    return reviewsRaw.map((r: any) => {
      const uid = r.user_id ?? r.userId;
      return { ...r, user: uid ? usersMap[uid] ?? null : null };
    });
  }, [reviewsRaw, usersMap]);

  const addReviewMutation = useMutation({
    mutationFn: async ({ productId, payload }: { productId: string; payload: AddReviewPayload }) => {
      const { data } = await apiClient.post<Reviews>(`/products/${productId}/reviews`, payload);
      return data;
    },
    onSuccess: (_created, variables) => {
      queryClient.invalidateQueries({ queryKey: ["productReviews", variables.productId] });
    },
  });

  const addProduct = useMutation({
    mutationFn: async (payload: ProductPayload) => {
      const fd = buildProductFormData(payload);
      const { data } = await apiClient.post("/products", fd, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      return data;
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["products"] }),
  });

  const updateProduct = useMutation({
    mutationFn: async ({ id, payload }: { id: string; payload: ProductPayload }) => {
      const fd = buildProductFormData(payload);
      const { data } = await apiClient.put(`/products/${id}`, fd, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      return data;
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["products"] }),
  });

  const deleteProduct = useMutation({
    mutationFn: async (id: string) => {
      await apiClient.delete(`/products/${id}`);
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["products"] }),
  });

  return {
    products,
    loadingProducts: loading,
    isProductsError,
    productsError,

    selectedCategory,
    setSelectedCategory,

    activeProductId,
    setActiveProductId,

    reviews,
    loadingReviews: loadingReviews || loadingUsers,
    isReviewsError,
    reviewsError,

    addReview: (productId: string, payload: AddReviewPayload) =>
      addReviewMutation.mutateAsync({ productId, payload }),
    isAddingReview: addReviewMutation.isPending,

    addProduct: addProduct.mutateAsync,
    updateProduct: (id: string, payload: ProductPayload) =>
      updateProduct.mutateAsync({ id, payload }),
    deleteProduct: deleteProduct.mutateAsync,

    isAdding: addProduct.isPending,
    isUpdating: updateProduct.isPending,
    isDeleting: deleteProduct.isPending,
  };
}

export default useProducts;
