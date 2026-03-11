import type { ReactNode } from "react";

type GamePlayViewProps = {
  colorClassName: string;
  children: ReactNode;
};

export default function GamePlayView({
  colorClassName,
  children,
}: GamePlayViewProps) {
  return (
    <div className="relative min-h-screen overflow-hidden bg-[#050816] px-4 py-6 md:px-6 md:py-8">
      <div className={`pointer-events-none absolute inset-0 bg-gradient-to-br ${colorClassName} opacity-15`} />

      <div className="relative z-10 mx-auto flex min-h-screen w-full max-w-[1600px] flex-col">
        <div className="rounded-3xl border border-white/12 bg-white/5 p-4 backdrop-blur-xl md:p-6">
          {children}
        </div>
      </div>
    </div>
  );
}
