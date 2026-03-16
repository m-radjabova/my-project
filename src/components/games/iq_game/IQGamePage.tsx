import { Link } from 'react-router-dom';
import {
    FaTrophy,
  FaStar,
  FaCrown,
  FaHome,
  FaBrain,
  FaBolt,
  FaBook,
} from 'react-icons/fa';
import {
  GiAchievement,
  GiPodium,
  GiSpinningWheel,
  GiBrain,
  GiLightBulb,
  GiSunglasses
} from 'react-icons/gi';
import { MdTimer, MdPsychology } from 'react-icons/md';
import { RiMentalHealthFill } from 'react-icons/ri';
import IQGame from './IQGame';

function IQGamePage() {
  const gameStats = [
    {
      icon: <FaBrain className="text-2xl text-white" />,
      label: 'IQ TEST',
      value: 'Full scale',
      color: 'from-blue-500 to-indigo-500',
    },
    {
      icon: <MdTimer className="text-2xl text-white" />,
      label: 'TIME',
      value: '12-24s each',
      color: 'from-indigo-500 to-purple-500',
    },
    {
      icon: <GiLightBulb className="text-2xl text-white" />,
      label: 'QUESTIONS',
      value: '18',
      color: 'from-purple-500 to-pink-500',
    },
    {
      icon: <FaCrown className="text-2xl text-white" />,
      label: 'MAX IQ',
      value: '160',
      color: 'from-pink-500 to-blue-500',
    },
  ];

  const features = [
    {
      icon: GiBrain,
      title: 'Pattern Recognition',
      desc: 'Find the next number or shape in sequence',
      color: 'from-blue-500 to-indigo-500',
      bgIcon: FaStar,
      stats: '5 questions',
    },
    {
      icon: MdPsychology,
      title: 'Logic Puzzles',
      desc: 'Solve tricky logical problems',
      color: 'from-indigo-500 to-purple-500',
      bgIcon: FaBolt,
      stats: '5 questions',
    },
    {
      icon: GiSunglasses,
      title: 'Matrix Reasoning',
      desc: 'Complete the pattern matrix',
      color: 'from-purple-500 to-pink-500',
      bgIcon: FaBook,
      stats: '5 questions',
    },
  ];

  const questionTypes = [
    { type: 'Pattern', icon: '🔢', desc: 'Number sequences', color: 'from-blue-500 to-cyan-500' },
    { type: 'Logic', icon: '🧠', desc: 'Logical riddles', color: 'from-indigo-500 to-purple-500' },
    { type: 'Matrix', icon: '🔲', desc: 'Abstract reasoning', color: 'from-purple-500 to-pink-500' },
    { type: 'Word', icon: '📚', desc: 'Verbal logic', color: 'from-pink-500 to-rose-500' },
    { type: 'Speed', icon: '⚡', desc: 'Quick thinking', color: 'from-rose-500 to-orange-500' },
  ];

  const iqLevels = [
    { level: 'Genius', range: '130-160', color: 'from-purple-400 to-pink-400', emoji: '🧠✨' },
    { level: 'Superior', range: '120-129', color: 'from-blue-400 to-indigo-400', emoji: '🌟' },
    { level: 'High Average', range: '110-119', color: 'from-green-400 to-emerald-400', emoji: '⭐' },
    { level: 'Average', range: '90-109', color: 'from-yellow-400 to-amber-400', emoji: '✨' },
  ];

  return (
    <div className="relative min-h-screen w-full overflow-x-hidden bg-gradient-to-br from-indigo-950 via-purple-950 to-pink-950">
      {/* Animated Background */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-40 -left-40 h-[600px] w-[600px] animate-pulse-slow rounded-full bg-blue-600/10 blur-3xl" />
        <div className="absolute -bottom-40 -right-40 h-[600px] w-[600px] animate-pulse-slower rounded-full bg-purple-600/10 blur-3xl" />

        {/* Brain Pattern */}
        <div
          className="absolute inset-0 opacity-5"
          style={{
            backgroundImage: `radial-gradient(circle at 20px 20px, #60a5fa 2px, transparent 2px)`,
            backgroundSize: '40px 40px',
          }}
        />

        {/* Floating IQ Symbols */}
        <div className="absolute inset-0">
          {[...Array(20)].map((_, i) => (
            <div
              key={i}
              className="absolute text-4xl opacity-10 animate-float"
              style={{
                top: `${Math.random() * 100}%`,
                left: `${Math.random() * 100}%`,
                animationDelay: `${Math.random() * 5}s`,
                animationDuration: `${15 + Math.random() * 20}s`,
                transform: `rotate(${Math.random() * 360}deg)`,
              }}
            >
              {['🧠', '💡', '🔢', '🧩', '⚡', '📊'][i % 6]}
            </div>
          ))}
        </div>
      </div>

      <div className="relative z-10 mx-auto min-h-screen w-full max-w-[2000px] px-3 py-4 sm:px-4 sm:py-6 md:px-6 md:py-8 lg:px-8 xl:px-10">
        {/* Hero Section */}
        <div className="group relative mb-8 transform-gpu overflow-hidden rounded-3xl border-2 border-white/10 bg-gradient-to-br from-indigo-900/40 via-purple-900/40 to-pink-900/40 p-6 backdrop-blur-xl shadow-2xl md:p-8 lg:p-10">
          {/* Animated Border */}
          <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-700">
            <div className="absolute inset-0 rounded-3xl bg-gradient-to-r from-blue-500/30 via-purple-500/30 to-pink-500/30 animate-gradient" />
          </div>

          {/* Corner Decorations */}
          <div className="absolute top-0 left-0 text-4xl opacity-30 animate-bounce">🧠</div>
          <div className="absolute top-0 right-0 text-4xl opacity-30 animate-bounce delay-100">💡</div>
          <div className="absolute bottom-0 left-0 text-4xl opacity-30 animate-bounce delay-200">🔢</div>
          <div className="absolute bottom-0 right-0 text-4xl opacity-30 animate-bounce delay-300">🧩</div>

          <div className="relative grid gap-8 lg:grid-cols-2 lg:gap-12 lg:items-center">
            {/* Left Content */}
            <div className="space-y-6">
              {/* Game Badge */}
              <div className="relative inline-block">
                <div className="absolute inset-0 bg-gradient-to-r from-blue-500 to-purple-500 blur-xl rounded-full animate-pulse" />
                <div className="relative flex items-center gap-3 rounded-full bg-gradient-to-r from-indigo-900 to-purple-900 px-5 py-2 border-2 border-white/20 shadow-xl">
                  <GiBrain className="text-blue-400 text-xl animate-pulse" />
                  <span className="text-sm font-black tracking-wider text-transparent bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400 bg-clip-text">
                    IQ CHALLENGE
                  </span>
                </div>
              </div>

              {/* Title */}
              <div className="relative">
                <h1 className="text-5xl font-black leading-tight md:text-6xl lg:text-7xl">
                  <span className="relative inline-block">
                    <span className="absolute -inset-2 bg-gradient-to-r from-blue-500/30 to-purple-500/30 blur-2xl" />
                    <span className="relative bg-gradient-to-r from-blue-400 to-indigo-400 bg-clip-text text-transparent">
                      Intelligence
                    </span>
                  </span>
                  <br />
                  <span className="relative inline-block mt-2">
                    <span className="absolute -inset-2 bg-gradient-to-r from-purple-500/30 to-pink-500/30 blur-2xl" />
                    <span className="relative bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
                      Quotient Test
                    </span>
                  </span>
                </h1>

                {/* Decorative Line */}
                <div className="relative mt-4 h-1 w-32 overflow-hidden rounded-full bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500">
                  <div className="absolute inset-0 animate-shimmer bg-gradient-to-r from-transparent via-white/30 to-transparent" />
                </div>
              </div>

              {/* Description */}
              <div className="relative max-w-xl rounded-xl bg-black/50 p-4 border-2 border-white/10 backdrop-blur-sm">
                <p className="text-base text-gray-300 md:text-lg leading-relaxed">
                  Challenge your mind with 5 different IQ test categories.
                  Pattern recognition, logic puzzles, matrix reasoning, word logic, and speed thinking.
                </p>
              </div>

              {/* Stats Grid */}
              <div className="grid grid-cols-2 gap-3 md:gap-4">
                {gameStats.map((stat, index) => (
                  <div
                    key={index}
                    className="group/stat relative transform-gpu overflow-hidden rounded-xl border-2 border-white/10 bg-black/50 p-4 backdrop-blur-sm transition-all duration-300 hover:scale-105 hover:shadow-2xl"
                  >
                    <div
                      className={`absolute inset-0 bg-gradient-to-r ${stat.color} opacity-0 group-hover/stat:opacity-20 transition-opacity duration-500`}
                    />
                    <div className="relative">
                      <div
                        className={`mb-2 inline-flex rounded-lg bg-gradient-to-r ${stat.color} p-2.5 shadow-lg`}
                      >
                        {stat.icon}
                      </div>
                      <p className="text-xs font-bold text-gray-400 tracking-wider">
                        {stat.label}
                      </p>
                      <p className="text-sm font-black text-white mt-1">{stat.value}</p>
                    </div>
                  </div>
                ))}
              </div>

              {/* Navigation */}
              <div className="flex gap-3">
                <Link
                  to="/games"
                  className="px-5 py-2.5 bg-white/10 border-2 border-white/20 text-white rounded-xl font-bold hover:bg-white/20 transition-all flex items-center gap-2"
                >
                  <FaHome /> Games
                </Link>
              </div>
            </div>

            {/* Right Content - IQ Preview */}
            <div className="relative">
              {/* Decorative Elements */}
              <div className="absolute -top-8 -left-8 text-6xl rotate-12 animate-bounce">🧠</div>
              <div className="absolute -bottom-8 -right-8 text-6xl -rotate-12 animate-bounce delay-200">💡</div>

              {/* IQ Meter Preview */}
              <div className="relative transform-gpu overflow-hidden rounded-2xl border-4 border-white/10 bg-gradient-to-br from-blue-600 to-purple-600 p-6 shadow-2xl">
                <div className="text-center mb-4">
                  <span className="text-4xl font-black text-white">IQ</span>
                </div>

                <div className="relative w-48 h-48 mx-auto mb-4">
                  <svg viewBox="0 0 100 100" className="w-full h-full">
                    {/* Background circle */}
                    <circle
                      cx="50"
                      cy="50"
                      r="45"
                      fill="none"
                      stroke="rgba(255,255,255,0.1)"
                      strokeWidth="10"
                    />
                    {/* Progress arc */}
                    <circle
                      cx="50"
                      cy="50"
                      r="45"
                      fill="none"
                      stroke="url(#gradient)"
                      strokeWidth="10"
                      strokeDasharray="283"
                      strokeDashoffset="70"
                      strokeLinecap="round"
                    />
                    <defs>
                      <linearGradient id="gradient" x1="0%" y1="0%" x2="100%" y2="0%">
                        <stop offset="0%" stopColor="#60a5fa" />
                        <stop offset="50%" stopColor="#a78bfa" />
                        <stop offset="100%" stopColor="#f472b6" />
                      </linearGradient>
                    </defs>
                    {/* Center text */}
                    <text
                      x="50"
                      y="55"
                      textAnchor="middle"
                      fill="white"
                      fontSize="20"
                      fontWeight="bold"
                    >
                      130
                    </text>
                  </svg>
                </div>

                <div className="text-center text-white">
                  <p className="text-sm opacity-80">Genius Level</p>
                </div>

                {/* Overlay Badge */}
                <div className="absolute bottom-0 left-0 right-0 z-20 p-4">
                  <div className="inline-flex items-center gap-3 rounded-2xl bg-black/50 backdrop-blur-md px-4 py-2 border-2 border-white/20 shadow-xl">
                    <RiMentalHealthFill className="text-blue-400 text-lg animate-pulse" />
                    <span className="text-sm font-black text-white tracking-wider">
                      5 CATEGORIES · 15 QUESTIONS
                    </span>
                  </div>
                </div>

                {/* Floating Badges */}
                <div className="absolute top-4 right-4 z-20 flex gap-2">
                  <div className="rounded-full bg-gradient-to-r from-blue-600 to-purple-600 px-3 py-1.5 text-xs font-bold text-white shadow-xl border border-white/30">
                    <span className="flex items-center gap-1">
                      <FaBrain /> IQ TEST
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Features Grid */}
        <div className="mb-8 grid grid-cols-1 gap-5 md:grid-cols-3 md:gap-6">
          {features.map((feature, index) => (
            <div
              key={index}
              className="group relative transform-gpu overflow-hidden rounded-2xl border-2 border-white/10 bg-black/50 p-6 backdrop-blur-sm transition-all duration-500 hover:scale-[1.03] hover:shadow-2xl hover:border-blue-500/30"
            >
              {/* Animated Background */}
              <div
                className="absolute inset-0 opacity-0 group-hover:opacity-20 transition-opacity duration-700"
                style={{
                  backgroundImage: `radial-gradient(circle at ${30 + index * 20}% ${40 + index * 10}%, #60a5fa 0%, transparent 50%)`,
                }}
              />

              {/* Corner Decorations */}
              <div className="absolute top-2 left-2 h-6 w-6 border-l-2 border-t-2 border-blue-500/30 group-hover:border-blue-400 transition-colors" />
              <div className="absolute top-2 right-2 h-6 w-6 border-r-2 border-t-2 border-purple-500/30 group-hover:border-purple-400 transition-colors" />
              <div className="absolute bottom-2 left-2 h-6 w-6 border-l-2 border-b-2 border-pink-500/30 group-hover:border-pink-400 transition-colors" />
              <div className="absolute bottom-2 right-2 h-6 w-6 border-r-2 border-b-2 border-blue-500/30 group-hover:border-blue-400 transition-colors" />

              {/* Decorative Icon */}
              <feature.bgIcon className="absolute right-4 top-4 text-5xl text-blue-500/20 group-hover:text-blue-500/30 transition-all group-hover:scale-110 group-hover:rotate-12" />

              {/* Icon */}
              <div
                className={`relative mb-5 flex h-16 w-16 items-center justify-center rounded-xl bg-gradient-to-r ${feature.color} text-white shadow-xl transition-all duration-300 group-hover:scale-110 group-hover:rotate-3 group-hover:shadow-2xl`}
              >
                <feature.icon className="text-2xl" />
              </div>

              {/* Content */}
              <h3 className="relative mb-2 text-xl font-black text-white">{feature.title}</h3>
              <p className="relative mb-4 text-sm text-gray-400">{feature.desc}</p>

              {/* Stats Bar */}
              <div className="relative flex items-center gap-2">
                <span className="text-xs font-bold text-blue-400">{feature.stats}</span>
                <div className="h-1.5 flex-1 rounded-full bg-white/10 overflow-hidden">
                  <div
                    className={`h-full rounded-full bg-gradient-to-r ${feature.color} transition-all duration-500 group-hover:animate-pulse`}
                    style={{ width: '85%' }}
                  />
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Question Types */}
        <div className="mb-8">
          <h2 className="text-2xl font-black text-white mb-6 flex items-center gap-3">
            <span className="bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400 bg-clip-text text-transparent">
              QUESTION TYPES
            </span>
            <div className="h-px flex-1 bg-gradient-to-r from-blue-500/30 to-transparent" />
          </h2>

          <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
            {questionTypes.map((type, index) => (
              <div
                key={index}
                className="group relative transform-gpu overflow-hidden rounded-xl border-2 border-white/10 bg-black/50 p-5 backdrop-blur-sm transition-all hover:scale-105 hover:shadow-2xl text-center"
              >
                <div className={`absolute inset-0 bg-gradient-to-r ${type.color} opacity-0 group-hover:opacity-10 transition-opacity`} />
                <div className="relative">
                  <span className="text-4xl mb-2 block">{type.icon}</span>
                  <h3 className="text-lg font-black text-white mb-1">{type.type}</h3>
                  <p className="text-xs text-gray-400">{type.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* IQ Levels */}
        <div className="mb-8">
          <h2 className="text-2xl font-black text-white mb-6 flex items-center gap-3">
            <span className="bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400 bg-clip-text text-transparent">
              IQ LEVELS
            </span>
            <div className="h-px flex-1 bg-gradient-to-r from-blue-500/30 to-transparent" />
          </h2>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {iqLevels.map((level, index) => (
              <div
                key={index}
                className="group relative transform-gpu overflow-hidden rounded-xl border-2 border-white/10 bg-black/50 p-5 backdrop-blur-sm transition-all hover:scale-105 hover:shadow-2xl text-center"
              >
                <div className={`absolute inset-0 bg-gradient-to-r ${level.color} opacity-0 group-hover:opacity-10 transition-opacity`} />
                <div className="relative">
                  <span className="text-3xl mb-2 block">{level.emoji}</span>
                  <h3 className="text-lg font-black text-white mb-1">{level.level}</h3>
                  <p className="text-sm text-gray-400">{level.range}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Game Component Container */}
        <div className="relative">
          {/* Decorative Border */}
          <div className="absolute -inset-1 bg-gradient-to-r from-blue-600/30 via-purple-600/30 to-pink-600/30 rounded-3xl blur-xl" />

          {/* Main Container */}
          <div className="relative transform-gpu overflow-hidden rounded-3xl border-2 border-white/10 bg-black/80 p-6 backdrop-blur-xl shadow-2xl md:p-8">
            {/* Header */}
            <div className="relative mb-6 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b-2 border-white/10 pb-4">
              <div className="flex items-center gap-4">
                {/* Icon with Glow */}
                <div className="relative">
                  <div className="absolute -inset-1 animate-pulse rounded-xl bg-blue-500/50 blur" />
                  <div className="relative flex h-16 w-16 items-center justify-center rounded-xl bg-gradient-to-r from-blue-600 to-purple-600 shadow-2xl border-2 border-white/30">
                    <GiBrain className="text-3xl text-white" />
                  </div>
                </div>

                {/* Title */}
                <div>
                  <h2 className="text-2xl font-black text-white tracking-wider">
                    IQ Challenge
                  </h2>
                  <p className="flex items-center gap-2 text-sm text-gray-400">
                    <RiMentalHealthFill className="text-blue-400" />
                    Test your intelligence · 5 categories
                  </p>
                </div>
              </div>

              {/* Badges */}
              <div className="flex gap-2">
                <div className="flex items-center gap-2 rounded-full bg-white/10 px-4 py-2 border-2 border-white/10">
                  <span className="text-xs font-bold text-white">18 Questions</span>
                </div>
                <div className="flex items-center gap-2 rounded-full bg-white/10 px-4 py-2 border-2 border-white/10">
                  <span className="text-xs font-bold text-white">10-30s each</span>
                </div>
              </div>
            </div>

            {/* Game Component */}
            <div className="relative">
              <IQGame />
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="relative mt-12 flex justify-center items-center gap-6">
          <div className="h-px w-12 bg-gradient-to-r from-transparent via-blue-500/30 to-transparent" />

          <div className="flex gap-4 text-4xl text-blue-600/30">
            <GiAchievement className="hover:text-blue-500/50 transition-colors animate-bounce" />
            <GiPodium className="hover:text-blue-500/50 transition-colors animate-bounce delay-100" />
            <FaTrophy className="hover:text-blue-500/50 transition-colors animate-bounce delay-200" />
            <GiSpinningWheel className="hover:text-blue-500/50 transition-colors animate-bounce delay-300" />
            <FaCrown className="hover:text-blue-500/50 transition-colors animate-bounce delay-400" />
          </div>

          <div className="h-px w-12 bg-gradient-to-r from-blue-500/30 via-transparent to-transparent" />
        </div>
      </div>

      <style>{`
        @keyframes float {
          0%, 100% { transform: translateY(0px) rotate(0deg); }
          50% { transform: translateY(-20px) rotate(5deg); }
        }
        @keyframes pulse-slow {
          0%, 100% { opacity: 0.5; }
          50% { opacity: 0.8; }
        }
        @keyframes pulse-slower {
          0%, 100% { opacity: 0.3; }
          50% { opacity: 0.6; }
        }
        @keyframes shimmer {
          0% { transform: translateX(-100%); }
          100% { transform: translateX(100%); }
        }
        @keyframes gradient {
          0% { background-position: 0% 50%; }
          50% { background-position: 100% 50%; }
          100% { background-position: 0% 50%; }
        }
        .animate-float {
          animation: float 8s ease-in-out infinite;
        }
        .animate-pulse-slow {
          animation: pulse-slow 4s ease-in-out infinite;
        }
        .animate-pulse-slower {
          animation: pulse-slower 6s ease-in-out infinite;
        }
        .animate-shimmer {
          animation: shimmer 2s infinite;
        }
        .animate-gradient {
          background-size: 200% 200%;
          animation: gradient 3s ease infinite;
        }
      `}</style>
    </div>
  );
}

export default IQGamePage;
