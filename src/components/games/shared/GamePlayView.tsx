import type { ReactNode } from "react";
import { FaSlidersH } from "react-icons/fa";
import { useLocation } from "react-router-dom";
import { gameCards } from "../../../pages/games/data";
import { getGameSessionConfig } from "../../../hooks/gameSession";

type GamePlayViewProps = {
  colorClassName: string;
  children: ReactNode;
};

export default function GamePlayView({
  colorClassName,
  children,
}: GamePlayViewProps) {
  const location = useLocation();
  const game = gameCards.find(
    (item) => `${item.path}/play` === location.pathname
  );
  const session = game ? getGameSessionConfig(game.id) : null;

  return (
    <div className="relative min-h-screen overflow-hidden bg-[#050816] px-4 py-6 md:px-6 md:py-8">
      <div className={`pointer-events-none absolute inset-0 bg-gradient-to-br ${colorClassName} opacity-15`} />

      <div className="relative z-10 mx-auto flex min-h-screen w-full max-w-[1600px] flex-col">
        {game && (
          <div className="mb-4 rounded-3xl border border-white/12 bg-white/6 p-4 backdrop-blur-xl md:p-5">
            <div className="flex flex-wrap items-center justify-between gap-4">
              <div>
                <p className="text-xs font-bold uppercase tracking-[0.25em] text-white/45">
                  Tanlangan Game Mode
                </p>
                <h2 className="mt-1 text-2xl font-black text-white">
                  {game.title}
                </h2>
                <p className="mt-1 text-sm text-white/60">
                  {session
                    ? `${session.participantCount} ${session.participantLabel} · ${game.time}`
                    : `${game.players} · ${game.time}`}
                </p>
              </div>

              <div className="flex items-center gap-3 rounded-2xl border border-white/10 bg-black/20 px-4 py-3 text-white/80">
                <div
                  className={`flex h-10 w-10 items-center justify-center rounded-2xl bg-gradient-to-r ${colorClassName}`}
                >
                  <FaSlidersH className="text-sm text-white" />
                </div>
                <div>
                  <p className="text-xs font-bold uppercase tracking-[0.2em] text-white/45">
                    Rejim
                  </p>
                  <p className="text-sm font-bold text-white">
                    {session ? `${session.participantCount} ${session.participantLabel}` : game.players}
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}
        <div className="rounded-3xl border border-white/12 bg-white/5 p-4 backdrop-blur-xl md:p-6">
          {children}
        </div>
      </div>
    </div>
  );
}
