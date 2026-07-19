import type { Metadata } from "next";
import { Navbar } from "@/components/landing/Navbar";
import { Footer } from "@/components/landing/Footer";
import { FreeToolsHubClient } from "./FreeToolsHubClient";
import { ToolBackground } from "@/components/landing/ToolBackground";
import { CrawlerFaqClient } from "./crawler-checker/CrawlerFaqClient"; // reuse the FAQ component

export const metadata: Metadata = {
  title: "Free SEO Tools & Generators Hub | SEO Optimised",
  description:
    "Free tools to boost your organic search performance. Generate optimized meta tags, check sitemaps, generate robots.txt files, simulate AI Overviews, and perform instant audits.",
  alternates: {
    canonical: "https://seoptimised.com/free-tools",
  },
};

const TOOLS = [
  {
    title: "Meta Tag Generator",
    description: "Generate SEO-optimized title tags, meta descriptions, Open Graph protocol, and Twitter card markup in seconds.",
    href: "/free-tools/meta-tag-generator",
    icon: (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-teal-400">
        <path d="M4 9h16M4 15h16M10 3L6 21M18 3l-4 18" />
      </svg>
    ),
    badge: "Interactive",
  },
  {
    title: "Robots.txt Generator",
    description: "Declaratively build crawler instructions, set allow/disallow paths, define delays, and specify your XML sitemap.",
    href: "/free-tools/robots-generator",
    icon: (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-indigo-400">
        <rect x="3" y="3" width="18" height="18" rx="2" ry="2" />
        <line x1="9" y1="9" x2="15" y2="9" />
        <line x1="9" y1="13" x2="15" y2="13" />
        <line x1="9" y1="17" x2="13" y2="17" />
      </svg>
    ),
    badge: "Instant",
  },
  {
    title: "LLMs.txt Generator",
    description: "Build structured markdown indices for Large Language Models and AI crawlers to boost GEO and AI search rankings.",
    href: "/free-tools/llms-generator",
    icon: (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-pink-400">
        <path d="M21 16V8a2 2 0 00-1-1.73l-7-4a2 2 0 00-2 0l-7 4A2 2 0 003 8v8a2 2 0 001 1.73l7 4a2 2 0 002 0l7-4A2 2 0 0021 16z" />
        <polyline points="3.27 6.96 12 12.01 20.73 6.96" />
        <line x1="12" y1="22.08" x2="12" y2="12" />
      </svg>
    ),
    badge: "New / AI",
  },
  {
    title: "AI Overview Simulator",
    description: "Preview how your page will appear in Google's SGE/AI Overviews. Model citation cards, carousel lists, and organic CTR visibility before you publish.",
    href: "/free-tools/ai-overview-simulator",
    icon: (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-emerald-400">
        <rect x="2" y="3" width="20" height="14" rx="2" ry="2" />
        <line x1="8" y1="21" x2="16" y2="21" />
        <line x1="12" y1="17" x2="12" y2="21" />
        <path d="M12 8a2.5 2.5 0 1 0 0 5 2.5 2.5 0 1 0 0-5z" />
      </svg>
    ),
    badge: "New / AI",
  },
  {
    title: "GEO Citability Grader",
    description: "Evaluate your content for AI search optimization (GEO). Grade factual density, RAG readability, and direct answer formats for Perplexity and ChatGPT.",
    href: "/free-tools/geo-grader",
    icon: (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-amber-400">
        <path d="M21.21 15.89A10 10 0 1 1 8 2.83" />
        <path d="M22 12A10 10 0 0 0 12 2v10z" />
      </svg>
    ),
    badge: "New / AI",
  },
  {
    title: "AI Crawler Checker",
    description: "Check if your site blocks AI agent crawlers (GPTBot, ClaudeBot, Perplexity). Detect CDN/WAF blockades and robots.txt rules instantly.",
    href: "/free-tools/crawler-checker",
    icon: (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-rose-400">
        <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
        <circle cx="12" cy="11" r="2" />
      </svg>
    ),
    badge: "New / AI",
  },
];

const FAQS = [
  {
    q: "Are these SEO tools completely free to use?",
    a: "Yes. All resources in the SEO Toolbox are 100% free with no account registrations or limits. We run audits and simulations client-side or via lightweight API proxies to provide instant optimization results.",
  },
  {
    q: "What is the difference between traditional SEO and GEO?",
    a: "Traditional SEO optimizes websites to rank highly in search engine result pages (SERPs) for specific keywords. Generative Engine Optimization (GEO) focuses on structuring content so it can be parsed, understood, and cited by AI engines like Perplexity, ChatGPT Search, and Google AI Overviews.",
  },
  {
    q: "How often should I audit my robots.txt and sitemap configurations?",
    a: "You should audit these files whenever you launch new content sections, undergo a CMS migration, or notice crawl errors in Google Search Console. Ensuring crawlers can read sitemaps and indexing pages prevents sudden traffic drops.",
  },
  {
    q: "Do I need to block AI crawlers on my website?",
    a: "It depends on your business goals. If you want to protect your copyrighted materials from being used to train LLM models without license agreements, you should block bots like GPTBot or ClaudeBot. However, if you want your site cited as a source link in AI search responses, you must allow them."
  }
];

// JSON-LD Breadcrumbs Schema for Hub Page
const jsonLd = [
  {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    "itemListElement": [
      {
        "@type": "ListItem",
        "position": 1,
        "name": "Home",
        "item": "https://seoptimised.com"
      },
      {
        "@type": "ListItem",
        "position": 2,
        "name": "Free Tools",
        "item": "https://seoptimised.com/free-tools"
      }
    ]
  },
  {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    "mainEntity": FAQS.map(f => ({
      "@type": "Question",
      "name": f.q,
      "acceptedAnswer": {
        "@type": "Answer",
        "text": f.a
      }
    }))
  }
];

