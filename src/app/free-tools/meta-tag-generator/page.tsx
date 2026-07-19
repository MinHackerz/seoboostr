import { Metadata } from "next";
import { Navbar } from "@/components/landing/Navbar";
import { Footer } from "@/components/landing/Footer";
import { ToolBackground } from "@/components/landing/ToolBackground";
import { MetaTagGeneratorClient } from "./MetaTagGeneratorClient";
import { MetaTagFaqClient } from "./MetaTagFaqClient";

export const metadata: Metadata = {
  title: "Free HTML Meta Tag Generator & Editor | SEO Optimised",
  description: "Generate search-engine and social-media optimized meta tags instantly. Set index directives, Open Graph, and Twitter Cards to boost organic click-through rates.",
  alternates: {
    canonical: "https://seoptimised.com/free-tools/meta-tag-generator",
  },
  openGraph: {
    title: "Free HTML Meta Tag Generator & Editor | SEO Optimised",
    description: "Generate search-engine and social-media optimized meta tags instantly. Set index directives, Open Graph, and Twitter Cards to boost organic click-through rates.",
    url: "https://seoptimised.com/free-tools/meta-tag-generator",
    siteName: "SEO Optimised",
    type: "website",
    images: [
      {
        url: "/meta-tag-og.webp",
        width: 1200,
        height: 630,
        alt: "Free HTML Meta Tag Generator — Generate search-engine and social-media optimized meta tags instantly.",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Free HTML Meta Tag Generator & Editor | SEO Optimised",
    description: "Generate search-engine and social-media optimized meta tags instantly. Set index directives, Open Graph, and Twitter Cards to boost organic click-through rates.",
    images: ["/meta-tag-og.webp"],
  }
};

const FAQS = [
  {
    q: "How do page titles affect SEO click-through rates (CTR) on different devices?",
    a: "Page titles display differently based on device pixel widths. Mobile screens wrap titles differently than desktop layouts. Standard desktop search listings allow up to 600px width (approx 60 characters), whereas mobile layout screens allow slightly more height but less horizontal characters. Using a front-loaded target keyword format makes your title snippet click-worthy across all viewports.",
  },
  {
    q: "What are the penalties of omitting the description meta tag?",
    a: "Omitting the meta description does not trigger direct algorithmic penalties, but it forces search spiders to construct snippet blocks from raw text paragraphs. This often yields broken or unoptimized text, lowering your click-through rates. Authoring descriptive, unique meta descriptions for every page is essential to maximize SERP CTR.",
  },
  {
    q: "How do you verify dynamic Next.js Metadata rendering at build or runtime?",
    a: "In Next.js App Router, dynamic metadata is declared using the generateMetadata export. Next.js automatically executes this asynchronous function on the server side before pre-rendering, ensuring search indexers read fully updated meta tags. You can verify dynamic output by checking your local build page source (Ctrl+U) or inspecting the DOM head during runtime.",
  },
  {
    q: "Why is Google displaying a different description than the one I set?",
    a: "Google uses machine learning to dynamically match the user query to relevant text on your page. If Google believes a snippet of your body copy answers the search query better than your meta description, it will rewrite the listing description in the search results.",
  },
  {
    q: "What is the difference between standard Meta tags and Open Graph tags?",
    a: "Standard meta tags (Title, Description) are built strictly for search engine crawlers like Googlebot. Open Graph (OG) tags and Twitter Cards are built for social media bots (Facebook, LinkedIn, X/Twitter) to display rich media previews when links are shared.",
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
      { "@type": "ListItem", "position": 3, "name": "Meta Tag Generator", "item": "https://seoptimised.com/free-tools/meta-tag-generator" }
    ]
  },
  {
    "@context": "https://schema.org",
    "@type": "SoftwareApplication",
    "name": "Meta Tag Generator",
    "url": "https://seoptimised.com/free-tools/meta-tag-generator",
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

export default function MetaTagGeneratorPage() {
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
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-teal-500/10 border border-teal-500/25 text-teal-400 text-xs font-bold uppercase tracking-wider mb-4 shadow-md shadow-teal-500/10">
              SEO Tools
            </span>
            <h1 className="text-3xl sm:text-4xl font-black text-white mb-3">
              Meta Tag <span className="gradient-text">Generator</span>
            </h1>
            <p className="text-slate-350 max-w-lg mx-auto text-sm leading-relaxed font-medium">
              Generate fully compliant HTML tags for indexing, Google searches, Facebook Open Graph, and Twitter Cards.
            </p>
          </div>

          {/* Client interactive form */}
          <MetaTagGeneratorClient />

          {/* Deep Researched Developer Playbook - Integrated Cohesively in the main page flow */}
          <div className="border-t border-white/10 pt-16 mt-16">
            <div className="space-y-12 font-sans">
              <div className="border-b border-white/10 pb-6">
                <h2 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight leading-tight">
                  Meta Tag Optimization Manual: Drive Clicks & Maximize Visibility
                </h2>
                <p className="text-slate-450 text-xs sm:text-sm mt-2 leading-relaxed font-medium">
                  Learn how to write title tags and meta descriptions that search engines rank highly and users click on.
                </p>
              </div>

              {/* Core Concepts Section */}
              <div className="grid md:grid-cols-2 gap-8 items-start">
                <div className="space-y-4">
                  <h3 className="text-lg font-bold text-white border-l-2 border-teal-500 pl-3">
                    What is a Page Title Tag?
                  </h3>
                  <p className="text-slate-300 text-xs sm:text-sm leading-relaxed">
                    The title tag is the single most important on-page SEO asset. It dictates the blue clickable headline displayed on Search Engine Results Pages (SERPs) and represents the primary context signal search indexers use to categorize your page.
                  </p>
                  <ul className="list-none space-y-2.5 text-xs sm:text-sm text-slate-350">
                    <li className="flex items-start gap-2">
                      <span className="w-1.5 h-1.5 rounded-full bg-teal-400 shrink-0 mt-2" />
                      <span><strong>Ideal Length:</strong> Keep your titles between 50 to 60 characters. Anything longer gets truncated with an ellipsis.</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="w-1.5 h-1.5 rounded-full bg-teal-400 shrink-0 mt-2" />
                      <span><strong>Keyword Placement:</strong> Put your primary keyword near the beginning of the title so it stands out to both search users and Googlebot.</span>
                    </li>
                  </ul>
                </div>

                <div className="space-y-4">
                  <h3 className="text-lg font-bold text-white border-l-2 border-teal-500 pl-3">
                    What is a Meta Description Tag?
                  </h3>
                  <p className="text-slate-300 text-xs sm:text-sm leading-relaxed">
                    While meta descriptions do not influence Google ranking algorithms directly, they act as the ad copy for your search listing. An engaging, benefit-driven description convinces searchers to select your site over others, boosting your Click-Through Rate (CTR).
                  </p>
                  <ul className="list-none space-y-2.5 text-xs sm:text-sm text-slate-350">
                    <li className="flex items-start gap-2">
                      <span className="w-1.5 h-1.5 rounded-full bg-teal-400 shrink-0 mt-2" />
                      <span><strong>Ideal Length:</strong> Keep descriptions between 120 to 160 characters to prevent clipping on mobile viewports.</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="w-1.5 h-1.5 rounded-full bg-teal-400 shrink-0 mt-2" />
                      <span><strong>Clear Call-to-Action (CTA):</strong> End with an active command (e.g. &quot;Download now,&quot; &quot;Read the guide,&quot; or &quot;Audit your site for free&quot;).</span>
                    </li>
                  </ul>
                </div>
              </div>

              {/* Social Media Optimization */}
              <div className="space-y-4">
                <h3 className="text-lg font-bold text-white border-l-2 border-teal-500 pl-3">
                  Optimizing for Slack, Discord, and Social Media Share Cards
                </h3>
                <p className="text-slate-300 text-xs sm:text-sm leading-relaxed">
                  When users copy and paste your links into chat platforms or social media feeds, the platforms scrapers read specific tags called <strong>Open Graph (OG)</strong> and <strong>Twitter Cards</strong> to render a rich media preview. If these tags are missing, your link will display as a plain text URL, drastically decreasing the engagement rate.
                </p>
                <div className="p-5 rounded-2xl bg-slate-900/50 border border-white/5 space-y-3">
                  <h4 className="text-xs font-bold text-white uppercase tracking-wider">Social Card Guidelines</h4>
                  <ul className="list-none space-y-2 text-xs sm:text-sm text-slate-300">
                    <li className="flex items-center gap-2.5">
                      <svg className="w-4 h-4 text-teal-400 shrink-0" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24"><polyline points="20 6 9 17 4 12"/></svg>
                      <span><strong>Open Graph Image dimensions:</strong> Always use a landscape image sized exactly at <strong>1200 x 630 pixels</strong>.</span>
                    </li>
                    <li className="flex items-center gap-2.5">
                      <svg className="w-4 h-4 text-teal-400 shrink-0" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24"><polyline points="20 6 9 17 4 12"/></svg>
                      <span><strong>Twitter Card type:</strong> Use <code>summary_large_image</code> to display a prominent photo layout rather than a tiny square thumbnail.</span>
                    </li>
                  </ul>
                </div>
              </div>

              {/* Step-by-Step Optimization Checklist */}
              <div className="space-y-4">
                <h3 className="text-lg font-bold text-white border-l-2 border-teal-500 pl-3">
                  Step-by-Step Meta Tag Optimization Checklist
                </h3>
                <div className="grid sm:grid-cols-3 gap-6">
                  <div className="bg-slate-900/30 border border-white/5 rounded-2xl p-5 space-y-2">
                    <span className="text-[10px] font-bold uppercase tracking-wider text-teal-400">Step 1</span>
                    <h4 className="text-sm font-bold text-white">Perform a Keyword Audit</h4>
                    <p className="text-slate-400 text-xs leading-relaxed">
                      Identify the primary search phrase and variations for each URL. Avoid stuffing multiple keywords into a single title.
                    </p>
                  </div>
                  <div className="bg-slate-900/30 border border-white/5 rounded-2xl p-5 space-y-2">
                    <span className="text-[10px] font-bold uppercase tracking-wider text-teal-400">Step 2</span>
                    <h4 className="text-sm font-bold text-white">Create Unique Snippets</h4>
                    <p className="text-slate-400 text-xs leading-relaxed">
                      Write unique titles and descriptions for every single indexable page. Duplicate tags confuse search crawlers and lead to indexation filters.
                    </p>
                  </div>
                  <div className="bg-slate-900/30 border border-white/5 rounded-2xl p-5 space-y-2">
                    <span className="text-[10px] font-bold uppercase tracking-wider text-teal-400">Step 3</span>
                    <h4 className="text-sm font-bold text-white">Test Mobile Previews</h4>
                    <p className="text-slate-400 text-xs leading-relaxed">
                      Verify that your snippets fit perfectly on mobile screens where title character limits are tighter than on desktop viewports.
                    </p>
                  </div>
                </div>
              </div>

              {/* Optimal Limits Cheat Sheet Table */}
              <div className="space-y-4">
                <h3 className="text-lg font-bold text-white border-l-2 border-teal-500 pl-3">
                  Optimal Lengths & Dimensions Reference
                </h3>
                <div className="overflow-x-auto border border-white/10 rounded-2xl bg-slate-900/20 backdrop-blur-md">
                  <table className="w-full text-left border-collapse text-xs sm:text-sm text-slate-350">
                    <thead>
                      <tr className="border-b border-white/10 bg-white/5 text-white font-bold">
                        <th className="p-4">Meta Tag Name</th>
                        <th className="p-4">Character Target</th>
                        <th className="p-4">Pixel Boundary</th>
                        <th className="p-4">Impact of Exceeding Limits</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-white/5">
                      <tr>
                        <td className="p-4 font-bold text-white">Title Tag</td>
                        <td className="p-4">50 – 60 characters</td>
                        <td className="p-4">600 pixels (Desktop)</td>
                        <td className="p-4 text-slate-400">Title gets cut off with &quot;...&quot; in Google SERPs, hiding key brand details.</td>
                      </tr>
                      <tr>
                        <td className="p-4 font-bold text-white">Meta Description</td>
                        <td className="p-4">120 – 160 characters</td>
                        <td className="p-4">960 pixels (Desktop)</td>
                        <td className="p-4 text-slate-400">Google truncates the text or dynamically rewrites the snippet from body text.</td>
                      </tr>
                      <tr>
                        <td className="p-4 font-bold text-white">Open Graph Image</td>
                        <td className="p-4">N/A</td>
                        <td className="p-4">1200 x 630 pixels</td>
                        <td className="p-4 text-slate-400">Images may load slowly or display with cropped, off-center previews.</td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>
            </div>

            {/* Interactive FAQ component */}
            <MetaTagFaqClient faqs={FAQS} />
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
