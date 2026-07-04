"use client";

import { motion } from "framer-motion";

export function Pricing() {
  const deductions = [
    { name: "First Full Crawl", cost: "1.0 credit", detail: "Per page scanned on the initial site audit." },
    { name: "Subsequent Audits", cost: "0.2 credits", detail: "Per page scanned on full website rescans." },
    { name: "Single Module Rescan", cost: "0.05 credits", detail: "Per page scanned when updating a single module." },
    { name: "AI Code Fix (Critical)", cost: "1.5 credits", detail: "Automated PR generation for critical priority issues (Coming Soon)." },
    { name: "AI Code Fix (High)", cost: "1.0 credit", detail: "Automated PR generation for high priority issues (Coming Soon)." },
    { name: "AI Code Fix (Medium)", cost: "0.75 credits", detail: "Automated PR generation for medium priority issues (Coming Soon)." },
    { name: "AI Code Fix (Low)", cost: "0.5 credits", detail: "Automated PR generation for low priority issues (Coming Soon)." },
  ];

  const packages = [
    {
      name: "Starter Pack",
      credits: "50",
      price: "$2.50",
      description: "Ideal for single audits and quick checks.",
      popular: false,
    },
    {
      name: "Professional Pack",
      credits: "200",
      price: "$10.00",
      description: "Best for growing sites needing active fixes.",
      popular: true,
    },
    {
      name: "Agency Pack",
      credits: "1,000",
      price: "$50.00",
      description: "Designed for high volume audits & crawls.",
      popular: false,
    },
  ];

  return (
    <section id="pricing" className="py-20 sm:py-24 bg-slate-50 border-t border-slate-100">
      <div className="max-w-5xl mx-auto px-4">
        {/* Section Header */}
        <div className="text-center max-w-2xl mx-auto mb-16">
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.4 }}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-teal-50 border border-teal-100 text-teal-700 text-xs font-semibold mb-4"
          >
            Pricing & Credits
          </motion.div>
          <motion.h2
            initial={{ opacity: 0, y: 15 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.4, delay: 0.1 }}
            className="text-3xl sm:text-4xl font-bold tracking-tight text-slate-900 mb-4"
          >
            Absolutely Free to Start
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 15 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.4, delay: 0.15 }}
            className="text-slate-600 font-medium text-sm sm:text-base"
          >
            Every new account gets <span className="text-teal-600 font-bold font-mono">200.0 free credits</span> instantly upon signing up. Use them to crawl pages and generate automated code fixes.
          </motion.p>
        </div>

        {/* Main Grid */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-stretch">
          {/* Credit Deductions Table */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="md:col-span-7 bg-white rounded-2xl border border-slate-200 p-6 sm:p-8 flex flex-col justify-between"
          >
            <div>
              <h3 className="text-lg font-bold text-slate-900 mb-2">How Credits Work</h3>
              <p className="text-xs text-slate-500 font-medium mb-6">
                Credits are only deducted based on the actions you choose to run. There are no monthly recurring subscription costs.
              </p>

              <div className="space-y-4">
                {deductions.map((item) => (
                  <div key={item.name} className="flex items-start justify-between gap-4 py-2.5 border-b border-slate-100 last:border-0">
                    <div>
                      <h4 className="text-xs font-bold text-slate-800">{item.name}</h4>
                      <p className="text-[11px] text-slate-400 font-medium mt-0.5">{item.detail}</p>
                    </div>
                    <span className="shrink-0 text-xs font-extrabold text-teal-600 font-mono bg-teal-50 px-2.5 py-1 rounded-md border border-teal-100">
                      {item.cost}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </motion.div>

          {/* Top-up Packages */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="md:col-span-5 flex flex-col gap-4 justify-between"
          >
            <div className="bg-white rounded-2xl border border-slate-200 p-6 sm:p-8 h-full flex flex-col justify-between">
              <div>
                <h3 className="text-lg font-bold text-slate-900 mb-2">Need More Credits?</h3>
                <p className="text-xs text-slate-500 font-medium mb-6">
                  Add more credits to your balance as you go with simple, flat-rate top-ups. Credits never expire.
                </p>

                <div className="space-y-4">
                  {packages.map((pkg) => (
                    <div
                      key={pkg.name}
                      className={`relative flex items-center justify-between p-4 rounded-xl border ${
                        pkg.popular
                          ? "border-teal-600 bg-teal-50/20"
                          : "border-slate-200 bg-slate-50/30"
                      }`}
                    >
                      {pkg.popular && (
                        <span className="absolute -top-2.5 right-4 px-2 py-0.5 rounded-full bg-teal-600 text-[9px] font-extrabold text-white uppercase tracking-wider">
                          Popular
                        </span>
                      )}
                      <div>
                        <h4 className="text-xs font-bold text-slate-800">{pkg.name}</h4>
                        <div className="flex items-baseline gap-1 mt-1">
                          <span className="text-lg font-extrabold text-slate-900 font-mono tracking-tight">{pkg.credits}</span>
                          <span className="text-[10px] text-slate-400 font-bold uppercase">credits</span>
                        </div>
                        <p className="text-[10px] text-slate-400 font-medium mt-1">{pkg.description}</p>
                      </div>
                      <div className="text-right">
                        <span className="text-base font-extrabold text-teal-600 font-mono tracking-tight">{pkg.price}</span>
                        <div className="text-[9px] text-slate-400 font-bold uppercase mt-0.5">One-time</div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="mt-6 pt-4 border-t border-slate-100 flex items-center justify-between">
                <span className="text-[10px] text-slate-400 font-medium">No hidden fees. Pay as you go.</span>
                <span className="text-xs font-extrabold text-slate-700 font-mono">0.05 USD / credit</span>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
