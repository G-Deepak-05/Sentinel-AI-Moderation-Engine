"use client";

import { useState, useRef, useEffect } from "react";
import { Send, ArrowLeft, Terminal } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";

type ChatMessage = {
  id: string;
  text: string;
  status: "sending" | "sent" | "error";
  timestamp: Date;
};

export default function SimulatorPage() {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [input, setInput] = useState("");
  const [isSending, setIsSending] = useState(false);
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleSend = async (e?: React.FormEvent) => {
    e?.preventDefault();
    if (!input.trim() || isSending) return;

    const newMsg: ChatMessage = {
      id: crypto.randomUUID(),
      text: input,
      status: "sending",
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, newMsg]);
    setInput("");
    setIsSending(true);

    try {
      const res = await fetch("/api/simulate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ payload: newMsg.text }),
      });

      if (!res.ok) throw new Error("Failed to send");

      setMessages((prev) =>
        prev.map((m) => (m.id === newMsg.id ? { ...m, status: "sent" } : m))
      );
    } catch (error) {
      console.error(error);
      setMessages((prev) =>
        prev.map((m) => (m.id === newMsg.id ? { ...m, status: "error" } : m))
      );
    } finally {
      setIsSending(false);
    }
  };

  return (
    <main className="flex min-h-screen flex-col items-center p-8 bg-[#FFD600] text-black font-sans antialiased">
      <div className="w-full max-w-4xl flex flex-col h-[calc(100vh-4rem)]">
        
        {/* Header */}
        <div className="mb-6 flex justify-between items-end border-b-[4px] border-black pb-4">
          <div className="flex items-center space-x-4">
            <Terminal className="w-10 h-10 stroke-[3]" />
            <h1 className="text-4xl font-extrabold tracking-tighter uppercase">Live Simulator</h1>
          </div>
          <Link href="/">
            <button className="flex items-center text-sm font-extrabold uppercase tracking-widest px-4 py-2 bg-white border-2 border-black hover:bg-black hover:text-white transition-colors shadow-[4px_4px_0_0_#000] hover:shadow-none hover:translate-x-[4px] hover:translate-y-[4px]">
              <ArrowLeft className="w-4 h-4 mr-2 stroke-[3]" />
              Return Home
            </button>
          </Link>
        </div>

        {/* Chat Feed */}
        <div className="flex-1 bg-white border-[4px] border-black shadow-[8px_8px_0_0_#000] flex flex-col overflow-hidden relative">
          
          <div className="absolute top-0 left-0 w-full bg-slate-100 border-b-2 border-black px-4 py-2 flex items-center justify-between z-10">
            <span className="text-xs font-black uppercase tracking-widest text-slate-500">System Status</span>
            <div className="flex items-center space-x-2">
              <span className="relative flex h-3 w-3">
                <span className="animate-ping absolute inline-flex h-full w-full bg-emerald-400 opacity-75"></span>
                <span className="relative inline-flex h-3 w-3 bg-emerald-500 border border-black"></span>
              </span>
              <span className="text-[10px] uppercase font-bold tracking-widest">Online</span>
            </div>
          </div>

          <div className="flex-1 overflow-y-auto p-6 pt-16 space-y-4 custom-scrollbar">
            {messages.length === 0 ? (
              <div className="h-full flex flex-col items-center justify-center text-slate-400">
                <Terminal className="w-16 h-16 mb-4 stroke-1" />
                <p className="font-bold uppercase tracking-widest text-sm">Send a message to test the AI...</p>
              </div>
            ) : (
              <AnimatePresence>
                {messages.map((msg) => (
                  <motion.div
                    key={msg.id}
                    initial={{ opacity: 0, y: 20, scale: 0.95 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    className="flex justify-end"
                  >
                    <div className="max-w-[70%] flex flex-col items-end">
                      <div className={`p-4 border-[3px] border-black shadow-[4px_4px_0_0_#000] text-lg font-medium leading-relaxed ${msg.status === 'error' ? 'bg-rose-400' : 'bg-[#FFD600]'}`}>
                        {msg.text}
                      </div>
                      <div className="flex items-center space-x-2 mt-2">
                        {msg.status === 'sending' && <span className="text-[10px] uppercase font-bold text-slate-500">Sending...</span>}
                        {msg.status === 'sent' && <span className="text-[10px] uppercase font-bold text-emerald-600 tracking-widest">Delivered to Gateway</span>}
                        {msg.status === 'error' && <span className="text-[10px] uppercase font-bold text-rose-600">Failed</span>}
                      </div>
                    </div>
                  </motion.div>
                ))}
              </AnimatePresence>
            )}
            <div ref={bottomRef} />
          </div>
          
          {/* Input Area */}
          <div className="p-4 bg-slate-100 border-t-[3px] border-black">
            <form onSubmit={handleSend} className="flex space-x-4">
              <input
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="Type a message (e.g. 'You are a total idiot')..."
                className="flex-1 p-4 bg-white border-[3px] border-black text-black font-medium text-lg placeholder-slate-400 focus:outline-none focus:ring-0 shadow-[4px_4px_0_0_#000]"
                disabled={isSending}
              />
              <button
                type="submit"
                disabled={!input.trim() || isSending}
                className="px-8 py-4 bg-black border-[3px] border-black text-white hover:bg-[#FFD600] hover:text-black transition-colors font-black uppercase tracking-widest text-lg disabled:opacity-50 disabled:hover:bg-black disabled:hover:text-white shadow-[4px_4px_0_0_#000] hover:shadow-none hover:translate-x-[4px] hover:translate-y-[4px] disabled:translate-x-0 disabled:translate-y-0 disabled:shadow-[4px_4px_0_0_#000] flex items-center justify-center"
              >
                <Send className="w-5 h-5 mr-2 stroke-[3]" />
                Send
              </button>
            </form>
          </div>
        </div>
      </div>
    </main>
  );
}
