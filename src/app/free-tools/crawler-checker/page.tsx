import { Metadata } from "next";
import { Navbar } from "@/components/landing/Navbar";
import { Footer } from "@/components/landing/Footer";
import { ToolBackground } from "@/components/landing/ToolBackground";
import { CrawlerCheckerClient } from "./CrawlerCheckerClient";
import { CrawlerFaqClient } from "./CrawlerFaqClient";

export const metadata: Metadata = {
  title: "AI Crawler Checker & CDN Blockade Validator | SEO Optimised",
  description: "Test if search engine bots and AI agent crawlers (GPTBot, ClaudeBot, Perplexity) can parse your website, or if CDNs like Cloudflare block them.",
  alternates: {
    canonical: "https://seoptimised.com/free-tools/crawler-checker",
  },
  openGraph: {
    title: "AI Crawler Checker & CDN Blockade Validator | SEO Optimised",
    description: "Test if search engine bots and AI agent crawlers (GPTBot, ClaudeBot, Perplexity) can parse your website, or if CDNs like Cloudflare block them.",
    url: "https://seoptimised.com/free-tools/crawler-checker",
    siteName: "SEO Optimised",
    type: "website",
    images: [
      {
        url: "/crawler-checker-og.webp",
        width: 1200,
        height: 630,
        alt: "AI Crawler Accessibility Checker — Test if firewalls or CDNs are blocking AI agents like PerplexityBot and GPTBot.",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "AI Crawler Checker & CDN Blockade Validator | SEO Optimised",
    description: "Test if search engine bots and AI agent crawlers (GPTBot, ClaudeBot, Perplexity) can parse your website, or if CDNs like Cloudflare block them.",
    images: ["/crawler-checker-og.webp"],
  }
};

const FAQS = [
  {
    q: "Why are AI crawlers like GPTBot and ClaudeBot blocked on my site?",
    a: "Most bot blockades are caused by CDN firewalls (like Cloudflare or AWS WAF) with strict default rules. These security filters treat unrecognized web crawlers as potential malicious scrapers, responding with a 403 Forbidden status code or a JS challenge page.",
  },
  {
    q: "How do I configure Cloudflare WAF to whitelist AI search bots?",
    a: "You can create a custom WAF Firewall Rule in Cloudflare. Configure the rule to bypass blockades when the request User-Agent matches specific crawler strings (e.g., GPTBot, OAI-SearchBot, PerplexityBot), or when the request originates from verified bot networks.",
  },
  {
    q: "Does blocking AI crawlers in robots.txt damage my SEO traffic?",
    a: "Blocking standard training bots (like GPTBot) prevents them from using your data to train models, but blocking search-intent bots (like OAI-SearchBot or PerplexityBot) will prevent your site from showing up as clickable citation links in ChatGPT Search or Perplexity answers."
  },
  {
    q: "What is bot spoofing and how do CDNs prevent it?",
    a: "Bot spoofing occurs when a malicious crawler changes its User-Agent header to pretend to be a legitimate bot (like GPTBot) to bypass blocks. Security firewalls prevent this by performing a reverse DNS lookup (rDNS) on the client's IP to verify if the address belongs to OpenAI, Google, or Anthropic networks."
  },
  {
    q: "How do I whitelist crawlers in AWS CloudFront or AWS WAF?",
    a: "In AWS WAF, navigate to your Web ACL and create a custom rule. Define a rule that inspects the request headers, specifically matching the User-Agent string against AI bot patterns, and select 'Allow' or 'Bypass' to let those requests bypass the standard rate-limiting or reputation-based block lists."
  },
  {
    q: "Should I block ClaudeBot if I want Claude to read my website?",
    a: "If you block ClaudeBot, Claude's training systems won't parse your data, and the Claude developer API will fail to crawl your page if a developer prompts it to read your URL. If you want Claude to provide accurate, real-time citations of your brand details, you should allow ClaudeBot access."
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
      { "@type": "ListItem", "position": 3, "name": "AI Crawler Checker", "item": "https://seoptimised.com/free-tools/crawler-checker" }
    ]
  },
  {
    "@context": "https://schema.org",
    "@type": "SoftwareApplication",
    "name": "AI Crawler Checker",
    "url": "https://seoptimised.com/free-tools/crawler-checker",
    "applicationCategory": "SEOApplication",
    "operatingSystem": "All",
    "offers": {
      "@type": "Offer",
      "price": "0.00",
      "priceCurrency": "USD"
    },
    "description": "Simulate and test crawler client requests representing GPTBot, ClaudeBot, and PerplexityBot to diagnose firewall blocks."
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

export default function CrawlerCheckerPage() {
  return (
    <div
      className="min-h-screen bg-slate-950 text-slate-100 flex flex-col justify-between overflow-x-hidden relative"
      style={{
        backgroundImage: `
          radial-gradient(circle at 10% 10%, rgba(244, 63, 94, 0.08) 0%, transparent 45%),
          radial-gradient(circle at 90% 20%, rgba(59, 130, 246, 0.08) 0%, transparent 45%),
          radial-gradient(circle at 50% 50%, rgba(168, 85, 247, 0.07) 0%, transparent 50%),
          radial-gradient(circle at 10% 90%, rgba(245, 158, 11, 0.06) 0%, transparent 45%),
          radial-gradient(circle at 80% 80%, rgba(244, 63, 94, 0.06) 0%, transparent 50%)
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

      <main className="flex-grow pt-28 pb-20 px-4 sm:px-6 lg:px-8 relative z-10 font-sans">
        <div className="max-w-7xl mx-auto">
          {/* Header */}
          <div className="text-center mb-12">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-rose-500/10 border border-rose-500/25 text-rose-400 text-xs font-bold uppercase tracking-wider mb-4">
              Security & Ingestion Firewall Checker
            </span>
            <h1 className="text-3xl sm:text-4xl font-black text-white mb-3">
              AI Crawler <span className="gradient-text">Checker</span>
            </h1>
            <p className="text-slate-350 max-w-xl mx-auto text-sm leading-relaxed font-medium">
              Diagnose if CDN Firewalls, Cloudflare filters, or robots.txt directives are blocking OpenAI, Perplexity, and Anthropic search crawlers from indexation.
            </p>
          </div>

          {/* Client interactive form */}
          <CrawlerCheckerClient />          {/* Playbook - Integrated Cohesively in the page flow */}
          <div className="border-t border-white/10 pt-16 mt-16">
            <div className="space-y-12 font-sans">
              <div className="border-b border-white/10 pb-6">
                <h2 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight leading-tight">
                  Security Firewalls & AI Search Crawler Access Playbook
                </h2>
                <p className="text-slate-400 text-xs sm:text-sm mt-2 leading-relaxed font-medium text-slate-400">
                  How to prevent CDNs from blocking indexing spiders and whitelist legitimate AI agents without compromising security.
                </p>
              </div>

              <div className="grid md:grid-cols-2 gap-8 items-start">
                <div className="space-y-4">
                  <h3 className="text-lg font-bold text-white border-l-2 border-rose-500 pl-3">
                    The Invisible CDN Bot Barrier
                  </h3>
                  <p className="text-slate-300 text-xs sm:text-sm leading-relaxed">
                    Most content management platforms set default web application firewall (WAF) configurations. While whitelisting traditional crawlers like Googlebot by default, they often treat new agents like <code>GPTBot</code> or <code>PerplexityBot</code> as untrusted scrapers. This block prevents AI search engines from indexing pages, causing citation dropouts.
                  </p>
                  <p className="text-slate-300 text-xs sm:text-sm leading-relaxed">
                    When firewalls reject a bot, they return HTTP 403 Forbidden codes or serve automated JavaScript challenge pages (CAPTCHAs) that headless crawlers cannot solve. As a result, your site content is excluded from search indexes, losing real-time AI citation visibility.
                  </p>
                  <ul className="list-none space-y-2.5 text-xs sm:text-sm text-slate-355 font-medium text-slate-350">
                    <li className="flex items-start gap-2">
                      <span className="w-1.5 h-1.5 rounded-full bg-rose-450 shrink-0 mt-2" />
                      <span><strong>403 Forbidden Blocks:</strong> Firewalls reject raw python-requests or unrecognized user-agents directly.</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="w-1.5 h-1.5 rounded-full bg-rose-450 shrink-0 mt-2" />
                      <span><strong>JavaScript Challenge Blocks:</strong> CDN screens (Cloudflare Turnstile, CAPTCHAs) block headless scraper cycles.</span>
                    </li>
                  </ul>
                </div>

                <div className="space-y-4">
                  <h3 className="text-lg font-bold text-white border-l-2 border-rose-500 pl-3">
                    Whitelisting Best Practices
                  </h3>
                  <p className="text-slate-300 text-xs sm:text-sm leading-relaxed">
                    Rather than turning off firewall protections, webmasters should create selective bypass rules. Whitelisting should target specific User-Agents and verify reverse IP records to prevent spoofing. Allow indexers (OAI-SearchBot, PerplexityBot) while keeping restrictions on bulk data crawlers.
                  </p>
                  <p className="text-slate-300 text-xs sm:text-sm leading-relaxed">
                    Legitimate AI providers publish official IP address ranges. Security teams can configure WAF tables to cross-reference request source IPs with these verified ranges, ensuring that malicious scrapers cannot spoof AI User-Agents to scrape private routes.
                  </p>
                  <ul className="list-none space-y-2.5 text-xs sm:text-sm text-slate-355 font-medium text-slate-350">
                    <li className="flex items-start gap-2">
                      <span className="w-1.5 h-1.5 rounded-full bg-rose-450 shrink-0 mt-2" />
                      <span><strong>Custom WAF Rules:</strong> Deploy User-Agent filter bypass blocks in CDN consoles.</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="w-1.5 h-1.5 rounded-full bg-rose-450 shrink-0 mt-2" />
                      <span><strong>Permissive robots.txt:</strong> Verify that your robots directives explicitly declare <code>Allow: /</code> rules for search bots.</span>
                    </li>
                  </ul>
                </div>
              </div>

              {/* Bot Reference Specs Table */}
              <div className="space-y-4">
                <h3 className="text-lg font-bold text-white border-l-2 border-rose-500 pl-3">
                  AI Search Crawler Directory Specs Table
                </h3>
                <div className="overflow-x-auto border border-white/10 rounded-2xl bg-slate-900/20 backdrop-blur-md">
                  <table className="w-full text-left border-collapse text-xs sm:text-sm text-slate-350">
                    <thead>
                      <tr className="border-b border-white/10 bg-white/5 text-white font-bold">
                        <th className="p-4">Crawler Token</th>
                        <th className="p-4">AI Platform</th>
                        <th className="p-4">Crawl Category</th>
                        <th className="p-4">SEO Recommendation</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-white/5">
                      <tr>
                        <td className="p-4 font-bold text-white">OAI-SearchBot</td>
                        <td className="p-4 font-mono text-rose-400">ChatGPT Search</td>
                        <td className="p-4">Real-time Search Indexer</td>
                        <td className="p-4 text-slate-400"><strong>Always Allow.</strong> Blocking prevents citations and answers on ChatGPT Search queries.</td>
                      </tr>
                      <tr>
                        <td className="p-4 font-bold text-white">PerplexityBot</td>
                        <td className="p-4 font-mono text-rose-400">Perplexity AI</td>
                        <td className="p-4">Real-time Search Indexer</td>
                        <td className="p-4 text-slate-400"><strong>Always Allow.</strong> Main driver of organic RAG search citations.</td>
                      </tr>
                      <tr>
                        <td className="p-4 font-bold text-white">GPTBot</td>
                        <td className="p-4 font-mono text-rose-400">OpenAI LLM Models</td>
                        <td className="p-4">Bulk AI Model Training</td>
                        <td className="p-4 text-slate-400"><strong>Optional.</strong> Block if you want to protect IP, allow if you want model summarization.</td>
                      </tr>
                      <tr>
                        <td className="p-4 font-bold text-white">ClaudeBot</td>
                        <td className="p-4 font-mono text-rose-400">Anthropic Claude</td>
                        <td className="p-4">AI Model Training & Retrieval</td>
                        <td className="p-4 text-slate-400"><strong>Optional.</strong> Control bulk text scraping to protect copyright.</td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>

              {/* Actionable Steps checklist */}
              <div className="space-y-4 border-t border-white/5 pt-8">
                <h3 className="text-lg font-bold text-white border-l-2 border-rose-500 pl-3">
                  Checklist: Diagnosing Firewall Bot Blockades
                </h3>
                <div className="grid sm:grid-cols-3 gap-6">
                  <div className="bg-slate-900/30 border border-white/5 rounded-2xl p-5 space-y-2">
                    <span className="text-[10px] font-bold uppercase tracking-wider text-rose-400">Step 1</span>
                    <h4 className="text-sm font-bold text-white">Identify the Block Status</h4>
                    <p className="text-slate-400 text-xs leading-relaxed">
                      Run the AI Crawler Checker. If any checks report HTTP 403, copy the generated Cloudflare expression rule.
                    </p>
                  </div>
                  <div className="bg-slate-900/30 border border-white/5 rounded-2xl p-5 space-y-2">
                    <span className="text-[10px] font-bold uppercase tracking-wider text-rose-400">Step 2</span>
                    <h4 className="text-sm font-bold text-white">Configure custom WAF rule</h4>
                    <p className="text-slate-400 text-xs leading-relaxed">
                      Create a rule in your CDN/WAF. Paste the expression and set the Action to 'Bypass' or 'Skip' for security challenges.
                    </p>
                  </div>
                  <div className="bg-slate-900/30 border border-white/5 rounded-2xl p-5 space-y-2">
                    <span className="text-[10px] font-bold uppercase tracking-wider text-rose-400">Step 3</span>
                    <h4 className="text-sm font-bold text-white">Validate rDNS Records</h4>
                    <p className="text-slate-400 text-xs leading-relaxed">
                      If security rules are critical, configure IP checks to restrict bypasses strictly to verified provider ranges.
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Interactive FAQs component */}
            <CrawlerFaqClient faqs={FAQS} />
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
