import apiClient from "../apiClient/apiClient";
import type { Category } from "../types/types";

export const getCategories = async () => {
  const response = await apiClient.get<Category[]>('/categories');
  return response.data; 
};
