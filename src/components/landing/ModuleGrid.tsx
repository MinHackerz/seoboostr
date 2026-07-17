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
    <section id="modules" className="relative py-20 sm:py-28 overflow-hidden">
      {/* ── Dynamic Luminous Aurora Mesh Background ── */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <motion.div
          animate={{
            x: [0, -70, 50, 0],
            y: [0, 60, -40, 0],
            scale: [1, 1.2, 0.9, 1],
          }}
          transition={{ duration: 18, repeat: Infinity, ease: "easeInOut" }}
          className="absolute top-1/4 left-[5%] w-[550px] h-[550px] rounded-full bg-gradient-to-br from-teal-500/35 via-emerald-500/20 to-transparent blur-[110px]"
        />
        <motion.div
          animate={{
            x: [0, 80, -60, 0],
            y: [0, -50, 70, 0],
            scale: [1, 1.15, 0.85, 1],
          }}
          transition={{ duration: 22, repeat: Infinity, ease: "easeInOut" }}
          className="absolute bottom-1/4 right-[5%] w-[600px] h-[600px] rounded-full bg-gradient-to-tl from-indigo-500/35 via-purple-500/25 to-transparent blur-[120px]"
        />
      </div>

      {/* ── Cyber Matrix Dot Grid Overlay ── */}
      <div
        className="absolute inset-0 opacity-25 pointer-events-none"
        style={{
          backgroundImage: "radial-gradient(rgba(255, 255, 255, 0.08) 1px, transparent 1px)",
          backgroundSize: "24px 24px",
          maskImage: "radial-gradient(ellipse 90% 70% at 50% 50%, black 40%, transparent 100%)",
          WebkitMaskImage: "radial-gradient(ellipse 90% 70% at 50% 50%, black 40%, transparent 100%)",
        }}
      />

      {/* ── Top & Bottom Glow Dividers ── */}
      <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-teal-500/40 to-transparent pointer-events-none" />
      <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-indigo-500/40 to-transparent pointer-events-none" />

      <div className="relative max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.5 }}
          className="text-center mb-12 sm:mb-16"
        >
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-gradient-to-r from-teal-500/25 to-indigo-500/25 border border-teal-500/30 text-teal-400 text-xs font-bold uppercase tracking-wider mb-5 shadow-lg shadow-teal-500/10">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
              <path d="M4 6h16M4 12h16M4 18h16" />
            </svg>
            15 Parallel Check Modules
          </div>
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-black text-white tracking-tight mb-4">
            One URL. <span className="gradient-text">Fifteen audits.</span> One report.
          </h2>
          <p className="text-sm sm:text-base text-slate-300 max-w-xl mx-auto leading-relaxed">
            Every module runs in parallel across our cloud architecture. No waiting around for sequential crawls. Results delivered in seconds.
          </p>
        </motion.div>

        {/* Module cards grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-5">
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
                transition={{ duration: 0.4, delay: i * 0.05 }}
                className="group relative rounded-2xl p-5 border border-white/15 bg-white/5 hover:bg-white/10 hover:border-teal-500/40 transition-all duration-300 backdrop-blur-xl shadow-xl flex flex-col justify-between overflow-hidden"
              >
                {/* Subtle top edge shine on hover */}
                <div className="absolute top-0 left-0 right-0 h-0.5 bg-gradient-to-r from-transparent via-teal-400 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

                <div>
                  <div className="flex items-start justify-between mb-3.5">
                    {/* Icon + Name */}
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-teal-500/25 to-teal-500/5 border border-teal-500/25 flex items-center justify-center text-teal-400 group-hover:from-teal-500/35 group-hover:to-teal-500/15 group-hover:scale-105 transition-all duration-300 shadow-md shadow-teal-500/10">
                        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                          <path d={mod.iconPath} />
                        </svg>
                      </div>
                      <h3 className="text-sm font-bold text-white group-hover:text-teal-300 transition-colors">{mod.name}</h3>
                    </div>

                    {/* Dynamic indicator: Real Score or Ready Badge */}
                    {score !== null && color ? (
                      <div className="relative shrink-0" style={{ width: 42, height: 42, color }}>
                        <svg width="42" height="42" viewBox="0 0 42 42" className="transform -rotate-90">
                          <circle cx="21" cy="21" r={radius} fill="none" stroke="rgba(255,255,255,0.08)" strokeWidth="3.5" />
                          <circle
                            cx="21"
                            cy="21"
                            r={radius}
                            fill="none"
                            stroke={color}
                            strokeWidth="3.5"
                            strokeLinecap="round"
                            strokeDasharray={circumference}
                            strokeDashoffset={offset}
                            style={{ filter: `drop-shadow(0 0 6px ${color})` }}
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
                      <div className="shrink-0 px-2.5 py-1 rounded-lg bg-teal-500/10 border border-teal-500/20 text-teal-400 text-[10px] font-bold uppercase tracking-wider select-none shadow-sm">
                        Ready
                      </div>
                    )}
                  </div>

                  <p className="text-xs text-slate-300 leading-relaxed font-medium">
                    {mod.description}
                  </p>
                </div>

                {/* Real-time findings snippet */}
                {match && (
                  <div className="mt-4 pt-3 border-t border-white/10 text-[11px] text-slate-400 font-medium flex items-start gap-1.5">
                    <span className="text-teal-400 font-bold shrink-0">Finding:</span>
                    <span className="truncate">{match.finding}</span>
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
