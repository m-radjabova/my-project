import { useNavigate } from "react-router-dom";
import { 
  FaArrowLeft, FaBolt, FaStar, FaCrown, FaTrophy, FaMedal 
} from "react-icons/fa";
import { GiBrain, GiPodium, GiAchievement } from "react-icons/gi";
import { MdQuiz, MdTimer, MdEmojiEvents } from "react-icons/md";
import QuizBattle from "./QuizBattle";

function QuizBattlePage() {
  const navigate = useNavigate();
  const quizBattleImg = "https://media.istockphoto.com/id/1336313511/vector/vector-funny-sign-quiz-game-set-of-creative-alphabet-letters-and-numbers.jpg?s=612x612&w=0&k=20&c=V7G9_GmHnJK89C-kt1U1kGDz2uBskO1-Z5fpxph9rX8=";

  const gameStats = [
    { icon: MdTimer, label: "5-10 daqiqa", color: "text-yellow-100" },
    { icon: GiBrain, label: "Bilim sinovi", color: "text-orange-100" }
  ];

  const features = [
    { icon: FaBolt, title: "Tezkor savollar", desc: "20 soniya ichida javob bering" },
    { icon: GiPodium, title: "Reyting tizimi", desc: "Eng yaxshi o'yinchilar bilan raqobat" },
  ];

  return (
    <div className="relative min-h-screen overflow-hidden bg-gradient-to-br from-yellow-500/90 via-orange-500/90 to-red-500/90 px-3 py-4 sm:px-4 sm:py-6">
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-20 -left-20 h-96 w-96 animate-pulse rounded-full bg-white/5 blur-3xl"></div>
        <div className="absolute -bottom-20 -right-20 h-96 w-96 animate-pulse rounded-full bg-yellow-300/5 blur-3xl delay-1000"></div>
        <div className="absolute left-1/4 top-1/3 h-64 w-64 animate-pulse rounded-full bg-purple-300/5 blur-3xl delay-500"></div>
        
        <div className="absolute left-[5%] top-[15%] animate-float text-5xl opacity-5 sm:text-7xl">❓</div>
        <div className="absolute right-[8%] bottom-[20%] animate-float text-5xl opacity-5 delay-300 sm:text-7xl">⚡</div>
        <div className="absolute left-[15%] bottom-[10%] animate-float text-5xl opacity-5 delay-700 sm:text-7xl">⭐</div>
        <div className="absolute right-[12%] top-[25%] animate-float text-5xl opacity-5 delay-500 sm:text-7xl">🏆</div>
      </div>

      <div className="relative mx-auto max-w-7xl">
        {/* Back button with modern design */}
        <button
          type="button"
          onClick={() => navigate("/games")}
          className="group mb-6 flex items-center gap-2 rounded-full bg-black/20 px-4 py-2 text-sm font-bold text-white shadow-lg backdrop-blur-sm transition-all duration-300 hover:-translate-x-1 hover:bg-black/30 sm:mb-8 sm:px-5 sm:py-2.5"
        >
          <FaArrowLeft className="text-sm transition-transform group-hover:-translate-x-1 sm:text-base" />
          <span>O'yinlarga qaytish</span>
        </button>

        {/* Hero Section - Modern and clean */}
        <div className="relative mb-8 overflow-hidden rounded-3xl border border-orange-200/40 bg-gradient-to-br from-yellow-500/90 via-orange-500/90 to-red-500/90 p-6 shadow-2xl shadow-[#7f1d4f]/50 sm:mb-10 sm:p-8 lg:p-10">
          <div className="relative z-10 flex flex-col items-center gap-6 lg:flex-row lg:gap-10">
            {/* Left side - Image */}
            <div className="relative w-full lg:w-2/5">
              <div className="absolute -inset-2 animate-pulse rounded-3xl bg-gradient-to-r from-yellow-300/30 to-orange-200/30 blur-xl"></div>
              <div className="relative overflow-hidden rounded-2xl border-4 border-white/30 shadow-2xl sm:rounded-3xl">
                <img 
                  src={quizBattleImg} 
                  alt="Quiz Battle" 
                  className="h-48 w-full object-cover transition-transform duration-700 hover:scale-110 sm:h-56 lg:h-64"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent"></div>

                {/* Rating badge */}
                <div className="absolute bottom-4 right-4">
                  <div className="flex items-center gap-1 rounded-full bg-black/60 px-2 py-1 text-xs text-white backdrop-blur-sm sm:px-3 sm:py-1.5 sm:text-sm">
                    <FaStar className="text-yellow-100" />
                    <span>4.9</span>
                    <span className="text-white/60">(2.3k)</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Right side - Info */}
            <div className="flex-1 text-center lg:text-left">
              <div className="mb-3 inline-flex items-center gap-2 rounded-full bg-black/25 px-4 py-1.5 text-sm font-bold text-yellow-100 backdrop-blur-sm sm:mb-4 sm:px-5 sm:py-2">
                <FaBolt />
                <span>QUIZ BATTLE</span>
              </div>

              <h1 className="mb-3 text-3xl font-black text-white sm:mb-4 sm:text-4xl lg:text-5xl">
                Bilimlar 
                <span className="bg-gradient-to-r from-yellow-100 via-orange-100 to-amber-100 bg-clip-text text-transparent"> jangi</span>
              </h1>

              <p className="mb-4 text-sm text-white/80 sm:mb-6 sm:text-base lg:text-lg">
                Tezkor savollar, qiziqarli topshiriqlar va reyting tizimi bilan 
                bilimingizni sinab ko'ring. Eng bilimdon o'yinchi bo'ling!
              </p>

              {/* Stats grid */}
              <div className="grid grid-cols-2 gap-2 sm:grid-cols-2 sm:gap-4">
                {gameStats.map((stat, index) => (
                  <div key={index} className="rounded-xl bg-black/20 p-2 text-center backdrop-blur-sm sm:p-3">
                    <stat.icon className={`mx-auto mb-1 text-base sm:mb-2 sm:text-xl ${stat.color}`} />
                    <p className="text-[10px] font-bold text-white sm:text-xs">{stat.label}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Decorative elements */}
          <div className="absolute -bottom-4 -right-4 text-8xl opacity-5">⚡</div>
          <div className="absolute -top-4 -left-4 text-8xl opacity-5">❓</div>
        </div>

        {/* Features section */}
        <div className="mb-8 grid grid-cols-1 gap-4 sm:grid-cols-2 sm:gap-6">
          {features.map((feature, index) => (
            <div 
              key={index}
              className="group rounded-2xl border border-orange-200/40 bg-gradient-to-br from-[#ff8a1f]/75 to-[#ffb36b]/75 p-4 backdrop-blur-sm transition-all duration-300 hover:-translate-y-1 hover:border-orange-100/70 hover:bg-[#ffbe82]/80 sm:p-6"
            >
              <div className="mb-3 flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br from-yellow-200 to-orange-200 text-[#8a1f4d] shadow-lg sm:h-14 sm:w-14">
                <feature.icon className="text-lg sm:text-xl" />
              </div>
              <h3 className="mb-1 text-base font-bold text-white sm:text-lg">{feature.title}</h3>
              <p className="text-xs text-white/70 sm:text-sm">{feature.desc}</p>
            </div>
          ))}
        </div>

        {/* Quiz Battle Component Container */}
        <div className="relative rounded-3xl border border-orange-200/40 bg-gradient-to-br from-yellow-500/90 via-orange-500/90 to-red-500/90 p-4 shadow-2xl shadow-[#7f1d4f]/50 backdrop-blur-xl sm:p-6 lg:p-8">
          {/* Header with decoration */}
          <div className="mb-6 flex items-center justify-between border-b border-white/30 pb-4">
            <div className="flex items-center gap-3">
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br from-yellow-200 to-orange-200 text-[#8a1f4d] shadow-lg">
                <MdQuiz className="text-xl sm:text-2xl" />
              </div>
              <div>
                <h2 className="text-lg font-bold text-white sm:text-xl">Quiz Battle</h2>
                <p className="text-xs text-orange-100/85 sm:text-sm">Bilimlar bellashuvi</p>
              </div>
            </div>
            
            <div className="flex items-center gap-2">
              <div className="flex items-center gap-1 rounded-full bg-black/20 px-3 py-1.5 text-xs text-white">
                <FaCrown className="text-yellow-100" />
                <span>Top 10</span>
              </div>
              <div className="flex items-center gap-1 rounded-full bg-black/20 px-3 py-1.5 text-xs text-white">
                <FaMedal className="text-yellow-100" />
                <span>124</span>
              </div>
            </div>
          </div>

          {/* QuizBattle component */}
          <QuizBattle />
        </div>

        {/* Bottom decoration */}
        <div className="relative mt-8 flex justify-center gap-2 text-6xl text-white/20">
          <MdEmojiEvents className="animate-bounce delay-100" />
          <GiAchievement className="animate-bounce delay-200" />
          <FaTrophy className="animate-bounce delay-300" />
          <GiPodium className="animate-bounce delay-400" />
          <FaCrown className="animate-bounce delay-500" />
        </div>
      </div>
    </div>
    
  );
}

export default QuizBattlePage;

