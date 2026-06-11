"use client";

import { useState, useEffect } from "react";
import { HugeiconsIcon } from "@hugeicons/react";
import {
  GithubIcon,
  Key01Icon,
  GitPullRequestIcon,
  GitBranchIcon,
} from "@hugeicons/core-free-icons";

interface GithubSettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialRepo: string;
  initialPat: string;
  onSave: (repo: string, pat: string) => Promise<void>;
}

export function GithubSettingsModal({
  isOpen,
  onClose,
  initialRepo,
  initialPat,
  onSave,
}: GithubSettingsModalProps) {
  const [repo, setRepo] = useState(initialRepo);
  const [pat, setPat] = useState(initialPat);
  const [repoList, setRepoList] = useState<string[]>([]);
  const [isFetchingRepos, setIsFetchingRepos] = useState(false);
  const [isManual, setIsManual] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showGuide, setShowGuide] = useState(true);

  // Sync state with props when modal opens
  useEffect(() => {
    if (isOpen) {
      setRepo(initialRepo);
      setPat(initialPat);
      setIsManual(!initialRepo); // If empty, start in manual or dropdown
    }
  }, [isOpen, initialRepo, initialPat]);

  // Fetch repositories list when PAT is entered/prepopulated
  useEffect(() => {
    if (isOpen && pat && pat.trim().length >= 20) {
      const loadRepos = async () => {
        setIsFetchingRepos(true);
        try {
          const res = await fetch("https://api.github.com/user/repos?per_page=100&sort=updated", {
            headers: {
              Authorization: `token ${pat.trim()}`,
              Accept: "application/vnd.github.v3+json",
            },
          });
          if (res.ok) {
            const data = await res.json();
            if (Array.isArray(data)) {
              setRepoList(data.map((r: any) => r.full_name));
            }
          } else {
            console.warn("[GitHub Settings] Failed to fetch repositories:", res.status);
            setRepoList([]);
          }
        } catch (err) {
          console.warn("[GitHub Settings] Error fetching repositories:", err);
          setRepoList([]);
        } finally {
          setIsFetchingRepos(false);
        }
      };
      loadRepos();
    } else {
      setRepoList([]);
    }
  }, [isOpen, pat]);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setIsLoading(true);

    try {
      if (!repo.trim()) {
        throw new Error("Repository path is required.");
      }
      if (!pat.trim()) {
        throw new Error("Personal Access Token is required.");
      }

      await onSave(repo.trim(), pat.trim());
      onClose();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to link repository");
    } finally {
      setIsLoading(false);
    }
  };

  // Ensure initialRepo is included in select list even if not in fetched page
  const dropdownOptions = Array.from(
    new Set(
      repo && !repoList.includes(repo) && repo !== "__manual__"
        ? [repo, ...repoList]
        : repoList
    )
  );

  return (
    <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm flex items-center justify-center z-[100] p-4" onClick={onClose}>
      <div
        className="bg-white rounded-3xl shadow-2xl max-w-xl w-full flex flex-col overflow-hidden animate-fade-in max-h-[90vh] border border-slate-200/60"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="px-7 pt-7 pb-5 border-b border-slate-100/80 shrink-0">
          <div className="flex items-start justify-between">
            <div className="flex items-center gap-3.5">
              <div className="w-11 h-11 rounded-2xl bg-slate-900 text-white flex items-center justify-center shrink-0 shadow-sm">
                <HugeiconsIcon icon={GithubIcon} size={22} />
              </div>
              <div>
                <h3 className="text-[15px] font-extrabold text-slate-850 tracking-tight">
                  Link GitHub Repository
                </h3>
                <p className="text-[11px] font-medium text-slate-400 mt-0.5 leading-snug">
                  Allow SEOBoostr to automatically open PRs to fix detected issues.
                </p>
              </div>
            </div>
            <button
              type="button"
              onClick={onClose}
              className="p-1.5 hover:bg-slate-100 text-slate-400 hover:text-slate-600 rounded-xl transition-colors cursor-pointer shrink-0 mt-0.5"
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M18 6 6 18"/><path d="m6 6 12 12"/></svg>
            </button>
          </div>
        </div>

        {/* Content Body */}
        <div className="px-7 py-5 overflow-y-auto space-y-5">
          {error && (
            <div className="text-xs font-semibold text-red-700 bg-red-50 border border-red-100/80 rounded-xl px-4 py-3 flex items-start gap-2">
              <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="shrink-0 mt-0.5 text-red-500"><circle cx="12" cy="12" r="10"/><line x1="12" x2="12" y1="8" y2="12"/><line x1="12" x2="12.01" y1="16" y2="16"/></svg>
              <span>{error}</span>
            </div>
          )}

          {/* Collapsible Setup Guide */}
          <div className="rounded-2xl overflow-hidden border border-slate-100/80">
            <button
              type="button"
              onClick={() => setShowGuide(!showGuide)}
              className="w-full px-4 py-3.5 bg-slate-50/60 flex items-center justify-between font-bold text-[11px] text-slate-600 cursor-pointer select-none hover:bg-slate-50 transition-colors"
            >
              <span className="flex items-center gap-2">
                <span className="w-6 h-6 rounded-lg bg-amber-50 border border-amber-100/60 flex items-center justify-center shrink-0">
                  <HugeiconsIcon icon={Key01Icon} size={13} className="text-amber-600" />
                </span>
                How to create a GitHub Token
              </span>
              <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={`text-slate-400 transition-transform duration-200 ${showGuide ? "rotate-180" : ""}`}><path d="m6 9 6 6 6-6"/></svg>
            </button>

            {showGuide && (
              <div className="px-5 py-4 text-xs text-slate-600 space-y-3 font-medium leading-relaxed border-t border-slate-100/60 bg-white">
                <p className="text-slate-500">
                  SEOBoostr uses a <strong className="text-slate-700">GitHub Personal Access Token (PAT)</strong> to checkout a branch, apply SEO fixes, and create a Pull Request in your repository.
                </p>
                <div className="space-y-0 ml-0.5">
                  {[
                    { step: "1", title: "Open Developer Settings", desc: "GitHub → Settings → Developer Settings → Personal Access Tokens" },
                    { step: "2", title: "Generate Token", desc: "Choose Tokens (classic) → Generate new token" },
                    { step: "3", title: "Grant Permissions", desc: "Check the repo scope (full code write & PR access)" },
                    { step: "4", title: "Copy & Paste", desc: "Copy the generated token and paste it below" },
                  ].map((s) => (
                    <div key={s.step} className="flex items-start gap-3 py-2.5 border-b border-slate-50 last:border-0">
                      <span className="w-5 h-5 rounded-lg bg-accent/8 text-accent font-black text-[10px] flex items-center justify-center shrink-0 mt-0.5 border border-accent/10">{s.step}</span>
                      <div>
                        <span className="font-bold text-slate-800 text-[11px] block leading-tight">{s.title}</span>
                        <span className="text-slate-400 text-[10.5px] leading-snug">{s.desc}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-4">
            {/* PAT Field */}
            <div className="space-y-2">
              <label className="text-[10px] font-extrabold text-slate-400 uppercase tracking-wider block">
                Personal Access Token
              </label>
              <div className="relative flex items-center">
                <div className="absolute left-3.5 text-slate-400 pointer-events-none">
                  <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect width="18" height="11" x="3" y="11" rx="2" ry="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/></svg>
                </div>
                <input
                  type="password"
                  placeholder="ghp_... or github_pat_..."
                  value={pat}
                  onChange={(e) => setPat(e.target.value)}
                  required
                  className="w-full pl-10 pr-4 py-3 text-sm font-semibold bg-slate-50/60 border border-slate-200/80 rounded-xl focus:outline-none focus:ring-2 focus:ring-accent/20 focus:border-accent/40 focus:bg-white text-slate-800 placeholder:text-slate-400 transition-all hover:border-slate-300"
                />
              </div>
              <div className="flex items-start gap-2 px-3 py-2.5 bg-emerald-50/50 border border-emerald-100/50 rounded-xl">
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16" fill="currentColor" className="w-3.5 h-3.5 text-emerald-600 shrink-0 mt-0.5">
                  <path fillRule="evenodd" d="M8 1a3.5 3.5 0 0 0-3.5 3.5V7A1.5 1.5 0 0 0 3 8.5v5A1.5 1.5 0 0 0 4.5 15h7a1.5 1.5 0 0 0 1.5-1.5v-5A1.5 1.5 0 0 0 11.5 7V4.5A3.5 3.5 0 0 0 8 1Zm2 6V4.5a2 2 0 1 0-4 0V7h4Z" clipRule="evenodd" />
                </svg>
                <span className="text-[10px] text-emerald-700 font-medium leading-relaxed">Encrypted with AES-256-CBC at the database level. Decrypted only when opening pull requests.</span>
              </div>
            </div>

            {/* Repository Field */}
            <div className="space-y-2">
              <div className="flex justify-between items-center">
                <label className="text-[10px] font-extrabold text-slate-400 uppercase tracking-wider block">
                  Repository
                </label>
                {dropdownOptions.length > 0 && (
                  <button
                    type="button"
                    onClick={() => setIsManual(!isManual)}
                    className="text-[10px] font-bold text-accent hover:text-accent-hover cursor-pointer bg-transparent border-0 select-none transition-colors"
                  >
                    {isManual ? "← Select from list" : "Enter manually →"}
                  </button>
                )}
              </div>

              {isFetchingRepos ? (
                <div className="flex items-center gap-2.5 text-xs text-slate-500 font-semibold py-3 bg-slate-50/60 border border-slate-200/60 rounded-xl px-4 select-none">
                  <svg className="animate-spin w-4 h-4 text-accent shrink-0" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                  </svg>
                  <span>Loading repositories from GitHub...</span>
                </div>
              ) : dropdownOptions.length > 0 && !isManual ? (
                <div className="relative flex items-center">
                  <div className="absolute left-3.5 text-slate-400 pointer-events-none">
                    <HugeiconsIcon icon={GitBranchIcon} size={14} />
                  </div>
                  <select
                    value={repo}
                    onChange={(e) => setRepo(e.target.value)}
                    required
                    className="w-full pl-10 pr-10 py-3 text-sm font-semibold bg-slate-50/60 border border-slate-200/80 rounded-xl focus:outline-none focus:ring-2 focus:ring-accent/20 focus:border-accent/40 focus:bg-white text-slate-800 cursor-pointer appearance-none transition-all hover:border-slate-300"
                  >
                    <option value="">-- Choose Repository --</option>
                    {dropdownOptions.map((r) => (
                      <option key={r} value={r}>
                        {r}
                      </option>
                    ))}
                  </select>
                  <div className="absolute right-3.5 pointer-events-none text-slate-400">
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-4 h-4">
                      <path fillRule="evenodd" d="M5.23 7.21a.75.75 0 011.06.02L10 11.168l3.71-3.938a.75.75 0 111.08 1.04l-4.25 4.5a.75.75 0 01-1.08 0l-4.25-4.5a.75.75 0 01.02-1.06z" clipRule="evenodd" />
                    </svg>
                  </div>
                </div>
              ) : (
                <div className="relative flex items-center">
                  <div className="absolute left-3.5 text-slate-400 pointer-events-none">
                    <HugeiconsIcon icon={GitBranchIcon} size={14} />
                  </div>
                  <input
                    type="text"
                    placeholder="e.g. octocat/hello-world"
                    value={repo}
                    onChange={(e) => setRepo(e.target.value)}
                    required
                    className="w-full pl-10 pr-4 py-3 text-sm font-semibold bg-slate-50/60 border border-slate-200/80 rounded-xl focus:outline-none focus:ring-2 focus:ring-accent/20 focus:border-accent/40 focus:bg-white text-slate-800 placeholder:text-slate-400 transition-all hover:border-slate-300"
                  />
                </div>
              )}
            </div>

            {/* Footer Buttons */}
            <div className="pt-5 border-t border-slate-100/60 flex items-center justify-end gap-2.5 shrink-0">
              <button
                type="button"
                onClick={onClose}
                disabled={isLoading}
                className="px-5 py-2.5 border border-slate-200/80 text-slate-600 rounded-xl font-bold text-xs hover:bg-slate-50 hover:border-slate-300 transition-all cursor-pointer disabled:opacity-50"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={isLoading}
                className="px-5 py-2.5 bg-accent hover:bg-accent-hover text-white rounded-xl font-extrabold text-xs transition-all cursor-pointer shadow-sm hover:shadow-md disabled:opacity-50 flex items-center gap-2 hover:-translate-y-0.5 active:translate-y-0"
              >
                {isLoading ? (
                  <>
                    <svg className="animate-spin w-3.5 h-3.5" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                    </svg>
                    <span>Saving...</span>
                  </>
                ) : (
                  <>
                    <HugeiconsIcon icon={GitPullRequestIcon} size={13} />
                    <span>Save Connection</span>
                  </>
                )}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
