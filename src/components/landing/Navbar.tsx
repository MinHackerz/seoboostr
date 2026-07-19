"use client";
 
import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { signIn, signOut, useSession } from "next-auth/react";
import Link from "next/link";
 
interface NavbarProps {
  onRunAudit?: () => void;
  onStartScan?: (url: string) => void;
}
 
export function Navbar({ onRunAudit: _onRunAudit, onStartScan: _onStartScan }: NavbarProps) {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const { data: session, status } = useSession();
  const isLoggedIn = status === "authenticated" && session?.user?.email !== "demo@seoptimised.com";
 
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);
 
  const navLinks = [
    { href: "/#modules", label: "Features" },
    { href: "/free-tools", label: "Free Tools" },
    { href: "/#pricing", label: "Pricing" },
    { href: "/#faq", label: "FAQ" },
  ];
 
  return (
    <nav className="fixed top-0 left-0 right-0 z-50 px-4 transition-all duration-300">
      <div
        className={`mx-auto transition-all duration-300 ${
          scrolled
            ? "max-w-5xl mt-4 rounded-2xl bg-slate-950/40 border border-white/10 backdrop-blur-xl shadow-[0_0_30px_rgba(0,0,0,0.4)]"
            : "max-w-7xl mt-0 rounded-none bg-transparent border-b border-transparent"
        }`}
      >
        <div className="flex items-center justify-between h-16 px-4 sm:px-6">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2.5 shrink-0 group/logo">
            <div className="relative">
              <img
                src="/logo.png"
                alt="SEO Optimised"
                className="w-8 h-8 rounded-xl object-contain border border-white/10 group-hover/logo:border-teal-500/30 transition-all duration-300"
                width={32}
                height={32}
                fetchPriority="high"
                decoding="async"
              />
            </div>
            <span className="text-lg font-black tracking-tight text-white group-hover/logo:text-teal-400 transition-colors font-sans">
              SEO Optimised
            </span>
          </Link>
 
          {/* Desktop links */}
          <div className="hidden md:flex items-center gap-6">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="text-xs font-bold text-slate-400 hover:text-white px-3.5 py-2 rounded-xl hover:bg-white/5 border border-transparent hover:border-white/5 transition-all duration-200"
              >
                {navLinks.find((l) => l.href === link.href)?.label || link.label}
              </Link>
            ))}
          </div>
 
          {/* Desktop CTA */}
          <div className="hidden md:flex items-center gap-3">
            {isLoggedIn ? (
              <>
                <Link
                  href="/dashboard"
                  className="px-4 py-2 text-xs font-bold text-slate-200 hover:text-white bg-slate-900/60 hover:bg-slate-800/60 rounded-xl border border-white/10 hover:border-teal-500/30 transition-all duration-200 hover:-translate-y-0.5 active:translate-y-0 cursor-pointer shadow-sm hover:shadow-[0_0_15px_rgba(20,184,166,0.15)]"
                >
                  Dashboard
                </Link>
                <button
                  onClick={() => signOut({ callbackUrl: "/" })}
                  className="px-4 py-2 text-xs font-bold text-rose-400 hover:text-rose-300 hover:bg-rose-500/10 border border-transparent hover:border-rose-500/20 rounded-xl transition-all duration-200 cursor-pointer"
                >
                  Logout
                </button>
              </>
            ) : (
              <>
                <button
                  onClick={() => signIn("credentials", { email: "demo@seoptimised.com", callbackUrl: "/dashboard" })}
                  className="group flex items-center gap-1.5 px-4 py-2 text-xs font-bold text-slate-200 hover:text-white bg-slate-900/60 hover:bg-slate-800/60 rounded-xl border border-white/10 hover:border-teal-500/30 transition-all duration-200 hover:-translate-y-0.5 active:translate-y-0 cursor-pointer shadow-sm hover:shadow-[0_0_15px_rgba(20,184,166,0.15)]"
                >
                  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" className="text-teal-400 group-hover:text-teal-300 transition-colors" strokeLinecap="round" strokeLinejoin="round">
                    <polygon points="5 3 19 12 5 21 5 3" />
                  </svg>
                  View Demo
                </button>
                <button
                  onClick={async () => {
                    if (session?.user?.email === "demo@seoptimised.com") {
                      await signOut({ redirect: false });
                    }
                    signIn("google", { callbackUrl: "/dashboard" });
                  }}
                  className="group flex items-center gap-2 px-4 py-2 text-xs font-bold text-white bg-teal-500/10 hover:bg-teal-500/20 rounded-xl border border-teal-500/25 hover:border-teal-500/40 transition-all duration-200 hover:-translate-y-0.5 active:translate-y-0 cursor-pointer shadow-sm hover:shadow-[0_0_15px_rgba(20,184,166,0.2)]"
                >
                  <svg width="14" height="14" viewBox="0 0 24 24" className="shrink-0">
                    <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 0 1-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z" fill="#4285F4"/>
                    <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
                    <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
                    <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
                  </svg>
                  Sign in with Google
                </button>
              </>
            )}
          </div>
 
          {/* Mobile menu button */}
          <div className="flex md:hidden items-center gap-2">
            <button
              onClick={() => setMobileOpen(!mobileOpen)}
              className="p-2 text-slate-400 hover:text-white cursor-pointer"
              aria-label="Toggle menu"
            >
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
                {mobileOpen ? (
                  <>
                    <line x1="18" y1="6" x2="6" y2="18" />
                    <line x1="6" y1="6" x2="18" y2="18" />
                  </>
                ) : (
                  <>
                    <line x1="4" y1="8" x2="20" y2="8" />
                    <line x1="4" y1="16" x2="20" y2="16" />
                  </>
                )}
              </svg>
            </button>
          </div>
        </div>
 
        {/* Mobile menu */}
        <AnimatePresence>
          {mobileOpen && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.2 }}
              className="md:hidden border-t border-white/10 bg-slate-950/90 rounded-b-2xl overflow-hidden"
            >
              <div className="px-4 py-4 space-y-3">
                {navLinks.map((link) => (
                  <Link
                    key={link.href}
                    href={link.href}
                    onClick={() => setMobileOpen(false)}
                    className="block text-sm font-medium text-slate-400 hover:text-teal-400 transition-colors"
                  >
                    {link.label}
                  </Link>
                ))}
                <div className="pt-3 border-t border-white/10 space-y-2.5">
                  {isLoggedIn ? (
                    <>
                      <Link
                        href="/dashboard"
                        onClick={() => setMobileOpen(false)}
                        className="block text-sm font-semibold text-slate-200 hover:text-teal-400 mb-1"
                      >
                        Dashboard
                      </Link>
 
                      <button
                        onClick={() => {
                          setMobileOpen(false);
                          signOut({ callbackUrl: "/" });
                        }}
                        className="w-full flex items-center justify-center gap-1.5 px-4 py-2.5 text-sm font-semibold text-rose-400 bg-rose-500/10 hover:bg-rose-500/20 border border-rose-500/20 rounded-xl transition-all duration-200 cursor-pointer"
                      >
                        Logout
                      </button>
                    </>
                  ) : (
                    <>
                      <button
                        onClick={() => {
                          setMobileOpen(false);
                          signIn("credentials", { email: "demo@seoptimised.com", callbackUrl: "/dashboard" });
                        }}
                        className="group w-full flex items-center justify-center gap-1.5 px-4 py-2.5 text-sm font-semibold text-slate-200 hover:text-white bg-white/5 hover:bg-white/10 rounded-xl border border-white/10 transition-all duration-200 cursor-pointer"
                      >
                        <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" className="text-teal-400 group-hover:text-teal-300 transition-colors" strokeLinecap="round" strokeLinejoin="round">
                          <polygon points="5 3 19 12 5 21 5 3" />
                        </svg>
                        View Demo
                      </button>
                      <button
                        onClick={async () => {
                          setMobileOpen(false);
                          if (session?.user?.email === "demo@seoptimised.com") {
                            await signOut({ redirect: false });
                          }
                          signIn("google", { callbackUrl: "/dashboard" });
                        }}
                        className="group w-full flex items-center justify-center gap-2 px-4 py-2.5 text-sm font-semibold text-slate-200 hover:text-white bg-white/5 hover:bg-white/10 rounded-xl border border-white/10 transition-all duration-200 cursor-pointer"
                      >
                        <svg width="14" height="14" viewBox="0 0 24 24" className="shrink-0">
                          <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 0 1-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z" fill="#4285F4"/>
                          <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
                          <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
                          <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
                        </svg>
                        Sign in with Google
                      </button>
                    </>
                  )}
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </nav>
  );
}
