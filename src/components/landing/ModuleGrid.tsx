"use client";

import { useRef } from "react";
import { motion, useMotionTemplate, useMotionValue } from "framer-motion";
import { MODULES, getScoreColor, type ScanResult } from "./moduleData";

interface ModuleGridProps {
  scanResults: ScanResult[] | null;
  phase: "idle" | "scanning" | "complete";
}

// Spotlight Panel to add the cursor spotlight follow glow and top neon bar glow
function SpotlightPanel({
  children,
  className = "",
}: {
  children: React.ReactNode;
  className?: string;
}) {
  const cardRef = useRef<HTMLDivElement>(null);
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!cardRef.current) return;
    const rect = cardRef.current.getBoundingClientRect();
    mouseX.set(e.clientX - rect.left);
    mouseY.set(e.clientY - rect.top);
  };

  return (
    <div
      ref={cardRef}
      onMouseMove={handleMouseMove}
      className={`group relative overflow-hidden rounded-3xl border border-white/10 bg-slate-950/40 p-6 sm:p-8 hover:border-teal-500/30 hover:bg-slate-900/25 transition-all duration-500 backdrop-blur-xl shadow-xl flex flex-col justify-between h-full w-full cursor-default ${className}`}
    >
      {/* ── Spotlight Hover Gradient Glow (Cursor-following radial sweep) ── */}
      <motion.div
        className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none z-0"
        style={{
          background: useMotionTemplate`
            radial-gradient(
              180px circle at ${mouseX}px ${mouseY}px,
              rgba(20, 184, 166, 0.12),
              transparent 80%
            )
          `,
        }}
      />
      {/* Top neon glow line */}
      <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-teal-500/30 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
      
      <div className="relative z-10 flex flex-col justify-between h-full w-full flex-grow">
        {children}
      </div>
    </div>
  );
}

// Expanded technical descriptions and checklists for each of the 15 modules
const MODULE_EXTRAS: Record<
  string,
  {
    longDesc: string;
    checks: string[];
  }
> = {
  technical: {
    longDesc: "Performs deep crawlability checks across your entire routing layout. Validates canonical tag presence to guard against page duplication penalties, checks robots.txt indexing instructions, flags redirect loops, maps HTTP responses, and optimizes crawl budget allocation parameters.",
    checks: [
      "Canonical Tag Integrity",
      "Robots.txt Block Directives",
      "Redirect Loops & Chains",
      "HTTP Header Response Codes",
      "Crawl Budget Optimization Rate",
    ],
  },
  onpage: {
    longDesc: "Analyzes semantic content structure and key term configurations. Validates title lengths, audits meta descriptions for organic click-through relevance, evaluates the hierarchy of nested headings (H1 to H6), reviews keyword density, and checks that core headings align with search query clusters.",
    checks: [
      "Title Tag Optimization (< 60 chars)",
      "Meta Description CTR check (< 160 chars)",
      "Heading Hierarchy (H1 to H6)",
      "Keyword Density & Placement",
      "Thin Content Word Count Check",
    ],
  },
  content: {
    longDesc: "Grades overall copy quality and topical depth against experience, expertise, authoritativeness, and trustworthiness (E-E-A-T) signals. Assesses readability levels, maps semantic topical structures, parses author bios, and checks outbound academic or press reference sources.",
    checks: [
      "Verified Author Profile & Bio",
      "Information Source Citations",
      "Readability Index (Flesch Scale)",
      "Topical Clustering Depth",
      "External Source Trust Rating",
    ],
  },
  schema: {
    longDesc: "Validates JSON-LD structure metadata configurations to ensure your pages are eligible for Google search rich result expansions. Crawls schema definitions, catches syntax errors, verifies parent-child relationships, and flags missing required keys.",
    checks: [
      "JSON-LD Syntax Verification",
      "Google Rich Results Eligibility",
      "Product / FAQ / Article Schema Parser",
      "BreadcrumbList Navigation Audit",
      "Nesting Hierarchy & Nodes Match",
    ],
  },
  images: {
    longDesc: "Performs full-scale asset performance audits across all site media. Inspects image sizes, flags unoptimized dimensions, audits descriptive alt attributes for screen readers and indexers, checks lazy-loading configurations, and validates next-gen WebP/AVIF file formats.",
    checks: [
      "Descriptive Alt Text Coverage",
      "Next-Gen Format Compression (WebP/AVIF)",
      "Layout Shift (CLS) Dimension Flags",
      "Lazy Loading Viewport Flags",
      "Responsive srcSet Viewport Scaling",
    ],
  },
  sitemap: {
    longDesc: "Audits your XML sitemaps to verify that search engines index pages accurately. Crawls listed routes, cross-references URLs against robots.txt blocking rules, checks for correct status responses, and validates indexability guidelines.",
    checks: [
      "XML Schema Format Validation",
      "Listed vs Indexable Node Sync",
      "Robots.txt Intersect Checker",
      "Lastmod Header Consistency",
      "Sitemap File Sizing Limits",
    ],
  },
  ai: {
    longDesc: "Evaluates visibility, retrieval probability, and brand citation rates across major generative search platforms (GEO) and LLM search engines. Measures citation indexes in ChatGPT, Gemini, Claude, and Perplexity answers, and tracks source references.",
    checks: [
      "ChatGPT Direct Citation Probability",
      "Google Gemini AI Overview Sourcing",
      "Claude Factual Source Citation",
      "Perplexity Citation Node Mapping",
      "LLM Brand Sentiment Index",
    ],
  },
  sxo: {
    longDesc: "Combines SEO optimization with user experience metrics to align with modern search user intent signals. Audits mobile tap target zones, evaluates font scaling across viewports, maps Cumulative Layout Shifts (CLS), and ensures click elements are fully isolated.",
    checks: [
      "Mobile Tap Target Spacing (min 48x48px)",
      "Legible Body Font Scale (min 16px)",
      "Content Layout Shift Vectors",
      "Visual Stability & Overlaps Check",
      "Focus Ring Keyboard Navigation",
    ],
  },
  performance: {
    longDesc: "Benchmarks page speed across mobile and desktop devices. Inspects Google Core Web Vitals in real-time, checking Largest Contentful Paint (LCP) speed, Cumulative Layout Shift (CLS) layout stability, and Interaction to Next Paint (INP) response rates.",
    checks: [
      "Largest Contentful Paint (LCP) < 2.5s",
      "Interaction to Next Paint (INP)",
      "Cumulative Layout Shift (CLS)",
      "First Input Delay (FID) Latency",
      "Time to First Byte (TTFB) Response",
    ],
  },
  pagespeed: {
    longDesc: "Runs diagnostic testing to discover bottlenecks on performance. Simulates heavy device throttling, detects render-blocking assets, lists opportunity cost savings from unminified scripts, and evaluates script parse weights.",
    checks: [
      "Lighthouse Performance Rating",
      "Render-Blocking Scripts Deferral",
      "Unused CSS & JS Bundle Audits",
      "Next-Gen Image Sizing Savings",
      "Critical Rendering Path Load Speed",
    ],
  },
  security: {
    longDesc: "Checks host security configurations and response metrics. Verifies SSL/TLS versions, audits HSTS response parameters, parses Content Security Policy (CSP) setups, and ensures cross-site scripting (XSS) filters are actively configured.",
    checks: [
      "Content-Security-Policy (CSP)",
      "Strict-Transport-Security (HSTS)",
      "X-Frame-Options Clickjacking Check",
      "X-Content-Type MIME Sniff check",
      "SSL Certificate & Cipher Suite Validity",
    ],
  },
  links: {
    longDesc: "Crawls every internal and external link target path to check link equity parameters. Identifies broken links, scans for nested redirect loops, verifies dofollow/nofollow setup tags, and monitors anchor text relevance distribution.",
    checks: [
      "Broken Link (404 Error) Scanner",
      "Redirect Loops & Chains Tracker",
      "Dofollow vs Nofollow Attributor",
      "Anchor Text Keyword Context check",
      "External Target Safety & Spam check",
    ],
  },
  accessibility: {
    longDesc: "Validates website templates against WCAG 2.1 Level AA accessibility guidelines. Evaluates contrast ratios, audits keyboard navigation outlines, checks ARIA landmarks, and verifies structural semantic elements.",
    checks: [
      "WCAG 2.1 AA Color Contrast (min 4.5:1)",
      "ARIA Label Coverage & Screen Readers",
      "Keyboard Interactive Focus States",
      "HTML Document Language Declarations",
      "Media Caption & Alt Text Validation",
    ],
  },
  international: {
    longDesc: "Audits settings for multi-language and multi-region web architectures. Cross-checks hreflang codes, validates self-referential links, flags reciprocal tag errors, and maps language fallbacks.",
    checks: [
      "Hreflang ISO Language/Region Codes",
      "Self-Referential Alternate Node Match",
      "Reciprocal Return Link Check",
      "X-Default Fallback Target Check",
      "IP Geolocation Redirect Mismatch",
    ],
  },
  mobile: {
    longDesc: "Checks that site assets format and render fluidly across mobile device screens. Simulates responsive viewports, catches horizontal scroll breaks, monitors mobile font readability, and tracks mobile layout stability.",
    checks: [
      "Responsive Viewport Configuration",
      "Horizontal Scroll Clipping Prevention",
      "Font Scale Scaling on Mobile Screen",
      "Touch Target Proximity Calculator",
      "Media Query Breakdown Verifier",
    ],
  },
  indexability: {
    longDesc: "Performs critical validation of indexing directives, canonical tag self-referencing states, and robots meta tags. Resolves indexation loop holes, consolidates duplicate parameter configurations, flags noindex status codes, and detects thin content.",
    checks: [
      "Canonical Tag Consolidation",
      "Robots Tag Contradictions Check",
      "Noindex / Index Tag Compliance",
      "Thin Content Length Threshold",
      "Status Code Error Routing Check",
    ],
  },
  backlinks: {
    longDesc: "Audits link equity flow across internal and external page resources. Checks anchor text optimization distributions, catches excessive generic anchor terms, monitors follow vs nofollow link profiles, and scans for malformed link destination protocols.",
    checks: [
      "Anchor Text Distribution Check",
      "Link Equity Ratio Calculation",
      "Nofollow Qualification Rates",
      "Malformed Link Target Detection",
      "Authority Outbound Citations check",
    ],
  },
  drift: {
    longDesc: "Keeps historical baselines of your critical SEO tags to guard against code updates breaking rankings. Triggers regression alerts when status codes, index status rules, canonical link paths, page H1 headings, or title metadata drift from baseline.",
    checks: [
      "HTTP Status Regression Monitor",
      "Canonical Path Change Tracker",
      "Robots Directives Shift Alert",
      "Title & Meta Tag Drift Audit",
      "H1 Semantic Headline Drift Warning",
    ],
  },
};

