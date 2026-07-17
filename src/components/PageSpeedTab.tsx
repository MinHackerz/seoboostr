"use client";

import { useState, useCallback } from "react";
import { ScoreGauge } from "./ScoreGauge";
import { IssueList } from "./IssueCard";
import { HugeiconsIcon } from "@hugeicons/react";
import {
  Alert01Icon,
  FlashIcon,
  Refresh01Icon,
  CheckmarkCircle02Icon,
  InformationCircleIcon,
} from "@hugeicons/core-free-icons";
import type { Issue, ModuleResult } from "@/lib/analysis/types";

interface PageSpeedMetric {
  title: string;
  displayValue: string;
  score: number | null;
}

interface PageSpeedData {
  scores: {
    performance: number;
    accessibility: number;
    bestPractices: number;
    seo: number;
  };
  metrics: {
    fcp: PageSpeedMetric;
    lcp: PageSpeedMetric;
    tbt: PageSpeedMetric;
    cls: PageSpeedMetric;
    speedIndex: PageSpeedMetric;
    tti: PageSpeedMetric;
  };
}

interface PageSpeedModuleData {
  mobile: PageSpeedData;
  desktop: PageSpeedData;
}

export interface PageSpeedResult {
  module: "pagespeed";
  status: "completed" | "failed" | "pending";
  score: number;
  data: PageSpeedModuleData;
  issues: Issue[];
  executionTimeMs: number;
}

interface PageSpeedTabProps {
  analysisId: string;
  websiteUrl: string;
  initialResult?: ModuleResult;
  onUpdateAnalysis: (updatedModule: ModuleResult) => void;
}

