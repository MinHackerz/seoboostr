"use client";

import { useEffect, useState, useCallback } from "react";
import { motion } from "framer-motion";
import { MODULES, getScoreColor, type ScanResult } from "./moduleData";
import { useSession, signIn, signOut } from "next-auth/react";

// ── Types ────────────────────────────────────────────────────

export type ScanPhase = "idle" | "scanning" | "complete";

interface ModuleStatus {
  phase: "waiting" | "scanning" | "complete";
  score: number;
  issues: number;
  finding: string;
}

interface AuditDashboardProps {
  phase: ScanPhase;
  scanResults: ScanResult[] | null;
  url: string;
  onClearScan?: () => void;
}

// ── Radial Score Ring ────────────────────────────────────────

function RadialScore({
  score,
  size = 56,
  strokeWidth = 5,
  animated = false,
  delay = 0,
}: {
  score: number;
  size?: number;
  strokeWidth?: number;
  animated?: boolean;
  delay?: number;
}) {
  const [displayScore, setDisplayScore] = useState(animated ? 0 : score);
  const radius = (size - strokeWidth * 2) / 2;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (displayScore / 100) * circumference;
  const color = getScoreColor(displayScore);

  useEffect(() => {
    if (!animated) {
      setDisplayScore(score);
      return;
    }
    const timer = setTimeout(() => {
      let current = 0;
      const step = Math.max(1, Math.floor(score / 30));
      const interval = setInterval(() => {
        current += step;
        if (current >= score) {
          current = score;
          clearInterval(interval);
        }
        setDisplayScore(current);
      }, 25);
      return () => clearInterval(interval);
    }, delay);
    return () => clearTimeout(timer);
  }, [score, animated, delay]);

  return (
    <div className="relative" style={{ width: size, height: size }}>
      <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`} className="transform -rotate-90">
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke="rgba(255,255,255,0.08)"
          strokeWidth={strokeWidth}
        />
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke={color}
          strokeWidth={strokeWidth}
          strokeLinecap="round"
          strokeDasharray={circumference}
          strokeDashoffset={offset}
          style={{ transition: "stroke-dashoffset 0.4s ease-out, stroke 0.3s ease" }}
        />
      </svg>
      <span
        className="absolute inset-0 flex items-center justify-center font-mono text-sm font-bold tabular-nums text-white"
        style={{ color, fontSize: size < 50 ? "0.7rem" : "0.85rem" }}
      >
        {displayScore}
      </span>
    </div>
  );
}

// ── Overall Score Ring (large) ───────────────────────────────

function OverallScore({ score, phase, completedCount, totalCount }: { score: number; phase: ScanPhase; completedCount: number; totalCount: number }) {
  const [displayScore, setDisplayScore] = useState(0);
  const size = 140;
  const strokeWidth = 8;
  const radius = (size - strokeWidth * 2) / 2;
  const circumference = 2 * Math.PI * radius;
  
  // Draw stroke progress ONLY when the analysis is completed
  const offset = phase === "complete"
    ? circumference - (displayScore / 100) * circumference
    : circumference;

  const color = getScoreColor(displayScore);

  useEffect(() => {
    if (phase !== "complete") {
      setDisplayScore(0);
      return;
    }
    let current = 0;
    const interval = setInterval(() => {
      current += 2;
      if (current >= score) {
        current = score;
        clearInterval(interval);
      }
      setDisplayScore(current);
    }, 20);
    return () => clearInterval(interval);
  }, [phase, score]);

  return (
    <div className="relative flex flex-col items-center">
      <div className="relative" style={{ width: size, height: size }}>
        <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`} className="transform -rotate-90">
          <circle
            cx={size / 2}
            cy={size / 2}
            r={radius}
            fill="none"
            stroke="rgba(255,255,255,0.08)"
            strokeWidth={strokeWidth}
          />
          {phase === "complete" && (
            <circle
              cx={size / 2}
              cy={size / 2}
              r={radius}
              fill="none"
              stroke={color}
              strokeWidth={strokeWidth}
              strokeLinecap="round"
              strokeDasharray={circumference}
              strokeDashoffset={offset}
              style={{
                transition: "stroke-dashoffset 0.3s ease-out, stroke 0.3s ease",
                filter: `drop-shadow(0 0 6px ${color})`,
              }}
            />
          )}
        </svg>
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <span className="font-mono text-3xl font-black tabular-nums text-white">
            {phase === "complete" ? displayScore : `${completedCount}/${totalCount}`}
          </span>
          <span className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider mt-0.5">
            {phase === "idle" ? "Ready" : phase === "scanning" ? "Scanning" : "Overall"}
          </span>
        </div>
      </div>
    </div>
  );
}

