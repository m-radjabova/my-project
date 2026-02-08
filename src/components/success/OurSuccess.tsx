import CountUp from "react-countup";
import { useEffect, useRef, useState } from "react";

function OurSuccess() {
  const [start, setStart] = useState(false);
  const sectionRef = useRef<HTMLDivElement | null>(null);

  const stats = [
    { name: "Students", value: 15, suffix: "K" },
    { name: "Total Success", value: 75, suffix: "%" },
    { name: "Main questions", value: 35, suffix: "" },
    { name: "Chief experts", value: 26, suffix: "" },
    { name: "Years of experience", value: 16, suffix: "" },
  ];

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setStart(true);
          observer.disconnect();
        }
      },
      { threshold: 0.3 }
    );

    if (sectionRef.current) observer.observe(sectionRef.current);

    return () => observer.disconnect();
  }, []);

  return (
    <section
      ref={sectionRef}
      className="py-16 bg-gradient-to-b from-white to-cyan-50 animate-fade-in-up"
    >
      <div className="mx-auto max-w-7xl text-center px-6">
        <h2 className="text-3xl md:text-4xl font-bold text-gray-900">
          Our Success
        </h2>

        <p className="mt-4 max-w-2xl mx-auto text-gray-500 text-sm md:text-base leading-relaxed">
          Ornare id fames interdum porttitor nulla turpis etiam. Diam vitae
          sollicitudin at nec nam et pharetra gravida.
        </p>

        <div className="mt-16 flex flex-wrap justify-center gap-20">
          {stats.map((item, i) => (
            <div
              key={i}
              className="text-center group cursor-pointer transition-all duration-300 p-4 rounded-lg hover:bg-white/50"
            >
              <h3
                className="
                  text-[48px] sm:text-[64px] lg:text-[70px]
                  leading-none whitespace-nowrap font-semibold
                  bg-gradient-to-r from-[#136CB5] to-[#49BBBD]
                  bg-clip-text text-transparent
                  group-hover:scale-110 transition-transform duration-300
                "
              >
                {start && (
                  <CountUp
                    start={0}
                    end={item.value}
                    duration={1.5}
                    suffix={item.suffix}
                  />
                )}
              </h3>

              <p className="mt-3 text-gray-600 text-[16px] group-hover:text-[#49BBBD] transition-colors duration-300">
                {item.name}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

export default OurSuccess;