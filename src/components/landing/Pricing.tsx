"use client";

import { motion } from "framer-motion";

export function Pricing() {
  const deductions = [
    { name: "First Full Crawl", cost: "1.0 credit", detail: "Per page scanned on the initial site audit." },
    { name: "Subsequent Audits", cost: "0.2 credits", detail: "Per page scanned on full website rescans." },
    { name: "Single Module Rescan", cost: "0.05 credits", detail: "Per page scanned when updating a single module." },
    { name: "AI Code Fix (Critical)", cost: "1.5 credits", detail: "Automated PR generation for critical priority issues." },
    { name: "AI Code Fix (High)", cost: "1.0 credit", detail: "Automated PR generation for high priority issues." },
    { name: "AI Code Fix (Medium)", cost: "0.75 credits", detail: "Automated PR generation for medium priority issues." },
    { name: "AI Code Fix (Low)", cost: "0.5 credits", detail: "Automated PR generation for low priority issues." },
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
    <section id="pricing" className="relative py-20 sm:py-28 overflow-hidden">
      {/* ── Dynamic Luminous Aurora Background ── */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <motion.div
          animate={{
            x: [0, 60, -40, 0],
            y: [0, -50, 60, 0],
            scale: [1, 1.2, 0.9, 1],
          }}
          transition={{ duration: 18, repeat: Infinity, ease: "easeInOut" }}
          className="absolute top-1/4 left-[15%] w-[550px] h-[550px] rounded-full bg-gradient-to-tr from-emerald-500/35 via-teal-500/20 to-transparent blur-[120px]"
        />
        <motion.div
          animate={{
            x: [0, -60, 50, 0],
            y: [0, 60, -50, 0],
            scale: [1, 1.15, 0.85, 1],
          }}
          transition={{ duration: 22, repeat: Infinity, ease: "easeInOut" }}
          className="absolute bottom-1/4 right-[15%] w-[550px] h-[550px] rounded-full bg-gradient-to-bl from-indigo-500/35 via-purple-500/25 to-transparent blur-[120px]"
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

      {/* Top and bottom glowing dividers */}
      <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-teal-500/40 to-transparent pointer-events-none" />
      <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-indigo-500/40 to-transparent pointer-events-none" />

      <div className="relative max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center max-w-2xl mx-auto mb-14 sm:mb-18">
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.4 }}
            className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-gradient-to-r from-teal-500/25 to-indigo-500/25 border border-teal-500/30 text-teal-400 text-xs font-bold uppercase tracking-wider mb-5 shadow-lg shadow-teal-500/10"
          >
            Transparent Credits & Pricing
          </motion.div>
          <motion.h2
            initial={{ opacity: 0, y: 15 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.4, delay: 0.1 }}
            className="text-3xl sm:text-4xl md:text-5xl font-black tracking-tight text-white mb-4"
          >
            Absolutely <span className="gradient-text">Free to Start</span>
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 15 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.4, delay: 0.15 }}
            className="text-slate-300 font-medium text-sm sm:text-base leading-relaxed"
          >
            Every new account gets <span className="text-teal-400 font-bold font-mono px-2 py-0.5 bg-teal-500/10 border border-teal-500/20 rounded">200.0 free credits</span> instantly upon signing up. Use them right away to crawl pages and generate automated code fixes.
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
            className="md:col-span-7 rounded-2xl p-6 sm:p-8 border border-white/15 bg-white/5 backdrop-blur-2xl shadow-2xl flex flex-col justify-between"
          >
            <div>
              <h3 className="text-xl font-black text-white mb-2">How Credits Work</h3>
              <p className="text-xs text-slate-300 font-medium mb-6 leading-relaxed">
                Credits are only deducted based on the actions you choose to run. There are no monthly recurring subscription costs or lock-ins.
              </p>

              <div className="space-y-3.5">
                {deductions.map((item) => (
                  <div key={item.name} className="flex items-start justify-between gap-4 py-3 border-b border-white/10 last:border-0">
                    <div>
                      <h4 className="text-xs font-bold text-slate-200">{item.name}</h4>
                      <p className="text-[11px] text-slate-400 font-medium mt-0.5">{item.detail}</p>
                    </div>
                    <span className="shrink-0 text-xs font-extrabold text-teal-300 font-mono bg-teal-500/15 px-3 py-1 rounded-lg border border-teal-500/30 shadow-sm">
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
            <div className="rounded-2xl p-6 sm:p-8 border border-white/15 bg-white/5 backdrop-blur-2xl shadow-2xl h-full flex flex-col justify-between">
              <div>
                <h3 className="text-xl font-black text-white mb-2">Need More Credits?</h3>
                <p className="text-xs text-slate-300 font-medium mb-6 leading-relaxed">
                  Add more credits to your balance as you go with simple, flat-rate top-ups. Credits never expire.
                </p>

                <div className="space-y-4">
                  {packages.map((pkg) => (
                    <div
                      key={pkg.name}
                      className={`relative flex items-center justify-between p-4.5 rounded-xl border transition-all duration-300 ${
                        pkg.popular
                          ? "border-teal-400/50 bg-gradient-to-r from-teal-500/15 to-indigo-500/15 shadow-[0_0_25px_rgba(20,184,166,0.25)] scale-[1.02]"
                          : "border-white/15 bg-slate-900/60 hover:border-white/25 hover:bg-white/5"
                      }`}
                    >
                      {pkg.popular && (
                        <span className="absolute -top-3 right-4 px-3 py-0.5 rounded-full bg-gradient-to-r from-teal-500 to-teal-400 text-[10px] font-extrabold text-white uppercase tracking-wider shadow-lg shadow-teal-500/40">
                          Popular
                        </span>
                      )}
                      <div>
                        <h4 className="text-xs font-bold text-slate-200">{pkg.name}</h4>
                        <div className="flex items-baseline gap-1 mt-1">
                          <span className="text-xl font-black text-white font-mono tracking-tight">{pkg.credits}</span>
                          <span className="text-[10px] text-teal-400 font-bold uppercase">credits</span>
                        </div>
                        <p className="text-[11px] text-slate-300 font-medium mt-1">{pkg.description}</p>
                      </div>
                      <div className="text-right shrink-0">
                        <span className="text-lg font-black text-teal-300 font-mono tracking-tight block">{pkg.price}</span>
                        <div className="text-[10px] text-slate-400 font-bold uppercase mt-0.5">One-time</div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="mt-6 pt-4 border-t border-white/10 flex items-center justify-between">
                <span className="text-xs text-slate-300 font-semibold">No hidden fees. Pay as you go.</span>
                <span className="text-xs font-black text-teal-400 font-mono bg-white/5 px-2.5 py-1 rounded border border-white/10">0.05 USD / credit</span>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
