"use client";

import { useEffect, useState } from "react";
import { Activity, ShieldCheck, ShieldAlert, AlertTriangle } from "lucide-react";

type ActivityItem = {
  id: string;
  payload: string;
  trackingId: string;
  toxicityScore: number;
  action: "ALLOW" | "BLOCK" | "FLAG";
  createdAt: string;
};

export function ActivityFeed() {
  const [items, setItems] = useState<ActivityItem[]>([]);

  useEffect(() => {
    fetchActivity();
    // Poll every 3 seconds to create a "Live" feel
    const interval = setInterval(fetchActivity, 3000);
    return () => clearInterval(interval);
  }, []);

  const fetchActivity = async () => {
    try {
      const res = await fetch("/api/activity");
      const data = await res.json();
      setItems(data);
    } catch (error) {
      console.error("Failed to fetch activity feed", error);
    }
  };

  const getActionStyles = (action: string) => {
    switch (action) {
      case "ALLOW":
        return { bg: "bg-green-500/10", border: "border-green-500/20", text: "text-green-500", icon: <ShieldCheck className="w-5 h-5 text-green-500" /> };
      case "BLOCK":
        return { bg: "bg-red-500/10", border: "border-red-500/20", text: "text-red-500", icon: <ShieldAlert className="w-5 h-5 text-red-500" /> };
      case "FLAG":
        return { bg: "bg-yellow-500/10", border: "border-yellow-500/20", text: "text-yellow-500", icon: <AlertTriangle className="w-5 h-5 text-yellow-500" /> };
      default:
        return { bg: "bg-gray-500/10", border: "border-gray-500/20", text: "text-gray-500", icon: <Activity className="w-5 h-5 text-gray-500" /> };
    }
  };

  return (
    <div className="bg-gray-950 border border-gray-800 rounded-xl overflow-hidden shadow-2xl flex flex-col h-[800px]">
      <div className="p-4 border-b border-gray-800 flex items-center justify-between bg-gray-900/50">
        <div className="flex items-center space-x-2">
          <Activity className="w-5 h-5 text-blue-400" />
          <h2 className="font-semibold text-lg">Live Activity Feed</h2>
        </div>
        <div className="flex items-center space-x-2">
          <span className="relative flex h-3 w-3">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-3 w-3 bg-green-500"></span>
          </span>
          <span className="text-xs text-gray-400 uppercase tracking-wider font-medium">Real-time</span>
        </div>
      </div>
      
      <div className="flex-1 overflow-y-auto p-4 space-y-3 custom-scrollbar">
        {items.length === 0 ? (
          <div className="text-center text-gray-500 mt-10">Waiting for events...</div>
        ) : (
          items.map((item) => {
            const styles = getActionStyles(item.action);
            return (
              <div key={item.id} className={`p-4 rounded-lg border ${styles.bg} ${styles.border} transition-all`}>
                <div className="flex justify-between items-start mb-2">
                  <div className="flex items-center space-x-2">
                    {styles.icon}
                    <span className={`text-sm font-bold tracking-wide ${styles.text}`}>{item.action}</span>
                  </div>
                  <span className="text-xs text-gray-500 tabular-nums">
                    Score: {item.toxicityScore.toFixed(3)}
                  </span>
                </div>
                <p className="text-sm text-gray-300 line-clamp-2">{item.payload}</p>
                <div className="mt-2 text-[10px] text-gray-600 font-mono">
                  {item.trackingId}
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}
