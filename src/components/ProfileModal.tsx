"use client";

import { useState, useEffect, useCallback } from "react";

interface Transaction {
  id: string;
  amount: number;
  description: string;
  createdAt: string;
}

interface AiFix {
  id: string;
  websiteId: string;
  issueId: string;
  issueTitle: string;
  filePath: string;
  prUrl: string | null;
  prNumber: number | null;
  status: string;
  commitMessage: string | null;
  explanation: string | null;
  createdAt: string;
  website: {
    name: string | null;
    url: string;
  };
}

interface ProfileData {
  id: string;
  name: string | null;
  email: string;
  image: string | null;
  coins: number;
  transactions: Transaction[];
  fixes: AiFix[];
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
  const [activeTab, setActiveTab] = useState<"billing" | "fixes" | "transactions">("billing");

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

  useEffect(() => {
    if (!isOpen || !profile) return;

    // Check if any fix is pending
    const hasPending = profile.fixes.some((fix) => fix.status === "pending");
    if (!hasPending) return;

    const interval = setInterval(() => {
      fetchProfile(false);
    }, 4000);

    return () => clearInterval(interval);
  }, [isOpen, profile, fetchProfile]);

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
      credits: 50,
      price: "$2.50",
      popular: false,
      description: "Ideal for single audits and quick checks.",
    },
    {
      name: "Professional Pack",
      credits: 200,
      price: "$10.00",
      popular: true,
      description: "Best for growing sites needing active fixes.",
    },
    {
      name: "Agency Pack",
      credits: 1000,
      price: "$50.00",
      popular: false,
      description: "Designed for high volume audits & crawls.",
    },
  ];

  return (
    <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center z-[100] p-4 animate-fade-in">
      {/* Modal Container */}
      <div className="bg-white border border-slate-100 rounded-3xl shadow-2xl max-w-2xl w-full h-[620px] max-h-[90vh] flex flex-col overflow-hidden animate-slide-up">
        {/* Header */}
        <div className="p-6 border-b border-slate-100 flex items-center justify-between shrink-0 bg-slate-50/50">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-amber-500/10 border border-amber-500/20 flex items-center justify-center text-amber-600">
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-5 h-5">
                <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 6a3.75 3.75 0 1 1-7.5 0 3.75 3.75 0 0 1 7.5 0ZM4.501 20.118a7.5 7.5 0 0 1 14.998 0A17.933 17.933 0 0 1 12 21.75c-2.676 0-5.216-.584-7.499-1.632Z" />
              </svg>
            </div>
            <div>
              <h3 className="text-lg font-bold text-slate-800">User Profile & Credits</h3>
              <p className="text-[11px] font-semibold text-slate-400 mt-0.5">
                Manage your account credentials, view transactions, and purchase credits.
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-xl hover:bg-slate-100 text-slate-400 hover:text-slate-600 transition-all cursor-pointer"
          >
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor" className="w-5 h-5">
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 18 18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-6 space-y-6 flex-1 flex flex-col overflow-hidden">
          {error && (
            <div className="text-xs font-semibold text-red-600 bg-red-50 border border-red-100 rounded-xl p-3">
              {error}
            </div>
          )}

          {isLoading ? (
            /* Skeleton Loading State */
            <div className="space-y-6 animate-pulse">
              <div className="flex items-center gap-4 bg-slate-50 p-4 rounded-2xl border border-slate-100">
                <div className="w-16 h-16 rounded-full bg-slate-200"></div>
                <div className="space-y-2 flex-1">
                  <div className="h-4 bg-slate-200 rounded w-1/3"></div>
                  <div className="h-3 bg-slate-200 rounded w-1/2"></div>
                </div>
                <div className="w-24 h-10 bg-slate-200 rounded-full"></div>
              </div>
              <div className="space-y-3">
                <div className="h-4 bg-slate-200 rounded w-1/4"></div>
                <div className="grid grid-cols-3 gap-3">
                  <div className="h-32 bg-slate-100 rounded-2xl"></div>
                  <div className="h-32 bg-slate-100 rounded-2xl"></div>
                  <div className="h-32 bg-slate-100 rounded-2xl"></div>
                </div>
              </div>
              <div className="space-y-2">
                <div className="h-4 bg-slate-200 rounded w-1/4"></div>
                <div className="h-20 bg-slate-100 rounded-2xl"></div>
              </div>
            </div>
          ) : (
            <>
              {/* User Overview Section */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-slate-50/50 p-5 rounded-2xl border border-slate-100/80 shrink-0">
                <div className="flex items-center gap-4">
                  {profile?.image ? (
                    <img
                      src={profile.image}
                      alt={profile.name || "User Avatar"}
                      className="w-16 h-16 rounded-full object-cover ring-4 ring-white shadow-sm"
                      referrerPolicy="no-referrer"
                    />
                  ) : (
                    <div className="w-16 h-16 rounded-full bg-slate-800 text-white flex items-center justify-center font-extrabold text-xl ring-4 ring-white shadow-sm">
                      {getInitials()}
                    </div>
                  )}
                  <div>
                    <h4 className="text-base font-extrabold text-slate-800">
                      {profile?.name || "Active User"}
                    </h4>
                    <p className="text-xs font-semibold text-slate-400 flex items-center gap-1 mt-0.5">
                      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-3.5 h-3.5 text-slate-400">
                        <path d="M3 4a2 2 0 00-2 2v1.161l8.441 4.221a1.25 1.25 0 001.118 0L19 7.162V6a2 2 0 00-2-2H3z" />
                        <path d="M19 8.839l-7.77 3.885a2.75 2.75 0 01-2.46 0L1 8.839V14a2 2 0 002 2h14a2 2 0 002-2V8.839z" />
                      </svg>
                      {profile?.email}
                    </p>
                  </div>
                </div>

                {/* Coin Display Pill */}
                <div className="shrink-0 flex items-center gap-2.5 px-4.5 py-2.5 bg-gradient-to-r from-amber-50 to-yellow-100/60 border border-amber-250 rounded-2xl shadow-sm">
                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-5.5 h-5.5 text-amber-500 drop-shadow-xs">
                    <path fillRule="evenodd" d="M12 2.25c-5.385 0-9.75 4.365-9.75 9.75s4.365 9.75 9.75 9.75 9.75-4.365 9.75-9.75S17.385 2.25 12 2.25zM12.75 6a.75.75 0 00-1.5 0v.818a3.987 3.987 0 00-1.847.751.75.75 0 10.96 1.15 2.487 2.487 0 011.387-.419V11.25H10.5a3.75 3.75 0 000 7.5h.75v.75a.75.75 0 001.5 0v-.75h.75a3.75 3.75 0 000-7.5h-.75V8.25h.75a2.487 2.487 0 011.387.419.75.75 0 00.96-1.15A3.987 3.987 0 0012.75 6.818V6zM9 15a2.25 2.25 0 002.25 2.25h.75v-4.5h-.75A2.25 2.25 0 009 15zm4.5 2.25V12.75h.75a2.25 2.25 0 010 4.5h-.75z" clipRule="evenodd" />
                  </svg>
                  <div>
                    <span className="text-[10px] font-bold text-amber-700/80 uppercase block tracking-wider leading-none">Balance</span>
                    <span className="font-extrabold text-amber-950 font-mono text-base tracking-tight">{(profile?.coins ?? currentCoins).toFixed(1)} <span className="text-xs font-semibold">credits</span></span>
                  </div>
                </div>
              </div>

              {/* Navigation Tabs */}
              <div className="flex border-b border-slate-100 shrink-0">
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
                  onClick={() => setActiveTab("fixes")}
                  className={`pb-2.5 text-xs font-black uppercase tracking-wider border-b-2 transition-all cursor-pointer mr-6 ${
                    activeTab === "fixes"
                      ? "border-amber-500 text-slate-800"
                      : "border-transparent text-slate-400 hover:text-slate-600"
                  }`}
                >
                  AI Fixes History
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
                  {/* Buy Credits Tier Cards Section */}
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
                              ? "border-amber-400 ring-1 ring-amber-400 bg-amber-50/5"
                              : "border-slate-150"
                          }`}
                        >
                          {tier.popular && (
                            <span className="absolute -top-2.5 left-1/2 -translate-x-1/2 bg-amber-500 text-white font-extrabold text-[9px] px-2.5 py-0.5 rounded-full uppercase tracking-wider shadow-sm">
                              Best Value
                            </span>
                          )}

                          <div className="space-y-1">
                            <span className="text-xs font-bold text-slate-500 block">{tier.name}</span>
                            <div className="flex items-baseline gap-1 mt-1">
                              <span className="text-xl font-black text-slate-800">{tier.credits}</span>
                              <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">Credits</span>
                            </div>
                            <span className="text-sm font-extrabold text-slate-800 block mt-1">{tier.price}</span>
                            <p className="text-[11px] font-medium text-slate-400 mt-2 leading-normal">
                              {tier.description}
                            </p>
                          </div>

                          {/* Buy Button - Non clickable */}
                          <div className="relative mt-4">
                            <button
                              type="button"
                              disabled
                              className="w-full py-2 bg-slate-100 hover:bg-slate-200/80 text-slate-400 text-xs font-extrabold rounded-xl transition-all cursor-not-allowed border border-slate-200 flex items-center justify-center gap-1 group/btn"
                            >
                              Buy Credits
                              <span className="text-[9px] font-extrabold bg-slate-200 text-slate-500 px-1.5 py-0.5 rounded-md uppercase tracking-wider leading-none">Soon</span>
                            </button>
                            
                            {/* Hover Overlay Tooltip explaining coming soon */}
                            <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-1 px-3 py-1.5 bg-slate-900 text-white font-medium text-[10px] rounded-lg shadow-lg opacity-0 pointer-events-none group-hover:opacity-100 transition-opacity duration-200 whitespace-nowrap z-50">
                              Payment integration coming soon!
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              ) : activeTab === "fixes" ? (
                /* AI Fixes History Section */
                <div className="space-y-3 flex-1 flex flex-col overflow-hidden min-h-0">
                  <div className="flex items-center justify-between">
                    <h5 className="text-xs font-black text-slate-800 uppercase tracking-wider font-sans">AI Fixes & Status</h5>
                    <span className="text-[10px] font-bold text-teal-600 bg-teal-50 border border-teal-100/50 px-2.5 py-0.5 rounded-full uppercase tracking-wider">GitHub Integration</span>
                  </div>

                  <div className="border border-slate-100 rounded-2xl bg-white flex-1 overflow-y-auto min-h-0">
                    {profile?.fixes && profile.fixes.length > 0 ? (
                      <div className="divide-y divide-slate-100">
                        {profile.fixes.map((fix) => (
                          <div key={fix.id} className="p-4.5 space-y-3.5 hover:bg-slate-50/50 transition-colors">
                            {/* Fix Header */}
                            <div className="flex items-start justify-between gap-4">
                              <div className="space-y-1">
                                <span className="text-xs font-extrabold text-slate-800 block">
                                  {fix.issueTitle}
                                </span>
                                <span className="text-[10px] font-semibold text-slate-400 flex items-center gap-1.5">
                                  <span>Website: {fix.website.name || fix.website.url}</span>
                                  <span className="text-slate-300">•</span>
                                  <span>File: <code className="font-mono text-[9.5px] bg-slate-100 text-slate-700 px-1 py-0.5 rounded">{fix.filePath}</code></span>
                                </span>
                              </div>

                              {/* Status Tag */}
                              {fix.status === "pending" && (
                                <span className="shrink-0 inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-extrabold uppercase tracking-wider bg-amber-50 border border-amber-200 text-amber-700">
                                  <svg className="animate-spin h-3 w-3 text-amber-600" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                  </svg>
                                  Fixing...
                                </span>
                              )}
                              {fix.status === "completed" && (
                                <span className="shrink-0 inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-extrabold uppercase tracking-wider bg-emerald-50 border border-emerald-100 text-emerald-600">
                                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={3} stroke="currentColor" className="w-3 h-3">
                                    <path strokeLinecap="round" strokeLinejoin="round" d="m4.5 12.75 6 6 9-13.5" />
                                  </svg>
                                  PR Opened
                                </span>
                              )}
                              {fix.status === "failed" && (
                                <span className="shrink-0 inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-extrabold uppercase tracking-wider bg-rose-50 border border-rose-100 text-rose-600">
                                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={3} stroke="currentColor" className="w-3 h-3">
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M6 18 18 6M6 6l12 12" />
                                  </svg>
                                  Failed
                                </span>
                              )}
                            </div>

                            {/* Explanation and commit details */}
                            {fix.status !== "failed" && (fix.explanation || fix.commitMessage) && (
                              <div className="bg-slate-50 border border-slate-100/50 rounded-xl p-3.5 space-y-2 text-xs">
                                {fix.commitMessage && (
                                  <div className="flex items-start gap-1.5">
                                    <span className="font-bold text-slate-500 uppercase text-[9px] mt-0.5">Commit:</span>
                                    <span className="font-mono font-medium text-slate-600 text-[10.5px]">{fix.commitMessage}</span>
                                  </div>
                                )}
                                {fix.explanation && (
                                  <div className="flex items-start gap-1.5">
                                    <span className="font-bold text-slate-500 uppercase text-[9px] mt-0.5">Fix Explanation:</span>
                                    <p className="font-medium text-slate-600 leading-relaxed">{fix.explanation}</p>
                                  </div>
                                )}
                              </div>
                            )}

                            {fix.status === "failed" && fix.explanation && (
                              <div className="bg-rose-50/50 border border-rose-100/50 rounded-xl p-3.5 text-xs text-rose-700">
                                <span className="font-bold uppercase text-[9px] block mb-1 text-rose-850">Traceback Log:</span>
                                <p className="font-mono text-[10.5px] leading-relaxed break-all whitespace-pre-wrap">{fix.explanation}</p>
                              </div>
                            )}

                            {/* Links & metadata */}
                            <div className="flex items-center justify-between text-[10px] font-semibold">
                              <span className="text-slate-400">{formatDate(fix.createdAt)}</span>
                              {fix.prUrl && (
                                <a
                                  href={fix.prUrl}
                                  target="_blank"
                                  rel="noreferrer"
                                  className="inline-flex items-center gap-1 text-amber-600 hover:text-amber-700 font-bold hover:underline transition-all"
                                >
                                  View Pull Request
                                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor" className="w-3 h-3">
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 6H5.25A2.25 2.25 0 0 0 3 8.25v10.5A2.25 2.25 0 0 0 5.25 21h10.5A2.25 2.25 0 0 0 18 18.75V10.5m-10.5 6L21 3m0 0h-5.25M21 3v5.25" />
                                  </svg>
                                </a>
                              )}
                            </div>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <div className="p-8 text-center text-slate-400 font-semibold text-xs leading-relaxed space-y-1">
                        <p>No AI Fixes triggered yet.</p>
                        <p className="font-medium text-[11px] text-slate-400/80">Connect your GitHub repository and click "Fix with AI" on any detected issue to start automating corrections.</p>
                      </div>
                    )}
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
                      <div className="divide-y divide-slate-150">
                        {profile.transactions.map((tx) => {
                          const isDeduction = tx.amount < 0;
                          return (
                            <div key={tx.id} className="p-3.5 flex items-center justify-between text-xs hover:bg-slate-50 transition-colors">
                              <div className="flex items-center gap-3">
                                <div
                                  className={`w-8 h-8 rounded-xl flex items-center justify-center border shrink-0 ${
                                    isDeduction
                                      ? "bg-rose-50 border-rose-100 text-rose-500"
                                      : "bg-emerald-50 border-emerald-100 text-emerald-500"
                                  }`}
                                >
                                  {isDeduction ? (
                                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-4 h-4">
                                      <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 13.5 12 21m0 0-7.5-7.5M12 21V3" />
                                    </svg>
                                  ) : (
                                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-4 h-4">
                                      <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 10.5 12 3m0 0 7.5 7.5M12 3v18" />
                                    </svg>
                                  )}
                                </div>
                                <div>
                                  <span className="font-extrabold text-slate-700 block">
                                    {tx.description}
                                  </span>
                                  <span className="text-[10px] font-semibold text-slate-400 block mt-0.5">
                                    {formatDate(tx.createdAt)}
                                  </span>
                                </div>
                              </div>
                              <span
                                className={`font-mono font-black text-right shrink-0 text-sm ${
                                  isDeduction ? "text-rose-600" : "text-emerald-600"
                                }`}
                              >
                                {isDeduction ? "" : "+"}
                                {tx.amount.toFixed(1)}
                              </span>
                            </div>
                          );
                        })}
                      </div>
                    ) : (
                      <div className="p-8 text-center text-slate-400 font-semibold text-xs leading-relaxed space-y-1">
                        <p>No transactions recorded yet.</p>
                        <p className="font-medium text-[11px] text-slate-400/80">Scan new websites or use AI Auto-Fixes to track your credit usage.</p>
                      </div>
                    )}
                  </div>
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
}
