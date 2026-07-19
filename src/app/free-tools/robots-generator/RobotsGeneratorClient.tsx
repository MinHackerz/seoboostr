"use client";

import { useState, useMemo } from "react";

export function RobotsGeneratorClient() {
  const [sitemap, setSitemap] = useState("");
  const [crawlDelay, setCrawlDelay] = useState("none");
  const [disallowPaths, setDisallowPaths] = useState("/api/\n/admin/");
  const [allowPaths, setAllowPaths] = useState("/");

  // AI bots permissions (default to allowed)
  const [gptBotAllowed, setGptBotAllowed] = useState(true);
  const [chatgptUserAllowed, setChatgptUserAllowed] = useState(true);
  const [claudeBotAllowed, setClaudeBotAllowed] = useState(true);
  const [perplexityBotAllowed, setPerplexityBotAllowed] = useState(true);
  const [googleExtendedAllowed, setGoogleExtendedAllowed] = useState(true);
  const [applebotExtendedAllowed, setApplebotExtendedAllowed] = useState(true);
  const [cohereCrawlerAllowed, setCohereCrawlerAllowed] = useState(true);
  const [facebookBotAllowed, setFacebookBotAllowed] = useState(true);

  const [copied, setCopied] = useState(false);

  // Generate robots.txt file string
  const generatedTxt = useMemo(() => {
    let txt = `# AI & Search Robots.txt Builder\n# Generated via seoptimised.com\n\n`;

    // Standard User-agent settings
    txt += `User-agent: *\n`;
    if (crawlDelay !== "none") {
      txt += `Crawl-delay: ${crawlDelay}\n`;
    }

    const disallows = disallowPaths.split("\n").filter(Boolean);
    const allows = allowPaths.split("\n").filter(Boolean);

    disallows.forEach((p) => {
      txt += `Disallow: ${p.trim()}\n`;
    });
    allows.forEach((p) => {
      txt += `Allow: ${p.trim()}\n`;
    });
    txt += `\n`;

    // GPTBot
    txt += `User-agent: GPTBot\n${gptBotAllowed ? "Allow: /" : "Disallow: /"}\n\n`;
    
    // ChatGPT-User
    txt += `User-agent: ChatGPT-User\n${chatgptUserAllowed ? "Allow: /" : "Disallow: /"}\n\n`;
    
    // ClaudeBot
    txt += `User-agent: ClaudeBot\n${claudeBotAllowed ? "Allow: /" : "Disallow: /"}\n\n`;
    
    // PerplexityBot
    txt += `User-agent: PerplexityBot\n${perplexityBotAllowed ? "Allow: /" : "Disallow: /"}\n\n`;
    
    // Google-Extended
    txt += `User-agent: Google-Extended\n${googleExtendedAllowed ? "Allow: /" : "Disallow: /"}\n\n`;
    
    // Applebot-Extended
    txt += `User-agent: Applebot-Extended\n${applebotExtendedAllowed ? "Allow: /" : "Disallow: /"}\n\n`;
    
    // Cohere-crawler
    txt += `User-agent: Cohere-crawler\n${cohereCrawlerAllowed ? "Allow: /" : "Disallow: /"}\n\n`;
    
    // FacebookBot
    txt += `User-agent: FacebookBot\n${facebookBotAllowed ? "Allow: /" : "Disallow: /"}\n\n`;

    if (sitemap) {
      txt += `Sitemap: ${sitemap}\n`;
    } else {
      txt += `Sitemap: https://seoptimised.com/sitemap.xml\n`;
    }

    return txt.trim();
  }, [
    sitemap,
    crawlDelay,
    disallowPaths,
    allowPaths,
    gptBotAllowed,
    chatgptUserAllowed,
    claudeBotAllowed,
    perplexityBotAllowed,
    googleExtendedAllowed,
    applebotExtendedAllowed,
    cohereCrawlerAllowed,
    facebookBotAllowed,
  ]);

  const handleCopy = () => {
    navigator.clipboard.writeText(generatedTxt);
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
            <h2 className="text-base font-bold text-white mb-4 border-b border-white/5 pb-2">1. Base Crawl Settings</h2>
            <div className="space-y-4">
              <div>
                <label htmlFor="sitemap-url" className="block text-xs font-bold text-slate-400 uppercase tracking-wide mb-1">
                  XML Sitemap URL
                </label>
                <input
                  id="sitemap-url"
                  type="url"
                  value={sitemap}
                  onChange={(e) => setSitemap(e.target.value)}
                  placeholder="e.g. https://yourdomain.com/sitemap.xml"
                  className="w-full bg-slate-950 border border-white/10 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-teal-500 text-white"
                />
              </div>
              <div>
                <label htmlFor="crawl-delay" className="block text-xs font-bold text-slate-400 uppercase tracking-wide mb-1">
                  Crawl Delay
                </label>
                <select
                  id="crawl-delay"
                  value={crawlDelay}
                  onChange={(e) => setCrawlDelay(e.target.value)}
                  className="w-full bg-slate-950 border border-white/10 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-teal-500 text-white"
                >
                  <option value="none">No Delay (Default)</option>
                  <option value="1">1 Second</option>
                  <option value="2">2 Seconds</option>
                  <option value="5">5 Seconds</option>
                  <option value="10">10 Seconds</option>
                </select>
              </div>
            </div>
          </div>

          <div>
            <h2 className="text-base font-bold text-white mb-4 border-b border-white/5 pb-2">2. AI & LLM Bot Permissions (GEO Optimization)</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <label className="flex items-center gap-3 p-3 bg-slate-950/60 rounded-xl border border-white/5 cursor-pointer hover:border-teal-500/25 transition-all">
                <input
                  type="checkbox"
                  checked={gptBotAllowed}
                  onChange={(e) => setGptBotAllowed(e.target.checked)}
                  className="accent-teal-500 rounded"
                />
                <div className="text-left">
                  <span className="text-xs font-bold text-white block">GPTBot</span>
                  <span className="text-[9px] text-slate-500 block">OpenAI Scraper</span>
                </div>
              </label>

              <label className="flex items-center gap-3 p-3 bg-slate-950/60 rounded-xl border border-white/5 cursor-pointer hover:border-teal-500/25 transition-all">
                <input
                  type="checkbox"
                  checked={chatgptUserAllowed}
                  onChange={(e) => setChatgptUserAllowed(e.target.checked)}
                  className="accent-teal-500 rounded"
                />
                <div className="text-left">
                  <span className="text-xs font-bold text-white block">ChatGPT-User</span>
                  <span className="text-[9px] text-slate-500 block">Dynamic Actions</span>
                </div>
              </label>

              <label className="flex items-center gap-3 p-3 bg-slate-950/60 rounded-xl border border-white/5 cursor-pointer hover:border-teal-500/25 transition-all">
                <input
                  type="checkbox"
                  checked={claudeBotAllowed}
                  onChange={(e) => setClaudeBotAllowed(e.target.checked)}
                  className="accent-teal-500 rounded"
                />
                <div className="text-left">
                  <span className="text-xs font-bold text-white block">ClaudeBot</span>
                  <span className="text-[9px] text-slate-500 block">Anthropic Model</span>
                </div>
              </label>

              <label className="flex items-center gap-3 p-3 bg-slate-950/60 rounded-xl border border-white/5 cursor-pointer hover:border-teal-500/25 transition-all">
                <input
                  type="checkbox"
                  checked={perplexityBotAllowed}
                  onChange={(e) => setPerplexityBotAllowed(e.target.checked)}
                  className="accent-teal-500 rounded"
                />
                <div className="text-left">
                  <span className="text-xs font-bold text-white block">PerplexityBot</span>
                  <span className="text-[9px] text-slate-500 block">AI Search Indexer</span>
                </div>
              </label>

              <label className="flex items-center gap-3 p-3 bg-slate-950/60 rounded-xl border border-white/5 cursor-pointer hover:border-teal-500/25 transition-all">
                <input
                  type="checkbox"
                  checked={googleExtendedAllowed}
                  onChange={(e) => setGoogleExtendedAllowed(e.target.checked)}
                  className="accent-teal-500 rounded"
                />
                <div className="text-left">
                  <span className="text-xs font-bold text-white block">Google-Extended</span>
                  <span className="text-[9px] text-slate-500 block">Gemini Training</span>
                </div>
              </label>

              <label className="flex items-center gap-3 p-3 bg-slate-950/60 rounded-xl border border-white/5 cursor-pointer hover:border-teal-500/25 transition-all">
                <input
                  type="checkbox"
                  checked={applebotExtendedAllowed}
                  onChange={(e) => setApplebotExtendedAllowed(e.target.checked)}
                  className="accent-teal-500 rounded"
                />
                <div className="text-left">
                  <span className="text-xs font-bold text-white block">Applebot-Extended</span>
                  <span className="text-[9px] text-slate-500 block">Apple Intelligence</span>
                </div>
              </label>

              <label className="flex items-center gap-3 p-3 bg-slate-950/60 rounded-xl border border-white/5 cursor-pointer hover:border-teal-500/25 transition-all">
                <input
                  type="checkbox"
                  checked={cohereCrawlerAllowed}
                  onChange={(e) => setCohereCrawlerAllowed(e.target.checked)}
                  className="accent-teal-500 rounded"
                />
                <div className="text-left">
                  <span className="text-xs font-bold text-white block">Cohere-crawler</span>
                  <span className="text-[9px] text-slate-500 block">Cohere LLM Bot</span>
                </div>
              </label>

              <label className="flex items-center gap-3 p-3 bg-slate-950/60 rounded-xl border border-white/5 cursor-pointer hover:border-teal-500/25 transition-all">
                <input
                  type="checkbox"
                  checked={facebookBotAllowed}
                  onChange={(e) => setFacebookBotAllowed(e.target.checked)}
                  className="accent-teal-500 rounded"
                />
                <div className="text-left">
                  <span className="text-xs font-bold text-white block">FacebookBot</span>
                  <span className="text-[9px] text-slate-500 block">Meta Llama Agent</span>
                </div>
              </label>
            </div>
          </div>

          <div className="grid sm:grid-cols-2 gap-6">
            <div>
              <label htmlFor="disallow-paths" className="block text-xs font-bold text-slate-400 uppercase tracking-wide mb-1">
                Disallowed Paths (one per line)
              </label>
              <textarea
                id="disallow-paths"
                value={disallowPaths}
                onChange={(e) => setDisallowPaths(e.target.value)}
                placeholder="e.g. /api/"
                rows={4}
                className="w-full bg-slate-950 border border-white/10 rounded-xl px-4 py-2.5 text-xs font-mono focus:outline-none focus:border-teal-500 text-white"
              />
            </div>
            <div>
              <label htmlFor="allow-paths" className="block text-xs font-bold text-slate-400 uppercase tracking-wide mb-1">
                Allowed Paths (one per line)
              </label>
              <textarea
                id="allow-paths"
                value={allowPaths}
                onChange={(e) => setAllowPaths(e.target.value)}
                placeholder="e.g. /"
                rows={4}
                className="w-full bg-slate-950 border border-white/10 rounded-xl px-4 py-2.5 text-xs font-mono focus:outline-none focus:border-teal-500 text-white"
              />
            </div>
          </div>
        </div>

        {/* Preview Column - Visual Previews (5 cols) */}
        <div className="lg:col-span-5 flex flex-col">
          <div className="bg-slate-900/40 border border-white/10 rounded-3xl p-6 backdrop-blur-xl flex-1 flex flex-col">
            <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-4">AI Search Bot Visibility</h3>
            <div className="space-y-3 flex-1 overflow-y-auto min-h-[300px]">
              {[
                { name: "ChatGPT Search (OAI-Search)", allowed: chatgptUserAllowed },
                { name: "GPTBot (OpenAI Training)", allowed: gptBotAllowed },
                { name: "ClaudeBot (Anthropic)", allowed: claudeBotAllowed },
                { name: "Perplexity AI Crawler", allowed: perplexityBotAllowed },
                { name: "Google Gemini (Google-Extended)", allowed: googleExtendedAllowed },
                { name: "Apple Intelligence (Applebot)", allowed: applebotExtendedAllowed },
                { name: "Cohere AI Indexer", allowed: cohereCrawlerAllowed },
                { name: "Meta Llama (FacebookBot)", allowed: facebookBotAllowed },
              ].map((bot, i) => (
                <div key={i} className="flex justify-between items-center bg-slate-950/50 p-2.5 rounded-xl border border-white/5 text-xs">
                  <span className="text-slate-300 font-medium">{bot.name}</span>
                  <span className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold ${bot.allowed ? "bg-teal-500/10 text-teal-400 border border-teal-500/20" : "bg-rose-500/10 text-rose-400 border border-rose-500/20"}`}>
                    {bot.allowed ? "ALLOWED" : "BLOCKED"}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Section: Result (Code Box) stretching full width */}
      <div className="bg-slate-900/40 border border-white/10 rounded-3xl p-6 backdrop-blur-xl w-full">
        <div className="flex justify-between items-center mb-4">
          <div>
            <h3 className="text-sm font-bold text-white uppercase tracking-wider font-sans">Generated robots.txt</h3>
            <p className="text-[10px] text-slate-400 mt-0.5">Save this content exactly as a robots.txt file inside your website&apos;s root folder.</p>
          </div>
          <button
            onClick={handleCopy}
            className="text-xs font-bold px-4 py-2 rounded-xl bg-teal-500 text-white hover:bg-teal-400 transition-colors shadow-lg shadow-teal-500/10 cursor-pointer"
          >
            {copied ? "Copied!" : "Copy File"}
          </button>
        </div>
        <pre className="w-full bg-slate-950 border border-white/5 rounded-2xl p-4 overflow-x-auto text-xs font-mono text-slate-350 min-h-32">
          <code>{generatedTxt}</code>
        </pre>
      </div>
    </div>
  );
}
