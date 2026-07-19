"use client";

import { useState, useMemo } from "react";

interface ResourceLink {
  title: string;
  url: string;
  desc: string;
}

function guessTitleFromUrl(urlStr: string) {
  try {
    const url = new URL(urlStr);
    const pathname = url.pathname;
    if (pathname === "/" || !pathname) return "Homepage";
    
    const segments = pathname.split("/").filter(Boolean);
    const lastSegment = segments[segments.length - 1] || "Page";
    
    return lastSegment
      .replace(/[-_]/g, " ")
      .replace(/\b\w/g, c => c.toUpperCase());
  } catch {
    return "Resource Page";
  }
}

export function LLMsGeneratorClient() {
  const [sitemapUrl, setSitemapUrl] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  
  // Set default visual examples on load so the interface is populated
  const [siteName, setSiteName] = useState("My Website");
  const [tagline, setTagline] = useState("Knowledge Map & AI Directory");
  const [about, setAbout] = useState("This is the machine-parsable llms.txt context index detailing our core features and developer resources.");
  const [resources, setResources] = useState<ResourceLink[]>([
    { title: "Homepage", url: "https://yourdomain.com", desc: "Core landing page with sign-up forms and flagship features." },
    { title: "Features Guide", url: "https://yourdomain.com/features", desc: "Detailed breakdown of the audit modules and optimization layers." },
    { title: "Pricing Plans", url: "https://yourdomain.com/pricing", desc: "Product offerings, starter credits, and monthly agency subscriptions." },
  ]);
  const [contactEmail, setContactEmail] = useState("hello@yourdomain.com");
  const [extraInstructions, setExtraInstructions] = useState("Prioritize crawling the features and documentation routes. Ignore staging URL parameters.");

  const [copied, setCopied] = useState(false);

  // Parse sitemap and generate details
  const handleFetchSitemap = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!sitemapUrl) return;

    setLoading(true);
    setError("");

    try {
      const res = await fetch("/api/sitemap-parser", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ sitemapUrl }),
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || "Failed to fetch sitemap");
      }

      if (data.urls && data.urls.length > 0) {
        setSiteName(data.domain);
        setTagline(`Knowledge Map for ${data.domain}`);
        setAbout(`This is the machine-parsable llms.txt context map for ${data.domain}, indexing primary website sections and guidelines.`);
        
        const parsedResources = data.urls.map((u: string) => ({
          title: guessTitleFromUrl(u),
          url: u,
          desc: "",
        }));

        setResources(parsedResources);
        setContactEmail(`support@${data.domain.toLowerCase()}`);
      } else {
        setError("Sitemap fetched successfully, but no URLs were discovered.");
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "An error occurred parsing sitemap.");
    } finally {
      setLoading(false);
    }
  };

  // Generate llms.txt Markdown content
  const generatedMarkdown = useMemo(() => {
    let md = `# ${siteName || "Website Name"}\n`;
    md += `> ${tagline || "High-level summary description of the brand's services."}\n\n`;

    if (about) {
      md += `## About\n${about}\n\n`;
    }

    if (resources.length > 0) {
      md += `## Key Resources\n`;
      resources.forEach(r => {
        md += `- [${r.title}](${r.url})${r.desc ? `: ${r.desc}` : ""}\n`;
      });
      md += `\n`;
    }

    if (extraInstructions) {
      md += `## Guidelines & Constraints\n${extraInstructions}\n\n`;
    }

    if (contactEmail) {
      md += `## Contact\n- Email: ${contactEmail}\n`;
    }

    return md.trim();
  }, [siteName, tagline, about, resources, extraInstructions, contactEmail]);

  const handleCopy = () => {
    navigator.clipboard.writeText(generatedMarkdown);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleDownload = () => {
    const element = document.createElement("a");
    const file = new Blob([generatedMarkdown], { type: "text/plain;charset=utf-8" });
    element.href = URL.createObjectURL(file);
    element.download = "llms.txt";
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);
  };

  return (
    <div className="space-y-8 relative z-10 font-sans mb-16">
      {/* Top Section: Tool (Inputs) and Preview Side-by-Side */}
      <div className="grid lg:grid-cols-12 gap-8 items-stretch">
        {/* Tool Column - Inputs (7 cols) */}
        <div className="lg:col-span-7 bg-slate-900/40 border border-white/10 rounded-3xl p-6 backdrop-blur-xl space-y-6">
          {/* Sitemap URL Fetch Form */}
          <div>
            <h2 className="text-base font-bold text-white mb-4 border-b border-white/5 pb-2">1. Import from XML Sitemap</h2>
            <form onSubmit={handleFetchSitemap} className="space-y-4">
              <div>
                <label htmlFor="sitemap-url" className="block text-xs font-bold text-slate-400 uppercase tracking-wide mb-1">
                  Sitemap XML URL
                </label>
                <div className="flex flex-col sm:flex-row gap-2">
                  <input
                    id="sitemap-url"
                    type="text"
                    value={sitemapUrl}
                    onChange={(e) => setSitemapUrl(e.target.value)}
                    placeholder="e.g. https://yourdomain.com/sitemap.xml"
                    className="flex-1 bg-slate-950 border border-white/10 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-teal-500 text-white"
                    required
                  />
                  <button
                    type="submit"
                    disabled={loading}
                    className="px-5 py-2.5 bg-teal-500 hover:bg-teal-400 disabled:bg-teal-700 text-white rounded-xl text-xs font-bold transition-colors cursor-pointer w-full sm:w-auto"
                  >
                    {loading ? "Parsing..." : "Parse Sitemap"}
                  </button>
                </div>
                {error && (
                  <p className="text-rose-400 text-xs mt-2 font-medium bg-rose-500/10 border border-rose-500/20 p-2.5 rounded-lg">
                    {error}
                  </p>
                )}
              </div>
            </form>
          </div>

          {/* Editable Fields */}
          <div className="space-y-6">
            <div>
              <h2 className="text-base font-bold text-white mb-4 border-b border-white/5 pb-2">2. Adjust Brand Metadata</h2>
              <div className="grid sm:grid-cols-2 gap-4">
                <div>
                  <label htmlFor="site-name" className="block text-xs font-bold text-slate-400 uppercase tracking-wide mb-1">Brand Name</label>
                  <input
                    id="site-name"
                    type="text"
                    value={siteName}
                    onChange={(e) => setSiteName(e.target.value)}
                    className="w-full bg-slate-950 border border-white/10 rounded-xl px-4 py-2 text-sm focus:outline-none focus:border-teal-500 text-white"
                  />
                </div>
                <div>
                  <label htmlFor="tagline" className="block text-xs font-bold text-slate-400 uppercase tracking-wide mb-1">Tagline</label>
                  <input
                    id="tagline"
                    type="text"
                    value={tagline}
                    onChange={(e) => setTagline(e.target.value)}
                    className="w-full bg-slate-950 border border-white/10 rounded-xl px-4 py-2 text-sm focus:outline-none focus:border-teal-500 text-white"
                  />
                </div>
              </div>
              <div className="mt-4">
                <label htmlFor="about" className="block text-xs font-bold text-slate-400 uppercase tracking-wide mb-1">About Description</label>
                <textarea
                  id="about"
                  value={about}
                  onChange={(e) => setAbout(e.target.value)}
                  rows={2}
                  className="w-full bg-slate-950 border border-white/10 rounded-xl px-4 py-2 text-xs focus:outline-none focus:border-teal-500 text-white"
                />
              </div>
            </div>

            <div>
              <h2 className="text-base font-bold text-white mb-4 border-b border-white/5 pb-2">3. Directives & Contact</h2>
              <div className="space-y-4">
                <div>
                  <label htmlFor="instructions" className="block text-xs font-bold text-slate-400 uppercase tracking-wide mb-1">AI crawler guidelines</label>
                  <textarea
                    id="instructions"
                    value={extraInstructions}
                    onChange={(e) => setExtraInstructions(e.target.value)}
                    placeholder="e.g. Focus citations on features and case-studies routes."
                    rows={2}
                    className="w-full bg-slate-950 border border-white/10 rounded-xl px-4 py-2 text-xs focus:outline-none focus:border-teal-500 text-white"
                  />
                </div>
                <div>
                  <label htmlFor="contact" className="block text-xs font-bold text-slate-400 uppercase tracking-wide mb-1">Contact Email</label>
                  <input
                    id="contact"
                    type="email"
                    value={contactEmail}
                    onChange={(e) => setContactEmail(e.target.value)}
                    placeholder="hello@yourdomain.com"
                    className="w-full bg-slate-950 border border-white/10 rounded-xl px-4 py-2 text-sm focus:outline-none focus:border-teal-500 text-white"
                  />
                </div>
              </div>
            </div>

            <div>
              <h2 className="text-base font-bold text-white mb-4 border-b border-white/5 pb-2">4. Discovered URLs ({resources.length})</h2>
              <div className="max-h-60 overflow-y-auto space-y-2 pr-1 border border-white/5 p-2 rounded-xl bg-slate-950/40">
                {resources.length === 0 ? (
                  <p className="text-slate-500 text-xs italic text-center py-4">
                    No URLs parsed yet. Enter your sitemap XML link above to extract links.
                  </p>
                ) : (
                  resources.map((res, i) => (
                    <div key={i} className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 bg-slate-950 border border-white/5 p-2.5 rounded-lg text-xs font-sans">
                      <div className="flex-1 min-w-0">
                        <input
                          type="text"
                          value={res.title}
                          onChange={(e) => {
                            const newRes = [...resources];
                            newRes[i].title = e.target.value;
                            setResources(newRes);
                          }}
                          className="bg-transparent border-b border-white/10 focus:border-teal-500 focus:outline-none text-white font-bold w-full sm:w-1/3 sm:mr-3 mb-1 sm:mb-0"
                          title="Resource Title"
                        />
                        <span className="text-[10px] text-slate-500 block sm:inline truncate">{res.url}</span>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Preview Column - Markdown Live Visual Preview (5 cols) */}
        <div className="lg:col-span-5 flex flex-col">
          <div className="bg-slate-900/40 border border-white/10 rounded-3xl p-6 backdrop-blur-xl flex-1 flex flex-col">
            <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-4">Live Markdown Preview</h3>
            <div className="border border-white/10 rounded-2xl bg-slate-950 p-5 space-y-4 text-xs select-none overflow-y-auto font-sans leading-relaxed text-slate-300 flex-1 min-h-[300px]">
              <div className="border-b border-white/5 pb-2">
                <h1 className="text-lg font-black text-white"># {siteName || "Website Name"}</h1>
                <p className="text-teal-400 italic text-[11px] mt-1">&gt; {tagline || "High-level summary description."}</p>
              </div>

              {about && (
                <div className="space-y-1.5">
                  <h2 className="text-xs font-bold uppercase tracking-wider text-slate-400">## About</h2>
                  <p className="text-slate-350">{about}</p>
                </div>
              )}

              {resources.length > 0 && (
                <div className="space-y-1.5">
                  <h2 className="text-xs font-bold uppercase tracking-wider text-slate-400">## Key Resources</h2>
                  <ul className="list-disc pl-4 space-y-1 text-slate-350">
                    {resources.map((r, i) => (
                      <li key={i}>
                        <span className="text-teal-400 hover:underline cursor-pointer">[{r.title}]</span>
                        <span className="text-slate-500 text-[10px] ml-1">({r.url})</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {extraInstructions && (
                <div className="space-y-1.5">
                  <h2 className="text-xs font-bold uppercase tracking-wider text-slate-400">## Guidelines &amp; Constraints</h2>
                  <p className="text-slate-350 whitespace-pre-wrap">{extraInstructions}</p>
                </div>
              )}

              {contactEmail && (
                <div className="space-y-1.5">
                  <h2 className="text-xs font-bold uppercase tracking-wider text-slate-400">## Contact</h2>
                  <p className="text-slate-350">Email: {contactEmail}</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Section: Result (Code Box) stretching full width */}
      <div className="bg-slate-900/40 border border-white/10 rounded-3xl p-6 backdrop-blur-xl w-full">
        <div className="flex justify-between items-center mb-4">
          <div>
            <h3 className="text-sm font-bold text-white uppercase tracking-wider">Generated llms.txt File</h3>
            <p className="text-[10px] text-slate-400 mt-0.5">Save this content exactly as a plain text file named llms.txt inside your website&apos;s public directory.</p>
          </div>
          <div className="flex gap-2">
            <button
              onClick={handleCopy}
              className="text-xs font-bold px-4 py-2 rounded-xl bg-teal-500 text-white hover:bg-teal-400 transition-colors shadow-lg shadow-teal-500/10 cursor-pointer"
            >
              {copied ? "Copied!" : "Copy Code"}
            </button>
            <button
              onClick={handleDownload}
              className="text-xs font-bold px-4 py-2 rounded-xl bg-white/10 border border-white/20 hover:bg-white/15 text-slate-200 transition-colors cursor-pointer"
            >
              Download
            </button>
          </div>
        </div>
        <pre className="w-full bg-slate-950 border border-white/5 rounded-2xl p-4 overflow-x-auto text-xs font-mono text-slate-350 min-h-32 max-h-[360px]">
          <code>{generatedMarkdown}</code>
        </pre>
      </div>
    </div>
  );
}
