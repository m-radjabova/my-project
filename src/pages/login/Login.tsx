import {
  FaEnvelope,
  FaLock,
  FaArrowRight,
  FaUtensils,
  FaEyeSlash,
  FaEye,
} from "react-icons/fa";
import { NavLink, useNavigate } from "react-router-dom";
import { type FieldValues, useForm } from "react-hook-form";
import { toast } from "react-toastify";
import { useState } from "react";
import apiClient from "../../apiClient/apiClient";
import type { User } from "../../types/types";
import useContextPro from "../../hooks/useContextPro";

type LoginResponse = {
  access_token: string;
  refresh_token: string;
  token_type: "bearer" | string;
};

const LoginForm = () => {
  const { dispatch } = useContextPro();
  const {
    register,
    handleSubmit,
    formState: { isSubmitting },
  } = useForm();
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);

  const Login = async (data: FieldValues) => {
    try {
      const res = await apiClient.post<LoginResponse>("/auth/login", {
        email: data.email,
        password: data.password,
      });

      localStorage.setItem("accessToken", res.data.access_token);
      localStorage.setItem("refreshToken", res.data.refresh_token);

      const me = await apiClient.get<User>("/users/me");
      const currentUser = me.data;

      dispatch({ type: "SET_USER", payload: currentUser });

      if (currentUser?.roles?.length) {
        localStorage.setItem("role", currentUser.roles.join(","));
      } else {
        localStorage.removeItem("role");
      }

      toast.success("Welcome back!");
      navigate("/", { replace: true });
    } catch (error : any) {
      const status = error?.response?.status;
      const message =
        error?.response?.data?.message ||
        error?.response?.data?.error ||
        "Kirishda xatolik yuz berdi. Qayta urinib ko‘ring.";

      if (status === 401) {
        toast.error("Email yoki parol noto‘g‘ri.");
      } else if (status === 404) {
        toast.error("Account topilmadi. Ro‘yxatdan o‘ting.");
      } else if (status === 429) {
        toast.error("Juda ko‘p urinish. Birozdan keyin qayta urinib ko‘ring.");
      } else {
        toast.error(message);
      }
    }
  };

  const loginImageUrl =
    "https://images.unsplash.com/photo-1490818387583-1baba5e638af?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80";

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
              backgroundImage: `url(${loginImageUrl})`,
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
                  Perfect Breakfast
                </h1>
                <p
                  className="lead fs-3 opacity-90"
                  style={{
                    animation: "slideInRight 1s ease-out 0.7s both",
                    textShadow: "0 1px 4px rgba(0,0,0,0.2)",
                  }}
                >
                  Start your day with the perfect meal
                </p>
              </div>

              <div
                className="mt-5 pt-5 text-center position-relative"
                style={{
                  animation: "fadeInUp 1s ease-out 1s both",
                  maxWidth: "600px",
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
                    className="fs-4 fst-italic position-relative px-4"
                    style={{
                      backgroundColor: "rgba(0,0,0,0.2)",
                      backdropFilter: "blur(10px)",
                      padding: "1rem 2rem",
                      borderRadius: "12px",
                      border: "1px solid rgba(255,255,255,0.1)",
                    }}
                  >
                    "Good food is the foundation of genuine happiness."
                  </p>
                  <p className="fs-5 opacity-85 mt-3">- Auguste Escoffier</p>
                </div>

                {/* Animated floating elements */}
                <div
                  className="position-absolute top-0 start-0 w-100 h-100"
                  style={{ pointerEvents: "none", overflow: "hidden" }}
                >
                  {[...Array(5)].map((_, i) => (
                    <div
                      key={i}
                      className="position-absolute rounded-circle"
                      style={{
                        width: `${Math.random() * 60 + 20}px`,
                        height: `${Math.random() * 60 + 20}px`,
                        background: `rgba(255, 255, 255, ${Math.random() * 0.1 + 0.05})`,
                        top: `${Math.random() * 100}%`,
                        left: `${Math.random() * 100}%`,
                        animation: `float ${Math.random() * 10 + 10}s ease-in-out infinite`,
                        animationDelay: `${Math.random() * 5}s`,
                      }}
                    ></div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Right side with login form */}
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
            className="w-100 px-4 px-md-5 position-relative z-2"
            style={{ maxWidth: "480px", marginLeft: "20%" }}
          >
            <div className="text-center mb-5 d-block d-lg-none">
              <div
                className="d-flex justify-content-center mb-3"
                style={{ animation: "bounceIn 1s ease-out" }}
              >
                <FaUtensils style={{ fontSize: "3rem", color: "#E21A43" }} />
              </div>
              <h1
                className="h2 fw-bold mb-2"
                style={{
                  color: "#E21A43",
                  animation: "fadeInUp 1s ease-out 0.3s both",
                }}
              >
                Perfect Breakfast
              </h1>
              <p
                className="text-muted"
                style={{ animation: "fadeInUp 1s ease-out 0.5s both" }}
              >
                Start your day with the perfect meal
              </p>
            </div>

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
              onSubmit={handleSubmit(Login)}
              style={{ animation: "fadeInUp 1s ease-out 0.7s both" }}
            >
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
                      borderColor: "rgba(226, 26, 67, 0.3)",
                      borderTopLeftRadius: "12px",
                      borderBottomLeftRadius: "12px",
                      padding: "0.75rem 1rem",
                      transition: "all 0.3s ease",
                    }}
                  >
                    <FaEnvelope style={{ color: "#E21A43" }} />
                  </span>
                  <input
                    type="email"
                    className="form-control"
                    id="email"
                    placeholder="your@email.com"
                    {...register("email", { required: true })}
                    style={{
                      borderLeft: "none",
                      borderColor: "rgba(226, 26, 67, 0.3)",
                      boxShadow: "none",
                      borderTopRightRadius: "12px",
                      borderBottomRightRadius: "12px",
                      padding: "0.75rem 1rem",
                      fontSize: "1rem",
                      transition: "all 0.3s ease",
                    }}
                    onFocus={(e) => {
                      e.target.style.borderColor = "rgba(226, 26, 67, 0.6)";
                      e.target.style.boxShadow =
                        "0 0 0 3px rgba(226, 26, 67, 0.1)";
                    }}
                    onBlur={(e) => {
                      e.target.style.borderColor = "rgba(226, 26, 67, 0.3)";
                      e.target.style.boxShadow = "none";
                    }}
                  />
                </div>
              </div>

              <div className="mb-4">
                <div className="d-flex justify-content-between align-items-center mb-3">
                  <label
                    htmlFor="password"
                    className="form-label fw-semibold mb-0"
                    style={{ color: "#333", fontSize: "1rem" }}
                  >
                    Password
                  </label>
                </div>
                <div className="input-group input-group-lg">
                  <span
                    className="input-group-text bg-white"
                    style={{
                      borderRight: "none",
                      borderColor: "rgba(226, 26, 67, 0.3)",
                      borderTopLeftRadius: "12px",
                      borderBottomLeftRadius: "12px",
                      padding: "0.75rem 1rem",
                      transition: "all 0.3s ease",
                    }}
                  >
                    <FaLock style={{ color: "#E21A43" }} />
                  </span>
                  <input
                    type={showPassword ? "text" : "password"}
                    className="form-control"
                    id="password"
                    placeholder="Enter your password"
                    {...register("password", { required: true })}
                    style={{
                      borderLeft: "none",
                      borderRight: "none",
                      borderColor: "rgba(226, 26, 67, 0.3)",
                      boxShadow: "none",
                      padding: "0.75rem 1rem",
                      fontSize: "1rem",
                      transition: "all 0.3s ease",
                    }}
                    onFocus={(e) => {
                      e.target.style.borderColor = "rgba(226, 26, 67, 0.6)";
                      e.target.style.boxShadow =
                        "0 0 0 3px rgba(226, 26, 67, 0.1)";
                    }}
                    onBlur={(e) => {
                      e.target.style.borderColor = "rgba(226, 26, 67, 0.3)";
                      e.target.style.boxShadow = "none";
                    }}
                  />
                  <span
                    className="input-group-text bg-white"
                    style={{
                      cursor: "pointer",
                      borderLeft: "none",
                      borderColor: "rgba(226, 26, 67, 0.3)",
                      borderTopRightRadius: "12px",
                      borderBottomRightRadius: "12px",
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
                        "rgba(226, 26, 67, 0.3)";
                    }}
                  >
                    {showPassword ? (
                      <FaEyeSlash style={{ color: "#E21A43" }} />
                    ) : (
                      <FaEye style={{ color: "#E21A43" }} />
                    )}
                  </span>
                </div>
              </div>

              <button
                disabled={isSubmitting}
                type="submit"
                className="btn w-100 py-3 fw-bold d-flex align-items-center justify-content-center gap-2 mt-4 position-relative overflow-hidden"
                style={{
                  background:
                    "linear-gradient(135deg, #E21A43 0%, #FF6B9D 100%)",
                  color: "white",
                  borderRadius: "12px",
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
                    <span>Signing in...</span>
                    <div
                      className="spinner-border spinner-border-sm text-light"
                      role="status"
                    ></div>
                  </>
                ) : (
                  <>
                    <span>Sign In</span>
                    <FaArrowRight />
                  </>
                )}
              </button>

              <div
                className="text-center mt-5 pt-4"
                style={{
                  borderTop: "1px solid rgba(226, 26, 67, 0.1)",
                  animation: "fadeInUp 1s ease-out 1s both",
                }}
              >
                <p className="text-muted mb-3">
                  Don't have an account?{" "}
                  <NavLink
                    to="/sign-up"
                    className="fw-semibold position-relative"
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
                    Create one
                    {/* Animated underline effect */}
                    <span
                      className="position-absolute bottom-0 start-0 w-0 h-0.5 bg-gradient-to-r from-[#E21A43] to-[#FF6B9D] transition-all duration-300"
                    ></span>
                  </NavLink>
                </p>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginForm;
