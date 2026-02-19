import {
  FaFacebookF,
  FaTwitter,
  FaYoutube,
  FaArrowRight,
  FaGamepad,
  FaUsers,
  FaTv,
  FaCalendarAlt,
} from "react-icons/fa";
import { GiEarthAmerica, GiPlanetCore, GiSparkles } from "react-icons/gi";
import footerCharacter from "../../assets/footer.png";
import { useState } from "react";

function Footer() {
  const [hoveredSocial, setHoveredSocial] = useState<string | null>(null);
  return (
    <footer
      className={`relative min-h-[500px] overflow-hidden bg-gradient-to-br from-[#f5f5f5] via-[#efefef] to-[#e8e8e8] pt-20 pb-8`}
    >
      {/* Background Decorations */}
      <div className="absolute inset-0">
        {/* Grid Pattern */}
        <div
          className="absolute inset-0"
          style={{
            backgroundImage: `radial-gradient(circle at 20px 20px, #d42d73 1px, transparent 0)`,
            backgroundSize: "60px 60px",
            opacity: 0.03,
          }}
        />

        {/* Floating Orbs */}
        <div className="absolute top-20 right-40 animate-float-slow">
          <GiPlanetCore className="text-8xl text-[#ffd966]/10" />
        </div>
        <div className="absolute bottom-40 left-20 animate-float">
          <GiSparkles className="text-7xl text-[#d42d73]/10" />
        </div>
      </div>

      <div className="relative z-20 mx-auto max-w-8xl px-4 sm:px-6 lg:px-8">
        {/* Main Content Grid */}
        <div className="grid items-end gap-8 lg:grid-cols-[400px_1fr] lg:gap-12">
          {/* Character Section */}
          <div className="relative h-[320px] lg:h-[400px]">
            {/* Glow Effect */}
            <div className="absolute -bottom-10 left-0 w-64 h-64 bg-gradient-to-r from-[#ffd966] to-[#ffb347] rounded-full blur-3xl opacity-30" />

            {/* Character Image */}
            <div className="relative group">
              <div className="absolute -inset-4 bg-gradient-to-r from-[#ffd966] to-[#ffb347] rounded-full blur-2xl opacity-20 group-hover:opacity-40 transition-opacity" />
              <img
                src={footerCharacter}
                alt="Footer character"
                className="relative z-10 w-[300px] lg:w-[380px] select-none object-contain 
                         drop-shadow-[0_30px_25px_rgba(0,0,0,0.2)] transform group-hover:scale-105 
                         group-hover:-translate-y-4 transition-all duration-500"
                draggable={false}
              />
            </div>

            {/* Decorative Badge */}
            <div className="absolute top-10 -right-10 lg:right-0 bg-gradient-to-r from-[#ffd966] to-[#ffb347] px-4 py-2 rounded-full shadow-lg transform rotate-12 animate-pulse-slow">
              <span className="text-xs font-black text-[#1a1a1a]">
                BILIM USTASI
              </span>
            </div>
          </div>

          {/* Content Section */}
          <div className="relative pb-4">
            {/* Title and Newsletter Row */}
            <div className="flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between lg:gap-8">
              {/* Title */}
              <div className="relative">
                <h2 className="font-bebas text-5xl sm:text-6xl lg:text-7xl text-[#161616] leading-none">
                  <span className="block transform hover:scale-105 transition-transform duration-300">
                    BILIMDA
                  </span>
                  <span className="block text-transparent bg-clip-text bg-gradient-to-r from-[#ffd966] to-[#ffb347] drop-shadow-[0_4px_0_#b94b1f]">
                    QOLING
                  </span>
                </h2>

                {/* Decorative Line */}
                <div className="absolute -bottom-4 left-0 w-20 h-1 bg-gradient-to-r from-[#ffd966] to-transparent rounded-full" />
              </div>

              {/* Newsletter Form */}
              <form
                onSubmit={(e) => e.preventDefault()}
                className="group relative w-full lg:max-w-[500px]"
              >
                {/* Shadow */}
                <div className="absolute -inset-2 bg-black/10 rounded-2xl blur-xl group-hover:blur-2xl transition-all" />

                {/* Input Container */}
                <div className="relative flex items-center bg-white rounded-2xl shadow-[0_15px_25px_rgba(0,0,0,0.1)] overflow-hidden">
                  {/* Icon */}
                  <div className="pl-5">
                    <GiEarthAmerica className="text-2xl text-[#ffd966]" />
                  </div>

                  {/* Input */}
                  <input
                    type="email"
                    placeholder="Yangiliklarga obuna bo‘ling"
                    className="w-full h-14 bg-transparent px-4 text-sm font-semibold text-gray-700 outline-none placeholder:text-gray-400"
                  />

                  {/* Submit Button */}
                  <button
                    type="submit"
                    className="group/btn relative h-14 w-14 bg-gradient-to-r from-[#ffd966] to-[#ffb347] 
                               shadow-[0_8px_0_rgba(200,100,0,0.5)] hover:translate-y-1 
                               hover:shadow-[0_6px_0_rgba(200,100,0,0.5)] active:translate-y-2 
                               active:shadow-[0_4px_0_rgba(200,100,0,0.5)] transition-all mr-1 rounded-xl"
                    aria-label="Obuna bo‘lish"
                  >
                    <FaArrowRight className="mx-auto text-xl text-[#1a1a1a] transform group-hover/btn:translate-x-1 transition-transform" />
                    <span className="absolute inset-0 rounded-xl bg-white/20 opacity-0 group-hover/btn:opacity-100 transition-opacity" />
                  </button>
                </div>

                {/* Success Message */}
                <div className="absolute -bottom-8 left-5 text-xs font-bold text-green-600 opacity-0 group-focus-within:opacity-100 transition-opacity">
                  ✓ Yangiliklar sizga tez yetib boradi!
                </div>
              </form>
            </div>

            {/* Navigation Links */}
            <nav className=" mt-16 grid grid-cols-2 gap-6 sm:grid-cols-4">
              {[
                {
                  icon: <FaGamepad />,
                  label: "O‘yin o‘ynash",
                  color: "from-[#ffd966] to-[#ffb347]",
                },
                {
                  icon: <FaUsers />,
                  label: "Yaratish & ulashish",
                  color: "from-[#ff9acb] to-[#d42d73]",
                },
                {
                  icon: <FaTv />,
                  label: "Ommabop darslar",
                  color: "from-[#63d3da] to-[#2a9d8f]",
                },
                {
                  icon: <FaCalendarAlt />,
                  label: "Tadbirlar",
                  color: "from-[#f4a261] to-[#e76f51]",
                },
              ].map((item, index) => (
                <a
                  key={index}
                  href="#"
                  className="group relative block"
                  
                >
                  <div
                    className="relative bg-white rounded-2xl p-5 shadow-[0_10px_15px_rgba(0,0,0,0.05)] 
                                  transform group-hover:-translate-y-2 group-hover:shadow-xl transition-all duration-300
                                  border border-gray-100"
                  >
                    <div
                      className={`w-12 h-12 rounded-xl bg-gradient-to-r ${item.color} 
                                    flex items-center justify-center mb-3 shadow-lg
                                    transform group-hover:scale-110 group-hover:rotate-3 transition-all duration-300`}
                    >
                      <span className="text-2xl text-white">{item.icon}</span>
                    </div>

                    <span
                      className="font-bebas text-xl text-gray-800 group-hover:text-transparent 
                                   group-hover:bg-clip-text group-hover:bg-gradient-to-r group-hover:from-[#ffd966] 
                                   group-hover:to-[#ffb347] transition-all duration-300"
                    >
                      {item.label}
                    </span>

                    <div
                      className="absolute inset-0 rounded-2xl bg-gradient-to-r from-transparent via-white/20 to-transparent 
                                  opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none"
                    />
                  </div>
                </a>
              ))}
            </nav>

            {/* Bottom Bar */}
            <div
              className=" mt-16 pt-6 border-t-2 border-gray-200/60"
             
            >
              <div className="flex flex-col gap-6">
                {/* Social Icons */}
                <div className="flex items-center gap-4">
                  {[
                    { icon: <FaFacebookF />, label: "facebook", color: "#4267B2" },
                    { icon: <FaTwitter />, label: "twitter", color: "#1DA1F2" },
                    { icon: <FaYoutube />, label: "youtube", color: "#FF0000" },
                  ].map((social, index) => (
                    <button
                      key={index}
                      type="button"
                      aria-label={social.label}
                      className="group relative"
                      onMouseEnter={() => setHoveredSocial(social.label)}
                      onMouseLeave={() => setHoveredSocial(null)}
                    >
                      <div className="absolute -inset-1 bg-black/10 rounded-full blur-md group-hover:blur-lg transition-all" />

                      <div
                        className="relative w-12 h-12 rounded-full bg-white shadow-[0_8px_0_rgba(0,0,0,0.1)] 
                                    flex items-center justify-center transform group-hover:-translate-y-1 
                                    group-hover:shadow-[0_6px_0_rgba(0,0,0,0.1)] transition-all"
                      >
                        <span
                          className="transition-colors duration-300"
                          style={{
                            color:
                              hoveredSocial === social.label ? social.color : "#4b5563",
                          }}
                        >
                          {social.icon}
                        </span>

                        <span
                          className="absolute inset-0 rounded-full bg-gradient-to-br from-white/80 to-transparent opacity-0 
                                       group-hover:opacity-100 transition-opacity"
                        />
                      </div>

                      <span
                        className="absolute -top-8 left-1/2 -translate-x-1/2 text-xs font-bold text-gray-500 
                                     opacity-0 group-hover:opacity-100 transition-opacity"
                      >
                        {social.label}
                      </span>
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Decorative Wave Lines */}
        <svg
          className="pointer-events-none absolute right-0 bottom-0 w-[600px] opacity-20"
          viewBox="0 0 600 300"
          fill="none"
        >
          <path
            d="M40 200C150 120 270 80 500 60"
            stroke="#d42d73"
            strokeWidth="4"
            strokeLinecap="round"
            strokeDasharray="8 8"
          />
          <path
            d="M60 240C170 160 290 120 520 100"
            stroke="#ffd966"
            strokeWidth="4"
            strokeLinecap="round"
            strokeDasharray="8 8"
          />
          <path
            d="M80 280C190 200 310 160 540 140"
            stroke="#ffb347"
            strokeWidth="4"
            strokeLinecap="round"
            strokeDasharray="8 8"
          />
        </svg>

        {/* Floating Dots */}
        <div className="absolute left-20 bottom-20 flex gap-2">
          {[0, 1, 2, 3].map((i) => (
            <div
              key={i}
              className="w-2 h-2 rounded-full bg-gradient-to-r from-[#ffd966] to-[#ffb347] opacity-20"
              style={{ animationDelay: `${i * 200}ms` }}
            />
          ))}
        </div>
      </div>
    </footer>
  );
}

export default Footer;
