import { useEffect, useRef, useState } from "react";
import { Outlet, useLocation, useNavigate } from "react-router-dom";
import { FaArrowLeft } from "react-icons/fa";
import { MdFullscreen, MdFullscreenExit } from "react-icons/md";

export default function GameLayout() {
  const navigate = useNavigate();
  const location = useLocation();
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [showControls, setShowControls] = useState(true);
  const lastScrollYRef = useRef(0);

  const showGameControls = location.pathname.startsWith("/games/") && location.pathname !== "/games";

  useEffect(() => {
    const onFullscreenChange = () => {
      setIsFullscreen(Boolean(document.fullscreenElement));
    };
    document.addEventListener("fullscreenchange", onFullscreenChange);
    return () => document.removeEventListener("fullscreenchange", onFullscreenChange);
  }, []);

  useEffect(() => {
    window.scrollTo({ top: 0, left: 0, behavior: "auto" });
  }, [location.pathname]);

  // Hide/show buttons on scroll
  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY;
      const nextShowControls = !(currentScrollY > lastScrollYRef.current && currentScrollY > 100);
      setShowControls((prev) => (prev === nextShowControls ? prev : nextShowControls));
      lastScrollYRef.current = currentScrollY;
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const toggleFullscreen = async () => {
    try {
      if (!document.fullscreenElement) {
        await document.documentElement.requestFullscreen();
      } else {
        await document.exitFullscreen();
      }
    } catch {
      // ignore browser restrictions
    }
  };

  const goToGames = () => {
    navigate("/games");
  };

  return (
    <div className="game-layout relative min-h-screen">
      {showGameControls && (
        <>
          {/* Left Button - Back to Games */}
          <div
            className={`fixed left-4 top-1/2 z-50 transform -translate-y-1/2 transition-all duration-300 ${
              showControls ? "opacity-100 translate-x-0" : "opacity-0 -translate-x-full"
            }`}
          >
            <button
              onClick={goToGames}
              className="group relative h-14 w-14 overflow-hidden rounded-2xl bg-gradient-to-r from-purple-500 to-pink-500 text-white shadow-2xl transition-all hover:scale-110 active:scale-95 hover:shadow-[0_0_30px_rgba(168,85,247,0.7)]"
              aria-label="O'yinlar ro'yxatiga qaytish"
            >
              <div className="absolute inset-0 bg-white/20 translate-y-full group-hover:translate-y-0 transition-transform duration-300" />
              <FaArrowLeft className="relative mx-auto text-xl" />
              <span className="absolute -bottom-8 left-1/2 transform -translate-x-1/2 whitespace-nowrap rounded-full bg-black/80 px-3 py-1.5 text-xs font-bold text-white opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none">
                O'yinlar
              </span>
            </button>
          </div>

          {/* Right Button - Fullscreen Toggle */}
          <div
            className={`fixed right-4 top-1/2 z-50 transform -translate-y-1/2 transition-all duration-300 ${
              showControls ? "opacity-100 translate-x-0" : "opacity-100 translate-x-0"
            }`}
          >
            <button
              onClick={toggleFullscreen}
              className="group relative h-14 w-14 overflow-hidden rounded-2xl bg-gradient-to-r from-purple-500 to-pink-500 text-white shadow-2xl transition-all hover:scale-110 active:scale-95 hover:shadow-[0_0_30px_rgba(236,72,153,0.7)]"
              aria-label={isFullscreen ? "Fullscreen dan chiqish" : "Fullscreen"}
            >
              <div className="absolute inset-0 bg-white/20 translate-y-full group-hover:translate-y-0 transition-transform duration-300" />
              {isFullscreen ? (
                <MdFullscreenExit className="relative mx-auto text-xl" />
              ) : (
                <MdFullscreen className="relative mx-auto text-xl" />
              )}
              <span className="absolute -bottom-8 left-1/2 transform -translate-x-1/2 whitespace-nowrap rounded-full bg-black/80 px-3 py-1.5 text-xs font-bold text-white opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none">
                {isFullscreen ? "Chiqish" : "To'liq ekran"}
              </span>
            </button>
          </div>

          {/* Mobile Bottom Buttons (for small screens) */}
          <div
            className={`fixed bottom-4 left-0 right-0 z-50 flex justify-center gap-4 md:hidden transition-all duration-300 ${
              showControls ? "translate-y-0" : "translate-y-full"
            }`}
          >
            {/* Back to Games */}
            <button
              onClick={goToGames}
              className="group relative h-12 w-12 overflow-hidden rounded-xl bg-gradient-to-r from-purple-500 to-pink-500 text-white shadow-2xl transition-all hover:scale-110 active:scale-95"
              aria-label="O'yinlar"
            >
              <div className="absolute inset-0 bg-white/20 translate-y-full group-hover:translate-y-0 transition-transform duration-300" />
              <FaArrowLeft className="relative mx-auto text-base" />
            </button>

            {/* Fullscreen Toggle */}
            <button
              onClick={toggleFullscreen}
              className="group relative h-12 w-12 overflow-hidden rounded-xl bg-gradient-to-r from-purple-500 to-pink-500 text-white shadow-2xl transition-all hover:scale-110 active:scale-95"
              aria-label={isFullscreen ? "Chiqish" : "To'liq ekran"}
            >
              <div className="absolute inset-0 bg-white/20 translate-y-full group-hover:translate-y-0 transition-transform duration-300" />
              {isFullscreen ? (
                <MdFullscreenExit className="relative mx-auto text-base" />
              ) : (
                <MdFullscreen className="relative mx-auto text-base" />
              )}
            </button>
          </div>
        </>
      )}

      {/* Main Content */}
      <main className="min-h-screen">
        <Outlet />
      </main>
    </div>
  );
}
