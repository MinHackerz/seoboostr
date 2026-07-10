"use client";

import { useState, useRef, type FormEvent } from "react";
import { motion } from "framer-motion";
import { AuditDashboard, type ScanPhase } from "./AuditDashboard";
import { type ScanResult } from "./moduleData";
import { signIn, useSession } from "next-auth/react";

interface HeroProps {
  scanPhase: ScanPhase;
  scanResults: ScanResult[] | null;
  scanUrl: string;
  onStartScan: (url: string) => void;
}

export function Hero({ scanPhase, scanResults, scanUrl, onStartScan }: HeroProps) {
  const [inputValue, setInputValue] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);
  const { data: session, status } = useSession();
  const isLoggedIn = status === "authenticated";

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
    <section className="relative pt-28 pb-4 sm:pt-32 sm:pb-8 overflow-hidden">
      {/* Subtle background grid */}
      <div
        className="absolute inset-0 opacity-30 pointer-events-none"
        style={{
          backgroundImage: "radial-gradient(circle at 1px 1px, var(--dot-grid-hero) 1px, transparent 0)",
          backgroundSize: "32px 32px",
        }}
      />

      <div className="relative max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Text */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="text-center mb-8 sm:mb-10"
        >
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-black tracking-tight text-slate-900 leading-[1.1] mb-4">
            Every SEO issue on your site.
            <br />
            <span className="text-teal-600">In parallel. In seconds.</span>
          </h1>
          <p className="text-base sm:text-lg text-slate-500 max-w-xl mx-auto leading-relaxed">
            15 audit modules run simultaneously. You get one clean, scored report.
            <br className="hidden sm:block" />
            No signup required to start.
          </p>
        </motion.div>

        {/* URL Input */}
        <motion.form
          onSubmit={handleSubmit}
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.15 }}
          className="max-w-2xl mx-auto mb-8 sm:mb-10"
        >
          <div className="flex items-center gap-2 p-1.5 rounded-xl bg-white border border-slate-200 focus-within:border-teal-500/50 focus-within:ring-2 focus-within:ring-teal-500/20 transition-all">
            {/* URL icon */}
            <div className="pl-3 text-slate-400">
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
              className="flex-1 bg-transparent text-sm sm:text-base text-slate-900 placeholder:text-slate-400 focus:outline-none py-2.5 font-medium disabled:opacity-50"
              aria-label="Website URL"
              id="hero-url-input"
            />
            <button
              type="submit"
              disabled={scanPhase === "scanning"}
              className="shrink-0 px-5 py-2.5 text-sm font-bold text-white bg-teal-600 hover:bg-teal-700 disabled:opacity-60 rounded-lg transition-colors cursor-pointer disabled:cursor-not-allowed"
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
          <p className="text-xs text-slate-400 text-center mt-3 font-medium flex flex-wrap items-center justify-center gap-2">
            <span>Try it:</span>
            <button type="button" onClick={() => { setInputValue("example.com"); }} className="text-teal-600 hover:underline cursor-pointer">example.com</button>
            <span>·</span>
            <button type="button" onClick={() => { setInputValue("mysite.dev"); }} className="text-teal-600 hover:underline cursor-pointer">mysite.dev</button>
            <span>·</span>
            <button type="button" onClick={() => { setInputValue("startup.io"); }} className="text-teal-600 hover:underline cursor-pointer">startup.io</button>
            {isLoggedIn && (
              <>
                <span className="mx-1 text-slate-200">|</span>
                <a href="/dashboard" className="text-teal-600 font-bold hover:underline cursor-pointer flex items-center gap-1">
                  Go to Dashboard →
                </a>
              </>
            )}
            <span className="mx-1 text-slate-200 hidden sm:inline">|</span>
            <button
              type="button"
                onClick={() => signIn("credentials", { email: "demo@seoboostr.io", callbackUrl: "/dashboard" })}
                className="text-teal-600 hover:text-teal-700 font-semibold hover:underline flex items-center gap-0.5 cursor-pointer"
              >
                Launch Demo Mode →
              </button>
          </p>
        </motion.form>

        {/* Dashboard Visual */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.3 }}
        >
          <AuditDashboard phase={scanPhase} scanResults={scanResults} url={scanUrl} />
        </motion.div>
      </div>
    </section>
  );
}
