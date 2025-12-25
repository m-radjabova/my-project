import { useEffect, useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import apiClient from "../apiClient/apiClient";
import type { Debt, Debtor, FilterParams, ReqDebt, ReqDebtor } from "../types/types";

interface MutationVariables {
  debtorId: number;
  amount?: number;
  debt_id?: number;
}

interface MutationVariables2 {
  debtorId: number;
  newDebt: ReqDebt;
  debt_id?: number;
}

function useDebtor(debtorId?: number, filterParams?: FilterParams) {
  const queryClient = useQueryClient();
  const [page, setPage] = useState(1);
  const limit = 5;

  const getShopId = (): number | null => {
    const shopId = localStorage.getItem('shop_id');
    return shopId ? parseInt(shopId) : null;
  };

  const shopId = getShopId();

  const { data: debtors = { data: [], total: 0 }, isLoading: debtorsLoading } = useQuery({
    queryKey: ["debtors", filterParams, page, shopId],
    queryFn: async () => {
      if (!shopId) {
        throw new Error("Shop tanlanmagan");
      }

      const params = new URLSearchParams();
      params.set("shop_id", shopId.toString());
      
      if (filterParams?.name?.trim()) {
        params.set("name", filterParams.name.trim());
      }
      params.set("page", page.toString());
      params.set("limit", limit.toString());
      
      const res = await apiClient.get(`/debtor?${params.toString()}`);
      return res.data ?? { data: [], total: 0 };
    },
    enabled: !!shopId,
    placeholderData: (prev) => prev,
    refetchOnWindowFocus: true,
    staleTime: 60000,
  });

  const { data: debtor, isLoading: debtorLoading } = useQuery({
    queryKey: ["debtor", debtorId, shopId],
    queryFn: async () => {
      if (typeof debtorId !== "number" || !shopId) return null;
      
      const res = await apiClient.get<Debtor>(`/debtor/${debtorId}?shop_id=${shopId}`);
      return res.data ?? null;
    },
    enabled: typeof debtorId === "number" && !!shopId,
    refetchOnWindowFocus: true,
    staleTime: 60000,
  });

  const { data: debts = [], isLoading: debtsLoading } = useQuery({
    queryKey: ["debts", debtorId, shopId],
    queryFn: async () => {
      if (typeof debtorId !== "number" || !shopId) return [];
      
      const res = await apiClient.get<Debt[]>(`/debtor/${debtorId}/debts?shop_id=${shopId}`);
      return res.data ?? [];
    },
    enabled: typeof debtorId === "number" && !!shopId,
    refetchInterval: 5000,
    refetchOnWindowFocus: true,
    staleTime: 3000,
  });

  const {
    data: debtsHistory = [],
    isLoading: debtsHistoryLoading,
  } = useQuery({
    queryKey: ["debts-history", debtorId, shopId],
    queryFn: async () => {
      if (typeof debtorId !== "number" || !shopId) return [];
      
      const res = await apiClient.get(`/debtor/${debtorId}/debts-history?shop_id=${shopId}`);
      return res.data ?? [];
    },
    enabled: typeof debtorId === "number" && !!shopId,
    staleTime: Infinity,
  });

  const addDebtorMutate = useMutation({
    mutationFn: async (newDebtor: ReqDebtor) => {
      
      const res = await apiClient.post<Debtor>("/debtor", { ...newDebtor, shop_id: shopId });
      return res.data;
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ["debtors"] });
    },
  });

  const addDebtToDebtorMutate = useMutation({
    mutationFn: async ({ debtorId: dId, newDebt }: MutationVariables2) => {
      if (!shopId) throw new Error("Shop tanlanmagan");
      
      const res = await apiClient.post<Debt>(`/debtor/${dId}/debt?shop_id=${shopId}`, newDebt);
      return res.data;
    },
    onSettled: (_data, _error, vars: MutationVariables2) => {
      queryClient.invalidateQueries({ queryKey: ["debts", vars.debtorId, shopId] });
      queryClient.invalidateQueries({ queryKey: ["debts-history", vars.debtorId, shopId] });
      queryClient.invalidateQueries({ queryKey: ["debtor", vars.debtorId, shopId] });
    },
  });

  const debtRepaymentMutate = useMutation({
    mutationFn: async ({ debtorId: dId, amount }: MutationVariables) => {
      if (!shopId) throw new Error("Shop tanlanmagan");
      
      const res = await apiClient.post(`/debtor/${dId}/repayment?shop_id=${shopId}`, { amount });
      return res.data;
    },
    onSettled: (_data, _error, vars: MutationVariables) => {
      queryClient.invalidateQueries({ queryKey: ["debts", vars.debtorId, shopId] });
      queryClient.invalidateQueries({ queryKey: ["debts-history", vars.debtorId, shopId] });
      queryClient.invalidateQueries({ queryKey: ["debtor", vars.debtorId, shopId] });
    },
  });

  const repaySingleDebtMutate = useMutation({
    mutationFn: async ({ debt_id, amount, debtorId: dId }: MutationVariables) => {
      if (!shopId) throw new Error("Shop tanlanmagan");
      
      const res = await apiClient.post(`/debtor/debt/${debt_id}/repayment?shop_id=${shopId}`, {
        amount
      });
      return res.data;
    },
    onSettled: (_data, _error, vars) => {
      queryClient.invalidateQueries({ queryKey: ["debts", vars.debtorId, shopId] });
      queryClient.invalidateQueries({ queryKey: ["debts-history", vars.debtorId, shopId] });
      queryClient.invalidateQueries({ queryKey: ["debtor", vars.debtorId, shopId] });
    },
  });

  useEffect(() => {
  }, [queryClient]);

  return {
    debtors,
    page,
    setPage,
    limit,
    debtorsLoading,
    debtor,
    debts,
    debtorLoading,
    debtsLoading,
    addDebtor: addDebtorMutate.mutate,
    addDebtToDebtor: (newDebt: ReqDebt) => {
      if (!debtorId) throw new Error("Debtor ID topilmadi");
      addDebtToDebtorMutate.mutate({ debtorId, newDebt });
    },
    debtRepayment: (amount: number) => {
      if (!debtorId) throw new Error("Debtor ID topilmadi");
      return debtRepaymentMutate.mutateAsync({ debtorId, amount });
    },
    repaySingleDebt: (debt_id: number, amount: number) => {
      if (!debtorId) throw new Error("Debtor ID topilmadi");
      return repaySingleDebtMutate.mutate({ debtorId, debt_id, amount });
    },
    debtsHistory,
    debtsHistoryLoading,
    shopId,
  };
}

export default useDebtor;