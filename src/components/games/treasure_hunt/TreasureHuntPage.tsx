import { useNavigate } from "react-router-dom";
import {
  FaArrowLeft,
  FaCompass,
  FaCrown,
  FaGem,
  FaMapMarkedAlt,
  FaRocket,
  FaStar,
  FaTrophy,
  FaUsers,
} from "react-icons/fa";
import { GiTreasureMap, GiChest, GiPathDistance, GiAchievement, GiPodium } from "react-icons/gi";
import TreasureHunt from "./TreasureHunt";
import { MdEmojiEvents } from "react-icons/md";

function TreasureHuntPage() {
  const navigate = useNavigate();
  const treasureHuntImg =
    "https://media.istockphoto.com/id/1341261769/photo/treasure-map.jpg?s=612x612&w=0&k=20&c=JnZD0II52_tMPZ-U_emWhZ9GfRu92SdWsZFFy8ohKw8=";

  const gameStats = [
    { icon: FaUsers, label: "1-3 o'yinchi", color: "text-amber-200" },
    { icon: GiPathDistance, label: "12 node sarguzasht", color: "text-emerald-200" },
    { icon: FaTrophy, label: "1500+ ball", color: "text-yellow-200" },
    { icon: FaCompass, label: "Kreativ topshiriq", color: "text-sky-200" },
  ];

  const features = [
    {
      icon: FaMapMarkedAlt,
      title: "Xarita bo'ylab yurish",
      desc: "Har bosqichda yangi hikoya va topishmoq kutadi.",
    },
    {
      icon: FaGem,
      title: "Ball va bonus",
      desc: "Tez javob bersangiz speed bonus, ba'zida x2 reward.",
    },
    {
      icon: GiChest,
      title: "Yakuniy xazina",
      desc: "Oxirida natija, reyting va qayta o'ynash imkoniyati.",
    },
  ];

  return (
    <div className="relative min-h-screen overflow-hidden bg-gradient-to-br from-[#8a4b08] via-[#b6670f] to-[#e09b2d] px-3 py-4 sm:px-4 sm:py-6">
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-16 -left-10 h-80 w-80 rounded-full bg-white/10 blur-3xl" />
        <div className="absolute -bottom-16 -right-10 h-80 w-80 rounded-full bg-yellow-200/10 blur-3xl" />
        <div className="absolute top-1/3 left-1/3 h-72 w-72 rounded-full bg-orange-200/10 blur-3xl" />
      </div>

      <div className="relative mx-auto max-w-7xl">
        <button
          type="button"
          onClick={() => navigate("/games")}
          className="group mb-6 flex items-center gap-2 rounded-full bg-white/15 px-4 py-2 text-sm font-bold text-white shadow-lg backdrop-blur-sm transition-all duration-300 hover:-translate-x-1 hover:bg-white/25 sm:mb-8 sm:px-5 sm:py-2.5"
        >
          <FaArrowLeft className="text-sm transition-transform group-hover:-translate-x-1 sm:text-base" />
          <span>O'yinlarga qaytish</span>
        </button>

        <div className="relative mb-8 overflow-hidden rounded-3xl border border-white/25 bg-white/10 p-6 backdrop-blur-xl sm:mb-10 sm:p-8 lg:p-10">
          <div className="relative z-10 flex flex-col items-center gap-6 lg:flex-row lg:gap-10">
            <div className="relative w-full lg:w-2/5">
              <div className="absolute -inset-2 rounded-3xl bg-gradient-to-r from-amber-200/30 to-yellow-100/20 blur-xl" />
              <div className="relative overflow-hidden rounded-2xl border-4 border-white/30 shadow-2xl sm:rounded-3xl">
                <img
                  src={treasureHuntImg}
                  alt="Treasure Hunt"
                  className="h-48 w-full object-cover transition-transform duration-700 hover:scale-110 sm:h-56 lg:h-64"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />

                <div className="absolute left-4 top-4">
                  <div className="flex items-center gap-2 rounded-full bg-gradient-to-r from-amber-400 to-orange-500 px-3 py-1.5 text-xs font-bold text-white shadow-xl sm:px-4 sm:py-2 sm:text-sm">
                    <FaRocket className="text-xs sm:text-sm" />
                    <span>SARGUZASHT O'YINI</span>
                  </div>
                </div>

                <div className="absolute bottom-4 right-4">
                  <div className="flex items-center gap-1 rounded-full bg-black/60 px-2 py-1 text-xs text-white backdrop-blur-sm sm:px-3 sm:py-1.5 sm:text-sm">
                    <FaStar className="text-yellow-300" />
                    <span>4.8</span>
                    <span className="text-white/60">(1.2k)</span>
                  </div>
                </div>
              </div>
            </div>

            <div className="flex-1 text-center lg:text-left">
              <div className="mb-3 inline-flex items-center gap-2 rounded-full bg-white/20 px-4 py-1.5 text-sm font-bold text-amber-100 backdrop-blur-sm sm:mb-4 sm:px-5 sm:py-2">
                <GiTreasureMap />
                <span>TREASURE HUNT</span>
              </div>

              <h1 className="mb-3 text-3xl font-black text-white sm:mb-4 sm:text-4xl lg:text-5xl">
                Xazina
                <span className="bg-gradient-to-r from-yellow-100 to-amber-200 bg-clip-text text-transparent"> izlovchilar</span>
              </h1>

              <p className="mb-4 text-sm text-white/85 sm:mb-6 sm:text-base lg:text-lg">
                Xarita bo'ylab yurib, topishmoqlarni yeching va yakunda xazinani qo'lga kiriting.
                Tezlik, mantiq va diqqat hammasi kerak bo'ladi.
              </p>

              <div className="grid grid-cols-2 gap-2 sm:grid-cols-4 sm:gap-4">
                {gameStats.map((stat, index) => (
                  <div key={index} className="rounded-xl bg-white/10 p-2 text-center backdrop-blur-sm sm:p-3">
                    <stat.icon className={`mx-auto mb-1 text-base sm:mb-2 sm:text-xl ${stat.color}`} />
                    <p className="text-[10px] font-bold text-white sm:text-xs">{stat.label}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className="absolute -bottom-5 -right-5 text-8xl opacity-10">
            <FaCrown />
          </div>
        </div>

        <div className="mb-8 grid grid-cols-1 gap-4 sm:grid-cols-3 sm:gap-6">
          {features.map((feature, index) => (
            <div
              key={index}
              className="group rounded-2xl border border-white/25 bg-white/10 p-4 backdrop-blur-sm transition-all duration-300 hover:-translate-y-1 hover:border-amber-200/60 hover:bg-white/20 sm:p-6"
            >
              <div className="mb-3 flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br from-amber-300 to-orange-500 text-white shadow-lg sm:h-14 sm:w-14">
                <feature.icon className="text-lg sm:text-xl" />
              </div>
              <h3 className="mb-1 text-base font-bold text-white sm:text-lg">{feature.title}</h3>
              <p className="text-xs text-white/75 sm:text-sm">{feature.desc}</p>
            </div>
          ))}
        </div>

        <div className="relative rounded-3xl border border-white/25 bg-white/10 p-4 backdrop-blur-xl sm:p-6 lg:p-8">
          <div className="mb-6 flex items-center justify-between border-b border-white/20 pb-4">
            <div className="flex items-center gap-3">
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br from-amber-300 to-orange-500 text-white shadow-lg">
                <GiTreasureMap className="text-xl sm:text-2xl" />
              </div>
              <div>
                <h2 className="text-lg font-bold text-white sm:text-xl">Treasure Hunt</h2>
                <p className="text-xs text-white/60 sm:text-sm">Xazina topish sarguzashti</p>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <div className="flex items-center gap-1 rounded-full bg-white/10 px-3 py-1.5 text-xs text-white">
                <FaCrown className="text-yellow-200" />
                <span>Adventure</span>
              </div>
              <div className="flex items-center gap-1 rounded-full bg-white/10 px-3 py-1.5 text-xs text-white">
                <FaTrophy className="text-yellow-200" />
                <span>Top score</span>
              </div>
            </div>
          </div>

          <TreasureHunt />

          <div className="relative mt-8 flex justify-center gap-2 text-6xl text-white/20">
                    <MdEmojiEvents className="animate-bounce delay-100" />
                    <GiAchievement className="animate-bounce delay-200" />
                    <FaTrophy className="animate-bounce delay-300" />
                    <GiPodium className="animate-bounce delay-400" />
                    <FaCrown className="animate-bounce delay-500" />
                  </div>
        </div>
      </div>
    </div>
  );
}

export default TreasureHuntPage;
