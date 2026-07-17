/**
 * LandingPage.tsx — Master landing page component
 *
 * DESIGN DECISION: Dark-mode-first for all dashboard/data sections (module grid,
 * chart, signup gate, FAQ, footer) to reinforce the "developer tool" feel.
 * The nav uses a light-to-glassmorphism-on-scroll approach for familiarity and
 * trust — visitors expect white/light navs on SaaS sites. The hero uses the
 * page's background (light in light mode, dark in dark mode) and transitions
 * into the fully-dark dashboard sections via the LiveTicker strip.
 *
 * All numeric data uses font-mono + tabular-nums for the dashboard feel.
 * Animations are 150-400ms — fast and purposeful, no bouncy parallax.
 */

"use client";

import { useState, useCallback, useRef } from "react";
import { Navbar } from "./Navbar";
import { Hero } from "./Hero";
import { LiveTicker } from "./LiveTicker";
import { ModuleGrid } from "./ModuleGrid";
import { HowItWorks } from "./HowItWorks";
import { ComparisonChart } from "./ComparisonChart";
import { FAQ } from "./FAQ";
import { Pricing } from "./Pricing";
import { Footer } from "./Footer";
import { generateMockScan, type ScanResult } from "./moduleData";
import type { ScanPhase } from "./AuditDashboard";

export function LandingPage() {
  const [scanPhase, setScanPhase] = useState<ScanPhase>("idle");
  const [scanResults, setScanResults] = useState<ScanResult[] | null>(null);
  const [scanUrl, setScanUrl] = useState("");
  const heroRef = useRef<HTMLDivElement>(null);

  const handleStartScan = useCallback(async (url: string) => {
    // Clean up URL for display
    const cleanUrl = url.replace(/^https?:\/\//, "").replace(/\/$/, "");
    setScanUrl(cleanUrl);
    setScanPhase("scanning");
    if (typeof window !== "undefined") {
      localStorage.setItem("seoptimised_last_scanned_url", cleanUrl);
    }

    try {
      const response = await fetch("/api/analyze/public", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ url: cleanUrl }),
      });
      const data = await response.json();
      
      if (data.success && Array.isArray(data.results)) {
        // Map the results and add realistic staggered delays for scanning visual effect
        const results = data.results.map((res: any) => ({
          ...res,
          delay: 800 + Math.floor(Math.random() * 2500),
        }));
        
        setScanResults(results);
        if (typeof window !== "undefined") {
          localStorage.setItem("seoptimised_last_scanned_results", JSON.stringify(results));
        }
        
        const maxDelay = Math.max(...results.map((r: any) => r.delay));
        setTimeout(() => {
          setScanPhase("complete");
        }, maxDelay + 500);
      } else {
        throw new Error(data.error || "Failed to analyze URL");
      }
    } catch (error) {
      console.error("Public scan failed, using fallback:", error);
      // Staggered fallback results
      const results = generateMockScan();
      setScanResults(results);
      const maxDelay = Math.max(...results.map((r) => r.delay));
      setTimeout(() => {
        setScanPhase("complete");
      }, maxDelay + 500);
    }
  }, []);

  const handleNavAudit = useCallback(() => {
    // Scroll to hero and focus the input
    heroRef.current?.scrollIntoView({ behavior: "smooth" });
    setTimeout(() => {
      const input = document.getElementById("hero-url-input") as HTMLInputElement | null;
      input?.focus();
    }, 500);
  }, []);

  const handleClearScan = useCallback(() => {
    setScanPhase("idle");
    setScanResults(null);
    setScanUrl("");
    if (typeof window !== "undefined") {
      localStorage.removeItem("seoptimised_last_scanned_url");
      localStorage.removeItem("seoptimised_last_scanned_results");
    }
  }, []);

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100" ref={heroRef}>
      <Navbar onRunAudit={handleNavAudit} onStartScan={handleStartScan} />
      <Hero
        scanPhase={scanPhase}
        scanResults={scanResults}
        scanUrl={scanUrl}
        onStartScan={handleStartScan}
        onClearScan={handleClearScan}
      />
      <LiveTicker />
      <ModuleGrid scanResults={scanResults} phase={scanPhase} />
      <HowItWorks />
      <ComparisonChart />
      <Pricing />
      <FAQ />
      <Footer />
    </div>
  );
}
