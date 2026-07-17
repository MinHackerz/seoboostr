"use client";

import { motion } from "framer-motion";
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
  { module: "Technical", before: 72, after: 96 },
  { module: "On-Page", before: 65, after: 91 },
  { module: "Content", before: 58, after: 84 },
  { module: "Schema", before: 40, after: 97 },
  { module: "Images", before: 51, after: 88 },
  { module: "Sitemap", before: 60, after: 93 },
  { module: "AI/GEO", before: 45, after: 78 },
  { module: "SXO/UX", before: 68, after: 90 },
  { module: "Performance", before: 55, after: 82 },
  { module: "PageSpeed", before: 50, after: 85 },
  { module: "Security", before: 35, after: 76 },
  { module: "Links", before: 61, after: 87 },
  { module: "A11y", before: 58, after: 79 },
  { module: "Intl SEO", before: 70, after: 92 },
  { module: "Mobile", before: 62, after: 83 },
];

function CustomTooltip({ active, payload, label }: { active?: boolean; payload?: Array<{ value: number; dataKey: string }>; label?: string }) {
  if (!active || !payload) return null;
  return (
    <div className="rounded-lg px-3.5 py-2.5 border border-white/15 bg-slate-950 shadow-2xl z-50">
      <p className="text-xs font-bold text-white mb-1.5 border-b border-white/10 pb-1">{label}</p>
      {payload.map((p) => (
        <p key={p.dataKey} className="text-xs font-mono tabular-nums text-slate-200">
          <span className={p.dataKey === "after" ? "text-teal-400 font-bold" : "text-slate-400 font-medium"}>
            {p.dataKey === "after" ? "After fixes: " : "Before scan: "}
          </span>
          {p.value}
        </p>
      ))}
    </div>
  );
}

function AnimatedCounter({ value, suffix = "", prefix = "" }: { value: number; suffix?: string; prefix?: string }) {
  return (
    <motion.span
      className="font-mono text-xl sm:text-2xl font-black tabular-nums text-white drop-shadow-[0_0_8px_rgba(255,255,255,0.3)]"
      initial={{ opacity: 0 }}
      whileInView={{ opacity: 1 }}
      viewport={{ once: true }}
    >
      {prefix}{value}
      <span className="text-xs text-teal-400 font-bold">{suffix}</span>
    </motion.span>
  );
}

export function ComparisonChart() {
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
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-black text-white tracking-tight mb-4">
            Fix what matters. <span className="gradient-text">Watch scores climb.</span>
          </h2>
          <p className="text-sm sm:text-base text-slate-300 max-w-lg mx-auto leading-relaxed">
            Sites that address SEOBoostr-flagged issues see a{" "}
            <span className="text-teal-400 font-bold font-mono tabular-nums px-1.5 py-0.5 bg-teal-500/10 border border-teal-500/20 rounded">34%</span>{" "}
            average score improvement across all 15 audit modules.
          </p>
        </motion.div>

        {/* Chart */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-50px" }}
          transition={{ duration: 0.5, delay: 0.15 }}
          className="glass-card rounded-2xl p-5 sm:p-8 border border-white/15 bg-slate-900/80 backdrop-blur-2xl shadow-2xl shadow-teal-500/10"
        >
          {/* Legend */}
          <div className="flex items-center justify-end gap-5 mb-6 border-b border-white/10 pb-4">
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded bg-slate-600 shadow-sm" />
              <span className="text-xs text-slate-400 font-semibold">Before Audit</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded bg-teal-400 shadow-[0_0_8px_#2dd4bf]" />
              <span className="text-xs text-teal-300 font-bold">After Automated Fixes</span>
            </div>
          </div>

          <div className="overflow-x-auto pb-4 scrollbar-thin scrollbar-thumb-white/10 scrollbar-track-transparent">
            <div className="h-64 sm:h-80 min-w-[850px] lg:min-w-0">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart
                  data={data}
                  barGap={4}
                  barCategoryGap="25%"
                  margin={{ top: 10, right: 10, left: -20, bottom: 0 }}
                >
                  <CartesianGrid
                    strokeDasharray="3 3"
                    stroke="rgba(255,255,255,0.08)"
                    vertical={false}
                  />
                  <XAxis
                    dataKey="module"
                    axisLine={false}
                    tickLine={false}
                    tick={{ fontSize: 10, fill: "#94a3b8", fontFamily: "monospace", fontWeight: 600 }}
                  />
                  <YAxis
                    domain={[0, 100]}
                    axisLine={false}
                    tickLine={false}
                    tick={{ fontSize: 11, fill: "#64748b", fontFamily: "monospace" }}
                  />
                  <Tooltip content={<CustomTooltip />} cursor={{ fill: "rgba(255,255,255,0.04)" }} />
                  <Bar dataKey="before" radius={[4, 4, 0, 0]} maxBarSize={14}>
                    {data.map((_, i) => (
                      <Cell key={i} fill="#475569" />
                    ))}
                  </Bar>
                  <Bar dataKey="after" radius={[4, 4, 0, 0]} maxBarSize={14}>
                    {data.map((_, i) => (
                      <Cell key={i} fill="#2dd4bf" />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Bottom stat callouts */}
          <div className="grid grid-cols-3 gap-4 mt-6 pt-6 border-t border-white/10">
            {[
              { label: "Avg Before", value: 57, suffix: "/100", prefix: "" },
              { label: "Avg After", value: 85, suffix: "/100", prefix: "" },
              { label: "Net Improvement", value: 28, suffix: "%", prefix: "+" },
            ].map((stat) => (
              <div key={stat.label} className="text-center p-3 rounded-xl bg-white/5 border border-white/5 shadow-inner">
                <AnimatedCounter value={stat.value} suffix={stat.suffix} prefix={stat.prefix} />
                <p className="text-[11px] text-slate-400 font-bold uppercase tracking-wider mt-1">
                  {stat.label}
                </p>
              </div>
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  );
}
