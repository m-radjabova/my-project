import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import apiClient from "../apiClient/apiClient";
import type { OrderProduct } from "../types/types";

type OrderItemPayload = {
  product_id: string;
  quantity: number;
};

export type OrderLocation = {
  lat: number;
  lng: number;
};

type CreateOrderPayload = {
  payment_method: string;
  shipping_address: string;
  phone: string;
  notes?: string;
  location?: OrderLocation | null;
  items: OrderItemPayload[];
};

export type OrderStatus = "pending" | "completed" | "delivered";

export type Order = {
  id: number | string;
  status?: OrderStatus | string;
  user?: { name?: string };
  shipping_address?: string;
  total_price?: number | string;
  payment_method?: string;
  created_at?: string | number | Date;
  notes?: string;
  location?: OrderLocation | null;
  phone?: string;
  items?: OrderProduct[];
  products?: OrderProduct[];
};

export function useOrders() {
  const qc = useQueryClient();

  const ordersQuery = useQuery({
    queryKey: ["adminOrders"],
    queryFn: async () => (await apiClient.get("/orders")).data, 
  });

  const createOrder = useMutation({
    mutationFn: async (payload: CreateOrderPayload) => {
      const { data } = await apiClient.post("/orders", payload);
      return data;
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["myOrders"] });
    },
  });

  const myOrders = useQuery({
    queryKey: ["myOrders"],
    queryFn: async () => (await apiClient.get("/orders/my")).data,
  });

  const updateStatus = useMutation({
    mutationFn: async (params: { orderId: number; status: OrderStatus }) => {
      const { data } = await apiClient.patch(`/orders/${params.orderId}/status`, {
        status: params.status,
      });
      return data;
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["adminOrders"] });
      qc.invalidateQueries({ queryKey: ["myOrders"] });
    },
  });

  return {
    orders: (ordersQuery.data ?? []) as Order[],
    loading: ordersQuery.isLoading,
    ordersError: ordersQuery.error,
    createOrder: createOrder.mutateAsync,
    isCreating: createOrder.isPending,
    
    updateStatus: updateStatus.mutateAsync,
    updatingId: updateStatus.variables?.orderId ?? null,
    isUpdating: updateStatus.isPending,

    myOrders: (myOrders.data ?? []) as Order[],
    isLoadingMyOrders: myOrders.isLoading,
    myOrdersError: myOrders.error,
  };
}
