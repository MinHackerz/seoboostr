"use client";

import { motion } from "framer-motion";

const steps = [
  {
    step: "01",
    title: "Paste your URL",
    description: "Any page. Any site. Public URLs only — no access tokens or complex DNS setup needed.",
    visual: (
      <div className="glass-card rounded-xl p-4 border border-white/15 bg-white/5 shadow-lg">
        <div className="flex items-center gap-2.5 p-3 rounded-lg bg-slate-900/90 border border-white/10 shadow-inner">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" className="text-teal-400 shrink-0" strokeLinecap="round">
            <circle cx="12" cy="12" r="10" />
            <line x1="2" y1="12" x2="22" y2="12" />
            <path d="M12 2a15.3 15.3 0 014 10 15.3 15.3 0 01-4 10 15.3 15.3 0 01-4-10 15.3 15.3 0 014-10z" />
          </svg>
          <span className="text-xs font-mono text-teal-300 font-bold tabular-nums">mysite.com</span>
          <div className="ml-auto w-2 h-5 bg-teal-400 rounded-sm animate-pulse shadow-[0_0_8px_#2dd4bf]" />
        </div>
      </div>
    ),
  },
  {
    step: "02",
    title: "15 modules scan in parallel",
    description: "Not one after another — all at once. Technical SEO, content, schema, images, performance — done simultaneously.",
    visual: (
      <div className="glass-card rounded-xl p-4 space-y-2.5 border border-white/15 bg-white/5 shadow-lg">
        {["Technical", "Schema", "Content", "Images", "CWV"].map((name, i) => (
          <div key={name} className="flex items-center gap-2.5">
            <span className="text-[11px] font-mono font-bold text-slate-300 w-16 tabular-nums">{name}</span>
            <div className="flex-1 h-2 bg-white/10 rounded-full overflow-hidden shadow-inner">
              <motion.div
                className="h-full rounded-full shadow-[0_0_8px_#2dd4bf]"
                style={{
                  background: `linear-gradient(90deg, rgba(20,184,166,1), rgba(6,182,212,0.8))`,
                }}
                initial={{ width: "0%" }}
                whileInView={{ width: `${75 + i * 5}%` }}
                viewport={{ once: true }}
                transition={{ duration: 1.5, delay: 0.2 + i * 0.15, ease: "easeOut" }}
              />
            </div>
            <motion.span
              className="text-[11px] font-mono font-bold text-teal-400 w-6 text-right tabular-nums drop-shadow-[0_0_4px_#2dd4bf]"
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              transition={{ delay: 1.3 + i * 0.15 }}
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
    description: "Issues sorted by exact impact. Fix the ones that move the ranking needle first — not the noise.",
    visual: (
      <div className="glass-card rounded-xl p-4 space-y-2.5 border border-white/15 bg-white/5 shadow-lg">
        {[
          { label: "Missing H1 tag", severity: "Critical", color: "text-red-400 bg-red-500/15 border-red-500/30 shadow-[0_0_8px_rgba(239,68,68,0.2)]" },
          { label: "No schema markup", severity: "High", color: "text-amber-400 bg-amber-500/15 border-amber-500/30 shadow-[0_0_8px_rgba(245,158,11,0.2)]" },
          { label: "Images lack alt text", severity: "Medium", color: "text-yellow-400 bg-yellow-500/15 border-yellow-500/30" },
        ].map((issue) => (
          <div key={issue.label} className="flex items-center justify-between gap-2 px-3 py-2.5 rounded-lg bg-slate-900/80 border border-white/10 shadow-sm">
            <span className="text-xs font-semibold text-slate-200">{issue.label}</span>
            <span className={`text-[9px] font-extrabold uppercase tracking-wider px-2 py-0.5 rounded-md border ${issue.color}`}>
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
    <section className="relative py-20 sm:py-28 overflow-hidden">
      {/* ── Dynamic Luminous Aurora Background ── */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <motion.div
          animate={{
            x: [0, 60, -50, 0],
            y: [0, -40, 50, 0],
            scale: [1, 1.15, 0.9, 1],
          }}
          transition={{ duration: 16, repeat: Infinity, ease: "easeInOut" }}
          className="absolute top-1/3 left-[15%] w-[500px] h-[500px] rounded-full bg-gradient-to-tr from-indigo-500/35 via-purple-500/20 to-transparent blur-[110px]"
        />
        <motion.div
          animate={{
            x: [0, -60, 40, 0],
            y: [0, 50, -30, 0],
            scale: [1, 1.2, 0.85, 1],
          }}
          transition={{ duration: 19, repeat: Infinity, ease: "easeInOut" }}
          className="absolute bottom-1/3 right-[15%] w-[500px] h-[500px] rounded-full bg-gradient-to-bl from-teal-500/35 via-cyan-500/20 to-transparent blur-[110px]"
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

      {/* Top & bottom separator lines */}
      <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-teal-500/40 to-transparent pointer-events-none" />
      <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-indigo-500/40 to-transparent pointer-events-none" />

      <div className="relative max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.5 }}
          className="text-center mb-14 sm:mb-18"
        >
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-gradient-to-r from-teal-500/25 to-indigo-500/25 border border-teal-500/30 text-teal-400 text-xs font-bold uppercase tracking-wider mb-5 shadow-lg shadow-teal-500/10">
            Rapid Execution Workflow
          </div>
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-black text-white tracking-tight mb-4">
            Three steps. <span className="gradient-text">Zero setup.</span>
          </h2>
          <p className="text-sm sm:text-base text-slate-300 max-w-md mx-auto leading-relaxed">
            No Chrome extensions to install. No JavaScript snippets. No &quot;book a demo&quot; forms. Just instant, actionable analysis.
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
              className="relative group rounded-2xl p-6 border border-white/15 bg-white/5 hover:bg-white/10 hover:border-teal-400/40 transition-all duration-300 backdrop-blur-xl shadow-xl flex flex-col justify-between"
            >
              <div>
                {/* Step number — large glowing */}
                <div className="flex items-center justify-between mb-5">
                  <span className="text-4xl font-black font-mono text-teal-400 drop-shadow-[0_0_10px_rgba(20,184,166,0.6)] tabular-nums">
                    {s.step}
                  </span>
                  <div className="h-px flex-1 bg-gradient-to-r from-teal-500/50 to-transparent ml-4" />
                </div>

                {/* Visual */}
                <div className="mb-6">{s.visual}</div>

                {/* Text */}
                <h3 className="text-lg font-bold text-white mb-2 group-hover:text-teal-300 transition-colors">{s.title}</h3>
                <p className="text-xs text-slate-300 leading-relaxed font-medium">{s.description}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