// ── Module Card ──────────────────────────────────────────────

function ModuleCard({
  module,
  status,
  index,
}: {
  module: (typeof MODULES)[0];
  status: ModuleStatus;
  index: number;
}) {
  const isActive = status.phase !== "waiting";

  return (
    <motion.div
      initial={{ opacity: 0.5 }}
      animate={{
        opacity: isActive ? 1 : 0.5,
        scale: status.phase === "scanning" ? 1.02 : 1,
      }}
      transition={{ duration: 0.3 }}
      className={`relative rounded-xl border px-4 py-3.5 flex items-center gap-3.5 transition-all duration-300 ${
        status.phase === "complete"
          ? "border-white/10 bg-white/5 hover:border-teal-500/40 hover:bg-white/10 shadow-[0_0_15px_rgba(0,0,0,0.2)]"
          : status.phase === "scanning"
          ? "border-teal-500/40 bg-teal-500/10 shadow-[0_0_20px_rgba(20,184,166,0.15)]"
          : "border-white/5 bg-white/3"
      }`}
    >
      {/* Scan pulse */}
      {status.phase === "scanning" && (
        <div className="absolute inset-0 rounded-xl border border-teal-500/40 animate-ping opacity-25 pointer-events-none" />
      )}

      {/* Icon */}
      <div
        className={`shrink-0 w-9 h-9 rounded-lg flex items-center justify-center transition-colors ${
          status.phase === "complete"
            ? "bg-teal-500/15 text-teal-400 border border-teal-500/20"
            : status.phase === "scanning"
            ? "bg-teal-500/25 text-teal-300 border border-teal-500/30"
            : "bg-white/5 text-slate-500 border border-white/5"
        }`}
      >
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d={module.iconPath} />
        </svg>
      </div>

      {/* Info */}
      <div className="flex-1 min-w-0">
        <p className={`text-xs font-bold truncate ${isActive ? "text-slate-100" : "text-slate-500"}`}>
          {module.shortName}
        </p>
        {status.phase === "scanning" && (
          <div className="flex items-center gap-1.5 mt-2">
            <div className="h-1.5 flex-1 bg-white/10 rounded-full overflow-hidden">
              <motion.div
                className="h-full bg-teal-400 rounded-full shadow-[0_0_8px_#2dd4bf]"
                initial={{ width: "0%" }}
                animate={{ width: "100%" }}
                transition={{ duration: 2 + index * 0.3, ease: "easeInOut" }}
              />
            </div>
          </div>
        )}
        {status.phase === "complete" && (
          <p className="text-[10px] text-slate-400 mt-1 leading-relaxed truncate">
            {status.finding}
          </p>
        )}
      </div>

      {/* Score */}
      {status.phase === "complete" && (
        <RadialScore score={status.score} size={40} strokeWidth={3} animated delay={100} />
      )}
      {status.phase === "scanning" && (
        <div className="w-10 h-10 flex items-center justify-center">
          <motion.div
            className="w-4 h-4 border-2 border-teal-400 border-t-transparent rounded-full"
            animate={{ rotate: 360 }}
            transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
          />
        </div>
      )}
    </motion.div>
  );
}

