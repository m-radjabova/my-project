import { useMemo, useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { isAxiosError } from "axios";
import type { Reviews, Product } from "../types/types";
import type { PaginatedResponse } from "../types/types";
import apiClient from "../apiClient/apiClient";
import { toast } from "react-toastify";

type ReviewUser = {
  id?: string | number;
  name?: string;
  email?: string;
};

export type ReviewWithUser = Reviews & {
  user?: ReviewUser | null;
};

type ReviewApi = Omit<Reviews, "userId"> & {
  userId?: string;
  user_id?: string | number;
};

type ProductPayload = {
  name: string;
  price: number;
  category_id: number;
  description?: string;
  weight?: string;
  image?: File;
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

  // ✅ pagination state
  const [page, setPage] = useState<number>(1);
  const [limit, setLimit] = useState<number>(12);

  // category o'zgarsa page 1 ga qaytarish (foydali UX)
  const onChangeCategory = (val: string) => {
    setSelectedCategory(val);
    setPage(1);
  };

  // ✅ Products query (paginated)
  const {
    data: productsRes,
    isLoading: loadingProducts,
    isError: isProductsError,
    error: productsError,
  } = useQuery({
    queryKey: ["products", selectedCategory, page, limit],
    queryFn: async () => {
      const params: Record<string, any> = { page, limit };
      if (selectedCategory) params.category_id = Number(selectedCategory);

      const { data } = await apiClient.get<PaginatedResponse<Product>>("/products", {
        params,
      });

      return data;
    }
  });

  const products = productsRes?.items ?? [];
  const total = productsRes?.total ?? 0;
  const pages = productsRes?.pages ?? 1;

  const {
    data: reviewsRaw = [],
    isLoading: loadingReviews,
    isError: isReviewsError,
    error: reviewsError,
  } = useQuery<ReviewApi[]>({
    queryKey: ["productReviews", activeProductId],
    enabled: !!activeProductId,
    queryFn: async () => (await apiClient.get(`/products/${activeProductId}/reviews`)).data,
  });

  const userIds = useMemo(() => {
    const ids = reviewsRaw
      .map((r) => r.user_id ?? r.userId)
      .filter((id): id is string | number => id != null)
      .map((id) => String(id));
    return Array.from(new Set(ids));
  }, [reviewsRaw]);

  const { data: usersMap = {}, isLoading: loadingUsers } = useQuery<Record<string, ReviewUser>>({
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
    return reviewsRaw.map((r) => {
      const uid = r.userId ?? (r.user_id != null ? String(r.user_id) : undefined);
      return { ...r, userId: uid ?? "", user: uid ? usersMap[uid] ?? null : null };
    });
  }, [reviewsRaw, usersMap]);

  const addReviewMutation = useMutation({
    mutationFn: async ({ productId, payload }: { productId: string; payload: AddReviewPayload }) => {
      try {
        const { data } = await apiClient.post<Reviews>(`/products/${productId}/reviews`, payload);
        return data;
      } catch (err: unknown) {
        const message = isAxiosError(err)
          ? (err.response?.data as any)?.detail ?? (err.response?.data as any)?.message ?? "Failed to submit review"
          : "Failed to submit review";
        toast.error(message);
        throw err;
      }
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
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["products"] });
    },
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
    // ✅ products
    products,
    productsRes, // agar UIga to'liq kerak bo'lsa

    loadingProducts,
    isProductsError,
    productsError,

    // ✅ filters
    selectedCategory,
    setSelectedCategory: onChangeCategory,

    // ✅ pagination
    page,
    setPage,
    limit,
    setLimit,
    total,
    pages,
    hasPrev: page > 1,
    hasNext: page < pages,

    // ✅ reviews
    activeProductId,
    setActiveProductId,
    reviews,
    loadingReviews: loadingReviews || loadingUsers,
    isReviewsError,
    reviewsError,

    // ✅ mutations
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