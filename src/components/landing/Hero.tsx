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

const MODES = ["SEO", "GEO", "SXO", "UX", "Core"] as const;

const BACKGROUND_PARTICLES = [
  { id: 1, size: 6, x: "15%", y: "25%", duration: 14, delay: 0 },
  { id: 2, size: 10, x: "75%", y: "15%", duration: 18, delay: 1 },
  { id: 3, size: 8, x: "45%", y: "45%", duration: 16, delay: 0.5 },
  { id: 4, size: 5, x: "85%", y: "60%", duration: 12, delay: 2 },
  { id: 5, size: 12, x: "20%", y: "75%", duration: 22, delay: 3 },
  { id: 6, size: 7, x: "65%", y: "80%", duration: 15, delay: 1.5 },
  { id: 7, size: 9, x: "10%", y: "50%", duration: 19, delay: 2.5 },
  { id: 8, size: 4, x: "90%", y: "30%", duration: 10, delay: 0.2 },
  { id: 9, size: 11, x: "35%", y: "10%", duration: 20, delay: 4 },
  { id: 10, size: 6, x: "55%", y: "70%", duration: 13, delay: 0.8 },
];

export function Hero({ scanPhase, scanResults, scanUrl, onStartScan, onClearScan }: HeroProps) {
  const [inputValue, setInputValue] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const typingIntervalRef = useRef<NodeJS.Timeout | null>(null);
  const { data: session, status } = useSession();
  const isLoggedIn = status === "authenticated" && session?.user?.email !== "demo@seoptimised.com";
  const [modeIndex, setModeIndex] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setModeIndex((prev) => (prev + 1) % MODES.length);
    }, 3000);
    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    if (scanPhase === "idle") {
      setInputValue("");
    }
  }, [scanPhase]);

  useEffect(() => {
    return () => {
      if (typingIntervalRef.current) {
        clearInterval(typingIntervalRef.current);
      }
    };
  }, []);

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    if (isTyping) return;
    const url = inputValue.trim();
    if (!url) {
      inputRef.current?.focus();
      return;
    }
    onStartScan(url);
  };

  const simulateTyping = (targetText: string) => {
    if (scanPhase === "scanning" || isTyping) return;
    setIsTyping(true);
    setInputValue("");
    let current = "";
    let i = 0;
    
    inputRef.current?.focus();

    if (typingIntervalRef.current) {
      clearInterval(typingIntervalRef.current);
    }

    typingIntervalRef.current = setInterval(() => {
      if (i < targetText.length) {
        current += targetText[i];
        setInputValue(current);
        i++;
      } else {
        if (typingIntervalRef.current) {
          clearInterval(typingIntervalRef.current);
          typingIntervalRef.current = null;
        }
        setIsTyping(false);
      }
    }, 45);
  };

  return (
    <section className="relative pt-28 pb-12 sm:pt-36 sm:pb-16 overflow-hidden">
      {/* ── Dynamic Luminous Aurora Mesh Background ── */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {/* Animated Aurora Glow Orbs using Framer Motion so they visibly move across the dark canvas */}
        <motion.div
          animate={scanPhase === "scanning" ? {
            x: [0, 100, -60, 0],
            y: [0, -70, 80, 0],
            scale: [1, 1.4, 0.8, 1],
            opacity: [0.8, 1, 0.9, 0.8],
          } : {
            x: [0, 80, -40, 0],
            y: [0, -50, 60, 0],
            scale: [1, 1.2, 0.9, 1],
            opacity: [0.7, 0.8, 0.7, 0.7],
          }}
          transition={{ duration: scanPhase === "scanning" ? 6 : 16, repeat: Infinity, ease: "easeInOut" }}
          className="absolute -top-20 left-[10%] w-[500px] h-[500px] rounded-full bg-gradient-to-tr from-teal-500/35 via-cyan-500/20 to-transparent blur-[100px]"
        />
        <motion.div
          animate={scanPhase === "scanning" ? {
            x: [0, -110, 70, 0],
            y: [0, 90, -50, 0],
            scale: [1, 1.3, 0.75, 1],
            opacity: [0.7, 0.9, 0.8, 0.7],
          } : {
            x: [0, -90, 50, 0],
            y: [0, 70, -40, 0],
            scale: [1, 1.15, 0.85, 1],
            opacity: [0.6, 0.7, 0.6, 0.6],
          }}
          transition={{ duration: scanPhase === "scanning" ? 8 : 20, repeat: Infinity, ease: "easeInOut" }}
          className="absolute top-10 right-[15%] w-[600px] h-[600px] rounded-full bg-gradient-to-br from-indigo-500/35 via-purple-500/25 to-transparent blur-[120px]"
        />
        <motion.div
          animate={scanPhase === "scanning" ? {
            x: [0, 80, -90, 0],
            y: [0, -80, 50, 0],
            scale: [1, 1.25, 0.8, 1],
          } : {
            x: [0, 60, -70, 0],
            y: [0, -60, 40, 0],
          }}
          transition={{ duration: scanPhase === "scanning" ? 7 : 18, repeat: Infinity, ease: "easeInOut" }}
          className="absolute bottom-10 left-[35%] w-[450px] h-[450px] rounded-full bg-gradient-to-t from-emerald-500/30 via-teal-500/20 to-transparent blur-[90px]"
        />

        {/* Ambient Floating Particles */}
        {BACKGROUND_PARTICLES.map((p) => (
          <motion.div
            key={p.id}
            className="absolute rounded-full bg-teal-400/20 backdrop-blur-md"
            style={{
              width: p.size,
              height: p.size,
              left: p.x,
              top: p.y,
            }}
            animate={
              scanPhase === "scanning"
                ? {
                    x: [0, 45, -45, 25, 0],
                    y: [0, -45, 45, -25, 0],
                    scale: [1, 1.4, 0.7, 1.2, 1],
                    opacity: [0.2, 0.6, 0.3, 0.7, 0.2],
                  }
                : {
                    x: [0, 30, -30, 0],
                    y: [0, -30, 30, 0],
                    scale: [1, 1.2, 0.8, 1],
                    opacity: [0.15, 0.4, 0.2, 0.15],
                  }
            }
            transition={{
              duration: scanPhase === "scanning" ? p.duration * 0.4 : p.duration,
              repeat: Infinity,
              ease: "easeInOut",
              delay: p.delay,
            }}
          />
        ))}
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
          animate={{ 
            opacity: scanPhase === "scanning" ? 0.65 : 1, 
            y: 0 
          }}
          transition={{ duration: 0.6 }}
          className="text-center mb-8 sm:mb-10 transition-opacity duration-500"
        >
          <h1 
            style={{ textWrap: "balance" }}
            className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-black tracking-tight leading-[1.1] mb-5 text-white flex flex-col md:block"
          >
            <span className="inline-flex items-center justify-center flex-wrap gap-x-2 sm:gap-x-3">
              <span>Every</span>
              <span className="relative inline-flex h-[1.1em] w-[90px] sm:w-[120px] md:w-[145px] lg:w-[175px] items-center justify-center overflow-hidden">
                <AnimatePresence mode="wait">
                  <motion.span
                    key={MODES[modeIndex]}
                    initial={{ y: 15, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    exit={{ y: -15, opacity: 0 }}
                    transition={{ duration: 0.25, ease: "easeOut" }}
                    className="absolute gradient-text font-black"
                  >
                    {MODES[modeIndex]}
                  </motion.span>
                </AnimatePresence>
              </span>
              <span>issue on your site.</span>
            </span>
            <br />
            <span className="gradient-text font-black block sm:inline mt-2 sm:mt-0">In parallel. In seconds.</span>
          </h1>
          <p 
            style={{ textWrap: "balance" }}
            className="text-base sm:text-lg text-slate-300 max-w-xl mx-auto leading-relaxed"
          >
            18 audit modules run simultaneously. You get one clean, scored report.
            <br className="hidden sm:block" />
            No signup required to start.
          </p>
        </motion.div>

        {/* ── URL Input — Glassmorphism ── */}
        <motion.form
          onSubmit={handleSubmit}
          initial={{ opacity: 0, y: 18 }}
          animate={{ 
            opacity: scanPhase === "scanning" ? 0.8 : 1, 
            y: 0 
          }}
          transition={{ duration: 0.6, delay: 0.15 }}
          className="max-w-2xl mx-auto mb-6 sm:mb-8 transition-opacity duration-500"
        >
          <div className={`flex items-center gap-2 p-1.5 rounded-2xl bg-white/10 backdrop-blur-2xl border transition-all duration-500 shadow-xl ${
            scanPhase === "scanning" 
              ? "border-teal-500/40 shadow-[0_0_50px_rgba(20,184,166,0.3)] animate-pulse" 
              : "border-white/20 focus-within:border-teal-400 focus-within:shadow-[0_0_35px_rgba(20,184,166,0.25)]"
          }`}>
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
              disabled={scanPhase === "scanning" || isTyping}
              className="flex-1 bg-transparent text-sm sm:text-base text-white placeholder:text-slate-400 focus:outline-none py-3 font-medium disabled:opacity-50"
              aria-label="Website URL"
              id="hero-url-input"
            />
            <button
              type="submit"
              disabled={scanPhase === "scanning" || isTyping}
              className="shrink-0 px-6 py-3 text-sm font-bold text-white bg-gradient-to-r from-teal-500 via-teal-600 to-indigo-600 bg-[length:200%_auto] hover:animate-ai-shimmer disabled:opacity-60 rounded-xl transition-all duration-300 cursor-pointer disabled:cursor-not-allowed shadow-lg shadow-teal-500/30 hover:shadow-indigo-500/40 hover:-translate-y-0.5 active:translate-y-0 flex items-center justify-center min-w-[130px]"
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
            18 modules
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
            <button 
              type="button" 
              onClick={() => simulateTyping("example.com")} 
              disabled={scanPhase === "scanning" || isTyping}
              className="text-teal-400 hover:text-teal-300 hover:underline cursor-pointer transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              example.com
            </button>
            <span className="text-slate-700">·</span>
            <button 
              type="button" 
              onClick={() => simulateTyping("mysite.dev")} 
              disabled={scanPhase === "scanning" || isTyping}
              className="text-teal-400 hover:text-teal-300 hover:underline cursor-pointer transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              mysite.dev
            </button>
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

        {/* ── Scroll Indicator ── */}
        <AnimatePresence>
          {scanPhase === "idle" && (
            <motion.div
              initial={{ opacity: 0, y: -6 }}
              animate={{ opacity: 0.5, y: 0 }}
              exit={{ opacity: 0, y: 6 }}
              transition={{ 
                opacity: { duration: 0.3 },
                y: { repeat: Infinity, duration: 1.5, ease: "easeInOut", repeatType: "reverse" }
              }}
              className="hidden sm:flex flex-col items-center gap-1 mt-2 mb-10 text-slate-500 text-[10px] font-bold tracking-wider uppercase select-none cursor-pointer hover:text-slate-300 transition-colors"
              onClick={() => {
                const element = document.querySelector(".iPad-mockup-wrapper");
                element?.scrollIntoView({ behavior: "smooth", block: "center" });
              }}
            >
              <span>Scroll to Explore Report</span>
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="text-teal-400">
                <polyline points="6 9 12 15 18 9" />
              </svg>
            </motion.div>
          )}
        </AnimatePresence>

        {/* ── Dashboard Visual (Dark macOS Glass Window wrapped in iPad 3D Mockup) ── */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.3 }}
          className="iPad-mockup-wrapper"
        >
          <IPadMockup>
            <AuditDashboard phase={scanPhase} scanResults={scanResults} url={scanUrl} onClearScan={onClearScan} />
          </IPadMockup>
        </motion.div>
      </div>
    </section>
  );
}
