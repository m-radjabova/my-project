import { useParams } from "react-router-dom";
import useProducts from "../../hooks/useProducts";
import useCategories from "../../hooks/useCategories";
import { Rating } from "@mui/material";
import useContextPro from "../../hooks/useContextPro";
import type { Product } from "../../types/types";
import ReviewForm from "../ReviewForm";
import BestSelling from "../bestSelling/BestSelling";
import { useEffect } from "react";
import { API_ORIGIN, formatDateTime } from "../../utils";

function ProductDisplay() {
  const { id } = useParams();

  const {
    products,
    reviews,
    loadingProducts,
    setActiveProductId,
    loadingReviews,
  } = useProducts();

  const { categories, loading: loadingCategories } = useCategories();
  const {
    state: { cart },
    dispatch,
  } = useContextPro();

   useEffect(() => {
    if (id) setActiveProductId(id);
  }, [id, setActiveProductId]);

  const product = products.find((p) => p.id === id);

  const category = categories.find((c) => c.id === product?.category_id);

  const loading = loadingProducts || loadingReviews || loadingCategories;

  if (loading) {
    return (
      <div className="products-loading">
        <div className="loading-spinner"></div>
      </div>
    );
  }

  function handleCartToggle(product: Product) {
    const isInCart = cart.some((p: Product) => p.id === product.id);

    if (isInCart) {
      dispatch({ type: "REMOVE_FROM_CART", payload: product.id });
    } else {
      dispatch({ type: "ADD_TO_CART", payload: product });
    }
  }




  return (
    <div className="review-product-display">
      <div className="review-product-display-container">
        <div className="review-product-image-section">
          <img
            src={`${API_ORIGIN}${product?.image}`}
            alt={product?.name}
            className="review-product-image"
          />
        </div>

        <div className="review-product-info-section">
          <div className="review-category-badge">{category?.name}</div>
          <h1 className="review-product-title">{product?.name}</h1>
          <p className="review-product-description">{product?.description}</p>

          <div className="review-rating-section">
            <Rating value={product?.rating || 0} precision={0.5} readOnly />
            <span className="review-rating-text">
              {product?.rating?.toFixed(1) || "0.0"}/5
            </span>
          </div>

          <div className="review-price-section">
            <span className="review-current-price">${product?.price || 0}</span>
            <span className="review-old-price">
              ${(product?.price || 0) * 2}
            </span>
          </div>

          <button
            onClick={() => handleCartToggle(product!)}
            className="review-add-to-cart-btn"
          >
            {cart.some((p: Product) => p.id === product?.id)
              ? "Remove from Cart"
              : "Add to Cart"}
          </button>
        </div>
      </div>

      <div className="reviews-section">
        <div className="reviews-header">
          <h2>Customer Reviews</h2>
          <div className="reviews-stats">
            <span className="reviews-count">{reviews.length} reviews</span>
            <div className="average-rating">
              <Rating
                name="half-rating"
                value={product?.rating || 0}
                precision={0.5}
                readOnly
              />
              <span>{product?.rating?.toFixed(1) ?? "0.0"}</span>
            </div>
          </div>
        </div>

        <div className="reviews-grid">
          {reviews.map((review) => (
            <div key={review.id} className="review-card">
              <div className="review-header">
                <div className="reviewer-avatar">
                  {review.user?.name?.charAt(0) || "A"}
                </div>
                <div className="reviewer-info">
                  <h4 className="reviewer-name">{review.user?.name ?? "Anonymous"}</h4>
                  <div className="review-meta">
                    <Rating
                      name="half-rating"
                      value={review.rating}
                      precision={0.5}
                      readOnly
                    />
                    <span className="review-date">
                      {formatDateTime(review.created_at.toString())}
                    </span>
                  </div>
                </div>
              </div>

              <h3 className="review-title">{review.title}</h3>
            </div>
          ))}

          {reviews.length === 0 && (
            <div className="no-reviews">
              <div className="no-reviews-icon">💬</div>
              <h3>No Reviews Yet</h3>
              <p>Be the first to review this product!</p>
            </div>
          )}
        </div>

        <ReviewForm productId={product?.id || ""} />
      </div>

      <BestSelling />
    </div>
  );
}

export default ProductDisplay;