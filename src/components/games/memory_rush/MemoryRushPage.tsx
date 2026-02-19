import { useNavigate } from "react-router-dom";
import { 
  FaArrowLeft, FaStar, FaUsers, FaTrophy, FaHeart, FaLayerGroup, FaBolt,
  FaCrown
} from "react-icons/fa";
import { 
  GiBrain, GiPodium, 
  GiBrainStem, GiBrainTentacle, GiBrainFreeze, GiLightBulb,
  GiAchievement
} from "react-icons/gi";
import { 
  MdTimer, MdSpeed, MdStars, MdMemory,
  MdEmojiEvents
} from "react-icons/md";
import { RiBrainFill, RiMentalHealthFill } from "react-icons/ri";
import MemoryRush from "./MemoryRush";

function MemoryRushPage() {
  const navigate = useNavigate();
  
  const memoryRushImg = "https://media.istockphoto.com/id/1434154110/vector/reminder-yellow-note-circled.jpg?s=612x612&w=0&k=20&c=2mfjGFRNi7htNGB47t3fzlfg5mCGLQSfUXMoWBogWL0=";

  const gameStats = [
    { icon: FaUsers, label: "3.8k+ o'yinchi", color: "text-emerald-100", bg: "from-emerald-300/20 to-cyan-300/20" },
    { icon: MdTimer, label: "5-8 daqiqa", color: "text-cyan-100", bg: "from-cyan-300/20 to-teal-300/20" },
    { icon: GiBrain, label: "Xotira treningi", color: "text-teal-100", bg: "from-teal-300/20 to-emerald-300/20" },
    { icon: FaTrophy, label: "800+ ball", color: "text-emerald-50", bg: "from-emerald-200/20 to-cyan-200/20" },
  ];

  const features = [
    { 
      icon: GiBrain, 
      title: "Xotira mashqi", 
      desc: "Kartochkalarni eslab qoling va juftini toping",
      color: "from-emerald-300 to-cyan-300",
      bgIcon: GiBrainStem
    },
    { 
      icon: MdSpeed, 
      title: "Tezkor javob", 
      desc: "Vaqt chegarasi bilan xotirangizni sinang",
      color: "from-teal-300 to-cyan-300",
      bgIcon: FaBolt
    },
    { 
      icon: GiPodium, 
      title: "Reytinglar", 
      desc: "Eng kuchli xotira egalari bilan raqobat",
      color: "from-cyan-300 to-emerald-300",
      bgIcon: GiAchievement
    },
  ];

  const memoryLevels = [
    { level: "Boshlang'ich", cards: "12 ta kartochka", time: "60 soniya", icon: FaStar, color: "text-emerald-100" },
    { level: "O'rta", cards: "20 ta kartochka", time: "90 soniya", icon: MdStars, color: "text-cyan-100" },
    { level: "Professional", cards: "30 ta kartochka", time: "120 soniya", icon: GiBrain, color: "text-teal-100" },
  ];

  return (
    <div className="relative min-h-screen overflow-hidden bg-gradient-to-br from-emerald-600 via-teal-600 to-cyan-600 px-3 py-4 sm:px-4 sm:py-6">
      {/* Animated background elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-20 -left-20 h-96 w-96 animate-pulse rounded-full bg-emerald-300/25 blur-3xl"></div>
        <div className="absolute -bottom-20 -right-20 h-96 w-96 animate-pulse rounded-full bg-cyan-300/20 blur-3xl delay-1000"></div>
        <div className="absolute left-1/3 top-1/4 h-80 w-80 animate-pulse rounded-full bg-teal-300/20 blur-3xl delay-500"></div>
        
        {/* Floating memory elements */}
        <div className="absolute left-[8%] top-[10%] animate-float-slow text-7xl opacity-10">🧠</div>
        <div className="absolute right-[12%] bottom-[15%] animate-float text-6xl opacity-10 delay-300">🎴</div>
        <div className="absolute left-[20%] bottom-[20%] animate-float-slow text-6xl opacity-10 delay-700">🧩</div>
        <div className="absolute right-[15%] top-[30%] animate-float text-7xl opacity-10 delay-500">🔮</div>
      </div>

      <div className="relative mx-auto max-w-7xl">
        {/* Back button */}
        <button
          type="button"
          onClick={() => navigate("/games")}
          className="group mb-6 flex items-center gap-2 rounded-full bg-white/20 px-4 py-2 text-sm font-bold text-white shadow-lg backdrop-blur-sm transition-all duration-300 hover:-translate-x-1 hover:bg-white/30 sm:mb-8 sm:px-5 sm:py-2.5"
        >
          <FaArrowLeft className="text-sm transition-transform group-hover:-translate-x-1 sm:text-base" />
          <span>O'yinlarga qaytish</span>
        </button>

        {/* Hero Section */}
        <div className="relative mb-8 overflow-hidden rounded-3xl border border-emerald-200/50 bg-gradient-to-br from-[#1dbb95] via-[#18af95] to-[#0ea5a4] p-6 shadow-2xl shadow-teal-900/40 sm:mb-10 sm:p-8 lg:p-10">
          {/* Animated glow */}
          <div className="absolute -right-20 -top-20 h-64 w-64 animate-pulse rounded-full bg-emerald-300/30 blur-3xl"></div>
          
          <div className="relative z-10 flex flex-col items-center gap-6 lg:flex-row lg:gap-10">
            {/* Left side - Image */}
            <div className="relative w-full lg:w-2/5">
              <div className="absolute -inset-3 animate-pulse rounded-3xl bg-emerald-300/30 blur-xl"></div>
              <div className="absolute -inset-1 animate-spin-slow rounded-3xl bg-gradient-to-r from-emerald-300 to-cyan-300 opacity-30 blur-lg"></div>
              <div className="relative overflow-hidden rounded-2xl border-4 border-white/30 shadow-2xl sm:rounded-3xl">
                <img 
                  src={memoryRushImg} 
                  alt="Memory Rush" 
                  className="h-48 w-full object-cover transition-transform duration-700 hover:scale-110 sm:h-56 lg:h-64"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-teal-900/80 via-emerald-800/30 to-transparent"></div>
                
                {/* Game badge */}
                <div className="absolute left-4 top-4">
                  <div className="flex items-center gap-2 rounded-full bg-white px-3 py-1.5 text-xs font-black text-[#b3135f] shadow-xl sm:px-4 sm:py-2 sm:text-sm">
                    <GiBrain className="text-xs sm:text-sm" />
                    <span>XOTIRA O'YINI</span>
                  </div>
                </div>

                {/* Brain activity indicator */}
                <div className="absolute bottom-4 right-4">
                  <div className="flex items-center gap-1 rounded-full bg-black/50 px-2 py-1 text-xs text-white backdrop-blur-sm sm:px-3 sm:py-1.5 sm:text-sm">
                    <RiBrainFill className="text-emerald-100 animate-pulse" />
                    <span>Aktiv: 98%</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Right side - Info */}
            <div className="flex-1 text-center lg:text-left">
              <div className="mb-3 inline-flex items-center gap-2 rounded-full bg-black/25 px-4 py-1.5 text-sm font-bold text-emerald-100 backdrop-blur-sm sm:mb-4 sm:px-5 sm:py-2">
                <MdMemory />
                <span>MEMORY RUSH</span>
              </div>

              <h1 className="mb-3 text-3xl font-black text-white sm:mb-4 sm:text-4xl lg:text-5xl">
                Xotirangizni 
                <span className="bg-gradient-to-r from-emerald-100 via-cyan-100 to-teal-100 bg-clip-text text-transparent"> charxlang</span>
              </h1>

              <p className="mb-4 text-sm text-white/90 sm:mb-6 sm:text-base lg:text-lg">
                Kartochkalarni eslab qoling, juftlarini toping va eng yuqori natijaga erishing. 
                Xotirangizni sinash va rivojlantirish uchun ajoyib imkoniyat!
              </p>

              {/* Stats grid */}
                <div className="grid grid-cols-2 gap-2 sm:grid-cols-4 sm:gap-4">
                {gameStats.map((stat, index) => (
                  <div 
                    key={index} 
                    className={`group relative overflow-hidden rounded-xl bg-black/15 p-2 text-center backdrop-blur-sm transition-all duration-300 hover:scale-105 sm:p-3`}
                  >
                    <div className="absolute inset-0 bg-white/10 opacity-0 transition-opacity group-hover:opacity-100"></div>
                    <stat.icon className={`mx-auto mb-1 text-base sm:mb-2 sm:text-xl ${stat.color} relative z-10`} />
                    <p className="text-[10px] font-bold text-white sm:text-xs relative z-10">{stat.label}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Decorative elements */}
          <GiBrainTentacle className="absolute -bottom-4 -left-4 text-8xl opacity-10 text-emerald-100" />
          <GiBrainFreeze className="absolute -top-4 -right-4 text-8xl opacity-10 text-emerald-200" />
        </div>

        {/* Features section */}
        <div className="mb-8 grid grid-cols-1 gap-4 sm:grid-cols-3 sm:gap-6">
          {features.map((feature, index) => (
            <div 
              key={index}
              className="group relative overflow-hidden rounded-2xl border border-emerald-200/40 bg-gradient-to-br from-[#1ec698]/80 to-[#13a89b]/80 p-4 backdrop-blur-sm transition-all duration-500 hover:-translate-y-2 hover:border-emerald-100/70 hover:shadow-2xl sm:p-6"
            >
              {/* Animated background */}
              <div className="absolute -right-10 -top-10 h-24 w-24 animate-pulse rounded-full bg-emerald-300/30 blur-2xl"></div>
              
              <div className="relative z-10">
                <div className={`mb-3 flex h-14 w-14 items-center justify-center rounded-xl bg-gradient-to-br ${feature.color} text-white shadow-xl transition-transform group-hover:scale-110 group-hover:rotate-3 sm:h-16 sm:w-16`}>
                  <feature.icon className="text-xl sm:text-2xl" />
                </div>
                
                {/* Small decorative icon */}
                <feature.bgIcon className="absolute right-2 top-2 text-3xl opacity-20 text-white" />
                
                <h3 className="mb-1 text-base font-bold text-white sm:text-lg">{feature.title}</h3>
                <p className="text-xs text-white/80 sm:text-sm">{feature.desc}</p>
              </div>
            </div>
          ))}
        </div>

        {/* Memory Levels */}
        <div className="mb-8 grid grid-cols-1 gap-4 sm:grid-cols-3 sm:gap-6">
          {memoryLevels.map((level, index) => (
            <div 
              key={index}
              className="group rounded-2xl border border-emerald-200/40 bg-gradient-to-br from-[#1ec698]/80 to-[#13a89b]/80 p-4 text-center backdrop-blur-sm transition-all duration-300 hover:border-emerald-100/70 hover:bg-[#24c7a5]/70 sm:p-6"
            >
              <level.icon className={`mx-auto mb-2 text-3xl ${level.color} sm:text-4xl`} />
              <h4 className="mb-1 text-sm font-bold text-white sm:text-base">{level.level}</h4>
              <p className="text-xs text-white/70">{level.cards}</p>
              <p className="text-xs text-white/70">{level.time}</p>
              
              {/* Progress bar */}
              <div className="mt-3 h-1.5 w-full rounded-full bg-white/20">
                <div 
                  className="h-full rounded-full bg-gradient-to-r from-emerald-200 via-cyan-200 to-teal-200"
                  style={{ width: `${(index + 1) * 33}%` }}
                ></div>
              </div>
            </div>
          ))}
        </div>

        {/* Memory Rush Component Container */}
        <div className="relative rounded-3xl border border-emerald-200/50 bg-gradient-to-br from-[#1dbb95] via-[#18af95] to-[#0ea5a4] p-4 shadow-2xl shadow-teal-900/40 backdrop-blur-xl sm:p-6 lg:p-8">
          {/* Header */}
          <div className="mb-6 flex items-center justify-between border-b border-white/30 pb-4">
            <div className="flex items-center gap-3">
              <div className="relative">
                <div className="absolute -inset-1 animate-pulse rounded-xl bg-emerald-300/50 blur"></div>
                <div className="relative flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br from-emerald-300 to-cyan-300 text-teal-900 shadow-lg sm:h-14 sm:w-14">
                  <GiBrain className="text-xl sm:text-2xl" />
                </div>
              </div>
              <div>
                <h2 className="text-lg font-bold text-white sm:text-xl">Memory Rush</h2>
                <p className="flex items-center gap-1 text-xs text-white/80 sm:text-sm">
                  <RiMentalHealthFill className="text-emerald-100" />
                  Xotirangizni sinang
                </p>
              </div>
            </div>
            
            <div className="flex items-center gap-2">
              <div className="flex items-center gap-1 rounded-full bg-black/20 px-3 py-1.5 text-xs text-white">
                <FaLayerGroup className="text-emerald-100" />
                <span>3 daraja</span>
              </div>
              <div className="flex items-center gap-1 rounded-full bg-black/20 px-3 py-1.5 text-xs text-white">
                <FaHeart className="text-emerald-100" />
                <span>5 hayot</span>
              </div>
            </div>
          </div>

          {/* MemoryRush component */}
          <MemoryRush />

          {/* Tips */}
          <div className="mt-4 rounded-xl bg-black/20 p-3 text-xs text-white/90 sm:mt-6 sm:p-4 sm:text-sm">
            <div className="flex items-start gap-2">
              <GiLightBulb className="mt-0.5 text-yellow-300 text-lg" />
              <span>
                <strong className="text-white font-bold">Maslahat:</strong> Kartochkalarni eslab qolish uchun ularni guruhlarga ajrating. 
                Birinchi ochgan kartochkangizni ikkinchisi bilan bog'lang!
              </span>
            </div>
          </div>
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

export default MemoryRushPage;
