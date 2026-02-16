import { FaGamepad } from "react-icons/fa";
import { GiSparkles } from "react-icons/gi";

function SiteLoader() {
  return (
    <div className="fixed inset-0 z-[100] site-loader-bg overflow-hidden">
      <div className="absolute inset-0 bg-black/25 backdrop-blur-[2px]" />

      <div className="relative z-10 flex h-full items-center justify-center px-6">
        <div className="relative w-full max-w-md overflow-hidden rounded-[2rem] border border-white/30 bg-white/12 p-10 text-center shadow-[0_30px_80px_rgba(0,0,0,0.35)] backdrop-blur-xl">
          <div className="site-loader-shine absolute -left-10 top-0 h-full w-20 bg-gradient-to-r from-transparent via-white/35 to-transparent" />

          <div className="relative mx-auto mb-8 flex h-36 w-36 items-center justify-center">
            <div className="absolute h-28 w-28 rounded-full border-2 border-white/35" />
            <div className="site-loader-core relative z-10 grid h-24 w-24 place-items-center rounded-full bg-gradient-to-br from-[#ffd966] to-[#ffb347] text-[#1b1b1b] shadow-[0_14px_0_rgba(180,96,10,0.7)]">
              <FaGamepad className="text-4xl" />
            </div>
            <div className="site-loader-orbit absolute left-1/2 top-1/2 h-3 w-3 rounded-full bg-white" />
          </div>

          <h1 className="font-bebas text-5xl leading-none tracking-wide text-white">
            GAMEVERSE
          </h1>
          <p className="mt-2 font-inter text-sm font-semibold tracking-[0.2em] text-white/85">
            LOADING EXPERIENCE
          </p>

          <div className="mt-7 flex items-center justify-center gap-3 text-[#ffd966]">
            <GiSparkles className="animate-pulse text-2xl" />
            <span className="font-inter text-xs font-bold tracking-[0.28em] text-white/85">
              TAYYORLANMOQDA
            </span>
            <GiSparkles className="animate-pulse text-2xl" />
          </div>
        </div>
      </div>
    </div>
  );
}

export default SiteLoader;