// Custom interactive animations representing each module's functionalities
function SectionVisualizer({ type }: { type: string }) {
  if (type === "technical") {
    return (
      <div className="w-full h-full flex flex-col justify-between overflow-hidden font-mono text-[10px] text-slate-300 select-none">
        {/* Mock DevTools tab layout */}
        <div className="flex items-center justify-between border-b border-white/5 pb-2">
          <div className="flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-red-500/30 border border-red-500/50" />
            <span className="w-2 h-2 rounded-full bg-yellow-500/30 border border-yellow-500/50" />
            <span className="w-2 h-2 rounded-full bg-green-500/30 border border-green-500/50" />
          </div>
          <div className="flex gap-2.5 text-[9px] font-sans font-extrabold text-slate-500">
            <span className="text-teal-400 border-b border-teal-400 pb-1.5">Headers Audit</span>
            <span>Crawl Waterfall</span>
            <span>Security Directives</span>
          </div>
        </div>

        {/* Layout split: Left (TCP/TLS Handshake Sequence Diagram), Right (Waterfall diagnostics) */}
        <div className="flex-grow grid grid-cols-1 md:grid-cols-12 gap-5 py-4 items-stretch">
          {/* Left: Handshake Sequence Diagram (col-span-5) */}
          <div className="md:col-span-5 flex flex-col justify-between h-full bg-slate-950/70 rounded-xl border border-white/5 p-3 relative overflow-hidden">
            <span className="text-[7.5px] text-slate-500 uppercase tracking-widest font-black block mb-2.5 font-sans">Network Handshake Flow</span>
            
            <div className="flex-grow flex items-center justify-center relative my-1">
              <svg className="w-full h-full min-h-[140px] max-h-[170px]" viewBox="0 0 200 120" fill="none" xmlns="http://www.w3.org/2000/svg">
                {/* Client & Server vertical timeline lines */}
                <line x1="30" y1="15" x2="30" y2="98" stroke="rgba(255,255,255,0.06)" strokeWidth="1.2" strokeDasharray="3 3" />
                <line x1="170" y1="15" x2="170" y2="98" stroke="rgba(255,255,255,0.06)" strokeWidth="1.2" strokeDasharray="3 3" />

                {/* Labels on top */}
                <text x="30" y="8" fontSize="7" fontWeight="900" fill="#94a3b8" textAnchor="middle" fontFamily="sans-serif">BROWSER</text>
                <text x="170" y="8" fontSize="7" fontWeight="900" fill="#94a3b8" textAnchor="middle" fontFamily="sans-serif">SERVER</text>

                {/* Step 1: TCP SYN (Client -> Server) */}
                <path d="M 30 25 L 166 33" stroke="rgba(255,255,255,0.06)" strokeWidth="1" strokeLinecap="round" strokeDasharray="140" strokeDashoffset="140" className="handshake-step-1" />
                <polygon points="166,33 158,30 161,35" fill="#1e293b" className="arrow-head-1" />
                <text x="95" y="22" fontSize="5.5" fontWeight="bold" fill="#475569" textAnchor="middle" fontFamily="monospace" className="text-step-1">1. TCP SYN</text>

                {/* Step 2: TCP SYN-ACK (Server -> Client) */}
                <path d="M 170 43 L 34 51" stroke="rgba(255,255,255,0.06)" strokeWidth="1" strokeLinecap="round" strokeDasharray="140" strokeDashoffset="-140" className="handshake-step-2" />
                <polygon points="34,51 42,48 39,53" fill="#1e293b" className="arrow-head-2" />
                <text x="95" y="40" fontSize="5.5" fontWeight="bold" fill="#475569" textAnchor="middle" fontFamily="monospace" className="text-step-2">2. TCP SYN-ACK</text>

                {/* Step 3: TCP ACK (Client -> Server) */}
                <path d="M 30 61 L 166 69" stroke="rgba(255,255,255,0.06)" strokeWidth="1" strokeLinecap="round" strokeDasharray="140" strokeDashoffset="140" className="handshake-step-3" />
                <polygon points="166,69 158,66 161,71" fill="#1e293b" className="arrow-head-3" />
                <text x="95" y="58" fontSize="5.5" fontWeight="bold" fill="#475569" textAnchor="middle" fontFamily="monospace" className="text-step-3">3. TCP ACK (Connected)</text>

                {/* Step 4: TLS 1.3 Key Exchange (Client -> Server) */}
                <path d="M 30 79 L 166 87" stroke="rgba(255,255,255,0.06)" strokeWidth="1" strokeLinecap="round" strokeDasharray="140" strokeDashoffset="140" className="handshake-step-4" />
                <polygon points="166,87 158,84 161,89" fill="#1e293b" className="arrow-head-4" />
                <text x="95" y="76" fontSize="5.5" fontWeight="bold" fill="#475569" textAnchor="middle" fontFamily="monospace" className="text-step-4">4. TLS 1.3 Handshake</text>

                {/* Step 5: HTTPS Tunnel Established */}
                <rect x="35" y="99" width="130" height="11" rx="2" stroke="rgba(255,255,255,0.06)" strokeWidth="0.8" fill="transparent" className="established-box" />
                <text x="100" y="107" fontSize="5.5" fontWeight="900" fill="#475569" textAnchor="middle" fontFamily="sans-serif" className="established-text">HTTPS SECURE TUNNEL ESTABLISHED</text>
              </svg>
            </div>

            <div className="text-[8px] text-slate-550 border-t border-slate-900/60 pt-2 flex justify-between items-center">
              <span>HSTS Preload: Active</span>
              <span className="text-emerald-400">TLS 1.3 Secure</span>
            </div>
          </div>

          {/* Right: Detailed Waterfall Timing (col-span-7) */}
          <div className="md:col-span-7 flex flex-col justify-between h-full bg-slate-950/70 rounded-xl border border-white/5 p-3.5 relative overflow-hidden">
            <span className="text-[7.5px] text-slate-500 uppercase tracking-widest font-black block mb-3 font-sans">Diagnostics Waterfall (375ms total)</span>
            
            <div className="space-y-3 font-sans flex-grow flex flex-col justify-center">
              <div className="space-y-1">
                <div className="flex justify-between text-[9px] font-bold text-slate-350">
                  <span>1. DNS Lookup & Handshake</span>
                  <span className="text-slate-400 font-mono">16ms</span>
                </div>
                <div className="w-full h-1.5 bg-slate-900 rounded-full overflow-hidden border border-white/5">
                  <div className="h-full bg-teal-400 fill-bar-dns" />
                </div>
              </div>

              <div className="space-y-1">
                <div className="flex justify-between text-[9px] font-bold text-slate-350">
                  <span>2. Time to First Byte (TTFB)</span>
                  <span className="text-indigo-400 font-mono">42ms</span>
                </div>
                <div className="w-full h-1.5 bg-slate-900 rounded-full overflow-hidden border border-white/5">
                  <div className="h-full bg-indigo-500 fill-bar-ttfb animate-delay-1" />
                </div>
              </div>

              <div className="space-y-1">
                <div className="flex justify-between text-[9px] font-bold text-slate-350">
                  <span>3. Document Loading & Scripts</span>
                  <span className="text-emerald-400 font-mono">317ms</span>
                </div>
                <div className="w-full h-1.5 bg-slate-900 rounded-full overflow-hidden border border-white/5">
                  <div className="h-full bg-emerald-500 fill-bar-doc animate-delay-2" />
                </div>
              </div>
            </div>

            <div className="text-[8px] text-slate-555 border-t border-slate-900/60 pt-2 flex justify-between items-center">
              <span>Canonical Check: Match</span>
              <span className="text-teal-400">robots.txt: Indexable</span>
            </div>
          </div>
        </div>

        <div className="p-2.5 rounded-xl bg-slate-950/80 border border-white/5 flex items-center justify-between text-[8.5px] text-slate-500 font-sans">
          <span>HTTP/2 Protocol Enabled</span>
          <span className="text-emerald-400 font-bold flex items-center gap-1.5">
            Technical Audit Verified
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
          </span>
        </div>

        <style jsx>{`
          /* Handshake step line animations */
          @keyframes drawLeftToRight {
            0%, 100% { stroke-dashoffset: 140; stroke: rgba(255,255,255,0.06); }
            5%, 20% { stroke-dashoffset: 0; stroke: #10b981; }
            25% { stroke-dashoffset: 0; stroke: rgba(255,255,255,0.06); }
          }
          @keyframes drawRightToLeft {
            0%, 25%, 100% { stroke-dashoffset: -140; stroke: rgba(255,255,255,0.06); }
            30%, 45% { stroke-dashoffset: 0; stroke: #10b981; }
            50% { stroke-dashoffset: 0; stroke: rgba(255,255,255,0.06); }
          }
          @keyframes drawLeftToRightThree {
            0%, 50%, 100% { stroke-dashoffset: 140; stroke: rgba(255,255,255,0.06); }
            55%, 70% { stroke-dashoffset: 0; stroke: #10b981; }
            75% { stroke-dashoffset: 0; stroke: rgba(255,255,255,0.06); }
          }
          @keyframes drawLeftToRightFour {
            0%, 75%, 100% { stroke-dashoffset: 140; stroke: rgba(255,255,255,0.06); }
            80%, 95% { stroke-dashoffset: 0; stroke: #8b5cf6; }
          }

          /* Arrow head glows */
          @keyframes arrowGlow {
            0%, 100% { fill: rgba(255,255,255,0.06); }
            5%, 20% { fill: #10b981; }
            25% { fill: rgba(255,255,255,0.06); }
          }
          @keyframes arrowGlowTwo {
            0%, 25%, 100% { fill: rgba(255,255,255,0.06); }
            30%, 45% { fill: #10b981; }
            50% { fill: rgba(255,255,255,0.06); }
          }
          @keyframes arrowGlowThree {
            0%, 50%, 100% { fill: rgba(255,255,255,0.06); }
            55%, 70% { fill: #10b981; }
            75% { fill: rgba(255,255,255,0.06); }
          }
          @keyframes arrowGlowFour {
            0%, 75%, 100% { fill: rgba(255,255,255,0.06); }
            80%, 95% { fill: #8b5cf6; }
          }

          /* Text step colors */
          @keyframes textGlow {
            0%, 100% { fill: #475569; }
            5%, 20% { fill: #cbd5e1; }
            25% { fill: #475569; }
          }
          @keyframes textGlowTwo {
            0%, 25%, 100% { fill: #475569; }
            30%, 45% { fill: #cbd5e1; }
            50% { fill: #475569; }
          }
          @keyframes textGlowThree {
            0%, 50%, 100% { fill: #475569; }
            55%, 70% { fill: #cbd5e1; }
            75% { fill: #475569; }
          }
          @keyframes textGlowFour {
            0%, 75%, 100% { fill: #475569; }
            80%, 95% { fill: #a78bfa; }
          }

          /* Tunnel established glow */
          @keyframes boxGlow {
            0%, 94%, 100% { stroke: rgba(255,255,255,0.06); fill: transparent; }
            95%, 99% { stroke: #10b981; fill: rgba(16,185,129,0.05); }
          }
          @keyframes establishedTextGlow {
            0%, 94%, 100% { fill: #475569; }
            95%, 99% { fill: #10b981; }
          }

          .handshake-step-1 { animation: drawLeftToRight 6s infinite linear; }
          .arrow-head-1 { animation: arrowGlow 6s infinite linear; }
          .text-step-1 { animation: textGlow 6s infinite linear; }

          .handshake-step-2 { animation: drawRightToLeft 6s infinite linear; }
          .arrow-head-2 { animation: arrowGlowTwo 6s infinite linear; }
          .text-step-2 { animation: textGlowTwo 6s infinite linear; }

          .handshake-step-3 { animation: drawLeftToRightThree 6s infinite linear; }
          .arrow-head-3 { animation: arrowGlowThree 6s infinite linear; }
          .text-step-3 { animation: textGlowThree 6s infinite linear; }

          .handshake-step-4 { animation: drawLeftToRightFour 6s infinite linear; }
          .arrow-head-4 { animation: arrowGlowFour 6s infinite linear; }
          .text-step-4 { animation: textGlowFour 6s infinite linear; }

          .established-box { animation: boxGlow 6s infinite linear; }
          .established-text { animation: establishedTextGlow 6s infinite linear; }

          /* Right Waterfall timings */
          @keyframes fillDns { from { width: 0%; } to { width: 12%; } }
          @keyframes fillTtfb { from { width: 0%; } to { width: 34%; } }
          @keyframes fillDoc { from { width: 0%; } to { width: 92%; } }
          .fill-bar-dns { animation: fillDns 1.2s cubic-bezier(0.4, 0, 0.2, 1) forwards; }
          .fill-bar-ttfb { animation: fillTtfb 1.2s cubic-bezier(0.4, 0, 0.2, 1) forwards; animation-delay: 0.2s; }
          .fill-bar-doc { animation: fillDoc 1.2s cubic-bezier(0.4, 0, 0.2, 1) forwards; animation-delay: 0.4s; }
        `}</style>
      </div>
    );
  }

  if (type === "onpage") {
    return (
      <div className="w-full h-full flex flex-col justify-between overflow-hidden select-none font-sans text-xs relative">
        {/* Sweeping scan radar line */}
        <div className="absolute left-0 right-0 h-0.5 bg-gradient-to-r from-transparent via-teal-500/40 to-transparent serp-scan pointer-events-none z-20" />

        <div className="flex items-center justify-between border-b border-white/5 pb-2">
          <div className="flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-red-500/30 border border-red-500/50" />
            <span className="w-2 h-2 rounded-full bg-yellow-500/30 border border-yellow-500/50" />
            <span className="w-2 h-2 rounded-full bg-green-500/30 border border-green-500/50" />
          </div>
          <div className="flex gap-2.5 text-[9px] font-extrabold text-slate-500">
            <span className="text-teal-400 border-b border-teal-400 pb-1.5">SERP Simulator</span>
            <span>Tag Health</span>
            <span>Headings</span>
          </div>
        </div>
        
        {/* Split Layout: Left (Google Search Result Mock), Right (HTML Tag Diagnostics) */}
        <div className="flex-grow grid grid-cols-1 md:grid-cols-12 gap-5 py-4 items-stretch">
          {/* Left: Google Search Result Mock */}
          <div className="md:col-span-6 flex flex-col justify-between h-full bg-slate-950/70 rounded-xl border border-white/5 p-3.5 relative overflow-hidden">
            <span className="text-[7.5px] text-slate-500 uppercase tracking-widest font-black block mb-2">Google SERP Preview</span>
            
            <div className="flex-grow flex flex-col justify-center space-y-1">
              <div className="flex items-center gap-1 text-[9px] text-slate-450 font-bold">
                <span>https://seoptimised.com</span>
                <span>&gt;</span>
                <span>audit</span>
              </div>
              <h4 className="text-sky-400 hover:underline font-extrabold text-xs leading-tight">
                SEO Optimised - Professional Parallel SEO Audit Engine
              </h4>
              <p className="text-slate-400 text-[9.5px] leading-relaxed">
                Verify website metadata, audit schemas, track redirect loops, inspect response headers, and check visibility in ChatGPT and Gemini immediately.
              </p>
            </div>
          </div>

          {/* Right: HTML Tag Length Progress Bars */}
          <div className="md:col-span-6 flex flex-col justify-between h-full bg-slate-950/70 rounded-xl border border-white/5 p-3.5 relative overflow-hidden font-sans">
            <span className="text-[7.5px] text-slate-555 uppercase tracking-widest font-black block mb-2.5">Tag Length Auditing</span>
            
            <div className="flex-grow flex flex-col justify-center space-y-2.5">
              <div className="space-y-1">
                <div className="flex justify-between text-[9px] font-bold text-slate-350">
                  <span>Title tag length</span>
                  <span className="text-emerald-400 font-mono">58/60 chars</span>
                </div>
                <div className="w-full h-1 bg-slate-900 rounded-full overflow-hidden border border-white/5">
                  <div className="h-full bg-emerald-500 animate-slide-wide" />
                </div>
              </div>

              <div className="space-y-1">
                <div className="flex justify-between text-[9px] font-bold text-slate-350">
                  <span>Meta Description</span>
                  <span className="text-emerald-450 font-mono">142/160 chars</span>
                </div>
                <div className="w-full h-1 bg-slate-900 rounded-full overflow-hidden border border-white/5">
                  <div className="h-full bg-emerald-500 animate-slide-desc" />
                </div>
              </div>
            </div>

            <div className="text-[8px] text-slate-550 border-t border-slate-900/60 pt-2 flex justify-between items-center">
              <span>H1 &gt; H2 &gt; H3 Order: Valid</span>
              <span className="text-teal-400">Headings Structure OK</span>
            </div>
          </div>
        </div>

        <div className="p-2.5 rounded-xl bg-slate-950/80 border border-white/5 flex items-center justify-between text-[8.5px] text-slate-500 font-sans">
          <span>Heading Order: H1 &gt; H2 &gt; H3</span>
          <span className="text-emerald-400 font-bold">Optimal Metadata Found</span>
        </div>

        <style jsx>{`
          @keyframes scanSweep {
            0% { top: 5%; opacity: 0; }
            10% { opacity: 0.8; }
            90% { opacity: 0.8; }
            100% { top: 95%; opacity: 0; }
          }
          @keyframes slideWide { from { width: 0%; } to { width: 96%; } }
          @keyframes slideDesc { from { width: 0%; } to { width: 88%; } }

          .serp-scan { animation: scanSweep 4s linear infinite; }
          .animate-slide-wide { animation: slideWide 1.2s ease-out forwards; }
          .animate-slide-desc { animation: slideDesc 1.2s ease-out forwards; }
        `}</style>
      </div>
    );
  }

  if (type === "content") {
    return (
      <div className="w-full h-full flex flex-col justify-between overflow-hidden select-none font-sans text-xs">
        {/* Mock DevTools tab layout */}
        <div className="flex items-center justify-between border-b border-white/5 pb-2">
          <div className="flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-red-500/30 border border-red-500/50" />
            <span className="w-2 h-2 rounded-full bg-yellow-500/30 border border-yellow-500/50" />
            <span className="w-2 h-2 rounded-full bg-green-500/30 border border-green-500/50" />
          </div>
          <div className="flex gap-2.5 text-[9px] font-extrabold text-slate-500">
            <span className="text-teal-400 border-b border-teal-400 pb-1.5">EEAT Validation</span>
            <span>Readability Score</span>
            <span>Citations List</span>
          </div>
        </div>

        {/* Split Layout: Left (Quality Text Scanner), Right (Credentials & Citations) */}
        <div className="flex-grow grid grid-cols-1 md:grid-cols-12 gap-5 py-4 items-stretch">
          {/* Left: Quality Text Scanner */}
          <div className="md:col-span-6 flex flex-col justify-between h-full bg-slate-950/70 rounded-xl border border-white/5 p-3.5 relative overflow-hidden font-mono text-[9px] leading-relaxed text-slate-400">
            <span className="text-[7.5px] text-slate-500 uppercase tracking-widest font-black font-sans block mb-2">Quality Scanner Highlights</span>
            
            <div className="flex-grow flex flex-col justify-center">
              <p>
                This is a <span className="bg-red-500/10 border-b border-red-500/30 text-red-300 px-0.5 rounded font-bold">very redundant</span> explanation of PDF ciphers. We should <span className="bg-yellow-500/10 border-b border-yellow-500/30 text-yellow-300 px-0.5 rounded font-bold">utilize</span> standards that are approved by authorities to make sure the process is <span className="bg-emerald-500/15 border-b border-emerald-500/40 text-emerald-300 px-0.5 rounded font-bold">highly secure</span>.
              </p>
            </div>
          </div>

          {/* Right: EEAT Credentials & Readability Cards */}
          <div className="md:col-span-6 flex flex-col justify-between h-full bg-slate-950/70 rounded-xl border border-white/5 p-3 relative overflow-hidden font-sans">
            <span className="text-[7.5px] text-slate-555 uppercase tracking-widest font-black block mb-2.5">Author & Citations Checks</span>
            
            <div className="flex-grow flex flex-col justify-center space-y-2.5">
              {/* Author bio block */}
              <div className="p-2 rounded-lg border border-white/5 bg-slate-900/40 flex items-center justify-between relative overflow-hidden">
                <div className="absolute -right-8 -bottom-8 w-16 h-16 rounded-full bg-emerald-500/5 avatar-pulse pointer-events-none" />
                <div className="flex items-center gap-2 relative z-10">
                  <div className="w-7 h-7 rounded-full bg-gradient-to-br from-teal-500/25 to-indigo-500/25 border border-teal-500/30 flex items-center justify-center font-black text-[9px] text-teal-400">
                    DR
                  </div>
                  <div>
                    <h4 className="text-[10px] font-extrabold text-slate-200">Dr. Elena Rostova</h4>
                    <p className="text-[8px] text-slate-500">Medical Content Reviewer</p>
                  </div>
                </div>
                <span className="text-[7.5px] font-black text-emerald-400 bg-emerald-500/10 border border-emerald-500/25 px-1.5 py-0.5 rounded-full relative z-10 whitespace-nowrap">ORCID Bio Match</span>
              </div>

              {/* Citation stats */}
              <div className="grid grid-cols-2 gap-2 text-[9px] font-bold">
                <div className="p-2 rounded-lg bg-slate-900/50 border border-white/5 flex flex-col gap-0.5">
                  <span className="text-slate-500 text-[7px] uppercase tracking-wider font-extrabold">Readability</span>
                  <span className="text-slate-200 font-mono text-[10px]">Flesch: 74</span>
                  <span className="text-[7px] text-emerald-400">Ideal Public</span>
                </div>
                <div className="p-2 rounded-lg bg-slate-900/50 border border-white/5 flex flex-col gap-0.5">
                  <span className="text-slate-500 text-[7px] uppercase tracking-wider font-extrabold">Citations</span>
                  <span className="text-slate-200 font-mono text-[10px]">5 Outbound</span>
                  <span className="text-[7px] text-teal-450">High-Trust</span>
                </div>
              </div>
            </div>

            <div className="text-[8px] text-slate-550 border-t border-slate-900/60 pt-2 flex justify-between items-center font-semibold">
              <span>Topical Clustering: High</span>
              <span className="text-emerald-400">EEAT verified</span>
            </div>
          </div>
        </div>

        <div className="p-2.5 rounded-xl bg-slate-950/80 border border-white/5 flex items-center justify-between text-[8.5px] text-slate-500 font-sans">
          <span>Outbound Citations Domain Score: High</span>
          <span className="text-emerald-400 font-bold">EEAT Trust Verified</span>
        </div>

        <style jsx>{`
          @keyframes radarPulse {
            0%, 100% { transform: scale(1); opacity: 0.1; }
            50% { transform: scale(1.3); opacity: 0.25; }
          }
          .avatar-pulse { animation: radarPulse 3s ease-in-out infinite; }
        `}</style>
      </div>
    );
  }

  if (type === "schema") {
    return (
      <div className="w-full h-full flex flex-col justify-between overflow-hidden select-none font-sans text-xs">
        {/* Mock DevTools tab layout */}
        <div className="flex items-center justify-between border-b border-white/5 pb-2">
          <div className="flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-red-500/30 border border-red-500/50" />
            <span className="w-2 h-2 rounded-full bg-yellow-500/30 border border-yellow-500/50" />
            <span className="w-2 h-2 rounded-full bg-green-500/30 border border-green-500/50" />
          </div>
          <div className="flex gap-2.5 text-[9px] font-extrabold text-slate-500">
            <span className="text-teal-400 border-b border-teal-400 pb-1.5">JSON-LD Code</span>
            <span>Rich Result Snippets</span>
            <span>Errors (0)</span>
          </div>
        </div>

        {/* Split Layout: Left (JSON-LD Code Editor), Right (Google SERP Rich Snippets Engine) */}
        <div className="flex-grow grid grid-cols-1 md:grid-cols-12 gap-5 py-4 items-stretch">
          {/* Left: Code Sandbox with parsing highlights */}
          <div className="md:col-span-6 flex flex-col justify-between h-full bg-slate-950/70 rounded-xl border border-white/5 p-3 relative overflow-hidden font-mono text-[8.5px]">
            <div className="flex items-center justify-between border-b border-slate-900 pb-1.5 mb-2">
              <span className="text-[7.5px] text-slate-500 uppercase tracking-widest font-black font-sans">Schema Source Code</span>
              <span className="text-[7.5px] text-emerald-400 bg-emerald-500/10 px-1.5 py-0.5 rounded border border-emerald-500/20 font-bold uppercase font-sans">✓ JSON Valid</span>
            </div>

            <div className="flex-grow space-y-1 py-1 relative">
              {/* Sweeping parse scanner line */}
              <div className="absolute left-0 right-0 h-[2px] bg-gradient-to-r from-transparent via-teal-500/60 to-transparent code-scanner pointer-events-none z-10" />

              <div>{"{"}</div>
              <div className="pl-3.5"><span className="text-purple-400">&quot;@context&quot;</span>: <span className="text-teal-400">&quot;https://schema.org&quot;</span>,</div>
              <div className="pl-3.5"><span className="text-purple-400">&quot;@type&quot;</span>: <span className="text-teal-400">&quot;Product&quot;</span>,</div>
              <div className="pl-3.5"><span className="text-purple-400">&quot;name&quot;</span>: <span className="text-white font-medium">&quot;SEO Optimised Enterprise&quot;</span>,</div>
              <div className="pl-3.5"><span className="text-purple-400">&quot;aggregateRating&quot;</span>: {"{"}</div>
              <div className="pl-7"><span className="text-purple-400">&quot;ratingValue&quot;</span>: <span className="text-amber-400">&quot;4.9&quot;</span>,</div>
              <div className="pl-7"><span className="text-purple-400">&quot;reviewCount&quot;</span>: <span className="text-amber-400">&quot;184&quot;</span></div>
              <div className="pl-3.5">{"}"},</div>
              <div className="pl-3.5"><span className="text-purple-400">&quot;offers&quot;</span>: {"{"}</div>
              <div className="pl-7"><span className="text-purple-400">&quot;price&quot;</span>: <span className="text-teal-400">&quot;49.00&quot;</span>,</div>
              <div className="pl-7"><span className="text-purple-400">&quot;priceCurrency&quot;</span>: <span className="text-teal-400">&quot;USD&quot;</span></div>
              <div className="pl-3.5">{"}"}</div>
              <div>{"}"}</div>
            </div>

            <div className="mt-2 text-[8px] text-slate-555 border-t border-slate-900/60 pt-2 flex justify-between items-center font-sans font-semibold">
              <span>Required Properties: OK</span>
              <span className="text-teal-400">Context: Valid</span>
            </div>
          </div>

          {/* Right: Google SERP Rich Previews */}
          <div className="md:col-span-6 flex flex-col justify-between h-full bg-slate-950/70 rounded-xl border border-white/5 p-3.5 relative overflow-hidden font-sans">
            <span className="text-[7.5px] text-slate-500 uppercase tracking-widest font-black block mb-2.5">Google Rich Snippets Previews</span>
            
            <div className="flex-grow flex flex-col justify-center space-y-2.5">
              {/* Preview 1: Product Review Rating Snippet */}
              <div className="bg-slate-900/50 p-2.5 rounded-lg border border-white/5 space-y-1 relative group">
                <span className="text-[6.5px] text-slate-550 uppercase tracking-wider font-extrabold block">Product Snippet</span>
                <div className="flex items-center gap-1.5">
                  <span className="text-amber-400 text-xs">★★★★★</span>
                  <span className="text-[8.5px] text-slate-300 font-bold">4.9/5 · 184 reviews</span>
                </div>
                <div className="text-[8.5px] text-slate-400 font-medium">Price: $49.00 USD · In stock</div>
              </div>

              {/* Preview 2: FAQ Dropdown Accordion Snippet */}
              <div className="bg-slate-900/50 p-2.5 rounded-lg border border-white/5 space-y-1.5">
                <span className="text-[6.5px] text-slate-555 uppercase tracking-wider font-extrabold block">FAQ Page Snippet</span>
                <div className="space-y-1">
                  <div className="flex items-center justify-between text-[8px] text-slate-300 font-bold border-b border-slate-800 pb-1">
                    <span>Q: How often is schema audited?</span>
                    <span className="text-teal-400">▾</span>
                  </div>
                  <p className="text-[8px] text-slate-400 leading-relaxed font-medium pt-0.5">
                    Our scanner audits sitemap pathways and tests JSON-LD structure in parallel.
                  </p>
                </div>
              </div>
            </div>

            <div className="mt-2 text-[8px] text-slate-555 border-t border-slate-900/60 pt-2 flex justify-between items-center font-semibold">
              <span>Googlebot Target: Mobile</span>
              <span className="text-emerald-400 flex items-center gap-1">
                ✓ Rich Result Eligible
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
              </span>
            </div>
          </div>
        </div>

        <div className="p-2.5 rounded-xl bg-slate-950/80 border border-white/5 flex items-center justify-between text-[8.5px] text-slate-500 font-sans">
          <span>Schema Checkers: Web/Mobile Crawler</span>
          <span className="text-teal-400 font-bold">100% Parsing Accuracy</span>
        </div>

        <style jsx>{`
          @keyframes scanCode {
            0% { top: 0%; opacity: 0; }
            10% { opacity: 1; }
            90% { opacity: 1; }
            100% { top: 95%; opacity: 0; }
          }
          .code-scanner {
            animation: scanCode 3s infinite linear;
          }
        `}</style>
      </div>
    );
  }

  if (type === "images") {
    return (
      <div className="w-full h-full flex flex-col justify-between overflow-hidden select-none font-sans text-xs">
        {/* Mock DevTools tab layout */}
        <div className="flex items-center justify-between border-b border-white/5 pb-2">
          <div className="flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-red-500/30 border border-red-500/50" />
            <span className="w-2 h-2 rounded-full bg-yellow-500/30 border border-yellow-500/50" />
            <span className="w-2 h-2 rounded-full bg-green-500/30 border border-green-500/50" />
          </div>
          <div className="flex gap-2.5 text-[9px] font-extrabold text-slate-500">
            <span className="text-teal-400 border-b border-teal-400 pb-1.5">Compression Canvas</span>
            <span>CLS Layout Shifts</span>
            <span>Alt Checks</span>
          </div>
        </div>

        {/* Split Layout: Left (Swipe Curtain comparison sandbox), Right (Diagnostics dashboard) */}
        <div className="flex-grow grid grid-cols-1 md:grid-cols-12 gap-5 py-4 items-stretch">
          {/* Left: Code Sandbox with parsing highlights */}
          <div className="md:col-span-6 flex flex-col justify-between h-full bg-slate-950/70 rounded-xl border border-white/5 p-3 relative overflow-hidden font-mono text-[8.5px]">
            <div className="flex items-center justify-between border-b border-slate-900 pb-1.5 mb-2 font-sans">
              <span className="text-[7.5px] text-slate-500 uppercase tracking-widest font-black">Image Comparison Slider</span>
              <span className="text-[7.5px] text-teal-400 bg-teal-500/10 px-1.5 py-0.5 rounded border border-teal-500/20 font-bold uppercase">Optimized AVIF</span>
            </div>

            {/* Swipe Curtain comparison sandbox */}
            <div className="relative w-full h-[140px] rounded-xl bg-slate-950 border border-white/5 overflow-hidden my-1 flex-grow">
              {/* Crisp Right View (AVIF optimized version) */}
              <div className="absolute inset-0 w-full h-full">
                <svg className="w-full h-full" viewBox="0 0 400 120" fill="none" xmlns="http://www.w3.org/2000/svg" preserveAspectRatio="none">
                  {/* Beautiful vector landscape */}
                  <defs>
                    <linearGradient id="avif-sky" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor="#1e1b4b" />
                      <stop offset="100%" stopColor="#311042" />
                    </linearGradient>
                    <linearGradient id="avif-mount1" x1="0" y1="0" x2="1" y2="1">
                      <stop offset="0%" stopColor="#0d9488" />
                      <stop offset="100%" stopColor="#4f46e5" />
                    </linearGradient>
                    <linearGradient id="avif-mount2" x1="0" y1="0" x2="1" y2="1">
                      <stop offset="0%" stopColor="#0ea5e9" />
                      <stop offset="100%" stopColor="#06b6d4" />
                    </linearGradient>
                    <radialGradient id="avif-sun" cx="50%" cy="50%" r="50%">
                      <stop offset="0%" stopColor="#f59e0b" />
                      <stop offset="100%" stopColor="#ea580c" stopOpacity="0" />
                    </radialGradient>
                  </defs>

                  <rect width="400" height="120" fill="url(#avif-sky)" />
                  <circle cx="260" cy="40" r="25" fill="url(#avif-sun)" />
                  <path d="M 0 120 L 140 50 L 220 90 L 320 30 L 400 120 Z" fill="url(#avif-mount1)" opacity="0.85" />
                  <path d="M 70 120 L 210 65 L 340 120 Z" fill="url(#avif-mount2)" opacity="0.65" />
                </svg>
                {/* Info Label Right */}
                <div className="absolute bottom-2 right-2 text-[7px] font-bold text-emerald-400 bg-emerald-950/70 border border-emerald-500/30 px-1.5 py-0.5 rounded select-none z-20">
                  AVIF (86 KB)
                </div>
              </div>

              {/* Blurry Left View (Legacy PNG version) - Clipped by anim width */}
              <div className="absolute inset-0 w-full h-full overflow-hidden legacy-curtain-clip z-10">
                <div className="absolute inset-0 w-full h-full filter blur-[1.8px] grayscale saturate-[30%]">
                  <svg className="w-full h-full" viewBox="0 0 400 120" fill="none" xmlns="http://www.w3.org/2000/svg" preserveAspectRatio="none">
                    <rect width="400" height="120" fill="#1e293b" />
                    <circle cx="260" cy="40" r="25" fill="#475569" />
                    <path d="M 0 120 L 140 50 L 220 90 L 320 30 L 400 120 Z" fill="#334155" opacity="0.85" />
                    <path d="M 70 120 L 210 65 L 340 120 Z" fill="#475569" opacity="0.65" />
                  </svg>
                </div>
                {/* Info Label Left */}
                <div className="absolute bottom-2 left-2 text-[7px] font-bold text-red-400 bg-red-950/70 border border-red-500/30 px-1.5 py-0.5 rounded select-none z-20 whitespace-nowrap">
                  Legacy PNG (1.4 MB)
                </div>
              </div>

              {/* Swiping curtain slide bar handle */}
              <div className="absolute top-0 bottom-0 w-[1px] bg-teal-400 slider-bar-line z-20">
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-4 h-4 rounded-full bg-slate-950 border border-teal-400 flex items-center justify-center text-teal-400 text-[5px] font-black shadow-[0_0_6px_rgba(20,184,166,0.4)]">
                  ⇄
                </div>
              </div>
            </div>

            <div className="mt-2 text-[8px] text-slate-555 border-t border-slate-900/60 pt-2 flex justify-between items-center font-sans font-semibold">
              <span>Alt Attributes: Passed</span>
              <span className="text-teal-400">Preload: Configured</span>
            </div>
          </div>

          {/* Right: Google SERP Rich Previews */}
          <div className="md:col-span-6 flex flex-col justify-between h-full bg-slate-950/70 rounded-xl border border-white/5 p-3.5 relative overflow-hidden font-sans">
            <span className="text-[7.5px] text-slate-550 uppercase tracking-widest font-black block mb-2.5">Image Diagnostics</span>
            
            <div className="flex-grow flex flex-col justify-center space-y-2.5">
              <div className="bg-slate-900/50 p-2.5 rounded-lg border border-white/5 space-y-1">
                <span className="text-[6.5px] text-slate-555 uppercase tracking-wider font-extrabold block">Layout Dimensions Check</span>
                <div className="text-[8.5px] text-slate-300 font-bold flex items-center gap-1.5 pt-0.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 shrink-0" />
                  <span>Width/Height set (CLS fixed)</span>
                </div>
              </div>

              <div className="bg-slate-900/50 p-2.5 rounded-lg border border-white/5 space-y-1">
                <span className="text-[6.5px] text-slate-555 uppercase tracking-wider font-extrabold block">Optimization Outcome</span>
                <div className="text-[8.5px] text-emerald-400 font-bold flex items-center gap-1.5 pt-0.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 shrink-0 animate-pulse" />
                  <span>94% Weight Savings</span>
                </div>
              </div>
            </div>

            <div className="mt-2 text-[8px] text-slate-555 border-t border-slate-900/60 pt-2 flex justify-between items-center font-semibold">
              <span>LCP Element: Preloaded</span>
              <span className="text-emerald-400 flex items-center gap-1">
                ✓ Optimized
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
              </span>
            </div>
          </div>
        </div>

        <div className="p-2.5 rounded-xl bg-slate-950/80 border border-white/5 flex items-center justify-between text-[8.5px] text-slate-500 font-sans">
          <span>Alt Attribute Coverage: 92%</span>
          <span className="text-emerald-400 font-bold">LCP Image Preloaded</span>
        </div>

        <style jsx>{`
          @keyframes sweepCurtain {
            0%, 100% { clip-path: inset(0 97% 0 0); }
            50% { clip-path: inset(0 3% 0 0); }
          }
          @keyframes sweepHandle {
            0%, 100% { left: 3%; }
            50% { left: 97%; }
          }
          .legacy-curtain-clip {
            animation: sweepCurtain 8s ease-in-out infinite;
          }
          .slider-bar-line {
            animation: sweepHandle 8s ease-in-out infinite;
          }
        `}</style>
      </div>
    );
  }

  if (type === "sitemap") {
    return (
      <div className="w-full h-full flex flex-col justify-between overflow-hidden select-none font-sans text-xs">
        {/* Mock DevTools tab layout */}
        <div className="flex items-center justify-between border-b border-white/5 pb-2">
          <div className="flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-red-500/30 border border-red-500/50" />
            <span className="w-2 h-2 rounded-full bg-yellow-500/30 border border-yellow-500/50" />
            <span className="w-2 h-2 rounded-full bg-green-500/30 border border-green-500/50" />
          </div>
          <div className="flex gap-2.5 text-[9px] font-extrabold text-slate-500">
            <span className="text-teal-400 border-b border-teal-400 pb-1.5">Node Graph</span>
            <span>Index Paths</span>
            <span>crawler.log</span>
          </div>
        </div>

        {/* Split Layout: Left (Interactive SVG Node Graph), Right (Crawl Status Dashboard) */}
        <div className="flex-grow grid grid-cols-1 md:grid-cols-12 gap-5 py-4 items-stretch">
          {/* Left: SVG Sitemap Node Graph */}
          <div className="md:col-span-6 flex flex-col justify-between h-full bg-slate-950/70 rounded-xl border border-white/5 p-3 relative overflow-hidden">
            <div className="flex items-center justify-between border-b border-slate-900 pb-1.5 mb-2">
              <span className="text-[7.5px] text-slate-500 uppercase tracking-widest font-black">Sitemap Node Graph</span>
              <span className="text-[7.5px] text-emerald-400 bg-emerald-500/10 px-1.5 py-0.5 rounded border border-emerald-500/20 font-bold uppercase">54 Nodes</span>
            </div>

            <div className="flex-grow flex items-center justify-center relative my-1">
              <svg className="w-full h-full min-h-[160px]" viewBox="0 0 240 180" fill="none" xmlns="http://www.w3.org/2000/svg">
                {/* Grid dot background */}
                <defs>
                  <pattern id="sm-dots" x="0" y="0" width="16" height="16" patternUnits="userSpaceOnUse">
                    <circle cx="1" cy="1" r="0.5" fill="rgba(255,255,255,0.03)" />
                  </pattern>
                </defs>
                <rect width="240" height="180" fill="url(#sm-dots)" />

                {/* ── Connection lines (base tracks) ── */}
                {/* Root → /pages */}
                <path d="M 120 30 L 50 65" stroke="#1e293b" strokeWidth="2" strokeLinecap="round" />
                {/* Root → /products */}
                <path d="M 120 30 L 120 65" stroke="#1e293b" strokeWidth="2" strokeLinecap="round" />
                {/* Root → /blog */}
                <path d="M 120 30 L 190 65" stroke="#1e293b" strokeWidth="2" strokeLinecap="round" />
                {/* /pages → /about */}
                <path d="M 50 65 L 25 110" stroke="#1e293b" strokeWidth="1.5" strokeLinecap="round" />
                {/* /pages → /pricing */}
                <path d="M 50 65 L 70 110" stroke="#1e293b" strokeWidth="1.5" strokeLinecap="round" />
                {/* /products → /product-1 */}
                <path d="M 120 65 L 105 110" stroke="#1e293b" strokeWidth="1.5" strokeLinecap="round" />
                {/* /products → /product-2 */}
                <path d="M 120 65 L 140 110" stroke="#1e293b" strokeWidth="1.5" strokeLinecap="round" />
                {/* /blog → /post-1 */}
                <path d="M 190 65 L 175 110" stroke="#1e293b" strokeWidth="1.5" strokeLinecap="round" />
                {/* /blog → /post-2 */}
                <path d="M 190 65 L 215 110" stroke="#1e293b" strokeWidth="1.5" strokeLinecap="round" />

                {/* ── Animated pulse lines (glowing flows) ── */}
                <path d="M 120 30 L 50 65" stroke="#14b8a6" strokeWidth="1.2" strokeLinecap="round" strokeDasharray="5 5" className="sitemap-flow-1" />
                <path d="M 120 30 L 120 65" stroke="#6366f1" strokeWidth="1.2" strokeLinecap="round" strokeDasharray="5 5" className="sitemap-flow-2" />
                <path d="M 120 30 L 190 65" stroke="#f59e0b" strokeWidth="1.2" strokeLinecap="round" strokeDasharray="5 5" className="sitemap-flow-3" />
                <path d="M 50 65 L 25 110" stroke="#14b8a6" strokeWidth="1" strokeLinecap="round" strokeDasharray="4 4" className="sitemap-flow-4" opacity="0.7" />
                <path d="M 50 65 L 70 110" stroke="#14b8a6" strokeWidth="1" strokeLinecap="round" strokeDasharray="4 4" className="sitemap-flow-5" opacity="0.7" />
                <path d="M 120 65 L 105 110" stroke="#6366f1" strokeWidth="1" strokeLinecap="round" strokeDasharray="4 4" className="sitemap-flow-4" opacity="0.7" />
                <path d="M 120 65 L 140 110" stroke="#6366f1" strokeWidth="1" strokeLinecap="round" strokeDasharray="4 4" className="sitemap-flow-5" opacity="0.7" />
                <path d="M 190 65 L 175 110" stroke="#f59e0b" strokeWidth="1" strokeLinecap="round" strokeDasharray="4 4" className="sitemap-flow-4" opacity="0.7" />
                <path d="M 190 65 L 215 110" stroke="#f59e0b" strokeWidth="1" strokeLinecap="round" strokeDasharray="4 4" className="sitemap-flow-5" opacity="0.7" />

                {/* ── Root Node: sitemap-index.xml ── */}
                <g transform="translate(120, 30)">
                  <circle cx="0" cy="0" r="14" fill="#090d16" stroke="#14b8a6" strokeWidth="1.8" />
                  <circle cx="0" cy="0" r="18" fill="none" stroke="#14b8a6" strokeWidth="0.5" opacity="0.3" className="sitemap-ping" />
                  <svg x="-7" y="-7" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#14b8a6" strokeWidth="2.5" strokeLinecap="round">
                    <path d="M3 9l9-7 9 7v11a2 2 0 01-2 2H5a2 2 0 01-2-2z" />
                    <polyline points="9 22 9 12 15 12 15 22" />
                  </svg>
                </g>
                <text x="120" y="11" fontSize="5.5" fontWeight="900" fill="#94a3b8" textAnchor="middle" fontFamily="sans-serif">INDEX.XML</text>

                {/* ── Level 1 Nodes ── */}
                {/* /pages */}
                <g transform="translate(50, 65)">
                  <circle cx="0" cy="0" r="10" fill="#090d16" stroke="#14b8a6" strokeWidth="1.5" />
                  <text x="0" y="3" fontSize="6" fontWeight="800" fill="#14b8a6" textAnchor="middle" fontFamily="monospace">/p</text>
                </g>
                <text x="50" y="83" fontSize="5" fontWeight="700" fill="#64748b" textAnchor="middle" fontFamily="sans-serif">pages.xml</text>

                {/* /products */}
                <g transform="translate(120, 65)">
                  <circle cx="0" cy="0" r="10" fill="#090d16" stroke="#6366f1" strokeWidth="1.5" />
                  <text x="0" y="3" fontSize="6" fontWeight="800" fill="#6366f1" textAnchor="middle" fontFamily="monospace">/pr</text>
                </g>
                <text x="120" y="83" fontSize="5" fontWeight="700" fill="#64748b" textAnchor="middle" fontFamily="sans-serif">products.xml</text>

                {/* /blog */}
                <g transform="translate(190, 65)">
                  <circle cx="0" cy="0" r="10" fill="#090d16" stroke="#f59e0b" strokeWidth="1.5" />
                  <text x="0" y="3" fontSize="6" fontWeight="800" fill="#f59e0b" textAnchor="middle" fontFamily="monospace">/b</text>
                </g>
                <text x="190" y="83" fontSize="5" fontWeight="700" fill="#64748b" textAnchor="middle" fontFamily="sans-serif">blog.xml</text>

                {/* ── Level 2 Leaf Nodes ── */}
                {/* /about */}
                <circle cx="25" cy="110" r="6" fill="#090d16" stroke="#14b8a680" strokeWidth="1" />
                <circle cx="25" cy="110" r="2" fill="#14b8a6" />
                <text x="25" y="123" fontSize="4.5" fontWeight="600" fill="#475569" textAnchor="middle" fontFamily="monospace">/about</text>

                {/* /pricing */}
                <circle cx="70" cy="110" r="6" fill="#090d16" stroke="#14b8a680" strokeWidth="1" />
                <circle cx="70" cy="110" r="2" fill="#14b8a6" />
                <text x="70" y="123" fontSize="4.5" fontWeight="600" fill="#475569" textAnchor="middle" fontFamily="monospace">/pricing</text>

                {/* /product-1 */}
                <circle cx="105" cy="110" r="6" fill="#090d16" stroke="#6366f180" strokeWidth="1" />
                <circle cx="105" cy="110" r="2" fill="#6366f1" />
                <text x="105" y="123" fontSize="4.5" fontWeight="600" fill="#475569" textAnchor="middle" fontFamily="monospace">/prod-1</text>

                {/* /product-2 */}
                <circle cx="140" cy="110" r="6" fill="#090d16" stroke="#6366f180" strokeWidth="1" />
                <circle cx="140" cy="110" r="2" fill="#6366f1" />
                <text x="140" y="123" fontSize="4.5" fontWeight="600" fill="#475569" textAnchor="middle" fontFamily="monospace">/prod-2</text>

                {/* /post-1 */}
                <circle cx="175" cy="110" r="6" fill="#090d16" stroke="#f59e0b80" strokeWidth="1" />
                <circle cx="175" cy="110" r="2" fill="#f59e0b" />
                <text x="175" y="123" fontSize="4.5" fontWeight="600" fill="#475569" textAnchor="middle" fontFamily="monospace">/post-1</text>

                {/* /post-2 */}
                <circle cx="215" cy="110" r="6" fill="#090d16" stroke="#f59e0b80" strokeWidth="1" />
                <circle cx="215" cy="110" r="2" fill="#f59e0b" />
                <text x="215" y="123" fontSize="4.5" fontWeight="600" fill="#475569" textAnchor="middle" fontFamily="monospace">/post-2</text>

                {/* Summary bar at the bottom */}
                <rect x="15" y="138" width="210" height="22" rx="5" fill="#0f172a" stroke="rgba(255,255,255,0.04)" strokeWidth="1" />
                <circle cx="30" cy="149" r="3" fill="#10b981" opacity="0.8" />
                <text x="38" y="151.5" fontSize="5" fontWeight="700" fill="#64748b" fontFamily="sans-serif">48 Indexed</text>
                <circle cx="100" cy="149" r="3" fill="#f59e0b" opacity="0.8" />
                <text x="108" y="151.5" fontSize="5" fontWeight="700" fill="#64748b" fontFamily="sans-serif">4 Excluded</text>
                <circle cx="170" cy="149" r="3" fill="#ef4444" opacity="0.8" />
                <text x="178" y="151.5" fontSize="5" fontWeight="700" fill="#64748b" fontFamily="sans-serif">2 Errors</text>
              </svg>
            </div>

            <div className="mt-1 text-[8px] text-slate-555 border-t border-slate-900/60 pt-2 flex justify-between items-center font-sans font-semibold">
              <span>Depth: 3 Levels</span>
              <span className="text-teal-400">Auto-Discovery: ON</span>
            </div>
          </div>

          {/* Right: Crawl Status Dashboard */}
          <div className="md:col-span-6 flex flex-col justify-between h-full bg-slate-950/70 rounded-xl border border-white/5 p-3.5 relative overflow-hidden font-sans">
            <span className="text-[7.5px] text-slate-500 uppercase tracking-widest font-black block mb-2.5">Crawl Index Status</span>

            <div className="flex-grow flex flex-col justify-center space-y-1.5">
              {/* Row 1 */}
              <div className="flex items-center justify-between bg-slate-900/40 rounded-lg px-2.5 py-1.5 border border-white/[0.03]">
                <div className="flex items-center gap-1.5 text-[8px] text-slate-300 font-bold font-mono">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 shadow-[0_0_4px_#10b981] shrink-0" />
                  <span>/ (Home)</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-[7px] font-mono text-slate-500">200</span>
                  <span className="text-[7px] text-emerald-400 font-bold bg-emerald-500/10 px-1.5 py-0.5 rounded border border-emerald-500/20">Indexed</span>
                </div>
              </div>

              {/* Row 2 */}
              <div className="flex items-center justify-between bg-slate-900/40 rounded-lg px-2.5 py-1.5 border border-white/[0.03]">
                <div className="flex items-center gap-1.5 text-[8px] text-slate-300 font-bold font-mono">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 shadow-[0_0_4px_#10b981] shrink-0" />
                  <span>/pricing</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-[7px] font-mono text-slate-500">200</span>
                  <span className="text-[7px] text-emerald-400 font-bold bg-emerald-500/10 px-1.5 py-0.5 rounded border border-emerald-500/20">Indexed</span>
                </div>
              </div>

              {/* Row 3 */}
              <div className="flex items-center justify-between bg-slate-900/40 rounded-lg px-2.5 py-1.5 border border-white/[0.03]">
                <div className="flex items-center gap-1.5 text-[8px] text-slate-300 font-bold font-mono">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 shadow-[0_0_4px_#10b981] shrink-0" />
                  <span>/blog/seo-guide</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-[7px] font-mono text-slate-500">200</span>
                  <span className="text-[7px] text-emerald-400 font-bold bg-emerald-500/10 px-1.5 py-0.5 rounded border border-emerald-500/20">Indexed</span>
                </div>
              </div>

              {/* Row 4 - Redirect */}
              <div className="flex items-center justify-between bg-slate-900/40 rounded-lg px-2.5 py-1.5 border border-white/[0.03]">
                <div className="flex items-center gap-1.5 text-[8px] text-slate-300 font-bold font-mono">
                  <span className="w-1.5 h-1.5 rounded-full bg-amber-500 shadow-[0_0_4px_#f59e0b] shrink-0" />
                  <span>/old-page</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-[7px] font-mono text-slate-500">301</span>
                  <span className="text-[7px] text-amber-400 font-bold bg-amber-500/10 px-1.5 py-0.5 rounded border border-amber-500/20">Redirect</span>
                </div>
              </div>

              {/* Row 5 - Excluded */}
              <div className="flex items-center justify-between bg-slate-900/40 rounded-lg px-2.5 py-1.5 border border-white/[0.03]">
                <div className="flex items-center gap-1.5 text-[8px] text-slate-300 font-bold font-mono">
                  <span className="w-1.5 h-1.5 rounded-full bg-red-500 shadow-[0_0_4px_#ef4444] shrink-0" />
                  <span>/admin/dashboard</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-[7px] font-mono text-slate-500">noindex</span>
                  <span className="text-[7px] text-red-400 font-bold bg-red-500/10 px-1.5 py-0.5 rounded border border-red-500/20">Excluded</span>
                </div>
              </div>
            </div>

            <div className="mt-2 text-[8px] text-slate-555 border-t border-slate-900/60 pt-2 flex justify-between items-center font-semibold">
              <span>Last Crawl: 2m ago</span>
              <span className="text-emerald-400 flex items-center gap-1">
                ✓ robots.txt Verified
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
              </span>
            </div>
          </div>
        </div>

        <div className="p-2.5 rounded-xl bg-slate-950/80 border border-white/5 flex items-center justify-between text-[8.5px] text-slate-500 font-sans">
          <span>Synced XML Nodes: 54 / 54</span>
          <span className="text-emerald-400 font-bold">Sitemap Indexing Verified</span>
        </div>

        <style jsx>{`
          @keyframes sitemapDash {
            0% { stroke-dashoffset: 0; }
            100% { stroke-dashoffset: -20; }
          }
          @keyframes sitemapPing {
            0% { r: 14; opacity: 0.4; }
            100% { r: 24; opacity: 0; }
          }
          .sitemap-flow-1 { animation: sitemapDash 1.5s linear infinite; }
          .sitemap-flow-2 { animation: sitemapDash 1.8s linear infinite; animation-delay: 0.3s; }
          .sitemap-flow-3 { animation: sitemapDash 2s linear infinite; animation-delay: 0.6s; }
          .sitemap-flow-4 { animation: sitemapDash 2.2s linear infinite; animation-delay: 0.9s; }
          .sitemap-flow-5 { animation: sitemapDash 2.4s linear infinite; animation-delay: 1.2s; }
          .sitemap-ping { animation: sitemapPing 2s ease-out infinite; }
        `}</style>
      </div>
    );
  }

  if (type === "ai") {
    return (
      <div className="w-full h-full flex flex-col justify-between overflow-hidden select-none font-sans">
        {/* Mock DevTools tab layout */}
        <div className="flex items-center justify-between border-b border-white/5 pb-2">
          <div className="flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-red-500/30 border border-red-500/50" />
            <span className="w-2 h-2 rounded-full bg-yellow-500/30 border border-yellow-500/50" />
            <span className="w-2 h-2 rounded-full bg-green-500/30 border border-green-500/50" />
          </div>
          <div className="flex gap-2.5 text-[9px] font-extrabold text-slate-500">
            <span className="text-teal-400 border-b border-teal-400 pb-1.5">AI Citations Graph</span>
            <span>LLM Visibility Scores</span>
            <span>Crawler logs</span>
          </div>
        </div>

        {/* Split Layout: Left (Chatbot connection graph), Right (AI engines index stats checklist) */}
        <div className="flex-grow grid grid-cols-1 md:grid-cols-12 gap-5 py-4 items-stretch">
          {/* Left: Chatbot connection graph (md:col-span-6) */}
          <div className="md:col-span-6 flex flex-col justify-between h-full bg-slate-950/70 rounded-xl border border-white/5 p-2 relative overflow-hidden">
            <div className="flex items-center justify-between border-b border-slate-900 pb-1.5 mb-1 px-1.5">
              <span className="text-[7.5px] text-slate-500 uppercase tracking-widest font-black">Connection Topology</span>
              <span className="text-[7.5px] text-emerald-400 bg-emerald-500/10 px-1.5 py-0.5 rounded border border-emerald-500/20 font-bold uppercase">5 LLMs</span>
            </div>
            
            <div className="relative flex-grow w-full flex items-center justify-center overflow-hidden">
              <svg className="w-full" viewBox="0 0 340 150" preserveAspectRatio="xMidYMid meet" fill="none" xmlns="http://www.w3.org/2000/svg">
                {/* ── Connection lines (base tracks) from center hub to each LLM ── */}
                <path d="M 170 105 C 170 75, 45 75, 45 45" stroke="#1e293b" strokeWidth="2" strokeLinecap="round" />
                <path d="M 170 105 C 170 70, 115 70, 115 40" stroke="#1e293b" strokeWidth="2" strokeLinecap="round" />
                <path d="M 170 105 L 170 55" stroke="#1e293b" strokeWidth="2" strokeLinecap="round" />
                <path d="M 170 105 C 170 70, 225 70, 225 40" stroke="#1e293b" strokeWidth="2" strokeLinecap="round" />
                <path d="M 170 105 C 170 75, 295 75, 295 45" stroke="#1e293b" strokeWidth="2" strokeLinecap="round" />

                {/* ── Glowing animated flow lines ── */}
                <path d="M 170 105 C 170 75, 45 75, 45 45" stroke="#10b981" strokeWidth="1.2" strokeLinecap="round" strokeDasharray="5 5" className="flow-dash-green" />
                <path d="M 170 105 C 170 70, 115 70, 115 40" stroke="#8b5cf6" strokeWidth="1.2" strokeLinecap="round" strokeDasharray="5 5" className="flow-dash-purple" />
                <path d="M 170 105 L 170 55" stroke="#3b82f6" strokeWidth="1.2" strokeLinecap="round" strokeDasharray="5 5" className="flow-dash-blue" />
                <path d="M 170 105 C 170 70, 225 70, 225 40" stroke="#f97316" strokeWidth="1.2" strokeLinecap="round" strokeDasharray="5 5" className="flow-dash-orange" />
                <path d="M 170 105 C 170 75, 295 75, 295 45" stroke="#14b8a6" strokeWidth="1.2" strokeLinecap="round" strokeDasharray="5 5" className="flow-dash-teal" />

                {/* ── Branch merge nodes ── */}
                <circle cx="170" cy="80" r="2.5" fill="#3b82f6" stroke="#1e293b" strokeWidth="1" />
                <circle cx="100" cy="75" r="2.5" fill="#10b981" stroke="#1e293b" strokeWidth="1" />
                <circle cx="240" cy="75" r="2.5" fill="#14b8a6" stroke="#1e293b" strokeWidth="1" />

                {/* ── Central Hub: YOUR SITE ── */}
                <g transform="translate(170, 105)">
                  <circle cx="0" cy="0" r="14" fill="#090d16" stroke="#14b8a6" strokeWidth="1.8" />
                  <circle cx="0" cy="0" r="18" fill="none" stroke="#14b8a6" strokeWidth="0.5" opacity="0.25" className="ai-hub-ping" />
                  <svg x="-8" y="-8" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#14b8a6" strokeWidth="2.2">
                    <circle cx="12" cy="12" r="10" />
                    <path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z" />
                    <path d="M2 12h20" />
                  </svg>
                </g>
                <text x="170" y="132" fontSize="6.5" fontWeight="900" fill="#94a3b8" textAnchor="middle" fontFamily="sans-serif">YOUR SITE</text>

                {/* ── LLM Node: ChatGPT ── */}
                <g transform="translate(45, 32)" className="float-node-green">
                  <circle cx="0" cy="0" r="12" fill="#022c22" stroke="#10b981" strokeWidth="1.5" />
                  <svg x="-8" y="-8" width="16" height="16" viewBox="0 0 16 16" fill="#10b981">
                    <path d="M14.949 6.547a3.94 3.94 0 0 0-.348-3.273 4.11 4.11 0 0 0-4.4-1.934A4.1 4.1 0 0 0 8.423.2 4.15 4.15 0 0 0 6.305.086a4.1 4.1 0 0 0-1.891.948 4.04 4.04 0 0 0-1.158 1.753 4.1 4.1 0 0 0-1.563.679A4 4 0 0 0 .554 4.72a3.99 3.99 0 0 0 .502 4.731 3.94 3.94 0 0 0 .346 3.274 4.11 4.11 0 0 0 4.402 1.933c.382.425.852.764 1.377.995.526.231 1.095.35 1.67.346 1.78.002 3.358-1.132 3.901-2.804a4.1 4.1 0 0 0 1.563-.68 4 4 0 0 0 1.14-1.253 3.99 3.99 0 0 0-.506-4.716" />
                  </svg>
                </g>
                <text x="45" y="53" fontSize="6" fontWeight="800" fill="#10b981" textAnchor="middle" fontFamily="sans-serif">ChatGPT</text>

                {/* ── LLM Node: Gemini ── */}
                <g transform="translate(115, 27)" className="float-node-purple">
                  <circle cx="0" cy="0" r="12" fill="#1e1b4b" stroke="#8b5cf6" strokeWidth="1.5" />
                  <svg x="-8" y="-8" width="16" height="16" viewBox="0 0 24 24">
                    <path d="M12 2C12 7.5 16.5 12 22 12C16.5 12 12 16.5 12 22C12 16.5 7.5 12 2 12C7.5 12 12 7.5 12 2Z" fill="#a78bfa" />
                    <path d="M19 5c0 2-1.5 3-3.5 3.5 2 0 3.5 1.5 3.5 3.5 0-2 1.5-3.5 3.5-3.5-2 0-3.5-1.5-3.5-3.5z" fill="#a78bfa" opacity="0.8" />
                  </svg>
                </g>
                <text x="115" y="48" fontSize="6" fontWeight="800" fill="#8b5cf6" textAnchor="middle" fontFamily="sans-serif">Gemini</text>

                {/* ── LLM Node: Meta AI (center top) ── */}
                <g transform="translate(170, 22)" className="float-node-blue">
                  <circle cx="0" cy="0" r="12" fill="#07224f" stroke="#3b82f6" strokeWidth="1.5" />
                  <svg x="-8" y="-8" width="16" height="16" viewBox="0 0 24 24" fill="none">
                    <circle cx="12" cy="12" r="9" stroke="url(#meta-grad)" strokeWidth="2.8" />
                    <path d="M12 3a9 9 0 0 1 9 9" stroke="#3b82f6" strokeWidth="3" strokeLinecap="round" />
                    <defs>
                      <linearGradient id="meta-grad" x1="0%" y1="0%" x2="100%" y2="100%">
                        <stop offset="0%" stopColor="#3b82f6" />
                        <stop offset="50%" stopColor="#8b5cf6" />
                        <stop offset="100%" stopColor="#06b6d4" />
                      </linearGradient>
                    </defs>
                  </svg>
                </g>
                <text x="170" y="43" fontSize="6" fontWeight="800" fill="#3b82f6" textAnchor="middle" fontFamily="sans-serif">Meta AI</text>

                {/* ── LLM Node: Claude ── */}
                <g transform="translate(225, 27)" className="float-node-orange">
                  <circle cx="0" cy="0" r="12" fill="#2c1001" stroke="#f97316" strokeWidth="1.5" />
                  <svg x="-8" y="-8" width="16" height="16" viewBox="0 0 24 24" fill="#f97316">
                    <path d="m4.7144 15.9555 4.7174-2.6471.079-.2307-.079-.1275h-.2307l-.7893-.0486-2.6956-.0729-2.3375-.0971-2.2646-.1214-.5707-.1215-.5343-.7042.0546-.3522.4797-.3218.686.0608 1.5179.1032 2.2767.1578 1.6514.0972 2.4468.255h.3886l.0546-.1579-.1336-.0971-.1032-.0972L6.973 9.8356l-2.55-1.6879-1.3356-.9714-.7225-.4918-.3643-.4614-.1578-1.0078.6557-.7225.8803.0607.2246.0607.8925.686 1.9064 1.4754 2.4893 1.8336.3643.3035.1457-.1032.0182-.0728-.164-.2733-1.3539-2.4467-1.445-2.4893-.6435-1.032-.17-.6194c-.0607-.255-.1032-.4674-.1032-.7285L6.287.1335 6.6997 0l.9957.1336.419.3642.6192 1.4147 1.0018 2.2282 1.5543 3.0296.4553.8985.2429.8318.091.255h.1579v-.1457l.1275-1.706.2368-2.0947.2307-2.6957.0789-.7589.3764-.9107.7468-.4918.5828.2793.4797.686-.0668.4433-.2853 1.8517-.5586 2.9021-.3643 1.9429h.2125l.2429-.2429.9835-1.3053 1.6514-2.0643.7286-.8196.85-.9046.5464-.4311h1.0321l.759 1.1293-.34 1.1657-1.0625 1.3478-.8804 1.1414-1.2628 1.7-.7893 1.36.0729.1093.1882-.0183 2.8535-.607 1.5421-.2794 1.8396-.3157.8318.3886.091.3946-.3278.8075-1.967.4857-2.3072.4614-3.4364.8136-.0425.0304.0486.0607 1.5482.1457.6618.0364h1.621l3.0175.2247.7892.522.4736.6376-.079.4857-1.2142.6193-1.6393-.3886-3.825-.9107-1.3113-.3279h-.1822v.1093l1.0929 1.0686 2.0035 1.8092 2.5075 2.3314.1275.5768-.3218.4554-.34-.0486-2.2039-1.6575-.85-.7468-1.9246-1.621h-.1275v.17l.4432.6496 2.3436 3.5214.1214 1.0807-.17.3521-.6071.2125-.6679-.1214-1.3721-1.9246L14.38 17.959l-1.1414-1.9428-.1397.079-.674 7.2552-.3156.3703-.7286.2793-.6071-.4614-.3218-.7468.3218-1.4753.3886-1.9246.3157-1.53.2853-1.9004.17-.6314-.0121-.0425-.1397.0182-1.4328 1.9672-2.1796 2.9446-1.7243 1.8456-.4128.164-.7164-.3704.0667-.6618.4008-.5889 2.386-3.0357 1.4389-1.882.929-1.0868-.0062-.1579h-.0546l-6.3385 4.1164-1.1293.1457-.4857-.4554.0608-.7467.2307-.2429 1.9064-1.3114" />
                  </svg>
                </g>
                <text x="225" y="48" fontSize="6" fontWeight="800" fill="#f97316" textAnchor="middle" fontFamily="sans-serif">Claude</text>

                {/* ── LLM Node: Perplexity ── */}
                <g transform="translate(295, 32)" className="float-node-teal">
                  <circle cx="0" cy="0" r="12" fill="#042f2e" stroke="#14b8a6" strokeWidth="1.5" />
                  <svg x="-8" y="-8" width="16" height="16" viewBox="0 0 16 16" fill="#14b8a6">
                    <path fillRule="evenodd" d="M8 .188a.5.5 0 0 1 .503.5V4.03l3.022-2.92.059-.048a.51.51 0 0 1 .49-.054.5.5 0 0 1 .306.46v3.247h1.117l.1.01a.5.5 0 0 1 .403.49v5.558a.5.5 0 0 1-.503.5H12.38v3.258a.5.5 0 0 1-.312.462.51.51 0 0 1-.55-.11l-3.016-3.018v3.448c0 .275-.225.5-.503.5a.5.5 0 0 1-.503-.5v-3.448l-3.018 3.019a.51.51 0 0 1-.548.11.5.5 0 0 1-.312-.463v-3.258H2.503a.5.5 0 0 1-.503-.5V5.215l.01-.1c.047-.229.25-.4.493-.4H3.62V1.469l.006-.074a.5.5 0 0 1 .302-.387.51.51 0 0 1 .547.102l3.023 2.92V.687c0-.276.225-.5.503-.5" />
                  </svg>
                </g>
                <text x="295" y="53" fontSize="6" fontWeight="800" fill="#14b8a6" textAnchor="middle" fontFamily="sans-serif">Perplexity</text>
              </svg>
            </div>

            <div className="mt-1 text-[8px] text-slate-555 border-t border-slate-900/60 pt-2 flex justify-between items-center font-sans font-semibold px-1.5">
              <span>Agentic Search: Mapped</span>
              <span className="text-teal-400">LLM Bots: Allowed</span>
            </div>
          </div>

          {/* Right: AI engines branded visibility cards (md:col-span-6) */}
          <div className="md:col-span-6 flex flex-col justify-between h-full bg-slate-950/70 rounded-xl border border-white/5 p-3.5 relative overflow-hidden font-sans">
            <span className="text-[7.5px] text-slate-500 uppercase tracking-widest font-black block mb-2.5">LLM Visibility Index</span>
            
            <div className="flex-grow flex flex-col justify-center space-y-1.5">
              {/* ChatGPT */}
              <div className="bg-slate-900/40 rounded-lg px-2.5 py-1.5 border border-white/[0.03] space-y-1">
                <div className="flex items-center justify-between">
                  <span className="flex items-center gap-1.5 text-[8px] font-bold text-slate-300">
                    <span className="w-2 h-2 rounded-full bg-emerald-500/20 border border-emerald-500/40 flex items-center justify-center"><span className="w-1 h-1 rounded-full bg-emerald-500" /></span>
                    ChatGPT Citations
                  </span>
                  <span className="text-[7px] text-emerald-400 font-bold">92%</span>
                </div>
                <div className="w-full h-1 bg-slate-800 rounded-full overflow-hidden"><div className="h-full bg-emerald-500 rounded-full ai-bar-1" /></div>
              </div>

              {/* Gemini */}
              <div className="bg-slate-900/40 rounded-lg px-2.5 py-1.5 border border-white/[0.03] space-y-1">
                <div className="flex items-center justify-between">
                  <span className="flex items-center gap-1.5 text-[8px] font-bold text-slate-300">
                    <span className="w-2 h-2 rounded-full bg-violet-500/20 border border-violet-500/40 flex items-center justify-center"><span className="w-1 h-1 rounded-full bg-violet-500" /></span>
                    Gemini Knowledge
                  </span>
                  <span className="text-[7px] text-violet-400 font-bold">88%</span>
                </div>
                <div className="w-full h-1 bg-slate-800 rounded-full overflow-hidden"><div className="h-full bg-violet-500 rounded-full ai-bar-2" /></div>
              </div>

              {/* Claude */}
              <div className="bg-slate-900/40 rounded-lg px-2.5 py-1.5 border border-white/[0.03] space-y-1">
                <div className="flex items-center justify-between">
                  <span className="flex items-center gap-1.5 text-[8px] font-bold text-slate-300">
                    <span className="w-2 h-2 rounded-full bg-orange-500/20 border border-orange-500/40 flex items-center justify-center"><span className="w-1 h-1 rounded-full bg-orange-500" /></span>
                    Claude Sources
                  </span>
                  <span className="text-[7px] text-orange-400 font-bold">85%</span>
                </div>
                <div className="w-full h-1 bg-slate-800 rounded-full overflow-hidden"><div className="h-full bg-orange-500 rounded-full ai-bar-3" /></div>
              </div>

              {/* Perplexity */}
              <div className="bg-slate-900/40 rounded-lg px-2.5 py-1.5 border border-white/[0.03] space-y-1">
                <div className="flex items-center justify-between">
                  <span className="flex items-center gap-1.5 text-[8px] font-bold text-slate-300">
                    <span className="w-2 h-2 rounded-full bg-teal-500/20 border border-teal-500/40 flex items-center justify-center"><span className="w-1 h-1 rounded-full bg-teal-500" /></span>
                    Perplexity Index
                  </span>
                  <span className="text-[7px] text-teal-400 font-bold">79%</span>
                </div>
                <div className="w-full h-1 bg-slate-800 rounded-full overflow-hidden"><div className="h-full bg-teal-500 rounded-full ai-bar-4" /></div>
              </div>

              {/* Meta AI */}
              <div className="bg-slate-900/40 rounded-lg px-2.5 py-1.5 border border-white/[0.03] space-y-1">
                <div className="flex items-center justify-between">
                  <span className="flex items-center gap-1.5 text-[8px] font-bold text-slate-300">
                    <span className="w-2 h-2 rounded-full bg-blue-500/20 border border-blue-500/40 flex items-center justify-center"><span className="w-1 h-1 rounded-full bg-blue-500" /></span>
                    Meta AI Graph
                  </span>
                  <span className="text-[7px] text-blue-400 font-bold">74%</span>
                </div>
                <div className="w-full h-1 bg-slate-800 rounded-full overflow-hidden"><div className="h-full bg-blue-500 rounded-full ai-bar-5" /></div>
              </div>
            </div>

            <div className="mt-2 text-[8px] text-slate-555 border-t border-slate-900/60 pt-2 flex justify-between items-center font-semibold">
              <span>GEO Score: Strong</span>
              <span className="text-emerald-400 flex items-center gap-1">
                ✓ Citations Synced
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
              </span>
            </div>
          </div>
        </div>

        <div className="p-2.5 rounded-xl bg-slate-950/80 border border-white/5 flex items-center justify-between text-[8.5px] text-slate-500 font-sans">
          <span>AI Citations Indexed: Strong</span>
          <span className="text-emerald-400 font-bold">Citations Synced (100%)</span>
        </div>

        <style jsx>{`
          @keyframes aiDash { 0% { stroke-dashoffset: 0; } 100% { stroke-dashoffset: -20; } }
          @keyframes aiBarFill1 { from { width: 0%; } to { width: 92%; } }
          @keyframes aiBarFill2 { from { width: 0%; } to { width: 88%; } }
          @keyframes aiBarFill3 { from { width: 0%; } to { width: 85%; } }
          @keyframes aiBarFill4 { from { width: 0%; } to { width: 79%; } }
          @keyframes aiBarFill5 { from { width: 0%; } to { width: 74%; } }
          @keyframes aiFloat1 { 0%,100% { transform: translate(45px, 32px) translateY(0); } 50% { transform: translate(45px, 32px) translateY(-4px); } }
          @keyframes aiFloat2 { 0%,100% { transform: translate(115px, 27px) translateY(0); } 50% { transform: translate(115px, 27px) translateY(-3px); } }
          @keyframes aiFloat3 { 0%,100% { transform: translate(170px, 22px) translateY(0); } 50% { transform: translate(170px, 22px) translateY(-3px); } }
          @keyframes aiFloat4 { 0%,100% { transform: translate(225px, 27px) translateY(0); } 50% { transform: translate(225px, 27px) translateY(-3px); } }
          @keyframes aiFloat5 { 0%,100% { transform: translate(295px, 32px) translateY(0); } 50% { transform: translate(295px, 32px) translateY(-4px); } }

          .flow-dash-green, .ai-flow-1 { animation: aiDash 4s linear infinite; }
          .flow-dash-purple, .ai-flow-2 { animation: aiDash 5s linear infinite; }
          .flow-dash-blue, .ai-flow-3 { animation: aiDash 3.5s linear infinite; }
          .flow-dash-orange, .ai-flow-4 { animation: aiDash 6s linear infinite; }
          .flow-dash-teal, .ai-flow-5 { animation: aiDash 4.5s linear infinite; }
          .ai-bar-1 { animation: aiBarFill1 1.2s ease-out forwards; }
          .ai-bar-2 { animation: aiBarFill2 1.2s ease-out forwards; animation-delay: 0.15s; width: 0%; }
          .ai-bar-3 { animation: aiBarFill3 1.2s ease-out forwards; animation-delay: 0.3s; width: 0%; }
          .ai-bar-4 { animation: aiBarFill4 1.2s ease-out forwards; animation-delay: 0.45s; width: 0%; }
          .ai-bar-5 { animation: aiBarFill5 1.2s ease-out forwards; animation-delay: 0.6s; width: 0%; }
          .float-node-green, .ai-float-1 { animation: aiFloat1 4s ease-in-out infinite; }
          .float-node-purple, .ai-float-2 { animation: aiFloat2 4.5s ease-in-out infinite; }
          .float-node-blue, .ai-float-3 { animation: aiFloat3 4.8s ease-in-out infinite; }
          .float-node-orange, .ai-float-4 { animation: aiFloat4 4.2s ease-in-out infinite; }
          .float-node-teal, .ai-float-5 { animation: aiFloat5 3.8s ease-in-out infinite; }
        `}</style>
      </div>
    );
  }

  if (type === "sxo") {
    return (
      <div className="w-full h-full flex flex-col justify-between overflow-hidden select-none font-sans text-xs">
        {/* Mock DevTools tab layout */}
        <div className="flex items-center justify-between border-b border-white/5 pb-2">
          <div className="flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-red-500/30 border border-red-500/50" />
            <span className="w-2 h-2 rounded-full bg-yellow-500/30 border border-yellow-500/50" />
            <span className="w-2 h-2 rounded-full bg-green-500/30 border border-green-500/50" />
          </div>
          <div className="flex gap-2.5 text-[9px] font-extrabold text-slate-500">
            <span className="text-teal-400 border-b border-teal-400 pb-1.5">Tap Targets</span>
            <span>CLS Offsets</span>
            <span>Diagnostics</span>
          </div>
        </div>

        {/* Split Layout: Left (Interactive SVG Touch Target Map), Right (Usability Metrics) */}
        <div className="flex-grow grid grid-cols-1 md:grid-cols-12 gap-5 py-4 items-stretch">
          {/* Left: SVG Touch Target Spacing Map */}
          <div className="md:col-span-6 flex flex-col justify-between h-full bg-slate-950/70 rounded-xl border border-white/5 p-3 relative overflow-hidden">
            <div className="flex items-center justify-between border-b border-slate-900 pb-1.5 mb-2">
              <span className="text-[7.5px] text-slate-500 uppercase tracking-widest font-black">Touch Target Map</span>
              <span className="text-[7.5px] text-emerald-400 bg-emerald-500/10 px-1.5 py-0.5 rounded border border-emerald-500/20 font-bold uppercase">Pass</span>
            </div>

            <div className="flex-grow flex items-center justify-center relative my-1">
              <svg className="w-full h-full min-h-[160px]" viewBox="0 0 220 160" fill="none" xmlns="http://www.w3.org/2000/svg">
                {/* Grid dot background */}
                <defs>
                  <pattern id="sxo-dots" x="0" y="0" width="12" height="12" patternUnits="userSpaceOnUse">
                    <circle cx="1" cy="1" r="0.5" fill="rgba(20,184,166,0.06)" />
                  </pattern>
                </defs>
                <rect width="220" height="160" fill="url(#sxo-dots)" />

                {/* ── Button 1: Primary CTA ── */}
                <rect x="30" y="20" width="72" height="28" rx="6" fill="#0f172a" stroke="#14b8a6" strokeWidth="1.2" />
                <text x="66" y="37" fontSize="6" fontWeight="800" fill="#14b8a6" textAnchor="middle" fontFamily="sans-serif">Sign Up Free</text>
                {/* Dimension lines */}
                <line x1="30" y1="16" x2="102" y2="16" stroke="#14b8a640" strokeWidth="0.5" strokeDasharray="2 2" />
                <text x="66" y="13" fontSize="4.5" fontWeight="700" fill="#475569" textAnchor="middle" fontFamily="monospace">72px</text>
                <line x1="106" y1="20" x2="106" y2="48" stroke="#14b8a640" strokeWidth="0.5" strokeDasharray="2 2" />
                <text x="114" y="37" fontSize="4.5" fontWeight="700" fill="#475569" textAnchor="middle" fontFamily="monospace">28px</text>
                {/* Tap ripple animation */}
                <circle cx="66" cy="34" r="6" fill="none" stroke="#14b8a6" strokeWidth="0.6" className="sxo-ripple-1" />
                <circle cx="66" cy="34" r="10" fill="none" stroke="#14b8a6" strokeWidth="0.4" className="sxo-ripple-2" />

                {/* ── Spacing measurement between buttons ── */}
                <line x1="66" y1="48" x2="66" y2="62" stroke="#10b981" strokeWidth="0.8" strokeDasharray="3 2" />
                <rect x="46" y="52" width="40" height="10" rx="3" fill="#022c22" stroke="#10b981" strokeWidth="0.6" />
                <text x="66" y="59" fontSize="5" fontWeight="800" fill="#10b981" textAnchor="middle" fontFamily="monospace">12px ✓</text>

                {/* ── Button 2: Secondary ── */}
                <rect x="30" y="62" width="72" height="28" rx="6" fill="#0f172a" stroke="#6366f1" strokeWidth="1.2" />
                <text x="66" y="79" fontSize="6" fontWeight="800" fill="#6366f1" textAnchor="middle" fontFamily="sans-serif">Learn More</text>
                {/* Tap ripple */}
                <circle cx="66" cy="76" r="6" fill="none" stroke="#6366f1" strokeWidth="0.6" className="sxo-ripple-3" />

                {/* ── Button 3: Nav Link ── */}
                <rect x="130" y="30" width="60" height="24" rx="5" fill="#0f172a" stroke="#f59e0b" strokeWidth="1.2" />
                <text x="160" y="45" fontSize="5.5" fontWeight="800" fill="#f59e0b" textAnchor="middle" fontFamily="sans-serif">Pricing →</text>
                {/* Dimension lines */}
                <line x1="130" y1="26" x2="190" y2="26" stroke="#f59e0b40" strokeWidth="0.5" strokeDasharray="2 2" />
                <text x="160" y="23" fontSize="4.5" fontWeight="700" fill="#475569" textAnchor="middle" fontFamily="monospace">60px</text>

                {/* ── Collision Zone Warning ── */}
                <rect x="130" y="70" width="60" height="20" rx="4" fill="#0f172a" stroke="#ef4444" strokeWidth="1" strokeDasharray="3 2" />
                <text x="160" y="83" fontSize="5" fontWeight="700" fill="#ef4444" textAnchor="middle" fontFamily="sans-serif">Too Close!</text>
                <rect x="130" y="92" width="60" height="20" rx="4" fill="#0f172a" stroke="#ef4444" strokeWidth="1" strokeDasharray="3 2" />
                <text x="160" y="105" fontSize="5" fontWeight="700" fill="#ef4444" textAnchor="middle" fontFamily="sans-serif">Overlap Risk</text>
                {/* Spacing alert */}
                <line x1="160" y1="90" x2="160" y2="92" stroke="#ef4444" strokeWidth="0.8" />
                <rect x="143" y="88" width="34" height="8" rx="2" fill="#450a0a" stroke="#ef4444" strokeWidth="0.5" />
                <text x="160" y="93.5" fontSize="4" fontWeight="800" fill="#ef4444" textAnchor="middle" fontFamily="monospace">2px ✗</text>

                {/* ── Finger cursor icon ── */}
                <g className="sxo-cursor">
                  <circle cx="66" cy="34" r="3" fill="#14b8a6" opacity="0.6" />
                  <circle cx="66" cy="34" r="1.5" fill="#14b8a6" />
                </g>

                {/* Summary bar */}
                <rect x="15" y="130" width="190" height="20" rx="5" fill="#0f172a" stroke="rgba(255,255,255,0.04)" strokeWidth="1" />
                <circle cx="30" cy="140" r="3" fill="#10b981" opacity="0.8" />
                <text x="38" y="142.5" fontSize="5" fontWeight="700" fill="#64748b" fontFamily="sans-serif">8 Pass</text>
                <circle cx="85" cy="140" r="3" fill="#f59e0b" opacity="0.8" />
                <text x="93" y="142.5" fontSize="5" fontWeight="700" fill="#64748b" fontFamily="sans-serif">1 Warning</text>
                <circle cx="150" cy="140" r="3" fill="#ef4444" opacity="0.8" />
                <text x="158" y="142.5" fontSize="5" fontWeight="700" fill="#64748b" fontFamily="sans-serif">1 Fail</text>
              </svg>
            </div>

            <div className="mt-1 text-[8px] text-slate-555 border-t border-slate-900/60 pt-2 flex justify-between items-center font-sans font-semibold">
              <span>Min Target: 48×48px</span>
              <span className="text-teal-400">Min Spacing: 8px</span>
            </div>
          </div>

          {/* Right: Usability Metrics Dashboard */}
          <div className="md:col-span-6 flex flex-col justify-between h-full bg-slate-950/70 rounded-xl border border-white/5 p-3.5 relative overflow-hidden font-sans">
            <span className="text-[7.5px] text-slate-500 uppercase tracking-widest font-black block mb-2.5">Usability Metrics</span>
            
            <div className="flex-grow flex flex-col justify-center space-y-1.5">
              {/* Touch Targets */}
              <div className="bg-slate-900/40 rounded-lg px-2.5 py-1.5 border border-white/[0.03] space-y-1">
                <div className="flex items-center justify-between">
                  <span className="text-[8px] font-bold text-slate-300">Touch Target Sizes</span>
                  <span className="text-[7px] text-emerald-400 font-bold bg-emerald-500/10 px-1.5 py-0.5 rounded border border-emerald-500/20">100%</span>
                </div>
                <div className="w-full h-1 bg-slate-800 rounded-full overflow-hidden"><div className="h-full bg-emerald-500 rounded-full sxo-bar-1" /></div>
              </div>

              {/* Interactive Padding */}
              <div className="bg-slate-900/40 rounded-lg px-2.5 py-1.5 border border-white/[0.03] space-y-1">
                <div className="flex items-center justify-between">
                  <span className="text-[8px] font-bold text-slate-300">Interactive Padding</span>
                  <span className="text-[7px] text-emerald-400 font-bold bg-emerald-500/10 px-1.5 py-0.5 rounded border border-emerald-500/20">12px</span>
                </div>
                <div className="w-full h-1 bg-slate-800 rounded-full overflow-hidden"><div className="h-full bg-emerald-500 rounded-full sxo-bar-2" /></div>
              </div>

              {/* CLS */}
              <div className="bg-slate-900/40 rounded-lg px-2.5 py-1.5 border border-white/[0.03] space-y-1">
                <div className="flex items-center justify-between">
                  <span className="text-[8px] font-bold text-slate-300">CLS Offset Vector</span>
                  <span className="text-[7px] text-emerald-400 font-bold bg-emerald-500/10 px-1.5 py-0.5 rounded border border-emerald-500/20">0.012</span>
                </div>
                <div className="w-full h-1 bg-slate-800 rounded-full overflow-hidden"><div className="h-full bg-emerald-500 rounded-full sxo-bar-3" /></div>
              </div>

              {/* Scroll Depth */}
              <div className="bg-slate-900/40 rounded-lg px-2.5 py-1.5 border border-white/[0.03] space-y-1">
                <div className="flex items-center justify-between">
                  <span className="text-[8px] font-bold text-slate-300">Scroll Depth Engagement</span>
                  <span className="text-[7px] text-teal-400 font-bold bg-teal-500/10 px-1.5 py-0.5 rounded border border-teal-500/20">74%</span>
                </div>
                <div className="w-full h-1 bg-slate-800 rounded-full overflow-hidden"><div className="h-full bg-teal-500 rounded-full sxo-bar-4" /></div>
              </div>

              {/* Rage Clicks */}
              <div className="bg-slate-900/40 rounded-lg px-2.5 py-1.5 border border-white/[0.03] space-y-1">
                <div className="flex items-center justify-between">
                  <span className="text-[8px] font-bold text-slate-300">Rage Click Detection</span>
                  <span className="text-[7px] text-amber-400 font-bold bg-amber-500/10 px-1.5 py-0.5 rounded border border-amber-500/20">2 Found</span>
                </div>
                <div className="w-full h-1 bg-slate-800 rounded-full overflow-hidden"><div className="h-full bg-amber-500 rounded-full sxo-bar-5" /></div>
              </div>
            </div>

            <div className="mt-2 text-[8px] text-slate-555 border-t border-slate-900/60 pt-2 flex justify-between items-center font-semibold">
              <span>Interaction Path: Clean</span>
              <span className="text-emerald-400 flex items-center gap-1">
                Usability: AAA
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
              </span>
            </div>
          </div>
        </div>

        <div className="p-2.5 rounded-xl bg-slate-950/80 border border-white/5 flex items-center justify-between text-[8.5px] text-slate-500 font-sans">
          <span>Interaction Path: Seamless</span>
          <span className="text-emerald-400 font-bold">Usability Grade: AAA</span>
        </div>

        <style jsx>{`
          @keyframes sxoRipple {
            0% { r: 4; opacity: 0.6; }
            100% { r: 16; opacity: 0; }
          }
          @keyframes sxoCursor {
            0%, 100% { transform: translate(0, 0); }
            30% { transform: translate(94px, 42px); }
            60% { transform: translate(94px, 0px); }
          }
          @keyframes sxoBarFill1 { from { width: 0%; } to { width: 100%; } }
          @keyframes sxoBarFill2 { from { width: 0%; } to { width: 85%; } }
          @keyframes sxoBarFill3 { from { width: 0%; } to { width: 95%; } }
          @keyframes sxoBarFill4 { from { width: 0%; } to { width: 74%; } }
          @keyframes sxoBarFill5 { from { width: 0%; } to { width: 15%; } }

          .sxo-ripple-1 { animation: sxoRipple 2s ease-out infinite; }
          .sxo-ripple-2 { animation: sxoRipple 2s ease-out infinite; animation-delay: 0.5s; }
          .sxo-ripple-3 { animation: sxoRipple 2.5s ease-out infinite; animation-delay: 1s; }
          .sxo-cursor { animation: sxoCursor 6s ease-in-out infinite; }
          .sxo-bar-1 { animation: sxoBarFill1 1.2s ease-out forwards; }
          .sxo-bar-2 { animation: sxoBarFill2 1.2s ease-out forwards; animation-delay: 0.15s; width: 0%; }
          .sxo-bar-3 { animation: sxoBarFill3 1.2s ease-out forwards; animation-delay: 0.3s; width: 0%; }
          .sxo-bar-4 { animation: sxoBarFill4 1.2s ease-out forwards; animation-delay: 0.45s; width: 0%; }
          .sxo-bar-5 { animation: sxoBarFill5 1.2s ease-out forwards; animation-delay: 0.6s; width: 0%; }
        `}</style>
      </div>
    );
  }

  if (type === "performance") {
    return (
      <div className="w-full h-full flex flex-col justify-between overflow-hidden select-none font-sans text-xs">
        {/* Mock DevTools tab layout */}
        <div className="flex items-center justify-between border-b border-white/5 pb-2">
          <div className="flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-red-500/30 border border-red-500/50" />
            <span className="w-2 h-2 rounded-full bg-yellow-500/30 border border-yellow-500/50" />
            <span className="w-2 h-2 rounded-full bg-green-500/30 border border-green-500/50" />
          </div>
          <div className="flex gap-2.5 text-[9px] font-extrabold text-slate-500">
            <span className="text-teal-400 border-b border-teal-400 pb-1.5">CWV Scores</span>
            <span>Timings Detail</span>
            <span>Console</span>
          </div>
        </div>

        {/* Split Layout: Left (CWV Core Metrics), Right (Load Timings Timeline) */}
        <div className="flex-grow grid grid-cols-1 md:grid-cols-12 gap-5 py-4 items-stretch">
          {/* Left: Core Web Vitals Metrics */}
          <div className="md:col-span-6 flex flex-col justify-between h-full bg-slate-950/70 rounded-xl border border-white/5 p-3.5 relative overflow-hidden">
            <div className="flex items-center justify-between border-b border-slate-900 pb-1.5 mb-2.5">
              <span className="text-[7.5px] text-slate-500 uppercase tracking-widest font-black">Core Web Vitals</span>
              <span className="text-[7.5px] text-emerald-400 bg-emerald-500/10 px-1.5 py-0.5 rounded border border-emerald-500/20 font-bold uppercase">Passed</span>
            </div>
            
            <div className="flex-grow flex flex-col justify-center space-y-2.5">
              {/* LCP */}
              <div className="bg-slate-900/30 rounded-lg p-2 border border-white/[0.02] space-y-1">
                <div className="flex justify-between text-[9px] font-bold text-slate-350">
                  <span className="flex items-center gap-1.5">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                    LCP (Contentful Paint)
                  </span>
                  <span className="text-emerald-400 font-mono">1.18s</span>
                </div>
                <div className="w-full h-1 bg-slate-800 rounded-full overflow-hidden">
                  <div className="h-full bg-gradient-to-r from-teal-500 to-emerald-500 rounded-full perf-bar-lcp" />
                </div>
              </div>

              {/* INP */}
              <div className="bg-slate-900/30 rounded-lg p-2 border border-white/[0.02] space-y-1">
                <div className="flex justify-between text-[9px] font-bold text-slate-350">
                  <span className="flex items-center gap-1.5">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                    INP (Next Paint Delay)
                  </span>
                  <span className="text-emerald-400 font-mono">24ms</span>
                </div>
                <div className="w-full h-1 bg-slate-800 rounded-full overflow-hidden">
                  <div className="h-full bg-gradient-to-r from-teal-500 to-emerald-500 rounded-full perf-bar-inp" />
                </div>
              </div>

              {/* CLS */}
              <div className="bg-slate-900/30 rounded-lg p-2 border border-white/[0.02] space-y-1">
                <div className="flex justify-between text-[9px] font-bold text-slate-350">
                  <span className="flex items-center gap-1.5">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                    CLS (Layout Shifts)
                  </span>
                  <span className="text-emerald-400 font-mono">0.012</span>
                </div>
                <div className="w-full h-1 bg-slate-800 rounded-full overflow-hidden">
                  <div className="h-full bg-gradient-to-r from-teal-500 to-emerald-500 rounded-full perf-bar-cls" />
                </div>
              </div>
            </div>
          </div>

          {/* Right: Load Timings Timeline */}
          <div className="md:col-span-6 flex flex-col justify-between h-full bg-slate-950/70 rounded-xl border border-white/5 p-3.5 relative overflow-hidden font-sans">
            <span className="text-[7.5px] text-slate-500 uppercase tracking-widest font-black block mb-2.5">Timeline Load Metrics</span>
            
            <div className="flex-grow flex flex-col justify-center space-y-2 relative pl-3.5 border-l border-slate-800/80 my-1 ml-1.5">
              {/* Event 1 */}
              <div className="relative space-y-0.5">
                <span className="absolute -left-[18px] top-1 w-2.5 h-2.5 rounded-full bg-emerald-500 border-2 border-slate-950 shadow-[0_0_6px_#10b981]" />
                <div className="flex justify-between text-[8px] font-bold text-slate-400">
                  <span>First Contentful Paint (FCP)</span>
                  <span className="text-slate-500 font-mono">0.38s</span>
                </div>
              </div>
              
              {/* Event 2 */}
              <div className="relative space-y-0.5 pt-1">
                <span className="absolute -left-[18px] top-2 w-2.5 h-2.5 rounded-full bg-emerald-500 border-2 border-slate-950 shadow-[0_0_6px_#10b981]" />
                <div className="flex justify-between text-[8px] font-bold text-slate-400">
                  <span>Speed Index (SI)</span>
                  <span className="text-slate-500 font-mono">0.8s</span>
                </div>
              </div>

              {/* Event 3 */}
              <div className="relative space-y-0.5 pt-1">
                <span className="absolute -left-[18px] top-2 w-2.5 h-2.5 rounded-full bg-teal-500 border-2 border-slate-950 shadow-[0_0_6px_#14b8a6]" />
                <div className="flex justify-between text-[8px] font-bold text-slate-400">
                  <span>Time to Interactive (TTI)</span>
                  <span className="text-slate-500 font-mono">1.4s</span>
                </div>
              </div>

              {/* Event 4 */}
              <div className="relative space-y-0.5 pt-1">
                <span className="absolute -left-[18px] top-2 w-2.5 h-2.5 rounded-full bg-indigo-500 border-2 border-slate-950 shadow-[0_0_6px_#6366f1] animate-pulse" />
                <div className="flex justify-between text-[8px] font-bold text-slate-450">
                  <span>Total Blocking Time (TBT)</span>
                  <span className="text-emerald-400 font-mono">45ms</span>
                </div>
              </div>
            </div>

            <div className="text-[8.5px] text-slate-550 border-t border-slate-900/60 pt-2 flex justify-between items-center font-bold">
              <span>Optimization Grade: AAA</span>
              <span className="text-teal-400">Perfect Score Match</span>
            </div>
          </div>
        </div>

        <div className="p-2.5 rounded-xl bg-slate-950/80 border border-white/5 flex items-center justify-between text-[8.5px] text-slate-500 font-sans">
          <span>Google Core Web Vitals Status:</span>
          <span className="text-emerald-400 font-bold flex items-center gap-1.5">
            Passed Standards
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
          </span>
        </div>

        <style jsx>{`
          @keyframes perfFillLcp { from { width: 0%; } to { width: 92%; } }
          @keyframes perfFillInp { from { width: 0%; } to { width: 95%; } }
          @keyframes perfFillCls { from { width: 0%; } to { width: 98%; } }
          .perf-bar-lcp { animation: perfFillLcp 1s cubic-bezier(0.16, 1, 0.3, 1) forwards; }
          .perf-bar-inp { animation: perfFillInp 1s cubic-bezier(0.16, 1, 0.3, 1) forwards; animation-delay: 0.1s; width: 0%; }
          .perf-bar-cls { animation: perfFillCls 1s cubic-bezier(0.16, 1, 0.3, 1) forwards; animation-delay: 0.2s; width: 0%; }
        `}</style>
      </div>
    );
  }

  if (type === "pagespeed") {
    return (
      <div className="w-full h-full flex flex-col justify-between overflow-hidden select-none font-sans text-xs">
        {/* Mock DevTools tab layout */}
        <div className="flex items-center justify-between border-b border-white/5 pb-2">
          <div className="flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-red-500/30 border border-red-500/50" />
            <span className="w-2 h-2 rounded-full bg-yellow-500/30 border border-yellow-500/50" />
            <span className="w-2 h-2 rounded-full bg-green-500/30 border border-green-500/50" />
          </div>
          <div className="flex gap-2.5 text-[9px] font-extrabold text-slate-500">
            <span className="text-teal-400 border-b border-teal-400 pb-1.5">Speed Gauge</span>
            <span>Optimization List</span>
            <span>Audits</span>
          </div>
        </div>

        {/* Split Layout: Left (Circular speed gauge + scores), Right (Optimization savings list) */}
        <div className="flex-grow grid grid-cols-1 md:grid-cols-12 gap-5 py-4 items-stretch">
          {/* Left: Circular speed gauge */}
          <div className="md:col-span-6 flex flex-col justify-between items-center h-full bg-slate-950/70 rounded-xl border border-white/5 p-3 relative overflow-hidden">
            <span className="text-[7.5px] text-slate-500 uppercase tracking-widest font-black block mb-2 text-center self-start">Performance Grade</span>
            
            <div className="relative w-24 h-24 flex items-center justify-center my-auto">
              {/* Rotating Sweep Glow Overlay */}
              <div className="absolute inset-0 rounded-full border border-emerald-500/5 pagespeed-scanner" />
              <svg width="90" height="90" viewBox="0 0 100 100" className="transform -rotate-90">
                {/* Background Ring */}
                <circle cx="50" cy="50" r="42" fill="none" stroke="rgba(255,255,255,0.04)" strokeWidth="5.5" />
                {/* Performance Progress Ring */}
                <circle
                  cx="50"
                  cy="50"
                  r="42"
                  fill="none"
                  stroke="url(#pagespeed-grad)"
                  strokeWidth="5.5"
                  strokeDasharray="264"
                  strokeDashoffset="264"
                  strokeLinecap="round"
                  className="pagespeed-ring-main"
                  style={{ filter: "drop-shadow(0 0 5px rgba(16,185,129,0.5))" }}
                />
                <defs>
                  <linearGradient id="pagespeed-grad" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" stopColor="#14b8a6" />
                    <stop offset="100%" stopColor="#10b981" />
                  </linearGradient>
                </defs>
              </svg>
              <div className="absolute flex flex-col items-center justify-center">
                <span className="text-2xl font-mono font-black text-emerald-400 tracking-tighter">96</span>
                <span className="text-[6.5px] text-slate-500 font-extrabold uppercase tracking-wide">Passed</span>
              </div>
            </div>

            {/* 4 Pillars Mini Scores */}
            <div className="grid grid-cols-4 gap-1 w-full mt-2 pt-2 border-t border-slate-900/60 text-center">
              <div className="bg-slate-900/40 p-1 rounded border border-white/[0.02]">
                <div className="text-[7.5px] font-black text-emerald-400">96</div>
                <div className="text-[5px] font-bold text-slate-500 uppercase">Perf</div>
              </div>
              <div className="bg-slate-900/40 p-1 rounded border border-white/[0.02]">
                <div className="text-[7.5px] font-black text-emerald-400">98</div>
                <div className="text-[5px] font-bold text-slate-500 uppercase">Acc</div>
              </div>
              <div className="bg-slate-900/40 p-1 rounded border border-white/[0.02]">
                <div className="text-[7.5px] font-black text-emerald-400">100</div>
                <div className="text-[5px] font-bold text-slate-500 uppercase">Best</div>
              </div>
              <div className="bg-slate-900/40 p-1 rounded border border-white/[0.02]">
                <div className="text-[7.5px] font-black text-emerald-400">100</div>
                <div className="text-[5px] font-bold text-slate-500 uppercase">SEO</div>
              </div>
            </div>
          </div>

          {/* Right: Optimization savings list */}
          <div className="md:col-span-6 flex flex-col justify-between h-full bg-slate-950/70 rounded-xl border border-white/5 p-3.5 relative overflow-hidden font-sans">
            <span className="text-[7.5px] text-slate-500 uppercase tracking-widest font-black block mb-2.5">Lighthouse Recommendations</span>
            
            <div className="flex-grow flex flex-col justify-center space-y-1.5">
              {/* Rec 1 */}
              <div className="flex justify-between items-center bg-slate-900/30 px-2 py-1.5 rounded border border-white/[0.02]">
                <span className="flex items-center gap-1.5 text-[8.5px] font-semibold text-slate-350">
                  <span className="text-[9px]">⚡</span>
                  Defer Render-Blocking JS
                </span>
                <span className="text-[7.5px] text-emerald-400 font-bold bg-emerald-500/10 px-1.5 py-0.5 rounded border border-emerald-500/20">-0.42s</span>
              </div>

              {/* Rec 2 */}
              <div className="flex justify-between items-center bg-slate-900/30 px-2 py-1.5 rounded border border-white/[0.02]">
                <span className="flex items-center gap-1.5 text-[8.5px] font-semibold text-slate-350">
                  <span className="text-[9px]">📄</span>
                  Minify Critical CSS
                </span>
                <span className="text-[7.5px] text-emerald-400 font-bold bg-emerald-500/10 px-1.5 py-0.5 rounded border border-emerald-500/20">-0.18s</span>
              </div>

              {/* Rec 3 */}
              <div className="flex justify-between items-center bg-slate-900/30 px-2 py-1.5 rounded border border-white/[0.02]">
                <span className="flex items-center gap-1.5 text-[8.5px] font-semibold text-slate-350">
                  <span className="text-[9px]">⚙️</span>
                  Reduce Server Response
                </span>
                <span className="text-[7.5px] text-emerald-400 font-bold bg-emerald-500/10 px-1.5 py-0.5 rounded border border-emerald-500/20">-0.12s</span>
              </div>

              {/* Rec 4 */}
              <div className="flex justify-between items-center bg-slate-900/30 px-2 py-1.5 rounded border border-white/[0.02]">
                <span className="flex items-center gap-1.5 text-[8.5px] font-semibold text-slate-350">
                  <span className="text-[9px]">🖼️</span>
                  Modern Next-Gen Images
                </span>
                <span className="text-[7.5px] text-emerald-400 font-bold bg-emerald-500/10 px-1.5 py-0.5 rounded border border-emerald-500/20">-0.35s</span>
              </div>
            </div>

            <div className="text-[8px] text-slate-550 border-t border-slate-900/60 pt-2 flex justify-between items-center font-semibold">
              <span>Diagnostic Audits Complete</span>
              <span className="text-teal-400">12 opportunities fixed</span>
            </div>
          </div>
        </div>

        <div className="flex justify-between items-center text-[9px] text-slate-500 font-extrabold uppercase border-t border-white/5 pt-2">
          <span>Speed Index: 0.8s</span>
          <span className="text-emerald-400">Diagnosed: Healthy</span>
        </div>

        <style jsx>{`
          @keyframes pagespeedRingFill {
            from { stroke-dashoffset: 264; }
            to { stroke-dashoffset: 10; }
          }
          @keyframes pagespeedRot {
            0% { transform: rotate(0deg); }
            100% { transform: rotate(360deg); }
          }
          .pagespeed-ring-main {
            animation: pagespeedRingFill 1.5s cubic-bezier(0.16, 1, 0.3, 1) forwards;
          }
          .pagespeed-scanner {
            animation: pagespeedRot 6s linear infinite;
            border-top-color: rgba(16, 185, 129, 0.4);
            border-right-color: transparent;
            border-bottom-color: transparent;
            border-left-color: transparent;
          }
        `}</style>
      </div>
    );
  }

  if (type === "security") {
    return (
      <div className="w-full h-full flex flex-col justify-between overflow-hidden select-none font-sans text-xs">
        {/* Mock DevTools tab layout */}
        <div className="flex items-center justify-between border-b border-white/5 pb-2">
          <div className="flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-red-500/30 border border-red-500/50" />
            <span className="w-2 h-2 rounded-full bg-yellow-500/30 border border-yellow-500/50" />
            <span className="w-2 h-2 rounded-full bg-green-500/30 border border-green-500/50" />
          </div>
          <div className="flex gap-2.5 text-[9px] font-extrabold text-slate-500">
            <span className="text-teal-400 border-b border-teal-400 pb-1.5">Security Shield</span>
            <span>HTTP Headers</span>
            <span>TLS Preload</span>
          </div>
        </div>

        {/* Split Layout: Left (Cryptographic Security Shield), Right (Security Headers Audit Checklist) */}
        <div className="flex-grow grid grid-cols-1 md:grid-cols-12 gap-5 py-4 items-stretch">
          {/* Left: Cryptographic Security Shield */}
          <div className="md:col-span-6 flex flex-col justify-between items-center h-full bg-slate-950/70 rounded-xl border border-white/5 p-3.5 relative overflow-hidden">
            <div className="flex items-center justify-between border-b border-slate-900 pb-1.5 mb-2 w-full">
              <span className="text-[7.5px] text-slate-555 uppercase tracking-widest font-black">Cryptographic Status</span>
              <span className="text-[7.5px] text-emerald-400 bg-emerald-500/10 px-1.5 py-0.5 rounded border border-emerald-500/20 font-bold uppercase">TLS 1.3</span>
            </div>

            <div className="relative w-full flex-grow flex items-center justify-center my-1.5">
              <svg className="w-full h-full min-h-[120px]" viewBox="0 0 200 120" fill="none" xmlns="http://www.w3.org/2000/svg">
                {/* Scan circles */}
                <circle cx="100" cy="55" r="48" stroke="rgba(20,184,166,0.06)" strokeWidth="1" strokeDasharray="3 3" />
                {/* Dotted orbiting tracks */}
                <circle cx="100" cy="55" r="36" stroke="rgba(16,185,129,0.25)" strokeWidth="1" strokeDasharray="40 120" strokeLinecap="round" className="security-scan-rot" />
                <circle cx="100" cy="55" r="26" stroke="rgba(16,185,129,0.15)" strokeWidth="0.8" strokeDasharray="4 2" />

                {/* Outer pulsing ring */}
                <circle cx="100" cy="55" r="20" fill="none" stroke="#10b981" strokeWidth="0.5" opacity="0.3" className="security-ping-1" />
                <circle cx="100" cy="55" r="24" fill="none" stroke="#10b981" strokeWidth="0.4" opacity="0.15" className="security-ping-2" />

                {/* Floating Orbiting Node */}
                <g className="security-orbit-node">
                  <circle cx="100" cy="55" r="2" fill="#14b8a6" className="security-node-glow" />
                </g>

                {/* Cryptographic Shield */}
                <g transform="translate(100, 55)">
                  {/* Shield Backplate */}
                  <path d="M-10-14 L10-14 L10-4 C10 4,-10 12,-10 12 C-10 12,-10 4,-10-4 Z" fill="#090d16" stroke="#10b981" strokeWidth="1.8" />
                  {/* Inner Checkmark */}
                  <path d="M-4-1 L-1 2 L5-4" stroke="#10b981" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
                </g>
              </svg>
            </div>

            <span className="text-[7.5px] text-slate-500 uppercase tracking-widest font-black">HTTPS Protection Active</span>
          </div>

          {/* Right: Security Headers Audit Checklist */}
          <div className="md:col-span-6 flex flex-col justify-between h-full bg-slate-950/70 rounded-xl border border-white/5 p-3.5 relative overflow-hidden font-sans">
            <span className="text-[7.5px] text-slate-500 uppercase tracking-widest font-black block mb-2.5">Headers Audit</span>
            
            <div className="flex-grow flex flex-col justify-center space-y-1.5">
              {/* Header 1 */}
              <div className="flex justify-between items-center bg-slate-900/40 px-2 py-1 rounded border border-white/[0.02]">
                <div className="flex flex-col">
                  <span className="text-[8px] font-bold text-slate-300">Strict-Transport-Security</span>
                  <span className="text-[6.5px] text-slate-500 font-mono">max-age=63072000</span>
                </div>
                <span className="text-[6.5px] text-emerald-400 font-bold bg-emerald-500/10 px-1 py-0.5 rounded border border-emerald-500/20">Secure</span>
              </div>

              {/* Header 2 */}
              <div className="flex justify-between items-center bg-slate-900/40 px-2 py-1 rounded border border-white/[0.02]">
                <div className="flex flex-col">
                  <span className="text-[8px] font-bold text-slate-300">Content-Security-Policy</span>
                  <span className="text-[6.5px] text-slate-500 font-mono">default-src 'self'</span>
                </div>
                <span className="text-[6.5px] text-emerald-400 font-bold bg-emerald-500/10 px-1 py-0.5 rounded border border-emerald-500/20">Active</span>
              </div>

              {/* Header 3 */}
              <div className="flex justify-between items-center bg-slate-900/40 px-2 py-1 rounded border border-white/[0.02]">
                <div className="flex flex-col">
                  <span className="text-[8px] font-bold text-slate-300">X-Content-Type-Options</span>
                  <span className="text-[6.5px] text-slate-500 font-mono">nosniff</span>
                </div>
                <span className="text-[6.5px] text-emerald-400 font-bold bg-emerald-500/10 px-1 py-0.5 rounded border border-emerald-500/20">Active</span>
              </div>
            </div>

            <div className="text-[8px] text-slate-550 border-t border-slate-900/60 pt-2 flex justify-between items-center font-semibold">
              <span>Security Score: A+</span>
              <span className="text-teal-400">All Headers Validated</span>
            </div>
          </div>
        </div>

        <div className="p-2.5 rounded-xl bg-slate-950/80 border border-white/5 flex items-center justify-between text-[8.5px] text-slate-500 font-sans">
          <span>SSL: TLS 1.3 Preload</span>
          <span className="text-emerald-400 font-bold">Headers validation passed</span>
        </div>

        <style dangerouslySetInnerHTML={{ __html: `
          @keyframes securityScanRot {
            0% { transform: rotate(0deg); }
            100% { transform: rotate(360deg); }
          }
          @keyframes securityPing {
            0% { r: 18; opacity: 0.5; }
            100% { r: 34; opacity: 0; }
          }
          @keyframes securityOrbit {
            0% { transform: rotate(0deg) translate(26px) rotate(0deg); }
            100% { transform: rotate(360deg) translate(26px) rotate(-360deg); }
          }
          .security-scan-rot {
            animation: securityScanRot 8s linear infinite;
            transform-origin: 100px 55px;
          }
          .security-ping-1 {
            animation: securityPing 2.5s cubic-bezier(0.16, 1, 0.3, 1) infinite;
          }
          .security-ping-2 {
            animation: securityPing 2.5s cubic-bezier(0.16, 1, 0.3, 1) infinite;
            animation-delay: 1.25s;
          }
          .security-orbit-node {
            animation: securityOrbit 5s linear infinite;
            transform-origin: 100px 55px;
          }
        ` }} />
      </div>
    );
  }

  if (type === "links") {
    return (
      <div className="w-full h-full flex flex-col justify-between overflow-hidden select-none font-sans text-xs">
        {/* Mock DevTools tab layout */}
        <div className="flex items-center justify-between border-b border-white/5 pb-2">
          <div className="flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-red-500/30 border border-red-500/50" />
            <span className="w-2 h-2 rounded-full bg-yellow-500/30 border border-yellow-500/50" />
            <span className="w-2 h-2 rounded-full bg-green-500/30 border border-green-500/50" />
          </div>
          <div className="flex gap-2.5 text-[9px] font-extrabold text-slate-500">
            <span className="text-teal-400 border-b border-teal-400 pb-1.5">Redirect Chains</span>
            <span>Link Audits</span>
            <span>Broken check</span>
          </div>
        </div>

        {/* Split Layout: Left (Link Pathway Graph), Right (Broken Checks Crawler List) */}
        <div className="flex-grow grid grid-cols-1 md:grid-cols-12 gap-5 py-4 items-stretch">
          {/* Left: Link crawler pathways map SVG */}
          <div className="md:col-span-6 flex flex-col justify-between h-full bg-slate-950/70 rounded-xl border border-white/5 p-3 relative overflow-hidden font-sans">
            <div className="flex items-center justify-between border-b border-slate-900 pb-1.5 mb-2 w-full">
              <span className="text-[7.5px] text-slate-555 uppercase tracking-widest font-black">Pathway Mapping</span>
              <span className="text-[7.5px] text-emerald-400 bg-emerald-500/10 px-1.5 py-0.5 rounded border border-emerald-500/20 font-bold uppercase">Crawl Map</span>
            </div>

            <div className="relative w-full flex-grow flex items-center justify-center my-1">
              <svg className="w-full h-full min-h-[120px]" viewBox="0 0 200 120" fill="none" xmlns="http://www.w3.org/2000/svg">
                {/* Dot background */}
                <defs>
                  <pattern id="link-dots" x="0" y="0" width="10" height="10" patternUnits="userSpaceOnUse">
                    <circle cx="1" cy="1" r="0.5" fill="rgba(255,255,255,0.03)" />
                  </pattern>
                </defs>
                <rect width="200" height="120" fill="url(#link-dots)" />

                {/* ── Pathway 1: Redirect Chain (Top) ── */}
                {/* Curved paths */}
                <path d="M 25 35 Q 60 20 90 35" stroke="#1e293b" strokeWidth="1.5" strokeLinecap="round" />
                <path d="M 110 35 Q 140 20 175 35" stroke="#1e293b" strokeWidth="1.5" strokeLinecap="round" />
                <path d="M 25 35 Q 60 20 90 35" stroke="#f59e0b" strokeWidth="1" strokeLinecap="round" strokeDasharray="5 4" className="link-flow-redir" />
                <path d="M 110 35 Q 140 20 175 35" stroke="#10b981" strokeWidth="1" strokeLinecap="round" strokeDasharray="5 4" className="link-flow-ok" />

                {/* Nodes Pathway 1 */}
                <circle cx="25" cy="35" r="3.5" fill="#090d16" stroke="#f59e0b" strokeWidth="1.2" />
                <text x="25" y="47" fontSize="5" fontWeight="700" fill="#64748b" textAnchor="middle" fontFamily="monospace">/old-url</text>

                <g transform="translate(100, 35)">
                  <circle cx="0" cy="0" r="10" fill="#090d16" stroke="#f59e0b" strokeWidth="1.5" />
                  <circle cx="0" cy="0" r="12" fill="none" stroke="#f59e0b" strokeWidth="0.5" opacity="0.3" className="link-node-ping" />
                  <text x="0" y="2" fontSize="5.5" fontWeight="900" fill="#f59e0b" textAnchor="middle" fontFamily="monospace">301</text>
                </g>

                <circle cx="175" cy="35" r="3.5" fill="#090d16" stroke="#10b981" strokeWidth="1.2" />
                <text x="175" y="47" fontSize="5" fontWeight="700" fill="#64748b" textAnchor="middle" fontFamily="monospace">/new-url</text>


                {/* ── Pathway 2: External Safe Link (Bottom) ── */}
                <path d="M 35 85 Q 100 70 165 85" stroke="#1e293b" strokeWidth="1.5" strokeLinecap="round" />
                <path d="M 35 85 Q 100 70 165 85" stroke="#10b981" strokeWidth="1" strokeLinecap="round" strokeDasharray="5 4" className="link-flow-direct" />

                {/* Nodes Pathway 2 */}
                <circle cx="35" cy="85" r="3.5" fill="#090d16" stroke="#10b981" strokeWidth="1.2" />
                <text x="35" y="97" fontSize="5" fontWeight="700" fill="#64748b" textAnchor="middle" fontFamily="monospace">/pricing</text>

                <circle cx="165" cy="85" r="3.5" fill="#090d16" stroke="#14b8a6" strokeWidth="1.2" />
                <text x="165" y="97" fontSize="5" fontWeight="700" fill="#64748b" textAnchor="middle" fontFamily="monospace">stripe.com</text>
              </svg>
            </div>
          </div>

          {/* Right: Crawl Log endpoints verify console */}
          <div className="md:col-span-6 flex flex-col justify-between h-full bg-slate-950/70 rounded-xl border border-white/5 p-3.5 relative overflow-hidden font-sans">
            <span className="text-[7.5px] text-slate-500 uppercase tracking-widest font-black block mb-2.5">Endpoint validation log</span>
            
            <div className="space-y-1.5 flex-grow flex flex-col justify-center">
              {/* Row 1 */}
              <div className="flex justify-between items-center bg-slate-900/40 rounded px-2.5 py-1 border border-white/[0.02]">
                <span className="text-[8px] font-bold text-slate-350 font-mono truncate max-w-[110px]">/pricing</span>
                <span className="text-[6.5px] text-emerald-400 font-bold bg-emerald-500/10 px-1.5 py-0.5 rounded border border-emerald-500/20">200 OK</span>
              </div>

              {/* Row 2 */}
              <div className="flex justify-between items-center bg-slate-900/40 rounded px-2.5 py-1 border border-white/[0.02]">
                <span className="text-[8px] font-bold text-slate-350 font-mono truncate max-w-[110px]">stripe.com</span>
                <span className="text-[6.5px] text-emerald-400 font-bold bg-emerald-500/10 px-1.5 py-0.5 rounded border border-emerald-500/20">200 OK</span>
              </div>

              {/* Row 3 */}
              <div className="flex justify-between items-center bg-slate-900/40 rounded px-2.5 py-1 border border-white/[0.02]">
                <span className="text-[8px] font-bold text-slate-350 font-mono truncate max-w-[110px]">/old-promo</span>
                <span className="text-[6.5px] text-amber-400 font-bold bg-amber-500/10 px-1.5 py-0.5 rounded border border-amber-500/20">301 Redirect</span>
              </div>

              {/* Row 4 */}
              <div className="flex justify-between items-center bg-slate-900/40 rounded px-2.5 py-1 border border-white/[0.02]">
                <span className="text-[8px] font-bold text-slate-350 font-mono truncate max-w-[110px]">/broken-url</span>
                <span className="text-[6.5px] text-red-400 font-bold bg-red-500/10 px-1.5 py-0.5 rounded border border-red-500/20">404 Error</span>
              </div>
            </div>

            <div className="text-[8px] text-slate-555 border-t border-slate-900/60 pt-2 flex justify-between items-center font-semibold">
              <span>Verified: 136 / 140 Links</span>
              <span className="text-amber-450 font-bold flex items-center gap-1">
                4 Action Items
                <span className="w-1.5 h-1.5 rounded-full bg-amber-500 animate-pulse" />
              </span>
            </div>
          </div>
        </div>

        <div className="p-2.5 rounded-xl bg-slate-950/80 border border-white/5 flex items-center justify-between text-[8.5px] text-slate-500 font-sans">
          <span>Total Links Checked: 140</span>
          <span className="text-emerald-400 font-bold">Broken Link check Completed</span>
        </div>

        <style dangerouslySetInnerHTML={{ __html: `
          @keyframes linkDashRedir {
            0% { stroke-dashoffset: 0; }
            100% { stroke-dashoffset: -20; }
          }
          @keyframes linkDashOk {
            0% { stroke-dashoffset: 0; }
            100% { stroke-dashoffset: -20; }
          }
          @keyframes linkNodePing {
            0% { r: 10; opacity: 0.5; }
            100% { r: 16; opacity: 0; }
          }
          .link-flow-redir { animation: linkDashRedir 2.2s linear infinite; }
          .link-flow-ok { animation: linkDashOk 2s linear infinite; }
          .link-flow-direct { animation: linkDashOk 1.5s linear infinite; }
          .link-node-ping { animation: linkNodePing 2s ease-out infinite; }
        ` }} />
      </div>
    );
  }

  if (type === "accessibility") {
    return (
      <div className="w-full h-full flex flex-col justify-between overflow-hidden select-none font-sans text-xs">
        {/* Mock DevTools tab layout */}
        <div className="flex items-center justify-between border-b border-white/5 pb-2">
          <div className="flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-red-500/30 border border-red-500/50" />
            <span className="w-2 h-2 rounded-full bg-yellow-500/30 border border-yellow-500/50" />
            <span className="w-2 h-2 rounded-full bg-green-500/30 border border-green-500/50" />
          </div>
          <div className="flex gap-2.5 text-[9px] font-extrabold text-slate-500">
            <span className="text-teal-400 border-b border-teal-400 pb-1.5">WCAG AA</span>
            <span>Focus Sand</span>
            <span>A11y Checks</span>
          </div>
        </div>

        {/* Split Layout: Left (Tab Focus Pathway), Right (WCAG Diagnostics Checklist) */}
        <div className="flex-grow grid grid-cols-1 md:grid-cols-12 gap-5 py-4 items-stretch">
          {/* Left: Tab Focus Pathway SVG */}
          <div className="md:col-span-6 flex flex-col justify-between h-full bg-slate-950/70 rounded-xl border border-white/5 p-3.5 relative overflow-hidden">
            <div className="flex items-center justify-between border-b border-slate-900 pb-1.5 mb-2 w-full">
              <span className="text-[7.5px] text-slate-555 uppercase tracking-widest font-black">Focus Loop Map</span>
              <span className="text-[7.5px] text-emerald-400 bg-emerald-500/10 px-1.5 py-0.5 rounded border border-emerald-500/20 font-bold uppercase">Passed</span>
            </div>

            <div className="relative w-full flex-grow flex items-center justify-center my-1.5">
              <svg className="w-full h-full min-h-[120px]" viewBox="0 0 200 120" fill="none" xmlns="http://www.w3.org/2000/svg">
                {/* Dot background */}
                <defs>
                  <pattern id="a11y-dots" x="0" y="0" width="10" height="10" patternUnits="userSpaceOnUse">
                    <circle cx="1" cy="1" r="0.5" fill="rgba(255,255,255,0.03)" />
                  </pattern>
                </defs>
                <rect width="200" height="120" fill="url(#a11y-dots)" />

                {/* Tab traversal path lines */}
                <path d="M 25 35 L 100 35 L 100 85 L 175 85" stroke="#1e293b" strokeWidth="1.5" strokeLinecap="round" />
                <path d="M 25 35 L 100 35 L 100 85 L 175 85" stroke="#14b8a6" strokeWidth="1" strokeLinecap="round" strokeDasharray="4 3" className="a11y-tab-flow" />

                {/* Traversal Node 1: Logo */}
                <circle cx="25" cy="35" r="3" fill="#090d16" stroke="#475569" strokeWidth="1" />
                <rect x="15" y="24" width="20" height="6" rx="1.5" fill="#0f172a" stroke="#475569" strokeWidth="0.5" />
                <text x="25" y="28" fontSize="4.5" fontWeight="800" fill="#475569" textAnchor="middle" fontFamily="monospace">TAB 1</text>

                {/* Traversal Node 2: Search Input */}
                <circle cx="100" cy="35" r="3" fill="#090d16" stroke="#475569" strokeWidth="1" />
                <rect x="85" y="24" width="30" height="6" rx="1.5" fill="#0f172a" stroke="#475569" strokeWidth="0.5" />
                <text x="100" y="28" fontSize="4.5" fontWeight="800" fill="#475569" textAnchor="middle" fontFamily="monospace">TAB 2</text>

                {/* Traversal Node 3: Submit Button (Focused) */}
                <g transform="translate(100, 85)">
                  {/* Pulsing focus halo */}
                  <rect x="-18" y="-7" width="36" height="10" rx="2" fill="none" stroke="#14b8a6" strokeWidth="1.2" className="a11y-focus-ring" />
                  <rect x="-16" y="-5" width="32" height="8" rx="1.5" fill="#14b8a6" fillOpacity="0.1" stroke="#14b8a6" strokeWidth="1" />
                  <text x="0" y="1" fontSize="4.5" fontWeight="900" fill="#14b8a6" textAnchor="middle" fontFamily="monospace" className="animate-pulse">FOCUS 3</text>
                </g>

                {/* Traversal Node 4: Close Link */}
                <circle cx="175" cy="85" r="3" fill="#090d16" stroke="#475569" strokeWidth="1" />
                <rect x="165" y="74" width="20" height="6" rx="1.5" fill="#0f172a" stroke="#475569" strokeWidth="0.5" />
                <text x="175" y="78" fontSize="4.5" fontWeight="800" fill="#475569" textAnchor="middle" fontFamily="monospace">TAB 4</text>
              </svg>
            </div>

            <span className="text-[7.5px] text-slate-500 uppercase tracking-widest font-black text-center w-full block">Valid Focus Loop Pattern</span>
          </div>

          {/* Right: WCAG Diagnostics Checklist */}
          <div className="md:col-span-6 flex flex-col justify-between h-full bg-slate-950/70 rounded-xl border border-white/5 p-3.5 relative overflow-hidden font-sans">
            <span className="text-[7.5px] text-slate-500 uppercase tracking-widest font-black block mb-2.5">WCAG 2.1 Checklist</span>
            
            <div className="flex-grow flex flex-col justify-center space-y-1.5">
              {/* Check 1 */}
              <div className="flex justify-between items-center bg-slate-900/40 rounded px-2.5 py-1.5 border border-white/[0.02]">
                <div className="flex flex-col">
                  <span className="text-[8px] font-bold text-slate-300">Color Contrast Check</span>
                  <span className="text-[6.5px] text-slate-500 font-mono">4.58:1 Ratio Verified</span>
                </div>
                <span className="text-[6.5px] text-emerald-400 font-bold bg-emerald-500/10 px-1.5 py-0.5 rounded border border-emerald-500/20">AAA</span>
              </div>

              {/* Check 2 */}
              <div className="flex justify-between items-center bg-slate-900/40 rounded px-2.5 py-1.5 border border-white/[0.02]">
                <div className="flex flex-col">
                  <span className="text-[8px] font-bold text-slate-300">ARIA Roles Configuration</span>
                  <span className="text-[6.5px] text-slate-500 font-mono">Interactive tags validated</span>
                </div>
                <span className="text-[6.5px] text-emerald-400 font-bold bg-emerald-500/10 px-1.5 py-0.5 rounded border border-emerald-500/20">100%</span>
              </div>

              {/* Check 3 */}
              <div className="flex justify-between items-center bg-slate-900/40 rounded px-2.5 py-1.5 border border-white/[0.02]">
                <div className="flex flex-col">
                  <span className="text-[8px] font-bold text-slate-300">Alt Image Tag Coverage</span>
                  <span className="text-[6.5px] text-slate-500 font-mono">Media descriptions mapped</span>
                </div>
                <span className="text-[6.5px] text-emerald-400 font-bold bg-emerald-500/10 px-1.5 py-0.5 rounded border border-emerald-500/20">98%</span>
              </div>
            </div>

            <div className="text-[8px] text-slate-550 border-t border-slate-900/60 pt-2 flex justify-between items-center font-semibold">
              <span>Focus traps: 0 found</span>
              <span className="text-teal-400">Score: 100/100</span>
            </div>
          </div>
        </div>

        <div className="p-2.5 rounded-xl bg-slate-950/80 border border-white/5 flex items-center justify-between text-[8.5px] text-slate-500 font-sans">
          <span>Standards: WCAG 2.1 AA</span>
          <span className="text-emerald-400 font-bold">Accessibility Audited Successfully</span>
        </div>

        <style dangerouslySetInnerHTML={{ __html: `
          @keyframes a11yTabFlow {
            0% { stroke-dashoffset: 0; }
            100% { stroke-dashoffset: -20; }
          }
          @keyframes a11yFocusRing {
            0% { transform: scale(1); opacity: 0.8; }
            100% { transform: scale(1.15); opacity: 0; }
          }
          .a11y-tab-flow { animation: a11yTabFlow 2s linear infinite; }
          .a11y-focus-ring {
            animation: a11yFocusRing 1.8s ease-out infinite;
            transform-origin: center;
          }
        ` }} />
      </div>
    );
  }

  if (type === "international") {
    return (
      <div className="w-full h-full flex flex-col justify-between overflow-hidden select-none font-sans text-xs">
        {/* Mock DevTools tab layout */}
        <div className="flex items-center justify-between border-b border-white/5 pb-2">
          <div className="flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-red-500/30 border border-red-500/50" />
            <span className="w-2 h-2 rounded-full bg-yellow-500/30 border border-yellow-500/50" />
            <span className="w-2 h-2 rounded-full bg-green-500/30 border border-green-500/50" />
          </div>
          <div className="flex gap-2.5 text-[9px] font-extrabold text-slate-500">
            <span className="text-teal-400 border-b border-teal-400 pb-1.5">Hreflang signals</span>
            <span>Alternate Targets</span>
            <span>Regions Map</span>
          </div>
        </div>

        {/* Split Layout: Left (Alternate country mappings map SVG), Right (Hreflang translation checklist) */}
        <div className="flex-grow grid grid-cols-1 md:grid-cols-12 gap-5 py-4 items-stretch">
          {/* Left: Alternate country mappings map SVG */}
          <div className="md:col-span-6 flex flex-col justify-between h-full bg-slate-950/70 rounded-xl border border-white/5 p-3.5 relative overflow-hidden font-sans">
            <div className="flex items-center justify-between border-b border-slate-900 pb-1.5 mb-2 w-full">
              <span className="text-[7.5px] text-slate-555 uppercase tracking-widest font-black">Reciprocal Validation</span>
              <span className="text-[7.5px] text-emerald-400 bg-emerald-500/10 px-1.5 py-0.5 rounded border border-emerald-500/20 font-bold uppercase">Active</span>
            </div>

            <div className="relative w-full flex-grow flex items-center justify-center my-1">
              <svg className="w-full h-full min-h-[120px]" viewBox="0 0 200 120" fill="none" xmlns="http://www.w3.org/2000/svg">
                {/* Dot background */}
                <defs>
                  <pattern id="intl-dots" x="0" y="0" width="10" height="10" patternUnits="userSpaceOnUse">
                    <circle cx="1" cy="1" r="0.5" fill="rgba(255,255,255,0.03)" />
                  </pattern>
                </defs>
                <rect width="200" height="120" fill="url(#intl-dots)" />

                {/* ── Reciprocal Hub Pathways ── */}
                <path d="M 45 40 Q 100 50 100 80" stroke="#1e293b" strokeWidth="1.5" strokeLinecap="round" />
                <path d="M 100 30 L 100 80" stroke="#1e293b" strokeWidth="1.5" strokeLinecap="round" />
                <path d="M 155 40 Q 100 50 100 80" stroke="#1e293b" strokeWidth="1.5" strokeLinecap="round" />

                {/* Animated reciprocal flows */}
                <path d="M 45 40 Q 100 50 100 80" stroke="#10b981" strokeWidth="1" strokeLinecap="round" strokeDasharray="4 4" className="intl-flow-1" />
                <path d="M 100 30 L 100 80" stroke="#8b5cf6" strokeWidth="1" strokeLinecap="round" strokeDasharray="4 4" className="intl-flow-2" />
                <path d="M 155 40 Q 100 50 100 80" stroke="#14b8a6" strokeWidth="1" strokeLinecap="round" strokeDasharray="4 4" className="intl-flow-3" />

                {/* Locale Nodes */}
                {/* USLocale */}
                <g transform="translate(45, 40)">
                  <circle cx="0" cy="0" r="10" fill="#090d16" stroke="#10b981" strokeWidth="1.2" />
                  <circle cx="0" cy="0" r="12" fill="none" stroke="#10b981" strokeWidth="0.5" opacity="0.3" className="intl-node-ping" />
                  <text x="0" y="2" fontSize="5" fontWeight="900" fill="#10b981" textAnchor="middle">EN</text>
                  <text x="0" y="16" fontSize="4.5" fontWeight="700" fill="#64748b" textAnchor="middle">/en</text>
                </g>

                {/* DE Locale */}
                <g transform="translate(100, 30)">
                  <circle cx="0" cy="0" r="10" fill="#090d16" stroke="#8b5cf6" strokeWidth="1.2" />
                  <circle cx="0" cy="0" r="12" fill="none" stroke="#8b5cf6" strokeWidth="0.5" opacity="0.3" className="intl-node-ping" />
                  <text x="0" y="2" fontSize="5" fontWeight="900" fill="#a78bfa" textAnchor="middle">DE</text>
                  <text x="0" y="16" fontSize="4.5" fontWeight="700" fill="#64748b" textAnchor="middle">/de</text>
                </g>

                {/* FR Locale */}
                <g transform="translate(155, 40)">
                  <circle cx="0" cy="0" r="10" fill="#090d16" stroke="#14b8a6" strokeWidth="1.2" />
                  <circle cx="0" cy="0" r="12" fill="none" stroke="#14b8a6" strokeWidth="0.5" opacity="0.3" className="intl-node-ping" />
                  <text x="0" y="2" fontSize="5" fontWeight="900" fill="#14b8a6" textAnchor="middle">FR</text>
                  <text x="0" y="16" fontSize="4.5" fontWeight="700" fill="#64748b" textAnchor="middle">/fr</text>
                </g>

                {/* Center Hub: x-default */}
                <g transform="translate(100, 85)">
                  <circle cx="0" cy="0" r="12" fill="#090d16" stroke="#e2e8f0" strokeWidth="1.5" />
                  <svg x="-6" y="-6" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="#e2e8f0" strokeWidth="2.2">
                    <circle cx="12" cy="12" r="10" />
                    <path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z" />
                    <path d="M2 12h20" />
                  </svg>
                  <text x="0" y="18" fontSize="4.5" fontWeight="900" fill="#94a3b8" textAnchor="middle">x-default</text>
                </g>
              </svg>
            </div>
          </div>

          {/* Right: Hreflang translation checklist */}
          <div className="md:col-span-6 flex flex-col justify-between h-full bg-slate-950/70 rounded-xl border border-white/5 p-3.5 relative overflow-hidden font-sans">
            <span className="text-[7.5px] text-slate-500 uppercase tracking-widest font-black block mb-2.5">Localization Mappings</span>
            
            <div className="flex-grow flex flex-col justify-center space-y-1.5">
              {/* Region 1 */}
              <div className="flex justify-between items-center bg-slate-900/40 rounded px-2.5 py-1.5 border border-white/[0.02]">
                <div className="flex flex-col">
                  <span className="text-[8px] font-bold text-slate-350">English Fallback</span>
                  <span className="text-[6.5px] text-slate-500 font-mono">en-US ➔ /en</span>
                </div>
                <span className="text-[6.5px] text-emerald-400 font-bold bg-emerald-500/10 px-1.5 py-0.5 rounded border border-emerald-500/20">Reciprocal ✓</span>
              </div>

              {/* Region 2 */}
              <div className="flex justify-between items-center bg-slate-900/40 rounded px-2.5 py-1.5 border border-white/[0.02]">
                <div className="flex flex-col">
                  <span className="text-[8px] font-bold text-slate-350">German Language</span>
                  <span className="text-[6.5px] text-slate-500 font-mono">de-DE ➔ /de</span>
                </div>
                <span className="text-[6.5px] text-emerald-400 font-bold bg-emerald-500/10 px-1.5 py-0.5 rounded border border-emerald-500/20">Reciprocal ✓</span>
              </div>

              {/* Region 3 */}
              <div className="flex justify-between items-center bg-slate-900/40 rounded px-2.5 py-1.5 border border-white/[0.02]">
                <div className="flex flex-col">
                  <span className="text-[8px] font-bold text-slate-350">French Language</span>
                  <span className="text-[6.5px] text-slate-500 font-mono">fr-FR ➔ /fr</span>
                </div>
                <span className="text-[6.5px] text-emerald-400 font-bold bg-emerald-500/10 px-1.5 py-0.5 rounded border border-emerald-500/20">Reciprocal ✓</span>
              </div>
            </div>

            <div className="text-[8px] text-slate-550 border-t border-slate-900/60 pt-2 flex justify-between items-center font-semibold">
              <span>Alternate targets: 3 regions</span>
              <span className="text-teal-400">Hreflang verified</span>
            </div>
          </div>
        </div>

        <div className="p-2.5 rounded-xl bg-slate-950/80 border border-white/5 flex items-center justify-between text-[8.5px] text-slate-500 font-sans">
          <span>Alternate Targets: 3 regions</span>
          <span className="text-emerald-400 font-bold">Localization Signals Mapped</span>
        </div>

        <style dangerouslySetInnerHTML={{ __html: `
          @keyframes intlFlow {
            0% { stroke-dashoffset: 0; }
            100% { stroke-dashoffset: -20; }
          }
          @keyframes intlNodePing {
            0% { r: 10; opacity: 0.5; }
            100% { r: 14; opacity: 0; }
          }
          .intl-flow-1 { animation: intlFlow 2s linear infinite; }
          .intl-flow-2 { animation: intlFlow 1.8s linear infinite; }
          .intl-flow-3 { animation: intlFlow 2.2s linear infinite; }
          .intl-node-ping { animation: intlNodePing 2s ease-out infinite; }
        ` }} />
      </div>
    );
  }

  if (type === "mobile") {
    return (
      <div className="w-full h-full flex flex-col justify-between overflow-hidden select-none font-sans text-xs">
        {/* Mock DevTools tab layout */}
        <div className="flex items-center justify-between border-b border-white/5 pb-2">
          <div className="flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-red-500/30 border border-red-500/50" />
            <span className="w-2 h-2 rounded-full bg-yellow-500/30 border border-yellow-500/50" />
            <span className="w-2 h-2 rounded-full bg-green-500/30 border border-green-500/50" />
          </div>
          <div className="flex gap-2.5 text-[9px] font-extrabold text-slate-500">
            <span className="text-teal-400 border-b border-teal-400 pb-1.5">Responsive chassis</span>
            <span>Viewport checks</span>
            <span>Layout Breakpoints</span>
          </div>
        </div>

        {/* Split Layout: Left (Phone Simulator), Right (Checklist responsiveness) */}
        <div className="flex-grow grid grid-cols-1 md:grid-cols-12 gap-5 py-4 items-stretch">
          {/* Left: Phone Simulator */}
          <div className="md:col-span-6 flex flex-col justify-between items-center h-full bg-slate-950/70 rounded-xl border border-white/5 p-3.5 relative overflow-hidden">
            <div className="flex items-center justify-between border-b border-slate-900 pb-1.5 mb-2 w-full">
              <span className="text-[7.5px] text-slate-555 uppercase tracking-widest font-black">Viewport Simulator</span>
              <span className="text-[7.5px] text-emerald-400 bg-emerald-500/10 px-1.5 py-0.5 rounded border border-emerald-500/20 font-bold uppercase">100% Fit</span>
            </div>

            <div className="relative w-full flex-grow flex items-center justify-center my-1.5">
              <svg className="w-full h-full min-h-[120px]" viewBox="0 0 200 120" fill="none" xmlns="http://www.w3.org/2000/svg">
                {/* Dotted target bounds */}
                <rect x="55" y="10" width="90" height="100" rx="8" stroke="rgba(20,184,166,0.15)" strokeWidth="1" strokeDasharray="3 3" />
                
                {/* Resizing Phone Chassis */}
                <g className="mobile-chassis-group">
                  {/* Phone Outer Body */}
                  <rect x="-35" y="-48" width="70" height="96" rx="9" fill="#090d16" stroke="#475569" strokeWidth="1.8" />
                  {/* Speaker bar */}
                  <line x1="-8" y1="-43" x2="8" y2="-43" stroke="#475569" strokeWidth="1" strokeLinecap="round" />
                  
                  {/* Screen Content Window */}
                  <rect x="-31" y="-38" width="62" height="80" rx="4" fill="#020617" stroke="#1e293b" strokeWidth="0.8" />
                  
                  {/* Mock responsive layout elements (reflowing grid cards) */}
                  {/* Header card */}
                  <rect x="-26" y="-32" width="52" height="12" rx="2" fill="#14b8a6" fillOpacity="0.15" stroke="#14b8a6" strokeWidth="0.8" className="mobile-reflow-header" />
                  {/* Layout block 1 */}
                  <rect x="-26" y="-16" width="23" height="18" rx="2" fill="#8b5cf6" fillOpacity="0.15" stroke="#8b5cf6" strokeWidth="0.8" className="mobile-reflow-card1" />
                  {/* Layout block 2 */}
                  <rect x="3" y="-16" width="23" height="18" rx="2" fill="#3b82f6" fillOpacity="0.15" stroke="#3b82f6" strokeWidth="0.8" className="mobile-reflow-card2" />
                  {/* Footer links bar */}
                  <rect x="-26" y="8" width="52" height="8" rx="1.5" fill="#f59e0b" fillOpacity="0.15" stroke="#f59e0b" strokeWidth="0.8" className="mobile-reflow-footer" />
                </g>

                {/* Arrow markers indicating responsive squeezing */}
                <g className="mobile-arrow-left">
                  <path d="M 35 60 L 45 60 M 41 56 L 45 60 L 41 64" stroke="#14b8a6" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round" />
                </g>
                <g className="mobile-arrow-right">
                  <path d="M 165 60 L 155 60 M 159 56 L 155 60 L 159 64" stroke="#14b8a6" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round" />
                </g>
              </svg>
            </div>

            <span className="text-[7.5px] text-slate-500 uppercase tracking-widest font-black">Fluid Breakpoint Scaling</span>
          </div>

          {/* Right: Checklist responsiveness */}
          <div className="md:col-span-6 flex flex-col justify-between h-full bg-slate-950/70 rounded-xl border border-white/5 p-3.5 relative overflow-hidden font-sans">
            <span className="text-[7.5px] text-slate-500 uppercase tracking-widest font-black block mb-2.5">Mobile Usability</span>
            
            <div className="flex-grow flex flex-col justify-center space-y-1.5">
              {/* Metric 1 */}
              <div className="flex justify-between items-center bg-slate-900/40 rounded px-2.5 py-1.5 border border-white/[0.02]">
                <div className="flex flex-col">
                  <span className="text-[8px] font-bold text-slate-300">Responsive Viewport</span>
                  <span className="text-[6.5px] text-slate-500 font-mono">width=device-width</span>
                </div>
                <span className="text-[6.5px] text-emerald-400 font-bold bg-emerald-500/10 px-1.5 py-0.5 rounded border border-emerald-500/20">Configured</span>
              </div>

              {/* Metric 2 */}
              <div className="flex justify-between items-center bg-slate-900/40 rounded px-2.5 py-1.5 border border-white/[0.02]">
                <div className="flex flex-col">
                  <span className="text-[8px] font-bold text-slate-300">Content Fit Width</span>
                  <span className="text-[6.5px] text-slate-500 font-mono">0px horizontal overflow</span>
                </div>
                <span className="text-[6.5px] text-emerald-400 font-bold bg-emerald-500/10 px-1.5 py-0.5 rounded border border-emerald-500/20">100% Pass</span>
              </div>

              {/* Metric 3 */}
              <div className="flex justify-between items-center bg-slate-900/40 rounded px-2.5 py-1.5 border border-white/[0.02]">
                <div className="flex flex-col">
                  <span className="text-[8px] font-bold text-slate-300">Touch Target Spacing</span>
                  <span className="text-[6.5px] text-slate-500 font-mono">8px separation clearance</span>
                </div>
                <span className="text-[6.5px] text-emerald-400 font-bold bg-emerald-500/10 px-1.5 py-0.5 rounded border border-emerald-500/20">AAA Grade</span>
              </div>
            </div>

            <div className="text-[8px] text-slate-550 border-t border-slate-900/60 pt-2 flex justify-between items-center font-semibold">
              <span>Mobile friendliness: Excellent</span>
              <span className="text-teal-400">All checks pass</span>
            </div>
          </div>
        </div>

        <div className="p-2.5 rounded-xl bg-slate-950/80 border border-white/5 flex items-center justify-between text-[8.5px] text-slate-500 font-sans">
          <span>Viewport: width=device-width</span>
          <span className="text-emerald-400 font-bold">Usability Checklist Verified</span>
        </div>

        <style dangerouslySetInnerHTML={{ __html: `
          @keyframes mobileSqueeze {
            0%, 100% { transform: translate(100px, 60px) scaleX(1); }
            50% { transform: translate(100px, 60px) scaleX(0.85); }
          }
          @keyframes mobileArrowL {
            0%, 100% { transform: translateX(0); }
            50% { transform: translateX(4px); }
          }
          @keyframes mobileArrowR {
            0%, 100% { transform: translateX(0); }
            50% { transform: translateX(-4px); }
          }
          .mobile-chassis-group {
            animation: mobileSqueeze 5s ease-in-out infinite;
            transform-origin: center;
          }
          .mobile-arrow-left { animation: mobileArrowL 5s ease-in-out infinite; }
          .mobile-arrow-right { animation: mobileArrowR 5s ease-in-out infinite; }
        ` }} />
      </div>
    );
  }

  if (type === "indexability") {
    return (
      <div className="w-full h-full flex flex-col justify-between overflow-hidden select-none font-sans text-xs">
        {/* Mock DevTools tab layout */}
        <div className="flex items-center justify-between border-b border-white/5 pb-2">
          <div className="flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-red-500/30 border border-red-500/50" />
            <span className="w-2 h-2 rounded-full bg-yellow-500/30 border border-yellow-500/50" />
            <span className="w-2 h-2 rounded-full bg-green-500/30 border border-green-500/50" />
          </div>
          <div className="flex gap-2.5 text-[9px] font-extrabold text-slate-500">
            <span className="text-teal-400 border-b border-teal-400 pb-1.5">Index Directives</span>
            <span>Canonical Consolidation</span>
            <span>Crawler Logs</span>
          </div>
        </div>

        {/* Split Layout */}
        <div className="flex-grow grid grid-cols-1 md:grid-cols-12 gap-5 py-4 items-stretch">
          {/* Left: Crawler Output */}
          <div className="md:col-span-6 flex flex-col justify-between h-full bg-slate-950/70 rounded-xl border border-white/5 p-3.5 relative overflow-hidden font-mono text-[9px]">
            <div className="flex items-center justify-between border-b border-slate-900 pb-1.5 mb-2 w-full">
              <span className="text-slate-500 uppercase tracking-widest font-black">Directives Auditor</span>
              <span className="text-emerald-400 font-bold bg-emerald-500/10 px-1.5 py-0.5 rounded border border-emerald-500/20">Verified</span>
            </div>

            <div className="space-y-2 py-1">
              <div className="flex justify-between border-b border-white/[0.02] pb-1">
                <span className="text-slate-500">GET /blog/seo-trends</span>
                <span className="text-emerald-400 font-bold">200 OK</span>
              </div>
              <div className="flex justify-between border-b border-white/[0.02] pb-1">
                <span className="text-slate-500">x-robots-tag</span>
                <span className="text-teal-400 font-bold">index, follow</span>
              </div>
              <div className="flex justify-between border-b border-white/[0.02] pb-1">
                <span className="text-slate-500">canonical</span>
                <span className="text-slate-300 truncate max-w-[100px]">/blog/seo-trends</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">robots metadata</span>
                <span className="text-teal-400 font-bold">all, index</span>
              </div>
            </div>
            
            <div className="text-[8px] text-slate-550 border-t border-slate-900/60 pt-2 flex justify-between items-center font-semibold">
              <span>Canonical mismatch: None</span>
              <span className="text-teal-400">100% Eligible</span>
            </div>
          </div>

          {/* Right: Validation Checklist */}
          <div className="md:col-span-6 flex flex-col justify-between h-full bg-slate-950/70 rounded-xl border border-white/5 p-3.5 relative overflow-hidden">
            <span className="text-[7.5px] text-slate-500 uppercase tracking-widest font-black block mb-2.5">Indexability Scores</span>
            
            <div className="flex-grow flex flex-col justify-center space-y-1.5">
              <div className="flex justify-between items-center bg-slate-900/40 rounded px-2.5 py-1.5 border border-white/[0.02]">
                <div className="flex flex-col">
                  <span className="text-[8px] font-bold text-slate-300">Canonical Matching</span>
                  <span className="text-[6.5px] text-slate-500 font-mono">No loops or conflicts</span>
                </div>
                <span className="text-[6.5px] text-emerald-400 font-bold bg-emerald-500/10 px-1.5 py-0.5 rounded border border-emerald-500/20">Passed</span>
              </div>

              <div className="flex justify-between items-center bg-slate-900/40 rounded px-2.5 py-1.5 border border-white/[0.02]">
                <div className="flex flex-col">
                  <span className="text-[8px] font-bold text-slate-300">Robots directives</span>
                  <span className="text-[6.5px] text-slate-500 font-mono">No index bloat detected</span>
                </div>
                <span className="text-[6.5px] text-emerald-400 font-bold bg-emerald-500/10 px-1.5 py-0.5 rounded border border-emerald-500/20">Clean</span>
              </div>

              <div className="flex justify-between items-center bg-slate-900/40 rounded px-2.5 py-1.5 border border-white/[0.02]">
                <div className="flex flex-col">
                  <span className="text-[8px] font-bold text-slate-300">Thin Content Check</span>
                  <span className="text-[6.5px] text-slate-500 font-mono">Word count &gt; threshold</span>
                </div>
                <span className="text-[6.5px] text-emerald-400 font-bold bg-emerald-500/10 px-1.5 py-0.5 rounded border border-emerald-500/20">Passed</span>
              </div>
            </div>
          </div>
        </div>

        <div className="p-2.5 rounded-xl bg-slate-950/80 border border-white/5 flex items-center justify-between text-[8.5px] text-slate-500 font-sans">
          <span>Target URL is fully ready for Googlebot indexing</span>
          <span className="text-emerald-400 font-bold">100/100 Score</span>
        </div>
      </div>
    );
  }

  if (type === "backlinks") {
    return (
      <div className="w-full h-full flex flex-col justify-between overflow-hidden select-none font-sans text-xs">
        {/* Mock DevTools tab layout */}
        <div className="flex items-center justify-between border-b border-white/5 pb-2">
          <div className="flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-red-500/30 border border-red-500/50" />
            <span className="w-2 h-2 rounded-full bg-yellow-500/30 border border-yellow-500/50" />
            <span className="w-2 h-2 rounded-full bg-green-500/30 border border-green-500/50" />
          </div>
          <div className="flex gap-2.5 text-[9px] font-extrabold text-slate-500">
            <span className="text-teal-400 border-b border-teal-400 pb-1.5">Link Equity</span>
            <span>Anchor Texts</span>
            <span>Trust Citations</span>
          </div>
        </div>

        {/* Split Layout */}
        <div className="flex-grow grid grid-cols-1 md:grid-cols-12 gap-5 py-4 items-stretch">
          {/* Left: Link structure visualizer */}
          <div className="md:col-span-6 flex flex-col justify-between h-full bg-slate-950/70 rounded-xl border border-white/5 p-3.5 relative overflow-hidden">
            <div className="flex items-center justify-between border-b border-slate-900 pb-1.5 mb-2 w-full">
              <span className="text-[7.5px] text-slate-500 uppercase tracking-widest font-black">Anchor Text Distribution</span>
              <span className="text-[7.5px] text-emerald-400 bg-emerald-500/10 px-1.5 py-0.5 rounded border border-emerald-500/20 font-bold uppercase">Healthy</span>
            </div>

            <div className="relative w-full flex-grow flex items-center justify-center py-1">
              <svg className="w-full h-full min-h-[90px]" viewBox="0 0 200 90" fill="none" xmlns="http://www.w3.org/2000/svg">
                {/* Outbound Link Nodes */}
                <circle cx="40" cy="45" r="12" fill="#090d16" stroke="#8b5cf6" strokeWidth="1.2" />
                <text x="40" y="47.5" fontSize="5.5" fontWeight="bold" fill="#a78bfa" textAnchor="middle">Branded</text>

                <circle cx="100" cy="25" r="12" fill="#090d16" stroke="#14b8a6" strokeWidth="1.2" />
                <text x="100" y="27.5" fontSize="5.5" fontWeight="bold" fill="#2dd4bf" textAnchor="middle">Keyword</text>

                <circle cx="160" cy="45" r="12" fill="#090d16" stroke="#3b82f6" strokeWidth="1.2" />
                <text x="160" y="47.5" fontSize="5.5" fontWeight="bold" fill="#60a5fa" textAnchor="middle">Generic</text>

                <path d="M 40 45 L 100 25 M 100 25 L 160 45" stroke="rgba(255,255,255,0.06)" strokeWidth="1" strokeDasharray="3 3" />
              </svg>
            </div>

            <span className="text-[7px] text-slate-500 uppercase tracking-widest font-black text-center block">Anchor Text Type Overlap</span>
          </div>

          {/* Right: Metrics */}
          <div className="md:col-span-6 flex flex-col justify-between h-full bg-slate-950/70 rounded-xl border border-white/5 p-3.5 relative overflow-hidden">
            <span className="text-[7.5px] text-slate-500 uppercase tracking-widest font-black block mb-2.5">Equity Ratios</span>
            
            <div className="flex-grow flex flex-col justify-center space-y-1.5">
              <div className="flex justify-between items-center bg-slate-900/40 rounded px-2.5 py-1.5 border border-white/[0.02]">
                <div className="flex flex-col">
                  <span className="text-[8px] font-bold text-slate-300">Authority Citations</span>
                  <span className="text-[6.5px] text-slate-500 font-mono">Linked to trusted .gov/.edu</span>
                </div>
                <span className="text-[6.5px] text-emerald-400 font-bold bg-emerald-500/10 px-1.5 py-0.5 rounded border border-emerald-500/20">E-E-A-T Check</span>
              </div>

              <div className="flex justify-between items-center bg-slate-900/40 rounded px-2.5 py-1.5 border border-white/[0.02]">
                <div className="flex flex-col">
                  <span className="text-[8px] font-bold text-slate-300">Anchor Distribution</span>
                  <span className="text-[6.5px] text-slate-500 font-mono">Branded anchors dominance</span>
                </div>
                <span className="text-[6.5px] text-emerald-400 font-bold bg-emerald-500/10 px-1.5 py-0.5 rounded border border-emerald-500/20">Optimal</span>
              </div>

              <div className="flex justify-between items-center bg-slate-900/40 rounded px-2.5 py-1.5 border border-white/[0.02]">
                <div className="flex flex-col">
                  <span className="text-[8px] font-bold text-slate-300">Outbound Link Health</span>
                  <span className="text-[6.5px] text-slate-500 font-mono">0 malformed link protocols</span>
                </div>
                <span className="text-[6.5px] text-emerald-400 font-bold bg-emerald-500/10 px-1.5 py-0.5 rounded border border-emerald-500/20">Clean</span>
              </div>
            </div>
          </div>
        </div>

        <div className="p-2.5 rounded-xl bg-slate-950/80 border border-white/5 flex items-center justify-between text-[8.5px] text-slate-500 font-sans">
          <span>Authority citation profile and internal link anchors are optimized</span>
          <span className="text-emerald-400 font-bold">Passed</span>
        </div>
      </div>
    );
  }

  if (type === "drift") {
    return (
      <div className="w-full h-full flex flex-col justify-between overflow-hidden select-none font-sans text-xs">
        {/* Mock DevTools tab layout */}
        <div className="flex items-center justify-between border-b border-white/5 pb-2">
          <div className="flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-red-500/30 border border-red-500/50" />
            <span className="w-2 h-2 rounded-full bg-yellow-500/30 border border-yellow-500/50" />
            <span className="w-2 h-2 rounded-full bg-green-500/30 border border-green-500/50" />
          </div>
          <div className="flex gap-2.5 text-[9px] font-extrabold text-slate-500">
            <span className="text-teal-400 border-b border-teal-400 pb-1.5">Baseline vs Current</span>
            <span>Diff Alerts</span>
            <span>Historical Logs</span>
          </div>
        </div>

        {/* Split Layout */}
        <div className="flex-grow grid grid-cols-1 md:grid-cols-12 gap-5 py-4 items-stretch">
          {/* Left: Code Diff viewer */}
          <div className="md:col-span-7 flex flex-col justify-between h-full bg-slate-950/70 rounded-xl border border-white/5 p-3.5 relative overflow-hidden font-mono text-[8px]">
            <div className="flex items-center justify-between border-b border-slate-900 pb-1.5 mb-2 w-full">
              <span className="text-slate-500 uppercase tracking-widest font-black">Git-Style Diff</span>
              <span className="text-rose-400 font-bold bg-rose-500/10 px-1.5 py-0.5 rounded border border-rose-500/20">Drift Alert</span>
            </div>

            <div className="space-y-1.5 py-1">
              <div className="text-slate-500">@@ -1,5 +1,5 @@</div>
              <div className="text-rose-400 bg-rose-500/5 px-1 py-0.5 border-l-2 border-rose-500">- &lt;title&gt;Best Developer Tools for SEO&lt;/title&gt;</div>
              <div className="text-emerald-400 bg-emerald-500/5 px-1 py-0.5 border-l-2 border-emerald-500">+ &lt;title&gt;SEO Toolkit - Home&lt;/title&gt;</div>
              <div className="text-slate-400 px-1 py-0.5 border-l-2 border-transparent">  &lt;meta name=&quot;description&quot; content=&quot;Audits...&quot;</div>
              <div className="text-rose-400 bg-rose-500/5 px-1 py-0.5 border-l-2 border-rose-500">- &lt;meta name=&quot;robots&quot; content=&quot;index,follow&quot;&gt;</div>
              <div className="text-emerald-400 bg-emerald-500/5 px-1 py-0.5 border-l-2 border-emerald-500">+ &lt;meta name=&quot;robots&quot; content=&quot;noindex,follow&quot;&gt;</div>
            </div>
            
            <div className="text-[7.5px] text-slate-550 border-t border-slate-900/60 pt-2 flex justify-between items-center font-semibold">
              <span className="text-rose-400">Critical: robots directive changed to noindex</span>
            </div>
          </div>

          {/* Right: Regressions Alert Center */}
          <div className="md:col-span-5 flex flex-col justify-between h-full bg-slate-950/70 rounded-xl border border-white/5 p-3.5 relative overflow-hidden">
            <span className="text-[7.5px] text-slate-500 uppercase tracking-widest font-black block mb-2.5">Alert Center</span>
            
            <div className="flex-grow flex flex-col justify-center space-y-1.5">
              <div className="flex justify-between items-center bg-rose-950/30 rounded px-2.5 py-1.5 border border-rose-500/10">
                <div className="flex flex-col">
                  <span className="text-[8px] font-bold text-rose-300">Index Status Drift</span>
                  <span className="text-[6.5px] text-rose-500/70 font-mono">noindex tags injected</span>
                </div>
                <span className="text-[6.5px] text-rose-400 font-bold bg-rose-500/10 px-1.5 py-0.5 rounded border border-rose-500/20">Critical</span>
              </div>

              <div className="flex justify-between items-center bg-amber-950/20 rounded px-2.5 py-1.5 border border-amber-500/10">
                <div className="flex flex-col">
                  <span className="text-[8px] font-bold text-amber-300">Title Tag Drift</span>
                  <span className="text-[6.5px] text-amber-500/70 font-mono">Meta title re-written</span>
                </div>
                <span className="text-[6.5px] text-amber-400 font-bold bg-amber-500/10 px-1.5 py-0.5 rounded border border-amber-500/20">High</span>
              </div>

              <div className="flex justify-between items-center bg-slate-900/40 rounded px-2.5 py-1.5 border border-white/[0.02]">
                <div className="flex flex-col">
                  <span className="text-[8px] font-bold text-slate-300">Status Code Drift</span>
                  <span className="text-[6.5px] text-slate-500 font-mono">Stable 200 responses</span>
                </div>
                <span className="text-[6.5px] text-emerald-400 font-bold bg-emerald-500/10 px-1.5 py-0.5 rounded border border-emerald-500/20">Stable</span>
              </div>
            </div>
          </div>
        </div>

        <div className="p-2.5 rounded-xl bg-slate-950/80 border border-white/5 flex items-center justify-between text-[8.5px] text-slate-500 font-sans">
          <span>Drift monitor detected 2 critical metadata changes against baseline</span>
          <span className="text-rose-400 font-bold">2 Regressions</span>
        </div>
      </div>
    );
  }

  return null;
}


export function ModuleGrid({ scanResults, phase }: ModuleGridProps) {
  const isScanned = phase === "complete" && !!scanResults;

  return (
    <section id="modules" className="relative py-20 sm:py-28 overflow-hidden">
      {/* ── Dynamic Luminous Aurora Mesh Background ── */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <motion.div
          animate={{
            x: [0, -70, 50, 0],
            y: [0, 60, -40, 0],
            scale: [1, 1.2, 0.9, 1],
          }}
          transition={{ duration: 18, repeat: Infinity, ease: "easeInOut" }}
          className="absolute top-1/4 left-[5%] w-[550px] h-[550px] rounded-full bg-gradient-to-br from-teal-500/35 via-emerald-500/20 to-transparent blur-[110px]"
        />
        <motion.div
          animate={{
            x: [0, 80, -60, 0],
            y: [0, -50, 70, 0],
            scale: [1, 1.15, 0.85, 1],
          }}
          transition={{ duration: 22, repeat: Infinity, ease: "easeInOut" }}
          className="absolute bottom-1/4 right-[5%] w-[600px] h-[600px] rounded-full bg-gradient-to-tl from-indigo-500/35 via-purple-500/25 to-transparent blur-[120px]"
        />
      </div>

      {/* ── Cyber Matrix Dot Grid Overlay ── */}
      <div
        className="absolute inset-0 opacity-25 pointer-events-none"
        style={{
          backgroundImage: "radial-gradient(rgba(255, 255, 255, 0.08) 1px, transparent 1px)",
          backgroundSize: "24px 24px",
          maskImage: "radial-gradient(ellipse 90% 70% at 50% 50%, black 40%, transparent 100%)",
          WebkitMaskImage: "radial-gradient(ellipse 90% 70% at 50% 50%, black 40%, transparent 100%)",
        }}
      />

      {/* ── Top & Bottom Glow Dividers ── */}
      <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-teal-500/40 to-transparent pointer-events-none" />
      <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-indigo-500/40 to-transparent pointer-events-none" />

      <div className="relative max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 mb-16 sm:mb-24">
        {/* Section header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.5 }}
          className="text-center"
        >
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-gradient-to-r from-teal-500/25 to-indigo-500/25 border border-teal-500/30 text-teal-400 text-xs font-bold uppercase tracking-wider mb-5 shadow-lg shadow-teal-500/10">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
              <path d="M4 6h16M4 12h16M4 18h16" />
            </svg>
            18 Parallel Check Modules
          </div>
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-black text-white tracking-tight mb-4 leading-tight">
            One URL. <span className="gradient-text">Eighteen audits.</span> One report.
          </h2>
          <p className="text-sm sm:text-base text-slate-300 max-w-xl mx-auto leading-relaxed font-semibold">
            Every module runs in parallel across our cloud architecture. Below is the full breakdown of all 18 audit check modules.
          </p>
        </motion.div>
      </div>

      {/* ── Staggered Full-Width Alternating Bands for all 18 modules ── */}
      <div className="w-full border-t border-white/5">
{MODULES.map((mod, modIdx) => {
          const isEven = modIdx % 2 === 0;
          const extra = MODULE_EXTRAS[mod.id] || { longDesc: mod.description, checks: [] };
          const match = isScanned ? scanResults.find((r) => r.moduleId === mod.id) : null;
          const score = match ? match.score : null;
          const color = score !== null ? getScoreColor(score) : getScoreColor(mod.demoScore);
          const activeScore = score !== null ? score : mod.demoScore;

          return (
            <div
              key={mod.id}
              className={`w-full py-20 sm:py-24 border-b border-white/5 relative overflow-hidden ${
                isEven
                  ? "bg-gradient-to-r from-slate-950 via-teal-950/15 to-slate-950"
                  : "bg-gradient-to-r from-slate-950 via-indigo-950/15 to-slate-950"
              }`}
            >
              {/* Decorative radial aurora glow circle background */}
              <div className="absolute inset-0 pointer-events-none overflow-hidden">
                <div className={`absolute top-1/2 -translate-y-1/2 w-[350px] h-[350px] rounded-full blur-[100px] opacity-[0.14] ${
                  isEven ? "left-[5%] bg-teal-500" : "right-[5%] bg-indigo-500"
                }`} />
              </div>

              <div className="relative max-w-7xl mx-auto px-4 sm:px-8 lg:px-16 grid grid-cols-1 lg:grid-cols-12 items-center gap-12 lg:gap-16">
                {/* Column A: Information Panel (Raw, borderless) */}
                <motion.div
                  initial={{ opacity: 0, x: isEven ? -45 : 45 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true, margin: "-80px" }}
                  transition={{ duration: 0.5 }}
                  className={`flex flex-col justify-between h-full space-y-6 lg:col-span-5 ${
                    isEven ? "lg:order-1" : "lg:order-2"
                  }`}
                >
                  <div className="space-y-4">
                    {/* Index tag & Label */}
                    <div className="flex items-center gap-2">
                      <span className="text-[10px] font-mono font-black text-teal-400 bg-teal-500/10 px-2 py-0.5 rounded-md border border-teal-500/25">
                        {modIdx + 1 < 10 ? `0${modIdx + 1}` : modIdx + 1}
                      </span>
                      <span className="text-xs font-black uppercase text-teal-400 tracking-wider">
                        Core Module
                      </span>
                    </div>

                    <div className="flex items-center gap-3">
                      <motion.div
                        whileHover={{ scale: 1.05, rotate: 2 }}
                        className="w-10 h-10 rounded-xl bg-gradient-to-br from-teal-500/20 to-teal-500/5 border border-teal-500/30 flex items-center justify-center text-teal-400 shadow-[0_0_12px_rgba(20,184,166,0.12)] transition-all duration-300"
                      >
                        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                          <path d={mod.iconPath} />
                        </svg>
                      </motion.div>
                      <h3 className="text-2xl sm:text-3xl font-black text-white tracking-tight leading-tight">
                        {mod.name}
                      </h3>
                    </div>

                    {/* Rich, highly detailed technical description */}
                    <p className="text-xs sm:text-sm text-slate-300 leading-relaxed font-semibold">
                      {extra.longDesc}
                    </p>
                  </div>

                  {/* High-value 5-Point Technical Checklist (Raw, borderless nodes) */}
                  <div className="space-y-3">
                    <span className="text-[10px] font-black uppercase text-slate-500 tracking-widest block">Audit Parameters Verified</span>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-2.5 pt-1">
                      {extra.checks.map((chk) => (
                        <div key={chk} className="flex items-center gap-2 text-[11px] font-bold text-slate-300">
                          <span className="w-1.5 h-1.5 rounded-full bg-teal-400 shadow-[0_0_4px_#14b8a6] shrink-0" />
                          <span>{chk}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Main check indicators & Terminal Console logs (Borderless Column Wrapper) */}
                  <div className="space-y-4 pt-3">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-black uppercase text-slate-400 tracking-wider">Module Scan Rating</span>
                      <div className="flex items-center gap-2">
                        <span className="text-[10px] font-bold text-slate-500 font-sans uppercase">Score</span>
                        <span
                          className="text-xs font-mono font-black px-2.5 py-0.5 rounded-md border shadow-sm"
                          style={{
                            color,
                            backgroundColor: `${color}10`,
                            borderColor: `${color}25`,
                          }}
                        >
                          {activeScore}
                        </span>
                      </div>
                    </div>

                    {match?.finding ? (
                      <div className="p-3.5 rounded-2xl bg-slate-950 border border-white/5 font-mono text-[10px] leading-relaxed text-slate-355 flex flex-col gap-1 shadow-inner">
                        <div className="flex items-center justify-between text-[8px] text-slate-500 uppercase tracking-widest font-black select-none mb-1">
                          <span>Console Output</span>
                          <span className="w-1.5 h-1.5 rounded-full bg-emerald-500/70 shadow-[0_0_4px_#10b981]" />
                        </div>
                        <div className="flex items-start gap-1.5">
                          <span className="text-teal-500 shrink-0 select-none font-bold">$&gt;</span>
                          <span className="font-medium text-slate-200">{match.finding}</span>
                        </div>
                      </div>
                    ) : (
                      <div className="flex items-center gap-2 text-slate-400 text-xs font-medium bg-slate-950/60 p-3 rounded-xl border border-white/5 shadow-inner">
                        <span className="w-2 h-2 rounded-full bg-slate-550 animate-pulse shrink-0" />
                        <span>Crawler ready to test target paths.</span>
                      </div>
                    )}
                  </div>
                </motion.div>

                {/* Column B: Visualizer Frame */}
                <motion.div
                  initial={{ opacity: 0, x: isEven ? 45 : -45 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true, margin: "-80px" }}
                  transition={{ duration: 0.5 }}
                  className={`flex w-full h-full lg:col-span-7 ${
                    isEven ? "lg:order-2" : "lg:order-1"
                  }`}
                >
                  <SpotlightPanel>
                    <SectionVisualizer type={mod.id} />
                  </SpotlightPanel>
                </motion.div>
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
}
