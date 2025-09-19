import { FaCartPlus, FaHeart, FaSearchPlus } from "react-icons/fa";
import useProducts from "../../hooks/useProducts";
import { useState } from "react";

type Props = {
    currentFilter: string
}

function ProductList({ currentFilter }: Props) {
    const { productQuery } = useProducts(currentFilter);
    const [hoveredProduct, setHoveredProduct] = useState<string | null>(null);
    const [clickedProduct, setClickedProduct] = useState<string | null>(null);

    const product4 = productQuery.data?.slice(0, 4);

    if (productQuery.isLoading) {
        return (
            <div className="products-loading">
                <div className="loading-spinner"></div>
                <p>Loading delicious products...</p>
            </div>
        );
    }

    if (productQuery.isError) {
        return (
            <div className="products-error">
                <div className="error-icon">⚠️</div>
                <h3>Oops! Something went wrong</h3>
                <p>Error: {(productQuery.error as Error).message}</p>
                <button className="retry-btn" onClick={() => productQuery.refetch()}>
                    Try Again
                </button>
            </div>
        );
    }

    return (
        <div>
                <div className="products-list">
                    {product4?.map((product) => {
                        const isHovered = hoveredProduct === product.id;
                        const isClicked = clickedProduct === product.id;

                        return (
                            <div
                                key={product.id}
                                className={`product-card ${isClicked ? "clicked" : ""}`}
                                onMouseEnter={() => setHoveredProduct(product.id)}
                                onMouseLeave={() => setHoveredProduct(null)}
                                onClick={() =>
                                    setClickedProduct(
                                        clickedProduct === product.id ? null : product.id
                                    )
                                }
                            >
                                <div className="product-image-container">
                                    <img 
                                        src={product.imageUrl} 
                                        alt={product.name} 
                                        className={isClicked ? "zoomed" : ""}
                                    />

                                    {isClicked && (
                                        <div className="product-overlay active">
                                            <h3 className="product-name">{product.name}</h3>
                                            <button className="order-now-btn">
                                                Order Now
                                                <span className="btn-arrow">→</span>
                                            </button>
                                        </div>
                                    )}

                                    {isHovered && !isClicked && (
                                        <div className="hover-icons">
                                            <button className="icon-btn"><FaCartPlus /></button>
                                            <button className="icon-btn"><FaHeart /></button>
                                            <button className="icon-btn"><FaSearchPlus /></button>
                                        </div>
                                    )}
                                </div>

                                <div className={`product-info ${isClicked ? "hidden" : ""}`}>
                                    <p className="product-description">
                                        {product.description.substring(0, 50)}...
                                    </p>
                                    <div className="product-pricing">
                                        <div className="price-container">
                                            <span className="current-price">${product.price}</span>
                                            {product.oldPrice && (
                                                <span className="old-price">${product.oldPrice}</span>
                                            )}
                                        </div>
                                        <span className="product-weight">{product.weight || "500g"}</span>
                                    </div>
                                </div>
                            </div>
                        );
                    })}
                </div>
            
        </div>
    );
}

export default ProductList;