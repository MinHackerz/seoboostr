"use client";

import { useState, useRef, useEffect, type FormEvent } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { AuditDashboard, type ScanPhase } from "./AuditDashboard";
import { IPadMockup } from "./IPadMockup";
import { type ScanResult } from "./moduleData";
import { signIn, useSession } from "next-auth/react";

interface HeroProps {
  scanPhase: ScanPhase;
  scanResults: ScanResult[] | null;
  scanUrl: string;
  onStartScan: (url: string) => void;
  onClearScan?: () => void;
}

export function Hero({ scanPhase, scanResults, scanUrl, onStartScan, onClearScan }: HeroProps) {
  const [inputValue, setInputValue] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);
  const { data: session, status } = useSession();
  const isLoggedIn = status === "authenticated" && session?.user?.email !== "demo@seoptimised.com";
  const [mode, setMode] = useState<"SEO" | "GEO">("SEO");

  useEffect(() => {
    const timer = setInterval(() => {
      setMode((prev) => (prev === "SEO" ? "GEO" : "SEO"));
    }, 3000);
    return () => clearInterval(timer);
  }, []);

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    const url = inputValue.trim();
    if (!url) {
      inputRef.current?.focus();
      return;
    }
    onStartScan(url);
  };

  return (
    <section className="relative pt-28 pb-12 sm:pt-36 sm:pb-16 overflow-hidden">
      {/* ── Dynamic Luminous Aurora Mesh Background ── */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {/* Animated Aurora Glow Orbs using Framer Motion so they visibly move across the dark canvas */}
        <motion.div
          animate={{
            x: [0, 80, -40, 0],
            y: [0, -50, 60, 0],
            scale: [1, 1.2, 0.9, 1],
          }}
          transition={{ duration: 16, repeat: Infinity, ease: "easeInOut" }}
          className="absolute -top-20 left-[10%] w-[500px] h-[500px] rounded-full bg-gradient-to-tr from-teal-500/35 via-cyan-500/20 to-transparent blur-[100px]"
        />
        <motion.div
          animate={{
            x: [0, -90, 50, 0],
            y: [0, 70, -40, 0],
            scale: [1, 1.15, 0.85, 1],
          }}
          transition={{ duration: 20, repeat: Infinity, ease: "easeInOut" }}
          className="absolute top-10 right-[15%] w-[600px] h-[600px] rounded-full bg-gradient-to-br from-indigo-500/35 via-purple-500/25 to-transparent blur-[120px]"
        />
        <motion.div
          animate={{
            x: [0, 60, -70, 0],
            y: [0, -60, 40, 0],
          }}
          transition={{ duration: 18, repeat: Infinity, ease: "easeInOut" }}
          className="absolute bottom-10 left-[35%] w-[450px] h-[450px] rounded-full bg-gradient-to-t from-emerald-500/30 via-teal-500/20 to-transparent blur-[90px]"
        />
      </div>

      {/* ── Cyber Matrix Dot Grid Overlay with Glow ── */}
      <div
        className="absolute inset-0 opacity-25 pointer-events-none"
        style={{
          backgroundImage: "radial-gradient(rgba(255, 255, 255, 0.08) 1px, transparent 1px)",
          backgroundSize: "24px 24px",
          maskImage: "radial-gradient(ellipse 80% 60% at 50% 30%, black 40%, transparent 100%)",
          WebkitMaskImage: "radial-gradient(ellipse 80% 60% at 50% 30%, black 40%, transparent 100%)",
        }}
      />

      {/* ── Subtle Top Border Glow Beam ── */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-3/4 h-px bg-gradient-to-r from-transparent via-teal-500/50 to-transparent pointer-events-none" />

      <div className="relative max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* ── Text ── */}
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-8 sm:mb-10"
        >
          <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-black tracking-tight leading-[1.1] mb-5 text-white flex flex-col md:block">
            <span className="inline-flex items-center justify-center flex-wrap gap-x-2 sm:gap-x-3">
              <span>Every</span>
              <span className="relative inline-flex h-[1.1em] w-[85px] sm:w-[110px] md:w-[130px] lg:w-[150px] items-center justify-center overflow-hidden">
                <AnimatePresence mode="wait">
                  <motion.span
                    key={mode}
                    initial={{ y: 25, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    exit={{ y: -25, opacity: 0 }}
                    transition={{ duration: 0.35, ease: "easeOut" }}
                    className="absolute gradient-text font-black"
                  >
                    {mode}
                  </motion.span>
                </AnimatePresence>
              </span>
              <span>issue on your site.</span>
            </span>
            <br />
            <span className="gradient-text font-black block sm:inline mt-2 sm:mt-0">In parallel. In seconds.</span>
          </h1>
          <p className="text-base sm:text-lg text-slate-300 max-w-xl mx-auto leading-relaxed">
            15 audit modules run simultaneously. You get one clean, scored report.
            <br className="hidden sm:block" />
            No signup required to start.
          </p>
        </motion.div>

        {/* ── URL Input — Glassmorphism ── */}
        <motion.form
          onSubmit={handleSubmit}
          initial={{ opacity: 0, y: 18 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.15 }}
          className="max-w-2xl mx-auto mb-6 sm:mb-8"
        >
          <div className="flex items-center gap-2 p-1.5 rounded-2xl bg-white/10 backdrop-blur-2xl border border-white/20 focus-within:border-teal-400 focus-within:shadow-[0_0_35px_rgba(20,184,166,0.25)] transition-all duration-300 shadow-xl">
            {/* URL icon */}
            <div className="pl-3.5 text-teal-400">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="12" cy="12" r="10" />
                <line x1="2" y1="12" x2="22" y2="12" />
                <path d="M12 2a15.3 15.3 0 014 10 15.3 15.3 0 01-4 10 15.3 15.3 0 01-4-10 15.3 15.3 0 014-10z" />
              </svg>
            </div>
            <input
              ref={inputRef}
              type="text"
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              placeholder="Enter your website URL…"
              disabled={scanPhase === "scanning"}
              className="flex-1 bg-transparent text-sm sm:text-base text-white placeholder:text-slate-400 focus:outline-none py-3 font-medium disabled:opacity-50"
              aria-label="Website URL"
              id="hero-url-input"
            />
            <button
              type="submit"
              disabled={scanPhase === "scanning"}
              className="shrink-0 px-6 py-3 text-sm font-bold text-white bg-gradient-to-r from-teal-500 to-teal-600 hover:from-teal-400 hover:to-teal-500 disabled:opacity-60 rounded-xl transition-all duration-200 cursor-pointer disabled:cursor-not-allowed shadow-lg shadow-teal-500/30 hover:shadow-teal-500/40 hover:-translate-y-0.5 active:translate-y-0"
            >
              {scanPhase === "scanning" ? (
                <span className="flex items-center gap-2">
                  <motion.span
                    className="w-3.5 h-3.5 border-2 border-white/40 border-t-white rounded-full inline-block"
                    animate={{ rotate: 360 }}
                    transition={{ duration: 0.8, repeat: Infinity, ease: "linear" }}
                  />
                  Scanning…
                </span>
              ) : (
                "Run Free Audit"
              )}
            </button>
          </div>
        </motion.form>

        {/* ── Trust Badges + Quick Links ── */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.35 }}
          className="flex flex-wrap items-center justify-center gap-x-5 gap-y-2 mb-8 sm:mb-10"
        >
          {/* Trust badges */}
          <span className="flex items-center gap-1.5 text-xs text-slate-400 font-medium">
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" className="text-teal-400" strokeLinecap="round"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" /><polyline points="22 4 12 14.01 9 11.01" /></svg>
            No signup required
          </span>
          <span className="text-slate-700">·</span>
          <span className="flex items-center gap-1.5 text-xs text-slate-400 font-medium">
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" className="text-teal-400" strokeLinecap="round"><path d="M4 6h16M4 12h16M4 18h16" /></svg>
            15 modules
          </span>
          <span className="text-slate-700">·</span>
          <span className="flex items-center gap-1.5 text-xs text-slate-400 font-medium">
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" className="text-teal-400" strokeLinecap="round"><path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z" /></svg>
            Results in seconds
          </span>

          {/* Quick links */}
          <span className="text-slate-700 hidden sm:inline">|</span>
          <span className="flex items-center gap-2 text-xs font-medium">
            <span className="text-slate-400">Try:</span>
            <button type="button" onClick={() => setInputValue("example.com")} className="text-teal-400 hover:text-teal-300 hover:underline cursor-pointer transition-colors">example.com</button>
            <span className="text-slate-700">·</span>
            <button type="button" onClick={() => setInputValue("mysite.dev")} className="text-teal-400 hover:text-teal-300 hover:underline cursor-pointer transition-colors">mysite.dev</button>
          </span>

          {isLoggedIn && (
            <>
              <span className="text-slate-700">|</span>
              <a href="/dashboard" className="text-teal-400 font-bold hover:text-teal-300 hover:underline cursor-pointer text-xs flex items-center gap-1 transition-colors">
                Go to Dashboard →
              </a>
            </>
          )}
          <span className="text-slate-700">|</span>
          <button
            type="button"
            onClick={() => signIn("credentials", { email: "demo@seoptimised.com", callbackUrl: "/dashboard" })}
            className="text-teal-400 hover:text-teal-300 font-semibold hover:underline flex items-center gap-0.5 cursor-pointer text-xs transition-colors"
          >
            Launch Demo Mode →
          </button>
        </motion.div>

        {/* ── Dashboard Visual (Dark macOS Glass Window wrapped in iPad 3D Mockup) ── */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.3 }}
        >
          <IPadMockup>
            <AuditDashboard phase={scanPhase} scanResults={scanResults} url={scanUrl} onClearScan={onClearScan} />
          </IPadMockup>
        </motion.div>
      </div>
    </section>
  );
}
