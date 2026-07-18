"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { signIn, signOut, useSession } from "next-auth/react";
import { MODULES, getScoreColor } from "./moduleData";

interface SignupGateProps {
  visible: boolean;
}

export function SignupGate({ visible: _visible }: SignupGateProps) {
  const { data: session } = useSession();
  const [email, setEmail] = useState("");
  // Deterministic mock data — no Math.random() to avoid hydration mismatches
  const reportModules = MODULES.map((mod, i) => ({
    ...mod,
    score: mod.demoScore,
    issues: [4, 7, 2, 5, 9, 1, 11, 3, 8, 6][i] ?? 3,
  }));

  // Deterministic widths for the placeholder issue bars (no Math.random)
  const barWidths = [
    [72, 85, 64],
    [78, 66, 81],
    [68, 90, 74],
    [83, 61, 77],
    [70, 88, 65],
    [76, 63, 82],
    [87, 71, 69],
    [62, 80, 75],
    [79, 67, 86],
    [73, 84, 60],
  ];

  return (
    <section id="signup" className="relative py-20 sm:py-28 bg-white overflow-hidden">
      {/* Subtle dot-grid background */}
      <div
        className="absolute inset-0 opacity-40 pointer-events-none"
        style={{
          backgroundImage: "radial-gradient(circle at 1px 1px, var(--dot-grid-color) 1px, transparent 0)",
          backgroundSize: "24px 24px",
        }}
      />

      <div className="relative max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Blurred report preview */}
        <div className="relative rounded-2xl border border-slate-900 bg-slate-950 overflow-hidden shadow-2xl">
          {/* Mock report content (blurred) */}
          <div className="blur-[6px] select-none pointer-events-none p-6 sm:p-10">
            {/* Report header */}
            <div className="flex items-center gap-4 mb-8 pb-6 border-b border-slate-800/60">
              <div className="w-16 h-16 rounded-full bg-teal-500/10 flex items-center justify-center">
                <span className="text-2xl font-mono font-black text-teal-400 tabular-nums">87</span>
              </div>
              <div>
                <h3 className="text-lg font-bold text-white">Full SEO Audit Report</h3>
                <p className="text-xs text-slate-400 font-mono tabular-nums">yoursite.com · 15 modules · 47 issues found</p>
              </div>
            </div>

            {/* Module results grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {reportModules.map((mod) => {
                const color = getScoreColor(mod.score);
                return (
                  <div key={mod.id} className="rounded-xl border border-slate-800/60 bg-slate-900/50 p-4">
                    <div className="flex items-center justify-between mb-3">
                      <div className="flex items-center gap-2">
                        <div className="w-6 h-6 rounded bg-slate-800 flex items-center justify-center">
                          <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="text-slate-400" strokeLinecap="round" strokeLinejoin="round">
                            <path d={mod.iconPath} />
                          </svg>
                        </div>
                        <span className="text-sm font-semibold text-white">{mod.name}</span>
                      </div>
                      <span className="font-mono text-sm font-bold tabular-nums" style={{ color }}>
                        {mod.score}
                      </span>
                    </div>
                    <div className="space-y-1.5">
                      {(barWidths[MODULES.indexOf(mod)] ?? [72, 80, 65]).map((w, j) => (
                        <div key={j} className="flex items-center gap-2">
                          <div className="w-1 h-1 rounded-full bg-amber-500/40" />
                          <div className="h-2 bg-slate-800/60 rounded flex-1" style={{ width: `${w}%` }} />
                        </div>
                      ))}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Gate overlay */}
          <div className="absolute inset-0 flex items-center justify-center bg-gradient-to-t from-slate-950/80 via-slate-950/75 to-slate-950/50 backdrop-blur-[2px]">
            <motion.div
              initial={{ opacity: 0, y: 20, scale: 0.95 }}
              whileInView={{ opacity: 1, y: 0, scale: 1 }}
              viewport={{ once: true, margin: "-100px" }}
              transition={{ duration: 0.5 }}
              className="w-full max-w-md mx-4 rounded-2xl border border-slate-200 bg-white p-6 sm:p-8 shadow-2xl"
            >
              {/* Lock icon */}
              <div className="w-12 h-12 rounded-full bg-teal-50 border border-teal-200/60 flex items-center justify-center mx-auto mb-5">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="text-teal-600" strokeLinecap="round" strokeLinejoin="round">
                  <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
                  <path d="M7 11V7a5 5 0 0110 0v4" />
                </svg>
              </div>

              <h3 className="text-xl font-black text-slate-900 text-center mb-2">
                Unlock your full report
              </h3>
              <p className="text-sm text-slate-500 text-center mb-6 leading-relaxed">
                Your audit ran across all 15 modules. Create a free account to see
                every issue, fix priority, and score breakdown.
              </p>

              {/* Google OAuth */}
              <button
                onClick={async () => {
                  if (session?.user?.email === "demo@seoptimised.com") {
                    await signOut({ redirect: false });
                  }
                  signIn("google", { callbackUrl: "/dashboard" });
                }}
                className="w-full flex items-center justify-center gap-3 bg-white hover:bg-slate-50 text-slate-800 font-bold py-3 px-4 rounded-xl border border-slate-200 shadow-sm hover:shadow transition-all cursor-pointer text-sm mb-3"
              >
                <svg width="18" height="18" viewBox="0 0 24 24" className="shrink-0">
                  <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 01-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z" fill="#4285F4" />
                  <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853" />
                  <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05" />
                  <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335" />
                </svg>
                Continue with Google
              </button>

              {/* Divider */}
              <div className="flex items-center gap-3 my-4">
                <div className="flex-1 h-px bg-slate-200" />
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">or</span>
                <div className="flex-1 h-px bg-slate-200" />
              </div>

              {/* Email signup */}
              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  if (email.trim()) {
                    signIn("credentials", { email, callbackUrl: "/dashboard" });
                  }
                }}
                className="space-y-3"
              >
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="you@company.com"
                  className="w-full px-4 py-2.5 text-sm bg-slate-50 border border-slate-200 rounded-xl text-slate-900 placeholder:text-slate-400 focus:outline-none focus:border-teal-500/50 focus:ring-2 focus:ring-teal-500/20 transition-all"
                  aria-label="Email address"
                  id="signup-email-input"
                  required
                />
                <button
                  type="submit"
                  className="w-full py-2.5 text-sm font-bold text-white bg-teal-600 hover:bg-teal-700 rounded-xl transition-colors cursor-pointer"
                >
                  Create Free Account
                </button>
              </form>

              <p className="text-[10px] text-slate-400 text-center mt-4">
                No credit card. No spam. Just your report.
              </p>
            </motion.div>
          </div>
        </div>
      </div>
    </section>
  );
}
