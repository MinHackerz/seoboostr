"use client";

import React, { useState, useMemo } from "react";

interface Preset {
  name: string;
  content: string;
}

const PRESETS: Preset[] = [
  {
    name: "AI-Ready Tech Page",
    content: "SEO Optimised is an automated software application that performs website checks. Running 18 technical audit modules simultaneously, it processes schema markups, Core Web Vitals, and E-E-A-T scores in under 5 seconds. In comparison, traditional crawlers take 4 minutes to run sequential audits. It uses a lightweight indexing structure that minimizes LLM parsing context window limits, boosting citations by 40% in Perplexity search engines."
  },
  {
    name: "Corporate Marketing",
    content: "Our company believes in creating incredible products that will revolutionise the digital space. We strive for excellence in everything we do, working hard to deliver values that our clients love. Our team is passionate about building solutions that bridge gaps and create synergies across diverse industries. We are dedicated to providing state-of-the-art services that will wow you at first glance, establishing an innovative future."
  },
  {
    name: "Casual Blog post",
    content: "Hey everyone, welcome back to my blog! Today, I really want to talk about how you can improve your search engine rankings. Honestly, it is super easy once you get the hang of it. You just need to write good stuff and post regularly. Let me know what you think in the comments, and don't forget to like and subscribe for more awesome tips and tricks!"
  }
];

// List of conversational filler tokens to highlight
const FILLER_WORDS = new Set([
  "hey", "welcome", "back", "blog", "really", "want", "talk", "honestly", "super", 
  "easy", "stuff", "awesome", "tips", "tricks", "just", "simply", "basically",
  "actually", "like", "subscribe", "incredible", "excellence", "passionate", 
  "revolutionise", "synergies", "wow", "innovative", "value", "clients", "love"
]);

