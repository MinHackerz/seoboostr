// ──────────────────────────────────────────────────────────────
// moduleData.ts — Shared data & utilities for the landing page
// ──────────────────────────────────────────────────────────────

export interface Module {
  id: string;
  name: string;
  shortName: string;
  description: string;
  /** SVG path data for the module icon (24×24 viewBox) */
  iconPath: string;
  /** Demo score shown in the module grid (static) */
  demoScore: number;
}

export const MODULES: Module[] = [
  {
    id: "technical",
    name: "Technical SEO",
    shortName: "Technical",
    description: "Crawlability, indexing directives, canonical tags, hreflang, and HTTP status codes.",
    iconPath: "M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.066 2.573c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.573 1.066c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.066-2.573c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z M15 12a3 3 0 11-6 0 3 3 0 016 0z",
    demoScore: 96,
  },
  {
    id: "onpage",
    name: "On-Page SEO",
    shortName: "On-Page",
    description: "Title tags, meta descriptions, heading hierarchy, keyword placement, and internal links.",
    iconPath: "M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z",
    demoScore: 91,
  },
  {
    id: "content",
    name: "Content & E-E-A-T",
    shortName: "Content",
    description: "Readability, topical depth, author signals, and experience-expertise-authority-trust markers.",
    iconPath: "M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z",
    demoScore: 84,
  },
  {
    id: "schema",
    name: "Schema Markup",
    shortName: "Schema",
    description: "Structured data validation, rich snippet eligibility, and JSON-LD completeness.",
    iconPath: "M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4",
    demoScore: 97,
  },
  {
    id: "images",
    name: "Image Audit",
    shortName: "Images",
    description: "Alt text coverage, format optimization, lazy loading, and responsive image markup.",
    iconPath: "M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z",
    demoScore: 88,
  },
  {
    id: "sitemap",
    name: "Sitemap Audit",
    shortName: "Sitemap",
    description: "XML sitemap validation, URL coverage, last-modified accuracy, and robots.txt alignment.",
    iconPath: "M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l5.447 2.724A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7",
    demoScore: 93,
  },
  {
    id: "ai",
    name: "AI & GEO Visibility",
    shortName: "AI/GEO",
    description: "Readiness for AI Overviews, ChatGPT citations, Perplexity sourcing, and generative search.",
    iconPath: "M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z",
    demoScore: 78,
  },
  {
    id: "sxo",
    name: "SXO & UX Audit",
    shortName: "SXO/UX",
    description: "Mobile usability, tap targets, font sizing, viewport config, and search experience signals.",
    iconPath: "M12 18h.01M8 21h8a2 2 0 002-2V5a2 2 0 00-2-2H8a2 2 0 00-2 2v14a2 2 0 002 2z",
    demoScore: 90,
  },
  {
    id: "performance",
    name: "Performance & CWV",
    shortName: "Performance",
    description: "Core Web Vitals (LCP, INP, CLS), TTFB, resource hints, and render-blocking analysis.",
    iconPath: "M13 10V3L4 14h7v7l9-11h-7z",
    demoScore: 82,
  },
  {
    id: "pagespeed",
    name: "PageSpeed Insights",
    shortName: "PageSpeed",
    description: "Lighthouse performance score, opportunity breakdown, and diagnostic audit results.",
    iconPath: "M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z",
    demoScore: 85,
  },
];

// ── Score utilities ──────────────────────────────────────────

export function getScoreColor(score: number): string {
  if (score >= 90) return "#0d9488"; // teal-600
  if (score >= 70) return "#d97706"; // amber-600
  return "#dc2626"; // red-600
}

export function getScoreLabel(score: number): string {
  if (score >= 90) return "Excellent";
  if (score >= 70) return "Needs Work";
  return "Critical";
}

export function getScoreTailwind(score: number): string {
  if (score >= 90) return "text-teal-400";
  if (score >= 70) return "text-amber-400";
  return "text-red-400";
}

export function getScoreBgTailwind(score: number): string {
  if (score >= 90) return "bg-teal-400/15";
  if (score >= 70) return "bg-amber-400/15";
  return "bg-red-400/15";
}

// ── Mock scan generator ──────────────────────────────────────

export interface ScanResult {
  moduleId: string;
  score: number;
  issues: number;
  finding: string;
  /** Delay in ms before this module "completes" */
  delay: number;
}

