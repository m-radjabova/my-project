import { useState } from "react";
import useCategories from "../../hooks/useCategories";
import FilterCategories from "../product/FilterCategories";
import ProductList from "../product/ProductList";

function SellingProducts() {
    const {categoryQuery} = useCategories();
    const [currentFilter, setCurrentFilter] = useState<string>("");

    if (categoryQuery.isLoading) {
        return <div>Loading...</div>;
    }
    if (categoryQuery.isError) {
        return <div>Error: {(categoryQuery.error as Error).message}</div>;
    }

  return (
    <div className="selling-products">
        <div className="selling-products-container">
            <div className="text-center m-8">
                <h1 className="selling-products-title">- Best Selling Products -</h1>
            </div>
            <FilterCategories currentFilter={currentFilter} setCurrentFilter={setCurrentFilter} />
            <ProductList currentFilter={currentFilter} />
        </div>
    </div>
  )
}

export default SellingProducts