"use client";

import { useEffect, useState } from "react";
import { Check, X, AlertTriangle, ShieldCheck, ShieldAlert } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

type ModerationItem = {
  id: string;
  payload: string;
  trackingId: string;
  toxicityScore: number;
  severeInsultScore?: number;
  harassmentScore?: number;
  threatScore?: number;
  explainingTokens: string;
  createdAt: string;
};

type Stats = {
  totalProcessed: number;
  allowed: number;
  blocked: number;
  queueSize: number;
};

export function ReviewQueue() {
  const [items, setItems] = useState<ModerationItem[]>([]);
  const [stats, setStats] = useState<Stats | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchQueue();
    fetchStats();
  }, []);

  const fetchQueue = async () => {
    try {
      const res = await fetch("/api/queue");
      const data = await res.json();
      setItems(data);
    } catch (error) {
      console.error("Failed to fetch queue", error);
    } finally {
      setLoading(false);
    }
  };

  const fetchStats = async () => {
    try {
      const res = await fetch("/api/stats");
      const data = await res.json();
      setStats(data);
    } catch (error) {
      console.error("Failed to fetch stats", error);
    }
  };

  const handleAction = async (id: string, action: string) => {
    // Optimistically remove item from UI
    setItems((prev) => prev.filter((item) => item.id !== id));
    // Also optimistically update stats if queue is empty
    if (stats) {
      setStats((prev) => prev ? { ...prev, queueSize: Math.max(0, prev.queueSize - 1) } : null);
    }
    
    try {
      await fetch("/api/action", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id, action }),
      });
      // Re-fetch stats after action resolves
      fetchStats();
    } catch (error) {
      console.error("Failed to submit action", error);
    }
  };

  const getReasons = (item: ModerationItem) => {
    const reasons = [];
    if (item.toxicityScore > 0.5) reasons.push("Toxicity");
    if ((item.severeInsultScore || 0) > 0.5) reasons.push("Severe Insult");
    if ((item.harassmentScore || 0) > 0.5) reasons.push("Harassment");
    if ((item.threatScore || 0) > 0.5) reasons.push("Threat");
    if (reasons.length === 0) reasons.push("Inappropriate Content");
    return reasons;
  };

  if (loading) {
    return <div className="text-center text-black font-bold uppercase tracking-widest p-12">Loading queue...</div>;
  }

  return (
    <div className="bg-white border-[3px] border-black shadow-[8px_8px_0_0_#000] flex flex-col h-[800px] overflow-hidden">
      {items.length === 0 ? (
        <div className="flex-1 flex flex-col items-center justify-center p-12 bg-white text-black">
          <AlertTriangle className="h-12 w-12 text-black mb-4 stroke-[3]" />
          <h2 className="text-2xl font-extrabold uppercase tracking-widest mb-6">Queue is clear</h2>
          
          {stats && (
            <div className="w-full max-w-sm flex flex-col space-y-4">
              <div className="flex justify-between items-center border-b-2 border-black pb-2">
                <span className="font-extrabold uppercase tracking-widest text-xs">Pending Reviews</span>
                <span className="font-bold tabular-nums text-lg">{stats.queueSize}</span>
              </div>
              <div className="flex justify-between items-center border-b-2 border-black pb-2">
                <span className="font-extrabold uppercase tracking-widest text-xs">Total Processed Today</span>
                <span className="font-bold tabular-nums text-lg">{stats.totalProcessed}</span>
              </div>
              <div className="flex justify-between items-center border-b-2 border-black pb-2 text-emerald-600">
                <span className="font-extrabold uppercase tracking-widest text-xs flex items-center"><ShieldCheck className="w-4 h-4 mr-1"/> Allowed</span>
                <span className="font-bold tabular-nums text-lg">{stats.allowed}</span>
              </div>
              <div className="flex justify-between items-center border-b-2 border-black pb-2 text-rose-600">
                <span className="font-extrabold uppercase tracking-widest text-xs flex items-center"><ShieldAlert className="w-4 h-4 mr-1"/> Blocked</span>
                <span className="font-bold tabular-nums text-lg">{stats.blocked}</span>
              </div>
              <div className="flex justify-between items-center pb-2">
                <span className="font-extrabold uppercase tracking-widest text-xs">Avg Review Time</span>
                <span className="font-bold tabular-nums text-lg">3.4s</span>
              </div>
            </div>
          )}
        </div>
      ) : (
        <div className="flex-1 overflow-y-auto p-6 space-y-6 custom-scrollbar bg-white">
          <AnimatePresence mode="popLayout">
            {items.map((item) => (
              <motion.div
                key={item.id}
                layout
                initial={{ opacity: 0, y: -20, scale: 0.98 }}
                animate={{ opacity: 1, y: 0, scale: 1, transition: { type: "spring", stiffness: 400, damping: 30 } }}
                exit={{ opacity: 0, scale: 0.95, transition: { duration: 0.15, ease: "easeOut" } }}
                className="p-5 bg-white border-[3px] border-black shadow-[4px_4px_0_0_#000] flex flex-col space-y-4"
              >
                <div className="flex justify-between items-start">
                  <div className="flex items-center space-x-4">
                    <span className="px-3 py-1 bg-amber-300 text-black border-2 border-black text-xs font-extrabold uppercase tracking-widest shadow-[2px_2px_0_0_#000]">
                      FLAG
                    </span>
                    <span className="px-3 py-1 bg-[#FFD600] text-black border-2 border-black text-xs font-extrabold uppercase tracking-widest shadow-[2px_2px_0_0_#000]">
                      Score: {item.toxicityScore?.toFixed(3) || 'N/A'}
                    </span>
                    <span className="text-[11px] text-black font-bold uppercase tracking-widest border-b-2 border-black">ID: {item.trackingId}</span>
                  </div>
                </div>
                
                {/* Improve typography spacing for payload */}
                <p className="text-lg font-medium text-black leading-relaxed py-2">
                  {item.payload}
                </p>
                
                {/* AI Reasoning Block */}
                <div className="bg-slate-100 border-2 border-black p-3 text-sm">
                  <div className="font-extrabold uppercase tracking-widest text-xs mb-2 border-b-2 border-black pb-1 inline-block">AI Reasoning</div>
                  <ul className="space-y-1">
                    {getReasons(item).map((reason, idx) => (
                      <li key={idx} className="font-bold text-black flex items-center">
                        <span className="w-1.5 h-1.5 bg-black mr-2"></span> {reason}
                      </li>
                    ))}
                  </ul>
                  {item.explainingTokens && item.explainingTokens !== "toxic-bert-inference" && (
                    <div className="mt-2 text-xs text-black font-bold uppercase tracking-widest bg-rose-200 border-2 border-black px-2 py-1 inline-block">
                      Tokens: {item.explainingTokens}
                    </div>
                  )}
                </div>

                <div className="flex space-x-3 pt-2">
                  <button
                    onClick={() => handleAction(item.id, "ALLOW")}
                    className="flex-1 flex justify-center items-center px-4 py-3 bg-white border-[3px] border-black text-black hover:bg-emerald-400 transition-colors shadow-[4px_4px_0_0_#000] hover:shadow-none hover:translate-x-[4px] hover:translate-y-[4px]"
                  >
                    <Check className="w-5 h-5 mr-2 stroke-[3]" />
                    <span className="text-sm font-extrabold uppercase tracking-widest">Approve</span>
                  </button>
                  <button
                    onClick={() => handleAction(item.id, "BLOCK")}
                    className="flex-1 flex justify-center items-center px-4 py-3 bg-white border-[3px] border-black text-black hover:bg-rose-500 transition-colors shadow-[4px_4px_0_0_#000] hover:shadow-none hover:translate-x-[4px] hover:translate-y-[4px]"
                  >
                    <X className="w-5 h-5 mr-2 stroke-[3]" />
                    <span className="text-sm font-extrabold uppercase tracking-widest">Reject</span>
                  </button>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      )}
    </div>
  );
}
