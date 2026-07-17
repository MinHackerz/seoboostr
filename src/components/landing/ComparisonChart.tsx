"use client";

import { useRef } from "react";
import { motion, useMotionTemplate, useMotionValue } from "framer-motion";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Cell,
} from "recharts";

const data = [
  { module: "Technical", before: 72, after: 99 },
  { module: "On-Page", before: 65, after: 97 },
  { module: "Content", before: 58, after: 94 },
  { module: "Schema", before: 40, after: 99 },
  { module: "Images", before: 51, after: 95 },
  { module: "Sitemap", before: 60, after: 98 },
  { module: "AI/GEO", before: 45, after: 92 },
  { module: "SXO/UX", before: 68, after: 96 },
  { module: "Performance", before: 55, after: 93 },
  { module: "PageSpeed", before: 50, after: 92 },
  { module: "Security", before: 35, after: 93 },
  { module: "Links", before: 61, after: 95 },
  { module: "A11y", before: 58, after: 91 },
  { module: "Intl SEO", before: 70, after: 97 },
  { module: "Mobile", before: 62, after: 94 },
];

function CustomTooltip({ active, payload, label }: { active?: boolean; payload?: Array<{ value: number; dataKey: string }>; label?: string }) {
  if (!active || !payload) return null;
  return (
    <div className="rounded-xl px-4 py-3 border border-white/10 bg-slate-950/95 shadow-[0_10px_30px_rgba(0,0,0,0.5)] z-50 select-none">
      <p className="text-xs font-bold text-white mb-2 border-b border-white/5 pb-1.5 font-sans tracking-wide">{label}</p>
      {payload.map((p) => (
        <p key={p.dataKey} className="text-xs font-mono tabular-nums text-slate-300 flex items-center gap-2 mt-1">
          <span className="w-1.5 h-1.5 rounded-full shrink-0" style={{ backgroundColor: p.dataKey === "after" ? "#14b8a6" : "#64748b" }} />
          <span className={p.dataKey === "after" ? "text-teal-300 font-bold" : "text-slate-400 font-medium"}>
            {p.dataKey === "after" ? "After fixes: " : "Before scan: "}
          </span>
          <span className="text-white font-bold">{p.value}</span>
        </p>
      ))}
    </div>
  );
}

function AnimatedCounter({ value, suffix = "", prefix = "" }: { value: number; suffix?: string; prefix?: string }) {
  return (
    <motion.span
      className="font-mono text-2xl sm:text-3xl font-black tabular-nums text-white drop-shadow-[0_0_10px_rgba(255,255,255,0.15)]"
      initial={{ opacity: 0 }}
      whileInView={{ opacity: 1 }}
      viewport={{ once: true }}
    >
      {prefix}{value}
      <span className="text-xs text-teal-400 font-bold ml-0.5">{suffix}</span>
    </motion.span>
  );
}

// ── Individual Stat Widget Component ──
function StatWidget({ label, value, suffix, prefix, index }: { label: string; value: number; suffix: string; prefix: string; index: number }) {
  const widgetRef = useRef<HTMLDivElement>(null);
  const mX = useMotionValue(0);
  const mY = useMotionValue(0);

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!widgetRef.current) return;
    const rect = widgetRef.current.getBoundingClientRect();
    mX.set(e.clientX - rect.left);
    mY.set(e.clientY - rect.top);
  };

  return (
    <motion.div
      ref={widgetRef}
      onMouseMove={handleMouseMove}
      className="group/widget text-center p-4 rounded-2xl bg-slate-950/40 border border-white/5 shadow-inner hover:border-teal-500/20 hover:bg-slate-900/20 hover:shadow-[0_0_25px_rgba(20,184,166,0.05)] transition-all duration-300 relative overflow-hidden"
    >
      {/* Radial Hover Spotlight */}
      <motion.div
        className="absolute inset-0 opacity-0 group-hover/widget:opacity-100 transition-opacity duration-300 pointer-events-none z-0"
        style={{
          background: useMotionTemplate`
            radial-gradient(
              100px circle at ${mX}px ${mY}px,
              rgba(20, 184, 166, 0.1),
              transparent 85%
            )
          `,
        }}
      />
      <div className="relative z-10">
        <AnimatedCounter value={value} suffix={suffix} prefix={prefix} />
        <p className="text-[10px] text-slate-400 font-extrabold uppercase tracking-wider mt-1.5">
          {label}
        </p>
      </div>
    </motion.div>
  );
}

