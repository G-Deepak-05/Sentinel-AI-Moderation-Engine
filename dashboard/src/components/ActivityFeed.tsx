"use client";

import { useEffect, useState, useRef } from "react";
import { Activity, ShieldCheck, ShieldAlert, AlertTriangle, Trash2 } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

type ActivityItem = {
  id: string;
  payload: string;
  trackingId: string;
  toxicityScore: number;
  severeInsultScore?: number;
  harassmentScore?: number;
  threatScore?: number;
  action: "ALLOW" | "BLOCK" | "FLAG";
  createdAt: string;
};

export function ActivityFeed() {
  const [items, setItems] = useState<ActivityItem[]>([]);
  const clearedTimestampRef = useRef<number>(0);

  useEffect(() => {
    fetchActivity();
    const interval = setInterval(fetchActivity, 3000);
    return () => clearInterval(interval);
  }, []);

  const fetchActivity = async () => {
    try {
      const res = await fetch("/api/activity");
      const data: ActivityItem[] = await res.json();
      
      const filteredData = data.filter((item) => {
        return new Date(item.createdAt).getTime() > clearedTimestampRef.current;
      });

      setItems(filteredData.slice(0, 30));
    } catch (error) {
      console.error("Failed to fetch activity feed", error);
    }
  };

  const handleClearFeed = () => {
    clearedTimestampRef.current = Date.now();
    setItems([]);
  };

  const getActionStyles = (action: string) => {
    switch (action) {
      case "ALLOW":
        return { bg: "bg-emerald-300", border: "border-black", text: "text-black", icon: <ShieldCheck className="w-5 h-5 text-black" /> };
      case "BLOCK":
        return { bg: "bg-rose-400", border: "border-black", text: "text-black", icon: <ShieldAlert className="w-5 h-5 text-black" /> };
      case "FLAG":
        return { bg: "bg-amber-300", border: "border-black", text: "text-black", icon: <AlertTriangle className="w-5 h-5 text-black" /> };
      default:
        return { bg: "bg-slate-300", border: "border-black", text: "text-black", icon: <Activity className="w-5 h-5 text-black" /> };
    }
  };

  const getReasons = (item: ActivityItem) => {
    const reasons = [];
    if (item.toxicityScore > 0.5) reasons.push("Toxicity");
    if ((item.severeInsultScore || 0) > 0.5) reasons.push("Severe Insult");
    if ((item.harassmentScore || 0) > 0.5) reasons.push("Harassment");
    if ((item.threatScore || 0) > 0.5) reasons.push("Threat");
    if (reasons.length === 0 && item.action !== "ALLOW") reasons.push("Inappropriate Content");
    return reasons;
  };

  return (
    <div className="bg-white border-[3px] border-black shadow-[8px_8px_0_0_#000] flex flex-col h-[800px] overflow-hidden">
      <div className="p-6 border-b-[3px] border-black flex items-center justify-between bg-white relative overflow-hidden">
        <div className="flex items-center space-x-3">
          <Activity className="w-6 h-6 text-black stroke-[3]" />
          <h2 className="font-extrabold text-xl text-black uppercase tracking-tight">Live Activity Feed</h2>
        </div>
        <div className="flex items-center space-x-6 relative z-10">
          <button 
            onClick={handleClearFeed}
            className="flex items-center text-xs text-black font-extrabold uppercase tracking-widest px-3 py-1.5 bg-white border-2 border-black hover:bg-black hover:text-white transition-colors shadow-[2px_2px_0_0_#000] hover:shadow-none hover:translate-x-[2px] hover:translate-y-[2px]"
            title="Clear Feed (Frontend Only)"
          >
            <Trash2 className="w-4 h-4 mr-2 stroke-[2]" />
            Clear
          </button>
          <div className="flex items-center space-x-2 border-2 border-black px-3 py-1.5 bg-[#FFD600] shadow-[2px_2px_0_0_#000]">
            <span className="relative flex h-3.5 w-3.5">
              <span className="animate-ping absolute inline-flex h-full w-full bg-black opacity-75"></span>
              <span className="relative inline-flex h-3.5 w-3.5 bg-black border border-white"></span>
            </span>
            <span className="text-[11px] text-black uppercase tracking-widest font-extrabold">Real-time</span>
          </div>
        </div>
      </div>
      
      <div className="flex-1 overflow-y-auto p-6 space-y-5 custom-scrollbar bg-white">
        {items.length === 0 ? (
          <div className="text-center text-black font-bold uppercase tracking-widest mt-10 text-sm">Waiting for new events...</div>
        ) : (
          <AnimatePresence initial={false}>
            {items.map((item) => {
              const styles = getActionStyles(item.action);
              const reasons = getReasons(item);
              
              return (
                <motion.div
                  key={item.id}
                  layout
                  initial={{ opacity: 0, y: -40, scale: 0.95 }}
                  animate={{ opacity: 1, y: 0, scale: 1, transition: { type: "spring", stiffness: 300, damping: 20 } }}
                  exit={{ opacity: 0, scale: 0.9, transition: { duration: 0.15 } }}
                  className={`p-5 border-[3px] shadow-[4px_4px_0_0_#000] ${styles.bg} ${styles.border} transition-all relative overflow-hidden group`}
                >
                  <div className="absolute inset-0 bg-white opacity-0 group-hover:opacity-10 transition-opacity duration-300 pointer-events-none"></div>
                  
                  <div className="flex justify-between items-start mb-3">
                    <div className="flex items-center space-x-3 border-2 border-black bg-white px-2 py-1 shadow-[2px_2px_0_0_#000]">
                      {styles.icon}
                      <span className={`text-xs font-extrabold uppercase tracking-widest ${styles.text}`}>{item.action}</span>
                    </div>
                    <span className="text-xs text-black font-extrabold bg-white border-2 border-black px-2 py-1 uppercase tracking-widest shadow-[2px_2px_0_0_#000]">
                      Score: {item.toxicityScore.toFixed(3)}
                    </span>
                  </div>
                  
                  <p className="text-lg font-medium text-black line-clamp-3 leading-relaxed mb-3">
                    {item.payload}
                  </p>

                  {(item.action === "BLOCK" || item.action === "FLAG") && reasons.length > 0 && (
                    <div className="bg-white/60 border-2 border-black p-3 mb-3 text-sm shadow-inner">
                      <div className="font-extrabold uppercase tracking-widest text-xs mb-2 border-b-2 border-black pb-1 inline-block">Reason</div>
                      <ul className="space-y-1">
                        {reasons.map((reason, idx) => (
                          <li key={idx} className="font-bold text-black flex items-center">
                            <span className="w-1.5 h-1.5 bg-black mr-2"></span> {reason}
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}

                  <div className="text-[10px] text-black font-extrabold uppercase tracking-widest border-t-2 border-black pt-2 opacity-80">
                    ID: {item.trackingId}
                  </div>
                </motion.div>
              );
            })}
          </AnimatePresence>
        )}
      </div>
    </div>
  );
}
