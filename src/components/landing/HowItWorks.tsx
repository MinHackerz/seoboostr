"use client";

import { useEffect, useRef, useState } from "react";
import { motion, useMotionTemplate, useMotionValue } from "framer-motion";

// ── Step 1: Animated Typing Simulation ──
function TypingUrlVisual() {
  const [text, setText] = useState("");
  
  useEffect(() => {
    const fullText = "https://pdfsigncheck.com";
    let index = 0;
    let isDeleting = false;
    let timer: NodeJS.Timeout;

    const tick = () => {
      if (!isDeleting) {
        setText(fullText.substring(0, index + 1));
        index++;
        if (index === fullText.length) {
          isDeleting = true;
          timer = setTimeout(tick, 3000); // Pause at full URL
        } else {
          timer = setTimeout(tick, 80 + Math.random() * 60);
        }
      } else {
        setText(fullText.substring(0, index - 1));
        index--;
        if (index === 0) {
          isDeleting = false;
          timer = setTimeout(tick, 800); // Pause at empty
        } else {
          timer = setTimeout(tick, 45);
        }
      }
    };

    timer = setTimeout(tick, 200);
    
    return () => clearTimeout(timer);
  }, []);

  return (
    <div className="glass-card rounded-xl p-4 border border-white/10 bg-white/3 shadow-lg select-none">
      <div className="flex items-center gap-2.5 p-3 rounded-lg bg-slate-950 border border-white/5 shadow-inner">
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" className="text-teal-400 shrink-0">
          <circle cx="12" cy="12" r="10" />
          <line x1="2" y1="12" x2="22" y2="12" />
          <path d="M12 2a15.3 15.3 0 014 10 15.3 15.3 0 01-4 10 15.3 15.3 0 01-4-10 15.3 15.3 0 014-10z" />
        </svg>
        <span className="text-[9.5px] font-mono text-teal-300 font-bold tracking-tight flex items-center gap-0.5 min-w-0 truncate">
          {text || " "}
          <span className="w-1.5 h-3.5 bg-teal-400 animate-pulse inline-block shrink-0" />
        </span>
        <span className="text-[9px] text-teal-400 font-bold px-1.5 py-0.2 bg-teal-500/10 rounded border border-teal-500/20 ml-auto select-none">
          Secure
        </span>
      </div>
    </div>
  );
}

// ── Step 2: Animated Parallel Progress Bars ──
function ParallelAuditVisual() {
  const modules = ["Technical", "Schema", "Content", "Images", "CWV"];
  
  return (
    <div className="glass-card rounded-xl p-4 space-y-3 border border-white/10 bg-white/3 shadow-lg select-none">
      {modules.map((name, i) => (
        <div key={name} className="flex items-center gap-2.5">
          <span className="text-[10px] font-sans font-bold text-slate-300 w-16 tracking-wide">{name}</span>
          <div className="flex-1 h-2 bg-slate-950 rounded-full overflow-hidden shadow-inner border border-white/5 relative">
            <motion.div
              className="h-full rounded-full shadow-[0_0_8px_#2dd4bf]"
              style={{
                background: `linear-gradient(90deg, #14b8a6, #06b6d4)`,
              }}
              initial={{ width: "0%" }}
              whileInView={{ width: `${80 + i * 4}%` }}
              viewport={{ once: true }}
              transition={{ duration: 1.2, delay: 0.1 * i, ease: "easeOut" }}
            />
          </div>
          <motion.div
            className="w-4 h-4 rounded-full flex items-center justify-center bg-emerald-500/10 border border-emerald-500/20 shrink-0"
            initial={{ scale: 0, opacity: 0 }}
            whileInView={{ scale: 1, opacity: 1 }}
            viewport={{ once: true }}
            transition={{ delay: 1.0 + i * 0.1 }}
          >
            <svg width="8" height="8" viewBox="0 0 24 24" fill="none" stroke="#10b981" strokeWidth="4">
              <polyline points="20 6 9 17 4 12" />
            </svg>
          </motion.div>
        </div>
      ))}
    </div>
  );
}

