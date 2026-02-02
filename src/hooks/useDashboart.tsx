import { useMemo, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import apiClient from "../apiClient/apiClient";


export type DashRange = "week" | "month" | "year";

export type DashboardProduct = {
  product_id: number;
  name: string;
  units: number;
  revenue: number;
};

export type DashboardResponse = {
  range: DashRange;
  kpis: {
    total_revenue: number;
    total_products: number;
    active_orders: number;
  };
  product_revenue: DashboardProduct[];
  products_list: DashboardProduct[];
  total: number;
};

async function fetchDashboard(range: DashRange): Promise<DashboardResponse> {
  const res = await apiClient.get(`/orders/admin/dashboard`, {
    params: { range },
  });
  return res.data;
}

function useDashboart() {
  const [range, setRange] = useState<DashRange>("week");

  const query = useQuery({
    queryKey: ["admin-dashboard", range],
    queryFn: () => fetchDashboard(range),
    staleTime: 30_000,
    retry: 1,
  });

  const products = query.data?.product_revenue ?? [];
  const list = query.data?.products_list ?? [];

  const totalRevenue = query.data?.kpis?.total_revenue ?? 0;
  const totalProducts = query.data?.kpis?.total_products ?? 0;
  const activeOrders = query.data?.kpis?.active_orders ?? 0;

  const chartLabels = useMemo(() => products.map((p) => p.name ?? ""), [products]);
  const chartValues = useMemo(() => products.map((p) => Number(p.revenue ?? 0)), [products]);

  return {
    range,
    setRange,

    data: query.data,
    products,
    list,

    totalRevenue,
    totalProducts,
    activeOrders,

    chartLabels,
    chartValues,

    loading: query.isLoading,
    fetching: query.isFetching,
    error: query.error,
    refetch: query.refetch,
  };
}

export default useDashboart;
