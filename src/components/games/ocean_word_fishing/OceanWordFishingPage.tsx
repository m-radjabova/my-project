import { 
  FaFish,  
  FaCrown,  
  FaStar, 
  FaUsers,
  FaVolumeUp,
  FaWaveSquare
} from "react-icons/fa";
import { 
  GiAchievement, 
  GiPodium, 
  GiFishMonster, 
  GiFishing, 
  GiFishingNet,
  GiFishingHook,
  GiWhaleTail,
  GiWaves
} from "react-icons/gi";
import { 
  MdTimer, 
  MdEmojiEvents
} from "react-icons/md";
import OceanWordFishing from "./OceanWordFishing";

function OceanWordFishingPage() {
  const oceanImg = "https://media.istockphoto.com/id/537816526/vector/underwater-world.jpg?s=612x612&w=0&k=20&c=U_1QpgfCsqkNFdbiLqFs6C-RyC5d2Eyfl5Kf8_YBgT0=";
  const gameStats = [
    { icon: FaUsers, label: "O'YINCHILAR", value: "1-4 kishi", color: "from-blue-500 to-sky-500" },
    { icon: MdTimer, label: "DAVOMIYLIK", value: "5-10 min", color: "from-sky-500 to-blue-600" },
    { icon: GiFishing, label: "BALIQLAR", value: "20+ ta", color: "from-blue-700 to-cyan-500" },
    { icon: FaWaveSquare, label: "OKEAN", value: "Sarguzasht", color: "from-blue-500 to-sky-600" },
  ];

  const features = [
    { 
      icon: GiFishMonster, 
      title: "Baliqlar ustida harflar", 
      desc: "Har bir baliqda bitta harf bor. Baliqlarni bosing va so'z yig'ing",
      color: "from-blue-500 to-sky-500",
      bgIcon: FaFish,
      stats: "20+ baliq"
    },
    { 
      icon: GiFishingHook, 
      title: "So'z yig'ish", 
      desc: "Baliqlarni ketma-ket bosing va so'zni toping",
      color: "from-sky-500 to-blue-600",
      bgIcon: GiFishingNet,
      stats: "8+ harf"
    },
    { 
      icon: FaVolumeUp, 
      title: "Okean sadosi", 
      desc: "Haqiqiy okean tovushlari bilan o'ynang",
      color: "from-blue-700 to-cyan-500",
      bgIcon: GiWaves,
      stats: "MP3 audio"
    },
  ];

  const oceanLevels = [
    { level: "SOY", words: "3-4 harfli so'zlar", time: "45 soniya", icon: FaStar, color: "from-blue-500 to-sky-500", progress: 33 },
    { level: "DENGIZ", words: "5-6 harfli so'zlar", time: "60 soniya", icon: GiFishing, color: "from-sky-500 to-blue-600", progress: 66 },
    { level: "OKEAN", words: "7+ harfli so'zlar", time: "90 soniya", icon: FaCrown, color: "from-blue-700 to-cyan-500", progress: 100 },
  ];

  return (
    <div className="relative min-h-screen w-full overflow-hidden">
      {/* Ocean Background */}
      <div 
        className="absolute inset-0 bg-gradient-to-b from-[#031525] via-[#05223f] to-[#0a1f3d]"
      >
        {/* Animated waves */}
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute -bottom-10 left-0 right-0 h-40 bg-gradient-to-t from-white/20 to-transparent animate-wave" />
          <div className="absolute -bottom-10 left-0 right-0 h-40 bg-gradient-to-t from-[#0c3b68]/35 to-transparent animate-wave-slow" style={{ animationDelay: '1s' }} />
          <div className="absolute -bottom-10 left-0 right-0 h-40 bg-gradient-to-t from-[#0b4f7a]/25 to-transparent animate-wave-slower" style={{ animationDelay: '2s' }} />
        </div>

        {/* Floating bubbles */}
        {[...Array(30)].map((_, i) => (
          <div
            key={i}
            className="absolute rounded-full bg-cyan-100/10 animate-bubble"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              width: `${5 + Math.random() * 15}px`,
              height: `${5 + Math.random() * 15}px`,
              animationDelay: `${Math.random() * 5}s`,
              animationDuration: `${3 + Math.random() * 5}s`,
            }}
          />
        ))}
      </div>

      <div className="relative z-10 mx-auto min-h-screen w-full max-w-[2000px] px-4 py-6 md:px-6 md:py-8 lg:px-8 xl:px-10">
        {/* Hero Section */}
        <div className="group relative mb-8 transform-gpu overflow-hidden rounded-3xl border border-sky-300/20 bg-gradient-to-br from-[#041628]/90 via-[#08233f]/85 to-[#0b2b4d]/85 p-6 backdrop-blur-xl shadow-2xl md:p-8 lg:p-10">
          {/* Animated Gradient Border */}
          <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-700">
            <div className="absolute inset-0 rounded-3xl bg-gradient-to-r from-[#0a2d52]/45 via-[#0a3a66]/35 to-[#0b4f7a]/30 animate-gradient" />
          </div>

          <div className="relative grid gap-8 lg:grid-cols-2 lg:gap-12 lg:items-center">
            {/* Left Content */}
            <div className="space-y-6">
              {/* Badge */}
              <div className="inline-flex items-center gap-3 rounded-2xl bg-gradient-to-r from-[#0a2d52]/40 to-[#0b4f7a]/30 px-4 py-2 border border-blue-400/30">
                <GiFishing className="text-blue-400 animate-pulse" />
                <span className="text-sm font-black text-transparent bg-gradient-to-r from-cyan-300 via-sky-300 to-blue-300 bg-clip-text">
                  OCEAN WORD FISHING
                </span>
                <div className="ml-2 flex h-2 w-2">
                  <span className="absolute inline-flex h-2 w-2 animate-ping rounded-full bg-green-400 opacity-75" />
                  <span className="relative inline-flex h-2 w-2 rounded-full bg-green-500" />
                </div>
              </div>

              {/* Title */}
              <h1 className="text-4xl font-black leading-tight md:text-5xl lg:text-6xl">
                <span className="bg-gradient-to-r from-sky-100 via-blue-100 to-cyan-200 bg-clip-text text-transparent">
                  Okean
                </span>
                <br />
                <span className="bg-gradient-to-r from-cyan-300 via-sky-300 to-blue-300 bg-clip-text text-transparent">
                  so'z baliqchiligi
                </span>
              </h1>

              {/* Description */}
              <p className="max-w-xl text-base text-slate-100/90 md:text-lg leading-relaxed">
                Baliqlar ustidagi harflardan so'zlar yig'ing. Har bir baliqni bosib, 
                kerakli harflarni to'plang va so'zni toping. Okean sadosi bilan o'ynang!
              </p>

              {/* Stats Grid */}
              <div className="grid grid-cols-2 gap-3 md:gap-4">
                {gameStats.map((stat, index) => (
                  <div
                    key={index}
                    className="group/stat relative transform-gpu overflow-hidden rounded-xl border border-blue-500/20 bg-blue-950/30 p-4 backdrop-blur-sm transition-all hover:scale-105 hover:bg-blue-900/40"
                  >
                    <div className={`absolute inset-0 bg-gradient-to-r ${stat.color} opacity-0 group-hover/stat:opacity-20 transition-opacity`} />
                    <div className="relative">
                      <div className={`mb-2 inline-flex rounded-lg bg-gradient-to-r ${stat.color} p-2`}>
                        <stat.icon className="text-lg text-white" />
                      </div>
                      <p className="text-xs font-bold text-blue-200/70">{stat.label}</p>
                      <p className="text-sm font-black text-white">{stat.value}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Right Content - Image */}
            <div className="relative">
              {/* Decorative Elements */}
              <div className="absolute -inset-4 rounded-3xl bg-gradient-to-r from-[#0a2d52]/45 via-[#0a3a66]/35 to-[#0b4f7a]/30 blur-2xl animate-pulse" />
              <div className="absolute -top-6 -right-6 h-32 w-32 rounded-full bg-blue-500/20 blur-xl animate-ping" />
              
              {/* Image Container */}
              <div className="relative transform-gpu overflow-hidden rounded-2xl border-2 border-blue-500/30 shadow-2xl transition-all group-hover:scale-[1.02] group-hover:border-blue-400/50">
                <div className="absolute inset-0 bg-gradient-to-t from-[#0a2a3a] via-transparent to-transparent z-10" />
                <img 
                  src={oceanImg} 
                  alt="Ocean Word Fishing Game" 
                  className="h-[300px] w-full object-cover md:h-[400px] lg:h-[450px]"
                />
                
                {/* Overlay Content */}
                <div className="absolute bottom-0 left-0 right-0 z-20 p-6">
                  <div className="inline-flex items-center gap-3 rounded-2xl bg-black/50 backdrop-blur-md px-4 py-2 border border-blue-400/30">
                    <GiFishingNet className="text-blue-400" />
                    <span className="text-sm font-black text-white">OCEAN FISHING</span>
                    <div className="ml-2 flex gap-1">
                      <span className="h-2 w-2 rounded-full bg-blue-400 animate-pulse" />
                      <span className="h-2 w-2 rounded-full bg-cyan-400 animate-pulse delay-150" />
                      <span className="h-2 w-2 rounded-full bg-teal-400 animate-pulse delay-300" />
                    </div>
                  </div>
                </div>

                {/* Floating Badges */}
                <div className="absolute top-4 right-4 z-20 flex gap-2">
                  <div className="rounded-full bg-gradient-to-r from-blue-700 to-cyan-600 px-3 py-1 text-xs font-bold text-white shadow-lg">
                    20+ BALIQ
                  </div>
                  <div className="rounded-full bg-gradient-to-r from-cyan-700 to-blue-700 px-3 py-1 text-xs font-bold text-white shadow-lg">
                    OKEAN SADOSI
                  </div>
                </div>
              </div>

              {/* Stats Overlay */}
              <div className="absolute -bottom-4 -left-4 z-30 flex gap-2">
                <div className="rounded-xl bg-gradient-to-r from-blue-700 to-cyan-600 px-4 py-2 shadow-2xl">
                  <p className="text-xs font-bold text-white/80">HARFLAR</p>
                  <p className="text-lg font-black text-white">A-Z</p>
                </div>
                <div className="rounded-xl bg-gradient-to-r from-cyan-700 to-blue-700 px-4 py-2 shadow-2xl">
                  <p className="text-xs font-bold text-white/80">SO'ZLAR</p>
                  <p className="text-lg font-black text-white">8+</p>
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
              className="group relative transform-gpu overflow-hidden rounded-2xl border border-blue-400/25 bg-gradient-to-br from-[#041628]/75 to-[#08233f]/65 p-6 backdrop-blur-sm transition-all duration-500 hover:scale-105 hover:border-sky-300/35"
            >
              {/* Animated Background */}
              <div className={`absolute inset-0 bg-gradient-to-r ${feature.color} opacity-0 group-hover:opacity-10 transition-opacity`} />
              
              {/* Decorative Icon */}
              <feature.bgIcon className="absolute right-2 top-2 text-4xl text-blue-500/20 group-hover:text-blue-400/30 transition-all group-hover:scale-110" />
              
              {/* Icon */}
              <div className={`relative mb-4 flex h-16 w-16 items-center justify-center rounded-xl bg-gradient-to-r ${feature.color} text-white shadow-xl transition-transform group-hover:scale-110 group-hover:rotate-3`}>
                <feature.icon className="text-2xl" />
              </div>
              
              {/* Content */}
              <h3 className="relative mb-2 text-lg font-black text-white">{feature.title}</h3>
              <p className="relative mb-3 text-sm text-blue-200/80">{feature.desc}</p>
              
              {/* Stats */}
              <div className="relative flex items-center gap-2">
                <span className="text-xs font-bold text-blue-300">{feature.stats}</span>
                <div className="h-1 flex-1 rounded-full bg-blue-500/20">
                  <div className={`h-full rounded-full bg-gradient-to-r ${feature.color}`} style={{ width: '75%' }} />
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Ocean Levels */}
        <div className="mb-8 grid grid-cols-1 gap-4 md:grid-cols-3 md:gap-6">
          {oceanLevels.map((level, index) => (
            <div
              key={index}
              className="group relative transform-gpu overflow-hidden rounded-2xl border border-blue-400/25 bg-gradient-to-br from-[#041628]/75 to-[#08233f]/65 p-6 backdrop-blur-sm transition-all hover:border-sky-300/35"
            >
              {/* Gradient Background */}
              <div className={`absolute inset-0 bg-gradient-to-r ${level.color} opacity-0 group-hover:opacity-10 transition-opacity`} />
              
              {/* Icon */}
              <level.icon className={`relative mx-auto mb-3 text-4xl bg-gradient-to-r ${level.color} bg-clip-text text-transparent`} />
              
              {/* Title */}
              <h4 className="relative mb-2 text-center text-base font-black text-white">{level.level}</h4>
              <p className="relative mb-1 text-center text-xs text-blue-200/70">{level.words}</p>
              <p className="relative mb-4 text-center text-xs text-blue-200/70">{level.time}</p>
              
              {/* Progress Bar */}
              <div className="relative h-2 rounded-full bg-blue-500/20">
                <div 
                  className={`h-full rounded-full bg-gradient-to-r ${level.color} transition-all group-hover:animate-pulse`}
                  style={{ width: `${level.progress}%` }}
                />
              </div>
            </div>
          ))}
        </div>

        {/* OceanWordFishing Component Container */}
        <div className="relative">
          {/* Decorative Elements */}
          <div className="absolute -inset-4 rounded-3xl bg-gradient-to-r from-[#0a2d52]/35 via-[#0a3a66]/25 to-[#0b4f7a]/15 blur-3xl" />
          
          {/* Main Game Container */}
          <div className="relative transform-gpu overflow-hidden rounded-3xl border border-blue-400/30 bg-gradient-to-br from-[#041628]/85 via-[#08233f]/70 to-[#0b2b4d]/65 p-6 backdrop-blur-xl shadow-2xl md:p-8">
            {/* Header */}
            <div className="mb-6 flex items-center justify-between border-b border-blue-500/30 pb-4">
              <div className="flex items-center gap-4">
                <div className="relative">
                  <div className="absolute -inset-1 animate-pulse rounded-xl bg-blue-500/50 blur" />
                  <div className="relative flex h-14 w-14 items-center justify-center rounded-xl bg-gradient-to-r from-blue-700 to-cyan-500">
                    <FaFish className="text-2xl text-white" />
                  </div>
                </div>
                <div>
                  <h2 className="text-xl font-black text-white">Ocean Word Fishing</h2>
                  <p className="flex items-center gap-2 text-sm text-blue-200/80">
                    <GiFishingHook className="text-blue-400" />
                    Baliqlar ustidagi harflardan so'z yig'ish
                  </p>
                </div>
              </div>
              
              <div className="flex items-center gap-3">
                <div className="flex items-center gap-2 rounded-full bg-blue-500/20 px-3 py-1.5 border border-blue-400/30">
                  <FaWaveSquare className="text-blue-400" />
                  <span className="text-xs font-bold text-white">Okean</span>
                </div>
                <div className="flex items-center gap-2 rounded-full bg-blue-500/20 px-3 py-1.5 border border-blue-400/30">
                  <GiWhaleTail className="text-cyan-400" />
                  <span className="text-xs font-bold text-white">Baliqlar</span>
                </div>
              </div>
            </div>

            {/* OceanWordFishing Component */}
            <OceanWordFishing />
          </div>
        </div>

        {/* Footer */}
        <div className="relative mt-10 flex justify-center gap-6 text-5xl text-blue-500/20 md:text-6xl">
          <MdEmojiEvents className="animate-bounce" style={{ animationDelay: '0s' }} />
          <GiAchievement className="animate-bounce" style={{ animationDelay: '0.2s' }} />
          <FaCrown className="animate-bounce" style={{ animationDelay: '0.4s' }} />
          <GiPodium className="animate-bounce" style={{ animationDelay: '0.6s' }} />
          <FaStar className="animate-bounce" style={{ animationDelay: '0.8s' }} />
        </div>
      </div>

      <style jsx>{`
        @keyframes wave {
          0%, 100% { transform: translateY(0) translateX(0); }
          25% { transform: translateY(-5px) translateX(5px); }
          50% { transform: translateY(-10px) translateX(10px); }
          75% { transform: translateY(-5px) translateX(5px); }
        }
        
        @keyframes wave-slow {
          0%, 100% { transform: translateY(0) translateX(0); }
          25% { transform: translateY(-8px) translateX(-5px); }
          50% { transform: translateY(-15px) translateX(-10px); }
          75% { transform: translateY(-8px) translateX(-5px); }
        }
        
        @keyframes wave-slower {
          0%, 100% { transform: translateY(0) translateX(0); }
          25% { transform: translateY(-12px) translateX(8px); }
          50% { transform: translateY(-20px) translateX(15px); }
          75% { transform: translateY(-12px) translateX(8px); }
        }
        
        @keyframes bubble {
          0% { transform: translateY(100vh) scale(0); opacity: 0; }
          50% { opacity: 0.5; }
          100% { transform: translateY(-100px) scale(1); opacity: 0; }
        }
        
        @keyframes float {
          0%, 100% { transform: translateY(0px) rotate(0deg); }
          50% { transform: translateY(-20px) rotate(5deg); }
        }
        
        @keyframes gradient {
          0% { background-position: 0% 50%; }
          50% { background-position: 100% 50%; }
          100% { background-position: 0% 50%; }
        }
        
        .animate-wave {
          animation: wave 8s ease-in-out infinite;
        }
        
        .animate-wave-slow {
          animation: wave-slow 12s ease-in-out infinite;
        }
        
        .animate-wave-slower {
          animation: wave-slower 15s ease-in-out infinite;
        }
        
        .animate-bubble {
          animation: bubble 10s ease-out infinite;
        }
      `}</style>
    </div>
  );
}

export default OceanWordFishingPage;

