import { Controller, useForm } from "react-hook-form";
import { Rating } from "@mui/material";
import useContextPro from "../hooks/useContextPro";
import useProducts from "../hooks/useProducts";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";

interface ReviewFormData {
  title: string;
  rating: number;
}

function ReviewForm({ productId }: { productId: string }) {
  const { state: { user } } = useContextPro();

  const { addReview, isAddingReview } = useProducts();

  const navigate = useNavigate();

  const { control, register, handleSubmit, reset, formState: { errors }, watch } =
    useForm<ReviewFormData>({
      defaultValues: { rating: 0, title: "" },
    });

  const ratingValue = watch("rating");

  const onSubmit = async (data: ReviewFormData) => {
    if (!user) return;

    try {
      await addReview(productId, {
        title: data.title,
        rating: Number(data.rating),
      });

      toast.success("Review submitted successfully");
      reset();
    } catch (err) {
      toast.error("Failed to submit review");
      console.error(err);
    }
  };

  if (!user) {
    return (
      <div className="review-login-prompt">
        <div className="login-prompt-content">
          <div className="login-icon">🔒</div>
          <h3>Sign In to Leave a Review</h3>
          <p>Please sign in to share your experience with this product</p>
          <button onClick={() => navigate("/login")} className="login-btn">Sign In</button>
        </div>
      </div>
    );
  }

  return (
    <div className="review-form-section">
      <div className="review-form-header">
        <h2>Write a Review</h2>
        <p>Share your thoughts with other customers</p>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="review-form">
        <div className="form-group">
          <label className="form-label">Overall Rating *</label>

          <div className="rating-selector">
            <Controller
              control={control}
              name="rating"
              rules={{
                required: "Rating is required",
                min: { value: 1, message: "Please select at least 1 star" },
              }}
              render={({ field }) => (
                <Rating
                  {...field}
                  value={Number(field.value)}
                  onChange={(_, value) => field.onChange(value || 0)}
                  size="large"
                  className="rating-stars"
                />
              )}
            />

            <span className="rating-text">
              {ratingValue ? `${ratingValue}/5` : "Select rating"}
            </span>
          </div>

          {errors.rating && <span className="error-message">{errors.rating.message}</span>}
        </div>

        <div className="form-group">
          <label htmlFor="title" className="form-label">Review Content *</label>
          <textarea
            id="title"
            placeholder="Share details of your experience..."
            rows={6}
            className={`form-textarea ${errors.title ? "error" : ""}`}
            {...register("title", {
              required: "Review content is required",
              minLength: { value: 10, message: "Review must be at least 10 characters" },
              maxLength: { value: 1000, message: "Review must be less than 1000 characters" },
            })}
          />
          {errors.title && <span className="error-message">{errors.title.message}</span>}
        </div>

        <div className="form-actions">
          <button
            type="button"
            onClick={() => reset()}
            className="cancel-btn"
            disabled={isAddingReview}
          >
            Cancel
          </button>

          <button type="submit" className="submit-btn" disabled={isAddingReview}>
            {isAddingReview ? (
              <>
                <div className="spinner"></div>
                Submitting...
              </>
            ) : (
              "Submit Review"
            )}
          </button>
        </div>
      </form>
    </div>
  );
}

export default ReviewForm;