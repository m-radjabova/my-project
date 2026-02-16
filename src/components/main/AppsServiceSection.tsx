import { FaPlus, FaArrowRight, FaStar  } from "react-icons/fa";
import { GiCube, GiBookCover, GiPresent, GiOrbit, GiSparkles, GiPlanetCore } from "react-icons/gi";

type ServiceItem = {
  title: string;
  description?: string;
  kind: "cube" | "book" | "gift";
  color: string;
  icon: React.ReactNode;
};

// const items: ServiceItem[] = [
//   { 
//     title: "PLAY BECAUSE\nYOU WANT TO", 
//     kind: "cube", 
//     color: "from-[#ffcc42] to-[#d77c00]",
//     icon: <GiCube className="text-6xl text-white/90" />
//   },
//   { 
//     title: "COOL UNDER\nPRESSURE.", 
//     kind: "book", 
//     color: "from-[#e7a25d] to-[#9a4c13]",
//     icon: <GiBookCover className="text-6xl text-white/90" />
//   },
//   {
//     title: "COOL UNDER\nPRESSURE.",
//     description: "GAMES IS TO PLAY THEM\nTHE FUTURE IS NOW\nTHE BEST WAY",
//     kind: "gift",
//     color: "from-[#ff3db4] to-[#7f0d57]",
//     icon: <GiPresent className="text-6xl text-white/90" />
//   },
// ];


const items: ServiceItem[] = [
  { 
    title: "O‘YIN ORQALI\nO‘RGANING", 
    kind: "cube", 
    color: "from-[#ffcc42] to-[#d77c00]",
    icon: <GiCube className="text-6xl text-white/90" />
  },
  { 
    title: "OSON VA\nTUSHUNARLI.", 
    kind: "book", 
    color: "from-[#e7a25d] to-[#9a4c13]",
    icon: <GiBookCover className="text-6xl text-white/90" />
  },
  {
    title: "MUKOFOTLARNI\nYUTING.",
    description: "TOPSHIRIQLARNI BAJARING\nBALL YIG‘ING VA O‘SING\nYUTUQLARNI OCHING.",
    kind: "gift",
    color: "from-[#ff3db4] to-[#7f0d57]",
    icon: <GiPresent className="text-6xl text-white/90" />
  },
];



