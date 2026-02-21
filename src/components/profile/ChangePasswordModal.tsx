import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { 
  FiLock, 
  FiEye, 
  FiEyeOff,
  FiCheck, 
  FiX, 
  FiAlertCircle, 
  FiLoader,
  FiShield,
  FiInfo
} from "react-icons/fi";
import { 
  MdOutlinePassword,
  MdOutlineSecurity,
  MdOutlineVerifiedUser
} from "react-icons/md";
import { 
  HiOutlineShieldCheck,
  HiOutlineKey
} from "react-icons/hi";

type FormData = {
  current_password: string;
  new_password: string;
  confirm_password: string;
};

type Props = {
  open: boolean;
  loading?: boolean;
  onClose: () => void;
  onSubmit: (data: { current_password: string; new_password: string }) => void;
};

export default function ChangePasswordModal({ open, loading, onClose, onSubmit }: Props) {
  const [showCurrent, setShowCurrent] = useState(false);
  const [showNew, setShowNew] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [passwordStrength, setPasswordStrength] = useState(0);

  const {
    register,
    handleSubmit,
    reset,
    watch,
    formState: { errors },
  } = useForm<FormData>({
    defaultValues: {
      current_password: "",
      new_password: "",
      confirm_password: "",
    },
  });

  const newPassword = watch("new_password");
  const currentPassword = watch("current_password");

  useEffect(() => {
    if (newPassword) {
      let strength = 0;
      if (newPassword.length >= 8) strength++;
      if (/[A-Z]/.test(newPassword)) strength++;
      if (/[0-9]/.test(newPassword)) strength++;
      if (/[^A-Za-z0-9]/.test(newPassword)) strength++;
      setPasswordStrength(strength);
    } else {
      setPasswordStrength(0);
    }
  }, [newPassword]);

  useEffect(() => {
    if (!open) {
      reset();
      setShowCurrent(false);
      setShowNew(false);
      setShowConfirm(false);
      setPasswordStrength(0);
    }
  }, [open, reset]);

  const onSubmitForm = (data: FormData) => {
    onSubmit({
      current_password: data.current_password,
      new_password: data.new_password,
    });
  };

  const getPasswordStrengthColor = () => {
    switch (passwordStrength) {
      case 0:
      case 1:
        return "from-red-500 to-red-600";
      case 2:
        return "from-amber-500 to-orange-500";
      case 3:
        return "from-teal-400 to-emerald-500";
      case 4:
        return "from-green-500 to-emerald-600";
      default:
        return "from-slate-400 to-slate-500";
    }
  };

  const getPasswordStrengthText = () => {
    switch (passwordStrength) {
      case 0:
        return "Juda zaif";
      case 1:
        return "Zaif";
      case 2:
        return "O'rtacha";
      case 3:
        return "Yaxshi";
      case 4:
        return "Kuchli";
      default:
        return "";
    }
  };

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      <div className="flex min-h-screen items-center justify-center p-4 text-center">
        {/* Fon qoraytirgich */}
        <div
          className="fixed inset-0 bg-black/60 backdrop-blur-sm transition-opacity"
          aria-hidden="true"
          onClick={onClose}
        />
        
        {/* Modal paneli */}
        <div className="relative transform overflow-hidden rounded-2xl bg-gradient-to-br from-white via-rose-50/30 to-white text-left shadow-2xl transition-all w-full max-w-md border border-rose-100/50">
          {/* Gradient dekorativ chiziq */}
          <div className="absolute top-0 left-0 right-0 h-1.5 bg-gradient-to-r from-[#d42d73] via-[#c2185b] to-[#b0134d]"></div>
          
          {/* Header */}
          <div className="px-6 pt-8 pb-4">
            <div className="flex items-start justify-between">
              <div className="flex items-center gap-4">
                <div className="relative">
                  <div className="absolute -inset-1 bg-gradient-to-r from-[#d42d73] to-[#b0134d] rounded-xl blur opacity-70"></div>
                  <div className="relative flex h-14 w-14 items-center justify-center rounded-xl bg-gradient-to-r from-[#d42d73] via-[#c2185b] to-[#b0134d] shadow-lg">
                    <MdOutlinePassword className="h-7 w-7 text-white" />
                  </div>
                </div>
                <div>
                  <h3 className="text-2xl font-bold text-gray-800">Parolni o'zgartirish</h3>
                  <p className="text-sm text-gray-500 mt-1 flex items-center gap-1">
                    <HiOutlineShieldCheck className="h-4 w-4 text-[#d42d73]" />
                    Xavfsizlikni oshirish uchun parolingizni yangilang
                  </p>
                </div>
              </div>
              <button
                onClick={onClose}
                disabled={loading}
                className="rounded-lg p-2 text-gray-400 hover:bg-rose-100 hover:text-[#d42d73] transition-all disabled:opacity-50"
              >
                <FiX className="h-5 w-5" />
              </button>
            </div>
          </div>

          {/* Forma */}
          <form onSubmit={handleSubmit(onSubmitForm)} className="px-6 pb-8">
            <div className="space-y-5">
              {/* Joriy parol */}
              <div>
                <label className="mb-2 flex items-center gap-2 text-sm font-medium text-gray-700">
                  <FiLock className="h-4 w-4 text-[#d42d73]" />
                  Joriy parol
                </label>
                <div className="relative group">
                  <input
                    type={showCurrent ? "text" : "password"}
                    {...register("current_password", {
                      required: "Joriy parol majburiy",
                      minLength: {
                        value: 6,
                        message: "Parol kamida 6 ta belgidan iborat bo'lishi kerak",
                      },
                    })}
                    className={`w-full rounded-xl border ${errors.current_password ? "border-red-300" : "border-rose-200"} bg-white/50 px-4 py-3.5 pl-12 pr-12 outline-none transition-all focus:border-[#d42d73] focus:ring-2 focus:ring-[#d42d73]/20 backdrop-blur-sm group-hover:border-rose-300`}
                    placeholder="Joriy parolingizni kiriting"
                    disabled={loading}
                  />
                  <div className="absolute left-4 top-1/2 -translate-y-1/2">
                    <HiOutlineKey className="h-5 w-5 text-gray-400 group-focus-within:text-[#d42d73] transition-colors" />
                  </div>
                  <button
                    type="button"
                    onClick={() => setShowCurrent(!showCurrent)}
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-[#d42d73] transition-colors"
                  >
                    {showCurrent ? <FiEyeOff className="h-5 w-5" /> : <FiEye className="h-5 w-5" />}
                  </button>
                </div>
                {errors.current_password && (
                  <p className="mt-2 flex items-center gap-1 text-sm text-red-600">
                    <FiAlertCircle className="h-4 w-4" />
                    {errors.current_password.message}
                  </p>
                )}
              </div>

              {/* Yangi parol */}
              <div>
                <label className="mb-2 flex items-center gap-2 text-sm font-medium text-gray-700">
                  <FiLock className="h-4 w-4 text-[#d42d73]" />
                  Yangi parol
                </label>
                <div className="relative group">
                  <input
                    type={showNew ? "text" : "password"}
                    {...register("new_password", {
                      required: "Yangi parol majburiy",
                      minLength: {
                        value: 8,
                        message: "Parol kamida 8 ta belgidan iborat bo'lishi kerak",
                      },
                      validate: (value) => {
                        if (value === currentPassword) {
                          return "Yangi parol joriy paroldan farqli bo'lishi kerak";
                        }
                        return true;
                      },
                    })}
                    className={`w-full rounded-xl border ${errors.new_password ? "border-red-300" : "border-rose-200"} bg-white/50 px-4 py-3.5 pl-12 pr-12 outline-none transition-all focus:border-[#d42d73] focus:ring-2 focus:ring-[#d42d73]/20 backdrop-blur-sm group-hover:border-rose-300`}
                    placeholder="Yangi parolingizni kiriting"
                    disabled={loading}
                  />
                  <div className="absolute left-4 top-1/2 -translate-y-1/2">
                    <MdOutlineSecurity className="h-5 w-5 text-gray-400 group-focus-within:text-[#d42d73] transition-colors" />
                  </div>
                  <button
                    type="button"
                    onClick={() => setShowNew(!showNew)}
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-[#d42d73] transition-colors"
                  >
                    {showNew ? <FiEyeOff className="h-5 w-5" /> : <FiEye className="h-5 w-5" />}
                  </button>
                </div>
                
                {/* Parol kuchlilik indikatori */}
                {newPassword && (
                  <div className="mt-4 p-3 rounded-xl bg-gradient-to-r from-[#d42d73]/5 to-[#b0134d]/5 border border-rose-100">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-xs font-medium text-gray-600">Parol kuchliligi</span>
                      <span className={`text-xs font-semibold px-2 py-0.5 rounded-full bg-gradient-to-r ${getPasswordStrengthColor()} text-white`}>
                        {getPasswordStrengthText()}
                      </span>
                    </div>
                    
                    {/* Progress bar */}
                    <div className="flex gap-1 mb-3">
                      {[1, 2, 3, 4].map((level) => (
                        <div
                          key={level}
                          className={`h-2 flex-1 rounded-full transition-all duration-300 ${
                            level <= passwordStrength 
                              ? `bg-gradient-to-r ${getPasswordStrengthColor()}` 
                              : "bg-rose-100"
                          }`}
                        />
                      ))}
                    </div>
                    
                    {/* Parol talablari */}
                    <div className="space-y-2">
                      <div className="flex items-center gap-2">
                        <div className={`h-2 w-2 rounded-full ${newPassword.length >= 8 ? "bg-green-500" : "bg-gray-300"}`} />
                        <span className={`text-xs ${newPassword.length >= 8 ? "text-green-600 font-medium" : "text-gray-500"}`}>
                          Kamida 8 ta belgi
                        </span>
                      </div>
                      <div className="flex items-center gap-2">
                        <div className={`h-2 w-2 rounded-full ${/[A-Z]/.test(newPassword) ? "bg-green-500" : "bg-gray-300"}`} />
                        <span className={`text-xs ${/[A-Z]/.test(newPassword) ? "text-green-600 font-medium" : "text-gray-500"}`}>
                          Bitta katta harf
                        </span>
                      </div>
                      <div className="flex items-center gap-2">
                        <div className={`h-2 w-2 rounded-full ${/[0-9]/.test(newPassword) ? "bg-green-500" : "bg-gray-300"}`} />
                        <span className={`text-xs ${/[0-9]/.test(newPassword) ? "text-green-600 font-medium" : "text-gray-500"}`}>
                          Bitta raqam
                        </span>
                      </div>
                      <div className="flex items-center gap-2">
                        <div className={`h-2 w-2 rounded-full ${/[^A-Za-z0-9]/.test(newPassword) ? "bg-green-500" : "bg-gray-300"}`} />
                        <span className={`text-xs ${/[^A-Za-z0-9]/.test(newPassword) ? "text-green-600 font-medium" : "text-gray-500"}`}>
                          Maxsus belgi (!@#$%^&*)
                        </span>
                      </div>
                    </div>
                  </div>
                )}
                
                {errors.new_password && (
                  <p className="mt-2 flex items-center gap-1 text-sm text-red-600">
                    <FiAlertCircle className="h-4 w-4" />
                    {errors.new_password.message}
                  </p>
                )}
              </div>

              {/* Parolni tasdiqlash */}
              <div>
                <label className="mb-2 flex items-center gap-2 text-sm font-medium text-gray-700">
                  <FiLock className="h-4 w-4 text-[#d42d73]" />
                  Yangi parolni tasdiqlang
                </label>
                <div className="relative group">
                  <input
                    type={showConfirm ? "text" : "password"}
                    {...register("confirm_password", {
                      required: "Parolni tasdiqlash majburiy",
                      validate: (value) =>
                        value === watch("new_password") || "Parollar mos kelmadi",
                    })}
                    className={`w-full rounded-xl border ${errors.confirm_password ? "border-red-300" : "border-rose-200"} bg-white/50 px-4 py-3.5 pl-12 pr-12 outline-none transition-all focus:border-[#d42d73] focus:ring-2 focus:ring-[#d42d73]/20 backdrop-blur-sm group-hover:border-rose-300`}
                    placeholder="Yangi parolingizni qayta kiriting"
                    disabled={loading}
                  />
                  <div className="absolute left-4 top-1/2 -translate-y-1/2">
                    <MdOutlineVerifiedUser className="h-5 w-5 text-gray-400 group-focus-within:text-[#d42d73] transition-colors" />
                  </div>
                  <button
                    type="button"
                    onClick={() => setShowConfirm(!showConfirm)}
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-[#d42d73] transition-colors"
                  >
                    {showConfirm ? <FiEyeOff className="h-5 w-5" /> : <FiEye className="h-5 w-5" />}
                  </button>
                </div>
                {errors.confirm_password && (
                  <p className="mt-2 flex items-center gap-1 text-sm text-red-600">
                    <FiAlertCircle className="h-4 w-4" />
                    {errors.confirm_password.message}
                  </p>
                )}
              </div>

              {/* Xavfsizlik maslahatlari */}
              <div className="rounded-xl border border-[#d42d73]/20 bg-gradient-to-r from-[#d42d73]/5 to-[#b0134d]/5 p-4">
                <div className="flex items-start gap-3">
                  <div className="p-1.5 rounded-lg bg-gradient-to-r from-[#d42d73] to-[#b0134d] text-white">
                    <FiShield className="h-4 w-4" />
                  </div>
                  <div>
                    <h4 className="text-sm font-semibold text-gray-800 flex items-center gap-1">
                      <FiInfo className="h-4 w-4 text-[#d42d73]" />
                      Xavfsizlik maslahatlari
                    </h4>
                    <ul className="mt-2 space-y-1.5 text-xs text-gray-600">
                      <li className="flex items-start gap-2">
                        <span className="text-[#d42d73] mt-1">•</span>
                        <span>Boshqa saytlarda ishlatilmagan unikal parol tanlang</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <span className="text-[#d42d73] mt-1">•</span>
                        <span>Harflar, raqamlar va maxsus belgilardan foydalaning</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <span className="text-[#d42d73] mt-1">•</span>
                        <span>Oddiy so'zlar va shaxsiy ma'lumotlardan saqlaning</span>
                      </li>
                    </ul>
                  </div>
                </div>
              </div>
            </div>

            {/* Tugmalar */}
            <div className="mt-8 flex gap-3">
              <button
                type="button"
                onClick={onClose}
                disabled={loading}
                className="flex-1 rounded-xl border border-rose-200 bg-white/50 backdrop-blur-sm px-4 py-3.5 text-sm font-semibold text-gray-700 transition-all hover:bg-rose-50 hover:border-rose-300 hover:shadow disabled:opacity-50"
              >
                Bekor qilish
              </button>
              
              <button
                type="submit"
                disabled={loading}
                className="flex flex-1 items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-[#d42d73] via-[#c2185b] to-[#b0134d] px-4 py-3.5 text-sm font-semibold text-white transition-all hover:shadow-lg hover:shadow-[#d42d73]/30 hover:scale-[1.02] active:scale-[0.98] disabled:opacity-50 disabled:hover:scale-100"
              >
                {loading ? (
                  <>
                    <FiLoader className="h-4 w-4 animate-spin" />
                    Yangilanmoqda...
                  </>
                ) : (
                  <>
                    <FiCheck className="h-4 w-4" />
                    Parolni yangilash
                  </>
                )}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}