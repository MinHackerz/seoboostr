"use client";

import { TICKER_MESSAGES, getScoreColor } from "./moduleData";

export function LiveTicker() {
  // Double the messages for seamless loop
  const messages = [...TICKER_MESSAGES, ...TICKER_MESSAGES];

  return (
    <section className="relative py-3 bg-slate-900 border-y border-slate-800/60 overflow-hidden">
      {/* Gradient fade edges */}
      <div className="absolute left-0 top-0 bottom-0 w-20 bg-gradient-to-r from-slate-900 to-transparent z-10 pointer-events-none" />
      <div className="absolute right-0 top-0 bottom-0 w-20 bg-gradient-to-l from-slate-900 to-transparent z-10 pointer-events-none" />

      <div className="ticker-track flex items-center gap-8 whitespace-nowrap">
        {messages.map((msg, i) => (
          <div key={i} className="flex items-center gap-3 shrink-0">
            {/* Dot */}
            <div
              className="w-1.5 h-1.5 rounded-full shrink-0"
              style={{ backgroundColor: getScoreColor(msg.score) }}
            />
            {/* Message */}
            <span className="text-xs font-medium text-slate-400">
              <span className="text-slate-300 font-semibold">{msg.domain}</span>
              {" scored "}
              <span
                className="font-mono font-bold tabular-nums"
                style={{ color: getScoreColor(msg.score) }}
              >
                {msg.score}
              </span>
              {" — "}
              <span className="text-slate-500">{msg.detail}</span>
            </span>
          </div>
        ))}
      </div>

      <style jsx>{`
        .ticker-track {
          animation: ticker-scroll 45s linear infinite;
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
