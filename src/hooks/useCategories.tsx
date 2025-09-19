import { useQuery } from "@tanstack/react-query";
import { getCategories } from "../myApi/apiCategories";

function useCategories() {
    const categoryQuery = useQuery({
        queryKey: ["categories"],
        queryFn: getCategories,
        staleTime: 1000 * 60,
    });

    console.log("Category Query State:", {
        data: categoryQuery.data,
    });

    return { categoryQuery };
}

export default useCategories;
