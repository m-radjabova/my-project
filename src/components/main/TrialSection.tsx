import { FaArrowRight, FaCheckCircle, FaPlay } from "react-icons/fa";
import { HiSparkles } from "react-icons/hi";
import { PiStudentFill } from "react-icons/pi";
import { TbDeviceDesktopAnalytics, TbSchool } from "react-icons/tb";
import { useNavigate } from "react-router-dom";
import trialImg from "../../assets/trial_image.png";

const highlights = [
  "7 kunlik bepul sinov",
  "O'qituvchi uchun qulay boshqaruv",
  "O'quvchi uchun qiziqarli tajriba",
];

const quickStats = [
  {
    icon: PiStudentFill,
    value: "5K+",
    label: "Faol o'quvchilar",
  },
  {
    icon: TbSchool,
    value: "30+",
    label: "Fan va yo'nalish",
  },
  {
    icon: TbDeviceDesktopAnalytics,
    value: "24/7",
    label: "Nazorat va tahlil",
  },
];

function TrialSection({ isDark = false }: { isDark?: boolean }) {
  const navigate = useNavigate();

  return (
    <section
      className={`relative overflow-hidden py-18 transition-colors duration-500 lg:py-24 ${
        isDark
          ? "bg-gradient-to-b from-[#0f172a] via-[#141c31] to-[#111827]"
          : "bg-gradient-to-b from-[#fff6f4] via-[#fff2f0] to-[#fff8f7]"
      }`}
    >
      <div className="absolute inset-0">
        <div className={`absolute -left-16 top-16 h-56 w-56 rounded-full blur-3xl ${isDark ? "bg-[#ff6b8a]/16" : "bg-[#f6d4da]/35"}`} />
        <div className={`absolute right-0 top-10 h-64 w-64 rounded-full blur-3xl ${isDark ? "bg-[#1e1e2f]" : "bg-[#fbe5dd]/45"}`} />
        <div className={`absolute bottom-0 left-1/3 h-48 w-48 rounded-full blur-3xl ${isDark ? "bg-[#ff4f74]/12" : "bg-[#f3d6df]/25"}`} />
      </div>

      <div className="relative z-10 mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="grid items-center gap-10 lg:grid-cols-[1.05fr_0.95fr] lg:gap-14">
          <div className="text-center lg:text-left" data-aos="fade-right" data-aos-delay="80">
            <div
              className={`mb-6 inline-flex items-center gap-2 rounded-full border px-5 py-2.5 shadow-lg backdrop-blur-sm ${
                isDark
                  ? "border-[#ff6b8a]/20 bg-[#1e1e2f]/78 shadow-[#000000]/10"
                  : "border-[#f0d9d6] bg-white/90 shadow-[#d9b2b8]/20"
              }`}
            >
              <HiSparkles className="text-sm text-[#ff6b8a]" />
              <span className={`text-[10px] font-bold uppercase tracking-[0.24em] sm:text-[11px] ${isDark ? "text-[#a1a1aa]" : "text-[#a66466]"}`}>
                Sinov versiyasi
              </span>
            </div>

            <h2 className={`max-w-2xl text-4xl font-black leading-[0.98] sm:text-5xl lg:text-6xl ${isDark ? "text-[#f1f1f1]" : "text-[#7b4f53]"}`}>
              Platformani
              <span className="mt-2 block bg-gradient-to-r from-[#ff6b8a] via-[#ff4f74] to-[#ff8ca6] bg-clip-text text-transparent">
                7 kun bepul sinab ko'ring
              </span>
            </h2>

            <p className={`mx-auto mt-5 max-w-xl text-base leading-relaxed lg:mx-0 lg:text-lg ${isDark ? "text-[#a1a1aa]" : "text-[#8f6d70]"}`}>
              O'qituvchi va o'quvchi uchun qulay boshqaruvni bir joyga jamlab,
              sahifaning yangi dark uslubiga mos, silliq va zamonaviy blok
              tayyorlandi.
            </p>

            <div className="mt-8 space-y-3">
              {highlights.map((item, index) => (
                <div
                  key={item}
                  data-aos="fade-up"
                  data-aos-delay={180 + index * 70}
                  className={`flex items-center justify-center gap-3 rounded-2xl border px-4 py-3 text-left backdrop-blur-sm lg:justify-start ${
                    isDark
                      ? "border-[#ff6b8a]/14 bg-[#1a1a28]/80 shadow-[0_12px_30px_rgba(0,0,0,0.18)]"
                      : "border-white/70 bg-white/70 shadow-[0_12px_30px_rgba(223,179,186,0.16)]"
                  }`}
                >
                  <FaCheckCircle className="shrink-0 text-[#ff6b8a]" />
                  <span className={`text-sm font-semibold sm:text-[15px] ${isDark ? "text-[#f1f1f1]" : "text-[#7b4f53]"}`}>
                    {item}
                  </span>
                </div>
              ))}
            </div>

            <div className="mt-8 flex flex-wrap items-center justify-center gap-4 lg:justify-start">
              <button
                onClick={() => navigate("/games")}
                className="group inline-flex items-center gap-3 rounded-full bg-gradient-to-r from-[#ff6b8a] via-[#ff5a7d] to-[#ff4f74] px-7 py-4 text-sm font-bold text-white shadow-[0_18px_40px_rgba(255,107,138,0.35)] transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_24px_50px_rgba(255,79,116,0.45)]"
              >
                <FaPlay className="text-xs" />
                Boshlash
                <FaArrowRight className="text-xs transition-transform group-hover:translate-x-1" />
              </button>
            </div>
          </div>

          <div className="relative" data-aos="fade-left" data-aos-delay="140">
            <div className={`absolute inset-x-8 top-8 -z-10 h-48 rounded-full blur-3xl ${isDark ? "bg-[#ff6b8a]/16" : "bg-[#f4cfd5]/35"}`} />
            <div
              className={`rounded-[34px] border p-5 backdrop-blur-[18px] sm:p-6 ${
                isDark
                  ? "border-[#ff6b8a]/18 bg-[#1a1a28]/78 shadow-[0_28px_80px_rgba(0,0,0,0.30)]"
                  : "border-white/70 bg-white/58 shadow-[0_28px_80px_rgba(139,92,100,0.16)]"
              }`}
            >
              <div
                className={`rounded-[28px] border p-5 sm:p-6 ${
                  isDark
                    ? "border-[#2b3146] bg-gradient-to-br from-[#1e1e2f] via-[#181c2a] to-[#131827]"
                    : "border-[#f2d9d7] bg-gradient-to-br from-[#fffdfd] via-[#fff7f6] to-[#fff0ee]"
                }`}
              >
                <div
                  className={`rounded-[24px] border-2 border-dashed p-1 shadow-sm ${
                    isDark
                      ? "border-[#ff6b8a]/25 bg-[linear-gradient(135deg,rgba(30,30,47,0.92),rgba(26,26,40,0.88))]"
                      : "border-[#eccbce] bg-[linear-gradient(135deg,rgba(255,255,255,0.9),rgba(253,236,238,0.85))]"
                  }`}
                >
                  <img className="rounded-[24px]" src={trialImg} alt="Trial image" />
                </div>

                <div className="mt-5 grid gap-3 sm:grid-cols-3">
                  {quickStats.map((item, index) => (
                    <div
                      key={item.label}
                      data-aos="zoom-in"
                      data-aos-delay={220 + index * 70}
                      className={`rounded-2xl border p-4 shadow-sm ${
                        isDark
                          ? "border-[#2b3146] bg-[#1e1e2f]"
                          : "border-white/80 bg-white/80"
                      }`}
                    >
                      <item.icon className="mb-3 text-lg text-[#ff6b8a]" />
                      <p className={`text-xl font-black ${isDark ? "text-[#f1f1f1]" : "text-[#7b4f53]"}`}>
                        {item.value}
                      </p>
                      <p className={`mt-1 text-[11px] font-semibold uppercase tracking-[0.18em] ${isDark ? "text-[#a1a1aa]" : "text-[#8f6d70]"}`}>
                        {item.label}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

export default TrialSection;
