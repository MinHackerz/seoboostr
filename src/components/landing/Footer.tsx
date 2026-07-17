"use client";

import { signIn, signOut, useSession } from "next-auth/react";
import { motion } from "framer-motion";

export function Footer() {
  const { data: session } = useSession();
  return (
    <footer className="relative overflow-hidden">
      {/* ── Dynamic Luminous Aurora Background ── */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <motion.div
          animate={{
            x: [0, 80, -60, 0],
            y: [0, -30, 40, 0],
            scale: [1, 1.25, 0.9, 1],
          }}
          transition={{ duration: 20, repeat: Infinity, ease: "easeInOut" }}
          className="absolute top-10 left-1/4 w-[650px] h-[400px] rounded-full bg-gradient-to-r from-teal-500/35 via-indigo-500/25 to-purple-500/30 blur-[130px]"
        />
      </div>

      {/* ── Cyber Matrix Dot Grid Overlay ── */}
      <div
        className="absolute inset-0 opacity-25 pointer-events-none"
        style={{
          backgroundImage: "radial-gradient(rgba(255, 255, 255, 0.08) 1px, transparent 1px)",
          backgroundSize: "24px 24px",
          maskImage: "radial-gradient(ellipse 90% 70% at 50% 30%, black 40%, transparent 100%)",
          WebkitMaskImage: "radial-gradient(ellipse 90% 70% at 50% 30%, black 40%, transparent 100%)",
        }}
      />

      {/* Top glowing divider line */}
      <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-teal-500/50 to-transparent pointer-events-none" />

      {/* CTA Banner inside Glass Container */}
      <div className="relative max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 pt-16 sm:pt-22 pb-12 sm:pb-16 text-center">
        <div className="rounded-3xl p-8 sm:p-12 border border-white/20 bg-slate-900/80 backdrop-blur-2xl shadow-2xl shadow-teal-500/15 relative overflow-hidden group">
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-3/4 h-px bg-gradient-to-r from-transparent via-teal-400 to-transparent" />
          
          <h3 className="text-3xl sm:text-4xl md:text-5xl font-black text-white tracking-tight mb-4">
            Ready to <span className="gradient-text">boost your SEO?</span>
          </h3>
          <p className="text-sm sm:text-base text-slate-300 max-w-lg mx-auto mb-8 font-medium leading-relaxed">
            Join thousands of developers and marketers who audit smarter, ship faster, and rank higher. Zero setup required.
          </p>
          <div className="flex flex-wrap items-center justify-center gap-4">
            <button
              onClick={async () => {
                if (session?.user?.email === "demo@seoboostr.io") {
                  await signOut({ redirect: false });
                }
                signIn("google", { callbackUrl: "/dashboard" });
              }}
              className="px-8 py-4 text-base font-extrabold text-white bg-gradient-to-r from-teal-500 to-teal-600 hover:from-teal-400 hover:to-teal-500 rounded-2xl transition-all duration-200 cursor-pointer shadow-xl shadow-teal-500/30 hover:shadow-teal-500/40 hover:-translate-y-0.5 active:translate-y-0"
            >
              Get Started Free Today
            </button>
            <button
              onClick={() => signIn("credentials", { email: "demo@seoboostr.io", callbackUrl: "/dashboard" })}
              className="px-8 py-4 text-base font-bold text-slate-200 bg-white/10 hover:bg-white/15 border border-white/20 hover:border-white/30 rounded-2xl transition-all duration-200 cursor-pointer hover:-translate-y-0.5 active:translate-y-0 shadow-lg"
            >
              Launch Instant Demo
            </button>
          </div>
        </div>
      </div>

      {/* Divider */}
      <div className="h-px bg-gradient-to-r from-transparent via-white/10 to-transparent mx-4 sm:mx-8" />

      {/* Footer content */}
      <div className="relative max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-8">
          {/* Logo + tagline */}
          <div>
            <div className="flex items-center gap-2.5 mb-3">
              <img
                src="/logo.png"
                alt="SEOBoostr"
                className="w-8 h-8 rounded-xl object-contain shadow-md"
                width={32}
                height={32}
              />
              <span className="text-lg font-black tracking-tight text-white">
                SEOBoostr
              </span>
            </div>
            <p className="text-xs text-slate-400 max-w-xs leading-relaxed font-medium">
              Built by engineers who got tired of running 5 sequential tools to get one answer. Ship faster. Rank better.
            </p>
          </div>

          {/* Links */}
          <div className="flex gap-10 sm:gap-16">
            <div className="space-y-3">
              <p className="text-[11px] font-extrabold text-teal-400 uppercase tracking-wider">Product</p>
              <a href="/#modules" className="block text-xs font-semibold text-slate-300 hover:text-white transition-colors">Features & Modules</a>
              <a href="/#pricing" className="block text-xs font-semibold text-slate-300 hover:text-white transition-colors">Credits & Pricing</a>
              <a href="/#faq" className="block text-xs font-semibold text-slate-300 hover:text-white transition-colors">FAQ</a>
            </div>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="mt-12 pt-8 border-t border-white/10 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-xs text-slate-400 font-medium">
            © {new Date().getFullYear()} SEOBoostr. All rights reserved. Made with high-performance parallel processing.
          </p>
          <div className="flex items-center gap-6">
            <a href="/privacy" className="text-xs font-semibold text-slate-400 hover:text-white transition-colors">Privacy Policy</a>
            <a href="/terms" className="text-xs font-semibold text-slate-400 hover:text-white transition-colors">Terms of Service</a>
            {/* Social icons */}
            <a href="https://x.com/menajulm" target="_blank" rel="noopener noreferrer" className="text-slate-400 hover:text-teal-400 transition-colors" aria-label="Twitter">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor"><path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/></svg>
            </a>
            <a href="https://github.com/minhackerz" target="_blank" rel="noopener noreferrer" className="text-slate-400 hover:text-teal-400 transition-colors" aria-label="GitHub">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor"><path d="M12 2C6.477 2 2 6.477 2 12c0 4.42 2.87 8.17 6.84 9.5.5.08.66-.23.66-.5v-1.69c-2.77.6-3.36-1.34-3.36-1.34-.46-1.16-1.11-1.47-1.11-1.47-.91-.62.07-.6.07-.6 1 .07 1.53 1.03 1.53 1.03.87 1.52 2.34 1.07 2.91.83.09-.65.35-1.09.63-1.34-2.22-.25-4.55-1.11-4.55-4.92 0-1.11.38-2 1.03-2.71-.1-.25-.45-1.29.1-2.64 0 0 .84-.27 2.75 1.02.79-.22 1.65-.33 2.5-.33.85 0 1.71.11 2.5.33 1.91-1.29 2.75-1.02 2.75-1.02.55 1.35.2 2.39.1 2.64.65.71 1.03 1.6 1.03 2.71 0 3.82-2.34 4.66-4.57 4.91.36.31.69.92.69 1.85V21c0 .27.16.59.67.5C19.14 20.16 22 16.42 22 12A10 10 0 0012 2z"/></svg>
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}
