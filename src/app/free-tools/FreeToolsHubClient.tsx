"use client";

import Link from "next/link";
import { motion } from "framer-motion";

interface ToolItem {
  title: string;
  description: string;
  href: string;
  icon: React.ReactNode;
  badge: string;
}

interface FreeToolsHubClientProps {
  tools: ToolItem[];
}

export function FreeToolsHubClient({ tools }: FreeToolsHubClientProps) {
  return (
    <div>
      {/* ── Dynamic Luminous Aurora Mesh Background ── */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none z-0">
        <motion.div
          animate={{
            x: [0, 80, -40, 0],
            y: [0, -50, 60, 0],
            scale: [1, 1.2, 0.9, 1],
            opacity: [0.7, 0.8, 0.7, 0.7],
          }}
          transition={{ duration: 16, repeat: Infinity, ease: "easeInOut" }}
          className="absolute top-0 left-[10%] w-[500px] h-[500px] rounded-full bg-gradient-to-tr from-teal-500/35 via-cyan-500/20 to-transparent blur-[100px]"
        />
        <motion.div
          animate={{
            x: [0, -90, 50, 0],
            y: [0, 70, -40, 0],
            scale: [1, 1.15, 0.85, 1],
            opacity: [0.6, 0.7, 0.6, 0.6],
          }}
          transition={{ duration: 20, repeat: Infinity, ease: "easeInOut" }}
          className="absolute top-20 right-[15%] w-[600px] h-[600px] rounded-full bg-gradient-to-br from-indigo-500/35 via-purple-500/25 to-transparent blur-[120px]"
        />
      </div>

      {/* ── Cyber Matrix Dot Grid Overlay ── */}
      <div
        className="absolute inset-0 opacity-25 pointer-events-none z-0"
        style={{
          backgroundImage: "radial-gradient(rgba(255, 255, 255, 0.08) 1px, transparent 1px)",
          backgroundSize: "24px 24px",
          maskImage: "radial-gradient(ellipse 80% 60% at 50% 30%, black 40%, transparent 100%)",
          WebkitMaskImage: "radial-gradient(ellipse 80% 60% at 50% 30%, black 40%, transparent 100%)",
        }}
      />

      <div className="relative max-w-5xl mx-auto z-10 pt-8">
        {/* Header */}
        <div className="text-center mb-16">
          <span className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-teal-500/10 border border-teal-500/25 text-teal-400 text-xs font-bold uppercase tracking-wider mb-5 shadow-lg shadow-teal-500/10">
            Free SEO Utilities
          </span>
          <h1 className="text-4xl sm:text-5xl font-black tracking-tight text-white mb-4">
            Free SEO <span className="gradient-text">Toolbox</span>
          </h1>
          <p className="text-slate-300 max-w-xl mx-auto text-base sm:text-lg leading-relaxed font-medium">
            Utility generators and validators to optimize search discoverability, indexation tags, and crawler instructions.
          </p>
        </div>

        {/* Tools Grid */}
        <div className="grid md:grid-cols-3 gap-6">
          {tools.map((tool) => (
            <div
              key={tool.title}
              className="group relative rounded-2xl border border-white/10 bg-slate-900/40 p-6 backdrop-blur-xl hover:border-teal-500/30 transition-all duration-300 flex flex-col justify-between hover:shadow-[0_0_30px_rgba(20,184,166,0.05)]"
            >
              <div>
                <div className="flex items-center justify-between mb-4">
                  <div className="p-3 bg-white/5 rounded-xl border border-white/10 group-hover:border-teal-500/20 group-hover:bg-teal-500/5 transition-all">
                    {tool.icon}
                  </div>
                  <span className="text-[9px] font-black uppercase tracking-wider px-2 py-0.5 rounded-md bg-white/5 border border-white/10 text-slate-400">
                    {tool.badge}
                  </span>
                </div>
                <h2 className="text-lg font-bold text-white mb-2 font-sans group-hover:text-teal-300 transition-colors">
                  {tool.title}
                </h2>
                <p className="text-slate-300 text-xs sm:text-sm leading-relaxed mb-6">
                  {tool.description}
                </p>
              </div>
              <Link
                href={tool.href}
                className="inline-flex items-center justify-center w-full py-2.5 rounded-xl bg-white/5 hover:bg-teal-500 hover:text-white border border-white/10 hover:border-teal-500 text-xs font-bold text-slate-200 transition-all duration-200"
              >
                Launch Tool →
              </Link>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
