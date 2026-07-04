"use client";

import { useEffect, useState, useCallback } from "react";
import { motion } from "framer-motion";
import { MODULES, getScoreColor, type ScanResult } from "./moduleData";

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
          stroke="rgba(15,23,42,0.06)"
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
        className="absolute inset-0 flex items-center justify-center font-mono text-sm font-bold tabular-nums"
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
            stroke="rgba(15,23,42,0.06)"
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
              style={{ transition: "stroke-dashoffset 0.3s ease-out, stroke 0.3s ease" }}
            />
          )}
        </svg>
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <span className="font-mono text-3xl font-black tabular-nums text-slate-900">
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
          ? "border-slate-200 bg-white hover:border-slate-350"
          : status.phase === "scanning"
          ? "border-teal-500/30 bg-teal-50/20"
          : "border-slate-200 bg-slate-50/50"
      }`}
    >
      {/* Scan pulse */}
      {status.phase === "scanning" && (
        <div className="absolute inset-0 rounded-xl border border-teal-500/20 animate-ping opacity-25 pointer-events-none" />
      )}

      {/* Icon */}
      <div
        className={`shrink-0 w-9 h-9 rounded-lg flex items-center justify-center transition-colors ${
          status.phase === "complete"
            ? "bg-teal-50 text-teal-600"
            : status.phase === "scanning"
            ? "bg-teal-50/80 text-teal-600"
            : "bg-slate-100 text-slate-400"
        }`}
      >
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d={module.iconPath} />
        </svg>
      </div>

      {/* Info */}
      <div className="flex-1 min-w-0">
        <p className={`text-xs font-bold truncate ${isActive ? "text-slate-800" : "text-slate-400"}`}>
          {module.shortName}
        </p>
        {status.phase === "scanning" && (
          <div className="flex items-center gap-1.5 mt-2">
            <div className="h-1.5 flex-1 bg-slate-100 rounded-full overflow-hidden">
              <motion.div
                className="h-full bg-teal-500 rounded-full"
                initial={{ width: "0%" }}
                animate={{ width: "100%" }}
                transition={{ duration: 2 + index * 0.3, ease: "easeInOut" }}
              />
            </div>
          </div>
        )}
        {status.phase === "complete" && (
          <p className="text-[10px] text-slate-500 mt-1 leading-relaxed">
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
            className="w-4 h-4 border-2 border-teal-500 border-t-transparent rounded-full"
            animate={{ rotate: 360 }}
            transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
          />
        </div>
      )}
    </motion.div>
  );
}

// ── Main Dashboard ───────────────────────────────────────────

export function AuditDashboard({ phase, scanResults, url }: AuditDashboardProps) {
  const [moduleStatuses, setModuleStatuses] = useState<Record<string, ModuleStatus>>({});
  const [overallScore, setOverallScore] = useState(0);

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
    <div className="w-full max-w-5xl mx-auto">
      {/* Dashboard frame (Safari browser mockup style - Light, Professional) */}
      <div className="rounded-2xl border border-slate-200/80 bg-slate-50/90 backdrop-blur-md overflow-hidden">
        {/* Top bar (Light macOS browser chrome) */}
        <div className="flex items-center gap-2 px-4 py-3 border-b border-slate-200/70 bg-slate-100/70">
          <div className="flex gap-1.5 shrink-0">
            <div className="w-2.5 h-2.5 rounded-full bg-red-400/90" />
            <div className="w-2.5 h-2.5 rounded-full bg-amber-400/90" />
            <div className="w-2.5 h-2.5 rounded-full bg-emerald-400/90" />
          </div>
          {/* URL Bar */}
          <div className="flex-1 flex items-center justify-center gap-1.5 py-1.5 px-3 bg-white border border-slate-200/80 rounded-lg max-w-sm mx-auto">
            <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" className="text-teal-600 shrink-0">
              <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
              <path d="M7 11V7a5 5 0 0110 0v4" />
            </svg>
            <span className="text-[10px] font-mono text-slate-500 select-none truncate">
              https://{phase !== "idle" ? displayUrl : "seoboostr.io"}
            </span>
          </div>
          <div className="w-12 shrink-0 md:block hidden" /> {/* Spacer for symmetry */}
        </div>

        {/* Dashboard content */}
        <div className="p-4 sm:p-6 bg-white">
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
              className="text-center text-xs font-mono text-slate-500 mb-5"
            >
              Auditing{" "}
              <span className="text-teal-600 font-bold">{displayUrl}</span>
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
              className="mt-5 p-4 rounded-xl border border-slate-200 bg-slate-50/50"
            >
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                  <p className="text-xs font-bold text-slate-700 flex items-center gap-1.5">
                    <span className="inline-block w-2 h-2 rounded-full bg-teal-500 animate-pulse" />
                    Scan Complete · Overall Score: <span className="font-mono font-bold text-teal-600">{overallScore}/100</span>
                  </p>
                  <p className="text-[10px] text-slate-400 font-mono mt-1">
                    All parallel SEO check modules verified.
                  </p>
                </div>
                <button
                  onClick={() => {
                    window.location.href = "/login";
                  }}
                  className="w-full sm:w-auto px-5 py-2.5 text-xs font-bold text-white bg-teal-600 hover:bg-teal-700 rounded-lg transition-colors cursor-pointer text-center"
                >
                  Login to see the detailed report →
                </button>
              </div>
            </motion.div>
          )}
        </div>
      </div>
    </div>
  );
}
