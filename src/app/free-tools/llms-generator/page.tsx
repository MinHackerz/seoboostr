import { Metadata } from "next";
import { Navbar } from "@/components/landing/Navbar";
import { Footer } from "@/components/landing/Footer";
import { ToolBackground } from "@/components/landing/ToolBackground";
import { LLMsGeneratorClient } from "./LLMsGeneratorClient";
import { LLMsFaqClient } from "./LLMsFaqClient";

export const metadata: Metadata = {
  title: "Sitemap-Driven LLMs.txt Generator Tool | SEO Optimised",
  description: "Automatically parse your sitemap XML and generate a structured llms.txt markdown index to improve brand citations in Perplexity, Claude, and ChatGPT Search.",
  alternates: {
    canonical: "https://seoptimised.com/free-tools/llms-generator",
  },
  openGraph: {
    title: "Sitemap-Driven LLMs.txt Generator Tool | SEO Optimised",
    description: "Automatically parse your sitemap XML and generate a structured llms.txt markdown index to improve brand citations in Perplexity, Claude, and ChatGPT Search.",
    url: "https://seoptimised.com/free-tools/llms-generator",
    siteName: "SEO Optimised",
    type: "website",
    images: [
      {
        url: "/llms-og.webp",
        width: 1200,
        height: 630,
        alt: "Sitemap-Driven LLMs.txt Generator — Automatically parse sitemaps and generate structural markdown indexes to optimize AI model citations.",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Sitemap-Driven LLMs.txt Generator Tool | SEO Optimised",
    description: "Automatically parse your sitemap XML and generate a structured llms.txt markdown index to improve brand citations in Perplexity, Claude, and ChatGPT Search.",
    images: ["/llms-og.webp"],
  }
};

const FAQS = [
  {
    q: "What specific AI user-agents read the llms.txt file?",
    a: "The llms.txt file is designed for modern generative search crawlers and developer agents. This includes OpenAI's GPTBot and OAI-SearchBot, Anthropic's ClaudeBot, PerplexityBot, and Google's Google-Extended. These agents check the root llms.txt to ingest raw text data before crawling complex Javascript layouts.",
  },
  {
    q: "How do Perplexity and OpenAI Search prioritize content citations?",
    a: "AI models prioritize search citations based on text density, clarity, and structural link trees. By declaring clean, markdown-indexed urls in your llms.txt, AI search indexers can parse semantic contents with minimal context window overhead, directly increasing the likelihood of generating rich citations.",
  },
  {
    q: "What is the recommended size and structure of llms-full.txt?",
    a: "While llms.txt is a concise summary of your core resources, llms-full.txt serves as a comprehensive index for deep technical docs. It can list full API specifications, JSON schema mappings, and extensive code guides. It is structured identically in Markdown, but spans thousands of tokens, serving as a raw dataset.",
  },
  {
    q: "What is an llms.txt file and where should it be hosted?",
    a: "An llms.txt file is a proposed standard Markdown file hosted at the root of a domain (e.g. yourdomain.com/llms.txt). It provides clean, concise, machine-readable information about your website's content, structure, and API endpoints, helping AI agents, Large Language Models (LLMs), and crawler scrapers ingest your site's data accurately.",
  },
  {
    q: "Can you block specific AI models in your robots.txt or llms.txt?",
    a: "Yes. While robots.txt is the standard path to prevent bots from scraping (e.g., User-agent: GPTBot / Disallow: /), hosting an llms.txt file allows you to define specific content context rules and instructions for models that you *do* want crawling, ensuring they summarize your brand accurately without hallucinations."
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
      { "@type": "ListItem", "position": 3, "name": "LLMs.txt Generator", "item": "https://seoptimised.com/free-tools/llms-generator" }
    ]
  },
  {
    "@context": "https://schema.org",
    "@type": "SoftwareApplication",
    "name": "LLMs.txt Generator",
    "url": "https://seoptimised.com/free-tools/llms-generator",
    "applicationCategory": "SEOApplication",
    "operatingSystem": "All",
    "offers": {
      "@type": "Offer",
      "price": "0.00",
      "priceCurrency": "USD"
    },
    "description": "Create machine-parsable llms.txt files. Structure your site details, resources, and contact data to optimize AI crawler crawl visibility."
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

export default function LLMsTxtGeneratorPage() {
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
      
      <main className="flex-grow pt-28 pb-20 px-4 sm:px-6 lg:px-8 relative z-10 font-sans">
        <div className="max-w-7xl mx-auto">
          {/* Header */}
          <div className="text-center mb-12">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-teal-500/10 border border-teal-500/25 text-teal-400 text-xs font-bold uppercase tracking-wider mb-4">
              AI & Search visibility
            </span>
            <h1 className="text-3xl sm:text-4xl font-black text-white mb-3">
              LLMs.txt <span className="gradient-text">Generator</span>
            </h1>
            <p className="text-slate-350 max-w-xl mx-auto text-sm leading-relaxed font-medium">
              Create an optimized markdown index mapping your sitemap to help Perplexity, ChatGPT Search, and web agents summarize your website accurately.
            </p>
          </div>

          {/* Client interactive form */}
          <LLMsGeneratorClient />

          {/* Deep Researched Developer Playbook - Integrated Cohesively in the main page flow */}
          <div className="border-t border-white/10 pt-16 mt-16">
            <div className="space-y-12 font-sans">
              <div className="border-b border-white/10 pb-6">
                <h2 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight leading-tight">
                  LLMs.txt Integration & Generative Engine Optimization (GEO) Manual
                </h2>
                <p className="text-slate-450 text-xs sm:text-sm mt-2 leading-relaxed font-medium">
                  An actionable reference handbook explaining how to use llms.txt files to double your brand visibility in Perplexity and ChatGPT citations.
                </p>
              </div>

              {/* Core Concepts Section */}
              <div className="grid md:grid-cols-2 gap-8 items-start">
                <div className="space-y-4">
                  <h3 className="text-lg font-bold text-white border-l-2 border-teal-500 pl-3">
                    What is `/llms.txt`?
                  </h3>
                  <p className="text-slate-300 text-xs sm:text-sm leading-relaxed">
                    The <code>llms.txt</code> file is a newly proposed web standard for AI indexing. It is a plain Markdown file hosted at the root of a domain (e.g. <code>yourdomain.com/llms.txt</code>) that describes your brand and lists clean content links for Large Language Models (LLMs) to read.
                  </p>
                  <ul className="list-none space-y-2.5 text-xs sm:text-sm text-slate-350">
                    <li className="flex items-start gap-2">
                      <span className="w-1.5 h-1.5 rounded-full bg-teal-400 shrink-0 mt-2" />
                      <span><strong>Markdown Format:</strong> Avoids heavy visual scripts and HTML code tags so bots can parse text with minimal latency.</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="w-1.5 h-1.5 rounded-full bg-teal-400 shrink-0 mt-2" />
                      <span><strong>Site Ingestion Tree:</strong> Lists core links (Docs, Features, Pricing) to help models understand your site structure.</span>
                    </li>
                  </ul>
                </div>

                <div className="space-y-4">
                  <h3 className="text-lg font-bold text-white border-l-2 border-teal-500 pl-3">
                    Why Generative Engine Optimization (GEO)?
                  </h3>
                  <p className="text-slate-300 text-xs sm:text-sm leading-relaxed">
                    Standard search engines rank sites based on keywords and page link authorities. Generative engines (like Perplexity or ChatGPT Search) synthesize information dynamically. GEO is the practice of structuring text to ensure AI agents select and cite your links when answering queries.
                  </p>
                  <ul className="list-none space-y-2.5 text-xs sm:text-sm text-slate-350">
                    <li className="flex items-start gap-2">
                      <span className="w-1.5 h-1.5 rounded-full bg-teal-400 shrink-0 mt-2" />
                      <span><strong>Information Density:</strong> AI models prioritize fact-rich sentences. Eliminate marketing fluff in your index file.</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="w-1.5 h-1.5 rounded-full bg-teal-400 shrink-0 mt-2" />
                      <span><strong>Context Window Optimization:</strong> Keeping files clean prevents context window overflow during LLM scrapes.</span>
                    </li>
                  </ul>
                </div>
              </div>

              {/* Structuring llms.txt */}
              <div className="space-y-4">
                <h3 className="text-lg font-bold text-white border-l-2 border-teal-500 pl-3">
                  How to Structure your `llms.txt` and `llms-full.txt`
                </h3>
                <p className="text-slate-300 text-xs sm:text-sm leading-relaxed">
                  The standard specification supports two distinct files to manage model crawler limits. The primary file is <code>llms.txt</code>, which provides a high-level summary of your brand. If you feature deep technical API docs, you can link to a secondary file named <code>llms-full.txt</code> containing full code examples.
                </p>
                <div className="p-5 rounded-2xl bg-slate-900/50 border border-white/5 space-y-3">
                  <h4 className="text-xs font-bold text-white uppercase tracking-wider">File Specifications</h4>
                  <ul className="list-none space-y-2 text-xs sm:text-sm text-slate-300">
                    <li className="flex items-center gap-2.5">
                      <svg className="w-4 h-4 text-teal-400 shrink-0" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24"><polyline points="20 6 9 17 4 12"/></svg>
                      <span><strong>llms.txt (Summary):</strong> Kept brief (under 1,500 words). Includes a description block and primary sitemap URL listings.</span>
                    </li>
                    <li className="flex items-center gap-2.5">
                      <svg className="w-4 h-4 text-teal-400 shrink-0" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24"><polyline points="20 6 9 17 4 12"/></svg>
                      <span><strong>llms-full.txt (Details):</strong> Complete specifications, JSON-LD schemas, and extensive developer API code tutorials.</span>
                    </li>
                  </ul>
                </div>
              </div>

              {/* Actionable GEO checklist */}
              <div className="space-y-4">
                <h3 className="text-lg font-bold text-white border-l-2 border-teal-500 pl-3">
                  Step-by-Step GEO Visibility Checklist
                </h3>
                <div className="grid sm:grid-cols-3 gap-6">
                  <div className="bg-slate-900/30 border border-white/5 rounded-2xl p-5 space-y-2">
                    <span className="text-[10px] font-bold uppercase tracking-wider text-teal-400">Step 1</span>
                    <h4 className="text-sm font-bold text-white">Extract Sitemap URLs</h4>
                    <p className="text-slate-400 text-xs leading-relaxed">
                      Use our sitemap import form to discover all your public links. Choose the core pages containing pricing, API specs, and features.
                    </p>
                  </div>
                  <div className="bg-slate-900/30 border border-white/5 rounded-2xl p-5 space-y-2">
                    <span className="text-[10px] font-bold uppercase tracking-wider text-teal-400">Step 2</span>
                    <h4 className="text-sm font-bold text-white">Write a Clear Tagline</h4>
                    <p className="text-slate-400 text-xs leading-relaxed">
                      Author a concise tagline and description explaining exactly what your website does. This shapes the LLM&apos;s initial brand context.
                    </p>
                  </div>
                  <div className="bg-slate-900/30 border border-white/5 rounded-2xl p-5 space-y-2">
                    <span className="text-[10px] font-bold uppercase tracking-wider text-teal-400">Step 3</span>
                    <h4 className="text-sm font-bold text-white">Publish at the Root</h4>
                    <p className="text-slate-400 text-xs leading-relaxed">
                      Deploy your generated code as a plain text file at the root folder so AI indexers can read <code>domain.com/llms.txt</code>.
                    </p>
                  </div>
                </div>
              </div>

              {/* AI Models Cheat Sheet Table */}
              <div className="space-y-4">
                <h3 className="text-lg font-bold text-white border-l-2 border-teal-500 pl-3">
                  AI Model Ingestion Specs Table
                </h3>
                <div className="overflow-x-auto border border-white/10 rounded-2xl bg-slate-900/20 backdrop-blur-md">
                  <table className="w-full text-left border-collapse text-xs sm:text-sm text-slate-350">
                    <thead>
                      <tr className="border-b border-white/10 bg-white/5 text-white font-bold">
                        <th className="p-4">AI Platform</th>
                        <th className="p-4">Primary Crawler</th>
                        <th className="p-4">Ingestion Mechanism</th>
                        <th className="p-4">Citation Selection Criteria</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-white/5">
                      <tr>
                        <td className="p-4 font-bold text-white">ChatGPT Search</td>
                        <td className="p-4 font-mono text-teal-400">OAI-SearchBot</td>
                        <td className="p-4">Scrapes root llms.txt file direct links</td>
                        <td className="p-4 text-slate-400">Prioritizes dense, structured page headers matching query intents.</td>
                      </tr>
                      <tr>
                        <td className="p-4 font-bold text-white">Perplexity AI</td>
                        <td className="p-4 font-mono text-teal-400">PerplexityBot</td>
                        <td className="p-4">Crawls markdown trees recursively</td>
                        <td className="p-4 text-slate-400">Matches search index maps with direct anchor text references.</td>
                      </tr>
                      <tr>
                        <td className="p-4 font-bold text-white">Google Gemini</td>
                        <td className="p-4 font-mono text-teal-400">Googlebot</td>
                        <td className="p-4">Parses public HTML sitemaps</td>
                        <td className="p-4 text-slate-400">Ingests high-authority domain structures to construct AI Overviews.</td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>
            </div>

            {/* Interactive FAQs component */}
            <LLMsFaqClient faqs={FAQS} />
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
