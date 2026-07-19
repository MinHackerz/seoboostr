"use client";

import { useRef } from "react";
import { motion, useMotionTemplate, useMotionValue } from "framer-motion";

const FEATURES = [
  {
    title: "White Label PDF Reports",
    description: "Generate beautiful, branded PDF audits in 20 seconds. Upload your logo, choose custom color schemes, add your details, and deliver client-ready recommendations.",
    icon: (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="text-teal-400">
        <path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z" />
        <polyline points="14 2 14 8 20 8" />
        <line x1="16" y1="13" x2="8" y2="13" />
        <line x1="16" y1="17" x2="8" y2="17" />
        <polyline points="10 9 9 9 8 9" />
      </svg>
    ),
    badge: "Agency",
    glow: "rgba(20, 184, 166, 0.12)",
    borderHover: "hover:border-teal-500/30",
    textHover: "group-hover:text-teal-300",
  },
  {
    title: "Embeddable Audit Widget",
    description: "Convert site visitors into qualified leads. Embed a simple, styled audit form on your website. Get email alerts and push lead data directly to your CRM.",
    icon: (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="text-indigo-400">
        <polyline points="16 18 22 12 16 6" />
        <polyline points="8 6 2 12 8 18" />
      </svg>
    ),
    badge: "Growth",
    glow: "rgba(99, 102, 241, 0.12)",
    borderHover: "hover:border-indigo-500/30",
    textHover: "group-hover:text-indigo-300",
  },
  {
    title: "Competitor Drift Monitoring",
    description: "Audit competitor websites, compare scores side-by-side, and track keyword shifts. Get notified immediately if a change affects your search rankings.",
    icon: (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="text-emerald-400">
        <line x1="18" y1="20" x2="18" y2="10" />
        <line x1="12" y1="20" x2="12" y2="4" />
        <line x1="6" y1="20" x2="6" y2="14" />
      </svg>
    ),
    badge: "SXO",
    glow: "rgba(16, 185, 129, 0.12)",
    borderHover: "hover:border-emerald-500/30",
    textHover: "group-hover:text-emerald-300",
  },
];

function FeatureCard({ title, description, icon, badge, glow, borderHover, textHover }: typeof FEATURES[0]) {
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
    <div
      ref={cardRef}
      onMouseMove={handleMouseMove}
      className={`group relative overflow-hidden rounded-3xl border border-white/10 bg-slate-900/40 p-7 sm:p-8 ${borderHover} hover:bg-slate-900/20 transition-all duration-500 backdrop-blur-xl shadow-xl flex flex-col justify-between min-h-[280px]`}
    >
      {/* Radial Hover Spotlight */}
      <motion.div
        className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none z-0"
        style={{
          background: useMotionTemplate`
            radial-gradient(
              180px circle at ${mouseX}px ${mouseY}px,
              ${glow},
              transparent 80%
            )
          `,
        }}
      />

      <div className="relative z-10">
        <div className="flex items-center justify-between mb-6">
          <div className="p-3 bg-white/5 rounded-xl border border-white/10 group-hover:border-teal-500/25 group-hover:bg-teal-500/5 transition-all">
            {icon}
          </div>
          <span className="text-[10px] font-black tracking-widest uppercase px-2.5 py-0.5 rounded-full bg-white/5 border border-white/10 text-slate-400">
            {badge}
          </span>
        </div>
        <h3 className={`text-lg font-bold text-white mb-2 ${textHover} transition-colors`}>
          {title}
        </h3>
        <p className="text-slate-350 text-xs sm:text-sm leading-relaxed font-semibold">
          {description}
        </p>
      </div>
    </div>
  );
}

export function FeaturesSection() {
  return (
    <section id="modules" className="relative py-20 sm:py-28 overflow-hidden bg-gradient-to-b from-slate-950 via-[#0b1329] to-slate-950">
      {/* Premium Glow Meshes & Radial Spotlights */}
      <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-indigo-500/30 to-transparent pointer-events-none" />
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[1000px] h-[500px] bg-[radial-gradient(ellipse_at_top,rgba(99,102,241,0.12),transparent_65%)] pointer-events-none" />
      <div className="absolute top-1/4 -left-40 w-[600px] h-[600px] bg-[radial-gradient(circle_400px_at_center,rgba(20,184,166,0.1),transparent)] pointer-events-none" />
      <div className="absolute bottom-10 -right-40 w-[600px] h-[600px] bg-[radial-gradient(circle_400px_at_center,rgba(139,92,246,0.08),transparent)] pointer-events-none" />

      <div className="relative max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-16 sm:mb-20">
          <span className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-gradient-to-r from-teal-500/25 to-indigo-500/25 border border-teal-500/30 text-teal-400 text-[10px] font-bold uppercase tracking-wider mb-5 shadow-lg shadow-teal-500/10">
            Advanced Suite Features
          </span>
          <h2 className="text-3xl sm:text-4xl font-black text-white tracking-tight mb-3">
            Rank higher with our <span className="gradient-text">Agency Suite</span>
          </h2>
          <p className="text-slate-350 max-w-xl mx-auto text-xs sm:text-sm font-medium leading-relaxed">
            Everything you need to audit sites, win SEO clients, and generate automated leads—built on high-performance parallel processing.
          </p>
        </div>

        {/* Features Grid */}
        <div className="grid md:grid-cols-3 gap-6 relative z-10">
          {FEATURES.map((feature) => (
            <FeatureCard key={feature.title} {...feature} />
          ))}
        </div>
      </div>
    </section>
  );
}
