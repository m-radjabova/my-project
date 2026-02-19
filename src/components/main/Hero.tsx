import {
  FaGamepad,
  FaFlask,
  FaBrain,
  FaGraduationCap,
  FaStar,
} from "react-icons/fa";
import { GiSparkles, GiBookshelf, GiTrophy, GiPencil } from "react-icons/gi";
import { HiOutlineAcademicCap } from "react-icons/hi";
import { RiGovernmentLine } from "react-icons/ri";
import { TbMathSymbols } from "react-icons/tb";
import { useNavigate } from "react-router-dom";
import heroCharacter from "../../assets/hero.png";

function Hero() {
  const navigate = useNavigate();

  return (
    <section
      className={` relative mt-[80px] h-screen w-full overflow-hidden bg-gradient-to-br from-[#d42d73] via-[#c2185b] to-[#b0134d]`}
    >
      {/* Floating Educational Icons Background */}
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        {/* First Row - Floating Icons */}
        <div className="absolute top-[15%] left-[5%] animate-float-slow">
          <HiOutlineAcademicCap className="text-7xl text-white/10 rotate-12 hover:text-white/20 transition-all duration-1000" />
        </div>
        <div className="absolute top-[25%] right-[8%] animate-float-delayed">
          <FaBrain className="text-8xl text-white/10 hover:text-white/20 transition-all duration-1000" />
        </div>
        <div className="absolute bottom-[20%] left-[12%] animate-float">
          <GiBookshelf className="text-9xl text-white/10 hover:text-white/20 transition-all duration-1000" />
        </div>
        <div className="absolute bottom-[35%] right-[15%] animate-float-slow">
          <FaFlask className="text-8xl text-white/10 rotate-12 hover:text-white/20 transition-all duration-1000" />
        </div>

        {/* Second Row - More Icons with different animations */}
        <div className="absolute top-[45%] left-[18%] animate-pulse-slow">
          <GiTrophy className="text-9xl text-[#ffd700]/20 hover:text-[#ffd700]/30 transition-all duration-1000" />
        </div>
        <div className="absolute top-[60%] right-[22%] animate-bounce-slow">
          <RiGovernmentLine className="text-8xl text-white/10 hover:text-white/20 transition-all duration-1000" />
        </div>
        <div className="absolute bottom-[45%] left-[25%] animate-spin-slow">
          <TbMathSymbols className="text-9xl text-white/10 hover:text-white/20 transition-all duration-1000" />
        </div>
        <div className="absolute bottom-[55%] right-[30%] animate-float-delayed">
          <GiPencil className="text-8xl text-white/10 rotate-45 hover:text-white/20 transition-all duration-1000" />
        </div>

        {/* Additional decorative elements */}
        <div className="absolute top-[75%] left-[35%] animate-pulse">
          <FaGraduationCap className="text-8xl text-white/10 hover:text-white/20 transition-all duration-1000" />
        </div>
        <div className="absolute top-[12%] left-[45%] animate-float-slow">
          <FaStar className="text-7xl text-white/10 rotate-12 hover:text-white/20 transition-all duration-1000" />
        </div>

        {/* Background glow effects */}
        <div className="absolute top-20 left-10">
          <GiSparkles className="text-8xl text-white/5 animate-pulse-slow" />
        </div>
        <div className="absolute bottom-20 right-10">
          <GiSparkles className="text-8xl text-white/10 animate-bounce-slow" />
        </div>
      </div>

      <Decorations />

      <div className="relative mx-auto max-w-7xl px-6 h-full flex items-center">
        <div className="grid items-center gap-12 lg:grid-cols-2 lg:gap-8 w-full">
          {/* Left Content */}
          <div
            className="relative z-20 text-center lg:text-left"
            data-aos="fade-right"
          >
            <div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-sm px-5 py-2 rounded-full mb-8 animate-fade-in-up">
              <span className="w-2 h-2 bg-[#ffd700] rounded-full animate-pulse" />
              <span className="text-xs font-bold tracking-[0.3em] text-white/90">
                LET THE GAMES BEGIN
              </span>
            </div>

            <h1 className="font-bebas text-6xl sm:text-7xl lg:text-8xl leading-[0.95] text-white mb-6">
              <span className="block transform hover:scale-105 hover:translate-x-2 transition-all duration-300 animate-slide-in-left">
                TA'LIM
              </span>
              <span className="block bg-clip-text bg-gradient-to-r from-[#ffd966] to-[#ffb347] drop-shadow-[0_4px_0_#b94b1f] animate-slide-in-right">
                JARAYONI
              </span>
              <span className="block text-transparent bg-clip-text bg-gradient-to-r from-[#ffd966] to-[#ffb347] drop-shadow-[0_4px_0_#b94b1f] animate-slide-in-left delay-200">
                BIZ BILAN!
              </span>
            </h1>

            <p className="max-w-lg mx-auto lg:mx-0 text-base leading-relaxed text-white/80 mb-10 font-inter animate-fade-in-up delay-300">
              O‘yin orqali fanlarni qiziqarli va oson o‘rganing. Topshiriqlarni
              bajaring, savollarga javob bering va bilim darajangizni oshiring.
              Do‘stlaringiz bilan birga o‘rganing va yuqori natijalarga
              erishing.
            </p>

            {/* CTA Button */}
            <button
              onClick={() => navigate("/games")}
              className="group relative mt-8 overflow-hidden rounded-full border-2 border-[#ffe24d] bg-gradient-to-b from-[#ffd966] to-[#ffb347] px-12 py-4 text-lg font-black tracking-wider text-[#1a1a1a] shadow-[0_12px_0_0_rgba(230,126,34,0.95),0_15px_25px_rgba(0,0,0,0.2)] transition-all hover:translate-y-1 hover:shadow-[0_10px_0_0_rgba(230,126,34,0.95)] active:translate-y-3 active:shadow-[0_8px_0_0_rgba(230,126,34,0.95)] animate-fade-in-up"
            >
              <span className="relative z-10 flex items-center gap-3">
                <FaGamepad className="text-xl" />
                HOZIROQ BOSHLANG
              </span>
              <span className="absolute inset-0 -translate-x-full group-hover:translate-x-0 transition-transform duration-700 bg-gradient-to-r from-transparent via-white/40 to-transparent skew-x-12" />
            </button>

            {/* Stats */}
            <div className="flex gap-8 mt-12 justify-center lg:justify-start animate-fade-in-up delay-700">
              {[
                { value: "50K+", label: "Active Players", icon: FaGamepad },
                { value: "100+", label: "Dungeons", icon: GiTrophy },
                { value: "4.9", label: "Rating", icon: GiSparkles },
              ].map((stat, idx) => (
                <div
                  key={idx}
                  className="text-center group hover:transform hover:scale-110 transition-all duration-300"
                >
                  <div className="text-2xl font-black text-white flex items-center gap-1 justify-center lg:justify-start">
                    <stat.icon className="text-[#ffd966] text-xl opacity-0 group-hover:opacity-100 transition-all duration-300" />
                    {stat.value}
                  </div>
                  <div className="text-xs font-medium text-white/60">
                    {stat.label}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Right Image */}
          <div
            className="relative z-20 flex items-center justify-center lg:justify-end"
            data-aos="fade-left"
            data-aos-delay="200"
          >
            <div className="relative group">
              <div className="absolute -inset-4 bg-gradient-to-r from-[#ffd966] to-[#ffb347] rounded-full blur-2xl opacity-30 group-hover:opacity-50 transition-opacity animate-pulse-slow" />
              <img
                src={heroCharacter}
                alt="Hero character"
                className="relative z-10 w-[300px] sm:w-[400px] lg:w-[500px] select-none object-contain
                         drop-shadow-[0_35px_25px_rgba(0,0,0,0.4)] transform transition-all 
                         
                        "
                draggable={false}
              />
            </div>
          </div>
        </div>

        {/* Pagination Dots */}
        <div
          className="absolute bottom-8 left-1/2 transform -translate-x-1/2 flex gap-3"
          data-aos="fade-up"
          data-aos-delay="300"
        >
          {[0, 1, 2, 3].map((dot) => (
            <button
              key={dot}
              className={`h-3 w-3 rounded-full transition-all duration-300 ${
                dot === 0
                  ? "bg-[#ffd966] scale-125 shadow-lg animate-pulse"
                  : "bg-white/30 hover:bg-white/50 hover:scale-110"
              }`}
            />
          ))}
        </div>
      </div>
    </section>
  );
}

function Decorations() {
  return (
    <div className="pointer-events-none absolute inset-0">
      {/* Animated Clouds */}
      <svg
        className="absolute left-5 top-40 w-[320px] opacity-25 animate-float-slow-hero"
        viewBox="0 0 420 260"
        fill="none"
      >
        <path
          d="M120 210c-50 0-88-30-88-70 0-36 31-66 72-70 13-34 48-59 89-59 48 0 88 32 96 76 50 3 90 36 90 76 0 42-44 77-98 77H120z"
          fill="#ff9acb"
        />
      </svg>

      <svg
        className="pointer-events-none absolute right-0 top-40 w-[380px] opacity-40 animate-float-delayed"
        viewBox="0 0 420 260"
        fill="none"
      >
        <path
          d="M120 210c-50 0-88-30-88-70 0-36 31-66 72-70 13-34 48-59 89-59 48 0 88 32 96 76 50 3 90 36 90 76 0 42-44 77-98 77H120z"
          fill="#ffd2e4"
        />
      </svg>

      {/* Orbital Rings */}
      <div className="absolute left-1/2 top-1/3 -translate-x-1/2 opacity-30">
        <div className="relative w-64 h-64">
          <div className="absolute inset-0 border-4 border-white/10 rounded-full animate-spin-slow" />
          <div className="absolute inset-4 border-2 border-white/20 rounded-full animate-spin-slower" />
          <div className="absolute inset-8 border border-white/30 rounded-full animate-pulse" />
        </div>
      </div>

      {/* Floating Orbs */}
      <div className="absolute right-40 bottom-40 w-24 h-24 rounded-full bg-gradient-to-br from-[#ffd966] to-[#ffb347] opacity-30 blur-xl animate-pulse-slow" />
      <div className="absolute left-60 top-60 w-32 h-32 rounded-full bg-gradient-to-br from-[#ff9acb] to-[#d42d73] opacity-30 blur-xl animate-pulse-slow delay-1000" />
    </div>
  );
}

export default Hero;
