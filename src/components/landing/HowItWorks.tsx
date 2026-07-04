"use client";

import { motion } from "framer-motion";

const steps = [
  {
    step: "01",
    title: "Paste your URL",
    description: "Any page. Any site. Public URLs only — no access tokens needed.",
    visual: (
      <div className="rounded-lg border border-slate-200 bg-white p-3 shadow-sm">
        <div className="flex items-center gap-2 p-2 rounded-md bg-slate-50 border border-slate-200/60">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="text-slate-400 shrink-0" strokeLinecap="round">
            <circle cx="12" cy="12" r="10" />
            <line x1="2" y1="12" x2="22" y2="12" />
            <path d="M12 2a15.3 15.3 0 014 10 15.3 15.3 0 01-4 10 15.3 15.3 0 01-4-10 15.3 15.3 0 014-10z" />
          </svg>
          <span className="text-xs font-mono text-teal-600 tabular-nums">mysite.com</span>
          <div className="ml-auto w-1.5 h-4 bg-teal-500 rounded-sm animate-pulse" />
        </div>
      </div>
    ),
  },
  {
    step: "02",
    title: "10 modules scan in parallel",
    description: "Not one after another — all at once. Technical SEO, content, schema, images, performance — done simultaneously.",
    visual: (
      <div className="rounded-lg border border-slate-200 bg-white p-3 shadow-sm space-y-1.5">
        {["Technical", "Schema", "Content", "Images", "CWV"].map((name, i) => (
          <div key={name} className="flex items-center gap-2">
            <span className="text-[10px] font-mono text-slate-400 w-16 tabular-nums">{name}</span>
            <div className="flex-1 h-1.5 bg-slate-100 rounded-full overflow-hidden">
              <motion.div
                className="h-full bg-teal-500 rounded-full"
                initial={{ width: "0%" }}
                whileInView={{ width: `${70 + i * 6}%` }}
                viewport={{ once: true }}
                transition={{ duration: 1.5, delay: 0.3 + i * 0.15, ease: "easeOut" }}
              />
            </div>
            <motion.span
              className="text-[10px] font-mono font-bold text-teal-600 w-6 text-right tabular-nums"
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              transition={{ delay: 1.5 + i * 0.15 }}
            >
              ✓
            </motion.span>
          </div>
        ))}
      </div>
    ),
  },
  {
    step: "03",
    title: "Get a prioritized fix list",
    description: "Issues sorted by impact. Fix the ones that move the needle first — not the noise.",
    visual: (
      <div className="rounded-lg border border-slate-200 bg-white p-3 shadow-sm space-y-2">
        {[
          { label: "Missing H1 tag", severity: "Critical", color: "text-red-600 bg-red-50" },
          { label: "No schema markup", severity: "High", color: "text-amber-600 bg-amber-50" },
          { label: "Images lack alt text", severity: "Medium", color: "text-yellow-600 bg-yellow-50" },
        ].map((issue) => (
          <div key={issue.label} className="flex items-center justify-between gap-2 px-2 py-1.5 rounded-md bg-slate-50">
            <span className="text-[10px] font-medium text-slate-700">{issue.label}</span>
            <span className={`text-[9px] font-bold uppercase tracking-wider px-1.5 py-0.5 rounded ${issue.color}`}>
              {issue.severity}
            </span>
          </div>
        ))}
      </div>
    ),
  },
];

export function HowItWorks() {
  return (
    <section className="relative py-20 sm:py-28 bg-white overflow-hidden">
      <div className="relative max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.5 }}
          className="text-center mb-12 sm:mb-16"
        >
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-black text-slate-900 tracking-tight mb-3">
            Three steps. Zero setup.
          </h2>
          <p className="text-sm sm:text-base text-slate-500 max-w-md mx-auto">
            No Chrome extensions to install. No JavaScript snippets.
            No &quot;book a demo&quot; forms.
          </p>
        </motion.div>

        {/* Steps */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 sm:gap-8">
          {steps.map((s, i) => (
            <motion.div
              key={s.step}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-50px" }}
              transition={{ duration: 0.4, delay: i * 0.12 }}
              className="relative"
            >
              {/* Connector line (desktop only) */}
              {i < steps.length - 1 && (
                <div className="hidden md:block absolute top-10 -right-4 sm:-right-5 w-8 sm:w-10 border-t border-dashed border-slate-300/60" />
              )}

              {/* Step number */}
              <div className="flex items-center gap-3 mb-4">
                <span className="text-xs font-mono font-bold text-teal-600/60 tabular-nums">
                  {s.step}
                </span>
                <div className="h-px flex-1 bg-slate-200/80" />
              </div>

              {/* Visual */}
              <div className="mb-4">{s.visual}</div>

              {/* Text */}
              <h3 className="text-base font-bold text-slate-900 mb-1.5">{s.title}</h3>
              <p className="text-xs text-slate-500 leading-relaxed">{s.description}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
