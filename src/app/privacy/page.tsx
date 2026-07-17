import type { Metadata } from "next";
import { Navbar } from "@/components/landing/Navbar";
import { Footer } from "@/components/landing/Footer";

export const metadata: Metadata = {
  title: "Privacy Policy | SEO Optimised",
  description: "Learn how SEO Optimised handles your data, privacy, and account information with our detailed privacy statement.",
  openGraph: {
    title: "Privacy Policy | SEO Optimised",
    description: "Learn how SEO Optimised handles your data, privacy, and account information.",
    url: "https://seoptimised.com/privacy",
    type: "website",
  },
};

export default function PrivacyPage() {
  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col justify-between">
      <Navbar />
      
      <main className="flex-grow max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 pt-28 pb-16">
        <div className="rounded-3xl p-8 sm:p-12 border border-white/10 bg-slate-900/40 backdrop-blur-xl shadow-2xl shadow-teal-500/5 relative overflow-hidden">
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-3/4 h-px bg-gradient-to-r from-transparent via-teal-500/30 to-transparent" />
          
          <h1 className="text-3xl sm:text-4xl font-black text-white tracking-tight mb-8">
            Privacy <span className="gradient-text">Policy</span>
          </h1>

          <div className="space-y-6 text-sm text-slate-300 leading-relaxed font-medium">
            <p>Last updated: July 17, 2026</p>
            
            <p>
              At SEO Optimised, accessible from seoptimised.com, one of our main priorities is the privacy of our visitors. This Privacy Policy document contains types of information that is collected and recorded by SEO Optimised and how we use it.
            </p>

            <h2 className="text-xl font-bold text-white mt-8 mb-3">1. Information We Collect</h2>
            <p>
              If you register for an account or run an audit, we may collect:
            </p>
            <ul className="list-disc pl-5 space-y-2">
              <li>Account email address when signing in via Google or credentials.</li>
              <li>Scanned website URLs and associated scan scores/results.</li>
              <li>Credit consumption and transaction history logs.</li>
            </ul>

            <h2 className="text-xl font-bold text-white mt-8 mb-3">2. How We Use Your Information</h2>
            <p>
              We use the collected information to operate, maintain, and improve our services, including:
            </p>
            <ul className="list-disc pl-5 space-y-2">
              <li>Running and displaying module audit results.</li>
              <li>Managing user credit balances and payments.</li>
              <li>Sending essential account notifications or support replies.</li>
            </ul>

            <h2 className="text-xl font-bold text-white mt-8 mb-3">3. Cookies and Log Files</h2>
            <p>
              SEO Optimised follows standard logging procedures. These logs record visitors when they visit websites. NextAuth and Google OAuth use cookies to maintain secure user sessions.
            </p>

            <h2 className="text-xl font-bold text-white mt-8 mb-3">4. Data Deletion</h2>
            <p>
              You are in full control of your data. You can delete individual audit records, websites, or request complete account and data removal directly by contacting support.
            </p>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