function AppsServiceSection() {
  
  return (
    <section
      className={`section-reveal relative min-h-screen overflow-hidden bg-gradient-to-br from-[#f8f8f8] via-[#f0f0f0] to-[#e8e8e8] py-20 lg:py-22 `}
    >
      
      {/* Background Decorations */}
      <div className="absolute inset-0">
        {/* Floating Orbs */}
        <div className="absolute top-20 left-20 animate-float-slow">
          <GiOrbit className="text-8xl text-[#ffd966]/20" />
        </div>
        <div className="absolute bottom-40 right-20 animate-float">
          <GiPlanetCore className="text-9xl text-[#ffb347]/15" />
        </div>
        <div className="absolute top-40 right-40 animate-pulse">
          <GiSparkles className="text-7xl text-[#ff3db4]/10" />
        </div>

        {/* Grid Pattern */}
        <div className="absolute inset-0" style={{
          backgroundImage: `radial-gradient(circle at 1px 1px, #00000010 1px, transparent 0)`,
          backgroundSize: '40px 40px'
        }} />
      </div>

      <div className="relative z-20 mx-auto max-w-8xl px-4 sm:px-6 lg:px-8">
        
        {/* Header Section */}
        <div className="relative text-center lg:text-left">
          {/* Small Tag */}
          <div
            className="inline-flex items-center gap-2 bg-white/80 backdrop-blur-sm px-5 py-2 rounded-full shadow-lg mb-6"
            data-aos="fade-up"
          >
            <FaStar className="text-[#ffd966] text-sm" />
            <span className="text-xs font-black tracking-[0.3em] text-[#1f1f1f]">
              LET THE GAMES BEGIN
            </span>
          </div>

          {/* Main Title */}
          <h2 className="font-bebas text-5xl sm:text-5xl lg:text-7xl text-[#141414] leading-none">
            <span className="block transform" data-aos="fade-right" data-aos-delay="100">
             ILOVALARIMIZ BILAN TANISHING
            </span>
            <span
              className="block text-transparent bg-clip-text bg-gradient-to-r from-[#ffd966] to-[#ffb347] drop-shadow-[0_4px_0_#b94b1f]"
              data-aos="fade-left"
              data-aos-delay="180"
            >
              XIZMATLAR
            </span>
          </h2>

          {/* Decorative Line */}
          <div className="absolute -bottom-8 left-0 w-32 h-1 bg-gradient-to-r from-[#ffd966] to-transparent rounded-full hidden lg:block" />
        </div>

        {/* Cards Grid */}
        <div className=" grid gap-12 lg:gap-8 lg:grid-cols-3 mt-16">
          {items.map((item, index) => (
            <div
              key={index}
              className="group relative"
              data-aos={index % 2 === 0 ? "fade-right" : "fade-left"}
              data-aos-delay={index * 140 + 220}
            >
              {/* Card Container */}
              <div className="relative transform group-hover:-translate-y-4 transition-all duration-500">
                
                {/* Shadow */}
                <div className="absolute -inset-4 bg-black/10 rounded-[32px] blur-2xl group-hover:blur-3xl transition-all" />
                
                {/* Main Card */}
                <div className="relative bg-white rounded-[28px] p-8 shadow-[0_20px_40px_rgba(0,0,0,0.1)] overflow-visible">
                  
                  {/* Background Gradient */}
                  <div className={`absolute inset-0 bg-gradient-to-br ${item.color} opacity-0 group-hover:opacity-5 transition-opacity duration-500`} />
                  
                  {/* Icon Container - Floating above card */}
                  <div className="absolute -top-12 right-6 z-20 transform group-hover:scale-110 group-hover:-rotate-6 transition-all duration-500">
                    <div className={`relative w-32 h-32 rounded-3xl bg-gradient-to-br ${item.color} shadow-[0_20px_0_rgba(0,0,0,0.15),inset_0_-5px_10px_rgba(0,0,0,0.2),inset_0_5px_10px_rgba(255,255,255,0.5)] flex items-center justify-center transform rotate-12`}>
                      {/* Inner Glow */}
                      <div className="absolute inset-0 rounded-3xl bg-[radial-gradient(circle_at_30%_30%,rgba(255,255,255,0.8),transparent_70%)]" />
                      
                      {/* Icon */}
                      <div className="relative z-1">
                        {item.icon}
                      </div>

                      {/* Highlight */}
                      <div className="absolute -top-2 -left-2 w-8 h-8 bg-white/40 rounded-full blur-sm" />
                    </div>
                  </div>

                  {/* Content */}
                  <div className="mt-16 max-w-[65%]">
                    <h3 className="font-bebas text-3xl leading-tight text-[#1b1b1b]">
                      {item.title.split('\n').map((line, i) => (
                        <span key={i} className="block">{line}</span>
                      ))}
                    </h3>

                    {item.description && (
                      <div className="mt-4 space-y-1">
                        {item.description.split('\n').map((line, i) => (
                          <p key={i} className="font-['Inter'] text-xs font-semibold text-gray-500 leading-relaxed">
                            {line}
                          </p>
                        ))}
                      </div>
                    )}

                    {/* Decorative Elements */}
                    <div className="flex items-center gap-2 mt-6">
                      {[...Array(3)].map((_, i) => (
                        <div
                          key={i}
                          className={`w-2 h-2 rounded-full bg-gradient-to-r ${item.color} opacity-60`}
                          style={{ animationDelay: `${i * 150}ms` }}
                        />
                      ))}
                    </div>
                  </div>

                  {/* Action Button */}
                  <button className="absolute -bottom-6 left-8 z-20 group/btn">
                    <div className="relative">
                      {/* Button Shadow */}
                      <div className="absolute inset-0 bg-black/20 rounded-full blur-md group-hover/btn:blur-lg transition-all" />
                      
                      {/* Button */}
                      <div className={`relative w-16 h-16 rounded-full bg-gradient-to-br ${item.color} shadow-[0_10px_0_rgba(0,0,0,0.15)] flex items-center justify-center transform group-hover/btn:scale-110 group-hover/btn:-translate-y-1 transition-all duration-300`}>
                        {/* Inner Border */}
                        <div className="absolute inset-1 rounded-full border-4 border-white/30" />
                        
                        {/* Icon */}
                        <span className="relative z-10 text-3xl font-black text-white transform group-hover/btn:rotate-90 transition-transform duration-300">
                          {index === 2 ? <FaArrowRight /> : <FaPlus />}
                        </span>

                        {/* Glow Effect */}
                        <div className="absolute inset-0 rounded-full bg-white/20 opacity-0 group-hover/btn:opacity-100 transition-opacity" />
                      </div>
                    </div>
                  </button>
                </div>
              </div>

              {/* Bottom Label */}
              <div className="absolute -bottom-8 left-12 opacity-0 group-hover:opacity-100 transition-opacity duration-500">
                <span className="text-xs font-black text-gray-400 tracking-wider">
                  {index === 0 ? "O'YIN" : index === 1 ? "O'QISH" : "MUKOFOTLAR"}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

export default AppsServiceSection;
