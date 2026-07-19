import { Metadata } from "next";
import { Navbar } from "@/components/landing/Navbar";
import { Footer } from "@/components/landing/Footer";
import { ToolBackground } from "@/components/landing/ToolBackground";
import { GeoGraderClient } from "./GeoGraderClient";
import { GeoFaqClient } from "./GeoFaqClient";

export const metadata: Metadata = {
  title: "GEO Citability & Fact-Density Grader | SEO Optimised",
  description: "Audit your content for AI search engines. Grade factual density, RAG readability, and direct answers to optimize visibility in ChatGPT and Perplexity.",
  alternates: {
    canonical: "https://seoptimised.com/free-tools/geo-grader",
  },
  openGraph: {
    title: "GEO Citability & Fact-Density Grader | SEO Optimised",
    description: "Audit your content for AI search engines. Grade factual density, RAG readability, and direct answers to optimize visibility in ChatGPT and Perplexity.",
    url: "https://seoptimised.com/free-tools/geo-grader",
    siteName: "SEO Optimised",
    type: "website",
    images: [
      {
        url: "/geo-grader-og.webp",
        width: 1200,
        height: 630,
        alt: "GEO Citability & Fact-Density Grader — Audit and optimize content factual density and RAG readability for AI search engine citations.",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "GEO Citability & Fact-Density Grader | SEO Optimised",
    description: "Audit your content for AI search engines. Grade factual density, RAG readability, and direct answers to optimize visibility in ChatGPT and Perplexity.",
    images: ["/geo-grader-og.webp"],
  }
};

const FAQS = [
  {
    q: "What is Generative Engine Optimization (GEO)?",
    a: "GEO is the process of optimizing content to be easily retrieved and cited by AI-powered search engines (like Perplexity, ChatGPT Search, and Google AI Overviews). It shifts focus from keyword ranking to content citability and informational trust.",
  },
  {
    q: "How does factual density impact AI search visibility?",
    a: "LLMs and Retrieval-Augmented Generation (RAG) models are programmed to extract verified facts and concrete figures (percentages, statistics, names). Content with high factual density is cited significantly more often than conversational filler or marketing-focused copy.",
  },
  {
    q: "What formatting style works best for RAG engines?",
    a: "AI crawlers prefer clean, structured content. Using bulleted lists, comparative data tables, bold keyword definitions, and short paragraphs helps headless scrapers ingest and reference your content with minimal token usage."
  },
  {
    q: "What is the 'Information Gain' patent in AI search ranking?",
    a: "Information Gain refers to the unique, non-duplicate informational value a web page brings compared to other search candidate pages. AI search generators prefer to reference pages that introduce specific metrics, direct case study results, or first-hand experience rather than repeating generic copy."
  },
  {
    q: "Does writing in the first person limit my GEO citation rate?",
    a: "Often, yes. RAG retrieval algorithms are built on semantic similarity to encyclopedia-style answers. Heavy use of first-person pronouns ('I', 'we', 'our') and self-referential marketing copy increases token distance from the direct question. Standardize informational areas using objective, third-person declarative styles."
  },
  {
    q: "How does the size of text chunks affect RAG citation performance?",
    a: "RAG engines split pages into fixed token chunks (usually 100 to 300 words). If a single paragraph spans 600 words without subheaders, it gets sliced arbitrarily, breaking the context. Short paragraphs, list tags, and clean tables act as structural boundaries, keeping chunk context intact."
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
      { "@type": "ListItem", "position": 3, "name": "GEO Citability Grader", "item": "https://seoptimised.com/free-tools/geo-grader" }
    ]
  },
  {
    "@context": "https://schema.org",
    "@type": "SoftwareApplication",
    "name": "GEO Citability Grader",
    "url": "https://seoptimised.com/free-tools/geo-grader",
    "applicationCategory": "SEOApplication",
    "operatingSystem": "All",
    "offers": {
      "@type": "Offer",
      "price": "0.00",
      "priceCurrency": "USD"
    },
    "description": "Analyze and score digital copy for AI search index ingestion. Evaluates facts, entities, structures, and direct answer formats."
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

export default function GeoGraderPage() {
  return (
    <div
      className="min-h-screen bg-slate-950 text-slate-100 flex flex-col justify-between overflow-x-hidden relative"
      style={{
        backgroundImage: `
          radial-gradient(circle at 10% 10%, rgba(245, 158, 11, 0.08) 0%, transparent 45%),
          radial-gradient(circle at 90% 20%, rgba(59, 130, 246, 0.08) 0%, transparent 45%),
          radial-gradient(circle at 50% 50%, rgba(168, 85, 247, 0.07) 0%, transparent 50%),
          radial-gradient(circle at 10% 90%, rgba(16, 185, 129, 0.06) 0%, transparent 45%),
          radial-gradient(circle at 80% 80%, rgba(245, 158, 11, 0.06) 0%, transparent 50%)
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
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-500/10 border border-amber-500/25 text-amber-400 text-xs font-bold uppercase tracking-wider mb-4">
              AI Search Copy Analyzer
            </span>
            <h1 className="text-3xl sm:text-4xl font-black text-white mb-3">
              GEO Citability <span className="gradient-text">Grader</span>
            </h1>
            <p className="text-slate-350 max-w-xl mx-auto text-sm leading-relaxed font-medium">
              Paste your page content to analyze factual density, formatting structure, and direct answers to optimize rankings in Perplexity, ChatGPT Search, and Gemini.
            </p>
          </div>

          {/* Client interactive form */}
          <GeoGraderClient />

          {/* Playbook - Integrated Cohesively in the page flow */}
          <div className="border-t border-white/10 pt-16 mt-16">
            <div className="space-y-12 font-sans">
              <div className="border-b border-white/10 pb-6">
                <h2 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight leading-tight">
                  Generative Engine Optimization (GEO) & Factual Density Playbook
                </h2>
                <p className="text-slate-400 text-xs sm:text-sm mt-2 leading-relaxed font-medium text-slate-400">
                  How RAG retrieval pipelines select cited domains and how to restructure your copy to feed AI knowledge models.
                </p>
              </div>

              <div className="grid md:grid-cols-2 gap-8 items-start">
                <div className="space-y-4">
                  <h3 className="text-lg font-bold text-white border-l-2 border-amber-500 pl-3">
                    The Mechanics of RAG-driven Citations
                  </h3>
                  <p className="text-slate-300 text-xs sm:text-sm leading-relaxed">
                    Unlike traditional search bots that index keywords to serve blue links, generative models run Retrieval-Augmented Generation (RAG) loops. When a user asks a query, the model scrapes top candidate pages, divides them into text chunks, parses them for semantic relevance, and synthesizes an answer with citations to the most authoritative chunks.
                  </p>
                  <p className="text-slate-300 text-xs sm:text-sm leading-relaxed">
                    Under the hood, these crawlers convert text into mathematical vector embeddings. Highly detailed sentences (containing numbers, named entities, specific dates, or percentages) yield distinct vector dimensions that make them easy for models to classify as key information sources.
                  </p>
                  <ul className="list-none space-y-2.5 text-xs sm:text-sm text-slate-350 font-medium">
                    <li className="flex items-start gap-2">
                      <span className="w-1.5 h-1.5 rounded-full bg-amber-450 shrink-0 mt-2" />
                      <span><strong>High Fact Density:</strong> AI models prefer content blocks packed with figures, statistics, and proper noun entities.</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="w-1.5 h-1.5 rounded-full bg-amber-450 shrink-0 mt-2" />
                      <span><strong>Chunk Ingestability:</strong> Formatting with bullet points and tables keeps tokens clean, preventing parsing fragmentation.</span>
                    </li>
                  </ul>
                </div>

                <div className="space-y-4">
                  <h3 className="text-lg font-bold text-white border-l-2 border-amber-500 pl-3">
                    GEO Copywriting Checklist
                  </h3>
                  <p className="text-slate-300 text-xs sm:text-sm leading-relaxed">
                    To optimize your copy for generative search citations, avoid marketing fluff and prioritize concrete data structures. Keep your definitions direct, front-load statistics, and back up claims with verified figures.
                  </p>
                  <p className="text-slate-300 text-xs sm:text-sm leading-relaxed">
                    Avoid vague corporate expressions like 'innovative synergy' or 'passionate teams delivering values'. Write objective, third-person declarative descriptions that provide actual answers to questions.
                  </p>
                  <ul className="list-none space-y-2.5 text-xs sm:text-sm text-slate-350 font-medium">
                    <li className="flex items-start gap-2">
                      <span className="w-1.5 h-1.5 rounded-full bg-amber-450 shrink-0 mt-2" />
                      <span><strong>Direct Answers:</strong> Directly follow question headings with direct semantic definition syntax (&ldquo;X is a...&rdquo;).</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="w-1.5 h-1.5 rounded-full bg-amber-450 shrink-0 mt-2" />
                      <span><strong>Tables & Lists:</strong> Place complex product options or comparison criteria in clean HTML tables.</span>
                    </li>
                  </ul>
                </div>
              </div>

              {/* Ingestion Specs Table */}
              <div className="space-y-4">
                <h3 className="text-lg font-bold text-white border-l-2 border-amber-500 pl-3">
                  AI Model Retrieval Preferences
                </h3>
                <div className="overflow-x-auto border border-white/10 rounded-2xl bg-slate-900/20 backdrop-blur-md">
                  <table className="w-full text-left border-collapse text-xs sm:text-sm text-slate-350">
                    <thead>
                      <tr className="border-b border-white/10 bg-white/5 text-white font-bold">
                        <th className="p-4">Retrieval Dimension</th>
                        <th className="p-4">Favored Structure</th>
                        <th className="p-4">Disfavored Structure</th>
                        <th className="p-4">Optimization Strategy</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-white/5">
                      <tr>
                        <td className="p-4 font-bold text-white">Fact Density</td>
                        <td className="p-4 font-mono text-amber-400">Numbers, statistics, dates, entities</td>
                        <td className="p-4">Vague claims, sales pitches, buzzwords</td>
                        <td className="p-4 text-slate-400">Back up every claim with a quantitative statistic or date.</td>
                      </tr>
                      <tr>
                        <td className="p-4 font-bold text-white">Formatting</td>
                        <td className="p-4 font-mono text-amber-400">Bullet points, tables, bold text</td>
                        <td className="p-4">Dense, unformatted text walls</td>
                        <td className="p-4 text-slate-400">Break up paragraphs every 3-4 sentences; insert list structures.</td>
                      </tr>
                      <tr>
                        <td className="p-4 font-bold text-white">Semantic Style</td>
                        <td className="p-4 font-mono text-amber-400">Declarative, objective tone</td>
                        <td className="p-4">First-person pronouns, high adjectives</td>
                        <td className="p-4 text-slate-400">Write authoritative, encyclopedia-style copy for informational areas.</td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>

              {/* Step checklist */}
              <div className="space-y-4 border-t border-white/5 pt-8">
                <h3 className="text-lg font-bold text-white border-l-2 border-amber-500 pl-3">
                  Checklist: Restructuring Copy for AI Indexing
                </h3>
                <div className="grid sm:grid-cols-3 gap-6">
                  <div className="bg-slate-900/30 border border-white/5 rounded-2xl p-5 space-y-2">
                    <span className="text-[10px] font-bold uppercase tracking-wider text-amber-400">Step 1</span>
                    <h4 className="text-sm font-bold text-white">Quantify Claims</h4>
                    <p className="text-slate-400 text-xs leading-relaxed">
                      Scan your draft for adjectives like 'extremely fast', 'large database', 'high traffic' and replace them with verified figures (e.g. 'under 2 seconds', '1.2 million rows').
                    </p>
                  </div>
                  <div className="bg-slate-900/30 border border-white/5 rounded-2xl p-5 space-y-2">
                    <span className="text-[10px] font-bold uppercase tracking-wider text-amber-400">Step 2</span>
                    <h4 className="text-sm font-bold text-white">Write Declarative Definitions</h4>
                    <p className="text-slate-400 text-xs leading-relaxed">
                      Begin sections under H2/H3 elements with clear semantic triggers ('is a', 'refers to', 'defines') within the first 15 words.
                    </p>
                  </div>
                  <div className="bg-slate-900/30 border border-white/5 rounded-2xl p-5 space-y-2">
                    <span className="text-[10px] font-bold uppercase tracking-wider text-amber-400">Step 3</span>
                    <h4 className="text-sm font-bold text-white">Insert List markups</h4>
                    <p className="text-slate-400 text-xs leading-relaxed">
                      Add bulleted lists or tabular datasets for multi-part specifications. Headless AI scrapers ingest structured lists easier than prose.
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Interactive FAQs component */}
            <GeoFaqClient faqs={FAQS} />
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
