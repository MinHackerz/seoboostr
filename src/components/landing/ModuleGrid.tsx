"use client";

import { motion } from "framer-motion";
import { MODULES, getScoreColor, type ScanResult } from "./moduleData";

interface ModuleGridProps {
  scanResults: ScanResult[] | null;
  phase: "idle" | "scanning" | "complete";
}

export function ModuleGrid({ scanResults, phase }: ModuleGridProps) {
  const isScanned = phase === "complete" && !!scanResults;

  return (
    <section id="modules" className="relative py-20 sm:py-28 bg-slate-50 overflow-hidden">
      {/* Subtle dot-grid background */}
      <div
        className="absolute inset-0 opacity-50 pointer-events-none"
        style={{
          backgroundImage: "radial-gradient(circle at 1px 1px, var(--dot-grid-color) 1px, transparent 0)",
          backgroundSize: "24px 24px",
        }}
      />

      <div className="relative max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.5 }}
          className="text-center mb-12 sm:mb-16"
        >
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-teal-50 border border-teal-200/60 text-teal-700 text-xs font-bold uppercase tracking-wider mb-4">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
              <path d="M4 6h16M4 12h16M4 18h16" />
            </svg>
            10 Modules
          </div>
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-black text-slate-900 tracking-tight mb-3">
            One URL. Ten audits. One report.
          </h2>
          <p className="text-sm sm:text-base text-slate-500 max-w-lg mx-auto">
            Every module runs in parallel. No waiting around for sequential crawls.
            Results in seconds, not minutes.
          </p>
        </motion.div>

        {/* Module cards grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4">
          {MODULES.map((mod, i) => {
            const match = isScanned ? scanResults.find((r) => r.moduleId === mod.id) : null;
            const score = match ? match.score : null;
            const color = score !== null ? getScoreColor(score) : null;
            const radius = 16;
            const circumference = 2 * Math.PI * radius;
            const offset = score !== null ? circumference - (score / 100) * circumference : 0;

            return (
              <motion.div
                key={mod.id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-50px" }}
                transition={{ duration: 0.4, delay: i * 0.06 }}
                className="group relative rounded-xl border border-slate-200/80 bg-white hover:bg-white hover:border-slate-350 p-5 transition-all duration-200"
              >
                <div className="flex items-start justify-between mb-3">
                  {/* Icon + Name */}
                  <div className="flex items-center gap-3">
                    <div className="w-9 h-9 rounded-lg bg-teal-50 flex items-center justify-center text-teal-600 group-hover:bg-teal-100/70 transition-colors">
                      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <path d={mod.iconPath} />
                      </svg>
                    </div>
                    <h3 className="text-sm font-bold text-slate-900">{mod.name}</h3>
                  </div>

                  {/* Dynamic indicator: Real Score or Ready Badge */}
                  {score !== null && color ? (
                    <div className="relative shrink-0" style={{ width: 40, height: 40 }}>
                      <svg width="40" height="40" viewBox="0 0 40 40" className="transform -rotate-90">
                        <circle cx="20" cy="20" r={radius} fill="none" stroke="rgba(15,23,42,0.06)" strokeWidth="3" />
                        <circle
                          cx="20"
                          cy="20"
                          r={radius}
                          fill="none"
                          stroke={color}
                          strokeWidth="3"
                          strokeLinecap="round"
                          strokeDasharray={circumference}
                          strokeDashoffset={offset}
                        />
                      </svg>
                      <span
                        className="absolute inset-0 flex items-center justify-center font-mono text-[11px] font-bold tabular-nums"
                        style={{ color }}
                      >
                        {score}
                      </span>
                    </div>
                  ) : (
                    <div className="shrink-0 px-2.5 py-1 rounded bg-teal-50 border border-teal-200/60 text-teal-700 text-[10px] font-bold uppercase tracking-wider select-none">
                      Ready
                    </div>
                  )}
                </div>

                <p className="text-xs text-slate-500 leading-relaxed">
                  {mod.description}
                </p>
                
                {/* Real-time findings snippet displayed directly on the grid card when scanned */}
                {match && (
                  <div className="mt-3 pt-3 border-t border-slate-100 text-[10px] text-slate-500 font-medium">
                    <span className="text-slate-400">Scan Finding:</span> {match.finding}
                  </div>
                )}
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
