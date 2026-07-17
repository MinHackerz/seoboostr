"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

const faqs = [
  {
    q: "Is this actually free?",
    a: "Yes. Run unlimited audits, see your overall score and partial results — no card, no trial expiry. The full 15-module report with issue-level detail is behind a free account. We make money when agencies upgrade for team features and API access, not from gating your first scan.",
  },
  {
    q: "What data do you store?",
    a: "The URL you submit, the audit results, and your account email if you sign up. We don't install trackers on your site, don't store your page content, and don't sell data. Audit results are tied to your account and deletable anytime.",
  },
  {
    q: "Can I run it on client sites?",
    a: "Absolutely. It only needs a public URL — no code access, no DNS changes, no JavaScript snippets. Run it on your clients' sites, competitors' sites, or that side project you haven't touched in months.",
  },
  {
    q: "How do automated AI Code Fixes work?",
    a: "When critical or high priority issues are found (such as missing schema tags or broken security headers), our AI system generates exact pull-request-ready code patches tailored specifically to your website's markup using your credits.",
  },
  {
    q: "How is this different from Lighthouse?",
    a: "Lighthouse covers performance and accessibility. SEOBoostr runs 15 modules in parallel — technical SEO, schema markup, content E-E-A-T analysis, AI/GEO visibility, security headers, accessibility, and more. You get a single, prioritized report instead of copy-pasting between five different tools.",
  },
  {
    q: "How fast is a scan?",
    a: "Most scans complete in 8-15 seconds. All 15 modules run simultaneously — we're not queuing sequential requests. Complex sites with many resources may take up to 30 seconds.",
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
          <h2 className="text-3xl sm:text-4xl font-black text-white tracking-tight mb-3">
            Questions you&apos;d <span className="gradient-text">actually ask</span>
          </h2>
          <p className="text-sm sm:text-base text-slate-300">
            No &quot;How do I revolutionize my SEO strategy?&quot; fluff here. Straight technical answers.
          </p>
        </motion.div>

        {/* FAQ items */}
        <div className="space-y-4">
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
                  className={`w-full flex items-center justify-between gap-4 px-6 py-5 rounded-2xl text-left border transition-all duration-300 cursor-pointer group backdrop-blur-xl ${
                    isOpen
                      ? "bg-white/10 border-teal-400/50 shadow-xl shadow-teal-500/15"
                      : "bg-white/5 border-white/15 hover:border-white/25 hover:bg-white/10 shadow-lg"
                  }`}
                  aria-expanded={isOpen}
                >
                  <span className="text-base font-bold text-slate-100 group-hover:text-teal-300 transition-colors">
                    {faq.q}
                  </span>
                  <div className={`w-8 h-8 rounded-xl flex items-center justify-center border transition-all duration-300 shrink-0 ${
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
                      transition={{ duration: 0.25 }}
                      className="overflow-hidden"
                    >
                      <div className="px-6 py-5 mt-2 rounded-2xl bg-slate-900/80 border border-white/10 text-sm sm:text-base text-slate-300 leading-relaxed shadow-inner font-medium">
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
