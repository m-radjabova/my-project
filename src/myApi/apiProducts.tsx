
import apiClient from "../apiClient/apiClient";
import type { Product } from "../types/types";

export const getProducts = async (categoryId?: string) => {
  const response = await apiClient.get<Product[]>("/products", {
    params: categoryId ? { categoryId } : {}, 
  });
  return response.data;
};
