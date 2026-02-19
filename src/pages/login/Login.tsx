import { useState } from "react";
import { useForm, type FieldValues } from "react-hook-form";
import {
  FiMail,
  FiLock,
  FiEye,
  FiEyeOff,
  FiArrowRight,
  FiStar,
  FiZap,
} from "react-icons/fi";
import { FcGoogle } from "react-icons/fc";
import {
  FaRocket,
  FaShieldAlt,
  FaSmile,
  FaGraduationCap,
  FaChalkboardTeacher,
  FaBrain,
  FaGamepad,
  FaAward,
  FaStar,
} from "react-icons/fa";
import {
  GiPlanetCore,
  GiBrain,
  GiTrophy,
  GiBookshelf,
  GiAstronautHelmet,
} from "react-icons/gi";
import { HiOutlineAcademicCap } from "react-icons/hi";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { isAxiosError } from "axios";

import useContextPro from "../../hooks/useContextPro";
import apiClient from "../../apiClient/apiClient";
import type { User } from "../../types/types";
import { getErrorMessage } from "../../utils/error";
import { setTokens } from "../../utils/auth";

import { GoogleAuthProvider, signInWithPopup } from "firebase/auth";
import { auth } from "../../firebase";

import loginIllustration from "../../assets/hero.png";

type LoginResponse = {
  access_token: string;
  refresh_token: string;
  token_type: "bearer" | string;
};

