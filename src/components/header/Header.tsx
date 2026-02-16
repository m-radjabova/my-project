import { FaUser, FaGamepad, FaTrophy, FaEnvelope } from "react-icons/fa";
import { MdStars } from "react-icons/md";

type HeaderProps = {
  active?: "O'yinlar" | "Haqida" | "Izohlar" | "Bog'lanish";
  onNavClick?: (section: string) => void;
};

function Header({ active = "O'yinlar", onNavClick }: HeaderProps) {
  const navItems = [
    { label: "O'yinlar", icon: <FaGamepad className="mr-1.5" />, href: "#games" },
    { label: "Haqida", icon: <MdStars className="mr-1.5" />, href: "#about" },
    { label: "Izohlar", icon: <FaTrophy className="mr-1.5" />, href: "#awards" },
    { label: "Bog'lanish", icon: <FaEnvelope className="mr-1.5" />, href: "#contact" },
  ] as const;

  return (
    <header
      className={`section-reveal fixed top-0 left-0 right-0 z-50 mx-auto flex w-full items-center justify-between px-6 py-5 
        backdrop-blur-sm bg-[#d42d73]/90 `}
    >
      {/* Logo */}
      <div className=" flex items-center gap-3 group cursor-pointer">
        <div className="relative h-12 w-12 transform transition-transform group-hover:scale-110">
          <span className="absolute left-[2px] top-[2px] h-3 w-8 rounded-[2px] bg-white shadow-lg" />
          <span className="absolute left-[2px] top-[22px] h-3 w-3 rounded-full bg-white shadow-lg" />
          <span className="absolute left-[19px] top-[22px] h-3 w-3 rounded-[2px] bg-white/90 shadow-lg" />
        </div>
        <span className="text-xl font-black text-white tracking-tight">GAMEVERSE</span>
      </div>

      {/* Navigation */}
      <nav className="hidden items-center gap-8 md:flex">
        {navItems.map((item) => {
          const isActive = active === item.label;
          return (
            <a
              key={item.label}
              href={item.href}
              onClick={(e) => {
                e.preventDefault();
                onNavClick?.(item.label);
              }}
              className={`
                flex items-center px-3 py-2 text-sm font-bold tracking-wide transition-all duration-300
                ${isActive 
                  ? "text-white bg-white/20 rounded-full" 
                  : "text-white/70 hover:text-white hover:bg-white/10 rounded-full"
                }
              `}
            >
              {item.icon}
              {item.label}
            </a>
          );
        })}
      </nav>

      {/* Sign In Button */}
      <button className="group relative overflow-hidden rounded-full border-2 border-[#ffe24d] bg-gradient-to-b from-[#ffd966] to-[#ffb347] px-8 py-3 text-sm font-black tracking-[0.15em] text-[#1a1a1a] shadow-[0_10px_0_0_rgba(230,126,34,0.95),0_15px_25px_rgba(0,0,0,0.3)] transition-all hover:translate-y-1 hover:shadow-[0_8px_0_0_rgba(230,126,34,0.95),0_12px_20px_rgba(0,0,0,0.25)] active:translate-y-2 active:shadow-[0_6px_0_0_rgba(230,126,34,0.95)]">
        <span className="relative z-10 flex items-center gap-2">
          <FaUser className="text-sm" />
          RO'YXATDAN O'TISH
        </span>
        <span className="absolute inset-0 -translate-x-full group-hover:translate-x-0 transition-transform duration-500 bg-gradient-to-r from-transparent via-white/30 to-transparent skew-x-12" />
      </button>
    </header>
  );
}

export default Header;
