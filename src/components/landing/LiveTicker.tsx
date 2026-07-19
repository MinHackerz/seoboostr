"use client";

import { useEffect, useState } from "react";
import { TICKER_MESSAGES, getScoreColor } from "./moduleData";
import { Globe02Icon } from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";

function TickerFavicon({ domain }: { domain: string }) {
  const [error, setError] = useState(false);
  const faviconUrl = domain
    ? `https://www.google.com/s2/favicons?domain=${domain}&sz=64`
    : null;

  if (error || !faviconUrl) {
    return (
      <div className="w-5 h-5 rounded-lg flex items-center justify-center bg-gradient-to-tr from-teal-500/10 to-indigo-500/10 border border-teal-500/25 text-teal-400 shrink-0 shadow-sm shadow-teal-500/5 animate-pulse-soft">
        <HugeiconsIcon icon={Globe02Icon} size={11} />
      </div>
    );
  }

  return (
    <img
      src={faviconUrl}
      alt=""
      onLoad={(e) => {
        if (e.currentTarget.naturalWidth <= 16) {
          setError(true);
        }
      }}
      onError={() => setError(true)}
      className="w-5 h-5 object-contain rounded-md select-none pointer-events-none shrink-0"
      width={20}
      height={20}
      loading="lazy"
      decoding="async"
    />
  );
}

export function LiveTicker() {
  const [messages, setMessages] = useState<any[]>([]);

  useEffect(() => {
    async function loadTickerData() {
      let mergedData = [...TICKER_MESSAGES];
      try {
        const res = await fetch("/api/websites/ticker");
        if (res.ok) {
          const data = await res.json();
          if (Array.isArray(data) && data.length > 0) {
            // Prepend database scan results, then append static fallbacks
            mergedData = [...data, ...TICKER_MESSAGES];
          }
        }
      } catch (err) {
        console.error("Failed to load ticker database data:", err);
      }

      // Deduplicate by domain
      const uniqueMap = new Map<string, any>();
      mergedData.forEach((item: any) => {
        if (!uniqueMap.has(item.domain.toLowerCase())) {
          uniqueMap.set(item.domain.toLowerCase(), item);
        }
      });
      const uniqueList = Array.from(uniqueMap.values());

      // Repeat sequence 1, 2, 3... 1, 2, 3... to ensure ticker is long enough
      let repeatedList = [...uniqueList];
      while (repeatedList.length > 0 && repeatedList.length < 24) {
        repeatedList = [...repeatedList, ...uniqueList];
      }
      setMessages(repeatedList);
    }
    loadTickerData();
  }, []);

  // Double the messages list to guarantee a seamless looping animation
  const displayMessages = messages.length > 0 ? [...messages, ...messages] : [];

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
              className="flex items-center gap-2.5 px-3.5 py-2 rounded-2xl bg-white/3 border border-white/5 hover:border-teal-500/30 hover:bg-white/8 hover:shadow-[0_0_20px_rgba(20,184,166,0.08)] hover:-translate-y-0.5 transition-all duration-300 group/chip cursor-pointer shrink-0"
            >
              {/* Favicon */}
              <TickerFavicon domain={msg.domain} />

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
