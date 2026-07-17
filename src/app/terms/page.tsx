import type { Metadata } from "next";
import { Navbar } from "@/components/landing/Navbar";
import { Footer } from "@/components/landing/Footer";

export const metadata: Metadata = {
  title: "Terms of Service | SEOBoostr",
  description: "Read our Terms of Service to understand standard usage guidelines, credit consumption policies, and warranty disclaimers.",
  openGraph: {
    title: "Terms of Service | SEOBoostr",
    description: "Read our Terms of Service to understand standard usage guidelines, credit consumption policies, and warranty disclaimers.",
    url: "https://seoboostr.io/terms",
    type: "website",
  },
};

export default function TermsPage() {
  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col justify-between">
      <Navbar />
      
      <main className="flex-grow max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 pt-28 pb-16">
        <div className="rounded-3xl p-8 sm:p-12 border border-white/10 bg-slate-900/40 backdrop-blur-xl shadow-2xl shadow-teal-500/5 relative overflow-hidden">
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-3/4 h-px bg-gradient-to-r from-transparent via-teal-500/30 to-transparent" />
          
          <h1 className="text-3xl sm:text-4xl font-black text-white tracking-tight mb-8">
            Terms of <span className="gradient-text">Service</span>
          </h1>

          <div className="space-y-6 text-sm text-slate-300 leading-relaxed font-medium">
            <p>Last updated: July 17, 2026</p>
            
            <p>
              Welcome to SEOBoostr! By accessing our website and using our parallel audit platform, you agree to comply with and be bound by the following Terms of Service.
            </p>

            <h2 className="text-xl font-bold text-white mt-8 mb-3">1. Acceptable Use</h2>
            <p>
              You agree to use SEOBoostr only to run public audits and optimize your website performance. You must not:
            </p>
            <ul className="list-disc pl-5 space-y-2">
              <li>Attempt to scrape, reverse-engineer, or exploit our orchestrator code.</li>
              <li>Abuse our APIs to flood target sites or initiate DDoS-like crawls.</li>
              <li>Bypass or attempt to exploit credit/coin balances or transaction constraints.</li>
            </ul>

            <h2 className="text-xl font-bold text-white mt-8 mb-3">2. Credit Purchases & Refunds</h2>
            <p>
              Every new user account is credited with a one-time free signup bonus of 100.0 credits. All purchased credits (via Starter, Professional, or Agency packages) are final and non-refundable. Credits roll over indefinitely and never expire. Deductions are processed automatically: 2.0 credits per page for first-time crawls, 1.0 credit per page for subsequent full site rescans, and 1.0 credit per page for individual module updates.
            </p>

            <h2 className="text-xl font-bold text-white mt-8 mb-3">3. Disclaimer of Warranties</h2>
            <p>
              SEOBoostr is provided &quot;as is&quot; without any warranty of any kind. We do not guarantee that our automated audits or suggestions will instantly improve search engine rankings.
            </p>

            <h2 className="text-xl font-bold text-white mt-8 mb-3">4. Limitation of Liability</h2>
            <p>
              In no event shall SEOBoostr be liable for any damages arising out of the use or inability to use our tools, reports, or audits.
            </p>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
