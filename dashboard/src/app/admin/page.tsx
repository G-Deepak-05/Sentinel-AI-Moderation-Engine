"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import { ReviewQueue } from "@/components/ReviewQueue";
import { ActivityFeed } from "@/components/ActivityFeed";
import { TrendWidgets } from "@/components/TrendWidgets";

export default function AdminDashboard() {
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Brief loading sequence for dramatic effect and to allow initial data fetch
    const timer = setTimeout(() => {
      setLoading(false);
    }, 400);
    return () => clearTimeout(timer);
  }, []);

  return (
    <>
      <AnimatePresence>
        {loading && (
          <motion.div
            key="loader"
            initial={false} // Prevents initial animation on mount, fixing hydration flicker
            exit={{ y: "-100vh", opacity: 0, transition: { duration: 0.8, ease: [0.76, 0, 0.24, 1] } }}
            className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-[#FFD600]"
          >
            <div className="flex flex-col items-center">
              <div className="w-24 h-24 bg-white border-[4px] border-black shadow-[8px_8px_0_0_#000] flex items-center justify-center mb-6">
                <span className="text-6xl font-black text-black font-sans">S</span>
              </div>
              <div className="text-xl font-extrabold tracking-widest uppercase text-black animate-pulse">
                Initializing
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <main className="flex min-h-screen flex-col items-center p-12 bg-[#FFD600] text-black font-sans antialiased overflow-hidden">
        <div className="w-full flex flex-col items-center">
          {/* Brutalist Header */}
          <div className="w-full max-w-7xl mb-8 pb-4 border-b-[3px] border-black flex justify-between items-end">
            <h1 className="text-4xl font-extrabold tracking-tighter text-black uppercase flex items-center">
              Sentinel-AI Command Center
            </h1>
            <div className="flex items-center space-x-6">
              <Link href="/">
                <button className="flex items-center text-sm font-extrabold uppercase tracking-widest px-4 py-2 bg-black text-white border-2 border-black hover:bg-white hover:text-black transition-colors shadow-[4px_4px_0_0_#000] hover:shadow-none hover:translate-x-[4px] hover:translate-y-[4px]">
                  Return Home
                </button>
              </Link>
              <div className="text-xs font-bold text-black uppercase tracking-widest border-2 border-black px-4 py-2 bg-white shadow-[2px_2px_0_0_#000]">
                Status: Operational
              </div>
            </div>
          </div>

          <TrendWidgets />

          <div className="w-full max-w-7xl">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
              {/* Left Column: Human Review Queue */}
              <div className="flex flex-col space-y-4">
                <h2 className="text-2xl font-extrabold uppercase tracking-tight text-black">
                  Human Review Queue
                </h2>
                <ReviewQueue />
              </div>

              {/* Right Column: Live Activity Feed */}
              <div className="flex flex-col space-y-4">
                <h2 className="text-2xl font-extrabold uppercase tracking-tight text-black">
                  Live Event Stream
                </h2>
                <ActivityFeed />
              </div>
            </div>
          </div>
        </div>
      </main>
    </>
  );
}
