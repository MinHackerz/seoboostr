"use client";

import Link from "next/link";

const TOOLS = [
  {
    name: "Meta Tag Generator",
    desc: "Generate search & social meta tags to optimize link previews.",
    href: "/free-tools/meta-tag-generator",
    icon: (
      <svg className="w-5.5 h-5.5 text-teal-400" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" d="M7 20l4-16m2 16l4-16M6 9h14M4 15h14" />
      </svg>
    ),
    color: "group-hover:border-teal-500/30 group-hover:shadow-[0_0_20px_rgba(20,184,166,0.05)]",
  },
  {
    name: "Robots.txt Builder",
    desc: "Generate crawler directives and protect directory pathways.",
    href: "/free-tools/robots-generator",
    icon: (
      <svg className="w-5.5 h-5.5 text-indigo-400" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4" />
      </svg>
    ),
    color: "group-hover:border-indigo-500/30 group-hover:shadow-[0_0_20px_rgba(99,102,241,0.05)]",
  },
  {
    name: "LLMs.txt Generator",
    desc: "Create indexable summaries designed to guide AI agents.",
    href: "/free-tools/llms-generator",
    icon: (
      <svg className="w-5.5 h-5.5 text-pink-400" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
      </svg>
    ),
    color: "group-hover:border-pink-500/30 group-hover:shadow-[0_0_20px_rgba(244,63,94,0.05)]",
  },
  {
    name: "AI Overview Simulator",
    desc: "Preview how your site appears in Google AI Search modules.",
    href: "/free-tools/ai-overview-simulator",
    icon: (
      <svg className="w-5.5 h-5.5 text-amber-400" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
      </svg>
    ),
    color: "group-hover:border-amber-500/30 group-hover:shadow-[0_0_20px_rgba(245,158,11,0.05)]",
  },
  {
    name: "GEO Grader",
    desc: "Score and optimize fact density for AI model extraction.",
    href: "/free-tools/geo-grader",
    icon: (
      <svg className="w-5.5 h-5.5 text-sky-400" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 002 2h2a2 2 0 002-2z" />
      </svg>
    ),
    color: "group-hover:border-sky-500/30 group-hover:shadow-[0_0_20px_rgba(56,189,248,0.05)]",
  },
  {
    name: "Crawler Checker",
    desc: "Verify if search engine spiders can access your server files.",
    href: "/free-tools/crawler-checker",
    icon: (
      <svg className="w-5.5 h-5.5 text-violet-400" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
      </svg>
    ),
    color: "group-hover:border-violet-500/30 group-hover:shadow-[0_0_20px_rgba(139,92,246,0.05)]",
  },
];

export function FreeToolbox() {
  return (
    <section className="relative py-20 sm:py-28 overflow-hidden bg-gradient-to-b from-slate-950 via-[#0b1329] to-slate-950">
      {/* Premium Glow Meshes & Radial Spotlights */}
      <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-teal-500/40 to-transparent pointer-events-none" />
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[1000px] h-[500px] bg-[radial-gradient(ellipse_at_top,rgba(20,184,166,0.15),transparent_65%)] pointer-events-none" />
      <div className="absolute top-1/4 -left-40 w-[600px] h-[600px] bg-[radial-gradient(circle_400px_at_center,rgba(99,102,241,0.12),transparent)] pointer-events-none" />
      <div className="absolute bottom-0 -right-40 w-[600px] h-[600px] bg-[radial-gradient(circle_400px_at_center,rgba(244,63,94,0.08),transparent)] pointer-events-none" />

      <div className="relative max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header Block */}
        <div className="text-center mb-16 max-w-2xl mx-auto">
          <span className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-teal-500/10 border border-teal-500/25 text-teal-400 text-[10px] font-bold uppercase tracking-wider mb-5">
            Free Link Magnets
          </span>
          <h2 className="text-3xl sm:text-4xl font-black text-white tracking-tight mb-3">
            Explore our <span className="gradient-text">Free SEO Toolbox</span>
          </h2>
          <p className="text-slate-350 text-xs sm:text-sm leading-relaxed font-medium">
            Access lightweight, high-performance generators to inspect meta tags, indexation instructions, and build compliant robots.txt rules instantly.
          </p>
        </div>

        {/* Tools Interactive Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 relative z-10">
          {TOOLS.map((tool) => (
            <Link
              href={tool.href}
              key={tool.name}
              className="group block relative rounded-3xl border border-white/5 bg-slate-900/20 p-6 backdrop-blur-2xl transition-all duration-300 hover:border-white/10"
            >
              {/* Internal Accent Glow overlay */}
              <div className={`absolute inset-0 rounded-3xl border border-transparent transition-all duration-300 ${tool.color}`} />

              <div className="relative z-10 flex flex-col justify-between h-full space-y-4">
                <div className="space-y-3">
                  <div className="w-10 h-10 rounded-xl bg-white/5 flex items-center justify-center border border-white/10 group-hover:bg-white/10 group-hover:scale-105 transition-all">
                    {tool.icon}
                  </div>
                  <h3 className="text-sm font-bold text-white leading-tight group-hover:text-teal-300 transition-colors">
                    {tool.name}
                  </h3>
                  <p className="text-slate-450 text-[11.5px] leading-relaxed font-semibold">
                    {tool.desc}
                  </p>
                </div>
                
                <span className="text-[10px] font-extrabold text-teal-400 group-hover:text-teal-300 transition-colors flex items-center gap-1">
                  Open Tool
                  <svg xmlns="http://www.w3.org/2000/svg" width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" className="transform group-hover:translate-x-0.5 transition-transform"><polyline points="9 18 15 12 9 6"/></svg>
                </span>
              </div>
            </Link>
          ))}
        </div>

        {/* Bottom CTA Block */}
        <div className="mt-14 text-center relative z-10">
          <Link
            href="/free-tools"
            className="inline-flex items-center justify-center px-8 py-4 rounded-2xl bg-teal-500 hover:bg-teal-400 text-white font-extrabold text-xs shadow-xl shadow-teal-500/20 hover:shadow-teal-500/35 hover:-translate-y-0.5 active:translate-y-0 transition-all duration-200"
          >
            Open Toolbox Hub
          </Link>
        </div>
      </div>
    </section>
  );
}