// Calculate overall score when all modules complete
export function AuditDashboard({ phase, scanResults, url, onClearScan }: AuditDashboardProps) {
  const [moduleStatuses, setModuleStatuses] = useState<Record<string, ModuleStatus>>({});
  const [overallScore, setOverallScore] = useState(0);
  const { data: session, status: authStatus } = useSession();
  const isLoggedIn = authStatus === "authenticated" && session?.user?.email !== "demo@seoptimised.com";

  // Dynamic status bar clock to show the user's exact local time (safe from hydration errors)
  const [timeStr, setTimeStr] = useState("9:41 AM");

  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      setTimeStr(
        now.toLocaleTimeString("en-US", {
          hour: "numeric",
          minute: "2-digit",
          hour12: true,
        })
      );
    };
    updateTime();
    const timer = setInterval(updateTime, 1000);
    return () => clearInterval(timer);
  }, []);

  // Initialize all modules as waiting
  const resetModules = useCallback(() => {
    const initial: Record<string, ModuleStatus> = {};
    MODULES.forEach((m) => {
      initial[m.id] = { phase: "waiting", score: 0, issues: 0, finding: "" };
    });
    setModuleStatuses(initial);
    setOverallScore(0);
  }, []);

  useEffect(() => {
    if (phase === "idle") {
      resetModules();
      return;
    }

    if (phase === "scanning" && scanResults) {
      // Reset first
      resetModules();

      // Start all modules scanning immediately (parallel feel)
      const scanTimeout = setTimeout(() => {
        setModuleStatuses((prev) => {
          const next = { ...prev };
          MODULES.forEach((m) => {
            next[m.id] = { ...next[m.id], phase: "scanning" };
          });
          return next;
        });
      }, 200);

      // Complete each module at its own delay
      const completionTimers = scanResults.map((result) =>
        setTimeout(() => {
          setModuleStatuses((prev) => ({
            ...prev,
            [result.moduleId]: {
              phase: "complete",
              score: result.score,
              issues: result.issues,
              finding: result.finding,
            },
          }));
        }, result.delay)
      );

      return () => {
        clearTimeout(scanTimeout);
        completionTimers.forEach(clearTimeout);
      };
    }
  }, [phase, scanResults, resetModules]);

  // Calculate overall score when all modules complete
  useEffect(() => {
    const completed = Object.values(moduleStatuses).filter((s) => s.phase === "complete");
    if (completed.length === MODULES.length && completed.length > 0) {
      const avg = Math.round(completed.reduce((sum, s) => sum + s.score, 0) / completed.length);
      setOverallScore(avg);
    }
  }, [moduleStatuses]);

  const displayUrl = url || "yoursite.com";

  return (
    <div className="w-full h-full flex flex-col bg-slate-950/40 text-left font-sans">
      {/* iPadOS Status Bar */}
      <div className="w-full px-5 py-1.5 bg-slate-950/95 border-b border-white/5 flex items-center justify-between text-[11px] font-semibold text-slate-400 select-none shrink-0 z-15">
        <span className="font-medium text-white">{timeStr}</span>
        <div className="flex items-center gap-1.5">
          {/* WiFi icon */}
          <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" className="opacity-80">
            <path d="M12 20h.01M8.5 16.5a5 5 0 017 0M5 13a10 10 0 0114 0M1.5 9.5a15 15 0 0121 0" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
          {/* Battery icon */}
          <div className="flex items-center gap-0.5 opacity-80">
            <span className="text-[10px] mr-0.5 font-sans font-medium">100%</span>
            <div className="w-5 h-2.5 border border-white/40 rounded-sm p-[1px] flex items-center">
              <div className="h-full w-full bg-emerald-500 rounded-[1px]" />
            </div>
            <div className="w-0.5 h-1 bg-white/40 rounded-r-sm" />
          </div>
        </div>
      </div>

      {/* Safari Browser Chrome Header */}
      <div className="flex flex-col bg-slate-950/90 border-b border-white/10 shrink-0 select-none z-10">
        {/* Navigation Controls & URL Bar Row */}
        <div className="flex items-center justify-between px-3.5 py-2 gap-3">
          {/* Left: Navigation Buttons */}
          <div className="flex items-center gap-3.5 text-slate-400 shrink-0">
            {/* Back Button */}
            <button className="hover:text-white cursor-pointer transition-colors" disabled aria-label="Back">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                <path d="M15 19l-7-7 7-7" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </button>
            {/* Forward Button */}
            <button className="hover:text-white cursor-pointer transition-colors" disabled aria-label="Forward">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                <path d="M9 5l7 7-7 7" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </button>
            {/* Sidebar Button */}
            <button className="hover:text-white cursor-pointer transition-colors" aria-label="Sidebar">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <rect x="3" y="3" width="18" height="18" rx="2" />
                <path d="M9 3v18" />
              </svg>
            </button>
          </div>

          {/* Center: Address/URL Bar */}
          <div className="flex-1 max-w-xl mx-auto flex items-center justify-between py-1.5 px-3 bg-white/5 border border-white/10 rounded-xl shadow-inner relative group">
            {/* aA formatting button */}
            <span className="text-[11px] font-extrabold text-slate-400 select-none hover:text-white cursor-pointer font-sans tracking-tight">aA</span>
            
            {/* Domain & Lock */}
            <div className="flex items-center gap-1.5 mx-auto max-w-[70%] select-none">
              <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" className="text-teal-400 shrink-0">
                <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
                <path d="M7 11V7a5 5 0 0110 0v4" />
              </svg>
              <span className="text-[11px] font-sans text-slate-200 truncate font-normal">
                https://{phase !== "idle" ? displayUrl : "seoptimised.com"}
              </span>
            </div>

            {/* Refresh/Reload or Clear Button */}
            {phase !== "idle" && onClearScan ? (
              <button 
                onClick={onClearScan}
                className="text-slate-400 hover:text-rose-450 cursor-pointer transition-colors p-0.5 rounded"
                title="Clear Output & Reset"
              >
                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                  <line x1="18" y1="6" x2="6" y2="18" />
                  <line x1="6" y1="6" x2="18" y2="18" />
                </svg>
              </button>
            ) : (
              <button className="text-slate-400 hover:text-white cursor-pointer" aria-label="Reload">
                <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                  <path d="M21.5 2v6h-6M21.34 15.57a10 10 0 11-.57-8.38l5.67-5.67" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </button>
            )}
          </div>

          {/* Right: Actions */}
          <div className="flex items-center gap-3.5 text-slate-400 shrink-0">
            {/* Share Button */}
            <button className="hover:text-white cursor-pointer transition-colors" aria-label="Share">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M4 12v8a2 2 0 002 2h12a2 2 0 002-2v-8M16 6l-4-4-4 4M12 2v13" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </button>
            {/* Plus / New Tab Button */}
            <button className="hover:text-white cursor-pointer transition-colors" aria-label="New Tab">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                <path d="M12 5v14M5 12h14" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </button>
            {/* Tabs Manager Button */}
            <button className="hover:text-white cursor-pointer transition-colors" aria-label="Tabs">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <rect x="3" y="3" width="13" height="13" rx="2" />
                <rect x="8" y="8" width="13" height="13" rx="2" />
              </svg>
            </button>
          </div>
        </div>

        {/* Browser Tab Bar */}
        <div className="flex items-end px-4 bg-slate-950/40 border-t border-white/5 text-[11px] text-slate-400 select-none h-8 font-sans">
          {/* Active Tab */}
          <div className="flex items-center gap-1.5 px-3.5 py-1 bg-slate-950 border-x border-t border-white/10 rounded-t-lg h-full text-white font-medium">
            <span className="w-1.5 h-1.5 rounded-full bg-teal-400 animate-pulse shadow-[0_0_4px_#2dd4bf]" />
            <span className="max-w-[120px] truncate font-sans">SEO Audit Report</span>
            {phase !== "idle" && onClearScan ? (
              <button 
                onClick={onClearScan}
                className="ml-1 opacity-60 hover:opacity-100 font-bold cursor-pointer font-sans" 
                aria-label="Clear scan"
              >
                ×
              </button>
            ) : (
              <button className="ml-1 opacity-60 hover:opacity-100 font-bold" aria-label="Close tab">×</button>
            )}
          </div>
          {/* Inactive Tab */}
          <div className="flex items-center gap-1.5 px-3 py-1 hover:bg-slate-950/20 border border-transparent rounded-t-lg h-full ml-1 opacity-70">
            <span className="max-w-[100px] truncate">seoptimised.com</span>
            <button className="ml-1 opacity-40 hover:opacity-100" aria-label="Close tab">×</button>
          </div>
        </div>
      </div>

      {/* Dashboard content */}
      <div className="flex-1 overflow-y-auto p-4 sm:p-5 bg-slate-950/60 select-text">
        {/* Overall score */}
        <div className="flex justify-center mb-6">
          <OverallScore 
            score={overallScore} 
            phase={phase} 
            completedCount={Object.values(moduleStatuses).filter((s) => s.phase === "complete").length}
            totalCount={MODULES.length}
          />
        </div>

        {/* URL display subtitle */}
        {phase !== "idle" && (
          <motion.p
            initial={{ opacity: 0, y: -5 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center text-xs font-mono text-slate-400 mb-5"
          >
            Auditing{" "}
            <span className="text-teal-400 font-bold">{displayUrl}</span>
            {phase === "scanning" && (
              <span className="inline-flex ml-1">
                <motion.span
                  animate={{ opacity: [1, 0.3, 1] }}
                  transition={{ duration: 1.5, repeat: Infinity }}
                >
                  …
                </motion.span>
              </span>
            )}
          </motion.p>
        )}

        {/* Module grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
          {MODULES.map((mod, i) => (
            <ModuleCard
              key={mod.id}
              module={mod}
              status={moduleStatuses[mod.id] || { phase: "waiting", score: 0, issues: 0, finding: "" }}
              index={i}
            />
          ))}
        </div>

        {/* Scan summary when complete */}
        {phase === "complete" && overallScore > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="mt-5 p-4 rounded-xl border border-teal-500/20 bg-gradient-to-r from-teal-500/10 to-indigo-500/10"
          >
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <p className="text-xs font-bold text-white flex items-center gap-1.5">
                  <span className="inline-block w-2 h-2 rounded-full bg-teal-400 animate-pulse shadow-[0_0_8px_#2dd4bf]" />
                  Scan Complete · Overall Score: <span className="font-mono font-bold text-teal-400">{overallScore}/100</span>
                </p>
                <p className="text-[10px] text-slate-400 font-mono mt-1">
                  All parallel SEO check modules verified against active ranking criteria.
                </p>
              </div>
              <button
                onClick={async () => {
                  localStorage.setItem("seoptimised_last_scanned_url", url);
                  if (scanResults) {
                    localStorage.setItem("seoptimised_last_scanned_results", JSON.stringify(scanResults));
                  }
                  if (isLoggedIn) {
                    window.location.href = "/dashboard";
                  } else {
                    if (session?.user?.email === "demo@seoptimised.com") {
                      await signOut({ redirect: false });
                    }
                    signIn("google", { callbackUrl: "/dashboard" });
                  }
                }}
                className="w-full sm:w-auto px-5 py-2.5 text-xs font-bold text-white bg-gradient-to-r from-teal-500 to-teal-600 hover:from-teal-400 hover:to-teal-500 rounded-lg transition-all shadow-lg shadow-teal-500/20 cursor-pointer text-center"
              >
                {isLoggedIn ? "Go to dashboard for full report →" : "Login to view detailed report →"}
              </button>
            </div>
          </motion.div>
        )}
      </div>
    </div>
  );
}
