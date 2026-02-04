import { useState } from "react";
import { LazyLoadImage } from "react-lazy-load-image-component";
import "react-lazy-load-image-component/src/effects/blur.css";
import type { Product } from "../../types/types";
import useContextPro from "../../hooks/useContextPro";
import { useNavigate } from "react-router-dom";
import { API_ORIGIN } from "../../utils";

type Props = {
  products: Product[];
  loading?: boolean;
};

function ProductList({ products, loading }: Props) {
  const {
    state: { cart },
    dispatch,
  } = useContextPro();

  const [hoveredProduct, setHoveredProduct] = useState<string | null>(null);
  const navigate = useNavigate();
  
  function handleCartToggle(product: Product) {
    const isInCart = cart.some((p: Product) => p.id === product.id);
    dispatch({
      type: isInCart ? "REMOVE_FROM_CART" : "ADD_TO_CART",
      payload: isInCart ? product.id : product,
    });
  }

  if (loading) {
    return (
      <div className="products-loading">
        <div className="loading-spinner"></div>
      </div>
    );
  }

  return (
    <div className="products-list">
      {products.map((product) => {
        const isHovered = hoveredProduct === product.id;

        return (
          <div
            key={product.id}
            className="product-card"
            onMouseEnter={() => setHoveredProduct(product.id)}
            onMouseLeave={() => setHoveredProduct(null)}
            onClick={(e) => {
              e.stopPropagation();
              navigate(`/shop/${product.id}`);
            }}
          >
            <div className="product-image-container">
              <LazyLoadImage
                src={`${API_ORIGIN}${product.image}`}
                alt={product.name}
                effect="blur"
                loading="lazy"
                wrapperClassName="product-img-wrap"
              />

              {/* <img src={`${API_ORIGIN}${product.image}`} alt={product.name} /> */}

              {isHovered && (
                <div className="product-overlay active">
                  <h3 className="product-name">{product.name}</h3>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      handleCartToggle(product);
                    }}
                    className="order-now-btn"
                  >
                    {cart.some((p: Product) => p.id === product.id)
                      ? "Delete Order"
                      : "Order Now"}
                  </button>
                </div>
              )}
            </div>

            <div className="product-info">
              <p className="product-description">{product.description}...</p>
              <div className="product-pricing">
                <div className="price-container">
                  <span className="current-price">${product.price}</span>
                  <span className="old-price">${product.price * 1.5}</span>
                </div>
                <span className="product-weight">
                  {product.weight || "500g"}
                </span>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}

export default ProductList;
