"use client";

import { useState, useMemo } from "react";

export function MetaTagGeneratorClient() {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [url, setUrl] = useState("");
  const [robotsIndex, setRobotsIndex] = useState("index");
  const [robotsFollow, setRobotsFollow] = useState("follow");
  
  const [ogTitle, setOgTitle] = useState("");
  const [ogDescription, setOgDescription] = useState("");
  const [ogImage, setOgImage] = useState("");
  
  const [twitterCard, setTwitterCard] = useState("summary_large_image");
  const twitterTitle = "";
  const twitterDescription = "";
  const [twitterImage, setTwitterImage] = useState("");

  const [copied, setCopied] = useState(false);

  // Compute HTML output
  const generatedHtml = useMemo(() => {
    let code = `<!-- SEO Meta Tags -->\n`;
    if (title) code += `<title>${title}</title>\n`;
    if (description) code += `<meta name="description" content="${description}">\n`;
    code += `<meta name="robots" content="${robotsIndex}, ${robotsFollow}">\n`;
    if (url) code += `<link rel="canonical" href="${url}">\n\n`;

    code += `<!-- Open Graph / Facebook -->\n`;
    code += `<meta name="og:type" content="website">\n`;
    if (url) code += `<meta name="og:url" content="${url}">\n`;
    if (ogTitle || title) code += `<meta name="og:title" content="${ogTitle || title}">\n`;
    if (ogDescription || description) code += `<meta name="og:description" content="${ogDescription || description}">\n`;
    if (ogImage) code += `<meta name="og:image" content="${ogImage}">\n\n`;

    code += `<!-- Twitter -->\n`;
    code += `<meta name="twitter:card" content="${twitterCard}">\n`;
    if (url) code += `<meta name="twitter:url" content="${url}">\n`;
    if (twitterTitle || title) code += `<meta name="twitter:title" content="${twitterTitle || title}">\n`;
    if (twitterDescription || description) code += `<meta name="twitter:description" content="${twitterDescription || description}">\n`;
    if (twitterImage || ogImage) code += `<meta name="twitter:image" content="${twitterImage || ogImage}">\n`;

    return code.trim();
  }, [title, description, url, robotsIndex, robotsFollow, ogTitle, ogDescription, ogImage, twitterCard, twitterTitle, twitterDescription, twitterImage]);

  const handleCopy = () => {
    navigator.clipboard.writeText(generatedHtml);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="space-y-8 relative z-10 font-sans mb-16">
      {/* Top Section: Tool (Inputs) and Preview Side-by-Side */}
      <div className="grid lg:grid-cols-12 gap-8 items-stretch">
        {/* Tool Column - Inputs (7 cols) */}
        <div className="lg:col-span-7 bg-slate-900/40 border border-white/10 rounded-3xl p-6 backdrop-blur-xl space-y-6">
          <div>
            <h2 className="text-base font-bold text-white mb-4 border-b border-white/5 pb-2">1. Base Search Engine Info</h2>
            <div className="space-y-4">
              <div>
                <label htmlFor="base-title" className="block text-xs font-bold text-slate-400 uppercase tracking-wide mb-1">
                  Title Tag ({title.length} chars)
                </label>
                <input
                  id="base-title"
                  type="text"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="e.g. Best Pizza in Chicago | Tony's Pizzeria"
                  className="w-full bg-slate-950 border border-white/10 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-teal-500 text-white"
                />
              </div>
              <div>
                <label htmlFor="base-desc" className="block text-xs font-bold text-slate-400 uppercase tracking-wide mb-1">
                  Meta Description ({description.length} chars)
                </label>
                <textarea
                  id="base-desc"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="e.g. Looking for Chicago deep dish? Tony's offers fresh local ingredients. Order online now!"
                  rows={3}
                  className="w-full bg-slate-950 border border-white/10 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-teal-500 text-white"
                />
              </div>
              <div className="grid sm:grid-cols-3 gap-4">
                <div className="sm:col-span-2">
                  <label htmlFor="base-url" className="block text-xs font-bold text-slate-400 uppercase tracking-wide mb-1">
                    Canonical URL
                  </label>
                  <input
                    id="base-url"
                    type="url"
                    value={url}
                    onChange={(e) => setUrl(e.target.value)}
                    placeholder="https://example.com/page"
                    className="w-full bg-slate-950 border border-white/10 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-teal-500 text-white"
                  />
                </div>
                <div>
                  <label htmlFor="robots-rules" className="block text-xs font-bold text-slate-400 uppercase tracking-wide mb-1">
                    Robots Rules
                  </label>
                  <div id="robots-rules" className="flex flex-col sm:flex-row gap-2">
                    <select
                      value={robotsIndex}
                      onChange={(e) => setRobotsIndex(e.target.value)}
                      className="w-full bg-slate-950 border border-white/10 rounded-xl px-2 py-2.5 text-xs focus:outline-none focus:border-teal-500 text-white"
                      aria-label="Robots Index Rule"
                    >
                      <option value="index">Index</option>
                      <option value="noindex">Noindex</option>
                    </select>
                    <select
                      value={robotsFollow}
                      onChange={(e) => setRobotsFollow(e.target.value)}
                      className="w-full bg-slate-950 border border-white/10 rounded-xl px-2 py-2.5 text-xs focus:outline-none focus:border-teal-500 text-white"
                      aria-label="Robots Follow Rule"
                    >
                      <option value="follow">Follow</option>
                      <option value="nofollow">Nofollow</option>
                    </select>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div>
            <h2 className="text-base font-bold text-white mb-4 border-b border-white/5 pb-2">2. Open Graph (Facebook/LinkedIn)</h2>
            <div className="space-y-4">
              <div className="grid sm:grid-cols-2 gap-4">
                <div>
                  <label htmlFor="og-title" className="block text-xs font-bold text-slate-400 uppercase tracking-wide mb-1">
                    OG Title
                  </label>
                  <input
                    id="og-title"
                    type="text"
                    value={ogTitle}
                    onChange={(e) => setOgTitle(e.target.value)}
                    placeholder="Leave blank to use base title"
                    className="w-full bg-slate-950 border border-white/10 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-teal-500 text-white"
                  />
                </div>
                <div>
                  <label htmlFor="og-image" className="block text-xs font-bold text-slate-400 uppercase tracking-wide mb-1">
                    OG Image URL
                  </label>
                  <input
                    id="og-image"
                    type="text"
                    value={ogImage}
                    onChange={(e) => setOgImage(e.target.value)}
                    placeholder="https://example.com/og-image.png"
                    className="w-full bg-slate-950 border border-white/10 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-teal-500 text-white"
                  />
                </div>
              </div>
              <div>
                <label htmlFor="og-desc" className="block text-xs font-bold text-slate-400 uppercase tracking-wide mb-1">
                  OG Description
                </label>
                <textarea
                  id="og-desc"
                  value={ogDescription}
                  onChange={(e) => setOgDescription(e.target.value)}
                  placeholder="Leave blank to use base description"
                  rows={2}
                  className="w-full bg-slate-950 border border-white/10 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-teal-500 text-white"
                />
              </div>
            </div>
          </div>

          <div>
            <h2 className="text-base font-bold text-white mb-4 border-b border-white/5 pb-2">3. Twitter Card</h2>
            <div className="space-y-4">
              <div className="grid sm:grid-cols-3 gap-4">
                <div>
                  <label htmlFor="twitter-card" className="block text-xs font-bold text-slate-400 uppercase tracking-wide mb-1">
                    Card Type
                  </label>
                  <select
                    id="twitter-card"
                    value={twitterCard}
                    onChange={(e) => setTwitterCard(e.target.value)}
                    className="w-full bg-slate-950 border border-white/10 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-teal-500 text-white"
                  >
                    <option value="summary_large_image">Large Image</option>
                    <option value="summary">Standard Summary</option>
                  </select>
                </div>
                <div className="sm:col-span-2">
                  <label htmlFor="twitter-image" className="block text-xs font-bold text-slate-400 uppercase tracking-wide mb-1">
                    Twitter Image URL
                  </label>
                  <input
                    id="twitter-image"
                    type="text"
                    value={twitterImage}
                    onChange={(e) => setTwitterImage(e.target.value)}
                    placeholder="Leave blank to use OG image"
                    className="w-full bg-slate-950 border border-white/10 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-teal-500 text-white"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Preview Column - Visual Previews (5 cols) */}
        <div className="lg:col-span-5 flex flex-col gap-6">
          <div className="bg-slate-900/40 border border-white/10 rounded-3xl p-6 backdrop-blur-xl flex-1 flex flex-col justify-center">
            <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-4">Google Search Preview</h3>
            <div className="bg-slate-950 rounded-2xl p-4.5 border border-white/5 select-none text-left space-y-1.5 shadow-inner w-full">
              <div className="flex items-center gap-2">
                <div className="w-4.5 h-4.5 rounded-full bg-slate-900 border border-white/5 flex items-center justify-center text-[9px] text-slate-400 font-bold shrink-0">
                  {url ? url.replace(/^(https?:\/\/)?(www\.)?/, "").charAt(0).toUpperCase() : "G"}
                </div>
                <div className="text-[11px] text-slate-400 truncate">
                  {url ? url.replace(/^(https?:\/\/)?(www\.)?/, "").split("/")[0] : "yourdomain.com"}
                </div>
              </div>
              <div className="text-sm text-blue-400 hover:underline font-semibold leading-tight truncate">
                {title || "Please enter a title tag above..."}
              </div>
              <div className="text-xs text-slate-300 leading-normal line-clamp-2">
                {description || "Please enter a meta description to see how your listing will appear in Google searches..."}
              </div>
            </div>
          </div>

          <div className="bg-slate-900/40 border border-white/10 rounded-3xl p-6 backdrop-blur-xl flex-1 flex flex-col justify-center">
            <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-4">Social Share Card Preview</h3>
            <div className="border border-white/10 rounded-xl bg-slate-950 overflow-hidden select-none">
              <div className="w-full aspect-[1.91/1] bg-slate-900 flex items-center justify-center text-xs text-slate-500 relative overflow-hidden border-b border-white/5">
                {ogImage ? (
                  <img
                    src={ogImage}
                    alt="OG Card Thumbnail"
                    className="w-full h-full object-cover"
                    loading="lazy"
                    decoding="async"
                  />
                ) : (
                  <span>1200 x 630 Card Image Preview</span>
                )}
              </div>
              <div className="p-3 space-y-1">
                <span className="text-[9px] uppercase font-bold text-slate-500 tracking-wider">
                  {url ? new URL(url).hostname : "yourdomain.com"}
                </span>
                <h4 className="text-xs font-bold text-white truncate">
                  {ogTitle || title || "Card Title Preview"}
                </h4>
                <p className="text-[10px] text-slate-400 line-clamp-2">
                  {ogDescription || description || "Card description preview displaying metadata copy summaries."}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Section: Result (Code Box) stretching full width */}
      <div className="bg-slate-900/40 border border-white/10 rounded-3xl p-6 backdrop-blur-xl w-full">
        <div className="flex justify-between items-center mb-4">
          <div>
            <h3 className="text-sm font-bold text-white uppercase tracking-wider">Generated Meta Tags</h3>
            <p className="text-[10px] text-slate-400 mt-0.5">Copy and paste the code below inside your website&apos;s &lt;head&gt; element.</p>
          </div>
          <button
            onClick={handleCopy}
            className="text-xs font-bold px-4 py-2 rounded-xl bg-teal-500 text-white hover:bg-teal-400 transition-colors shadow-lg shadow-teal-500/10 cursor-pointer"
          >
            {copied ? "Copied!" : "Copy Code"}
          </button>
        </div>
        <pre className="w-full bg-slate-950 border border-white/5 rounded-2xl p-4 overflow-x-auto text-xs font-mono text-slate-350 min-h-32">
          <code>{generatedHtml}</code>
        </pre>
      </div>
    </div>
  );
}