// ── Step 3: Prioritized Fixes severity tags ──
function PrioritizedFixesVisual() {
  const issues = [
    { label: "Missing H1 header tag", severity: "Critical", score: "text-red-400 bg-red-500/10 border-red-500/20 shadow-[0_0_10px_rgba(239,68,68,0.1)]" },
    { label: "No Schema JSON-LD markup", severity: "High", score: "text-amber-400 bg-amber-500/10 border-amber-500/20 shadow-[0_0_10px_rgba(245,158,11,0.1)]" },
    { label: "3 large images lack alt attributes", severity: "Medium", score: "text-yellow-400 bg-yellow-500/10 border-yellow-500/20" }
  ];

  return (
    <div className="glass-card rounded-xl p-4 space-y-3 border border-white/10 bg-white/3 shadow-lg select-none">
      {issues.map((issue) => (
        <motion.div
          key={issue.label}
          whileHover={{ scale: 1.02, x: 2 }}
          className="flex items-center justify-between gap-2.5 px-3 py-2.5 rounded-xl bg-slate-950 border border-white/5 shadow-inner hover:border-teal-500/20 transition-all duration-300"
        >
          <span className="text-[11px] font-sans font-bold text-slate-200">{issue.label}</span>
          <span className={`text-[8px] font-black uppercase tracking-widest px-2.5 py-0.5 rounded-full border ${issue.score}`}>
            {issue.severity}
          </span>
        </motion.div>
      ))}
    </div>
  );
}

// ── Custom Interactive Card Container ──
function StepCard({
  step,
  title,
  description,
  visual,
  index,
}: {
  step: string;
  title: string;
  description: string;
  visual: React.ReactNode;
  index: number;
}) {
  const cardRef = useRef<HTMLDivElement>(null);
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!cardRef.current) return;
    const rect = cardRef.current.getBoundingClientRect();
    
    // Set coordinates relative to card top-left corner
    mouseX.set(e.clientX - rect.left);
    mouseY.set(e.clientY - rect.top);
  };

  return (
    <motion.div
      ref={cardRef}
      onMouseMove={handleMouseMove}
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-50px" }}
      transition={{ duration: 0.4, delay: index * 0.12 }}
      className="group relative rounded-2xl p-6 sm:p-7 border border-white/10 bg-slate-950/40 hover:bg-slate-900/40 hover:border-teal-500/35 transition-colors duration-300 backdrop-blur-xl shadow-xl flex flex-col justify-between overflow-hidden cursor-default"
    >
      {/* ── Spotlight Hover Gradient Glow ── */}
      <motion.div
        className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none z-0"
        style={{
          background: useMotionTemplate`
            radial-gradient(
              160px circle at ${mouseX}px ${mouseY}px,
              rgba(20, 184, 166, 0.12),
              transparent 80%
            )
          `,
        }}
      />

      {/* Subtle top edge border neon highlight on hover */}
      <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-teal-500/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

      <div className="relative z-10">
        {/* Step indicator header */}
        <div className="flex items-center justify-between mb-6">
          <span className="text-4xl font-black font-mono text-slate-800 group-hover:text-teal-500/75 transition-colors duration-300 drop-shadow-[0_0_10px_rgba(20,184,166,0.15)] select-none tracking-tighter">
            {step}
          </span>
          <div className="h-px flex-1 bg-gradient-to-r from-teal-500/20 to-transparent ml-4" />
        </div>

        {/* Dynamic Visual Content */}
        <div className="mb-6">{visual}</div>

        {/* Text Details */}
        <h3 className="text-lg font-extrabold text-white mb-2 group-hover:text-teal-300 transition-colors duration-200 tracking-wide font-sans">
          {title}
        </h3>
        <p className="text-xs text-slate-400 leading-relaxed font-medium group-hover:text-slate-300 transition-colors duration-200">
          {description}
        </p>
      </div>
    </motion.div>
  );
}

export function HowItWorks() {
  const steps = [
    {
      step: "01",
      title: "Paste your URL",
      description: "Any page. Any site. Public URLs only — no access tokens or complex DNS setup needed.",
      visual: <TypingUrlVisual />,
    },
    {
      step: "02",
      title: "18 modules scan in parallel",
      description: "Not one after another — all at once. Indexability, backlinks, drift, technical, schema, content, performance — done simultaneously.",
      visual: <ParallelAuditVisual />,
    },
    {
      step: "03",
      title: "Get a prioritized fix list",
      description: "Issues sorted by exact impact. Fix the ones that move the ranking needle first — not the noise.",
      visual: <PrioritizedFixesVisual />,
    },
  ];

  return (
    <section className="relative py-20 sm:py-28 overflow-hidden">
      {/* ── Dynamic Luminous Aurora Mesh Background ── */}
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
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-black text-white tracking-tight mb-4 leading-tight">
            Three steps. <span className="gradient-text">Zero setup.</span>
          </h2>
          <p className="text-sm sm:text-base text-slate-300 max-w-md mx-auto leading-relaxed">
            No Chrome extensions to install. No JavaScript snippets. No &quot;book a demo&quot; forms. Just instant, actionable analysis.
          </p>
        </motion.div>

        {/* Steps Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 sm:gap-8">
          {steps.map((s, i) => (
            <StepCard
              key={s.step}
              step={s.step}
              title={s.title}
              description={s.description}
              visual={s.visual}
              index={i}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
