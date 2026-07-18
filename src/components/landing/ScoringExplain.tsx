"use client";

import { useState } from "react";
import { motion, AnimatePresence, useMotionValue, useMotionTemplate } from "framer-motion";
import { HugeiconsIcon } from "@hugeicons/react";
import { 
  DashboardSquare01Icon, 
  Tag01Icon,
  BookOpen01Icon,
  Settings01Icon,
  Image01Icon,
  CompassIcon,
  ArtificialIntelligence01Icon,
  Target01Icon,
  FlashIcon,
  ActivityIcon,
  Shield01Icon,
  Link01Icon,
  AccessibilityIcon,
  Globe02Icon,
  SmartphoneWifiIcon,
  SearchIcon,
  Refresh01Icon,
  CheckmarkCircle02Icon
} from "@hugeicons/core-free-icons";

interface ModuleSimulator {
  id: string;
  name: string;
  score: number;
  icon: any;
  color: string;
  initialScore: number;
  fixedScore: number;
}

export function ScoringExplain() {
  // All 18 modules represented in the simulator
  const [modules, setModules] = useState<ModuleSimulator[]>([
    { id: "technical", name: "Technical SEO", score: 92, initialScore: 92, fixedScore: 100, icon: DashboardSquare01Icon, color: "from-teal-500 to-emerald-500" },
    { id: "onpage", name: "On-Page SEO", score: 85, initialScore: 85, fixedScore: 100, icon: Tag01Icon, color: "from-teal-500 to-cyan-500" },
    { id: "content", name: "Content E-E-A-T", score: 78, initialScore: 78, fixedScore: 100, icon: BookOpen01Icon, color: "from-indigo-500 to-purple-500" },
    { id: "schema", name: "Structured Data", score: 90, initialScore: 90, fixedScore: 100, icon: Settings01Icon, color: "from-blue-500 to-indigo-500" },
    { id: "images", name: "Image Optimizer", score: 80, initialScore: 80, fixedScore: 100, icon: Image01Icon, color: "from-amber-500 to-orange-500" },
    { id: "sitemap", name: "Sitemaps & Feeds", score: 95, initialScore: 95, fixedScore: 100, icon: CompassIcon, color: "from-emerald-500 to-teal-500" },
    { id: "ai", name: "AI Visibility", score: 70, initialScore: 70, fixedScore: 100, icon: ArtificialIntelligence01Icon, color: "from-purple-500 to-pink-500" },
    { id: "sxo", name: "Search Experience", score: 82, initialScore: 82, fixedScore: 100, icon: Target01Icon, color: "from-pink-500 to-rose-500" },
    { id: "performance", name: "Core Web Vitals", score: 85, initialScore: 85, fixedScore: 100, icon: FlashIcon, color: "from-orange-500 to-red-500" },
    { id: "pagespeed", name: "Page Latency", score: 75, initialScore: 75, fixedScore: 100, icon: ActivityIcon, color: "from-red-500 to-rose-500" },
    { id: "security", name: "Security Headers", score: 90, initialScore: 90, fixedScore: 100, icon: Shield01Icon, color: "from-cyan-500 to-blue-500" },
    { id: "links", name: "Internal Links", score: 88, initialScore: 88, fixedScore: 100, icon: Link01Icon, color: "from-indigo-500 to-blue-500" },
    { id: "accessibility", name: "Accessibility", score: 84, initialScore: 84, fixedScore: 100, icon: AccessibilityIcon, color: "from-teal-500 to-emerald-550" },
    { id: "international", name: "Hreflang Locales", score: 92, initialScore: 92, fixedScore: 100, icon: Globe02Icon, color: "from-blue-500 to-cyan-500" },
    { id: "mobile", name: "Mobile Friendly", score: 96, initialScore: 96, fixedScore: 100, icon: SmartphoneWifiIcon, color: "from-emerald-500 to-teal-500" },
    { id: "indexability", name: "Indexability", score: 75, initialScore: 75, fixedScore: 100, icon: SearchIcon, color: "from-cyan-500 to-blue-600" },
    { id: "backlinks", name: "Backlinks", score: 80, initialScore: 80, fixedScore: 100, icon: Link01Icon, color: "from-pink-500 to-rose-600" },
    { id: "drift", name: "SEO Drift Monitor", score: 70, initialScore: 70, fixedScore: 100, icon: Refresh01Icon, color: "from-indigo-500 to-purple-600" },
  ]);

  const [activeModuleId, setActiveModuleId] = useState<string | null>(null);
  const [pulsingNode, setPulsingNode] = useState<string | null>(null);

  // Motion values for left card spotlight hover
  const leftMouseX = useMotionValue(0);
  const leftMouseY = useMotionValue(0);
  function handleLeftMouseMove({ currentTarget, clientX, clientY }: React.MouseEvent) {
    const { left, top } = currentTarget.getBoundingClientRect();
    leftMouseX.set(clientX - left);
    leftMouseY.set(clientY - top);
  }

  // Motion values for right card spotlight hover
  const rightMouseX = useMotionValue(0);
  const rightMouseY = useMotionValue(0);
  function handleRightMouseMove({ currentTarget, clientX, clientY }: React.MouseEvent) {
    const { left, top } = currentTarget.getBoundingClientRect();
    rightMouseX.set(clientX - left);
    rightMouseY.set(clientY - top);
  }

  // Calculate overall score based on all 18 modules
  const overallScore = Math.round(
    modules.reduce((sum, m) => sum + m.score, 0) / modules.length
  );

  const handleSimulateFix = (modId: string) => {
    const mod = modules.find((m) => m.id === modId);
    if (!mod || mod.score === mod.fixedScore) return;

    setActiveModuleId(modId);

    // Simulate scanning/loading for 1.0 second
    setTimeout(() => {
      setModules((prev) =>
        prev.map((m) => (m.id === modId ? { ...m, score: m.fixedScore } : m))
      );
      setActiveModuleId(null);
      setPulsingNode(modId);

      setTimeout(() => {
        setPulsingNode(null);
      }, 800);
    }, 1000);
  };

  const handleResetSimulation = () => {
    setModules((prev) =>
      prev.map((m) => ({ ...m, score: m.initialScore }))
    );
    setActiveModuleId(null);
    setPulsingNode(null);
  };

  return (
    <section className="relative overflow-hidden bg-gradient-to-b from-slate-900 via-slate-950 to-slate-900 py-24 sm:py-32 border-t border-slate-900">
      
      {/* ── PREMIUM DYNAMIC GLOW BACKGROUND ── */}
      <div className="absolute inset-0 z-0">
        <motion.div 
          animate={{
            x: [0, 45, -25, 0],
            y: [0, -45, 25, 0],
          }}
          transition={{ duration: 16, repeat: Infinity, ease: "linear" }}
          className="absolute top-1/4 left-1/12 w-[600px] h-[600px] bg-teal-500/[0.14] rounded-full blur-[140px] mix-blend-screen"
        />
        <motion.div 
          animate={{
            x: [0, -50, 35, 0],
            y: [0, 35, -45, 0],
          }}
          transition={{ duration: 19, repeat: Infinity, ease: "linear" }}
          className="absolute bottom-1/4 right-1/12 w-[650px] h-[650px] bg-indigo-500/[0.14] rounded-full blur-[160px] mix-blend-screen"
        />
        
        {/* Futuristic Dot/Grid System with fading mask */}
        <div className="absolute inset-0 opacity-[0.08] mix-blend-overlay" style={{
          backgroundImage: `
            radial-gradient(circle at 1px 1px, #14b8a6 1px, transparent 0),
            linear-gradient(to right, rgba(255, 255, 255, 0.05) 1px, transparent 1px),
            linear-gradient(to bottom, rgba(255, 255, 255, 0.05) 1px, transparent 1px)
          `,
          backgroundSize: '24px 24px, 48px 48px, 48px 48px',
        }} />
        
        <div className="absolute inset-0 bg-gradient-to-b from-slate-900/60 via-transparent to-slate-900/60" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,transparent_30%,#0f172a_85%)]" />
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="max-w-3xl mx-auto text-center mb-16 sm:mb-20">
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-teal-500/10 border border-teal-500/20 text-teal-400 text-xs font-black tracking-wider uppercase mb-5"
          >
            <HugeiconsIcon icon={Target01Icon} size={13} />
            <span>Algorithm & Credit Architecture</span>
          </motion.div>
          <motion.h2
            initial={{ opacity: 0, y: 15 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="text-3xl sm:text-5xl font-black text-white tracking-tight leading-[1.1]"
          >
            How the scoring works
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 15 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="mt-4 text-base sm:text-lg text-slate-400 font-semibold leading-relaxed max-w-2xl mx-auto"
          >
            Designed to save bandwidth and credits. Run a full parallel scan across all 18 modules, or refresh an individual category on-demand in real-time.
          </motion.p>
        </div>

        {/* 2-Column Grid: Heights match exactly via flex items-stretch */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-10 items-stretch">
          
          {/* LEFT side: Premium Description Card with Dynamic Hover Spotlight */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            onMouseMove={handleLeftMouseMove}
            className="group lg:col-span-4 flex flex-col justify-between rounded-3xl border border-white/10 p-6 sm:p-9 backdrop-blur-xl relative overflow-hidden shadow-2xl transition-all duration-500 hover:border-teal-500/30 hover:bg-slate-900/25 cursor-default"
            style={{
              background: 'rgba(15, 23, 42, 0.4)',
              boxShadow: 'inset 0 1px 1px 0 rgba(255, 255, 255, 0.03), 0 25px 50px -12px rgba(2, 6, 23, 0.6)',
            }}
          >
            {/* Spotlight hover gradient background */}
            <motion.div
              className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none z-0"
              style={{
                background: useMotionTemplate`
                  radial-gradient(
                    180px circle at ${leftMouseX}px ${leftMouseY}px,
                    rgba(20, 184, 166, 0.12),
                    transparent 80%
                  )
                `,
              }}
            />
            {/* Top border glowing highlight line */}
            <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-teal-500/30 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 z-10" />

            <div className="relative z-10 space-y-6">
              <div className="inline-block p-3 rounded-2xl bg-teal-500/10 border border-teal-500/20 text-teal-400">
                <HugeiconsIcon icon={ActivityIcon} size={22} />
              </div>
              <div>
                <h3 className="text-xl font-bold text-white tracking-tight">
                  The Arithmetic Average
                </h3>
                <p className="text-sm text-slate-400 mt-2 leading-relaxed font-semibold">
                  Your **Overall Score** is the exact mathematical average of all 18 module audit categories. If you fix an issue in one module, it is refreshed individually and propagates instantly.
                </p>
              </div>

              {/* Step items */}
              <div className="space-y-4 pt-2">
                <div className="flex items-start gap-3">
                  <div className="w-5 h-5 rounded-lg bg-teal-500/15 text-teal-400 flex items-center justify-center text-[10px] font-mono font-bold shrink-0 mt-0.5">
                    1
                  </div>
                  <div>
                    <h4 className="text-xs font-bold text-slate-200">Equal Contribution Weights</h4>
                    <p className="text-[11px] text-slate-400 font-semibold mt-0.5">Each of the 18 modules (Indexability, Drift, Speed, etc.) holds a max score of 100, which updates dynamically when refreshed.</p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <div className="w-5 h-5 rounded-lg bg-indigo-500/15 text-indigo-400 flex items-center justify-center text-[10px] font-mono font-bold shrink-0 mt-0.5">
                    2
                  </div>
                  <div>
                    <h4 className="text-xs font-bold text-slate-200">On-Demand Category Update</h4>
                    <p className="text-[11px] text-slate-400 font-semibold mt-0.5">Fix a single error and refresh only that module for **0.50 credits/page** instead of rescanning all pages (which costs **4.50 credits/page**).</p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <div className="w-5 h-5 rounded-lg bg-purple-500/15 text-purple-400 flex items-center justify-center text-[10px] font-mono font-bold shrink-0 mt-0.5">
                    3
                  </div>
                  <div>
                    <h4 className="text-xs font-bold text-slate-200">Real-Time Propagation</h4>
                    <p className="text-[11px] text-slate-400 font-semibold mt-0.5">Recalculations happen instantly on the backend database. Updated values are piped immediately to your dashboard view.</p>
                  </div>
                </div>
              </div>
            </div>

            <div className="mt-8 pt-4 border-t border-white/[0.04] text-[10px] text-slate-500 font-bold text-center relative z-10">
              * Rates are locked at 0.50 tokens/page for single audits.
            </div>
          </motion.div>

          {/* RIGHT side: Super Premium Interactive Score Compiler Simulator with Dynamic Hover Spotlight */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            onMouseMove={handleRightMouseMove}
            className="group lg:col-span-8 rounded-3xl border border-white/10 p-6 sm:p-8 backdrop-blur-xl relative overflow-hidden shadow-2xl transition-all duration-500 hover:border-teal-500/30 hover:bg-slate-900/25 cursor-default flex flex-col justify-between"
            style={{
              background: 'rgba(15, 23, 42, 0.4)',
              boxShadow: 'inset 0 1px 1px 0 rgba(255, 255, 255, 0.03), 0 25px 50px -12px rgba(2, 6, 23, 0.6)',
            }}
          >
            {/* Spotlight hover gradient background */}
            <motion.div
              className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none z-0"
              style={{
                background: useMotionTemplate`
                  radial-gradient(
                    180px circle at ${rightMouseX}px ${rightMouseY}px,
                    rgba(20, 184, 166, 0.12),
                    transparent 80%
                  )
                `,
              }}
            />
            {/* Top border glowing highlight line */}
            <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-teal-500/30 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 z-10" />

            <div className="relative z-10">
              {/* Simulator Header */}
              <div className="flex items-center justify-between gap-4 mb-6 pb-4 border-b border-white/[0.04]">
                <div>
                  <span className="text-[9px] font-black text-teal-400 uppercase tracking-widest bg-teal-500/5 border border-teal-500/10 px-2 py-0.5 rounded-md">Interactive Simulator</span>
                  <h4 className="text-base font-bold text-white mt-1.5">Score Propagation Visualizer (All 18 Modules)</h4>
                </div>
                {modules.some((m) => m.score !== m.initialScore) && (
                  <button
                    onClick={handleResetSimulation}
                    className="px-3 py-1.5 bg-slate-900/60 hover:bg-slate-850 text-slate-400 hover:text-slate-200 font-bold border border-white/[0.05] rounded-xl text-[10px] transition-all cursor-pointer shadow-xs hover:border-white/[0.1]"
                  >
                    Reset Demo
                  </button>
                )}
              </div>

              {/* Score Visual Grid Layout */}
              <div className="grid grid-cols-1 xl:grid-cols-12 gap-6 items-center">
                
                {/* Central Overall score gauge */}
                <div 
                  className="xl:col-span-4 flex flex-col items-center justify-center border p-6 rounded-2xl relative overflow-hidden"
                  style={{
                    background: 'linear-gradient(135deg, rgba(30, 41, 59, 0.25) 0%, rgba(15, 23, 42, 0.5) 100%)',
                    borderColor: 'rgba(255, 255, 255, 0.03)'
                  }}
                >
                  {/* Dynamic pulsing glow behind gauge */}
                  <AnimatePresence>
                    {pulsingNode && (
                      <motion.div
                        initial={{ scale: 0.8, opacity: 0.8 }}
                        animate={{ scale: 1.5, opacity: 0 }}
                        exit={{ opacity: 0 }}
                        transition={{ duration: 0.8 }}
                        className="absolute inset-0 bg-teal-500/10 rounded-full blur-2xl pointer-events-none"
                      />
                    )}
                  </AnimatePresence>

                  {/* Score Circular Ring */}
                  <div className="relative w-28 h-28 flex items-center justify-center">
                    <svg className="absolute w-full h-full -rotate-90">
                      {/* Background circle */}
                      <circle
                        cx="56"
                        cy="56"
                        r="46"
                        strokeWidth="6"
                        stroke="rgba(255, 255, 255, 0.02)"
                        fill="transparent"
                      />
                      {/* Animated foreground circle */}
                      <motion.circle
                        cx="56"
                        cy="56"
                        r="46"
                        strokeWidth="7"
                        stroke="url(#sim-gradient-v4)"
                        fill="transparent"
                        strokeDasharray={2 * Math.PI * 46}
                        strokeDashoffset={(2 * Math.PI * 46) * (1 - 84 / 100)}
                        animate={{
                          strokeDashoffset: (2 * Math.PI * 46) * (1 - overallScore / 100)
                        }}
                        transition={{ type: "spring", stiffness: 60, damping: 15 }}
                        strokeLinecap="round"
                      />
                      <defs>
                        <linearGradient id="sim-gradient-v4" x1="0" y1="0" x2="1" y2="1">
                          <stop offset="0%" stopColor="#2dd4bf" />
                          <stop offset="100%" stopColor="#6366f1" />
                        </linearGradient>
                      </defs>
                    </svg>

                    <div className="text-center relative z-10 flex flex-col items-center justify-center">
                      <motion.span 
                        key={overallScore}
                        initial={{ scale: 0.85, opacity: 0.8 }}
                        animate={{ scale: 1, opacity: 1 }}
                        transition={{ type: "spring", stiffness: 100 }}
                        className="text-3xl font-mono font-black text-white tracking-tighter"
                      >
                        {overallScore}
                      </motion.span>
                      <span className="text-[7.5px] font-bold text-slate-400 uppercase tracking-widest mt-0.5">Overall Index</span>
                    </div>
                  </div>

                  <div className="text-center mt-4">
                    <span className="text-[9px] font-mono text-slate-450 font-bold bg-slate-950/60 border border-white/[0.04] px-2 py-0.5 rounded-md">
                      Avg = (∑ Scores) / 18
                    </span>
                  </div>
                </div>

                {/* Surrounding modules nodes: 18 Modules laid out in a compact 2-column or 3-column subgrid */}
                <div className="xl:col-span-8 grid grid-cols-1 sm:grid-cols-2 gap-2 max-h-[360px] overflow-y-auto pr-1 custom-scrollbar">
                  {modules.map((mod) => {
                    const isScanning = activeModuleId === mod.id;
                    const isUpgraded = mod.score === mod.fixedScore;
                    
                    return (
                      <div 
                        key={mod.id}
                        onClick={() => !isScanning && !isUpgraded && handleSimulateFix(mod.id)}
                        className={`relative flex items-center justify-between p-2 rounded-xl border transition-all duration-300 cursor-pointer ${
                          isScanning
                            ? "bg-slate-900/60 border-teal-500/40 shadow-xs shadow-teal-950/20"
                            : isUpgraded
                              ? "bg-slate-900/10 border-white/[0.02] hover:bg-slate-900/20"
                              : "bg-slate-900/20 border-white/[0.01] hover:border-white/[0.03] hover:bg-slate-900/30"
                        }`}
                        style={{
                          borderLeftWidth: '3px',
                          borderLeftColor: isScanning ? '#2dd4bf' : isUpgraded ? '#10b981' : 'rgba(255,255,255,0.06)'
                        }}
                      >
                        <div className="flex items-center gap-2">
                          <div className={`w-7 h-7 rounded-lg bg-gradient-to-br ${mod.color} p-[1px]`}>
                            <div className="w-full h-full rounded-[6px] bg-slate-950 flex items-center justify-center text-slate-200">
                              <HugeiconsIcon icon={mod.icon} size={11} className={isScanning ? "animate-spin-premium text-teal-400" : ""} />
                            </div>
                          </div>
                          <div className="min-w-0">
                            <h5 className="text-[10px] font-bold text-slate-200 truncate leading-tight">{mod.name}</h5>
                            <span className="text-[8px] font-mono font-semibold text-slate-500 block leading-tight">
                              {isScanning ? "Analyzing..." : `Score: ${mod.score}/100`}
                            </span>
                          </div>
                        </div>

                        {/* State Action Icon / Indicator */}
                        <div className="shrink-0 pl-1">
                          {isScanning ? (
                            <div className="w-3.5 h-3.5 rounded-full border border-teal-500/30 border-t-teal-400 animate-spin" />
                          ) : isUpgraded ? (
                            <HugeiconsIcon icon={CheckmarkCircle02Icon} size={12} className="text-emerald-450 stroke-[3.5]" />
                          ) : (
                            <button
                              disabled={activeModuleId !== null}
                              className={`p-1 bg-slate-900/60 hover:bg-slate-800 text-slate-400 hover:text-slate-200 border border-white/[0.04] rounded-lg transition-all ${
                                activeModuleId !== null ? "opacity-35 pointer-events-none" : ""
                              }`}
                            >
                              <HugeiconsIcon icon={Refresh01Icon} size={8} />
                            </button>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>

              </div>
            </div>

            {/* Interactive hint */}
            <div className="mt-6 pt-4 border-t border-white/[0.04] text-center relative z-10">
              <p className="text-[10px] text-slate-450 font-bold leading-relaxed">
                💡 **Interactive Dashboard Control**: Click on any module card (e.g. Content E-E-A-T or AI Visibility) to simulate refreshing it on-demand for 0.5 credits and watch the overall score average update instantly.
              </p>
            </div>

          </motion.div>

        </div>
      </div>
    </section>
  );
}