export function ComparisonChart() {
  const cardRef = useRef<HTMLDivElement>(null);
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!cardRef.current) return;
    const rect = cardRef.current.getBoundingClientRect();
    mouseX.set(e.clientX - rect.left);
    mouseY.set(e.clientY - rect.top);
  };

  return (
    <section className="relative py-20 sm:py-28 overflow-hidden">
      {/* ── Dynamic Luminous Aurora Background ── */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <motion.div
          animate={{
            x: [0, -50, 60, 0],
            y: [0, 50, -40, 0],
            scale: [1, 1.2, 0.85, 1],
          }}
          transition={{ duration: 17, repeat: Infinity, ease: "easeInOut" }}
          className="absolute top-1/4 right-[10%] w-[550px] h-[550px] rounded-full bg-gradient-to-tr from-teal-500/35 via-cyan-500/20 to-transparent blur-[120px]"
        />
        <motion.div
          animate={{
            x: [0, 70, -50, 0],
            y: [0, -60, 40, 0],
            scale: [1, 1.15, 0.9, 1],
          }}
          transition={{ duration: 21, repeat: Infinity, ease: "easeInOut" }}
          className="absolute bottom-1/4 left-[10%] w-[550px] h-[550px] rounded-full bg-gradient-to-bl from-purple-500/35 via-indigo-500/25 to-transparent blur-[120px]"
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

      {/* Top & bottom glow divider lines */}
      <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-teal-500/40 to-transparent pointer-events-none" />
      <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-indigo-500/40 to-transparent pointer-events-none" />

      <div className="relative max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.5 }}
          className="text-center mb-12 sm:mb-16"
        >
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-gradient-to-r from-teal-500/25 to-indigo-500/25 border border-teal-500/30 text-teal-400 text-xs font-bold uppercase tracking-wider mb-5 shadow-lg shadow-teal-500/10">
            Real Ranking Impact
          </div>
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-black text-white tracking-tight mb-4 leading-tight">
            Fix what matters. <span className="gradient-text">Watch scores climb.</span>
          </h2>
          <p className="text-sm sm:text-base text-slate-300 max-w-lg mx-auto leading-relaxed">
            Sites that address SEOBoostr-flagged issues see an{" "}
            <span className="text-teal-400 font-extrabold font-mono px-2 py-0.5 bg-teal-500/10 border border-teal-500/25 rounded-md shadow-[0_0_10px_rgba(20,184,166,0.15)] select-none">38%</span>{" "}
            average score improvement across all 15 audit modules.
          </p>
        </motion.div>

        {/* Chart Card */}
        <motion.div
          ref={cardRef}
          onMouseMove={handleMouseMove}
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-50px" }}
          transition={{ duration: 0.5, delay: 0.15 }}
          className="group relative rounded-2xl p-5 sm:p-8 border border-white/10 bg-slate-950/40 backdrop-blur-2xl shadow-2xl shadow-teal-500/5 hover:border-teal-500/30 transition-all duration-300 overflow-hidden"
        >
          {/* Radial Spotlight Hover Glow */}
          <motion.div
            className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none z-0"
            style={{
              background: useMotionTemplate`
                radial-gradient(
                  240px circle at ${mouseX}px ${mouseY}px,
                  rgba(20, 184, 166, 0.15),
                  transparent 80%
                )
              `,
            }}
          />

          {/* Border light bar */}
          <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-teal-500/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

          {/* Legend */}
          <div className="flex items-center justify-end gap-5 mb-6 border-b border-white/5 pb-4 relative z-10 select-none">
            <div className="flex items-center gap-2">
              <div className="w-2.5 h-2.5 rounded bg-slate-600/80 shadow-sm border border-slate-500/20" />
              <span className="text-xs text-slate-400 font-semibold">Before Audit</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-2.5 h-2.5 rounded bg-teal-400 shadow-[0_0_6px_#2dd4bf] border border-teal-300/30" />
              <span className="text-xs text-teal-300 font-bold">After Automated Fixes</span>
            </div>
          </div>

          {/* Chart Display */}
          <div className="overflow-x-auto pb-4 scrollbar-thin scrollbar-thumb-white/10 scrollbar-track-transparent relative z-10">
            <div className="h-64 sm:h-80 min-w-[850px] lg:min-w-0">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart
                  data={data}
                  barGap={4}
                  barCategoryGap="25%"
                  margin={{ top: 10, right: 10, left: -20, bottom: 0 }}
                >
                  <defs>
                    {/* Dark Slate before-scan bar gradient */}
                    <linearGradient id="beforeGradient" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor="#64748b" stopOpacity={0.8} />
                      <stop offset="100%" stopColor="#334155" stopOpacity={0.8} />
                    </linearGradient>
                    {/* Glowing Teal after-scan bar gradient */}
                    <linearGradient id="afterGradient" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor="#14b8a6" stopOpacity={0.9} />
                      <stop offset="100%" stopColor="#0ea5e9" stopOpacity={0.9} />
                    </linearGradient>
                  </defs>
                  
                  <CartesianGrid
                    strokeDasharray="3 3"
                    stroke="rgba(255,255,255,0.06)"
                    vertical={false}
                  />
                  <XAxis
                    dataKey="module"
                    axisLine={false}
                    tickLine={false}
                    tick={{ fontSize: 9, fill: "#94a3b8", fontFamily: "monospace", fontWeight: 600 }}
                  />
                  <YAxis
                    domain={[0, 100]}
                    axisLine={false}
                    tickLine={false}
                    tick={{ fontSize: 10, fill: "#64748b", fontFamily: "monospace" }}
                  />
                  <Tooltip content={<CustomTooltip />} cursor={{ fill: "rgba(255,255,255,0.03)" }} />
                  
                  {/* Before bar with gradient */}
                  <Bar dataKey="before" radius={[4, 4, 0, 0]} maxBarSize={14}>
                    {data.map((_, i) => (
                      <Cell key={i} fill="url(#beforeGradient)" stroke="rgba(100, 116, 139, 0.2)" strokeWidth={1} />
                    ))}
                  </Bar>
                  {/* After bar with gradient and glow */}
                  <Bar dataKey="after" radius={[4, 4, 0, 0]} maxBarSize={14}>
                    {data.map((_, i) => (
                      <Cell key={i} fill="url(#afterGradient)" stroke="rgba(20, 184, 166, 0.3)" strokeWidth={1} style={{ filter: "drop-shadow(0 0 2px rgba(20, 184, 166, 0.4))" }} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Bottom stat callouts */}
          <div className="grid grid-cols-3 gap-4 mt-6 pt-6 border-t border-white/5 relative z-10">
            {[
              { label: "Avg Before", value: 57, suffix: "/100", prefix: "" },
              { label: "Avg After", value: 95, suffix: "/100", prefix: "" },
              { label: "Net Improvement", value: 38, suffix: "%", prefix: "+" },
            ].map((stat, i) => (
              <StatWidget 
                key={stat.label} 
                label={stat.label} 
                value={stat.value} 
                suffix={stat.suffix} 
                prefix={stat.prefix} 
                index={i} 
              />
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  );
}