export function generateMockScan(): ScanResult[] {
  return MODULES.map((mod) => {
    // Realistic score ranges per module
    const baseScores: Record<string, [number, number]> = {
      technical: [78, 99],
      onpage: [72, 96],
      content: [65, 92],
      schema: [60, 99],
      images: [55, 95],
      sitemap: [80, 100],
      ai: [50, 88],
      sxo: [70, 95],
      performance: [45, 92],
      pagespeed: [50, 95],
    };
    const [min, max] = baseScores[mod.id] || [60, 95];
    const score = Math.floor(Math.random() * (max - min + 1)) + min;
    const issues = score >= 90 ? Math.floor(Math.random() * 3) : score >= 70 ? Math.floor(Math.random() * 8) + 2 : Math.floor(Math.random() * 15) + 5;
    
    // Exact outputs modulewise instead of generic placeholder text
    let finding = "";
    if (mod.id === "technical") {
      finding = score >= 90 ? "✓ SSL valid. Canonical tags matching. 0 redirect loops." : "⚠️ 2 redirect chains found. 1 page missing canonical.";
    } else if (mod.id === "onpage") {
      finding = score >= 90 ? "✓ H1 hierarchy correct. Meta descriptions optimized." : "⚠️ Missing meta description on 3 pages. Long title tags.";
    } else if (mod.id === "content") {
      finding = score >= 90 ? "✓ High topical depth. Author EEAT signals verified." : "⚠️ Low word count on blog posts. No author credentials.";
    } else if (mod.id === "schema") {
      finding = score >= 90 ? "✓ JSON-LD validated. Rich snippet search eligible." : "⚠️ No Organization schema found. Missing Breadcrumbs.";
    } else if (mod.id === "images") {
      finding = score >= 90 ? "✓ Responsive sizing active. 100% alt text coverage." : "⚠️ 8 images missing alt text. 3 large PNGs detected.";
    } else if (mod.id === "sitemap") {
      finding = score >= 90 ? "✓ Robots.txt matches XML sitemap. Indexable urls." : "⚠️ 4 URLs in sitemap return 404. Robots.txt mismatch.";
    } else if (mod.id === "ai") {
      finding = score >= 90 ? "✓ Structured content ready for ChatGPT / Perplexity." : "⚠️ Low generative search visibility. No entity schema.";
    } else if (mod.id === "sxo") {
      finding = score >= 90 ? "✓ Mobile tap targets >48px. Zero Layout Shift (CLS)." : "⚠️ Tap targets too close on mobile. Layout shift on load.";
    } else if (mod.id === "performance") {
      finding = score >= 90 ? "✓ LCP at 1.4s (Good). TTFB 120ms. Speed Index optimal." : "⚠️ LCP at 3.6s (Poor). 4 render-blocking scripts.";
    } else if (mod.id === "pagespeed") {
      finding = score >= 90 ? "✓ Lighthouse score 94. Main thread work < 1.2s." : "⚠️ Lighthouse performance 68. Excessive main thread work.";
    }

    // Staggered delays: 800ms - 3500ms to feel like parallel scans completing at different times
    const delay = 800 + Math.floor(Math.random() * 2700);
    return { moduleId: mod.id, score, issues, finding, delay };
  });
}

// ── Ticker messages ──────────────────────────────────────────

export const TICKER_MESSAGES = [
  { domain: "shopify-store.co", score: 87, detail: "3 critical schema issues found" },
  { domain: "startup.io", score: 94, detail: "all Core Web Vitals passed" },
  { domain: "devblog.dev", score: 72, detail: "14 images missing alt text" },
  { domain: "saas-landing.com", score: 91, detail: "E-E-A-T signals strong" },
  { domain: "indie-app.xyz", score: 68, detail: "LCP at 4.2s — needs work" },
  { domain: "portfolio.design", score: 96, detail: "perfect sitemap coverage" },
  { domain: "agency-site.co", score: 81, detail: "5 broken internal links" },
  { domain: "ecommerce-demo.store", score: 77, detail: "no structured data on product pages" },
  { domain: "nextjs-blog.app", score: 93, detail: "AI Overview ready" },
  { domain: "freelancer.me", score: 63, detail: "mobile tap targets too small" },
  { domain: "docs-platform.io", score: 89, detail: "2 render-blocking scripts" },
  { domain: "open-source.tools", score: 95, detail: "zero accessibility violations" },
];