export function GeoGraderClient() {
  const [activePresetIndex, setActivePresetIndex] = useState<number>(0);
  const [content, setContent] = useState<string>(PRESETS[0].content);
  const [url, setUrl] = useState<string>("");
  const [loadingUrl, setLoadingUrl] = useState<boolean>(false);
  const [urlError, setUrlError] = useState<string | null>(null);

  // Apply preset
  const handleApplyPreset = (index: number) => {
    setActivePresetIndex(index);
    setContent(PRESETS[index].content);
  };

  // Fetch URL content
  const handleFetchUrl = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!url.trim()) return;

    setLoadingUrl(true);
    setUrlError(null);

    try {
      const response = await fetch("/api/free-tools/extract-url", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ url: url.trim() }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Failed to extract text from URL");
      }

      setContent(data.text);
      setActivePresetIndex(-1); // Deselect presets
      setUrlError(null);
    } catch (err) {
      setUrlError(err instanceof Error ? err.message : "An unexpected error occurred");
    } finally {
      setLoadingUrl(false);
    }
  };

  // Word count stats
  const wordCount = useMemo(() => {
    if (!content.trim()) return 0;
    return content.trim().split(/\s+/).length;
  }, [content]);

  const readTimeSeconds = useMemo(() => {
    // Approx 200 words per minute -> 3.3 words per second
    return Math.max(1, Math.round(wordCount / 3.3));
  }, [wordCount]);

  // Scoring Metrics Calculations
  const analysis = useMemo(() => {
    if (!content.trim()) {
      return {
        factScore: 0,
        formattingScore: 0,
        directAnswerScore: 0,
        overallScore: 0,
        factsCount: 0,
        fillerCount: 0
      };
    }

    const words = content.trim().split(/\s+/);
    
    // 1. Fact Density Analysis
    // Detect numbers, percentages, dates, capitalized proper nouns (excluding first word of sentences)
    let factsCount = 0;
    words.forEach((word, idx) => {
      // Clean word
      const clean = word.replace(/[.,\/#!$%\^&\*;:{}=\-_`~()]/g, "");
      
      // Numbers, percentages, decimals
      if (/\d+/.test(clean)) {
        factsCount++;
      }
      // Capitalized words (proper nouns/entities) not at index 0 and not preceded by period
      else if (idx > 0 && /^[A-Z]/.test(clean)) {
        const prevWord = words[idx - 1];
        if (!prevWord.endsWith(".") && !prevWord.endsWith("?") && !prevWord.endsWith("!")) {
          factsCount++;
        }
      }
    });

    const factRatio = wordCount > 0 ? (factsCount / wordCount) : 0;
    const factScore = Math.min(100, Math.round(factRatio * 320));

    // 2. RAG Formatting Score
    // Scrapes for lists, tables, headers, bold text, and paragraph chunk sizes
    let formatScoreValue = 0;
    const paragraphs = content.split(/\n+/).filter(p => p.trim().length > 0);
    
    // Check if bullets/lists exist
    const hasLists = /^\s*[-*•\d+\.]/m.test(content);
    if (hasLists) formatScoreValue += 25;
    
    // Check if headings exist (hash marks or short lines in caps)
    const hasHeadings = /^#+/m.test(content) || paragraphs.some(p => p.length < 60 && p === p.toUpperCase() && p.length > 3);
    if (hasHeadings) formatScoreValue += 25;

    // Check if bold/italics are used for keyword emphasis
    const hasEmphasis = /(\*\*|__|\*|_)[^*_]+\1/.test(content);
    if (hasEmphasis) formatScoreValue += 25;

    // Paragraph chunk sizes: RAG crawlers prefer shorter chunks (<300 chars)
    const allShortParagraphs = paragraphs.length > 0 && paragraphs.every(p => p.length < 350);
    if (allShortParagraphs || paragraphs.length >= 2) formatScoreValue += 25;
    
    // Fallback minimum for basic structure
    const formattingScore = Math.max(20, formatScoreValue);

    // 3. Direct Answer Proximity
    // Checks for clear declarative headers and semantic definitions
    let directScoreValue = 15;
    
    // Triggers of direct definition
    const definitionTriggers = ["is a", "refers to", "defines", "represents", "means", "are defined as", "occurs when", "allows you to", "performs"];
    const triggerMatches = definitionTriggers.filter(trigger => content.toLowerCase().includes(trigger));
    directScoreValue += Math.min(45, triggerMatches.length * 15);

    // Question-Answer formats
    const hasQuestions = /\?/.test(content);
    if (hasQuestions) directScoreValue += 20;

    // Front-loaded main subject (entity definition in the first 20 words)
    const first20 = words.slice(0, 20).join(" ").toLowerCase();
    const hasFirst20Trigger = definitionTriggers.some(t => first20.includes(t));
    if (hasFirst20Trigger) directScoreValue += 20;

    const directAnswerScore = Math.min(100, directScoreValue);

    // Filler count
    let fillerCount = 0;
    words.forEach(w => {
      const clean = w.toLowerCase().replace(/[.,\/#!$%\^&\*;:{}=\-_`~()]/g, "");
      if (FILLER_WORDS.has(clean)) {
        fillerCount++;
      }
    });

    // Overall GEO Score
    const overallScore = Math.round((factScore * 0.3) + (formattingScore * 0.3) + (directAnswerScore * 0.4));

    return {
      factScore,
      formattingScore,
      directAnswerScore,
      overallScore,
      factsCount,
      fillerCount
    };
  }, [content, wordCount]);

  // Highlighted Preview rendering
  const renderHighlightedContent = () => {
    if (!content.trim()) return <span className="text-slate-500">Highlighted analysis will show up here...</span>;

    const words = content.split(/(\s+)/); // Preserve spaces
    return words.map((word, idx) => {
      if (/^\s+$/.test(word)) return word; // Return spaces directly

      const clean = word.toLowerCase().replace(/[.,\/#!$%\^&\*;:{}=\-_`~()]/g, "");
      const isWordCapitalized = /^[A-Z]/.test(word.replace(/[.,\/#!$%\^&\*;:{}=\-_`~()]/g, ""));
      
      // Determine if fact/entity (numbers or non-sentence-start capitalized word)
      const isNumber = /\d+/.test(clean);
      const isProperNoun = idx > 0 && isWordCapitalized && !words[idx - 2]?.endsWith(".") && !words[idx - 2]?.endsWith("?") && !words[idx - 2]?.endsWith("!");
      const isFact = isNumber || isProperNoun;

      // Determine if conversational filler
      const isFiller = FILLER_WORDS.has(clean);

      if (isFact) {
        return (
          <span
            key={idx}
            className="bg-emerald-500/15 text-emerald-300 border-b border-emerald-500/30 px-1 py-0.5 rounded-sm font-semibold inline-block"
            title="Entity/Fact: High AI Citation Weight"
          >
            {word}
          </span>
        );
      }

      if (isFiller) {
        return (
          <span
            key={idx}
            className="bg-red-500/10 text-red-300 border-b border-red-500/20 px-1 py-0.5 rounded-sm inline-block"
            title="Conversational Filler: Reduces Fact Density"
          >
            {word}
          </span>
        );
      }

      return <span key={idx}>{word}</span>;
    });
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
                ? "bg-amber-500/10 border-amber-500/40 text-amber-400 shadow-md"
                : "bg-slate-900/40 border-white/5 text-slate-400 hover:border-white/10 hover:text-white"
            }`}
          >
            {p.name}
          </button>
        ))}
      </div>

      <div className="grid lg:grid-cols-12 gap-8 items-start relative z-10">
        
        {/* INPUTS / EDITOR PANEL */}
        <div className="lg:col-span-6 space-y-6">
          <div className="rounded-3xl border border-white/10 bg-slate-900/40 p-6 backdrop-blur-xl space-y-5">
            <div className="flex items-center justify-between border-b border-white/5 pb-3">
              <h2 className="text-sm font-bold text-white uppercase tracking-wider">
                Copy Editor
              </h2>
              <div className="flex gap-4 text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                <span>{wordCount} words</span>
                <span>{readTimeSeconds}s Read</span>
              </div>
            </div>

            {/* Fetch URL form */}
            <form onSubmit={handleFetchUrl} className="space-y-2 border-b border-white/5 pb-5">
              <label htmlFor="geo-url" className="block text-[10px] font-bold text-slate-400 uppercase tracking-wide">
                Fetch and Grade Webpage URL
              </label>
              <div className="flex gap-2">
                <input
                  id="geo-url"
                  type="text"
                  placeholder="https://example.com/blog-post"
                  value={url}
                  onChange={(e) => setUrl(e.target.value)}
                  disabled={loadingUrl}
                  className="flex-grow px-4 py-2.5 bg-slate-950 border border-white/10 rounded-2xl text-xs text-white focus:outline-none focus:border-amber-500/50 transition-colors font-medium"
                />
                <button
                  type="submit"
                  disabled={loadingUrl || !url.trim()}
                  className="px-4 py-2.5 bg-amber-500 hover:bg-amber-400 disabled:bg-amber-500/40 text-slate-950 font-bold rounded-2xl text-xs tracking-wide uppercase transition-all shadow-md cursor-pointer disabled:cursor-not-allowed shrink-0 flex items-center gap-1.5"
                >
                  {loadingUrl ? (
                    <>
                      <svg className="animate-spin h-3.5 w-3.5 text-slate-950" viewBox="0 0 24 24" fill="none">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                      </svg>
                      <span>Fetching...</span>
                    </>
                  ) : (
                    <span>Analyze URL</span>
                  )}
                </button>
              </div>
              {urlError && (
                <p className="text-[10px] font-semibold text-rose-400 pl-1">{urlError}</p>
              )}
            </form>

            <div className="space-y-1.5">
              <label htmlFor="geo-editor" className="block text-[10px] font-bold text-slate-400 uppercase tracking-wide">
                Paste Content Block
              </label>
              <textarea
                id="geo-editor"
                rows={12}
                value={content}
                onChange={(e) => setContent(e.target.value)}
                placeholder="Enter or paste your text copy here to calculate generative scores..."
                className="w-full px-4 py-3 bg-slate-950 border border-white/10 rounded-2xl text-xs text-white focus:outline-none focus:border-amber-500/50 transition-colors font-medium shadow-inner resize-none leading-relaxed"
              />
            </div>
          </div>

          {/* HIGHLIGHTED COPY VISUALIZER */}
          <div className="rounded-3xl border border-white/10 bg-slate-900/40 p-6 backdrop-blur-xl space-y-4">
            <h3 className="text-xs font-bold text-slate-350 uppercase tracking-wider border-b border-white/5 pb-2">
              Entity & Filler Highlight visualizer
            </h3>
            <div className="flex gap-4 text-[9px] font-bold uppercase tracking-wider">
              <div className="flex items-center gap-1.5">
                <span className="w-2.5 h-2.5 rounded-sm bg-emerald-500/20 border border-emerald-500/30" />
                <span className="text-emerald-400">Facts & Entities ({analysis.factsCount})</span>
              </div>
              <div className="flex items-center gap-1.5">
                <span className="w-2.5 h-2.5 rounded-sm bg-red-500/20 border border-red-500/30" />
                <span className="text-red-400">Filler Copy ({analysis.fillerCount})</span>
              </div>
            </div>
            <div className="w-full p-5 rounded-2xl bg-slate-950 border border-white/5 text-slate-200 text-xs leading-relaxed max-h-[220px] overflow-y-auto whitespace-pre-wrap font-medium">
              {renderHighlightedContent()}
            </div>
          </div>
        </div>

        {/* ANALYSIS & DIAGNOSTICS */}
        <div className="lg:col-span-6 space-y-6">
          
          {/* OVERALL SCORE PANEL */}
          <div className="rounded-3xl border border-white/10 bg-slate-900/40 p-6 backdrop-blur-xl space-y-5">
            <div className="flex items-center justify-between border-b border-white/5 pb-3">
              <div className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-amber-500 shadow-sm animate-pulse-soft" />
                <h3 className="text-xs font-bold text-slate-300 uppercase tracking-wider">GEO Readiness Index</h3>
              </div>
              <span className="text-[10px] font-extrabold uppercase tracking-wide text-amber-400">Live Scorer</span>
            </div>

            {/* Main Score Layout */}
            <div className="flex flex-col sm:flex-row items-center gap-6 py-4">
              {/* Radial Score Gauge */}
              <div className="relative w-28 h-28 flex items-center justify-center shrink-0">
                <svg className="w-full h-full transform -rotate-90" viewBox="0 0 100 100">
                  {/* Background Track */}
                  <circle
                    cx="50"
                    cy="50"
                    r="40"
                    className="stroke-slate-800"
                    strokeWidth="8"
                    fill="transparent"
                  />
                  {/* Progress Line */}
                  <circle
                    cx="50"
                    cy="50"
                    r="40"
                    className="stroke-amber-500 transition-all duration-500"
                    strokeWidth="8"
                    fill="transparent"
                    strokeDasharray={251.2}
                    strokeDashoffset={251.2 - (251.2 * analysis.overallScore) / 100}
                    strokeLinecap="round"
                  />
                </svg>
                <div className="absolute text-center">
                  <span className="text-2xl font-black text-white">{analysis.overallScore}</span>
                  <span className="block text-[8px] font-bold text-slate-500 uppercase tracking-wider">Score</span>
                </div>
              </div>

              {/* Explainer / Metric description */}
              <div className="space-y-2">
                <h4 className="text-sm font-bold text-white leading-tight">
                  {analysis.overallScore >= 80 
                    ? "Highly Citation-Ready Content" 
                    : analysis.overallScore >= 55 
                    ? "Medium AI Optimization Status" 
                    : "Low Factual Ingestion Potential"}
                </h4>
                <p className="text-[11px] text-slate-400 leading-relaxed font-medium">
                  {analysis.overallScore >= 80
                    ? "Your copy features stellar data density and structured formatting. AI crawlers like ChatGPT and Perplexity can easily ingest and reference this text chunk."
                    : analysis.overallScore >= 55
                    ? "The content has good foundation but contains conversational filler. Add quantitative numbers, statistics, and headers to secure higher citation shares."
                    : "Your text is heavy on marketing adjectives and light on details. LLMs are highly likely to overlook this chunk during generative search ingestion."}
                </p>
              </div>
            </div>

            {/* Breakdown progress bars */}
            <div className="space-y-4 border-t border-white/5 pt-5">
              <h4 className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Score Attributes</h4>
              
              {/* Fact Density Bar */}
              <div className="space-y-1">
                <div className="flex justify-between text-xs font-bold">
                  <span className="text-slate-300">Factual Density Index</span>
                  <span className="text-amber-400">{analysis.factScore}%</span>
                </div>
                <div className="w-full h-2 rounded-full bg-slate-950 overflow-hidden border border-white/5">
                  <div 
                    className="h-full bg-amber-500 rounded-full transition-all duration-500"
                    style={{ width: `${analysis.factScore}%` }}
                  />
                </div>
              </div>

              {/* Formatting Bar */}
              <div className="space-y-1">
                <div className="flex justify-between text-xs font-bold">
                  <span className="text-slate-300">RAG Chunk Formatting</span>
                  <span className="text-amber-400">{analysis.formattingScore}%</span>
                </div>
                <div className="w-full h-2 rounded-full bg-slate-950 overflow-hidden border border-white/5">
                  <div 
                    className="h-full bg-amber-500 rounded-full transition-all duration-500"
                    style={{ width: `${analysis.formattingScore}%` }}
                  />
                </div>
              </div>

              {/* Direct Answer Bar */}
              <div className="space-y-1">
                <div className="flex justify-between text-xs font-bold">
                  <span className="text-slate-300">Direct Answer Alignment</span>
                  <span className="text-amber-400">{analysis.directAnswerScore}%</span>
                </div>
                <div className="w-full h-2 rounded-full bg-slate-950 overflow-hidden border border-white/5">
                  <div 
                    className="h-full bg-amber-500 rounded-full transition-all duration-500"
                    style={{ width: `${analysis.directAnswerScore}%` }}
                  />
                </div>
              </div>
            </div>
          </div>

          {/* ACTIONABLE RECOMMENDATIONS CARD */}
          <div className="rounded-3xl border border-white/10 bg-slate-900/40 p-6 backdrop-blur-xl space-y-5">
            <h2 className="text-xs font-bold text-white uppercase tracking-wider border-b border-white/5 pb-3">
              Actionable GEO Recommendations
            </h2>

            <div className="space-y-4">
              {/* Recommendation 1: Fact Density */}
              <div className="flex items-start gap-3 p-3 rounded-2xl bg-slate-950/40 border border-white/5">
                <div className="shrink-0 mt-0.5">
                  {analysis.factScore >= 60 ? (
                    <div className="w-5 h-5 rounded-full bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400 font-bold text-xs">✓</div>
                  ) : (
                    <div className="w-5 h-5 rounded-full bg-amber-500/10 border border-amber-500/20 flex items-center justify-center text-amber-400 font-bold text-xs">!</div>
                  )}
                </div>
                <div className="space-y-1">
                  <h4 className="text-xs font-bold text-white leading-tight">Increase Quantitative Data</h4>
                  <p className="text-[11px] text-slate-400 leading-relaxed">
                    {analysis.factScore >= 60
                      ? "Stellar factual density. Keep providing specific numbers, entities, and measurements."
                      : "Add specific percentages, counts, metrics, or years. Instead of saying 'highly fast audits', write 'audits that complete in 4.5 seconds'."}
                  </p>
                </div>
              </div>

              {/* Recommendation 2: Structure / formatting */}
              <div className="flex items-start gap-3 p-3 rounded-2xl bg-slate-950/40 border border-white/5">
                <div className="shrink-0 mt-0.5">
                  {analysis.formattingScore >= 75 ? (
                    <div className="w-5 h-5 rounded-full bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400 font-bold text-xs">✓</div>
                  ) : (
                    <div className="w-5 h-5 rounded-full bg-amber-500/10 border border-amber-500/20 flex items-center justify-center text-amber-400 font-bold text-xs">!</div>
                  )}
                </div>
                <div className="space-y-1">
                  <h4 className="text-xs font-bold text-white leading-tight">Deploy Structural Markup</h4>
                  <p className="text-[11px] text-slate-400 leading-relaxed">
                    {analysis.formattingScore >= 75
                      ? "Excellent chunk formatting. Structured paragraphs will parse neatly in model contexts."
                      : "Break up long texts. Use Markdown headings (##), bulleted lists, and bold key terms to make chunks easy for AI spiders to reference."}
                  </p>
                </div>
              </div>

              {/* Recommendation 3: Direct Answer syntax */}
              <div className="flex items-start gap-3 p-3 rounded-2xl bg-slate-950/40 border border-white/5">
                <div className="shrink-0 mt-0.5">
                  {analysis.directAnswerScore >= 70 ? (
                    <div className="w-5 h-5 rounded-full bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400 font-bold text-xs">✓</div>
                  ) : (
                    <div className="w-5 h-5 rounded-full bg-amber-500/10 border border-amber-500/20 flex items-center justify-center text-amber-400 font-bold text-xs">!</div>
                  )}
                </div>
                <div className="space-y-1">
                  <h4 className="text-xs font-bold text-white leading-tight">Align Semantic Definition Sentences</h4>
                  <p className="text-[11px] text-slate-400 leading-relaxed">
                    {analysis.directAnswerScore >= 70
                      ? "Great direct answers detected! Models will pull these quotes easily to synthesize responses."
                      : "Open your core paragraph sections with clear semantic linking tags, such as 'X is a...' or 'Y refers to...' right after your headers."}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
