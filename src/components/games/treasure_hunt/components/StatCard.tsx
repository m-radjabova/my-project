import type { ReactNode } from "react";

type Props = {
  title: string;
  value: string;
  icon: ReactNode;
};

export default function StatCard({ title, value, icon }: Props) {
  return (
    <div className="rounded-2xl border border-white/20 bg-black/10 p-4">
      <div className="flex items-center justify-center gap-2 text-xs font-black uppercase tracking-[0.12em] text-white/70">
        {icon} {title}
      </div>
      <div className="mt-2 text-2xl font-black text-white">{value}</div>
    </div>
  );
}
