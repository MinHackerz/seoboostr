import { Metadata } from "next";
import { Navbar } from "@/components/landing/Navbar";
import { Footer } from "@/components/landing/Footer";
import { ToolBackground } from "@/components/landing/ToolBackground";
import { RobotsGeneratorClient } from "./RobotsGeneratorClient";
import { RobotsFaqClient } from "./RobotsFaqClient";

export const metadata: Metadata = {
  title: "AI-Optimized Robots.txt Generator | SEO Optimised",
  description: "Generate robots.txt crawl rules and sitemaps optimized for Googlebot and generative AI crawlers (ChatGPT, Gemini, Claude, Perplexity) to maximize GEO visibility.",
  alternates: {
    canonical: "https://seoptimised.com/free-tools/robots-generator",
  },
  openGraph: {
    title: "AI-Optimized Robots.txt Generator | SEO Optimised",
    description: "Generate robots.txt crawl rules and sitemaps optimized for Googlebot and generative AI crawlers (ChatGPT, Gemini, Claude, Perplexity) to maximize GEO visibility.",
    url: "https://seoptimised.com/free-tools/robots-generator",
    siteName: "SEO Optimised",
    type: "website",
    images: [
      {
        url: "/robots-og.webp",
        width: 1200,
        height: 630,
        alt: "AI-Optimized Robots.txt Generator — Generate robots.txt crawl rules and sitemaps optimized for Googlebot and generative AI crawlers.",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "AI-Optimized Robots.txt Generator | SEO Optimised",
    description: "Generate robots.txt crawl rules and sitemaps optimized for Googlebot and generative AI crawlers (ChatGPT, Gemini, Claude, Perplexity) to maximize GEO visibility.",
    images: ["/robots-og.webp"],
  }
};

const FAQS = [
  {
    q: "Why should I configure specific directives for AI/LLM crawlers?",
    a: "Configuring separate rules for LLM crawlers like GPTBot, ClaudeBot, and PerplexityBot determines whether AI platforms are allowed to read your site context. Allowing access builds index maps that help LLM search engines reference and cite your pages directly in dynamic answers.",
  },
  {
    q: "What is Google-Extended and how does it relate to SEO?",
    a: "Google-Extended is a user-agent token that allows webmasters to control whether their website content is parsed to train Google's Gemini models and AI products. Setting Google-Extended to Allow ensures Google's generative models have complete access to cite your brand details.",
  },
  {
    q: "What happens if I block GPTBot in my robots.txt?",
    a: "If you block GPTBot, OpenAI's training and dynamic search agents will not crawl your page. Your site will not be used in future ChatGPT training runs, and the AI agent may fail to cite your site when answering relevant user queries.",
  },
  {
    q: "How does search crawl budget change for large websites?",
    a: "For domains with millions of pages (like dynamically routed sites), search spiders have strict bandwidth budgets. If Googlebot spends time requesting unindexed parameter paths (filters, sorting), it won't index your new content routes. Blocking unneeded URLs in robots.txt optimizes your crawl budget.",
  },
  {
    q: "What is the difference between blocking in robots.txt and adding a noindex tag?",
    a: "Disallow rules in robots.txt only instruct bots not to crawl or request that page. However, if external domains link to it, Google can still index the URL. To fully block indexation, you must allow crawling so Googlebot sees a noindex tag in the DOM page metadata.",
  }
];

// JSON-LD dynamic schemas
const jsonLd = [
  {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    "itemListElement": [
      { "@type": "ListItem", "position": 1, "name": "Home", "item": "https://seoptimised.com" },
      { "@type": "ListItem", "position": 2, "name": "Free Tools", "item": "https://seoptimised.com/free-tools" },
      { "@type": "ListItem", "position": 3, "name": "Robots.txt Generator", "item": "https://seoptimised.com/free-tools/robots-generator" }
    ]
  },
  {
    "@context": "https://schema.org",
    "@type": "SoftwareApplication",
    "name": "Robots.txt Generator",
    "url": "https://seoptimised.com/free-tools/robots-generator",
    "applicationCategory": "SEOApplication",
    "operatingSystem": "All",
    "offers": {
      "@type": "Offer",
      "price": "0.00",
      "priceCurrency": "USD"
    },
    "description": "Generate search-engine and social-media optimized meta tags instantly. Preview Google snippets, set robots directives, Open Graph, and Twitter Cards."
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

export default function RobotsGeneratorPage() {
  return (
    <div 
      className="min-h-screen bg-slate-950 text-slate-100 flex flex-col justify-between overflow-x-hidden relative"
      style={{
        backgroundImage: `
          radial-gradient(circle at 10% 10%, rgba(59, 130, 246, 0.08) 0%, transparent 45%),
          radial-gradient(circle at 90% 20%, rgba(249, 115, 22, 0.08) 0%, transparent 45%),
          radial-gradient(circle at 50% 50%, rgba(168, 85, 247, 0.07) 0%, transparent 50%),
          radial-gradient(circle at 10% 90%, rgba(34, 197, 94, 0.06) 0%, transparent 45%),
          radial-gradient(circle at 80% 80%, rgba(59, 130, 246, 0.06) 0%, transparent 50%)
        `
      }}
    >
      {/* Schemas */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      
      {/* Dynamic gradients overlay */}
      <ToolBackground />

      <Navbar />
      
      <main className="flex-grow pt-28 pb-20 px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="max-w-7xl mx-auto">
          {/* Header */}
          <div className="text-center mb-12">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-indigo-500/10 border border-indigo-500/25 text-indigo-400 text-xs font-bold uppercase tracking-wider mb-4">
              GEO & AI Visibility
            </span>
            <h1 className="text-3xl sm:text-4xl font-black text-white mb-3">
              AI & Search <span className="gradient-text">Robots.txt Generator</span>
            </h1>
            <p className="text-slate-350 max-w-xl mx-auto text-sm leading-relaxed font-medium">
              Configure search crawler directives optimized for organic indexers and generative AI scrapers (ChatGPT, Gemini, Claude, Perplexity) to maximize GEO visibility.
            </p>
          </div>

          {/* Client interactive form */}
          <RobotsGeneratorClient />

          {/* Deep Researched Developer Playbook - Integrated Cohesively in the main page flow */}
          <div className="border-t border-white/10 pt-16 mt-16">
            <div className="space-y-12 font-sans">
              <div className="border-b border-white/10 pb-6">
                <h2 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight leading-tight">
                  Robots.txt Optimization Guide: Maximize Crawl Budgets & AI Visibility
                </h2>
                <p className="text-slate-455 text-xs sm:text-sm mt-2 leading-relaxed font-medium">
                  An actionable guide explaining how search engine bots crawl your website and how to configure robots.txt to drive SEO ranking value.
                </p>
              </div>

              {/* Core Concepts Section */}
              <div className="grid md:grid-cols-2 gap-8 items-start">
                <div className="space-y-4">
                  <h3 className="text-lg font-bold text-white border-l-2 border-teal-500 pl-3">
                    What is a Robots.txt File?
                  </h3>
                  <p className="text-slate-300 text-xs sm:text-sm leading-relaxed">
                    Robots.txt is a plain text file saved in the root directory of your website. Its job is to provide instructions to search engine bots (like Googlebot) and AI web crawlers (like GPTBot) regarding which pages and folders they are allowed to request.
                  </p>
                  <ul className="list-none space-y-2.5 text-xs sm:text-sm text-slate-350">
                    <li className="flex items-start gap-2">
                      <span className="w-1.5 h-1.5 rounded-full bg-teal-400 shrink-0 mt-2" />
                      <span><strong>Disallow Directive:</strong> Restricts crawlers from requesting specific paths (e.g. checkout forms or private dashboards).</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="w-1.5 h-1.5 rounded-full bg-teal-400 shrink-0 mt-2" />
                      <span><strong>Sitemap Declaration:</strong> Points bots to your sitemap XML link for fast discovery and indexation of new pages.</span>
                    </li>
                  </ul>
                </div>

                <div className="space-y-4">
                  <h3 className="text-lg font-bold text-white border-l-2 border-teal-500 pl-3">
                    Why Crawl Budget Matters
                  </h3>
                  <p className="text-slate-300 text-xs sm:text-sm leading-relaxed">
                    Search engine spiders have a limited bandwidth allowance for crawling each domain, known as a <strong>crawl budget</strong>. If you let bots crawl hundreds of dynamic parameter URLs (like product searches, filter pages, or sorting variations), they may exhaust their budget before indexing your core content pages.
                  </p>
                  <ul className="list-none space-y-2.5 text-xs sm:text-sm text-slate-350">
                    <li className="flex items-start gap-2">
                      <span className="w-1.5 h-1.5 rounded-full bg-teal-400 shrink-0 mt-2" />
                      <span><strong>Block URL Parameters:</strong> Block filters in robots.txt (e.g., <code>Disallow: /*?sort=</code>) to optimize crawl frequency.</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="w-1.5 h-1.5 rounded-full bg-teal-400 shrink-0 mt-2" />
                      <span><strong>Optimize Server Bandwidth:</strong> Keeping crawlers out of staging routes prevents server slow-downs.</span>
                    </li>
                  </ul>
                </div>
              </div>

              {/* AI visibility Section */}
              <div className="space-y-4">
                <h3 className="text-lg font-bold text-white border-l-2 border-teal-500 pl-3">
                  Configuring Robots.txt for AI Search &amp; GEO Visibility
                </h3>
                <p className="text-slate-300 text-xs sm:text-sm leading-relaxed">
                  The emergence of AI search engines (like ChatGPT Search and Perplexity) has introduced new bots to the web ecosystem. Allowing these bots to crawl your marketing and documentation pages determines whether your brand is referenced and cited directly inside dynamic AI answers.
                </p>
                <div className="p-5 rounded-2xl bg-slate-900/50 border border-white/5 space-y-3">
                  <h4 className="text-xs font-bold text-white uppercase tracking-wider">AI Crawler Guidelines</h4>
                  <ul className="list-none space-y-2 text-xs sm:text-sm text-slate-300">
                    <li className="flex items-center gap-2.5">
                      <svg className="w-4 h-4 text-teal-400 shrink-0" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24"><polyline points="20 6 9 17 4 12"/></svg>
                      <span><strong>Allow GPTBot &amp; PerplexityBot:</strong> Ensure these are not blocked in your robots.txt file to be cited in ChatGPT/Perplexity search results.</span>
                    </li>
                    <li className="flex items-center gap-2.5">
                      <svg className="w-4 h-4 text-teal-400 shrink-0" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24"><polyline points="20 6 9 17 4 12"/></svg>
                      <span><strong>Configure Google-Extended:</strong> Decide whether your pages should be used to train Google Gemini models.</span>
                    </li>
                  </ul>
                </div>
              </div>

              {/* Actionable robots.txt checklist */}
              <div className="space-y-4">
                <h3 className="text-lg font-bold text-white border-l-2 border-teal-500 pl-3">
                  Checklist: Auditing your Robots.txt File
                </h3>
                <div className="grid sm:grid-cols-3 gap-6">
                  <div className="bg-slate-900/30 border border-white/5 rounded-2xl p-5 space-y-2">
                    <span className="text-[10px] font-bold uppercase tracking-wider text-teal-400">Step 1</span>
                    <h4 className="text-sm font-bold text-white">Check for Site-wide Blocks</h4>
                    <p className="text-slate-400 text-xs leading-relaxed">
                      Ensure you do not accidentally block search engines entirely with a directive like <code>Disallow: /</code> on your live server.
                    </p>
                  </div>
                  <div className="bg-slate-900/30 border border-white/5 rounded-2xl p-5 space-y-2">
                    <span className="text-[10px] font-bold uppercase tracking-wider text-teal-400">Step 2</span>
                    <h4 className="text-sm font-bold text-white">Protect Staging Sites</h4>
                    <p className="text-slate-400 text-xs leading-relaxed">
                      Do not rely on robots.txt to hide sensitive folders. Block indexing of private routes using server password shields.
                    </p>
                  </div>
                  <div className="bg-slate-900/30 border border-white/5 rounded-2xl p-5 space-y-2">
                    <span className="text-[10px] font-bold uppercase tracking-wider text-teal-400">Step 3</span>
                    <h4 className="text-sm font-bold text-white">Reference the Sitemap</h4>
                    <p className="text-slate-400 text-xs leading-relaxed">
                      Always include a <code>Sitemap: https://yourdomain.com/sitemap.xml</code> line at the bottom of the file to guide search bots.
                    </p>
                  </div>
                </div>
              </div>

              {/* Optimal Limits Cheat Sheet Table */}
              <div className="space-y-4">
                <h3 className="text-lg font-bold text-white border-l-2 border-teal-500 pl-3">
                  AI &amp; Search Bots Quick Reference Table
                </h3>
                <div className="overflow-x-auto border border-white/10 rounded-2xl bg-slate-900/20 backdrop-blur-md">
                  <table className="w-full text-left border-collapse text-xs sm:text-sm text-slate-350">
                    <thead>
                      <tr className="border-b border-white/10 bg-white/5 text-white font-bold">
                        <th className="p-4">User-Agent Token</th>
                        <th className="p-4">Crawler Purpose</th>
                        <th className="p-4">Primary Content Ingested</th>
                        <th className="p-4">GEO Visibility Status</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-white/5">
                      <tr>
                        <td className="p-4 font-mono text-teal-400">Googlebot</td>
                        <td className="p-4 text-white">Google search engine crawler</td>
                        <td className="p-4">All public HTML &amp; media pages</td>
                        <td className="p-4">Critical. Required for search engine indexing.</td>
                      </tr>
                      <tr>
                        <td className="p-4 font-mono text-teal-400">OAI-SearchBot</td>
                        <td className="p-4 text-white">ChatGPT Search indexer</td>
                        <td className="p-4">Dynamic text summaries &amp; links</td>
                        <td className="p-4">Highly Recommended. Required for ChatGPT citations.</td>
                      </tr>
                      <tr>
                        <td className="p-4 font-mono text-teal-400">PerplexityBot</td>
                        <td className="p-4 text-white">Perplexity dynamic search agent</td>
                        <td className="p-4">Real-time answer resources</td>
                        <td className="p-4">Recommended. Determines citation inclusion.</td>
                      </tr>
                      <tr>
                        <td className="p-4 font-mono text-teal-400">ClaudeBot</td>
                        <td className="p-4 text-white">Anthropic AI model agent</td>
                        <td className="p-4">Technical documentation &amp; guides</td>
                        <td className="p-4">Recommended. Aids context training.</td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>
            </div>

            {/* Interactive FAQs accordion */}
            <RobotsFaqClient faqs={FAQS} />
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
