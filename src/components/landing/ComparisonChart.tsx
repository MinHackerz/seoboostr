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
  { module: "Schema", before: 58, after: 94 },
  { module: "Images", before: 51, after: 87 },
  { module: "Performance", before: 63, after: 89 },
];

function CustomTooltip({ active, payload, label }: { active?: boolean; payload?: Array<{ value: number; dataKey: string }>; label?: string }) {
  if (!active || !payload) return null;
  return (
    <div className="bg-slate-900 border border-slate-800 rounded-lg px-3 py-2">
      <p className="text-xs font-semibold text-white mb-1">{label}</p>
      {payload.map((p) => (
        <p key={p.dataKey} className="text-[11px] font-mono tabular-nums text-slate-300">
          <span className={p.dataKey === "after" ? "text-teal-400" : "text-slate-500"}>
            {p.dataKey === "after" ? "After: " : "Before: "}
          </span>
          {p.value}
        </p>
      ))}
    </div>
  );
}

export function ComparisonChart() {
  return (
    <section className="relative py-20 sm:py-28 bg-slate-50 overflow-hidden">
      {/* Dot-grid background */}
      <div
        className="absolute inset-0 opacity-40 pointer-events-none"
        style={{
          backgroundImage: "radial-gradient(circle at 1px 1px, rgba(15,23,42,0.06) 1px, transparent 0)",
          backgroundSize: "24px 24px",
        }}
      />

      <div className="relative max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.5 }}
          className="text-center mb-10 sm:mb-14"
        >
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-teal-50 border border-teal-200/60 text-teal-700 text-xs font-bold uppercase tracking-wider mb-4">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
              <path d="M13 7l5 5-5 5M6 7l5 5-5 5" />
            </svg>
            Real Impact
          </div>
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-black text-slate-900 tracking-tight mb-3">
            Fix what matters. Watch scores climb.
          </h2>
          <p className="text-sm sm:text-base text-slate-500 max-w-lg mx-auto">
            Sites that fix SEOBoostr-flagged issues see a{" "}
            <span className="text-teal-600 font-bold font-mono tabular-nums">34%</span>{" "}
            average score improvement across modules.
          </p>
        </motion.div>

        {/* Chart */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-50px" }}
          transition={{ duration: 0.5, delay: 0.15 }}
          className="rounded-2xl border border-slate-200 bg-white p-4 sm:p-8"
        >
          {/* Legend */}
          <div className="flex items-center justify-end gap-4 mb-6">
            <div className="flex items-center gap-1.5">
              <div className="w-2.5 h-2.5 rounded-sm bg-slate-400" />
              <span className="text-[11px] text-slate-500 font-medium">Before</span>
            </div>
            <div className="flex items-center gap-1.5">
              <div className="w-2.5 h-2.5 rounded-sm bg-teal-600" />
              <span className="text-[11px] text-slate-500 font-medium">After fixes</span>
            </div>
          </div>

          <div className="h-64 sm:h-80">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                data={data}
                barGap={4}
                barCategoryGap="20%"
                margin={{ top: 0, right: 0, left: -20, bottom: 0 }}
              >
                <CartesianGrid
                  strokeDasharray="3 3"
                  stroke="rgba(15,23,42,0.06)"
                  vertical={false}
                />
                <XAxis
                  dataKey="module"
                  axisLine={false}
                  tickLine={false}
                  tick={{ fontSize: 11, fill: "#64748b", fontFamily: "monospace" }}
                />
                <YAxis
                  domain={[0, 100]}
                  axisLine={false}
                  tickLine={false}
                  tick={{ fontSize: 11, fill: "#94a3b8", fontFamily: "monospace" }}
                />
                <Tooltip content={<CustomTooltip />} cursor={{ fill: "rgba(15,23,42,0.02)" }} />
                <Bar dataKey="before" radius={[4, 4, 0, 0]} maxBarSize={32}>
                  {data.map((_, i) => (
                    <Cell key={i} fill="#94a3b8" />
                  ))}
                </Bar>
                <Bar dataKey="after" radius={[4, 4, 0, 0]} maxBarSize={32}>
                  {data.map((_, i) => (
                    <Cell key={i} fill="#0f766e" />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>

          {/* Bottom stat callouts */}
          <div className="grid grid-cols-3 gap-3 mt-6 pt-6 border-t border-slate-100">
            {[
              { label: "Avg Before", value: "62", unit: "/100" },
              { label: "Avg After", value: "91", unit: "/100" },
              { label: "Improvement", value: "+34", unit: "%" },
            ].map((stat) => (
              <div key={stat.label} className="text-center">
                <p className="font-mono text-lg sm:text-xl font-black tabular-nums text-slate-900">
                  {stat.value}
                  <span className="text-xs text-slate-400">{stat.unit}</span>
                </p>
                <p className="text-[10px] text-slate-400 font-medium uppercase tracking-wider mt-0.5">
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
