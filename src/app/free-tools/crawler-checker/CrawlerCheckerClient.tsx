"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

interface CrawlerCheckResult {
  id: string;
  name: string;
  status: "allowed" | "blocked_cdn" | "blocked_robots" | "failed";
  httpCode: number;
  isCloudflare: boolean;
  isRobotsBlocked: boolean;
}

interface ScanResult {
  url: string;
  domain: string;
  hasRobotsTxt: boolean;
  checks: CrawlerCheckResult[];
}

export function CrawlerCheckerClient() {
  const [urlInput, setUrlInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [result, setResult] = useState<ScanResult | null>(null);
  const [activeConfigTab, setActiveConfigTab] = useState<"cloudflare" | "robots">("cloudflare");
  const [isCopied, setIsCopied] = useState(false);

  const handleScan = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!urlInput.trim()) return;

    setIsLoading(true);
    setError(null);
    setResult(null);

    try {
      const res = await fetch("/api/free-tools/crawler-checker", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ url: urlInput })
      });

      if (!res.ok) {
        const errJson = await res.json();
        throw new Error(errJson.error || "Failed to parse target crawler status.");
      }

      const data = await res.json();
      setResult(data);
    } catch (err: any) {
      setError(err.message || "Network connection error.");
    } finally {
      setIsLoading(false);
    }
  };

  const cloudflareExpression = `(http.user_agent contains "GPTBot") or (http.user_agent contains "OAI-SearchBot") or (http.user_agent contains "PerplexityBot") or (http.user_agent contains "ClaudeBot") or (http.user_agent contains "Google-Extended")`;

  const robotsTxtSnippet = `# Whitelist AI Search bots for SEO Optimisation
User-agent: GPTBot
Allow: /

User-agent: OAI-SearchBot
Allow: /

User-agent: PerplexityBot
Allow: /

User-agent: ClaudeBot
Allow: /

User-agent: Google-Extended
Allow: /`;

  const handleCopyText = (text: string) => {
    navigator.clipboard.writeText(text);
    setIsCopied(true);
    setTimeout(() => setIsCopied(false), 2000);
  };

  return (
    <div className="w-full relative font-sans max-w-5xl mx-auto space-y-8">
      
      {/* SCANNING URL BAR */}
      <div className="rounded-3xl border border-white/10 bg-slate-900/40 p-6 sm:p-8 backdrop-blur-xl">
        <form onSubmit={handleScan} className="space-y-4">
          <label htmlFor="url-scan-input" className="block text-xs font-bold text-slate-400 uppercase tracking-wider text-center sm:text-left mb-2">
            Analyze Site Crawl Accessibility
          </label>
          <div className="flex flex-col sm:flex-row gap-3">
            <input
              id="url-scan-input"
              type="text"
              required
              value={urlInput}
              onChange={(e) => setUrlInput(e.target.value)}
              placeholder="e.g. yoursite.com or yoursite.com/docs"
              className="flex-1 px-5 py-4 bg-slate-950 border border-white/10 rounded-2xl text-xs text-white focus:outline-none focus:border-rose-500/50 transition-colors font-medium shadow-inner"
            />
            <button
              type="submit"
              disabled={isLoading}
              className="px-8 py-4 bg-rose-500 hover:bg-rose-400 disabled:bg-rose-500/50 text-white text-xs font-bold rounded-2xl transition-all cursor-pointer shadow-lg shadow-rose-500/10 hover:shadow-rose-500/20 active:translate-y-0"
            >
              {isLoading ? "Simulating Bots..." : "Scan URL"}
            </button>
          </div>
          <p className="text-[10px] text-slate-500 leading-normal text-center sm:text-left">
            We will run parallel server-side fetches replicating headers of GPTBot, PerplexityBot, and other search agents to check for CDN/Robots locks.
          </p>
        </form>
      </div>

      {/* ERROR HANDLER */}
      <AnimatePresence>
        {error && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            className="p-4 rounded-2xl bg-red-500/10 border border-red-500/25 text-red-400 text-xs font-semibold"
          >
            Error: {error}
          </motion.div>
        )}
      </AnimatePresence>

      {/* LOADING STATE SKELETON */}
      <AnimatePresence>
        {isLoading && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="space-y-6"
          >
            {/* Spinning load status */}
            <div className="flex items-center justify-center gap-3 py-6">
              <svg className="animate-spin h-5 w-5 text-rose-400" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
              </svg>
              <span className="text-xs font-bold text-slate-350 tracking-wider">Simulating crawler requests in parallel...</span>
            </div>

            {/* Grid Skeletons */}
            <div className="grid sm:grid-cols-2 md:grid-cols-5 gap-4">
              {[1, 2, 3, 4, 5].map((idx) => (
                <div key={idx} className="h-32 rounded-2xl border border-white/5 bg-slate-900/20 animate-pulse flex flex-col justify-between p-4.5">
                  <div className="h-4 bg-white/5 rounded-md w-2/3" />
                  <div className="h-5 bg-white/5 rounded-md w-1/2" />
                  <div className="h-3 bg-white/5 rounded-md w-3/4" />
                </div>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* RESULTS DISPLAY PANEL */}
      <AnimatePresence>
        {result && (
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-8"
          >
            {/* Header info bar */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-5 rounded-2xl border border-white/5 bg-slate-900/20 backdrop-blur-md">
              <div>
                <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">Crawl target</span>
                <h3 className="text-sm font-bold text-white tracking-tight">{result.url}</h3>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-xs font-bold text-slate-400">Robots.txt status:</span>
                <span className={`px-2.5 py-1 rounded-full text-[10px] font-black border tracking-wide uppercase ${
                  result.hasRobotsTxt
                    ? "bg-emerald-500/10 text-emerald-400 border-emerald-500/25"
                    : "bg-slate-800 text-slate-400 border-white/5"
                }`}>
                  {result.hasRobotsTxt ? "Found & Parsed" : "Not Found"}
                </span>
              </div>
            </div>

            {/* Crawler Cards Grid */}
            <div className="grid sm:grid-cols-2 md:grid-cols-5 gap-4">
              {result.checks.map((check) => {
                const isAllowed = check.status === "allowed";
                const isRobots = check.status === "blocked_robots";
                const isCdn = check.status === "blocked_cdn";

                let statusColor = "bg-red-500/10 text-red-400 border-red-500/25";
                let statusLabel = "Blocked";
                if (isAllowed) {
                  statusColor = "bg-emerald-500/10 text-emerald-400 border-emerald-500/25";
                  statusLabel = "Allowed";
                } else if (isRobots) {
                  statusColor = "bg-amber-500/10 text-amber-400 border-amber-500/25";
                  statusLabel = "Robots Block";
                } else if (isCdn) {
                  statusColor = "bg-rose-500/10 text-rose-400 border-rose-500/25";
                  statusLabel = "CDN Block";
                }

                return (
                  <motion.div
                    key={check.id}
                    className="rounded-2xl border border-white/10 bg-slate-900/30 p-4.5 flex flex-col justify-between h-36 backdrop-blur-xl relative overflow-hidden"
                    whileHover={{ y: -2 }}
                  >
                    <div className="space-y-1">
                      <h4 className="text-xs font-black text-white">{check.name}</h4>
                      <span className="text-[9px] font-mono text-slate-500 tracking-tight">HTTP {check.httpCode}</span>
                    </div>

                    <div className="space-y-2 mt-4">
                      <span className={`inline-flex px-2 py-0.5 rounded-full text-[9px] font-black border tracking-wider uppercase ${statusColor}`}>
                        {statusLabel}
                      </span>
                      <p className="text-[10px] text-slate-400 leading-normal">
                        {isAllowed
                          ? "Crawl succeeded. Target page allows and accepts agent."
                          : isRobots
                          ? "Blocked by Disallow rule inside your robots.txt file."
                          : isCdn
                          ? "Blocked by Cloudflare/CDN WAF firewall rules."
                          : "Connection failed or timed out."}
                      </p>
                    </div>
                  </motion.div>
                );
              })}
            </div>

            {/* BLOCKADE SOLUTIONS WHITELIST HELPER */}
            <div className="rounded-3xl border border-white/10 bg-slate-900/40 p-6 sm:p-8 backdrop-blur-xl space-y-6">
              <div className="border-b border-white/5 pb-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                  <h3 className="text-sm font-bold text-white uppercase tracking-wider">Whitelist & Access Resolution Panel</h3>
                  <p className="text-xs text-slate-400 mt-1 font-medium">Follow these configurations to permit AI search crawl ingestions on your domain.</p>
                </div>

                {/* Tab switchers */}
                <div className="flex p-0.5 rounded-xl bg-slate-950 border border-white/10 shrink-0">
                  <button
                    type="button"
                    onClick={() => setActiveConfigTab("cloudflare")}
                    className={`px-3.5 py-1.5 rounded-lg text-[10px] font-bold transition-all cursor-pointer ${
                      activeConfigTab === "cloudflare"
                        ? "bg-white/10 text-white"
                        : "text-slate-400 hover:text-white"
                    }`}
                  >
                    Cloudflare WAF
                  </button>
                  <button
                    type="button"
                    onClick={() => setActiveConfigTab("robots")}
                    className={`px-3.5 py-1.5 rounded-lg text-[10px] font-bold transition-all cursor-pointer ${
                      activeConfigTab === "robots"
                        ? "bg-white/10 text-white"
                        : "text-slate-400 hover:text-white"
                    }`}
                  >
                    robots.txt Snippet
                  </button>
                </div>
              </div>

              {/* Config Content Panel */}
              <div className="space-y-4">
                {activeConfigTab === "cloudflare" ? (
                  <div className="space-y-4">
                    <div className="p-4.5 rounded-2xl bg-slate-950 border border-white/5 space-y-3">
                      <h4 className="text-xs font-bold text-rose-400 uppercase tracking-wider">Cloudflare WAF Custom Rule expression</h4>
                      <p className="text-xs text-slate-350 leading-relaxed font-medium">
                        If any crawler displays a <span className="text-rose-400 font-bold">CDN Block (HTTP 403)</span>, Cloudflare is rejecting the scraper requests. Copy this expression to create a custom WAF rule that allows AI search bots:
                      </p>
                      
                      <div className="flex items-center gap-3 bg-slate-900 border border-white/10 rounded-xl p-3.5 mt-2">
                        <code className="text-[10px] text-slate-200 font-mono flex-1 select-all break-all leading-normal whitespace-pre-wrap">
                          {cloudflareExpression}
                        </code>
                        <button
                          type="button"
                          onClick={() => handleCopyText(cloudflareExpression)}
                          className="px-3 py-2 bg-white/5 hover:bg-white/10 text-white text-[10px] font-bold rounded-lg border border-white/10 shrink-0 transition-colors cursor-pointer active:scale-95"
                        >
                          {isCopied ? "Copied!" : "Copy"}
                        </button>
                      </div>
                    </div>

                    <div className="space-y-2 text-xs text-slate-400 leading-relaxed font-medium">
                      <h5 className="font-bold text-white">How to deploy in Cloudflare:</h5>
                      <ol className="list-decimal pl-4.5 space-y-1.5">
                        <li>Log in to your <strong>Cloudflare Dashboard</strong> and select your domain.</li>
                        <li>Navigate to <strong>Security &gt; WAF &gt; Custom Rules</strong> and click <strong>Create rule</strong>.</li>
                        <li>Give the rule a descriptive name (e.g., <code>Allow AI Search Indexers</code>).</li>
                        <li>Under **Expression Preview**, click <strong>Edit expression</strong> and paste the rule copied above.</li>
                        <li>Set the **Choose action** dropdown to <strong>Skip</strong> (select <strong>WAF managed rules</strong> / <strong>Rate limiting</strong> to bypass blockades).</li>
                        <li>Click <strong>Deploy custom rule</strong>.</li>
                      </ol>
                    </div>
                  </div>
                ) : (
                  <div className="space-y-4">
                    <div className="p-4.5 rounded-2xl bg-slate-950 border border-white/5 space-y-3">
                      <h4 className="text-xs font-bold text-amber-400 uppercase tracking-wider font-mono">Optimized robots.txt whitelist snippet</h4>
                      <p className="text-xs text-slate-355 leading-relaxed font-medium text-slate-350">
                        If a crawler shows a <span className="text-amber-400 font-bold">Robots Block</span>, your site&apos;s robots instructions disallow crawl access. Copy and append this code block to your public <code>robots.txt</code> file:
                      </p>
                      
                      <div className="flex items-start gap-3 bg-slate-900 border border-white/10 rounded-xl p-3.5 mt-2">
                        <pre className="text-[10px] text-slate-200 font-mono flex-1 select-all break-all leading-relaxed whitespace-pre-wrap">
                          {robotsTxtSnippet}
                        </pre>
                        <button
                          type="button"
                          onClick={() => handleCopyText(robotsTxtSnippet)}
                          className="px-3 py-2 bg-white/5 hover:bg-white/10 text-white text-[10px] font-bold rounded-lg border border-white/10 shrink-0 transition-colors cursor-pointer active:scale-95"
                        >
                          {isCopied ? "Copied!" : "Copy"}
                        </button>
                      </div>
                    </div>

                    <div className="space-y-2 text-xs text-slate-400 leading-relaxed font-medium">
                      <h5 className="font-bold text-white">How to deploy robots.txt:</h5>
                      <ol className="list-decimal pl-4.5 space-y-1.5">
                        <li>Locate your site&apos;s raw text <code>robots.txt</code> file (often placed in Next.js <code>public/</code> folder or generated dynamically).</li>
                        <li>Paste the whitelisting snippet at the top or bottom of the file.</li>
                        <li>Deploy the code so it is publicly accessible at <code>yourdomain.com/robots.txt</code>.</li>
                        <li>Re-run the Crawler Checker scanner to verify accessibility turns green!</li>
                      </ol>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

    </div>
  );
}
