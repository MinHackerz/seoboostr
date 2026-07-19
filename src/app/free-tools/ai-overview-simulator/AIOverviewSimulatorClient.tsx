"use client";

import React, { useState } from "react";
import { motion } from "framer-motion";

interface Preset {
  name: string;
  query: string;
  aiResponse: string;
  siteName: string;
  siteUrl: string;
  cardTitle: string;
  cardImage: string;
  citableQuote: string;
}

const PRESETS: Preset[] = [
  {
    name: "SEO Audit Tool",
    query: "how to run parallel website seo audits",
    aiResponse: "Running parallel website SEO audits allows webmasters to analyze multiple technical factors simultaneously. Using platforms like SEO Optimised, you can inspect 18 modules (including Schema validations, Core Web Vitals, and E-E-A-T indicators) in parallel [1]. This dramatically reduces audit times compared to traditional, sequential scanners [2].",
    siteName: "SEO Optimised",
    siteUrl: "seoptimised.com",
    cardTitle: "SEO Optimised — 18-Module Parallel SEO Audit",
    cardImage: "/og-image.webp",
    citableQuote: "inspect 18 modules (including Schema validations, Core Web Vitals, and E-E-A-T indicators) in parallel"
  },
  {
    name: "Next.js App Router",
    query: "nextjs App Router layouts best practices",
    aiResponse: "In Next.js App Router, layouts should be kept nested to isolate page states. Creating nested layout.tsx files allows shared headers to persist [1]. Make sure that you optimize server metadata and canonical headers dynamically inside each route's page.tsx file to prevent search indexing conflicts [2].",
    siteName: "Next.js Guide",
    siteUrl: "nextjs.org/docs",
    cardTitle: "Optimizing Metadata & Layouts in App Router",
    cardImage: "/og-image.webp",
    citableQuote: "optimize server metadata and canonical headers dynamically inside each route's page.tsx file"
  },
  {
    name: "AI Search & llms.txt",
    query: "how to get cited in ChatGPT Search and Perplexity",
    aiResponse: "To secure citations in ChatGPT Search and Perplexity, webmasters should deploy an llms.txt standard Markdown file at their root directory [1]. This directory provides machine-readable site index structures that AI agent crawlers ingest with minimal context window overhead, boosting GEO visibility [2].",
    siteName: "LLM Indexing",
    siteUrl: "seoptimised.com/free-tools/llms-generator",
    cardTitle: "Sitemap-Driven LLMs.txt Generator for AI Search",
    cardImage: "/llms-og.webp",
    citableQuote: "deploy an llms.txt standard Markdown file at their root directory"
  }
];

