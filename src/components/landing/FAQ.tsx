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
    q: "API access?",
    a: "Coming soon. The API will let you run audits programmatically, integrate with CI/CD pipelines, and build custom dashboards. Join the waitlist in your account settings.",
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
    <section id="faq" className="relative py-20 sm:py-28 bg-white">
      <div className="relative max-w-2xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.5 }}
          className="text-center mb-10 sm:mb-14"
        >
          <h2 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight mb-3">
            Questions you&apos;d actually ask
          </h2>
          <p className="text-sm text-slate-500">
            No &quot;How do I revolutionize my SEO strategy?&quot; here.
          </p>
        </motion.div>

        {/* FAQ items */}
        <div className="space-y-2.5">
          {faqs.map((faq, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 10 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-30px" }}
              transition={{ duration: 0.3, delay: i * 0.05 }}
            >
              <button
                onClick={() => setOpenIndex(openIndex === i ? null : i)}
                className="w-full flex items-center justify-between gap-4 px-5 py-4 rounded-xl text-left border border-slate-200/80 hover:border-slate-350 bg-slate-50 hover:bg-slate-100/50 transition-all cursor-pointer group"
                aria-expanded={openIndex === i}
              >
                <span className="text-sm font-semibold text-slate-800 group-hover:text-slate-950 transition-colors">
                  {faq.q}
                </span>
                <svg
                  width="16"
                  height="16"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2.5"
                  strokeLinecap="round"
                  className={`shrink-0 text-slate-500 transition-transform duration-200 ${openIndex === i ? "rotate-45" : ""}`}
                >
                  <line x1="12" y1="5" x2="12" y2="19" />
                  <line x1="5" y1="12" x2="19" y2="12" />
                </svg>
              </button>
              <AnimatePresence>
                {openIndex === i && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: "auto", opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.2 }}
                    className="overflow-hidden"
                  >
                    <p className="px-5 py-4 text-sm text-slate-600 leading-relaxed">
                      {faq.a}
                    </p>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
