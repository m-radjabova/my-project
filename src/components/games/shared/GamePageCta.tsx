import { Link } from "react-router-dom";
import { FaArrowRight, FaPlay } from "react-icons/fa";
import type { IconType } from "react-icons";

type GamePageCtaProps = {
  to: string;
  title: string;
  description: string;
  icon: IconType;
  colorClassName: string;
};

export default function GamePageCta({
  to,
  title,
  description,
  icon: Icon,
  colorClassName,
}: GamePageCtaProps) {
  return (
    <div className="relative overflow-hidden rounded-3xl border border-white/15 bg-black/20 p-6 backdrop-blur-xl shadow-2xl md:p-8">
      <div className={`absolute inset-0 bg-gradient-to-r ${colorClassName} opacity-10`} />
      <div className="relative flex flex-col gap-5 lg:flex-row lg:items-center lg:justify-between">
        <div className="max-w-2xl">
          <div className="mb-4 inline-flex h-14 w-14 items-center justify-center rounded-2xl bg-white/10 text-white shadow-lg">
            <Icon className="text-2xl" />
          </div>
          <h2 className="text-2xl font-black text-white md:text-3xl">{title}</h2>
          <p className="mt-2 text-sm text-white/75 md:text-base">{description}</p>
        </div>

        <Link
          to={to}
          className={`inline-flex items-center justify-center gap-3 rounded-2xl bg-gradient-to-r ${colorClassName} px-6 py-4 text-sm font-black text-white shadow-xl transition-transform hover:scale-[1.02] active:scale-[0.98] md:min-w-64`}
        >
          <FaPlay className="text-sm" />
          <span>O'yinni boshlash</span>
          <FaArrowRight className="text-sm" />
        </Link>
      </div>
    </div>
  );
}
