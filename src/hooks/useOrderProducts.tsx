import { useMemo } from "react";
import { useQuery } from "@tanstack/react-query";
import apiClient from "../apiClient/apiClient";
import type { GroupedOrderProduct, OrderProductApi } from "../types/types";

function useOrderProducts() {
  const { data, isLoading, error } = useQuery<OrderProductApi[]>({
    queryKey: ["orderProductsAll"],
    queryFn: async () => (await apiClient.get<OrderProductApi[]>("/orders/products/all")).data,
    refetchInterval: 5000,
  });

  const allProducts = Array.isArray(data) ? data : [];

  const groupedProducts = useMemo(() => {
    const map = new Map<string, GroupedOrderProduct>();

    for (const p of allProducts) {
      if (!p) continue;

      const key = String(p.product_id ?? p.name ?? p.id ?? "");

      const quantity = Number(p.quantity ?? 0) || 0;
      const unitPrice = Number(p.price ?? 0) || 0;

      const lineRevenue = Number(p.total_price ?? 0) || unitPrice * quantity;

      const prev = map.get(key);

      if (!prev) {
        map.set(key, {
          ...p,
          quantity,
          total_price: lineRevenue,
        });
      } else {
        map.set(key, {
          ...prev,
          quantity: prev.quantity + quantity,
          total_price: prev.total_price + lineRevenue,
        });
      }
    }

    return Array.from(map.values());
  }, [allProducts]);

  return {
    allProducts,
    groupedProducts,
    loading: isLoading,
    error,
  };
}

export default useOrderProducts;