export function PageSpeedTab({
  analysisId,
  websiteUrl,
  initialResult,
  onUpdateAnalysis,
}: PageSpeedTabProps) {
  const [strategy, setStrategy] = useState<"mobile" | "desktop">("mobile");
  const [copied, setCopied] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [missingApiKey, setMissingApiKey] = useState(false);

  const runAudit = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    setMissingApiKey(false);

    try {
      const res = await fetch("/api/pagespeed", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ analysisId }),
      });

      const data = await res.json();

      if (!res.ok) {
        if (data.code === "MISSING_API_KEY") {
          setMissingApiKey(true);
        }
        throw new Error(data.error || "Failed to fetch PageSpeed insights");
      }

      onUpdateAnalysis(data);
    } catch (err) {
      console.error(err);
      setError(err instanceof Error ? err.message : "Something went wrong running PageSpeed");
    } finally {
      setIsLoading(false);
    }
  }, [analysisId, onUpdateAnalysis]);

  // 1. Missing API Key Setup Screen
  if (missingApiKey) {
    return (
      <div className="bg-card border border-border rounded-2xl p-8 max-w-2xl mx-auto animate-fade-in">
        <div className="flex items-center gap-3 border-b border-slate-100 pb-4 mb-6">
          <div className="w-10 h-10 rounded-xl bg-amber-50 border border-amber-100 flex items-center justify-center text-amber-600">
            <HugeiconsIcon icon={Alert01Icon} size={22} />
          </div>
          <div>
            <h3 className="text-base font-bold text-slate-800">PageSpeed API Key Required</h3>
            <p className="text-xs text-slate-400 font-semibold">Integrate Google PageSpeed Insights API Key</p>
          </div>
        </div>

        <div className="space-y-4 text-sm text-slate-600">
          <p className="leading-relaxed">
            Google PageSpeed Insights requires an API Key to run performance and Lighthouse audits programmatically. Follow these steps to configure it:
          </p>

          <ol className="list-decimal pl-5 space-y-2.5 font-medium text-slate-700">
            <li>
              Go to the{" "}
              <a
                href="https://developers.google.com/speed/docs/insights/v5/get-started"
                target="_blank"
                rel="noopener noreferrer"
                className="text-accent hover:underline font-bold"
              >
                Google PageSpeed Insights Get Started Page
              </a>
              .
            </li>
            <li>Click the **Get a Key** button.</li>
            <li>Create or select a project and copy your generated API Key.</li>
            <li>
              Open the <code className="px-1.5 py-0.5 bg-slate-100 rounded text-rose-600 font-mono text-xs">.env</code> file in the root of your project directory.
            </li>
            <li>
              Add the key as follows:
              <pre className="mt-2 p-3 bg-slate-900 text-slate-100 rounded-xl font-mono text-xs whitespace-pre-wrap select-all">
                PAGESPEED_API_KEY=&quot;your_copied_api_key_here&quot;
              </pre>
            </li>
            <li>Restart your development server to apply the environment changes.</li>
          </ol>

          <div className="pt-4 border-t border-slate-100 flex justify-end">
            <button
              onClick={runAudit}
              className="px-4 py-2 bg-accent hover:bg-accent-hover text-white text-xs font-bold rounded-xl transition-all cursor-pointer flex items-center gap-1.5"
            >
              <HugeiconsIcon icon={Refresh01Icon} size={14} />
              <span>Retry Audit</span>
            </button>
          </div>
        </div>
      </div>
    );
  }

  // 2. Loading State
  if (isLoading) {
    return (
      <div className="bg-card border border-border rounded-2xl p-12 text-center max-w-xl mx-auto animate-pulse-soft">
        <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-accent/10 text-accent mb-4 border border-accent/20">
          <svg className="animate-spin w-6 h-6" viewBox="0 0 24 24" fill="none">
            <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="3" className="opacity-20" />
            <path d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" fill="currentColor" />
          </svg>
        </div>
        <h3 className="text-lg font-bold text-slate-800 mb-1">Running Google PageSpeed Audit...</h3>
        <p className="text-slate-500 text-sm max-w-xs mx-auto mb-2 font-semibold">
          This takes about 10-20 seconds. Google is generating mobile and desktop Lighthouse reports in parallel.
        </p>
        <span className="text-[10px] text-slate-400 bg-slate-100 border border-slate-200/50 px-2 py-1 rounded-full font-mono">
          URL: {websiteUrl}
        </span>
      </div>
    );
  }

  // 3. No Result / Entry State
  if (!initialResult) {
    return (
      <div className="text-center py-16 bg-card border border-border rounded-2xl flex flex-col items-center max-w-xl mx-auto">
        <div className="w-16 h-16 rounded-2xl bg-accent/5 border border-accent/10 flex items-center justify-center mb-4 text-accent">
          <HugeiconsIcon icon={FlashIcon} size={28} />
        </div>
        <h3 className="text-lg font-bold text-slate-800 mb-1">PageSpeed Insights Audit</h3>
        <p className="text-sm text-slate-500 max-w-xs mx-auto mb-6 font-semibold leading-relaxed">
          Google PageSpeed Insights measures Core Web Vitals, performance scores, accessibility, and best practices.
        </p>
        
        {error && (
          <div className="w-full mb-5 text-xs text-rose-600 bg-rose-50 border border-rose-100 rounded-xl px-4 py-3 font-semibold text-left flex items-start gap-2 max-w-md">
            <HugeiconsIcon icon={Alert01Icon} size={15} className="shrink-0 mt-0.5 text-rose-500" />
            <span>{error}</span>
          </div>
        )}

        <button
          onClick={runAudit}
          className="px-6 py-3 bg-accent hover:bg-accent-hover text-white font-bold rounded-xl text-sm transition-all cursor-pointer flex items-center gap-2"
        >
          <HugeiconsIcon icon={FlashIcon} size={16} />
          <span>Run PageSpeed Insights Audit</span>
        </button>
      </div>
    );
  }

  // 4. Completed Result View
  const moduleData = initialResult.data as unknown as PageSpeedModuleData;
  const speedData = moduleData[strategy];
  const scores = speedData.scores;
  const metrics = speedData.metrics;

  const handleCopyMetrics = async () => {
    const header = `# SEO Optimized Audit - Google PageSpeed Insights (${strategy.toUpperCase()})\n` +
      `**Target Website**: ${websiteUrl}\n\n` +
      `Below is a summary of the Core Web Vitals and Lighthouse metrics. Paste this into your AI-powered IDE to prompt optimization changes.\n\n` +
      `## Category Scores\n` +
      `- **Performance**: ${scores.performance}/100\n` +
      `- **Accessibility**: ${scores.accessibility}/100\n` +
      `- **Best Practices**: ${scores.bestPractices}/100\n` +
      `- **SEO**: ${scores.seo}/100\n\n` +
      `## Detailed Metrics\n`;

    const getMetricStatus = (score: number | null) => {
      if (score === null) return "N/A";
      if (score >= 0.9) return "GOOD";
      if (score >= 0.5) return "NEEDS IMPROVEMENT";
      return "POOR";
    };

    const getMetricAdvice = (key: string) => {
      const advice: Record<string, string> = {
        fcp: "Minimize render-blocking CSS and JS resources, use critical path inline CSS, compress text resources, and leverage browser caching.",
        lcp: "Optimize images (proper sizing, modern formats like WebP/Avif), defer non-critical JS/CSS, implement preload for critical assets, and improve TTFB (Time to First Byte).",
        tbt: "Reduce JavaScript execution, break up long tasks (>50ms) into micro-tasks, optimize Web Workers, and defer or eliminate unused scripts.",
        cls: "Ensure images and video elements have explicit width and height dimensions, reserve layout slots for dynamic content/ads, and avoid layout shifts using CSS aspect-ratio properties.",
        speedIndex: "Optimize delivery order of critical rendering path resources, lazy load images and media, and optimize bundle sizes.",
        tti: "Minimize main thread work by deferring third-party scripts, lazy-loading offscreen modules, and splitting main JavaScript bundles."
      };
      return advice[key] || "Optimize related assets and code delivery.";
    };

    const formattedMetrics = Object.entries(metrics).map(([key, value]) => {
      const m = value as any;
      return `### ${m.title} (${key.toUpperCase()})\n` +
        `- **Value**: ${m.displayValue}\n` +
        `- **Status**: ${getMetricStatus(m.score)}\n` +
        `- **Optimization Advice**: ${getMetricAdvice(key)}\n`;
    }).join("\n");

    const promptContext = `\n---\n*AI IDE Instructions*: Please optimize the codebase performance based on the Lighthouse metrics and recommendations above. Focus on reducing asset loading times, eliminating layout shifts, and freeing up the main thread.`;

    const fullText = header + formattedMetrics + promptContext;

    try {
      await navigator.clipboard.writeText(fullText);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error("Failed to copy PageSpeed metrics:", err);
      alert("Could not copy metrics automatically. Please try again.");
    }
  };

  return (
    <div className="space-y-6">
      {/* Header Strategy Switcher */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-border pb-4">
        <div>
          <h2 className="text-xl font-bold text-slate-800">PageSpeed Insights</h2>
          <p className="text-xs text-slate-400 font-semibold mt-0.5">
            Lighthouse and Core Web Vitals metrics from Google PageSpeed for {websiteUrl}
          </p>
        </div>

        <div className="flex items-center gap-3">
          {/* Copy Metrics Button */}
          <button
            onClick={handleCopyMetrics}
            className={`flex items-center gap-1 px-2.5 py-1.5 border rounded-xl text-[10px] font-extrabold transition-all duration-150 cursor-pointer select-none ${
              copied
                ? "bg-emerald-50 border-emerald-200 text-emerald-700"
                : "bg-white border-slate-200 hover:border-slate-350 hover:bg-slate-50 text-slate-600"
            }`}
            title="Copy PageSpeed metrics for your AI IDE"
          >
            {copied ? (
              <>
                <svg xmlns="http://www.w3.org/2000/svg" width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="text-emerald-600 shrink-0"><path d="M20 6 9 17l-5-5"/></svg>
                <span>Copied!</span>
              </>
            ) : (
              <>
                <svg xmlns="http://www.w3.org/2000/svg" width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-slate-400 shrink-0"><rect width="14" height="14" x="8" y="8" rx="2" ry="2"/><path d="M4 16c-1.1 0-2-.9-2-2V4c0-1.1.9-2 2-2h10c1.1 0 2 .9 2 2"/></svg>
                <span>Copy</span>
              </>
            )}
          </button>

          {/* Refresh Button */}
          <button
            onClick={runAudit}
            disabled={isLoading}
            className={`flex items-center gap-1.5 px-2.5 py-1.5 border rounded-xl text-[10px] font-extrabold transition-all duration-150 cursor-pointer select-none bg-white border-slate-200 hover:border-slate-350 hover:bg-slate-50 text-slate-600 ${
              isLoading ? "opacity-50 cursor-not-allowed pointer-events-none" : ""
            }`}
            title="Refresh PageSpeed Insights"
          >
            <HugeiconsIcon
              icon={Refresh01Icon}
              size={12}
              className={isLoading ? "animate-spin text-accent" : "text-slate-400"}
            />
            <span>{isLoading ? "Refreshing..." : "Refresh Section"}</span>
          </button>

          {/* Strategy Toggle */}
          <div className="flex bg-slate-100 border border-slate-200/60 p-1 rounded-xl">
            <button
              onClick={() => setStrategy("mobile")}
              className={`px-4 py-1.5 text-xs font-bold rounded-lg transition-all cursor-pointer ${
                strategy === "mobile"
                  ? "bg-white text-slate-850 border border-slate-200/20"
                  : "text-slate-500 hover:text-slate-850"
              }`}
            >
              Mobile
            </button>
            <button
              onClick={() => setStrategy("desktop")}
              className={`px-4 py-1.5 text-xs font-bold rounded-lg transition-all cursor-pointer ${
                strategy === "desktop"
                  ? "bg-white text-slate-850 border border-slate-200/20"
                  : "text-slate-500 hover:text-slate-850"
              }`}
            >
              Desktop
            </button>
          </div>
        </div>
      </div>

      {/* 4 Category Gauges */}
      <div className="bg-card border border-border rounded-2xl p-6">
        <h3 className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-6">
          Lighthouse Category Scores
        </h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 justify-center">
          <ScoreGauge score={scores.performance} label="Performance" size={110} />
          <ScoreGauge score={scores.accessibility} label="Accessibility" size={110} />
          <ScoreGauge score={scores.bestPractices} label="Best Practices" size={110} />
          <ScoreGauge score={scores.seo} label="SEO" size={110} />
        </div>
      </div>

      {/* Core Web Vitals Lab Metrics */}
      <div className="space-y-4">
        <h3 className="text-[10px] font-bold text-slate-400 uppercase tracking-wider px-1">
          Lighthouse Lab Metrics
        </h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {Object.entries(metrics).map(([key, metric]) => {
            const m = metric as PageSpeedMetric;
            
            return (
              <div
                key={key}
                className={`group border rounded-2xl p-5 bg-gradient-to-br from-white to-slate-50/30 hover:-translate-y-0.5 transition-all duration-300 flex flex-col justify-between relative overflow-hidden ${
                  m.score === null
                    ? "border-slate-100"
                    : m.score >= 0.9
                    ? "border-slate-100 hover:border-emerald-200/60 border-l-4 border-l-emerald-500 pl-4"
                    : m.score >= 0.5
                    ? "border-slate-100 hover:border-amber-200/60 border-l-4 border-l-amber-500 pl-4"
                    : "border-slate-100 hover:border-rose-200/60 border-l-4 border-l-rose-500 pl-4"
                }`}
              >
                <div>
                  <div className="flex items-start justify-between gap-3">
                    <span className="text-xs font-bold text-slate-700 tracking-tight leading-snug truncate" title={m.title}>
                      {m.title}
                    </span>
                    <span className="text-[9px] font-black uppercase font-mono tracking-wider shrink-0 px-2 py-0.5 bg-slate-100/80 border border-slate-200/20 text-slate-500 rounded-md select-none">
                      {key}
                    </span>
                  </div>
                  
                  <div className="flex items-baseline gap-1 mt-4.5">
                    <p className="text-2xl font-black text-slate-850 font-mono tracking-tight leading-none">
                      {m.displayValue}
                    </p>
                  </div>
                </div>

                {/* Score representation bar */}
                <div className="mt-4 flex gap-1 h-1.5 w-full bg-slate-150/50 rounded-full overflow-hidden p-[1px]">
                  <div
                    className={`h-full rounded-full flex-1 transition-all duration-500 ${
                      m.score !== null && m.score < 0.5 ? "bg-rose-500" : "bg-slate-200/40"
                    }`}
                  />
                  <div
                    className={`h-full rounded-full flex-1 transition-all duration-500 ${
                      m.score !== null && m.score >= 0.5 && m.score < 0.9 ? "bg-amber-500" : "bg-slate-200/40"
                    }`}
                  />
                  <div
                    className={`h-full rounded-full flex-1 transition-all duration-500 ${
                      m.score !== null && m.score >= 0.9 ? "bg-emerald-500" : "bg-slate-200/40"
                    }`}
                  />
                </div>

                <div className="flex items-center justify-between gap-2 mt-4 pt-3.5 border-t border-slate-100/70">
                  <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Performance</span>
                  <div
                    className={`flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[9px] font-extrabold border transition-colors select-none ${
                      m.score === null
                        ? "text-slate-650 bg-slate-50 border-slate-200"
                        : m.score >= 0.9
                        ? "text-emerald-700 bg-emerald-50/50 border-emerald-100/60"
                        : m.score >= 0.5
                        ? "text-amber-700 bg-amber-50/50 border-amber-100/60"
                        : "text-rose-700 bg-rose-50/50 border-rose-100/60"
                    }`}
                  >
                    <HugeiconsIcon
                      icon={
                        m.score === null
                          ? InformationCircleIcon
                          : m.score >= 0.9
                          ? CheckmarkCircle02Icon
                          : m.score >= 0.5
                          ? InformationCircleIcon
                          : Alert01Icon
                      }
                      size={11}
                      className={
                        m.score === null
                          ? "text-slate-450"
                          : m.score >= 0.9
                          ? "text-emerald-600"
                          : m.score >= 0.5
                          ? "text-amber-600"
                          : "text-rose-600"
                      }
                    />
                    <span>
                      {m.score === null
                        ? "N/A"
                        : m.score >= 0.9
                        ? "Good"
                        : m.score >= 0.5
                        ? "Fair"
                        : "Poor"}
                    </span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Opportunities/Issues List */}
      <div className="bg-card border border-border rounded-2xl p-6">
        <h3 className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-4 border-b border-slate-100/60 pb-3">
          PageSpeed Optimization Opportunities ({initialResult.issues?.length || 0})
        </h3>
        <IssueList
          issues={initialResult.issues || []}
        />
      </div>
    </div>
  );
}
