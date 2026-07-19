"use client";

import { useState } from "react";

interface FaqItem {
  q: string;
  a: string;
}

interface CrawlerFaqClientProps {
  faqs: FaqItem[];
}

export function CrawlerFaqClient({ faqs }: CrawlerFaqClientProps) {
  const [openFaqIndex, setOpenFaqIndex] = useState<number | null>(null);

  return (
    <div className="space-y-4 mt-16 font-sans">
      <h2 className="text-xl font-bold text-white mb-6 text-center">Frequently Asked Questions</h2>
      {faqs.map((item, i) => {
        const isOpen = openFaqIndex === i;
        return (
          <div key={i} className="border border-white/10 rounded-2xl bg-slate-900/30 hover:bg-slate-900/60 hover:border-rose-500/20 transition-all duration-300 overflow-hidden">
            <button
              onClick={() => setOpenFaqIndex(isOpen ? null : i)}
              className="w-full text-left px-6 py-4 flex items-center justify-between text-xs sm:text-sm font-bold text-white hover:text-rose-400 transition-colors cursor-pointer"
            >
              <h3>{item.q}</h3>
              <svg
                className={`w-4 h-4 text-slate-400 transform transition-transform duration-300 ${isOpen ? "rotate-180 text-rose-400" : ""}`}
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth="2"
              >
                <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
              </svg>
            </button>
            {isOpen && (
              <div className="px-6 pb-4 pt-1 text-slate-350 text-[11px] sm:text-xs leading-relaxed border-t border-white/5 bg-slate-950/20">
                <p>{item.a}</p>
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}
