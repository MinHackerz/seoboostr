"use client";

import { useEffect, useState } from "react";
import { TICKER_MESSAGES, getScoreColor } from "./moduleData";

export function LiveTicker() {
  const [messages, setMessages] = useState<any[]>([]);

  useEffect(() => {
    async function loadTickerData() {
      try {
        const res = await fetch("/api/websites/ticker");
        if (res.ok) {
          const data = await res.json();
          if (Array.isArray(data) && data.length > 0) {
            setMessages(data);
            return;
          }
        }
      } catch (err) {
        console.error("Failed to load ticker database data:", err);
      }
      // Fallback to static metrics if database has no scans yet
      setMessages(TICKER_MESSAGES);
    }
    loadTickerData();
  }, []);

  // Double the messages list to guarantee a seamless looping animation
  const displayMessages = messages.length > 0 ? [...messages, ...messages] : [];

  // Helper function to format detail text with keyword syntax highlights
  const formatDetail = (detail: string) => {
    const words = detail.split(" ");
    return words.map((word, idx) => {
      const cleanWord = word.replace(/[^a-zA-Z0-9-]/g, "");
      const isNumber = /^\d+/.test(cleanWord);
      const isLcp = cleanWord.toLowerCase() === "lcp";
      const isEeat = cleanWord.toLowerCase() === "e-e-a-t";
      const isSuccess = ["perfect", "passed", "strong", "zero", "ready", "validated"].includes(cleanWord.toLowerCase());
      const isWarning = ["critical", "missing", "broken", "failed", "violations", "issues", "detected"].includes(cleanWord.toLowerCase());
      
      if (isNumber || isLcp || isEeat) {
        return <span key={idx} className="text-slate-200 font-semibold">{word} </span>;
      }
      if (isSuccess) {
        return <span key={idx} className="text-emerald-400 font-semibold">{word} </span>;
      }
      if (isWarning) {
        return <span key={idx} className="text-red-400 font-semibold">{word} </span>;
      }
      return <span key={idx} className="text-slate-400">{word} </span>;
    });
  };

  return (
    <section className="relative py-4.5 bg-slate-950/40 backdrop-blur-xl border-y border-white/5 overflow-hidden">
      {/* Glow highlight bars */}
      <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-teal-500/30 to-transparent" />
      <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-indigo-500/20 to-transparent" />
      {/* Left side fade cover */}
      <div className="absolute left-0 top-0 bottom-0 w-24 bg-gradient-to-r from-slate-950 to-transparent z-20 pointer-events-none" />

      {/* Right side fade cover */}
      <div className="absolute right-0 top-0 bottom-0 w-24 bg-gradient-to-l from-slate-950 to-transparent z-20 pointer-events-none" />

      {/* Ticker scrolling track */}
      <div className="ticker-track flex items-center gap-6 whitespace-nowrap pl-4">
        {displayMessages.map((msg, i) => {
          const scoreColor = getScoreColor(msg.score);
          return (
            <div 
              key={i} 
              className="flex items-center gap-3 px-4 py-2.5 rounded-2xl bg-white/3 border border-white/5 hover:border-teal-500/30 hover:bg-white/8 hover:shadow-[0_0_20px_rgba(20,184,166,0.08)] hover:-translate-y-0.5 transition-all duration-300 group/chip cursor-pointer shrink-0"
            >
              {/* Domain Name */}
              <span className="text-xs font-bold text-slate-100 group-hover/chip:text-teal-400 transition-colors font-sans">
                {msg.domain}
              </span>

              {/* Divider */}
              <span className="h-3 w-px bg-white/10" />

              {/* Score Chip Badge */}
              <span 
                className="text-[10px] font-mono font-black px-2 py-0.5 rounded-md border flex items-center justify-center min-w-10 tabular-nums shadow-sm transition-all"
                style={{
                  color: scoreColor,
                  backgroundColor: `${scoreColor}12`,
                  borderColor: `${scoreColor}25`,
                }}
              >
                {msg.score}
              </span>

              {/* Divider */}
              <span className="h-3 w-px bg-white/10" />

              {/* Detail Audit Message */}
              <span className="text-xs font-medium tracking-wide font-sans flex items-center">
                {formatDetail(msg.detail)}
              </span>
            </div>
          );
        })}
      </div>

      <style jsx>{`
        .ticker-track {
          animation: ticker-scroll 55s linear infinite;
        }
        .ticker-track:hover {
          animation-play-state: paused;
        }
        @keyframes ticker-scroll {
          0% { transform: translateX(0); }
          100% { transform: translateX(-50%); }
        }
      `}</style>
    </section>
  );
}
