"use client";

import { useRef } from "react";
import { motion, useMotionTemplate, useMotionValue } from "framer-motion";

export function Pricing() {
  const deductions = [
    { name: "Initial Homepage Audit", cost: "2.0 credits", detail: "Charged once when saving or importing a new website's homepage report." },
    { name: "First-Time Page Scans", cost: "2.0 credits / pg", detail: "Per page scanned when crawling and analyzing newly discovered subpages from scratch." },
    { name: "Full Website Rescans", cost: "4.50 credits / pg", detail: "Charges 0.25 credits per page scan per module (18 modules total) when running rescan refresh audits." },
    { name: "Resume Paused Scans", cost: "Dynamic", detail: "Charges 2.0 credits per pending new page, and 4.50 credits per previously scanned page." },
    { name: "Single Module Rescan", cost: "0.5 credits / pg", detail: "Per page scanned when updating a single module (e.g., Schema, Performance) at a flat 0.5 rate." },
  ];

  const packages = [
    {
      name: "Starter Pack",
      credits: "200",
      price: "$5.00",
      description: "Ideal for single audits and quick checks.",
      popular: false,
    },
    {
      name: "Professional Pack",
      credits: "500",
      price: "$10.00",
      description: "Best for growing sites needing active fixes.",
      popular: true,
    },
    {
      name: "Agency Pack",
      credits: "3,000",
      price: "$50.00",
      description: "Designed for high volume audits & crawls.",
      popular: false,
    },
  ];

  // Mouse tracking for Left Card
  const leftCardRef = useRef<HTMLDivElement>(null);
  const leftMouseX = useMotionValue(0);
  const leftMouseY = useMotionValue(0);

  const handleLeftMouseMove = (e: React.MouseEvent) => {
    if (!leftCardRef.current) return;
    const rect = leftCardRef.current.getBoundingClientRect();
    leftMouseX.set(e.clientX - rect.left);
    leftMouseY.set(e.clientY - rect.top);
  };

  // Mouse tracking for Right Card
  const rightCardRef = useRef<HTMLDivElement>(null);
  const rightMouseX = useMotionValue(0);
  const rightMouseY = useMotionValue(0);

  const handleRightMouseMove = (e: React.MouseEvent) => {
    if (!rightCardRef.current) return;
    const rect = rightCardRef.current.getBoundingClientRect();
    rightMouseX.set(e.clientX - rect.left);
    rightMouseY.set(e.clientY - rect.top);
  };

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
            className="text-3xl sm:text-4xl md:text-5xl font-black tracking-tight text-white mb-4 leading-tight"
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
            Every new account gets <span className="text-teal-400 font-extrabold font-mono px-2.5 py-0.5 bg-teal-500/10 border border-teal-500/25 rounded-md shadow-[0_0_10px_rgba(20,184,166,0.15)] select-none">200.0 free credits</span> instantly upon signing up. Use them right away to crawl pages and audit your sites.
          </motion.p>
        </div>

        {/* Main Grid */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-6 sm:gap-8 items-stretch">
          {/* Credit Deductions Table (Left Card) */}
          <motion.div
            ref={leftCardRef}
            onMouseMove={handleLeftMouseMove}
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="group md:col-span-7 rounded-2xl p-6 sm:p-8 border border-white/10 bg-slate-950/40 backdrop-blur-2xl shadow-2xl hover:border-teal-500/20 transition-all duration-300 relative overflow-hidden flex flex-col justify-between"
          >
            {/* Spotlight Glow */}
            <motion.div
              className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none z-0"
              style={{
                background: useMotionTemplate`
                  radial-gradient(
                    240px circle at ${leftMouseX}px ${leftMouseY}px,
                    rgba(20, 184, 166, 0.12),
                    transparent 80%
                  )
                `,
              }}
            />
            {/* Border light bar */}
            <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-teal-500/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

            <div className="relative z-10">
              <h3 className="text-xl font-extrabold text-white mb-2 tracking-wide font-sans">How Credits Work</h3>
              <p className="text-xs text-slate-400 font-semibold mb-6 leading-relaxed">
                Credits are only deducted based on the actions you choose to run. There are no monthly recurring subscription costs or lock-ins.
              </p>

              <div className="space-y-1">
                {deductions.map((item) => (
                  <div 
                    key={item.name} 
                    className="flex items-start justify-between gap-4 p-3 rounded-xl hover:bg-white/3 border border-transparent hover:border-white/5 transition-all duration-200"
                  >
                    <div>
                      <h4 className="text-xs font-bold text-slate-200">{item.name}</h4>
                      <p className="text-[11px] text-slate-400 font-medium mt-0.5">{item.detail}</p>
                    </div>
                    <span className="shrink-0 text-xs font-mono font-black text-teal-300 bg-teal-500/10 px-3 py-1 rounded-xl border border-teal-500/25 shadow-sm shadow-teal-500/5">
                      {item.cost}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </motion.div>

          {/* Top-up Packages (Right Card) */}
          <motion.div
            ref={rightCardRef}
            onMouseMove={handleRightMouseMove}
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="group md:col-span-5 flex flex-col gap-4 justify-between"
          >
            <div className="rounded-2xl p-6 sm:p-8 border border-white/10 bg-slate-950/40 backdrop-blur-2xl shadow-2xl hover:border-teal-500/20 transition-all duration-300 relative overflow-hidden h-full flex flex-col justify-between">
              {/* Spotlight Glow */}
              <motion.div
                className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none z-0"
                style={{
                  background: useMotionTemplate`
                    radial-gradient(
                      200px circle at ${rightMouseX}px ${rightMouseY}px,
                      rgba(20, 184, 166, 0.12),
                      transparent 80%
                    )
                  `,
                }}
              />
              {/* Border light bar */}
              <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-teal-500/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

              <div className="relative z-10">
                <h3 className="text-xl font-extrabold text-white mb-2 tracking-wide font-sans">Need More Credits?</h3>
                <p className="text-xs text-slate-400 font-semibold mb-6 leading-relaxed">
                  Add more credits to your balance as you go with simple, flat-rate top-ups. Credits never expire.
                </p>

                <div className="space-y-4">
                  {packages.map((pkg) => (
                    <motion.div
                      key={pkg.name}
                      whileHover={{ scale: pkg.popular ? 1.02 : 1.01 }}
                      className={`relative flex items-center justify-between p-4.5 rounded-2xl border transition-all duration-300 cursor-default select-none ${
                        pkg.popular
                          ? "border-teal-500/35 bg-gradient-to-r from-teal-500/15 via-indigo-500/5 to-indigo-500/15 shadow-[0_0_30px_rgba(20,184,166,0.18)]"
                          : "border-white/5 bg-slate-950/60 hover:border-white/15 hover:bg-white/3"
                      }`}
                    >
                      {pkg.popular && (
                        <span className="absolute -top-2.5 right-4 px-2.5 py-0.5 rounded-full bg-gradient-to-r from-teal-500 to-teal-400 text-[8px] font-black text-white uppercase tracking-widest shadow-lg shadow-teal-500/30 animate-pulse">
                          Popular
                        </span>
                      )}
                      <div>
                        <h4 className="text-xs font-bold text-slate-200">{pkg.name}</h4>
                        <div className="flex items-baseline gap-1 mt-1">
                          <span className="text-2xl font-black text-white font-mono tracking-tight">{pkg.credits}</span>
                          <span className="text-[9px] text-teal-400 font-extrabold uppercase tracking-wide">credits</span>
                        </div>
                        <p className="text-[10px] text-slate-400 font-bold mt-1 tracking-wide">{pkg.description}</p>
                      </div>
                      <div className="text-right shrink-0">
                        <span className="text-xl font-black text-teal-300 font-mono tracking-tight block">{pkg.price}</span>
                        <div className="text-[9px] text-slate-400 font-extrabold uppercase tracking-wider mt-0.5">One-time</div>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </div>

              <div className="mt-6 pt-4 border-t border-white/5 flex items-center justify-between relative z-10 select-none">
                <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">No monthly fees. Pay as you go.</span>
                <span className="text-[9px] font-black text-teal-400 font-mono bg-white/5 px-2.5 py-1 rounded-lg border border-white/10 shadow-sm">From 0.016 USD / credit</span>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
