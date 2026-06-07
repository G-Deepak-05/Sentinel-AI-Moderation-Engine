"use client";

import Link from "next/link";
import { Terminal, Shield, Zap, Database, Activity } from "lucide-react";
import { motion } from "framer-motion";

export default function LandingPage() {
  return (
    <main className="flex min-h-screen flex-col items-center p-8 lg:p-24 bg-[#FFD600] text-black font-sans antialiased overflow-hidden">
      
      <div className="w-full max-w-6xl flex flex-col h-full min-h-[calc(100vh-12rem)]">
        
        {/* Hero Section */}
        <div className="mb-16 border-b-[6px] border-black pb-12 flex flex-col lg:flex-row justify-between items-start lg:items-end gap-8">
          <motion.div 
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, ease: "easeOut" }}
            className="flex flex-col"
          >
            <div className="flex items-center space-x-4 mb-4">
              <Shield className="w-16 h-16 stroke-[3]" />
              <h1 className="text-6xl font-black tracking-tighter uppercase leading-none">
                Sentinel-AI
              </h1>
            </div>
            <p className="text-2xl font-bold uppercase tracking-wide max-w-2xl leading-relaxed">
              Real-time, AI-powered moderation engine built for massive scale.
            </p>
          </motion.div>

          <motion.div 
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, ease: "easeOut", delay: 0.2 }}
            className="flex flex-col sm:flex-row gap-4"
          >
            <Link href="/simulator">
              <button className="w-full sm:w-auto px-8 py-4 bg-black border-[4px] border-black text-white hover:bg-[#FFD600] hover:text-black transition-colors font-black uppercase tracking-widest text-lg shadow-[6px_6px_0_0_#000] hover:shadow-none hover:translate-x-[6px] hover:translate-y-[6px]">
                Try Simulator
              </button>
            </Link>
          </motion.div>
        </div>

        {/* Architecture Section */}
        <motion.div 
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: "easeOut", delay: 0.4 }}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-16"
        >
          {/* Card 1 */}
          <div className="bg-white border-[4px] border-black p-6 shadow-[8px_8px_0_0_#000] flex flex-col h-full hover:translate-y-[-4px] hover:shadow-[12px_12px_0_0_#000] transition-all">
            <Terminal className="w-10 h-10 mb-4 stroke-[3]" />
            <h3 className="text-xl font-black uppercase tracking-widest mb-2">1. Ingestion</h3>
            <p className="font-bold text-sm leading-relaxed border-t-2 border-black pt-2">
              Securely receives massive parallel incoming chat requests from users worldwide.
            </p>
          </div>

          {/* Card 2 */}
          <div className="bg-white border-[4px] border-black p-6 shadow-[8px_8px_0_0_#000] flex flex-col h-full hover:translate-y-[-4px] hover:shadow-[12px_12px_0_0_#000] transition-all">
            <Zap className="w-10 h-10 mb-4 stroke-[3]" />
            <h3 className="text-xl font-black uppercase tracking-widest mb-2">2. Streaming</h3>
            <p className="font-bold text-sm leading-relaxed border-t-2 border-black pt-2">
              Acts as a high-throughput event buffer, ensuring zero message loss during traffic spikes.
            </p>
          </div>

          {/* Card 3 */}
          <div className="bg-white border-[4px] border-black p-6 shadow-[8px_8px_0_0_#000] flex flex-col h-full hover:translate-y-[-4px] hover:shadow-[12px_12px_0_0_#000] transition-all">
            <Database className="w-10 h-10 mb-4 stroke-[3]" />
            <h3 className="text-xl font-black uppercase tracking-widest mb-2">3. Inference</h3>
            <p className="font-bold text-sm leading-relaxed border-t-2 border-black pt-2">
              AI workers instantly analyze messages, running toxicity models to detect harmful content.
            </p>
          </div>

          {/* Card 4 */}
          <div className="bg-white border-[4px] border-black p-6 shadow-[8px_8px_0_0_#000] flex flex-col h-full hover:translate-y-[-4px] hover:shadow-[12px_12px_0_0_#000] transition-all">
            <Activity className="w-10 h-10 mb-4 stroke-[3]" />
            <h3 className="text-xl font-black uppercase tracking-widest mb-2">4. Command</h3>
            <p className="font-bold text-sm leading-relaxed border-t-2 border-black pt-2">
              Dashboard streams live AI verdicts directly to the Trust & Safety team for final human review.
            </p>
          </div>
        </motion.div>

        {/* Status / Footer */}
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.8 }}
          className="mt-auto border-t-[4px] border-black pt-8 flex justify-between items-center"
        >
          <div className="flex items-center space-x-3">
            <span className="relative flex h-4 w-4">
              <span className="animate-ping absolute inline-flex h-full w-full bg-black opacity-75"></span>
              <span className="relative inline-flex h-4 w-4 bg-black"></span>
            </span>
            <span className="font-black uppercase tracking-widest text-lg">System Online</span>
          </div>
        </motion.div>

      </div>
    </main>
  );
}
