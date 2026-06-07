"use client";

import { useEffect, useState } from "react";

type Stats = {
  totalProcessed: number;
  allowed: number;
  blocked: number;
  queueSize: number;
};

export function TrendWidgets() {
  const [stats, setStats] = useState<Stats | null>(null);

  useEffect(() => {
    fetchStats();
    const interval = setInterval(fetchStats, 3000);
    return () => clearInterval(interval);
  }, []);

  const fetchStats = async () => {
    try {
      const res = await fetch("/api/stats");
      const data = await res.json();
      setStats(data);
    } catch (e) {
      console.error(e);
    }
  };

  if (!stats) return null;

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10 w-full max-w-7xl">
      <div className="bg-white border-[3px] border-black p-6 shadow-[6px_6px_0_0_#000]">
        <div className="text-sm font-extrabold uppercase tracking-widest text-black mb-2">Events Processed</div>
        <div className="text-5xl font-extrabold text-black tabular-nums">{stats.totalProcessed.toLocaleString()}</div>
      </div>
      <div className="bg-rose-400 border-[3px] border-black p-6 shadow-[6px_6px_0_0_#000]">
        <div className="text-sm font-extrabold uppercase tracking-widest text-black mb-2">Items Blocked</div>
        <div className="text-5xl font-extrabold text-black tabular-nums">{stats.blocked.toLocaleString()}</div>
      </div>
      <div className="bg-amber-300 border-[3px] border-black p-6 shadow-[6px_6px_0_0_#000]">
        <div className="text-sm font-extrabold uppercase tracking-widest text-black mb-2">Pending Queue</div>
        <div className="text-5xl font-extrabold text-black tabular-nums">{stats.queueSize.toLocaleString()}</div>
      </div>
    </div>
  );
}