export function AIOverviewSimulatorClient() {
  const [activePresetIndex, setActivePresetIndex] = useState<number>(0);
  
  // Inputs state
  const [query, setQuery] = useState(PRESETS[0].query);
  const [aiResponse, setAiResponse] = useState(PRESETS[0].aiResponse);
  const [siteName, setSiteName] = useState(PRESETS[0].siteName);
  const [siteUrl, setSiteUrl] = useState(PRESETS[0].siteUrl);
  const [cardTitle, setCardTitle] = useState(PRESETS[0].cardTitle);
  const [cardImage, setCardImage] = useState(PRESETS[0].cardImage);
  const [citableQuote, setCitableQuote] = useState(PRESETS[0].citableQuote);
  
  // UX Settings
  const [viewport, setViewport] = useState<"desktop" | "mobile">("desktop");
  const [highlightedCard, setHighlightedCard] = useState<number | null>(null);
  const [isCopied, setIsCopied] = useState(false);

  // Apply preset
  const handleApplyPreset = (index: number) => {
    setActivePresetIndex(index);
    const p = PRESETS[index];
    setQuery(p.query);
    setAiResponse(p.aiResponse);
    setSiteName(p.siteName);
    setSiteUrl(p.siteUrl);
    setCardTitle(p.cardTitle);
    setCardImage(p.cardImage);
    setCitableQuote(p.citableQuote);
  };

  // Extract clean hostname for display
  const getDisplayDomain = (urlStr: string) => {
    try {
      const clean = urlStr.replace(/^(https?:\/\/)?(www\.)?/, "");
      return clean.split("/")[0] || "domain.com";
    } catch {
      return "domain.com";
    }
  };

  const domain = getDisplayDomain(siteUrl);

  // Calculate dynamic SEO Metrics
  const titleScore = Math.max(0, 100 - Math.abs(cardTitle.length - 35) * 3);
  const quoteIncluded = aiResponse.toLowerCase().includes(citableQuote.toLowerCase()) && citableQuote.length > 0;
  const quoteScore = quoteIncluded ? 100 : 0;
  
  // Count stats/numbers/capitalized words as fact density proxy
  const getFactDensity = (text: string) => {
    if (!text) return 0;
    const matches = text.match(/\d+(\.\d+)?%?|[A-Z][a-z]+/g) || [];
    return Math.min(100, Math.round((matches.length / text.split(/\s+/).length) * 150));
  };
  const factScore = getFactDensity(aiResponse);
  const factsCount = (aiResponse.match(/\d+(\.\d+)?%?|[A-Z][a-z]+/g) || []).length;

  const geoScore = Math.round((titleScore * 0.3) + (quoteScore * 0.4) + (factScore * 0.3));

  // Render text segments with interactive citation links and highlights
  const renderAiResponse = () => {
    let text = aiResponse;
    if (!text) return <span>Please enter AI Summary text...</span>;

    // First replace the citable quote with a highlighted span if it exists
    if (quoteIncluded && citableQuote.trim() !== "") {
      const index = text.toLowerCase().indexOf(citableQuote.toLowerCase());
      if (index !== -1) {
        const originalQuote = text.substring(index, index + citableQuote.length);
        text = text.replace(
          originalQuote,
          `__HIGHLIGHT_START__${originalQuote}__HIGHLIGHT_END__`
        );
      }
    }

    // Split text into tokens to parse highlights and citations
    const parts = text.split(/(\[1\]|\[2\]|\[3\]|__HIGHLIGHT_START__|__HIGHLIGHT_END__)/g);
    let isHighlighted = false;

    return parts.map((part, index) => {
      if (part === "__HIGHLIGHT_START__") {
        isHighlighted = true;
        return null;
      }
      if (part === "__HIGHLIGHT_END__") {
        isHighlighted = false;
        return null;
      }

      if (part === "[1]") {
        return (
          <span
            key={index}
            onMouseEnter={() => setHighlightedCard(1)}
            onMouseLeave={() => setHighlightedCard(null)}
            className={`inline-flex items-center justify-center w-4.5 h-4.5 rounded-full text-[9px] font-black border transition-all cursor-pointer ml-1 select-none ${
              highlightedCard === 1
                ? "bg-emerald-500/20 text-emerald-400 border-emerald-500/40 shadow-sm shadow-emerald-500/10 scale-110"
                : "bg-white/5 text-slate-400 border-white/10 hover:border-emerald-500/30 hover:text-emerald-400"
            }`}
          >
            1
          </span>
        );
      }
      if (part === "[2]") {
        return (
          <span
            key={index}
            onMouseEnter={() => setHighlightedCard(2)}
            onMouseLeave={() => setHighlightedCard(null)}
            className={`inline-flex items-center justify-center w-4.5 h-4.5 rounded-full text-[9px] font-black border transition-all cursor-pointer ml-1 select-none ${
              highlightedCard === 2
                ? "bg-white/10 text-white border-white/20 scale-110"
                : "bg-white/5 text-slate-400 border-white/10"
            }`}
          >
            2
          </span>
        );
      }
      if (part === "[3]") {
        return (
          <span
            key={index}
            onMouseEnter={() => setHighlightedCard(3)}
            onMouseLeave={() => setHighlightedCard(null)}
            className={`inline-flex items-center justify-center w-4.5 h-4.5 rounded-full text-[9px] font-black border transition-all cursor-pointer ml-1 select-none ${
              highlightedCard === 3
                ? "bg-white/10 text-white border-white/20 scale-110"
                : "bg-white/5 text-slate-400 border-white/10"
            }`}
          >
            3
          </span>
        );
      }

      return (
        <span
          key={index}
          className={
            isHighlighted
              ? "bg-emerald-500/15 text-emerald-300 border-b border-dashed border-emerald-400/40 px-0.5 py-0.5 rounded-sm transition-all duration-300"
              : "transition-colors duration-300"
          }
        >
          {part}
        </span>
      );
    });
  };

  // Mock Copy Code
  const handleCopyLink = () => {
    navigator.clipboard.writeText(`https://seoptimised.com/free-tools/ai-overview-simulator?q=${encodeURIComponent(query)}`);
    setIsCopied(true);
    setTimeout(() => setIsCopied(false), 2000);
  };

  return (
    <div className="w-full relative font-sans">
      {/* Preset tabs */}
      <div className="flex flex-wrap items-center justify-center gap-2 mb-8 relative z-20">
        <span className="text-xs font-bold text-slate-400 uppercase tracking-wider mr-2">Presets:</span>
        {PRESETS.map((p, idx) => (
          <button
            key={p.name}
            type="button"
            onClick={() => handleApplyPreset(idx)}
            className={`px-4 py-2 text-xs font-bold rounded-xl border transition-all cursor-pointer ${
              activePresetIndex === idx
                ? "bg-emerald-500/10 border-emerald-500/40 text-emerald-400 shadow-md"
                : "bg-slate-900/40 border-white/5 text-slate-400 hover:border-white/10 hover:text-white"
            }`}
          >
            {p.name}
          </button>
        ))}
      </div>

      <div className="grid lg:grid-cols-12 gap-8 items-stretch relative z-10">
        
        {/* INPUTS COLUMN */}
        <div className="lg:col-span-6 flex flex-col gap-6">
          {/* Card 1: Search & AI Summary */}
          <div className="rounded-3xl border border-white/10 bg-slate-900/40 p-6 backdrop-blur-xl space-y-5">
            <h2 className="text-sm font-bold text-white uppercase tracking-wider border-b border-white/5 pb-3">
              AI Summary Engine
            </h2>

            {/* Search Query */}
            <div className="space-y-1.5">
              <label htmlFor="query-input" className="block text-[10px] font-bold text-slate-400 uppercase tracking-wide">
                Target Search Query
              </label>
              <input
                id="query-input"
                type="text"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="What are people searching for?"
                className="w-full px-4 py-3 bg-slate-950 border border-white/10 rounded-2xl text-xs text-white focus:outline-none focus:border-emerald-500/50 transition-colors font-medium shadow-inner"
              />
            </div>

            {/* AI Summary Text */}
            <div className="space-y-1.5">
              <div className="flex items-center justify-between">
                <label htmlFor="summary-input" className="block text-[10px] font-bold text-slate-400 uppercase tracking-wide">
                  AI Summary Output Text
                </label>
                <span className="text-[9px] text-slate-500 font-semibold uppercase tracking-wider">
                  Use [1] or [2] for citation anchors
                </span>
              </div>
              <textarea
                id="summary-input"
                rows={5}
                value={aiResponse}
                onChange={(e) => setAiResponse(e.target.value)}
                placeholder="Write the summary response that the AI Overview will display..."
                className="w-full px-4 py-3 bg-slate-950 border border-white/10 rounded-2xl text-xs text-white focus:outline-none focus:border-emerald-500/50 transition-colors font-medium shadow-inner resize-none leading-relaxed"
              />
            </div>
          </div>

          {/* Card 2: Citation Snippet Builder */}
          <div className="rounded-3xl border border-white/10 bg-slate-900/40 p-6 backdrop-blur-xl space-y-5 flex-1 flex flex-col">
            <h2 className="text-sm font-bold text-white uppercase tracking-wider border-b border-white/5 pb-3">
              Citation Snippet Builder
            </h2>

            {/* Site Name & Url */}
            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1.5">
                <label htmlFor="sitename-input" className="block text-[9px] font-bold text-slate-400 uppercase tracking-wide">
                  Brand / Site Name
                </label>
                <input
                  id="sitename-input"
                  type="text"
                  value={siteName}
                  onChange={(e) => setSiteName(e.target.value)}
                  className="w-full px-3.5 py-2.5 bg-slate-950 border border-white/10 rounded-xl text-xs text-white focus:outline-none focus:border-emerald-500/50"
                />
              </div>
              <div className="space-y-1.5">
                <label htmlFor="siteurl-input" className="block text-[9px] font-bold text-slate-400 uppercase tracking-wide">
                  Target URL
                </label>
                <input
                  id="siteurl-input"
                  type="text"
                  value={siteUrl}
                  onChange={(e) => setSiteUrl(e.target.value)}
                  className="w-full px-3.5 py-2.5 bg-slate-950 border border-white/10 rounded-xl text-xs text-white focus:outline-none focus:border-emerald-500/50"
                />
              </div>
            </div>

            {/* Card Title */}
            <div className="space-y-1.5">
              <div className="flex items-center justify-between">
                <label htmlFor="cardtitle-input" className="block text-[9px] font-bold text-slate-400 uppercase tracking-wide">
                  Citation Card Title
                </label>
                <span className={`text-[8px] font-black uppercase tracking-wider ${
                  cardTitle.length > 45 ? "text-amber-400" : "text-emerald-400"
                }`}>
                  {cardTitle.length} chars
                </span>
              </div>
              <input
                id="cardtitle-input"
                type="text"
                value={cardTitle}
                onChange={(e) => setCardTitle(e.target.value)}
                className="w-full px-3.5 py-2.5 bg-slate-950 border border-white/10 rounded-xl text-xs text-white focus:outline-none focus:border-emerald-500/50"
              />
            </div>

            {/* Card Image */}
            <div className="space-y-1.5">
              <label htmlFor="cardimage-input" className="block text-[9px] font-bold text-slate-400 uppercase tracking-wide">
                Image Path / URL (Thumbnail)
              </label>
              <input
                id="cardimage-input"
                type="text"
                value={cardImage}
                onChange={(e) => setCardImage(e.target.value)}
                className="w-full px-3.5 py-2.5 bg-slate-950 border border-white/10 rounded-xl text-xs text-white focus:outline-none focus:border-emerald-500/50 font-mono"
              />
            </div>

            {/* Citable Quote source text */}
            <div className="space-y-1.5">
              <label htmlFor="quote-input" className="block text-[10px] font-bold text-slate-400 uppercase tracking-wide">
                Target Source Quote (Text from your page)
              </label>
              <input
                id="quote-input"
                type="text"
                value={citableQuote}
                onChange={(e) => setCitableQuote(e.target.value)}
                placeholder="Paste the exact text block Google should cite..."
                className="w-full px-4 py-3 bg-slate-950 border border-white/10 rounded-2xl text-xs text-white focus:outline-none focus:border-emerald-500/50 transition-colors font-medium shadow-inner"
              />
            </div>
          </div>
        </div>

        {/* MOCK SERP PREVIEW & DIAGNOSTICS */}
        <div className="lg:col-span-6 flex flex-col">
          
          {/* SIMULATION CONTAINER */}
          <div className="rounded-3xl border border-white/10 bg-slate-900/40 p-6 backdrop-blur-xl space-y-5 flex-1 flex flex-col justify-between">
            
            {/* Viewport & Controls header */}
            <div className="flex items-center justify-between border-b border-white/5 pb-3">
              <div className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 shadow-sm animate-pulse-soft" />
                <h3 className="text-xs font-bold text-slate-300 uppercase tracking-wider">Live SERP Preview</h3>
              </div>
              <div className="flex items-center gap-1.5 p-0.5 rounded-xl bg-slate-950 border border-white/10">
                <button
                  type="button"
                  onClick={() => setViewport("desktop")}
                  className={`px-3 py-1.5 rounded-lg text-[10px] font-bold transition-all cursor-pointer flex items-center gap-1 ${
                    viewport === "desktop"
                      ? "bg-white/10 text-white shadow-xs"
                      : "text-slate-400 hover:text-white"
                  }`}
                >
                  <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                    <rect x="2" y="3" width="20" height="14" rx="2" ry="2" />
                    <line x1="8" y1="21" x2="16" y2="21" />
                    <line x1="12" y1="17" x2="12" y2="21" />
                  </svg>
                  Desktop
                </button>
                <button
                  type="button"
                  onClick={() => setViewport("mobile")}
                  className={`px-3 py-1.5 rounded-lg text-[10px] font-bold transition-all cursor-pointer flex items-center gap-1 ${
                    viewport === "mobile"
                      ? "bg-white/10 text-white shadow-xs"
                      : "text-slate-400 hover:text-white"
                  }`}
                >
                  <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                    <rect x="5" y="2" width="14" height="20" rx="2" ry="2" />
                    <line x1="12" y1="18" x2="12.01" y2="18" />
                  </svg>
                  Mobile
                </button>
              </div>
            </div>

            {/* MOCK GOOGLE WRAPPER */}
            <div className="w-full flex justify-center bg-slate-950 rounded-2xl border border-white/5 p-4 overflow-y-auto max-h-[500px] relative shadow-inner flex-1 flex flex-col justify-start">
              <div 
                className={`w-full max-w-full transition-all duration-300 font-sans ${
                  viewport === "mobile" ? "max-w-[360px] border-x border-white/10 px-2 py-4" : "max-w-[750px]"
                }`}
              >
                
                {/* Google Search Bar Simulation */}
                <div className="flex items-center gap-3 px-4.5 py-3 rounded-full bg-slate-900 border border-white/10 mb-5 shadow-xs">
                  <svg className="w-4 h-4 text-emerald-400 shrink-0" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
                    <circle cx="11" cy="11" r="8" />
                    <line x1="21" y1="21" x2="16.65" y2="16.65" />
                  </svg>
                  <div className="text-xs text-white truncate font-medium flex-1">
                    {query || "search query..."}
                  </div>
                  <svg className="w-4 h-4 text-slate-500 shrink-0" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                    <path d="M12 2a3 3 0 0 0-3 3v7a3 3 0 0 0 6 0V5a3 3 0 0 0-3-3z" />
                    <path d="M19 10v1a7 7 0 0 1-14 0v-1" />
                    <line x1="12" y1="19" x2="12" y2="22" />
                  </svg>
                </div>

                {/* SGE AI OVERVIEW BOX CONTAINER */}
                <div className="rounded-2xl border border-emerald-500/15 bg-gradient-to-b from-emerald-950/20 via-indigo-950/10 to-slate-950 p-5 relative shadow-md">
                  {/* SGE Box Ribbon Accent */}
                  <div className="absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-emerald-500/40 via-indigo-500/20 to-transparent rounded-full" />
                  
                  {/* Sparkle Header */}
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-2">
                      <svg className="w-4 h-4 text-emerald-400 animate-pulse-soft" viewBox="0 0 24 24" fill="currentColor">
                        <path d="M9 2l2.4 5.6L17 10l-5.6 2.4L9 18l-2.4-5.6L1 10l5.6-2.4zM19 12l1.2 2.8L23 16l-2.8 1.2L19 20l-1.2-2.8L15 16l2.8-1.2z" />
                      </svg>
                      <span className="text-[10px] font-black uppercase tracking-[0.08em] text-white">
                        AI Overview
                      </span>
                    </div>
                    <span className="text-[8px] font-bold text-slate-500 uppercase tracking-wider bg-white/5 border border-white/10 px-2 py-0.5 rounded-md">
                      Experimental
                    </span>
                  </div>

                  {/* Generated Summary Content */}
                  <div className="text-xs text-slate-200 leading-relaxed font-medium mb-5">
                    {renderAiResponse()}
                  </div>

                  {/* CAROUSEL CARDS GRID */}
                  <div className="space-y-2 border-t border-white/5 pt-4">
                    <div className="text-[9px] font-bold text-slate-450 uppercase tracking-wider mb-2 flex items-center gap-1 text-slate-400">
                      <svg className="w-3 h-3 text-emerald-400" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
                        <path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71" />
                        <path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71" />
                      </svg>
                      Cited Sources
                    </div>
                    
                    <div className={`grid gap-3 ${viewport === "mobile" ? "grid-cols-1" : "grid-cols-3"}`}>
                      
                      {/* USER CARD (SLOT 1) */}
                      <motion.div
                        className={`rounded-xl border bg-slate-900/60 overflow-hidden flex flex-col justify-between transition-all duration-300 ${
                          highlightedCard === 1
                            ? "border-emerald-500/60 bg-slate-900 shadow-md shadow-emerald-500/5 ring-1 ring-emerald-500/20 scale-[1.02]"
                            : "border-white/10 hover:border-white/15"
                        }`}
                        whileHover={{ y: -2 }}
                      >
                        <div className="w-full aspect-[16/10] bg-slate-950 overflow-hidden relative border-b border-white/5">
                          {cardImage ? (
                            <img
                              src={cardImage}
                              alt="Card Preview"
                              className="w-full h-full object-cover select-none pointer-events-none"
                              loading="lazy"
                              decoding="async"
                            />
                          ) : (
                            <div className="w-full h-full flex items-center justify-center text-[10px] text-slate-600 bg-slate-950 font-bold">
                              No Image
                            </div>
                          )}
                        </div>
                        <div className="p-2.5 space-y-1">
                          <div className="flex items-center gap-1">
                            <img
                              src={`https://www.google.com/s2/favicons?domain=${domain}&sz=32`}
                              alt=""
                              onError={(e) => {
                                e.currentTarget.style.display = "none";
                              }}
                              className="w-3.5 h-3.5 object-contain rounded-sm shrink-0"
                              width={14}
                              height={14}
                              loading="lazy"
                              decoding="async"
                            />
                            <span className="text-[8px] font-bold text-slate-400 truncate tracking-wide">
                              {siteName} • {domain}
                            </span>
                          </div>
                          <h4 className="text-[10px] font-extrabold text-white line-clamp-2 leading-tight">
                            {cardTitle || "Card Title"}
                          </h4>
                        </div>
                      </motion.div>

                      {/* DUMMY CARD 2 */}
                      <motion.div
                        className={`rounded-xl border bg-slate-900/60 overflow-hidden flex flex-col justify-between transition-all duration-300 ${
                          highlightedCard === 2 ? "border-white/30 bg-slate-900 shadow-md" : "border-white/10"
                        }`}
                        whileHover={{ y: -2 }}
                      >
                        <div className="w-full aspect-[16/10] bg-slate-950 overflow-hidden relative border-b border-white/5">
                          <img
                            src="/og-image.webp"
                            alt="Dummy 2"
                            className="w-full h-full object-cover select-none pointer-events-none grayscale opacity-30"
                            loading="lazy"
                            decoding="async"
                          />
                        </div>
                        <div className="p-2.5 space-y-1">
                          <div className="flex items-center gap-1">
                            <div className="w-3.5 h-3.5 rounded-sm bg-teal-500/10 border border-teal-500/20 flex items-center justify-center text-[7px] text-teal-400 font-bold">S</div>
                            <span className="text-[8px] font-bold text-slate-400 truncate tracking-wide">
                              SEO Guide • seomator.com
                            </span>
                          </div>
                          <h4 className="text-[10px] font-extrabold text-white line-clamp-2 leading-tight">
                            Generative Search Engine Optimization Fundamentals
                          </h4>
                        </div>
                      </motion.div>

                      {/* DUMMY CARD 3 */}
                      <motion.div
                        className={`rounded-xl border bg-slate-900/60 overflow-hidden flex flex-col justify-between transition-all duration-300 ${
                          highlightedCard === 3 ? "border-white/30 bg-slate-900 shadow-md" : "border-white/10"
                        }`}
                        whileHover={{ y: -2 }}
                      >
                        <div className="w-full aspect-[16/10] bg-slate-950 overflow-hidden relative border-b border-white/5">
                          <img
                            src="/llms-og.webp"
                            alt="Dummy 3"
                            className="w-full h-full object-cover select-none pointer-events-none grayscale opacity-30"
                            loading="lazy"
                            decoding="async"
                          />
                        </div>
                        <div className="p-2.5 space-y-1">
                          <div className="flex items-center gap-1">
                            <div className="w-3.5 h-3.5 rounded-sm bg-indigo-500/10 border border-indigo-500/20 flex items-center justify-center text-[7px] text-indigo-400 font-bold">A</div>
                            <span className="text-[8px] font-bold text-slate-400 truncate tracking-wide">
                              Agent Index • ahrefs.com
                            </span>
                          </div>
                          <h4 className="text-[10px] font-extrabold text-white line-clamp-2 leading-tight">
                            AI Overview Citation Carousel Tracking Strategy
                          </h4>
                        </div>
                      </motion.div>
                    </div>
                  </div>
                </div>

                {/* Simulated standard Organic Results */}
                <div className="mt-8 pt-6 border-t border-white/5 space-y-4">
                  <div className="space-y-1">
                    <span className="text-[10px] text-slate-400 block">{siteUrl}</span>
                    <h4 className="text-xs font-bold text-teal-400 hover:underline cursor-pointer">
                      {cardTitle}
                    </h4>
                    <p className="text-[10px] text-slate-300 leading-normal max-w-xl">
                      {aiResponse.replace(/\[\d+\]|__HIGHLIGHT_START__|__HIGHLIGHT_END__/g, "").substring(0, 150)}...
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Share / Copy simulator config */}
            <div className="flex justify-end gap-3 border-t border-white/5 pt-4">
              <button
                type="button"
                onClick={handleCopyLink}
                className="px-4 py-2 bg-emerald-500 hover:bg-emerald-400 text-white text-xs font-bold rounded-xl transition-all cursor-pointer flex items-center gap-1.5 shadow-md shadow-emerald-500/10 active:translate-y-0"
              >
                {isCopied ? (
                  <>
                    <svg className="w-3.5 h-3.5 text-white" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
                      <polyline points="20 6 9 17 4 12" />
                    </svg>
                    Copied Config URL!
                  </>
                ) : (
                  <>
                    <svg className="w-3.5 h-3.5 text-white" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                      <path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71" />
                      <path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71" />
                    </svg>
                    Copy Config Link
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* FULL WIDTH GEO DIAGNOSTIC ANALYSIS */}
      <div className="mt-10 rounded-3xl border border-white/10 bg-slate-900/40 p-8 backdrop-blur-xl space-y-8 relative z-10">
        <div className="flex flex-col md:flex-row md:items-center justify-between border-b border-white/5 pb-4 gap-4">
          <div>
            <h2 className="text-lg font-black text-white tracking-tight">
              GEO (Generative Engine Optimization) Diagnostic Analysis
            </h2>
            <p className="text-xs text-slate-400 mt-1 font-medium">
              Analyze how well your page snippet, media assets, and citations are prepared for retrieval-augmented generation (RAG) models.
            </p>
          </div>
          <div className="flex items-center gap-3 shrink-0">
            <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Overall GEO Index:</span>
            <div className={`px-4 py-1.5 rounded-full text-sm font-black border tracking-wide shadow-sm ${
              geoScore >= 80 
                ? "bg-emerald-500/10 text-emerald-400 border-emerald-500/25" 
                : geoScore >= 55 
                ? "bg-amber-500/10 text-amber-400 border-amber-500/25" 
                : "bg-red-500/10 text-red-400 border-red-500/25"
            }`}>
              {geoScore} / 100
            </div>
          </div>
        </div>

        {/* Detailed Metrics Panel */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch">
          {/* Circular Score Gauge & Explainer */}
          <div className="lg:col-span-4 flex flex-col items-center justify-center p-6 bg-slate-950/40 rounded-2xl border border-white/5 text-center space-y-4">
            <div className="relative w-28 h-28 flex items-center justify-center shrink-0">
              <svg className="w-full h-full transform -rotate-90" viewBox="0 0 100 100">
                <circle
                  cx="50"
                  cy="50"
                  r="40"
                  className="stroke-slate-800"
                  strokeWidth="8"
                  fill="transparent"
                />
                <circle
                  cx="50"
                  cy="50"
                  r="40"
                  className={`transition-all duration-500 ${
                    geoScore >= 80 ? "stroke-emerald-500" : geoScore >= 55 ? "stroke-amber-500" : "stroke-rose-500"
                  }`}
                  strokeWidth="8"
                  fill="transparent"
                  strokeDasharray={251.2}
                  strokeDashoffset={251.2 - (251.2 * geoScore) / 100}
                  strokeLinecap="round"
                />
              </svg>
              <div className="absolute text-center">
                <span className="text-2xl font-black text-white">{geoScore}</span>
                <span className="block text-[8px] font-bold text-slate-500 uppercase tracking-wider">Index</span>
              </div>
            </div>

            <div className="space-y-1">
              <h4 className="text-sm font-bold text-white leading-tight">
                {geoScore >= 80 
                  ? "Stellar Citation Ingestion Readiness" 
                  : geoScore >= 55 
                  ? "Moderate AI Ingestion Potential" 
                  : "Poor Factual Retrieval Alignment"}
              </h4>
              <p className="text-[11px] text-slate-400 leading-relaxed max-w-xs font-medium">
                {geoScore >= 80
                  ? "Your source content and preview metadata are highly optimized for AI agent crawlers (like ChatGPT, Perplexity). You have high chances of winning carousel spots."
                  : geoScore >= 55
                  ? "Your metadata fits well, but the summary response lacks exact citation alignment or has low factual density. Adjust your content quote alignment."
                  : "Significant optimization is required. Your title is either truncated, target quote is mismatched, or information density is insufficient."}
              </p>
            </div>
          </div>

          {/* 4-Item Breakdown Detail list */}
          <div className="lg:col-span-8 grid grid-cols-1 md:grid-cols-2 gap-4">
            
            {/* Metric 1: Title Fit */}
            <div className="p-4 rounded-2xl bg-slate-950/40 border border-white/5 flex flex-col justify-between space-y-3">
              <div className="flex items-start justify-between">
                <div className="space-y-1">
                  <h4 className="text-xs font-bold uppercase tracking-wider text-slate-350 text-slate-300">Citation Card Title Fit</h4>
                  <p className="text-[10px] text-slate-500 font-medium">Recommended: 25 - 45 characters</p>
                </div>
                <div className={`px-2 py-0.5 rounded-md text-[10px] font-black border uppercase ${
                  cardTitle.length >= 25 && cardTitle.length <= 45
                    ? "bg-emerald-500/10 text-emerald-400 border-emerald-500/25"
                    : "bg-amber-500/10 text-amber-400 border-amber-500/25"
                }`}>
                  {cardTitle.length} Chars
                </div>
              </div>
              <p className="text-[11px] text-slate-400 leading-relaxed font-medium">
                {cardTitle.length >= 25 && cardTitle.length <= 45
                  ? "Perfect length! Google will display your title in full without clipping or truncation."
                  : cardTitle.length > 45
                  ? "Warning: Title is too long. The trailing characters will be truncated inside SGE source cards."
                  : "Tip: Title is very short. Add descriptive context keywords to improve relevance and click-through rates."}
              </p>
              <div className="flex items-center justify-between text-[9px] font-bold border-t border-white/5 pt-2 text-slate-500">
                <span>Display Status: {cardTitle.length > 45 ? "Truncated" : "Full View"}</span>
                <span className="text-amber-400">Weight: 30%</span>
              </div>
            </div>

            {/* Metric 2: Citation Alignment */}
            <div className="p-4 rounded-2xl bg-slate-950/40 border border-white/5 flex flex-col justify-between space-y-3">
              <div className="flex items-start justify-between">
                <div className="space-y-1">
                  <h4 className="text-xs font-bold uppercase tracking-wider text-slate-350 text-slate-300">Source Quote Alignment</h4>
                  <p className="text-[10px] text-slate-500 font-medium">Verifies if quote is used in response</p>
                </div>
                <div className={`px-2 py-0.5 rounded-md text-[10px] font-black border uppercase ${
                  quoteIncluded
                    ? "bg-emerald-500/10 text-emerald-400 border-emerald-500/25"
                    : "bg-rose-500/10 text-rose-400 border-rose-500/25"
                }`}>
                  {quoteIncluded ? "Aligned" : "Mismatched"}
                </div>
              </div>
              <p className="text-[11px] text-slate-400 leading-relaxed font-medium">
                {quoteIncluded
                  ? "Verified! The target quote exists verbatim in the AI response text, ensuring clean citation reference mapping."
                  : "Mismatch: The citable source quote is missing from the AI Summary. Make sure the AI uses text from your page."}
              </p>
              <div className="flex items-center justify-between text-[9px] font-bold border-t border-white/5 pt-2 text-slate-500">
                <span>Quote Score: {quoteScore}/100</span>
                <span className="text-amber-400">Weight: 40%</span>
              </div>
            </div>

            {/* Metric 3: Fact Density */}
            <div className="p-4 rounded-2xl bg-slate-950/40 border border-white/5 flex flex-col justify-between space-y-3">
              <div className="flex items-start justify-between">
                <div className="space-y-1">
                  <h4 className="text-xs font-bold uppercase tracking-wider text-slate-350 text-slate-300">Factual Information Density</h4>
                  <p className="text-[10px] text-slate-500 font-medium">Entities, numbers & data points</p>
                </div>
                <div className={`px-2 py-0.5 rounded-md text-[10px] font-black border uppercase ${
                  factScore >= 45
                    ? "bg-emerald-500/10 text-emerald-400 border-emerald-500/25"
                    : "bg-amber-500/10 text-amber-400 border-amber-500/25"
                }`}>
                  {factScore}% Density
                </div>
              </div>
              <p className="text-[11px] text-slate-400 leading-relaxed font-medium">
                {factScore >= 45
                  ? "Stellar density! High percentage of specific metrics, numbers, and proper nouns detected in summary copy."
                  : "Low density: Add specific dates, percentages, counts, or measurements to help AI models trust your content."}
              </p>
              <div className="flex items-center justify-between text-[9px] font-bold border-t border-white/5 pt-2 text-slate-500">
                <span>Facts Count: {factsCount}</span>
                <span className="text-amber-400">Weight: 30%</span>
              </div>
            </div>

            {/* Metric 4: Image Thumbnail */}
            <div className="p-4 rounded-2xl bg-slate-950/40 border border-white/5 flex flex-col justify-between space-y-3">
              <div className="flex items-start justify-between">
                <div className="space-y-1">
                  <h4 className="text-xs font-bold uppercase tracking-wider text-slate-350 text-slate-300">Visual Thumbnail Quality</h4>
                  <p className="text-[10px] text-slate-500 font-medium">Image resolution & crop check</p>
                </div>
                <div className={`px-2 py-0.5 rounded-md text-[10px] font-black border uppercase ${
                  cardImage ? "bg-emerald-500/10 text-emerald-450 border-emerald-500/25" : "bg-rose-500/10 text-rose-450 border-rose-500/25"
                }`}>
                  {cardImage ? (cardImage.endsWith(".webp") ? "Optimized WebP" : "Needs WebP") : "No Image"}
                </div>
              </div>
              <p className="text-[11px] text-slate-400 leading-relaxed font-medium">
                {cardImage
                  ? (cardImage.endsWith(".webp")
                      ? "Great! WebP thumbnails load faster, avoiding citation load timeouts."
                      : "Warning: Consider using .webp format instead of png/jpg to decrease load times on search page widgets.")
                  : "Error: No image source defined. Google requires a valid thumbnail to display citation cards."}
              </p>
              <div className="flex items-center justify-between text-[9px] font-bold border-t border-white/5 pt-2 text-slate-500">
                <span>Format: {cardImage ? cardImage.split('.').pop()?.toUpperCase() : "N/A"}</span>
                <span className="text-amber-400">Weight: Pass/Fail</span>
              </div>
            </div>

          </div>
        </div>
      </div>
    </div>
  );
}
