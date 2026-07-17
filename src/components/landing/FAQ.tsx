"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

const faqs = [
  {
    q: "Is SEO Optimised actually free to start?",
    a: "Yes. You can sign up for a free account instantly—no credit card required—and receive 100.0 credits. This is enough to run audits on up to 50 pages. You can scan your site, inspect detailed issue-level reports, and view scores across all 15 audit modules entirely within the free credits quota.",
  },
  {
    q: "How does the pay-as-you-go credit model work?",
    a: "We charge purely based on usage, with no recurring monthly subscriptions or hidden lock-ins. First-time page scans consume 2.0 credits per page, while subsequent full website rescans cost 1.0 credit per page. Updating a single audit module (e.g. testing if you fixed a Schema issue) costs 1.0 credit per page scan. Flat credit top-ups start at just $2.50.",
  },
  {
    q: "What audit modules are included in a scan?",
    a: "SEO Optimised executes 15 specialized audits in parallel. This covers Core Web Vitals performance parameters, Schema JSON-LD structured data validation, content E-E-A-T indicators (Trust/Authority), AI & Search Engine Visibility factors (GEO), image optimization, sitemaps, link integrity, security headers, accessibility guidelines, mobile layouts, and international targeting.",
  },
  {
    q: "How is this different from Google Lighthouse?",
    a: "Lighthouse is great for local page performance and base accessibility. SEO Optimised goes deeper into search engine rank factors: we inspect your actual JSON-LD Schema structures, run crawls to detect broken internal links, analyze page copy for content E-E-A-T signals, target international search setups, and verify security headers—all run in parallel across your site's pages rather than a single local view.",
  },
  {
    q: "Can I audit competitor or client sites?",
    a: "Yes! Because SEO Optimised only requires a public URL to run, you do not need code access, DNS modifications, or tracker installations. You can scan competitors' sites to analyze their performance gaps, or scan prospective clients' sites to output high-value audit reports before pitch meetings.",
  },
  {
    q: "Do purchased credits expire?",
    a: "No. Any top-up credits you buy (Starter, Professional, or Agency packs) roll over forever. They remain in your account balance and will never expire, allowing you to scan pages whenever your dev cycle requires it.",
  },
  {
    q: "Can I export white-label reports for clients?",
    a: "Absolutely. All report summaries and full 15-module sheets are exportable as clean, client-ready documents. Agencies upgrading to our high-volume tiers can apply white-label branding, custom logos, and host audit reports on their own custom domains.",
  },
];

export function FAQ() {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  return (
    <section id="faq" className="relative py-20 sm:py-28 overflow-hidden">
      {/* ── Dynamic Luminous Aurora Background ── */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <motion.div
          animate={{
            x: [0, -60, 40, 0],
            y: [0, 40, -50, 0],
            scale: [1, 1.15, 0.85, 1],
          }}
          transition={{ duration: 19, repeat: Infinity, ease: "easeInOut" }}
          className="absolute top-1/3 right-[15%] w-[500px] h-[500px] rounded-full bg-gradient-to-tr from-cyan-500/35 via-teal-500/20 to-transparent blur-[120px]"
        />
        <motion.div
          animate={{
            x: [0, 50, -40, 0],
            y: [0, -50, 40, 0],
            scale: [1, 1.2, 0.9, 1],
          }}
          transition={{ duration: 23, repeat: Infinity, ease: "easeInOut" }}
          className="absolute bottom-1/3 left-[15%] w-[500px] h-[500px] rounded-full bg-gradient-to-bl from-indigo-500/35 via-purple-500/20 to-transparent blur-[120px]"
        />
      </div>

      {/* ── Cyber Matrix Dot Grid Overlay ── */}
      <div
        className="absolute inset-0 opacity-25 pointer-events-none"
        style={{
          backgroundImage: "radial-gradient(rgba(255, 255, 255, 0.08) 1px, transparent 1px)",
          backgroundSize: "24px 24px",
          maskImage: "radial-gradient(ellipse 90% 70% at 50% 50%, black 40%, transparent 100%)",
          WebkitMaskImage: "radial-gradient(ellipse 90% 70% at 50% 50%, black 40%, transparent 100%)",
        }}
      />

      {/* Top and bottom glow divider lines */}
      <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-teal-500/40 to-transparent pointer-events-none" />
      <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-indigo-500/40 to-transparent pointer-events-none" />

      <div className="relative max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.5 }}
          className="text-center mb-12 sm:mb-16"
        >
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-gradient-to-r from-teal-500/25 to-indigo-500/25 border border-teal-500/30 text-teal-400 text-xs font-bold uppercase tracking-wider mb-5 shadow-lg shadow-teal-500/10">
            Frequently Asked Questions
          </div>
          <h2 className="text-3xl sm:text-4xl font-black text-white tracking-tight mb-3 leading-tight">
            Questions you&apos;d <span className="gradient-text">actually ask</span>
          </h2>
          <p className="text-sm sm:text-base text-slate-300 font-medium leading-relaxed max-w-lg mx-auto">
            No &quot;How do I revolutionize my SEO strategy?&quot; fluff here. Straight technical and commercial answers.
          </p>
        </motion.div>

        {/* FAQ items Accordion list */}
        <div className="space-y-4 relative z-10">
          {faqs.map((faq, i) => {
            const isOpen = openIndex === i;
            return (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 10 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-30px" }}
                transition={{ duration: 0.3, delay: i * 0.05 }}
              >
                <button
                  onClick={() => setOpenIndex(isOpen ? null : i)}
                  className={`w-full flex items-center justify-between gap-4 px-6 py-5 rounded-2xl text-left border transition-all duration-350 cursor-pointer group backdrop-blur-xl ${
                    isOpen
                      ? "bg-slate-950/60 border-teal-500/30 shadow-[0_0_20px_rgba(20,184,166,0.06)]"
                      : "bg-slate-950/40 border-white/10 hover:border-teal-500/35 hover:bg-slate-900/40 shadow-lg"
                  }`}
                  aria-expanded={isOpen}
                >
                  <span className={`text-sm sm:text-base font-extrabold transition-colors duration-255 font-sans ${isOpen ? "text-teal-300" : "text-slate-100 group-hover:text-teal-400"}`}>
                    {faq.q}
                  </span>
                  <div className={`w-8 h-8 rounded-xl flex items-center justify-center border transition-all duration-350 shrink-0 ${
                    isOpen ? "bg-teal-500/20 border-teal-400/40 text-teal-300 rotate-45 shadow-[0_0_10px_rgba(20,184,166,0.3)]" : "bg-white/5 border-white/10 text-slate-400 group-hover:text-white"
                  }`}>
                    <svg
                      width="16"
                      height="16"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2.5"
                      strokeLinecap="round"
                    >
                      <line x1="12" y1="5" x2="12" y2="19" />
                      <line x1="5" y1="12" x2="19" y2="12" />
                    </svg>
                  </div>
                </button>
                <AnimatePresence>
                  {isOpen && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: "auto", opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.25, ease: "easeInOut" }}
                      className="overflow-hidden"
                    >
                      <div className="px-6 py-5 mt-2 rounded-2xl bg-slate-950/60 border-l-2 border-l-teal-500/40 border-y border-r border-white/5 text-xs sm:text-sm text-slate-350 leading-relaxed font-semibold shadow-inner">
                        {faq.a}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
