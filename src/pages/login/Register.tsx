import {
  FaArrowRight,
  FaEnvelope,
  FaEye,
  FaEyeSlash,
  FaLock,
  FaUser,
  FaUtensils,
  FaArrowLeft,
} from "react-icons/fa";
import { type SubmitHandler, useForm } from "react-hook-form";
import { toast } from "react-toastify";
import { useNavigate, Link } from "react-router-dom";
import { useState } from "react";
import { isAxiosError } from "axios";
import apiClient from "../../apiClient/apiClient";

type RegisterFormInputs = {
  name: string;
  email: string;
  password: string;
  confirmPassword: string;
};

type CreateUserResponse = {
  id: string;
  name: string;
  email: string;
  roles: string[];
  created_at: string;
};

function Register() {
  const {
    register,
    handleSubmit,
    watch,
    formState: { errors, isSubmitting },
    reset,
  } = useForm<RegisterFormInputs>();

  const navigate = useNavigate();

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);

  const password = watch("password", "");

  const onSubmit: SubmitHandler<RegisterFormInputs> = async (data) => {
    const { name, email, password, confirmPassword } = data;

    if (password !== confirmPassword) {
      toast.error("Passwords do not match.");
      return;
    }

    try {
      await apiClient.post<CreateUserResponse>("/users/", {
        name,
        email,
        password,
      });

      toast.success("🎉 Registration successful!");
      reset();
      navigate("/login");
    } catch (error: unknown) {
      const status = isAxiosError(error) ? error.response?.status : undefined;
      const message = isAxiosError(error)
        ? error.response?.data?.message ||
          error.response?.data?.error ||
          "Registration failed. Please try again."
        : "Registration failed. Please try again.";

      if (status === 409) {
        toast.error("📧 Email is already registered.");
      } else if (status === 400) {
        toast.error(message);
      } else {
        toast.error(message);
      }
    }
  };

  const registerImageUrl =
    "https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80";

  return (
    <div className="container-fluid p-0 vh-100">
      <div className="row g-0 h-100 position-relative">
        {/* Diagonal cut background container */}
        <div className="position-absolute top-0 start-0 w-100 h-100 d-none d-lg-block">
          {/* Left red background for diagonal effect */}
          <div
            className="position-absolute top-0 start-0 w-60 h-100"
            style={{
              clipPath: "polygon(0 0, 100% 0, 80% 100%, 0 100%)",
              background:
                "linear-gradient(135deg, rgba(226, 26, 67, 0.03) 0%, rgba(255, 107, 157, 0.01) 100%)",
              zIndex: 1,
            }}
          ></div>
        </div>

        {/* Left side with image */}
        <div
          className="col-lg-6 d-none d-lg-block position-relative"
          style={{
            clipPath: "polygon(0 0, 100% 0, 80% 100%, 0 100%)",
            overflow: "hidden",
          }}
        >
          {/* Animated background effect */}
          <div
            className="position-absolute top-0 start-0 w-100 h-100"
            style={{
              background:
                "linear-gradient(45deg, rgba(226, 26, 67, 0.1) 0%, transparent 50%, rgba(255, 107, 157, 0.05) 100%)",
              animation: "diagonalShimmer 8s ease-in-out infinite",
              zIndex: 0,
            }}
          ></div>

          <div
            className="h-100 position-relative"
            style={{
              backgroundImage: `url(${registerImageUrl})`,
              backgroundSize: "cover",
              backgroundPosition: "center",
              backgroundRepeat: "no-repeat",
            }}
          >
            {/* Animated gradient overlay */}
            <div
              className="position-absolute top-0 start-0 w-100 h-100"
              style={{
                background:
                  "linear-gradient(135deg, rgba(226, 26, 67, 0.5) 0%, rgba(255, 107, 157, 0.3) 100%)",
                animation: "gradientShift 10s ease-in-out infinite alternate",
              }}
            ></div>

            {/* Content on the image */}
            <div
              className="position-relative z-1 h-100 d-flex flex-column justify-content-center align-items-center text-white p-5"
              style={{ animation: "fadeInUp 1s ease-out" }}
            >
              <div
                className="d-flex flex-column align-items-center mb-5"
                style={{ animation: "fadeInUp 1s ease-out 0.3s both" }}
              >
                <div
                  className="mb-4"
                  style={{ animation: "bounceIn 1s ease-out" }}
                >
                  <FaUtensils
                    style={{
                      fontSize: "5rem",
                      color: "#FFF",
                      filter: "drop-shadow(0 4px 8px rgba(0,0,0,0.2))",
                    }}
                  />
                </div>
                <h1
                  className="display-4 fw-bold mb-3"
                  style={{
                    textShadow: "0 2px 10px rgba(0,0,0,0.3)",
                    animation: "slideInLeft 1s ease-out 0.5s both",
                  }}
                >
                  Join Our Community
                </h1>
                <p
                  className="lead fs-3 opacity-90"
                  style={{
                    animation: "slideInRight 1s ease-out 0.7s both",
                    textShadow: "0 1px 4px rgba(0,0,0,0.2)",
                  }}
                >
                  Start your culinary journey with us
                </p>
              </div>

              <div
                className="mt-5 pt-4 text-center position-relative"
                style={{
                  animation: "fadeInUp 1s ease-out 1.2s both",
                }}
              >
                <div className="position-relative">
                  <div
                    className="position-absolute top-50 start-0 w-100"
                    style={{
                      height: "2px",
                      background:
                        "linear-gradient(90deg, transparent, rgba(255,255,255,0.5), transparent)",
                      transform: "translateY(-1px)",
                    }}
                  ></div>
                  <p
                    className="fs-5 fst-italic position-relative px-5"
                    style={{
                      backgroundColor: "rgba(0,0,0,0.2)",
                      backdropFilter: "blur(10px)",
                      padding: "1rem 2rem",
                      borderRadius: "12px",
                      border: "1px solid rgba(255,255,255,0.1)",
                    }}
                  >
                    "Cooking is like love. It should be <br /> entered into with
                    abandon or not at all."
                  </p>
                  <p className="fs-5 opacity-85 mt-3">– Harriet Van Horne</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Right side with registration form */}
        <div
          className="col-lg-6 d-flex align-items-center justify-content-center bg-light position-relative"
          style={{
            clipPath: "polygon(12% 0, 100% 0, 100% 100%, 0 100%)",
            marginLeft: 0,
            overflow: "hidden",
          }}
        >
          {/* Decorative diagonal line */}
          <div
            className="position-absolute top-0 start-0 w-2 h-100 d-none d-lg-block"
            style={{
              background: "linear-gradient(to bottom, #E21A43, #FF6B9D)",
              width: "4px",
              boxShadow: "2px 0 10px rgba(226, 26, 67, 0.3)",
            }}
          ></div>

          <div
            className="w-100 mt-5 mb-5 position-relative z-2"
            style={{ maxWidth: "480px", marginLeft: "20%" }}
          >
            <div
              className="text-center mb-5 d-none d-lg-block"
              style={{ animation: "fadeInUp 1s ease-out" }}
            >
              <h2
                className="fw-bold mb-1"
                style={{
                  color: "#E21A43",
                  fontSize: "2.5rem",
                  animation: "slideInRight 1s ease-out 0.3s both",
                }}
              >
                Welcome Back
              </h2>
              <p
                className="text-muted fs-5"
                style={{ animation: "slideInRight 1s ease-out 0.5s both" }}
              >
                Sign in to your account to continue
              </p>
            </div>

            <form
              onSubmit={handleSubmit(onSubmit)}
              style={{ animation: "fadeInUp 1s ease-out 0.9s both" }}
            >
              {/* Name */}
              <div className="mb-4">
                <label
                  htmlFor="name"
                  className="form-label fw-semibold mb-3"
                  style={{ color: "#333", fontSize: "1rem" }}
                >
                  Full Name
                </label>
                <div className="input-group input-group-lg">
                  <span
                    className="input-group-text bg-white"
                    style={{
                      borderRight: "none",
                      borderColor: "rgba(226, 26, 67, 0.2)",
                      borderTopLeftRadius: "10px",
                      borderBottomLeftRadius: "10px",
                      padding: "0.75rem 1rem",
                      transition: "all 0.3s ease",
                    }}
                  >
                    <FaUser style={{ color: "#E21A43" }} />
                  </span>
                  <input
                    {...register("name", { required: true })}
                    type="text"
                    className="form-control"
                    id="name"
                    placeholder="John Doe"
                    style={{
                      borderLeft: "none",
                      borderColor: "rgba(226, 26, 67, 0.2)",
                      boxShadow: "none",
                      borderTopRightRadius: "10px",
                      borderBottomRightRadius: "10px",
                      padding: "0.75rem 1rem",
                      fontSize: "1rem",
                      transition: "all 0.3s ease",
                    }}
                    onFocus={(e) => {
                      e.target.style.borderColor = "rgba(226, 26, 67, 0.5)";
                      e.target.style.boxShadow =
                        "0 0 0 3px rgba(226, 26, 67, 0.1)";
                    }}
                    onBlur={(e) => {
                      e.target.style.borderColor = "rgba(226, 26, 67, 0.2)";
                      e.target.style.boxShadow = "none";
                    }}
                  />
                </div>
                {errors.name && (
                  <p className="text-danger mt-2 small">Name is required</p>
                )}
              </div>

              {/* Email */}
              <div className="mb-4">
                <label
                  htmlFor="email"
                  className="form-label fw-semibold mb-3"
                  style={{ color: "#333", fontSize: "1rem" }}
                >
                  Email Address
                </label>
                <div className="input-group input-group-lg">
                  <span
                    className="input-group-text bg-white"
                    style={{
                      borderRight: "none",
                      borderColor: "rgba(226, 26, 67, 0.2)",
                      borderTopLeftRadius: "10px",
                      borderBottomLeftRadius: "10px",
                      padding: "0.75rem 1rem",
                      transition: "all 0.3s ease",
                    }}
                  >
                    <FaEnvelope style={{ color: "#E21A43" }} />
                  </span>
                  <input
                    {...register("email", {
                      required: true,
                      pattern: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                    })}
                    type="email"
                    className="form-control"
                    id="email"
                    placeholder="your@email.com"
                    style={{
                      borderLeft: "none",
                      borderColor: "rgba(226, 26, 67, 0.2)",
                      boxShadow: "none",
                      borderTopRightRadius: "10px",
                      borderBottomRightRadius: "10px",
                      padding: "0.75rem 1rem",
                      fontSize: "1rem",
                      transition: "all 0.3s ease",
                    }}
                    onFocus={(e) => {
                      e.target.style.borderColor = "rgba(226, 26, 67, 0.5)";
                      e.target.style.boxShadow =
                        "0 0 0 3px rgba(226, 26, 67, 0.1)";
                    }}
                    onBlur={(e) => {
                      e.target.style.borderColor = "rgba(226, 26, 67, 0.2)";
                      e.target.style.boxShadow = "none";
                    }}
                  />
                </div>
                {errors.email && (
                  <p className="text-danger mt-2 small">
                    {errors.email.type === "required"
                      ? "Email is required"
                      : "Invalid email address"}
                  </p>
                )}
              </div>

              {/* Password */}
              <div className="mb-4">
                <div className="d-flex justify-content-between align-items-center mb-3">
                  <label
                    htmlFor="password"
                    className="form-label fw-semibold mb-0"
                    style={{ color: "#333", fontSize: "1rem" }}
                  >
                    Password
                  </label>
                  {password && (
                    <div className="d-flex gap-2">
                      {password.length >= 8 && (
                        <span
                          className="badge bg-success bg-opacity-10 text-success border border-success border-opacity-25"
                          style={{ fontSize: "0.7rem" }}
                        >
                          ✓ 8+ chars
                        </span>
                      )}
                      {/[A-Z]/.test(password) && /[a-z]/.test(password) && (
                        <span
                          className="badge bg-success bg-opacity-10 text-success border border-success border-opacity-25"
                          style={{ fontSize: "0.7rem" }}
                        >
                          ✓ Aa
                        </span>
                      )}
                      {/\d/.test(password) && (
                        <span
                          className="badge bg-success bg-opacity-10 text-success border border-success border-opacity-25"
                          style={{ fontSize: "0.7rem" }}
                        >
                          ✓ 123
                        </span>
                      )}
                    </div>
                  )}
                </div>
                <div className="input-group input-group-lg">
                  <span
                    className="input-group-text bg-white"
                    style={{
                      borderRight: "none",
                      borderColor: "rgba(226, 26, 67, 0.2)",
                      borderTopLeftRadius: "10px",
                      borderBottomLeftRadius: "10px",
                      padding: "0.75rem 1rem",
                      transition: "all 0.3s ease",
                    }}
                  >
                    <FaLock style={{ color: "#E21A43" }} />
                  </span>
                  <input
                    {...register("password", {
                      required: true,
                      minLength: 8,
                      validate: {
                        hasUpper: (value) => /[A-Z]/.test(value),
                        hasLower: (value) => /[a-z]/.test(value),
                        hasNumber: (value) => /\d/.test(value),
                      },
                    })}
                    type={showPassword ? "text" : "password"}
                    className="form-control"
                    id="password"
                    placeholder="Create a strong password"
                    style={{
                      borderLeft: "none",
                      borderRight: "none",
                      borderColor: "rgba(226, 26, 67, 0.2)",
                      boxShadow: "none",
                      padding: "0.75rem 1rem",
                      fontSize: "1rem",
                      transition: "all 0.3s ease",
                    }}
                    onFocus={(e) => {
                      e.target.style.borderColor = "rgba(226, 26, 67, 0.5)";
                      e.target.style.boxShadow =
                        "0 0 0 3px rgba(226, 26, 67, 0.1)";
                    }}
                    onBlur={(e) => {
                      e.target.style.borderColor = "rgba(226, 26, 67, 0.2)";
                      e.target.style.boxShadow = "none";
                    }}
                  />
                  <span
                    className="input-group-text bg-white"
                    style={{
                      cursor: "pointer",
                      borderLeft: "none",
                      borderColor: "rgba(226, 26, 67, 0.2)",
                      borderTopRightRadius: "10px",
                      borderBottomRightRadius: "10px",
                      padding: "0.75rem 1rem",
                      transition: "all 0.3s ease",
                    }}
                    onClick={() => setShowPassword(!showPassword)}
                    onMouseOver={(e) => {
                      e.currentTarget.style.backgroundColor =
                        "rgba(226, 26, 67, 0.05)";
                      e.currentTarget.style.borderColor =
                        "rgba(226, 26, 67, 0.5)";
                    }}
                    onMouseOut={(e) => {
                      e.currentTarget.style.backgroundColor = "#fff";
                      e.currentTarget.style.borderColor =
                        "rgba(226, 26, 67, 0.2)";
                    }}
                  >
                    {showPassword ? (
                      <FaEyeSlash style={{ color: "#E21A43" }} />
                    ) : (
                      <FaEye style={{ color: "#E21A43" }} />
                    )}
                  </span>
                </div>
                {errors.password && (
                  <p className="text-danger mt-2 small">
                    Password must be at least 8 characters with uppercase,
                    lowercase, and number
                  </p>
                )}

                {/* Password strength indicator */}
                {password && (
                  <div className="mt-2">
                    <div className="progress" style={{ height: "4px" }}>
                      <div
                        className="progress-bar"
                        style={{
                          width: `${Math.min(password.length * 10, 100)}%`,
                          backgroundColor:
                            password.length >= 8 ? "#28a745" : "#ffc107",
                        }}
                      ></div>
                    </div>
                  </div>
                )}
              </div>

              {/* Confirm Password */}
              <div className="mb-4">
                <label
                  htmlFor="confirm-password"
                  className="form-label fw-semibold mb-3"
                  style={{ color: "#333", fontSize: "1rem" }}
                >
                  Confirm Password
                </label>
                <div className="input-group input-group-lg">
                  <span
                    className="input-group-text bg-white"
                    style={{
                      borderRight: "none",
                      borderColor: "rgba(226, 26, 67, 0.2)",
                      borderTopLeftRadius: "10px",
                      borderBottomLeftRadius: "10px",
                      padding: "0.75rem 1rem",
                      transition: "all 0.3s ease",
                    }}
                  >
                    <FaLock style={{ color: "#E21A43" }} />
                  </span>
                  <input
                    {...register("confirmPassword", {
                      required: true,
                      validate: (value) =>
                        value === password || "Passwords do not match",
                    })}
                    type={showConfirm ? "text" : "password"}
                    className="form-control"
                    id="confirm-password"
                    placeholder="Confirm your password"
                    style={{
                      borderLeft: "none",
                      borderRight: "none",
                      borderColor: "rgba(226, 26, 67, 0.2)",
                      boxShadow: "none",
                      padding: "0.75rem 1rem",
                      fontSize: "1rem",
                      transition: "all 0.3s ease",
                    }}
                    onFocus={(e) => {
                      e.target.style.borderColor = "rgba(226, 26, 67, 0.5)";
                      e.target.style.boxShadow =
                        "0 0 0 3px rgba(226, 26, 67, 0.1)";
                    }}
                    onBlur={(e) => {
                      e.target.style.borderColor = "rgba(226, 26, 67, 0.2)";
                      e.target.style.boxShadow = "none";
                    }}
                  />
                  <span
                    className="input-group-text bg-white"
                    style={{
                      cursor: "pointer",
                      borderLeft: "none",
                      borderColor: "rgba(226, 26, 67, 0.2)",
                      borderTopRightRadius: "10px",
                      borderBottomRightRadius: "10px",
                      padding: "0.75rem 1rem",
                      transition: "all 0.3s ease",
                    }}
                    onClick={() => setShowConfirm(!showConfirm)}
                    onMouseOver={(e) => {
                      e.currentTarget.style.backgroundColor =
                        "rgba(226, 26, 67, 0.05)";
                      e.currentTarget.style.borderColor =
                        "rgba(226, 26, 67, 0.5)";
                    }}
                    onMouseOut={(e) => {
                      e.currentTarget.style.backgroundColor = "#fff";
                      e.currentTarget.style.borderColor =
                        "rgba(226, 26, 67, 0.2)";
                    }}
                  >
                    {showConfirm ? (
                      <FaEyeSlash style={{ color: "#E21A43" }} />
                    ) : (
                      <FaEye style={{ color: "#E21A43" }} />
                    )}
                  </span>
                </div>
                {errors.confirmPassword && (
                  <p className="text-danger mt-2 small">
                    {errors.confirmPassword.message}
                  </p>
                )}
              </div>

              <button
                disabled={isSubmitting}
                type="submit"
                className="btn w-100 py-3 fw-bold d-flex align-items-center justify-content-center gap-2 mt-4 position-relative overflow-hidden"
                style={{
                  background:
                    "linear-gradient(135deg, #E21A43 0%, #FF6B9D 100%)",
                  color: "white",
                  borderRadius: "10px",
                  border: "none",
                  boxShadow: "0 4px 15px rgba(226, 26, 67, 0.3)",
                  transition: "all 0.4s ease",
                  fontSize: "1.1rem",
                  position: "relative",
                  zIndex: 1,
                  animation: "pulse 2s infinite",
                }}
                onMouseOver={(e) => {
                  e.currentTarget.style.boxShadow =
                    "0 6px 25px rgba(226, 26, 67, 0.5)";
                  e.currentTarget.style.transform =
                    "translateY(-3px) scale(1.02)";
                }}
                onMouseOut={(e) => {
                  e.currentTarget.style.boxShadow =
                    "0 4px 15px rgba(226, 26, 67, 0.3)";
                  e.currentTarget.style.transform = "translateY(0) scale(1)";
                }}
              >
                {/* Button shine effect */}
                <div className="position-absolute top-0 start-0 w-full h-full overflow-hidden">
                  <div className="shine-effect"></div>
                </div>

                {isSubmitting ? (
                  <>
                    <span>Creating Account...</span>
                    <div
                      className="spinner-border spinner-border-sm text-light"
                      role="status"
                    ></div>
                  </>
                ) : (
                  <>
                    <span>Create Account</span>
                    <FaArrowRight />
                  </>
                )}
              </button>

              <div
                className="text-center mt-5 pt-4"
                style={{
                  borderTop: "1px solid rgba(226, 26, 67, 0.1)",
                  animation: "fadeInUp 1s ease-out 1.1s both",
                }}
              >
                <p className="text-muted mb-3">
                  Already have an account?{" "}
                  <Link
                    to="/login"
                    className="fw-semibold position-relative d-inline-flex align-items-center gap-1"
                    style={{
                      color: "#E21A43",
                      textDecoration: "none",
                      transition: "all 0.3s ease",
                    }}
                    onMouseOver={(e) => {
                      e.currentTarget.style.textDecoration = "underline";
                      e.currentTarget.style.letterSpacing = "0.5px";
                    }}
                    onMouseOut={(e) => {
                      e.currentTarget.style.textDecoration = "none";
                      e.currentTarget.style.letterSpacing = "normal";
                    }}
                  >
                    <FaArrowLeft style={{ fontSize: "0.8rem" }} />
                    Back to Login
                  </Link>
                </p>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Register;
