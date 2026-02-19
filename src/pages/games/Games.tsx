import { useNavigate } from "react-router-dom";
import {
  FaArrowRight,
  FaBolt,
  FaBrain,
  FaLock,
  FaRocket,
  FaStar,
  FaCrown,
  FaCompass,
  FaPuzzlePiece,
  FaTrophy,
  FaClock,
  FaUsers,
  FaMedal,
  FaGem,
  FaFire,
  FaHome,
} from "react-icons/fa";
import {
  GiPuzzle,
  GiTreasureMap,
  GiBrain as GiBrainIcon,
  GiSpellBook,
  GiCrystalShine
} from "react-icons/gi";
import { IoMdTimer } from "react-icons/io";
import { MdQuiz, MdMemory, MdGames } from "react-icons/md";
import { RiBubbleChartFill } from "react-icons/ri";

function Games() {
  const navigate = useNavigate();

  const quizBattleImg =
    "https://media.istockphoto.com/id/1336313511/vector/vector-funny-sign-quiz-game-set-of-creative-alphabet-letters-and-numbers.jpg?s=612x612&w=0&k=20&c=V7G9_GmHnJK89C-kt1U1kGDz2uBskO1-Z5fpxph9rX8=";
  const memoryRushImg =
    "https://media.istockphoto.com/id/1434154110/vector/reminder-yellow-note-circled.jpg?s=612x612&w=0&k=20&c=2mfjGFRNi7htNGB47t3fzlfg5mCGLQSfUXMoWBogWL0=";
  const classicArcadeImg =
    "https://media.istockphoto.com/id/1582151789/vector/vector-arcade-premium-alphabet-in-purple-violet-blue-colors-vector-3d-font-text-elements.jpg?s=612x612&w=0&k=20&c=x6f1QrMBy4O6ac6IFTWDG13A9D3vQFK8cIPXGrvA6aA=";
  const wordBattleImg =
    "https://media.istockphoto.com/id/2186075604/vector/comic-vs-versus-logo-pop-art-style-isolated-on-white-background.jpg?s=612x612&w=0&k=20&c=fWIxFgaBpU7jGhTBSxF_5dLwDYywLDzA7VrfKIPDS2Q=";
  const treasureHuntImg =
    "https://media.istockphoto.com/id/1341261769/photo/treasure-map.jpg?s=612x612&w=0&k=20&c=JnZD0II52_tMPZ-U_emWhZ9GfRu92SdWsZFFy8ohKw8=";

  const gameCards = [
    {
      id: "quiz-battle",
      title: "⚡ Quiz Battle",
      description: "Tezkor savollar, timer va reyting bilan bilim sinovi.",
      mainIcon: MdQuiz,
      icon: FaBolt,
      iconBg: "from-yellow-400 to-orange-500",
      iconColor: "text-yellow-300",
      shadowColor: "yellow",
      available: true,
      path: "/games/quiz-battle",
      bgPattern:
        "bg-gradient-to-br from-yellow-500/90 via-orange-500/90 to-red-500/90",
      image: quizBattleImg,
      players: "1-4 o'yinchi",
      level: "Boshlang'ich",
      levelIcon: FaStar,
      badge: "YANGI",
      badgeIcon: FaRocket,
      time: "5-10 min",
      points: "1000+",
      category: "Bilim",
      categoryIcon: FaCrown,
    },
    {
      id: "memory-rush",
      title: "🧠 Memory Rush",
      description: "Xotirani charxlaydigan tezkor kartochkalar o'yini.",
      mainIcon: MdMemory,
      icon: FaBrain,
      iconBg: "from-green-400 to-emerald-500",
      iconColor: "text-green-300",
      shadowColor: "green",
      available: true,
      path: "/games/memory-rush",
      bgPattern:
        "bg-gradient-to-br from-green-500/90 via-emerald-500/90 to-teal-500/90",
      image: memoryRushImg,
      players: "2 ta o'yinchi",
      level: "Osson - O'rtacha - Qiyin",
      levelIcon: FaMedal,
      badge: "YANGI",
      badgeIcon: FaClock,
      time: "5-8 min",
      points: "800+",
      category: "Xotira",
      categoryIcon: GiBrainIcon,
    },
    {
      id: "treasure-hunt",
      title: "🗺️ Treasure Hunt",
      description: "Topishmoqlar yechish va xazina topish sarguzashti.",
      mainIcon: GiTreasureMap,
      icon: FaCompass,
      iconBg: "from-amber-400 to-orange-500",
      iconColor: "text-amber-300",
      shadowColor: "amber",
      available: true,
      path: "/games/treasure-hunt",
      bgPattern: "bg-gradient-to-br from-[#8a4b08] via-[#b6670f] to-[#e09b2d]",
      image: treasureHuntImg,
      players: "1-3 o'yinchi",
      level: "Kreativ",
      levelIcon: GiCrystalShine,
      badge: "YANGI",
      badgeIcon: FaRocket,
      time: "10-15 min",
      points: "1500+",
      category: "Sarguzasht",
      categoryIcon: FaGem,
    },
    {
      id: "word-battle",
      title: "📚 Word Battle",
      description: "So'z topish, harflar bilan o'ynash va lug'at boyitish.",
      mainIcon: RiBubbleChartFill,
      icon: GiSpellBook,
      iconBg: "from-blue-400 to-cyan-500",
      iconColor: "text-blue-300",
      shadowColor: "blue",
      available: false,
      path: "/games/word-battle",
      bgPattern:
        "bg-gradient-to-br from-blue-500/90 via-cyan-500/90 to-sky-500/90",
      image: wordBattleImg,
      players: "1-2 o'yinchi",
      level: "Boshlang'ich",
      levelIcon: FaStar,
      badge: "MASHHUR",
      badgeIcon: FaFire,
      time: "5-12 min",
      points: "1200+",
      category: "So'z",
      categoryIcon: FaPuzzlePiece,
    },
    {
      id: "classic-arcade",
      title: "🎮 Classic Arcade",
      description: "Mantiq va tezkorlikni oshiradigan mini challenge'lar.",
      mainIcon: MdGames,
      icon: GiPuzzle,
      iconBg: "from-purple-400 to-pink-500",
      iconColor: "text-purple-300",
      shadowColor: "purple",
      available: false,
      path: "#",
      bgPattern:
        "bg-gradient-to-br from-purple-500/90 via-pink-500/90 to-rose-500/90",
      image: classicArcadeImg,
      players: "1 o'yinchi",
      level: "Professional",
      levelIcon: FaTrophy,
      badge: "TEZ KUNDA",
      badgeIcon: FaClock,
      time: "5-10 min",
      points: "2000+",
      category: "Mantiq",
      categoryIcon: FaBrain,
    },
  ];

  const getShadowClass = (color: string) => {
    const shadows: Record<string, string> = {
      yellow: "hover:shadow-[0_20px_40px_-10px_rgba(250,204,21,0.5)]",
      green: "hover:shadow-[0_20px_40px_-10px_rgba(34,197,94,0.5)]",
      purple: "hover:shadow-[0_20px_40px_-10px_rgba(168,85,247,0.5)]",
      blue: "hover:shadow-[0_20px_40px_-10px_rgba(59,130,246,0.5)]",
      amber: "hover:shadow-[0_20px_40px_-10px_rgba(245,158,11,0.5)]",
    };
    return shadows[color] || shadows.yellow;
  };

  return (
    <div className="relative min-h-screen overflow-hidden bg-gradient-to-br from-[#d42d73] via-[#c2185b] to-[#b0134d] px-3 py-4 sm:px-4 sm:py-6">
      {/* Animated background */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-20 -left-20 h-96 w-96 animate-pulse rounded-full bg-white/5 blur-3xl"></div>
        <div className="absolute -bottom-20 -right-20 h-96 w-96 animate-pulse rounded-full bg-yellow-300/5 blur-3xl delay-1000"></div>
        <div className="absolute left-1/4 top-1/3 h-64 w-64 animate-pulse rounded-full bg-pink-300/5 blur-3xl delay-500"></div>
      </div>

      <div className="relative mx-auto max-w-7xl">
        {/* Back button with modern design */}
        <button
          type="button"
          onClick={() => navigate("/home")}
          className="group mb-6 flex items-center gap-2 rounded-full bg-white/10 px-4 py-2 text-sm font-bold text-white shadow-lg backdrop-blur-sm transition-all duration-300 hover:-translate-x-1 hover:bg-white/20 sm:mb-8 sm:px-5 sm:py-2.5"
        >
          <FaHome className="text-sm transition-transform group-hover:-translate-x-1 sm:text-base" />
          <span>Asosiy Sahifa</span>
        </button>

        <div className="relative mb-16 text-center">
          {/* Animated gradient text */}
          <div className="relative inline-block">
            <h1 className="text-5xl md:text-6xl lg:text-7xl font-black">
              <span className="bg-gradient-to-r from-yellow-300 via-pink-300 to-purple-300 bg-clip-text text-transparent drop-shadow-2xl">
                O'YINLAR MASKANI
              </span>
            </h1>
            
            {/* Decorative elements */}
            <div className="absolute -top-6 -left-12 text-3xl opacity-30 rotate-12">🎮</div>
            <div className="absolute -bottom-4 -right-8 text-3xl opacity-30 -rotate-12">⭐</div>
          </div>
          
          <p className="mt-4 text-lg text-white/60 max-w-2xl mx-auto">
            Eng qiziqarli o'yinlar, ajoyib sarguzashtlar va cheksiz zavq sizni kutmoqda!
          </p>
          
          {/* Decorative line */}
          <div className="mt-6 flex justify-center gap-2">
            <div className="h-1 w-12 rounded-full bg-gradient-to-r from-transparent via-purple-500 to-transparent"></div>
            <div className="h-1 w-24 rounded-full bg-gradient-to-r from-purple-500 via-pink-500 to-yellow-500"></div>
            <div className="h-1 w-12 rounded-full bg-gradient-to-r from-transparent via-purple-500 to-transparent"></div>
          </div>
        </div>


        {/* Games Grid - Clean and modern */}
        <div className="relative z-10 grid grid-cols-1 gap-4 sm:grid-cols-2 sm:gap-5 lg:grid-cols-3 xl:gap-6">
          {gameCards.map((game) => (
            <div key={game.id} className="group perspective-game">
              <button
                type="button"
                disabled={!game.available}
                onClick={() => game.available && navigate(game.path)}
                className={`relative w-full overflow-hidden rounded-2xl border-2 p-0 text-left transition-all duration-300 sm:rounded-3xl sm:border-4 ${
                  game.available
                    ? `${game.bgPattern} border-white/40 ${getShadowClass(game.shadowColor)} hover:${game.bgPattern}`
                    : "cursor-not-allowed border-white/10 bg-gray-800/30 opacity-70"
                }`}
              >
                {/* Image Section */}
                <div className="relative h-36 w-full overflow-hidden sm:h-40">
                  <img
                    src={game.image}
                    alt={game.title}
                    className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-110"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent"></div>

                  {/* Badge */}
                  <div className="absolute left-2 top-2 sm:left-3 sm:top-3">
                    <div
                      className={`flex items-center gap-1 rounded-full px-2 py-0.5 text-[10px] font-bold text-white shadow-lg sm:px-3 sm:py-1 sm:text-xs ${
                        game.available
                          ? "bg-gradient-to-r from-green-500 to-emerald-600"
                          : "bg-gray-800/90"
                      }`}
                    >
                      <game.badgeIcon className="text-[8px] sm:text-xs" />
                      <span>{game.badge}</span>
                    </div>
                  </div>

                  {/* Level */}
                  <div className="absolute right-2 top-2 sm:right-3 sm:top-3">
                    <div className="flex items-center gap-1 rounded-full bg-black/40 px-2 py-0.5 text-[10px] text-white backdrop-blur-sm sm:px-3 sm:py-1 sm:text-xs">
                      <game.levelIcon className="text-yellow-300" />
                      <span>{game.level}</span>
                    </div>
                  </div>
                </div>

                {/* Content Section */}
                <div className="p-3 sm:p-4">
                  {/* Title and icon row */}
                  <div className="mb-2 flex items-center gap-2 sm:mb-3 sm:gap-3">
                    <div
                      className={`flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br ${game.iconBg} text-base text-white shadow-lg sm:h-12 sm:w-12 sm:text-xl`}
                    >
                      <game.icon />
                    </div>
                    <div className="flex-1">
                      <h3 className="text-base font-bold text-white sm:text-lg">
                        {game.title}
                      </h3>
                      <div className="flex items-center gap-2 text-[10px] text-white/60 sm:text-xs">
                        <FaUsers className="text-white/40" />
                        <span>{game.players}</span>
                      </div>
                    </div>
                  </div>

                  {/* Description */}
                  <p className="mb-2 text-xs text-white/80 line-clamp-2 sm:mb-3 sm:text-sm">
                    {game.description}
                  </p>

                  {/* Features row */}
                  <div className="mb-3 flex flex-wrap gap-1 sm:mb-4 sm:gap-2">
                    <span className="flex items-center gap-0.5 rounded-full bg-white/10 px-2 py-0.5 text-[9px] text-white sm:gap-1 sm:px-3 sm:py-1 sm:text-xs">
                      <IoMdTimer className="text-yellow-300" />
                      {game.time}
                    </span>
                    <span className="flex items-center gap-0.5 rounded-full bg-white/10 px-2 py-0.5 text-[9px] text-white sm:gap-1 sm:px-3 sm:py-1 sm:text-xs">
                      <FaTrophy className="text-yellow-300" />
                      {game.points}
                    </span>
                    <span className="flex items-center gap-0.5 rounded-full bg-white/10 px-2 py-0.5 text-[9px] text-white sm:gap-1 sm:px-3 sm:py-1 sm:text-xs">
                      <game.categoryIcon className="text-pink-300" />
                      {game.category}
                    </span>
                  </div>

                  {/* Action Button */}
<div
  className={`group relative mt-4 w-full overflow-hidden rounded-full border-2 px-4 py-2 text-xs font-black tracking-wider shadow-[0_8px_0_0_rgba(230,126,34,0.95),0_12px_20px_rgba(0,0,0,0.2)] transition-all sm:px-6 sm:py-3 sm:text-sm ${
    game.available
      ? "border-[#ffe24d] bg-gradient-to-b from-[#ffd966] to-[#ffb347] text-[#1a1a1a] hover:translate-y-1 hover:shadow-[0_6px_0_0_rgba(230,126,34,0.95)] active:translate-y-2 active:shadow-[0_4px_0_0_rgba(230,126,34,0.95)] cursor-pointer"
      : "border-gray-600 bg-gray-700/50 text-white/50 cursor-not-allowed shadow-none"
  }`}
>
  <span className="relative z-10 flex items-center justify-center gap-2 sm:gap-3">
    {game.available ? (
      <>
        <game.mainIcon className="text-sm sm:text-base" />
        <span>O'YNASH</span>
        <FaArrowRight className="text-xs transition-transform group-hover:translate-x-1 sm:text-sm" />
      </>
    ) : (
      <>
        <FaLock className="text-xs sm:text-sm" />
        <span>TEZ KUNDA</span>
      </>
    )}
  </span>

  {/* Shine Effect */}
  {game.available && (
    <span className="absolute inset-0 -translate-x-full group-hover:translate-x-0 transition-transform duration-700 bg-gradient-to-r from-transparent via-white/40 to-transparent skew-x-12" />
  )}
</div>

                </div>
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default Games; 