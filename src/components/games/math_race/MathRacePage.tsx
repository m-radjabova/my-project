import { 
  FaCar, 
  FaCrown, 
  FaStar, 
  FaUsers,  
  FaBolt,
  FaFlagCheckered,
  FaRoad
} from "react-icons/fa";
import { 
  GiAchievement, 
  GiPodium, 
  GiRaceCar, 
  GiCheckeredFlag,
  GiCarWheel,
  GiSpeedometer
} from "react-icons/gi";
import { 
  MdTimer, 
  MdEmojiEvents, 
  MdSpeed,
  MdNumbers
} from "react-icons/md";
import MathRace from "./MathRace";

function MathRacePage() {
  const raceImg = "https://media.istockphoto.com/id/1409623927/vector/formula-racing-sport-car-reach-on-race-circuit-the-finish-line-cartoon-illustration-to-win.jpg?s=612x612&w=0&k=20&c=n5leemMDNJv1g_EFkTJxW9T5XiVQXx0CIA6R2z6Op1U="
  const gameStats = [
    { icon: FaUsers, label: "O'YINCHILAR", value: "2 kishi", color: "from-yellow-400 to-orange-400" },
    { icon: MdTimer, label: "DAVOMIYLIK", value: "5-10 min", color: "from-orange-400 to-red-400" },
    { icon: GiRaceCar, label: "MASHINALAR", value: "2 ta", color: "from-red-400 to-yellow-400" },
    { icon: MdNumbers, label: "MISOLLAR", value: "10+ ta", color: "from-yellow-400 to-red-400" },
  ];

  const features = [
    { 
      icon: GiRaceCar, 
      title: "Tezkor poyga", 
      desc: "Har to'g'ri javobda mashinangiz oldinga yuradi",
      color: "from-yellow-400 to-orange-400",
      bgIcon: FaCar,
      stats: "8% harakat"
    },
    { 
      icon: MdSpeed, 
      title: "Vaqt bonusi", 
      desc: "Tez javob bersangiz, qo'shimcha harakat",
      color: "from-orange-400 to-red-400",
      bgIcon: FaBolt,
      stats: "0.2× vaqt"
    },
    { 
      icon: FaFlagCheckered, 
      title: "Marraga birinchi yeting", 
      desc: "100% masofani birinchi bosib o'ting",
      color: "from-red-400 to-yellow-400",
      bgIcon: GiCheckeredFlag,
      stats: "100% track"
    },
  ];

  const raceLevels = [
    { level: "OSON", questions: "5+5", time: "20 soniya", icon: FaStar, color: "from-green-400 to-emerald-400", progress: 33 },
    { level: "O'RTACHA", questions: "7×6", time: "15 soniya", icon: GiSpeedometer, color: "from-yellow-400 to-orange-400", progress: 66 },
    { level: "QIYIN", questions: "12×12", time: "10 soniya", icon: FaCrown, color: "from-red-400 to-rose-400", progress: 100 },
  ];

  return (
    <div className="relative min-h-screen w-full overflow-hidden bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
      {/* Race track background */}
      <div className="absolute inset-0">
        {/* Asphalt texture */}
        <div className="absolute inset-0 opacity-5" style={{
          backgroundImage: 'repeating-linear-gradient(45deg, #fff 0px, #fff 2px, transparent 2px, transparent 20px)',
        }} />
        
        {/* Lane lines */}
        <div className="absolute left-0 right-0 top-1/3 h-0.5 bg-gradient-to-r from-transparent via-yellow-500/20 to-transparent" />
        <div className="absolute left-0 right-0 top-2/3 h-0.5 bg-gradient-to-r from-transparent via-yellow-500/20 to-transparent" />
        
        {/* Moving lights effect */}
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute -left-10 top-0 h-full w-20 bg-gradient-to-r from-transparent via-white/5 to-transparent animate-sweep" />
        </div>
      </div>

      <div className="relative z-10 mx-auto min-h-screen w-full max-w-[2000px] px-4 py-6 md:px-6 md:py-8 lg:px-8 xl:px-10">
        {/* Hero Section */}
        <div className="group relative mb-8 transform-gpu overflow-hidden rounded-3xl border border-yellow-500/20 bg-gradient-to-br from-slate-800/90 via-slate-800/90 to-slate-900/90 p-6 backdrop-blur-xl shadow-2xl md:p-8 lg:p-10">
          {/* Animated Gradient Border */}
          <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-700">
            <div className="absolute inset-0 rounded-3xl bg-gradient-to-r from-yellow-500/30 via-orange-500/30 to-red-500/30 animate-gradient" />
          </div>

          <div className="relative grid gap-8 lg:grid-cols-2 lg:gap-12 lg:items-center">
            {/* Left Content */}
            <div className="space-y-6">
              {/* Badge */}
              <div className="inline-flex items-center gap-3 rounded-2xl bg-gradient-to-r from-yellow-500/20 to-orange-500/20 px-4 py-2 border border-yellow-500/30">
                <GiRaceCar className="text-yellow-400 animate-pulse" />
                <span className="text-sm font-black text-transparent bg-gradient-to-r from-yellow-400 via-orange-400 to-red-400 bg-clip-text">
                  MATH RACE
                </span>
                <div className="ml-2 flex h-2 w-2">
                  <span className="absolute inline-flex h-2 w-2 animate-ping rounded-full bg-green-400 opacity-75" />
                  <span className="relative inline-flex h-2 w-2 rounded-full bg-green-500" />
                </div>
              </div>

              {/* Title */}
              <h1 className="text-4xl font-black leading-tight md:text-5xl lg:text-6xl">
                <span className="bg-gradient-to-r from-yellow-200 via-orange-200 to-red-200 bg-clip-text text-transparent">
                  Matematik
                </span>
                <br />
                <span className="bg-gradient-to-r from-yellow-400 via-orange-400 to-red-400 bg-clip-text text-transparent">
                  poyga
                </span>
              </h1>

              {/* Description */}
              <p className="max-w-xl text-base text-gray-300 md:text-lg leading-relaxed">
                Ikki o'yinchi tezkor misol ishlash musobaqasida qatnashing. 
                Kim tez va to'g'ri javob bersa, uning mashinasi oldinga yuradi!
              </p>

              {/* Stats Grid */}
              <div className="grid grid-cols-2 gap-3 md:gap-4">
                {gameStats.map((stat, index) => (
                  <div
                    key={index}
                    className="group/stat relative transform-gpu overflow-hidden rounded-xl border border-yellow-500/20 bg-slate-800/50 p-4 backdrop-blur-sm transition-all hover:scale-105 hover:bg-slate-700/50"
                  >
                    <div className={`absolute inset-0 bg-gradient-to-r ${stat.color} opacity-0 group-hover/stat:opacity-20 transition-opacity`} />
                    <div className="relative">
                      <div className={`mb-2 inline-flex rounded-lg bg-gradient-to-r ${stat.color} p-2`}>
                        <stat.icon className="text-lg text-white" />
                      </div>
                      <p className="text-xs font-bold text-gray-400">{stat.label}</p>
                      <p className="text-sm font-black text-white">{stat.value}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Right Content - Image */}
            <div className="relative">
              {/* Decorative Elements */}
              <div className="absolute -inset-4 rounded-3xl bg-gradient-to-r from-yellow-500/30 via-orange-500/30 to-red-500/30 blur-2xl animate-pulse" />
              <div className="absolute -top-6 -right-6 h-32 w-32 rounded-full bg-yellow-500/20 blur-xl animate-ping" />
              
              {/* Image Container */}
              <div className="relative transform-gpu overflow-hidden rounded-2xl border-2 border-yellow-500/30 shadow-2xl transition-all group-hover:scale-[1.02] group-hover:border-yellow-400/50">
                <div className="absolute inset-0 bg-gradient-to-t from-slate-900 via-transparent to-transparent z-10" />
                <img 
                  src={raceImg} 
                  alt="Math Race Game" 
                  className="h-[300px] w-full object-cover md:h-[400px] lg:h-[450px]"
                />
                
                {/* Overlay Content */}
                <div className="absolute bottom-0 left-0 right-0 z-20 p-6">
                  <div className="inline-flex items-center gap-3 rounded-2xl bg-black/50 backdrop-blur-md px-4 py-2 border border-yellow-500/30">
                    <GiCheckeredFlag className="text-yellow-400" />
                    <span className="text-sm font-black text-white">MATH RACE</span>
                    <div className="ml-2 flex gap-1">
                      <span className="h-2 w-2 rounded-full bg-yellow-400 animate-pulse" />
                      <span className="h-2 w-2 rounded-full bg-orange-400 animate-pulse delay-150" />
                      <span className="h-2 w-2 rounded-full bg-red-400 animate-pulse delay-300" />
                    </div>
                  </div>
                </div>

                {/* Floating Badges */}
                <div className="absolute top-4 right-4 z-20 flex gap-2">
                  <div className="rounded-full bg-gradient-to-r from-yellow-600 to-orange-600 px-3 py-1 text-xs font-bold text-white shadow-lg">
                    2 O'YINCHI
                  </div>
                  <div className="rounded-full bg-gradient-to-r from-orange-600 to-red-600 px-3 py-1 text-xs font-bold text-white shadow-lg">
                    15s ROUND
                  </div>
                </div>
              </div>

              {/* Stats Overlay */}
              <div className="absolute -bottom-4 -left-4 z-30 flex gap-2">
                <div className="rounded-xl bg-gradient-to-r from-yellow-600 to-orange-600 px-4 py-2 shadow-2xl">
                  <p className="text-xs font-bold text-white/80">TEZLIK</p>
                  <p className="text-lg font-black text-white">8%</p>
                </div>
                <div className="rounded-xl bg-gradient-to-r from-orange-600 to-red-600 px-4 py-2 shadow-2xl">
                  <p className="text-xs font-bold text-white/80">BONUS</p>
                  <p className="text-lg font-black text-white">0.2×</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Features Grid */}
        <div className="mb-8 grid grid-cols-1 gap-4 md:grid-cols-3 md:gap-6">
          {features.map((feature, index) => (
            <div
              key={index}
              className="group relative transform-gpu overflow-hidden rounded-2xl border border-yellow-500/20 bg-gradient-to-br from-slate-800/50 to-slate-800/50 p-6 backdrop-blur-sm transition-all duration-500 hover:scale-105 hover:border-yellow-400/30"
            >
              {/* Animated Background */}
              <div className={`absolute inset-0 bg-gradient-to-r ${feature.color} opacity-0 group-hover:opacity-10 transition-opacity`} />
              
              {/* Decorative Icon */}
              <feature.bgIcon className="absolute right-2 top-2 text-4xl text-yellow-500/20 group-hover:text-yellow-400/30 transition-all group-hover:scale-110" />
              
              {/* Icon */}
              <div className={`relative mb-4 flex h-16 w-16 items-center justify-center rounded-xl bg-gradient-to-r ${feature.color} text-white shadow-xl transition-transform group-hover:scale-110 group-hover:rotate-3`}>
                <feature.icon className="text-2xl" />
              </div>
              
              {/* Content */}
              <h3 className="relative mb-2 text-lg font-black text-white">{feature.title}</h3>
              <p className="relative mb-3 text-sm text-gray-300">{feature.desc}</p>
              
              {/* Stats */}
              <div className="relative flex items-center gap-2">
                <span className="text-xs font-bold text-yellow-400">{feature.stats}</span>
                <div className="h-1 flex-1 rounded-full bg-slate-700">
                  <div className={`h-full rounded-full bg-gradient-to-r ${feature.color}`} style={{ width: '75%' }} />
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Difficulty Levels */}
        <div className="mb-8 grid grid-cols-1 gap-4 md:grid-cols-3 md:gap-6">
          {raceLevels.map((level, index) => (
            <div
              key={index}
              className="group relative transform-gpu overflow-hidden rounded-2xl border border-yellow-500/20 bg-gradient-to-br from-slate-800/50 to-slate-800/50 p-6 backdrop-blur-sm transition-all hover:border-yellow-400/30"
            >
              {/* Gradient Background */}
              <div className={`absolute inset-0 bg-gradient-to-r ${level.color} opacity-0 group-hover:opacity-10 transition-opacity`} />
              
              {/* Icon */}
              <level.icon className={`relative mx-auto mb-3 text-4xl bg-gradient-to-r ${level.color} bg-clip-text text-transparent`} />
              
              {/* Title */}
              <h4 className="relative mb-2 text-center text-base font-black text-white">{level.level}</h4>
              <p className="relative mb-1 text-center text-xs text-gray-400">{level.questions}</p>
              <p className="relative mb-4 text-center text-xs text-gray-400">{level.time}</p>
              
              {/* Progress Bar */}
              <div className="relative h-2 rounded-full bg-slate-700">
                <div 
                  className={`h-full rounded-full bg-gradient-to-r ${level.color} transition-all group-hover:animate-pulse`}
                  style={{ width: `${level.progress}%` }}
                />
              </div>
            </div>
          ))}
        </div>

        {/* MathRace Component Container */}
        <div className="relative">
          {/* Decorative Elements */}
          <div className="absolute -inset-4 rounded-3xl bg-gradient-to-r from-yellow-500/20 via-orange-500/20 to-red-500/20 blur-3xl" />
          
          {/* Main Game Container */}
          <div className="relative transform-gpu overflow-hidden rounded-3xl border border-yellow-500/30 bg-gradient-to-br from-slate-800/90 via-slate-800/90 to-slate-900/90 p-6 backdrop-blur-xl shadow-2xl md:p-8">
            {/* Header */}
            <div className="mb-6 flex items-center justify-between border-b border-yellow-500/30 pb-4">
              <div className="flex items-center gap-4">
                <div className="relative">
                  <div className="absolute -inset-1 animate-pulse rounded-xl bg-yellow-500/50 blur" />
                  <div className="relative flex h-14 w-14 items-center justify-center rounded-xl bg-gradient-to-r from-yellow-500 to-orange-500">
                    <GiRaceCar className="text-2xl text-white" />
                  </div>
                </div>
                <div>
                  <h2 className="text-xl font-black text-white">Math Race</h2>
                  <p className="flex items-center gap-2 text-sm text-gray-300">
                    <GiCarWheel className="text-yellow-400" />
                    Tezkor misollar · 2 o'yinchi
                  </p>
                </div>
              </div>
              
              <div className="flex items-center gap-3">
                <div className="flex items-center gap-2 rounded-full bg-yellow-500/20 px-3 py-1.5 border border-yellow-500/30">
                  <FaRoad className="text-yellow-400" />
                  <span className="text-xs font-bold text-white">100% track</span>
                </div>
                <div className="flex items-center gap-2 rounded-full bg-yellow-500/20 px-3 py-1.5 border border-yellow-500/30">
                  <GiSpeedometer className="text-orange-400" />
                  <span className="text-xs font-bold text-white">15s</span>
                </div>
              </div>
            </div>

            {/* MathRace Component */}
            <MathRace />
          </div>
        </div>

        {/* Footer */}
        <div className="relative mt-10 flex justify-center gap-6 text-5xl text-yellow-500/20 md:text-6xl">
          <MdEmojiEvents className="animate-bounce" style={{ animationDelay: '0s' }} />
          <GiAchievement className="animate-bounce" style={{ animationDelay: '0.2s' }} />
          <FaCrown className="animate-bounce" style={{ animationDelay: '0.4s' }} />
          <GiPodium className="animate-bounce" style={{ animationDelay: '0.6s' }} />
          <FaStar className="animate-bounce" style={{ animationDelay: '0.8s' }} />
        </div>
      </div>

      <style jsx>{`
        @keyframes sweep {
          0% { transform: translateX(-100%); }
          100% { transform: translateX(500%); }
        }
        
        .animate-sweep {
          animation: sweep 8s linear infinite;
        }
      `}</style>
    </div>
  );
}

export default MathRacePage;