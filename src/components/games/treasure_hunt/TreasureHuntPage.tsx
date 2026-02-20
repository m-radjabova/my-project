import {
  FaCompass,
  FaCrown,
  FaGem,
  FaMapMarkedAlt,
  FaStar,
  FaTrophy,
  FaUsers,
  FaBolt
} from "react-icons/fa";
import { GiTreasureMap, GiChest, GiPathDistance, GiAchievement, GiPodium, GiCompass, GiShipWheel } from "react-icons/gi";
import { MdEmojiEvents } from "react-icons/md";
import { RiTreasureMapFill, RiCompassDiscoverFill } from "react-icons/ri";
import TreasureHunt from "./TreasureHunt";

function TreasureHuntPage() {
  const treasureHuntImg =
    "https://media.istockphoto.com/id/1341261769/photo/treasure-map.jpg?s=612x612&w=0&k=20&c=JnZD0II52_tMPZ-U_emWhZ9GfRu92SdWsZFFy8ohKw8=";

  const gameStats = [
    { icon: FaUsers, label: "O'YINCHILAR", value: "1-3 kishi", color: "from-amber-400 to-yellow-400" },
    { icon: GiPathDistance, label: "NODELAR", value: "12 ta", color: "from-amber-500 to-orange-400" },
    { icon: FaTrophy, label: "MAKSIMUM", value: "1500+ ball", color: "from-yellow-400 to-amber-500" },
    { icon: FaCompass, label: "TOPSHIRIQ", value: "Kreativ", color: "from-orange-400 to-amber-400" },
  ];

  const features = [
    {
      icon: FaMapMarkedAlt,
      title: "Xarita bo'ylab yurish",
      desc: "Har bosqichda yangi hikoya va topishmoq kutadi",
      color: "from-amber-400 to-yellow-400",
      bgIcon: RiTreasureMapFill,
      stats: "12 node"
    },
    {
      icon: FaGem,
      title: "Ball va bonus",
      desc: "Tez javob bersangiz speed bonus, ba'zida x2 reward",
      color: "from-yellow-400 to-amber-500",
      bgIcon: FaBolt,
      stats: "x2 bonus"
    },
    {
      icon: GiChest,
      title: "Yakuniy xazina",
      desc: "Oxirida natija, reyting va qayta o'ynash imkoniyati",
      color: "from-amber-500 to-orange-400",
      bgIcon: FaCrown,
      stats: "Grand prize"
    },
  ];

  const treasureLevels = [
    { level: "BOSHLANG'ICH", reward: "Bronza sandiq", time: "5-7 min", icon: FaStar, color: "from-amber-400 to-yellow-400", progress: 33 },
    { level: "O'RTA", reward: "Kumush sandiq", time: "8-10 min", icon: FaGem, color: "from-yellow-400 to-amber-500", progress: 66 },
    { level: "PROFESSIONAL", reward: "Oltin sandiq", time: "12 min", icon: FaCrown, color: "from-amber-500 to-orange-400", progress: 100 },
  ];

  return (
    <div className="relative min-h-screen w-full overflow-hidden bg-gradient-to-br from-[#2d1a0a] via-[#4a2c14] to-[#6b3f1c] [&_button]:cursor-pointer [&_button]:transition-all [&_button]:duration-200 [&_button:hover]:brightness-110 [&_button:disabled]:cursor-not-allowed">
      {/* Animated Background */}
      <div className="absolute inset-0 overflow-hidden">
        {/* Gradient Orbs */}
        <div className="absolute -top-40 -left-40 h-[600px] w-[600px] animate-pulse rounded-full bg-amber-700/20 blur-3xl" />
        <div className="absolute -bottom-40 -right-40 h-[600px] w-[600px] animate-pulse rounded-full bg-orange-700/20 blur-3xl delay-1000" />
        <div className="absolute top-1/3 left-1/3 h-[500px] w-[500px] animate-pulse rounded-full bg-yellow-700/10 blur-3xl delay-500" />
        
        {/* Floating Particles */}
        {[...Array(40)].map((_, i) => (
          <div
            key={i}
            className="absolute h-1.5 w-1.5 rounded-full bg-amber-200/20 animate-float"
            style={{
              top: `${Math.random() * 100}%`,
              left: `${Math.random() * 100}%`,
              animationDelay: `${Math.random() * 5}s`,
              animationDuration: `${5 + Math.random() * 10}s`,
              opacity: 0.2 + Math.random() * 0.4
            }}
          />
        ))}

        {/* Treasure Map Grid */}
        <div className="absolute inset-0" style={{
          backgroundImage: 'radial-gradient(circle at 2px 2px, rgba(245, 158, 11, 0.05) 2px, transparent 0)',
          backgroundSize: '50px 50px'
        }} />

        {/* Treasure Icons Background */}
        <GiTreasureMap className="absolute left-[5%] top-[15%] animate-float text-8xl text-amber-600/5" />
        <GiChest className="absolute right-[8%] bottom-[20%] animate-float-delayed text-7xl text-yellow-600/5" />
        <FaCrown className="absolute left-[15%] bottom-[10%] animate-float-slow text-7xl text-orange-600/5" />
        <GiCompass className="absolute right-[12%] top-[25%] animate-float text-8xl text-amber-600/5" />
      </div>

      <div className="relative z-10 mx-auto min-h-screen w-full max-w-[2000px] px-4 py-6 md:px-6 md:py-8 lg:px-8 xl:px-10">
        {/* Hero Section */}
        <div className="group relative mb-8 transform-gpu overflow-hidden rounded-3xl border border-amber-500/20 bg-gradient-to-br from-amber-900/40 via-yellow-900/40 to-orange-900/40 p-6 backdrop-blur-xl shadow-2xl md:p-8 lg:p-10">
          {/* Animated Gradient Border */}
          <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-700">
            <div className="absolute inset-0 rounded-3xl bg-gradient-to-r from-amber-500/30 via-yellow-500/30 to-orange-500/30" />
          </div>

          <div className="relative grid gap-8 lg:grid-cols-2 lg:gap-12 lg:items-center">
            {/* Left Content */}
            <div className="space-y-6">
              {/* Badge */}
              <div className="inline-flex items-center gap-3 rounded-2xl bg-gradient-to-r from-amber-500/20 to-yellow-500/20 px-4 py-2 border border-amber-500/30">
                <GiTreasureMap className="text-amber-400 animate-pulse" />
                <span className="text-sm font-black text-transparent bg-gradient-to-r from-amber-400 via-yellow-400 to-orange-400 bg-clip-text">
                  TREASURE HUNT ADVENTURE
                </span>
                <div className="ml-2 flex h-2 w-2">
                  <span className="absolute inline-flex h-2 w-2 animate-ping rounded-full bg-green-400 opacity-75" />
                  <span className="relative inline-flex h-2 w-2 rounded-full bg-green-500" />
                </div>
              </div>

              {/* Title */}
              <h1 className="text-4xl font-black leading-tight md:text-5xl lg:text-6xl">
                <span className="bg-gradient-to-r from-amber-200 via-yellow-200 to-orange-200 bg-clip-text text-transparent">
                  Xazina
                </span>
                <br />
                <span className="bg-gradient-to-r from-amber-400 via-yellow-400 to-orange-400 bg-clip-text text-transparent">
                  izlovchilar
                </span>
              </h1>

              {/* Description */}
              <p className="max-w-xl text-base text-amber-100/80 md:text-lg leading-relaxed">
                Xarita bo'ylab yurib, topishmoqlarni yeching va yakunda xazinani qo'lga kiriting.
                Tezlik, mantiq va diqqat hammasi kerak bo'ladi.
              </p>

              {/* Stats Grid */}
              <div className="grid grid-cols-2 gap-3 md:gap-4">
                {gameStats.map((stat, index) => (
                  <div
                    key={index}
                    className="group/stat relative transform-gpu overflow-hidden rounded-xl border border-amber-500/20 bg-amber-950/30 p-4 backdrop-blur-sm transition-all hover:scale-105 hover:bg-amber-900/40"
                  >
                    <div className={`absolute inset-0 bg-gradient-to-r ${stat.color} opacity-0 group-hover/stat:opacity-20 transition-opacity`} />
                    <div className="relative">
                      <div className={`mb-2 inline-flex rounded-lg bg-gradient-to-r ${stat.color} p-2`}>
                        <stat.icon className="text-lg text-white" />
                      </div>
                      <p className="text-xs font-bold text-amber-200/70">{stat.label}</p>
                      <p className="text-sm font-black text-white">{stat.value}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Right Content - Image */}
            <div className="relative">
              {/* Decorative Elements */}
              <div className="absolute -inset-4 rounded-3xl bg-gradient-to-r from-amber-500/30 via-yellow-500/30 to-orange-500/30 blur-2xl animate-pulse" />
              <div className="absolute -top-6 -right-6 h-32 w-32 rounded-full bg-amber-500/20 blur-xl animate-ping" />
              
              {/* Image Container */}
              <div className="relative transform-gpu overflow-hidden rounded-2xl border-2 border-amber-500/30 shadow-2xl transition-all group-hover:scale-[1.02] group-hover:border-amber-400/50">
                <div className="absolute inset-0 bg-gradient-to-t from-[#2d1a0a] via-transparent to-transparent z-10" />
                <img 
                  src={treasureHuntImg} 
                  alt="Treasure Hunt Game" 
                  className="h-[300px] w-full object-cover md:h-[400px] lg:h-[450px]"
                />
                
                {/* Overlay Content */}
                <div className="absolute bottom-0 left-0 right-0 z-20 p-6">
                  <div className="inline-flex items-center gap-3 rounded-2xl bg-black/50 backdrop-blur-md px-4 py-2 border border-amber-500/30">
                    <GiShipWheel className="text-amber-400" />
                    <span className="text-sm font-black text-white">SARGUZASHT O'YINI</span>
                    <div className="ml-2 flex gap-1">
                      <span className="h-2 w-2 rounded-full bg-amber-400 animate-pulse" />
                      <span className="h-2 w-2 rounded-full bg-yellow-400 animate-pulse delay-150" />
                      <span className="h-2 w-2 rounded-full bg-orange-400 animate-pulse delay-300" />
                    </div>
                  </div>
                </div>

                {/* Floating Badges */}
                <div className="absolute top-4 right-4 z-20 flex gap-2">
                  <div className="rounded-full bg-gradient-to-r from-amber-600 to-yellow-600 px-3 py-1 text-xs font-bold text-white shadow-lg">
                    4.8 ★
                  </div>
                  <div className="rounded-full bg-gradient-to-r from-yellow-600 to-orange-600 px-3 py-1 text-xs font-bold text-white shadow-lg">
                    1.2k+ o'ynagan
                  </div>
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
              className="group relative transform-gpu overflow-hidden rounded-2xl border border-amber-500/20 bg-gradient-to-br from-amber-950/30 to-yellow-950/30 p-6 backdrop-blur-sm transition-all duration-500 hover:scale-105 hover:border-amber-400/30"
            >
              {/* Animated Background */}
              <div className={`absolute inset-0 bg-gradient-to-r ${feature.color} opacity-0 group-hover:opacity-10 transition-opacity`} />
              
              {/* Decorative Icon */}
              <feature.bgIcon className="absolute right-2 top-2 text-4xl text-amber-500/20 group-hover:text-amber-400/30 transition-all group-hover:scale-110" />
              
              {/* Icon */}
              <div className={`relative mb-4 flex h-16 w-16 items-center justify-center rounded-xl bg-gradient-to-r ${feature.color} text-white shadow-xl transition-transform group-hover:scale-110 group-hover:rotate-3`}>
                <feature.icon className="text-2xl" />
              </div>
              
              {/* Content */}
              <h3 className="relative mb-2 text-lg font-black text-white">{feature.title}</h3>
              <p className="relative mb-3 text-sm text-amber-200/80">{feature.desc}</p>
              
              {/* Stats */}
              <div className="relative flex items-center gap-2">
                <span className="text-xs font-bold text-amber-300">{feature.stats}</span>
                <div className="h-1 flex-1 rounded-full bg-amber-500/20">
                  <div className={`h-full rounded-full bg-gradient-to-r ${feature.color}`} style={{ width: '75%' }} />
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Treasure Levels */}
        <div className="mb-8 grid grid-cols-1 gap-4 md:grid-cols-3 md:gap-6">
          {treasureLevels.map((level, index) => (
            <div
              key={index}
              className="group relative transform-gpu overflow-hidden rounded-2xl border border-amber-500/20 bg-gradient-to-br from-amber-950/30 to-yellow-950/30 p-6 backdrop-blur-sm transition-all hover:border-amber-400/30"
            >
              {/* Gradient Background */}
              <div className={`absolute inset-0 bg-gradient-to-r ${level.color} opacity-0 group-hover:opacity-10 transition-opacity`} />
              
              {/* Icon */}
              <level.icon className={`relative mx-auto mb-3 text-4xl bg-gradient-to-r ${level.color} bg-clip-text text-transparent`} />
              
              {/* Title */}
              <h4 className="relative mb-2 text-center text-base font-black text-white">{level.level}</h4>
              <p className="relative mb-1 text-center text-xs text-amber-200/70">{level.reward}</p>
              <p className="relative mb-4 text-center text-xs text-amber-200/70">{level.time}</p>
              
              {/* Progress Bar */}
              <div className="relative h-2 rounded-full bg-amber-500/20">
                <div 
                  className={`h-full rounded-full bg-gradient-to-r ${level.color} transition-all group-hover:animate-pulse`}
                  style={{ width: `${level.progress}%` }}
                />
              </div>
            </div>
          ))}
        </div>

        {/* Treasure Hunt Component Container */}
        <div className="relative">
          {/* Decorative Elements */}
          <div className="absolute -inset-4 rounded-3xl bg-gradient-to-r from-amber-500/20 via-yellow-500/20 to-orange-500/20 blur-3xl" />
          
          {/* Main Game Container */}
          <div className="relative transform-gpu overflow-hidden rounded-3xl border border-amber-500/30 bg-gradient-to-br from-amber-900/40 via-yellow-900/40 to-orange-900/40 p-6 backdrop-blur-xl shadow-2xl md:p-8">
            {/* Header */}
            <div className="mb-6 flex items-center justify-between border-b border-amber-500/30 pb-4">
              <div className="flex items-center gap-4">
                <div className="relative">
                  <div className="absolute -inset-1 animate-pulse rounded-xl bg-amber-500/50 blur" />
                  <div className="relative flex h-14 w-14 items-center justify-center rounded-xl bg-gradient-to-r from-amber-500 to-yellow-500">
                    <GiTreasureMap className="text-2xl text-white" />
                  </div>
                </div>
                <div>
                  <h2 className="text-xl font-black text-white">Treasure Hunt</h2>
                  <p className="flex items-center gap-2 text-sm text-amber-200/80">
                    <RiCompassDiscoverFill className="text-amber-400" />
                    Xazina topish sarguzashti · 12 node
                  </p>
                </div>
              </div>
              
              <div className="flex items-center gap-3">
                <div className="flex items-center gap-2 rounded-full bg-amber-500/20 px-3 py-1.5 border border-amber-500/30">
                  <FaCrown className="text-yellow-400" />
                  <span className="text-xs font-bold text-white">Adventure</span>
                </div>
                <div className="flex items-center gap-2 rounded-full bg-amber-500/20 px-3 py-1.5 border border-amber-500/30">
                  <FaTrophy className="text-yellow-400" />
                  <span className="text-xs font-bold text-white">Top score</span>
                </div>
              </div>
            </div>

            {/* TreasureHunt Component */}
            <TreasureHunt />
          </div>
        </div>

        {/* Footer */}
        <div className="relative mt-10 flex justify-center gap-6 text-5xl text-amber-500/20 md:text-6xl">
          <MdEmojiEvents className="animate-bounce" style={{ animationDelay: '0s' }} />
          <GiAchievement className="animate-bounce" style={{ animationDelay: '0.2s' }} />
          <FaTrophy className="animate-bounce" style={{ animationDelay: '0.4s' }} />
          <GiPodium className="animate-bounce" style={{ animationDelay: '0.6s' }} />
          <FaCrown className="animate-bounce" style={{ animationDelay: '0.8s' }} />
        </div>
      </div>
    </div>
  );
}

export default TreasureHuntPage;