export default function FreeToolsHub() {
  return (
    <div 
      className="min-h-screen bg-slate-950 text-slate-100 flex flex-col justify-between overflow-x-hidden relative"
      style={{
        backgroundImage: `
          radial-gradient(circle at 10% 10%, rgba(20, 184, 166, 0.08) 0%, transparent 45%),
          radial-gradient(circle at 90% 20%, rgba(99, 102, 241, 0.08) 0%, transparent 45%),
          radial-gradient(circle at 50% 50%, rgba(168, 85, 247, 0.07) 0%, transparent 50%)
        `
      }}
    >
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <ToolBackground />
      <Navbar />
      
      <main className="flex-grow pt-28 pb-20 px-4 sm:px-6 lg:px-8 relative z-10">
        <FreeToolsHubClient tools={TOOLS} />

        {/* Dynamic GEO Playbook to solve Thin Content / Low Value flags */}
        <div className="max-w-5xl mx-auto border-t border-white/10 pt-16 mt-16 font-sans">
          <div className="space-y-12">
            <div className="border-b border-white/10 pb-6 text-center sm:text-left">
              <h2 className="text-2xl sm:text-3xl font-black text-white tracking-tight leading-tight">
                Generative Engine Optimization (GEO) & Modern Technical SEO Playbook
              </h2>
              <p className="text-slate-400 text-xs sm:text-sm mt-2 leading-relaxed font-medium">
                Unifying metadata standards, crawler control interfaces, and factual copy structures to win citations in search generative models.
              </p>
            </div>

            <div className="grid md:grid-cols-2 gap-8 items-start">
              <div className="space-y-4">
                <h3 className="text-lg font-bold text-white border-l-2 border-teal-500 pl-3">
                  1. Unifying Crawl Controls & Data Indexes
                </h3>
                <p className="text-slate-300 text-xs sm:text-sm leading-relaxed">
                  Modern search indexation is moving beyond traditional HTML scraping. Today, sites must serve two types of index configurations: <strong>robots.txt</strong> for standard search spiders, and <strong>llms.txt</strong> files for RAG-driven AI agents. Restricting bot access to staging paths while allowing access to indexers like <code>OAI-SearchBot</code> ensures your site remains a top reference block for AI query builders.
                </p>
              </div>

              <div className="space-y-4">
                <h3 className="text-lg font-bold text-white border-l-2 border-teal-500 pl-3">
                  2. Writing for LLM Synthesizers
                </h3>
                <p className="text-slate-300 text-xs sm:text-sm leading-relaxed">
                  Unlike conventional search links, AI engines synthesize responses. To be cited, content must feature a high <strong>information density</strong>. Marketing adjectives and vague buzzwords decrease a page's citation score. Instead, construct objective, fact-driven sections structured with headers, comparative tables, and definition sequences.
                </p>
              </div>
            </div>

            {/* Combined Steps table */}
            <div className="space-y-4">
              <h3 className="text-lg font-bold text-white border-l-2 border-teal-500 pl-3">
                How to Leverage the SEO Toolbox
              </h3>
              <div className="overflow-x-auto border border-white/10 rounded-2xl bg-slate-900/20 backdrop-blur-md">
                <table className="w-full text-left border-collapse text-xs sm:text-sm text-slate-350">
                  <thead>
                    <tr className="border-b border-white/10 bg-white/5 text-white font-bold">
                      <th className="p-4">Utility Tool</th>
                      <th className="p-4">Core Objective</th>
                      <th className="p-4">SEO Value Addition</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-white/5">
                    <tr>
                      <td className="p-4 font-bold text-white">Meta Tag Generator</td>
                      <td className="p-4">Create clean HTML descriptions, OG elements, and Twitter cards.</td>
                      <td className="p-4 text-slate-400">Boosts organic search click-through-rates and enforces consistent social previews.</td>
                    </tr>
                    <tr>
                      <td className="p-4 font-bold text-white">Robots.txt Generator</td>
                      <td className="p-4">Define user-agent crawl paths and register XML sitemaps.</td>
                      <td className="p-4 text-slate-400">Protects sensitive paths and prevents search crawlers from wasting crawl budget.</td>
                    </tr>
                    <tr>
                      <td className="p-4 font-bold text-white">LLMs.txt Generator</td>
                      <td className="p-4">Build structured Markdown sitemap indexes for LLM ingestion.</td>
                      <td className="p-4 text-slate-400">Improves brand and documentation citations in Perplexity and Claude search agents.</td>
                    </tr>
                    <tr>
                      <td className="p-4 font-bold text-white">AI Overview Simulator</td>
                      <td className="p-4">Preview card crops and SGE snippets before publishing.</td>
                      <td className="p-4 text-slate-400">Ensures brand logo, title limits (under 45 characters), and snippet quotes display cleanly.</td>
                    </tr>
                    <tr>
                      <td className="p-4 font-bold text-white">GEO Citability Grader</td>
                      <td className="p-4">Grade factual density, direct answers, and chunk structures.</td>
                      <td className="p-4 text-slate-400">Provides clear guidelines to rewrite pages so they are referenced as citations.</td>
                    </tr>
                    <tr>
                      <td className="p-4 font-bold text-white">AI Crawler Checker</td>
                      <td className="p-4">Diagnose network blocks, Cloudflare challenges, and robots constraints.</td>
                      <td className="p-4 text-slate-400">Verifies that AI indexers can successfully download your site data without error status codes.</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>

            {/* Hub FAQs */}
            <CrawlerFaqClient faqs={FAQS} />
          </div>
        </div>
      </main>
      
      <Footer />
    </div>
  );
}
