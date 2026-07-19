import { Metadata } from "next";
import { Navbar } from "@/components/landing/Navbar";
import { Footer } from "@/components/landing/Footer";
import { ToolBackground } from "@/components/landing/ToolBackground";

// Client Components
import { AIOverviewSimulatorClient } from "./AIOverviewSimulatorClient";
import { AIOverviewFaqClient } from "./AIOverviewFaqClient";

export const metadata: Metadata = {
  title: "Google AI Overview Simulator & SGE Preview | SEO Optimised",
  description: "Preview and optimize how your pages appear in Google's AI Overviews and SGE carousel. Adjust keywords, snippet cards, and citation scores to boost organic CTR.",
  alternates: {
    canonical: "https://seoptimised.com/free-tools/ai-overview-simulator",
  },
  openGraph: {
    title: "Google AI Overview Simulator & SGE Preview | SEO Optimised",
    description: "Preview and optimize how your pages appear in Google's AI Overviews and SGE carousel. Adjust keywords, snippet cards, and citation scores to boost organic CTR.",
    url: "https://seoptimised.com/free-tools/ai-overview-simulator",
    siteName: "SEO Optimised",
    type: "website",
    images: [
      {
        url: "/ai-overview-og.webp",
        width: 1200,
        height: 630,
        alt: "Google AI Overview Simulator — Preview how your content will look inside Google's search generative SGE layout and citation cards.",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Google AI Overview Simulator & SGE Preview | SEO Optimised",
    description: "Preview and optimize how your pages appear in Google's AI Overviews and SGE carousel. Adjust keywords, snippet cards, and citation scores to boost organic CTR.",
    images: ["/ai-overview-og.webp"],
  }
};

const FAQS = [
  {
    q: "How do Google AI Overviews select sites for carousel citations?",
    a: "Google's AI Overview models (Gemini-based RAG) prioritize sources that feature high information density, direct semantic answer formats, and structured tables or lists. Sites with clean markup and clear definitions are more easily extracted as source citation nodes.",
  },
  {
    q: "What are the exact pixel and text limits for SGE citation cards?",
    a: "SGE citation cards display a site name, a favicon, an image (which crops to roughly 16:9), and a title. The card title is truncated at approximately 40 to 45 characters. Keeping your target keyword front-loaded in the heading ensures it is fully readable in the carousel display.",
  },
  {
    q: "Can I optimize my site specifically for AI search citations (GEO)?",
    a: "Yes. Generative Engine Optimization (GEO) involves removing fluff text, utilizing clear lists/tables, and deploying an llms.txt directory tree. These methods minimize context-window overhead for AI agent crawlers, directly increasing the likelihood of generating citation links.",
  },
  {
    q: "What is Retrieval-Augmented Generation (RAG) in Google search?",
    a: "RAG is a framework that combines information retrieval from a massive database (Google's web index) with generative language models. When a user asks a query, Google retrieves relevant web pages, splits them into semantic text chunks, and sends them to Gemini to synthesize a structured answer with source citations."
  },
  {
    q: "How does Information Gain impact AI Overview rankings?",
    a: "Information Gain is a patent and algorithmic preference where search engines reward content that provides unique, original facts, statistics, or direct case studies that are not present on other pages. AI models prefer to cite sources that contribute unique informational value to the generated summary."
  },
  {
    q: "Will having a low-quality site name or favicon prevent my SGE card citation?",
    a: "Yes. If your site has no structured favicon (apple-touch-icon or standard PNG of size 48x48px or 64x64px), Google will display a generic browser globe icon. Unrecognized site names or missing brand names reduce click-through rates and can lower the citation confidence score of the system."
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
      { "@type": "ListItem", "position": 3, "name": "Google AI Overview Simulator", "item": "https://seoptimised.com/free-tools/ai-overview-simulator" }
    ]
  },
  {
    "@context": "https://schema.org",
    "@type": "SoftwareApplication",
    "name": "Google AI Overview Simulator",
    "url": "https://seoptimised.com/free-tools/ai-overview-simulator",
    "applicationCategory": "SEOApplication",
    "operatingSystem": "All",
    "offers": {
      "@type": "Offer",
      "price": "0.00",
      "priceCurrency": "USD"
    },
    "description": "Preview how your webpage appears in Google SGE and AI Overview citation carousels. Maximize visibility for AI search engine results."
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

export default function AIOverviewSimulatorPage() {
  return (
    <div
      className="min-h-screen bg-slate-950 text-slate-100 flex flex-col justify-between overflow-x-hidden relative"
      style={{
        backgroundImage: `
          radial-gradient(circle at 10% 10%, rgba(16, 185, 129, 0.08) 0%, transparent 45%),
          radial-gradient(circle at 90% 20%, rgba(59, 130, 246, 0.08) 0%, transparent 45%),
          radial-gradient(circle at 50% 50%, rgba(168, 85, 247, 0.07) 0%, transparent 50%),
          radial-gradient(circle at 10% 90%, rgba(249, 115, 22, 0.06) 0%, transparent 45%),
          radial-gradient(circle at 80% 80%, rgba(16, 185, 129, 0.06) 0%, transparent 50%)
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
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/25 text-emerald-400 text-xs font-bold uppercase tracking-wider mb-4">
              AI & SGE Search Optimization
            </span>
            <h1 className="text-3xl sm:text-4xl font-black text-white mb-3">
              Google AI Overview <span className="gradient-text">Simulator</span>
            </h1>
            <p className="text-slate-350 max-w-xl mx-auto text-sm leading-relaxed font-medium">
              Simulate and grade how your site shows up in Google&apos;s AI Overview responses and citation cards to increase click-through rates.
            </p>
          </div>

          {/* Client interactive form */}
          <AIOverviewSimulatorClient />

          {/* Playbook - Integrated Cohesively in the page flow */}
          <div className="border-t border-white/10 pt-16 mt-16">
            <div className="space-y-12 font-sans">
              <div className="border-b border-white/10 pb-6">
                <h2 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight leading-tight">
                  Google AI Overview (SGE) & Carousel Citation Optimization Playbook
                </h2>
                <p className="text-slate-400 text-xs sm:text-sm mt-2 leading-relaxed font-medium">
                  A definitive guide for webmasters to secure SGE source listings, format text for RAG crawlers, and drive organic traffic in the age of AI.
                </p>
              </div>

              <div className="grid md:grid-cols-2 gap-8 items-start">
                <div className="space-y-4">
                  <h3 className="text-lg font-bold text-white border-l-2 border-emerald-500 pl-3">
                    What is SGE and the Google AI Overview?
                  </h3>
                  <p className="text-slate-300 text-xs sm:text-sm leading-relaxed">
                    Google's Search Generative Experience (SGE) presents synthesized AI-generated summaries at the top of search results. These summaries feature inline citations linking directly to high-authority source websites, displayed in a visual carousel container. Because these summaries occupy above-the-fold space, securing citation cards inside the carousel is critical to prevent organic CTR dropouts.
                  </p>
                  <p className="text-slate-300 text-xs sm:text-sm leading-relaxed">
                    The retrieval pipeline scans web content to construct responses. Pages that are well-structured and lack conversational filler are ingested with higher priority. In addition, Google matches citation cards to pages that provide clear semantic connections to the summarized facts.
                  </p>
                  <ul className="list-none space-y-2.5 text-xs sm:text-sm text-slate-350 font-medium">
                    <li className="flex items-start gap-2">
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 shrink-0 mt-2" />
                      <span><strong>High-Visibility Real Estate:</strong> Placement in AI Overviews captures traffic before traditional search links.</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 shrink-0 mt-2" />
                      <span><strong>Visual Carousel Cards:</strong> Features site favicon, logo, cropped image, and brand title.</span>
                    </li>
                  </ul>
                </div>

                <div className="space-y-4">
                  <h3 className="text-lg font-bold text-white border-l-2 border-emerald-500 pl-3">
                    How to Get Cited by Google's AI Overview
                  </h3>
                  <p className="text-slate-300 text-xs sm:text-sm leading-relaxed">
                    Google's AI search retrieval systems (RAG) look for semantic nodes that perfectly answer the user's intent. To align with this, webmasters must rewrite copywriting templates to be objective, factual, and direct. Avoid sales jargon or marketing declarations. Instead, front-load definition terms immediately following your header blocks.
                  </p>
                  <p className="text-slate-350 text-xs sm:text-sm leading-relaxed">
                    Additionally, deploy structured data (JSON-LD schemas) to provide search engines with unambiguous context. Injecting Product schemas, TechArticles, and Breadcrumb lists enables Google's parser to map and attribute citations correctly.
                  </p>
                  <ul className="list-none space-y-2.5 text-xs sm:text-sm text-slate-350 font-medium">
                    <li className="flex items-start gap-2">
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 shrink-0 mt-2" />
                      <span><strong>Short Definitions:</strong> Open your headers with an immediate, clear definition (e.g. &ldquo;X is a...&rdquo;).</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 shrink-0 mt-2" />
                      <span><strong>Front-Loaded Titles:</strong> Put target keywords at the front of SGE titles to prevent critical parts from truncating.</span>
                    </li>
                  </ul>
                </div>
              </div>

              {/* SGE Specs Table */}
              <div className="space-y-4">
                <h3 className="text-lg font-bold text-white border-l-2 border-emerald-500 pl-3">
                  Google AI Overview Carousel Card Specifications
                </h3>
                <div className="overflow-x-auto border border-white/10 rounded-2xl bg-slate-900/20 backdrop-blur-md">
                  <table className="w-full text-left border-collapse text-xs sm:text-sm text-slate-350">
                    <thead>
                      <tr className="border-b border-white/10 bg-white/5 text-white font-bold">
                        <th className="p-4">Card Element</th>
                        <th className="p-4">Limit / Recommended Dimension</th>
                        <th className="p-4">SEO Rationale</th>
                        <th className="p-4">Best Practice</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-white/5">
                      <tr>
                        <td className="p-4 font-bold text-white">Card Title</td>
                        <td className="p-4 font-mono text-emerald-400">40 — 45 chars</td>
                        <td className="p-4">Titles longer than 45 characters get cut off with ellipses (...) inside Google's card frame.</td>
                        <td className="p-4 text-slate-400">Keep titles concise and place high-intent keywords at the very beginning.</td>
                      </tr>
                      <tr>
                        <td className="p-4 font-bold text-white">Card Thumbnail Image</td>
                        <td className="p-4 font-mono text-emerald-400">1.91:1 / 16:9 ratio</td>
                        <td className="p-4">SGE crop matrices pull page assets and fit them inside small square/horizontal slots.</td>
                        <td className="p-4 text-slate-400">Set high-quality OG images and declare clean fallback page image assets.</td>
                      </tr>
                      <tr>
                        <td className="p-4 font-bold text-white">Site Name & Icon</td>
                        <td className="p-4 font-mono text-emerald-400">Favicon (64x64px)</td>
                        <td className="p-4">Provides immediate trust and brand recognition. Missing favicons look generic.</td>
                        <td className="p-4 text-slate-400">Configure correct apple-touch-icon and base favicon metadata properties.</td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>

              {/* Actionable Steps section */}
              <div className="space-y-4 border-t border-white/5 pt-8">
                <h3 className="text-lg font-bold text-white border-l-2 border-emerald-500 pl-3">
                  Step-by-Step AI Overview Optimization Guide
                </h3>
                <div className="grid sm:grid-cols-3 gap-6">
                  <div className="bg-slate-900/30 border border-white/5 rounded-2xl p-5 space-y-2">
                    <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-400">Step 1</span>
                    <h4 className="text-sm font-bold text-white">Structure Content Chunks</h4>
                    <p className="text-slate-400 text-xs leading-relaxed">
                      Use headings (H2, H3) to partition topics. Keep paragraph chunks under 300 characters to make them easy for RAG retrievers to map.
                    </p>
                  </div>
                  <div className="bg-slate-900/30 border border-white/5 rounded-2xl p-5 space-y-2">
                    <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-400">Step 2</span>
                    <h4 className="text-sm font-bold text-white">Incorporate Specific Data</h4>
                    <p className="text-slate-400 text-xs leading-relaxed">
                      Incorporate concrete statistics, percentages, and metrics. Ground claims in actual case studies to boost factual density.
                    </p>
                  </div>
                  <div className="bg-slate-900/30 border border-white/5 rounded-2xl p-5 space-y-2">
                    <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-400">Step 3</span>
                    <h4 className="text-sm font-bold text-white">Deploy Schema Markup</h4>
                    <p className="text-slate-400 text-xs leading-relaxed">
                      Deploy SoftwareApplication, FAQPage, or TechArticle JSON-LD schemas to give crawler bots machine-readable attribution links.
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Interactive FAQs component */}
            <AIOverviewFaqClient faqs={FAQS} />
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