function LoginForm() {
  const { dispatch } = useContextPro();
  const navigate = useNavigate();

  const [showPassword, setShowPassword] = useState(false);
  const [isGoogleLoading, setIsGoogleLoading] = useState(false);
  const [isFocused, setIsFocused] = useState({ email: false, password: false });
  const {
    handleSubmit,
    register,
    formState: { errors, isSubmitting },
  } = useForm();

  const completeAuth = async (accessToken: string, refreshToken?: string) => {
    setTokens(accessToken, refreshToken);

    const me = await apiClient.get<User>("/users/me");
    const currentUser = me.data;

    dispatch({ type: "SET_USER", payload: currentUser });

    if (currentUser?.roles?.length) {
      localStorage.setItem("role", currentUser.roles.join(","));
    } else {
      localStorage.removeItem("role");
    }

    navigate("/", { replace: true });
  };

  const onSubmit = async (data: FieldValues) => {
    try {
      const res = await apiClient.post<LoginResponse>("/auth/login", {
        email: data.email,
        password: data.password,
      });

      await completeAuth(res.data.access_token, res.data.refresh_token);

      toast.success("Xush kelibsiz! 🎉", {
        icon: <FaSmile className="text-[#ffd966]" />,
        style: {
          borderRadius: "20px",
          background: "linear-gradient(135deg, #d42d73, #b0134d)",
          color: "#fff",
          boxShadow: "0 10px 30px rgba(210, 45, 115, 0.3)",
        },
      });
    } catch (error: unknown) {
      const status = isAxiosError(error) ? error.response?.status : undefined;

      if (status === 401) {
        toast.error("Email yoki parol noto'g'ri", {
          style: {
            borderRadius: "20px",
            background: "#fee2e2",
            color: "#991b1b",
            border: "1px solid #fecaca",
          },
        });
      } else if (status === 404) {
        toast.error("Akkaunt topilmadi", {
          style: {
            borderRadius: "20px",
            background: "#fff3cd",
            color: "#856404",
            border: "1px solid #ffeeba",
          },
        });
      } else {
        toast.error(getErrorMessage(error));
      }
    }
  };

  const handleGoogleLogin = async () => {
    setIsGoogleLoading(true);
    try {
      const provider = new GoogleAuthProvider();
      const result = await signInWithPopup(auth, provider);
      const idToken = await result.user.getIdToken();

      const res = await apiClient.post<LoginResponse>("/auth/google", {
        id_token: idToken,
      });

      await completeAuth(res.data.access_token, res.data.refresh_token);

      toast.success("Google orqali kirdingiz!", {
        icon: <FcGoogle />,
        style: {
          borderRadius: "20px",
          background: "linear-gradient(135deg, #059669, #10b981)",
          color: "#fff",
          boxShadow: "0 10px 30px rgba(16, 185, 129, 0.3)",
        },
      });
    } catch (error: unknown) {
      toast.error(getErrorMessage(error));
    } finally {
      setIsGoogleLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 h-screen w-full overflow-hidden bg-gradient-to-br from-[#d42d73] via-[#c2185b] to-[#b0134d]">
      {/* Background Elements */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        {/* Floating educational icons */}
        <div className="absolute top-[5%] left-[2%]">
          <GiBookshelf className="text-7xl lg:text-8xl text-white/10 animate-float-slow" />
        </div>
        <div className="absolute top-[10%] right-[2%]">
          <HiOutlineAcademicCap className="text-8xl lg:text-9xl text-white/10 animate-float-delayed" />
        </div>
        <div className="absolute bottom-[15%] left-[3%]">
          <GiBrain className="text-7xl lg:text-8xl text-white/10 animate-float" />
        </div>
        <div className="absolute bottom-[10%] right-[2%]">
          <GiTrophy className="text-8xl lg:text-9xl text-[#ffd700]/20 animate-float-slow" />
        </div>
        <div className="absolute top-[20%] left-[15%]">
          <GiAstronautHelmet className="text-6xl text-white/10 animate-spin-slow" />
        </div>
        <div className="absolute bottom-[25%] left-[10%]">
          <FaStar className="text-5xl text-[#ffd966]/20 animate-pulse-slow" />
        </div>

        {/* Animated gradient orbs */}
        <div className="absolute top-1/4 left-1/4 w-64 h-64 bg-gradient-to-r from-[#ffd966]/20 to-[#ffb347]/20 rounded-full blur-3xl animate-pulse-slow" />
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-gradient-to-r from-[#d42d73]/20 to-[#b0134d]/20 rounded-full blur-3xl animate-pulse-slow animation-delay-2000" />

        {/* Orbital rings */}
        <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 opacity-20">
          <div className="relative w-[600px] lg:w-[1000px] h-[600px] lg:h-[1000px]">
            <div className="absolute inset-0 border-4 border-white/10 rounded-full animate-spin-slow" />
            <div className="absolute inset-24 lg:inset-32 border-2 border-white/15 rounded-full animate-spin-slow animation-delay-1000" />
            <div className="absolute inset-48 lg:inset-64 border border-white/20 rounded-full animate-spin-slow animation-delay-2000" />
          </div>
        </div>

        {/* Floating particles */}
        <div className="absolute top-[15%] left-[10%] w-1.5 h-1.5 bg-white/30 rounded-full animate-float-particle" />
        <div className="absolute top-[70%] right-[15%] w-2 h-2 bg-[#ffd966]/30 rounded-full animate-float-particle animation-delay-1000" />
        <div className="absolute bottom-[20%] left-[20%] w-1.5 h-1.5 bg-white/20 rounded-full animate-float-particle animation-delay-2000" />
        <div className="absolute top-[40%] right-[25%] w-1 h-1 bg-[#ffd966]/40 rounded-full animate-float-particle animation-delay-1500" />
        <div className="absolute bottom-[30%] left-[30%] w-1.5 h-1.5 bg-white/25 rounded-full animate-float-particle animation-delay-2500" />
      </div>

      {/* Main Content - Scrollable */}
      <div className="relative z-20 h-full w-full flex items-center justify-center px-4 lg:px-8 overflow-hidden">
        <div className="w-full max-w-7xl flex flex-col lg:flex-row items-center justify-center gap-8 lg:gap-12">
          {/* Left Side - Illustration & Content */}
          <div className="flex-1 max-w-lg lg:max-w-xl text-center lg:text-left">
            <div className="relative">
              {/* Floating badges */}
              <div className="absolute -top-8 -left-8 bg-white/10 backdrop-blur-lg rounded-2xl p-3 hidden lg:block hover:scale-110 transition-transform duration-300">
                <div className="flex items-center gap-2">
                  <FaGraduationCap className="text-2xl text-[#ffd966]" />
                  <div>
                    <p className="text-white text-xs font-bold">50K+</p>
                    <p className="text-white/60 text-xs">O'quvchilar</p>
                  </div>
                </div>
              </div>

              <div className="absolute -bottom-8 -right-8 bg-white/10 backdrop-blur-lg rounded-2xl p-3 hidden lg:block hover:scale-110 transition-transform duration-300">
                <div className="flex items-center gap-2">
                  <FaAward className="text-2xl text-[#ffd966]" />
                  <div>
                    <p className="text-white text-xs font-bold">4.9 ★</p>
                    <p className="text-white/60 text-xs">Reyting</p>
                  </div>
                </div>
              </div>

              <div className="absolute top-1/2 -right-12 bg-white/10 backdrop-blur-lg rounded-2xl p-2 hidden xl:block hover:scale-110 transition-transform duration-300">
                <FiZap className="text-xl text-[#ffd966]" />
              </div>

              {/* Main Illustration */}
              <div className="relative mb-4 lg:mb-0 group">
                <div className="absolute -inset-4 bg-gradient-to-r from-[#ffd966] to-[#ffb347] rounded-full blur-2xl opacity-30 group-hover:opacity-50 transition-opacity duration-700 animate-pulse-slow" />
                <img
                  src={loginIllustration}
                  alt="Learning illustration"
                  className="relative z-10 w-full max-w-[200px] lg:max-w-[300px] mx-auto lg:mx-0 object-contain drop-shadow-2xl transform group-hover:scale-105 transition-transform duration-500"
                />
              </div>

              {/* Text Content */}
              <div className="mt-2 lg:mt-4 space-y-2">
                <h1 className="font-bebas text-4xl lg:text-6xl text-white leading-tight">
                  BILIM OLISH
                  <span className="block text-transparent bg-clip-text bg-gradient-to-r from-[#ffd966] to-[#ffb347] animate-gradient-x">
                    QIZIQARLI BO'LSIN
                  </span>
                </h1>

                <p className="text-white/85 text-sm lg:text-base max-w-md mx-auto lg:mx-0">
                  Interaktiv mashg'ulotlar va qiziqarli o'yinlar orqali
                  o'rganish
                </p>

                {/* Features */}
                <div className="flex flex-wrap gap-2 justify-center lg:justify-start mt-3">
                  {[
                    { icon: FaGamepad, text: "O'yinlar" },
                    { icon: FaBrain, text: "Interaktiv" },
                    { icon: FaChalkboardTeacher, text: "Moslashuvchan" },
                    { icon: FiStar, text: "Premium" },
                  ].map((item, index) => (
                    <div
                      key={index}
                      className="flex items-center gap-1 bg-white/10 backdrop-blur-sm px-3 py-1.5 rounded-full hover:bg-white/20 transition-all duration-300 hover:scale-105 cursor-default"
                    >
                      <item.icon className="text-[#ffd966] text-xs" />
                      <span className="text-white text-xs">{item.text}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Right Side - Login Form */}
          <div className="flex-1 w-full max-w-lg lg:max-w-xl">
            <div className="group perspective-1000">
              
              {/* Main Card */}
              <div className="relative rounded-[30px] lg:rounded-[40px] bg-white/10 backdrop-blur-xl p-7 lg:p-10 shadow-2xl border border-white/20 overflow-hidden">
                {/* Animated background gradient */}
                <div className="absolute inset-0 bg-gradient-to-br from-white/5 to-transparent animate-gradient-xy" />

                {/* Inner glow */}
                <div className="absolute inset-0 rounded-[30px] lg:rounded-[40px] bg-[radial-gradient(circle_at_30%_20%,rgba(255,255,255,0.2),transparent_70%)]" />

                {/* Floating particles inside card */}
                <div className="absolute top-0 right-0 w-20 h-20 bg-gradient-to-br from-[#ffd966]/20 to-transparent rounded-full blur-xl animate-pulse-slow" />
                <div className="absolute bottom-0 left-0 w-32 h-32 bg-gradient-to-tr from-[#ffb347]/20 to-transparent rounded-full blur-xl animate-pulse-slow animation-delay-1000" />

                {/* Content */}
                <div className="relative">
                  {/* Logo and Title */}
                  <div className="text-center mb-4 lg:mb-6">
                    <div className="inline-flex items-center justify-center gap-1 mb-2">
                      <div className="relative group/icon">
                        <GiPlanetCore className="text-4xl lg:text-5xl text-[#ffd966] animate-spin-slow" />
                        <div className="absolute -top-1 -right-1 w-2 h-2 bg-[#ffd966] rounded-full animate-ping" />
                      </div>
                      <FaRocket className="text-3xl lg:text-4xl text-[#ffb347] animate-bounce-slow" />
                    </div>
                    <h2 className="font-bebas text-4xl lg:text-5xl text-white mb-1 tracking-wider">
                      KIRISH
                    </h2>
                    <p className="text-white/70 text-sm">Hisobingizga kiring</p>
                  </div>

                  {/* Login Form */}
                  <form
                    onSubmit={handleSubmit(onSubmit)}
                    className="space-y-3 lg:space-y-4"
                  >
                    {/* Email Field */}
                    <div className="space-y-1.5">
                      <label className="block text-sm font-semibold text-white/90">
                        Email
                      </label>
                      <div
                        className={`relative group/input transition-all duration-300 ${
                          isFocused.email ? "translate-y-[-1px]" : ""
                        }`}
                      >
                        <div
                          className={`absolute -inset-[2px] rounded-xl bg-gradient-to-r from-[#ffd966] to-[#ffb347] transition-opacity duration-300 ${
                            isFocused.email ? "opacity-100" : "opacity-0"
                          }`}
                        />
                        <div className="relative flex items-center">
                          <FiMail
                            className={`absolute left-3 text-sm transition-colors ${
                              isFocused.email
                                ? "text-[#b0134d]"
                                : "text-[#7b8794]"
                            }`}
                          />
                          <input
                            type="email"
                            {...register("email", {
                              required: "Email talab qilinadi",
                              pattern: {
                                value:
                                  /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                                message: "Noto'g'ri email format",
                              },
                            })}
                            onFocus={() =>
                              setIsFocused((prev) => ({ ...prev, email: true }))
                            }
                            onBlur={() =>
                              setIsFocused((prev) => ({
                                ...prev,
                                email: false,
                              }))
                            }
                            autoComplete="email"
                            className="w-full rounded-xl border border-white/35 bg-white/85 pl-10 pr-3 py-3.5 text-base font-medium text-[#1f2937] placeholder:text-[#7b8794] focus:outline-none focus:border-transparent focus:ring-0 transition-all"
                            placeholder="siz@email.com"
                          />
                        </div>
                      </div>
                      {errors.email && (
                        <p className="text-xs text-red-400 animate-shake">
                          {errors.email.message as string}
                        </p>
                      )}
                    </div>

                    {/* Password Field */}
                    <div className="space-y-1.5">
                      <label className="block text-sm font-semibold text-white/90">
                        Parol
                      </label>
                      <div
                        className={`relative group/input transition-all duration-300 ${
                          isFocused.password ? "translate-y-[-1px]" : ""
                        }`}
                      >
                        <div
                          className={`pointer-events-none absolute -inset-[2px] rounded-xl bg-gradient-to-r from-[#ffd966] to-[#ffb347] transition-opacity duration-300 ${
                            isFocused.password ? "opacity-100" : "opacity-0"
                          }`}
                        />
                        <div className="relative flex items-center">
                          <FiLock
                            className={`absolute left-3 text-sm transition-colors ${
                              isFocused.password
                                ? "text-[#b0134d]"
                                : "text-[#7b8794]"
                            }`}
                          />
                          <input
                            type={showPassword ? "text" : "password"}
                            {...register("password", {
                              required: "Parol talab qilinadi",
                              minLength: {
                                value: 6,
                                message: "Kamida 6 belgi",
                              },
                            })}
                            onFocus={() =>
                              setIsFocused((prev) => ({
                                ...prev,
                                password: true,
                              }))
                            }
                            onBlur={() =>
                              setIsFocused((prev) => ({
                                ...prev,
                                password: false,
                              }))
                            }
                            autoComplete="current-password"
                            className="w-full rounded-xl border border-white/35 bg-white/85 pl-10 pr-10 py-3.5 text-base font-medium text-[#1f2937] placeholder:text-[#7b8794] focus:outline-none focus:border-transparent focus:ring-0 transition-all"
                            placeholder="••••••••"
                          />
                          <button
                            type="button"
                            onClick={() => setShowPassword(!showPassword)}
                            className="absolute right-3 text-[#7b8794] hover:text-[#b0134d] transition-colors"
                          >
                            {showPassword ? (
                              <FiEyeOff size={14} />
                            ) : (
                              <FiEye size={14} />
                            )}
                          </button>
                        </div>
                      </div>
                      {errors.password && (
                        <p className="text-xs text-red-400 animate-shake">
                          {errors.password.message as string}
                        </p>
                      )}
                    </div>

                    {/* Submit Button */}
                    <button
                      type="submit"
                      disabled={isSubmitting}
                      className="group/btn relative w-full overflow-hidden rounded-xl bg-gradient-to-r from-[#ffd966] to-[#ffb347] py-3.5 text-base font-bold text-[#b0134d] shadow-[0_5px_0_#8a0f3b] hover:translate-y-0.5 hover:shadow-[0_4px_0_#8a0f3b] active:translate-y-1 active:shadow-[0_3px_0_#8a0f3b] transition-all disabled:opacity-70 disabled:cursor-not-allowed"
                    >
                      <span className="relative z-10 flex items-center justify-center gap-1">
                        {isSubmitting ? (
                          <>
                            <div className="w-3.5 h-3.5 border-2 border-[#b0134d] border-t-transparent rounded-full animate-spin" />
                            <span className="text-xs">Kirish...</span>
                          </>
                        ) : (
                          <>
                            <span className="text-xs">KIRISH</span>
                            <FiArrowRight className="text-xs group-hover/btn:translate-x-1 transition-transform" />
                          </>
                        )}
                      </span>
                      <span className="absolute inset-0 -translate-x-full group-hover/btn:translate-x-0 transition-transform duration-700 bg-gradient-to-r from-transparent via-white/40 to-transparent skew-x-12" />
                    </button>
                  </form>

                  {/* Divider */}
                  <div className="relative my-3">
                    <div className="absolute inset-0 flex items-center">
                      <div className="w-full border-t border-white/10"></div>
                    </div>
                    <div className="relative flex justify-center text-xs">
                      <span className="px-3 bg-white/5 backdrop-blur-sm text-white/40 rounded-full py-0.5">
                        YOKI
                      </span>
                    </div>
                  </div>

                  {/* Google Login */}
                  <button
                    onClick={handleGoogleLogin}
                    disabled={isGoogleLoading}
                    className="group/btn relative w-full overflow-hidden rounded-xl bg-white/5 backdrop-blur-sm border border-white/10 py-2.5 text-white hover:bg-white/10 transition-all disabled:opacity-70"
                  >
                    <span className="relative z-10 flex items-center justify-center gap-2">
                      {isGoogleLoading ? (
                        <>
                          <div className="w-3.5 h-3.5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                          <span className="text-xs">Bog'lanmoqda...</span>
                        </>
                      ) : (
                        <>
                          <FcGoogle className="text-base group-hover/btn:rotate-12 transition-transform" />
                          <span className="text-xs">Google orqali kirish</span>
                        </>
                      )}
                    </span>
                    <span className="absolute inset-0 -translate-x-full group-hover/btn:translate-x-0 transition-transform duration-700 bg-gradient-to-r from-transparent via-white/20 to-transparent skew-x-12" />
                  </button>

                  {/* Sign Up Link */}
                  <p className="mt-3 text-center text-white/60 text-xs">
                    Hisobingiz yo'qmi?{" "}
                    <button
                      onClick={() => navigate("/register")}
                      className="text-[#ffd966] hover:text-[#ffb347] font-semibold hover:underline transition-all inline-flex items-center gap-0.5 group"
                    >
                      Ro'yxatdan o'tish
                      <FiArrowRight className="text-xs group-hover:translate-x-1 transition-transform" />
                    </button>
                  </p>

                  {/* Security Badge */}
                  <div className="mt-2 flex items-center justify-center gap-1 text-white/40 text-xs">
                    <FaShieldAlt className="text-[#ffd966] text-xs" />
                    <span>256-bit encryption</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default LoginForm;
