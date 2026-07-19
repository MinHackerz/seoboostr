"use client";

import { useState, useEffect, useCallback } from "react";

interface Transaction {
  id: string;
  amount: number;
  description: string;
  createdAt: string;
}

interface ProfileData {
  id: string;
  name: string | null;
  email: string;
  image: string | null;
  coins: number;
  transactions: Transaction[];
}

interface ProfileModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentCoins: number;
}

export function ProfileModal({ isOpen, onClose, currentCoins }: ProfileModalProps) {
  const [profile, setProfile] = useState<ProfileData | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<"billing" | "transactions">("billing");

  const fetchProfile = useCallback(async (showLoading = false) => {
    if (showLoading) setIsLoading(true);
    setError(null);
    try {
      const res = await fetch("/api/user/profile");
      if (!res.ok) {
        throw new Error("Failed to load profile details");
      }
      const data = await res.json();
      setProfile(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong");
    } finally {
      if (showLoading) setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    if (!isOpen) return;
    fetchProfile(true);
  }, [isOpen, fetchProfile]);

  if (!isOpen) return null;

  // Render Initials if user image is missing
  const getInitials = () => {
    if (profile?.name) return profile.name.slice(0, 2).toUpperCase();
    if (profile?.email) return profile.email.slice(0, 2).toUpperCase();
    return "US";
  };

  const formatDate = (dateStr: string) => {
    try {
      const d = new Date(dateStr);
      return d.toLocaleDateString(undefined, {
        month: "short",
        day: "numeric",
        year: "numeric",
        hour: "2-digit",
        minute: "2-digit",
      });
    } catch {
      return dateStr;
    }
  };

  const pricingTiers = [
    {
      name: "Starter Pack",
      credits: "200 Credits",
      price: "$5.00",
      description: "Ideal for single audits and quick checks.",
      features: [
        "200 audit page scans",
        "Includes Core Web Vitals checks",
        "Credits roll over forever",
      ],
      popular: false,
    },
    {
      name: "Professional Pack",
      credits: "500 Credits",
      price: "$10.00",
      description: "Best for growing sites needing active fixes.",
      features: [
        "500 audit page scans",
        "Priority crawling speeds",
        "Credits roll over forever",
      ],
      popular: true,
    },
    {
      name: "Agency Pack",
      credits: "3,000 Credits",
      price: "$50.00",
      description: "Designed for high volume audits & crawls.",
      features: [
        "3000 audit page scans",
        "Maximum crawling speeds",
        "Dedicated agency support",
      ],
      popular: false,
    },
  ];

  return (
    <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center z-[100] p-4 animate-fade-in">
      {/* Modal Container */}
      <div
        className="w-full max-w-2xl bg-white border border-slate-150 rounded-3xl shadow-2xl overflow-hidden flex flex-col max-h-[85vh] animate-scale-up"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header Block */}
        <div className="px-6 py-5.5 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
          <div className="flex items-center gap-3">
            {/* User Avatar / Initials */}
            {profile?.image ? (
              <img
                src={profile.image}
                alt={profile.name || "User"}
                className="w-11 h-11 rounded-full object-cover border border-slate-200"
                width={44}
                height={44}
                loading="lazy"
                decoding="async"
              />
            ) : (
              <div className="w-11 h-11 rounded-full bg-accent/10 border border-accent/15 flex items-center justify-center text-accent font-black text-xs select-none">
                {getInitials()}
              </div>
            )}

            <div>
              <h3 className="text-base font-black text-slate-800 leading-tight">
                {profile?.name || "Account Profile"}
              </h3>
              <span className="text-[11px] font-semibold text-slate-400 block mt-0.5 select-all">
                {profile?.email}
              </span>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="w-8 h-8 rounded-xl flex items-center justify-center hover:bg-slate-100 text-slate-400 hover:text-slate-650 transition-all border border-slate-200/40 cursor-pointer"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={2.5}
              stroke="currentColor"
              className="w-4 h-4"
            >
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 18 18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Loading and Error States */}
        {isLoading ? (
          <div className="flex-1 flex flex-col items-center justify-center py-20 gap-3">
            <svg className="animate-spin h-7 w-7 text-accent" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
            <span className="text-xs font-extrabold text-slate-400 uppercase tracking-wider">Loading Profile...</span>
          </div>
        ) : error ? (
          <div className="flex-1 flex flex-col items-center justify-center py-16 px-6 text-center">
            <span className="text-sm font-bold text-rose-600">Failed to load account profile</span>
            <p className="text-xs text-slate-400 mt-1 font-semibold">{error}</p>
            <button
              onClick={() => fetchProfile(true)}
              className="mt-4 px-4 py-2 bg-slate-800 text-white font-bold rounded-xl text-xs hover:bg-slate-900 cursor-pointer"
            >
              Try Again
            </button>
          </div>
        ) : (
          <div className="flex-1 overflow-hidden p-6 flex flex-col gap-6 min-h-0">
            {/* Credits Counter Card */}
            <div className="p-5 rounded-2xl bg-gradient-to-br from-amber-500/10 via-amber-500/[0.03] to-transparent border border-amber-500/20 flex flex-col sm:flex-row sm:items-center justify-between gap-4 select-none shrink-0 shadow-sm">
              <div className="space-y-1">
                <span className="text-[10px] font-black text-amber-700/80 uppercase tracking-wider block">Available Balance</span>
                <span className="text-3xl font-black text-slate-850 font-mono tracking-tight block">
                  {currentCoins.toFixed(1)} <span className="text-sm font-extrabold text-slate-450 uppercase tracking-normal">Credits</span>
                </span>
              </div>
              <div>
                <button
                  type="button"
                  onClick={() => alert("Payment sandbox: Credits are mock and default loaded for demonstration.")}
                  className="px-5 py-2.5 bg-amber-500 hover:bg-amber-600 text-white font-bold rounded-xl text-xs transition-all shadow-md shadow-amber-500/20 hover:shadow-lg hover:-translate-y-0.5 active:translate-y-0 cursor-pointer"
                >
                  Top Up Balance
                </button>
              </div>
            </div>

            {/* Content Tabs Navigation */}
            <div className="flex-1 flex flex-col min-h-0">
              <div className="border-b border-slate-100 flex items-center mb-5 shrink-0 select-none">
                <button
                  type="button"
                  onClick={() => setActiveTab("billing")}
                  className={`pb-2.5 text-xs font-black uppercase tracking-wider border-b-2 transition-all cursor-pointer mr-6 ${
                    activeTab === "billing"
                      ? "border-amber-500 text-slate-800"
                      : "border-transparent text-slate-400 hover:text-slate-600"
                  }`}
                >
                  Credits & Billing
                </button>
                <button
                  type="button"
                  onClick={() => setActiveTab("transactions")}
                  className={`pb-2.5 text-xs font-black uppercase tracking-wider border-b-2 transition-all cursor-pointer ${
                    activeTab === "transactions"
                      ? "border-amber-500 text-slate-800"
                      : "border-transparent text-slate-400 hover:text-slate-600"
                  }`}
                >
                  Credit Transaction Logs
                </button>
              </div>

              {/* Conditionally Render Content based on activeTab */}
              {activeTab === "billing" ? (
                <div className="space-y-3 flex-1 flex flex-col overflow-y-auto min-h-0 pr-1">
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <h5 className="text-xs font-black text-slate-800 uppercase tracking-wider">Buy More Credits</h5>
                      <span className="text-[10px] font-bold text-accent bg-accent-light px-2.5 py-0.5 rounded-full uppercase tracking-wider">Secure Pricing</span>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                      {pricingTiers.map((tier) => (
                        <div
                          key={tier.name}
                          className={`relative border rounded-2xl p-4.5 flex flex-col justify-between transition-all bg-white hover:border-slate-350 hover:shadow-xs group ${
                            tier.popular
                              ? "border-amber-500 ring-1 ring-amber-500/20"
                              : "border-slate-200/80"
                          }`}
                        >
                          {tier.popular && (
                            <span className="absolute -top-2.5 left-4 px-2 py-0.5 rounded-full text-[8.5px] font-extrabold uppercase bg-amber-500 text-white tracking-wide shadow-sm border border-amber-400">
                              Best Value
                            </span>
                          )}

                          <div className="space-y-3">
                            <div>
                              <h6 className="text-[11px] font-extrabold text-slate-400 uppercase tracking-wider">{tier.name}</h6>
                              <div className="flex items-baseline gap-1 mt-1">
                                <span className="text-2xl font-black text-slate-800 font-mono tracking-tight">{tier.price}</span>
                                <span className="text-[10px] font-bold text-slate-400 font-mono uppercase">/ pack</span>
                              </div>
                            </div>

                            <div className="space-y-0.5">
                              <span className="text-xs font-black text-slate-850 block">{tier.credits}</span>
                              <p className="text-[10px] text-slate-400 font-medium leading-relaxed">{tier.description}</p>
                            </div>

                            <ul className="space-y-2 border-t border-slate-50 pt-3 select-none">
                              {tier.features.map((feat) => (
                                <li key={feat} className="flex items-start gap-1.5 text-[10px] font-semibold text-slate-500 leading-normal">
                                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={3} stroke="currentColor" className="w-3 h-3 text-emerald-500 shrink-0 mt-0.5">
                                    <path strokeLinecap="round" strokeLinejoin="round" d="m4.5 12.75 6 6 9-13.5" />
                                  </svg>
                                  {feat}
                                </li>
                              ))}
                            </ul>
                          </div>

                          <div className="mt-4">
                            <button
                              type="button"
                              onClick={() => alert(`Payment Gateway Mock: Purchasing ${tier.name} pack.`)}
                              className={`w-full py-2.5 rounded-xl text-[10px] font-bold transition-all cursor-pointer ${
                                tier.popular
                                  ? "bg-slate-800 hover:bg-slate-900 text-white shadow-sm"
                                  : "bg-slate-50 hover:bg-slate-100 text-slate-650 border border-slate-200/60"
                              }`}
                            >
                              Choose Plan
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              ) : (
                /* Credit Transaction Logs Section */
                <div className="space-y-3 flex-1 flex flex-col overflow-hidden min-h-0">
                  <div className="flex items-center justify-between">
                    <h5 className="text-xs font-black text-slate-800 uppercase tracking-wider font-sans">Credit Transaction Logs</h5>
                    <span className="text-[10px] font-bold text-amber-600 bg-amber-50 border border-amber-100/50 px-2.5 py-0.5 rounded-full uppercase tracking-wider">Credit Logs</span>
                  </div>

                  <div className="border border-slate-100 rounded-2xl bg-white flex-1 overflow-y-auto min-h-0">
                    {profile?.transactions && profile.transactions.length > 0 ? (
                      <div className="divide-y divide-slate-100">
                        {profile.transactions.map((tx) => {
                          const isNegative = tx.amount < 0;
                          return (
                            <div key={tx.id} className="p-3.5 flex items-center justify-between gap-4 hover:bg-slate-50/50 transition-colors">
                              <div className="space-y-0.5 min-w-0">
                                <span className="text-xs font-extrabold text-slate-700 block truncate">
                                  {tx.description}
                                </span>
                                <span className="text-[9.5px] font-semibold text-slate-450 block font-mono">
                                  {formatDate(tx.createdAt)}
                                </span>
                              </div>
                              <span className={`text-xs font-black font-mono shrink-0 ${isNegative ? "text-rose-600" : "text-emerald-600"}`}>
                                {isNegative ? "" : "+"}{tx.amount.toFixed(1)} cr
                              </span>
                            </div>
                          );
                        })}
                      </div>
                    ) : (
                      <div className="p-8 text-center text-slate-400 font-semibold text-xs leading-relaxed space-y-1">
                        <p>No transactions recorded yet.</p>
                        <p className="font-medium text-[11px] text-slate-400/80">All actions that cost credits (like audits) will display their log statements here.</p>
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Footer */}
        <div className="px-6 py-4.5 border-t border-slate-100 bg-slate-50/50 flex justify-end select-none shrink-0">
          <button
            type="button"
            onClick={onClose}
            className="px-5 py-2.5 bg-slate-800 hover:bg-slate-900 text-white font-bold rounded-xl text-xs transition-all cursor-pointer shadow-sm hover:shadow"
          >
            Close Profile
          </button>
        </div>
      </div>

      <style jsx>{`
        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        @keyframes scaleUp {
          from { opacity: 0; transform: scale(0.95); }
          to { opacity: 1; transform: scale(1); }
        }
        .animate-fade-in {
          animation: fadeIn 0.2s ease-out forwards;
        }
        .animate-scale-up {
          animation: scaleUp 0.2s cubic-bezier(0.16, 1, 0.3, 1) forwards;
        }
      `}</style>
    </div>
  );
}
