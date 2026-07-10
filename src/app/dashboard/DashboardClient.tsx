"use client";

import { useState, useCallback, useEffect } from "react";
import { signOut } from "next-auth/react";
import { ScoreGauge } from "@/components/ScoreGauge";
import { IssueList } from "@/components/IssueCard";
import { ProfileModal } from "@/components/ProfileModal";
import type { ModuleResult } from "@/lib/analysis/types";
import { PageSpeedTab } from "@/components/PageSpeedTab";
import { WebsiteDropdown } from "@/components/WebsiteDropdown";
import { HugeiconsIcon } from "@hugeicons/react";
import {
  DashboardSquare01Icon,
  Settings01Icon,
  Note01Icon,
  BookOpen01Icon,
  Tag01Icon,
  Image01Icon,
  CompassIcon,
  ArtificialIntelligence01Icon,
  Target01Icon,
  FlashIcon,
  Logout01Icon,
  ActivityIcon,
  ArrowLeft01Icon,
  ArrowRight01Icon,
  Refresh01Icon,
  GithubIcon,
  Alert01Icon,
  Shield01Icon,
  Link01Icon,
  AccessibilityIcon,
  Globe02Icon,
  SmartphoneWifiIcon,
} from "@hugeicons/core-free-icons";

interface User {
  id: string;
  name?: string | null;
  email?: string | null;
  image?: string | null;
  coins: number;
  githubPat?: string | null;
  githubRepo?: string | null;
}

type TabId =
  | "overview"
  | "technical"
  | "onpage"
  | "content"
  | "schema"
  | "images"
  | "sitemap"
  | "geo"
  | "sxo"
  | "performance"
  | "pagespeed"
  | "security"
  | "links"
  | "accessibility"
  | "international"
  | "mobile";

const TABS = [
  { id: "overview" as const, label: "Overview", icon: DashboardSquare01Icon },
  { id: "technical" as const, label: "Technical SEO", icon: Settings01Icon },
  { id: "onpage" as const, label: "On-Page SEO", icon: Note01Icon },
  { id: "content" as const, label: "Content & E-E-A-T", icon: BookOpen01Icon },
  { id: "schema" as const, label: "Schema Markup", icon: Tag01Icon },
  { id: "images" as const, label: "Image Audit", icon: Image01Icon },
  { id: "sitemap" as const, label: "Sitemap Audit", icon: CompassIcon },
  {
    id: "geo" as const,
    label: "AI & GEO Visibility",
    icon: ArtificialIntelligence01Icon,
  },
  { id: "sxo" as const, label: "SXO & UX Audit", icon: Target01Icon },
  { id: "performance" as const, label: "Performance & CWV", icon: FlashIcon },
  { id: "pagespeed" as const, label: "PageSpeed Insights", icon: ActivityIcon },
  { id: "security" as const, label: "Security Headers", icon: Shield01Icon },
  { id: "links" as const, label: "Link Health", icon: Link01Icon },
  { id: "accessibility" as const, label: "Accessibility", icon: AccessibilityIcon },
  { id: "international" as const, label: "International SEO", icon: Globe02Icon },
  { id: "mobile" as const, label: "Mobile UX", icon: SmartphoneWifiIcon },
];

interface AnalysisData {
  id: string;
  status: string;
  overallScore: number;
  modules: ModuleResult[];
}

export function DashboardClient({ user }: { user: User }) {
  const [url, setUrl] = useState("");
  const [activeTab, setActiveTab] = useState<TabId>("overview");
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [isRefreshingModule, setIsRefreshingModule] = useState(false);
  const [analysis, setAnalysis] = useState<AnalysisData | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [savedWebsiteId, setSavedWebsiteId] = useState<string | null>(null);
  const [isSidebarExpanded, setIsSidebarExpanded] = useState(true);
  const [websites, setWebsites] = useState<any[]>([]);
  const isDemoMode = user.email === "demo@seoboostr.io";
  const canAddWebsite = !isDemoMode && websites.length < 10;

  // Coins State
  const [coins, setCoins] = useState<number>(user.coins);
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [theme, setTheme] = useState<"light" | "dark">("light");

  useEffect(() => {
    const savedTheme = localStorage.getItem("theme") as "light" | "dark" | null;
    const systemTheme = window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light";
    const initialTheme = savedTheme || systemTheme;
    setTheme(initialTheme);
  }, []);

  useEffect(() => {
    const emailHandle = user.email ? user.email.split("@")[0] : "";
    const displayName = user.name || emailHandle || "User";
    document.title = `${displayName}'s Dashboard — SEOBoostr`;
  }, [user]);

  const toggleTheme = () => {
    const newTheme = theme === "light" ? "dark" : "light";
    setTheme(newTheme);
    localStorage.setItem("theme", newTheme);
    if (newTheme === "dark") {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
  };

  const fetchWebsites = useCallback(async () => {
    try {
      const res = await fetch("/api/websites");
      if (res.ok) {
        const data = await res.json();
        setWebsites(data);
      }
    } catch (err) {
      console.error("Failed to fetch websites", err);
    }
  }, []);

  const handleDeleteWebsite = useCallback(async (websiteId: string) => {
    try {
      const res = await fetch(`/api/websites?id=${websiteId}`, { method: "DELETE" });
      if (!res.ok) {
        const err = await res.json();
        alert(err.error || "Failed to delete website");
        return;
      }
      // If the deleted website was selected, clear state
      if (savedWebsiteId === websiteId) {
        setSavedWebsiteId(null);
        setUrl("");
        setAnalysis(null);
      }
      await fetchWebsites();
    } catch (err) {
      console.error("Failed to delete website", err);
      alert("An error occurred while deleting the website.");
    }
  }, [savedWebsiteId, fetchWebsites]);




  // ─────────────────────────────────────────────────────────────────────────────

  const handleUpdateAnalysisModule = useCallback((updatedModule: ModuleResult & { overallScore?: number }) => {
    setAnalysis((prev) => {
      if (!prev) return null;
      const exists = prev.modules.some((m) => m.module === updatedModule.module);
      const newModules = exists
        ? prev.modules.map((m) => (m.module === updatedModule.module ? updatedModule : m))
        : [...prev.modules, updatedModule];
      return {
        ...prev,
        modules: newModules,
        overallScore: updatedModule.overallScore !== undefined ? updatedModule.overallScore : prev.overallScore,
      };
    });
  }, []);

  const handleRefreshModule = useCallback(async (moduleName: string) => {
    if (!analysis) return;
    setError(null);
    setIsRefreshingModule(true);

    try {
      const res = await fetch("/api/analyze/module", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          analysisId: analysis.id,
          module: moduleName,
        }),
      });

      const result = await res.json();
      if (!res.ok) {
        throw new Error(result.error || `Failed to refresh ${moduleName}`);
      }

      handleUpdateAnalysisModule({
        ...result.moduleResult,
        overallScore: result.overallScore,
      });

      if (result.coins !== undefined) {
        setCoins(result.coins);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong refreshing module");
    } finally {
      setIsRefreshingModule(false);
    }
  }, [analysis, handleUpdateAnalysisModule]);



  const handleAnalyze = useCallback(async (options?: { resume?: boolean; targetUrl?: string }) => {
    const urlToAnalyze = (options?.targetUrl ?? url).trim();
    if (!urlToAnalyze) return;
    setError(null);
    setIsAnalyzing(true);
    setAnalysis(null);
    if (options?.targetUrl) {
      setUrl(options.targetUrl);
    }

    try {
      // Step 1: Save website
      const saveRes = await fetch("/api/websites", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ url: urlToAnalyze }),
      });

      if (!saveRes.ok) {
        const err = await saveRes.json();
        throw new Error(err.error || "Failed to save website");
      }

      const website = await saveRes.json();
      setSavedWebsiteId(website.id);
      localStorage.setItem(`last_website_${user.email}`, website.url);

      // Step 2: Run analysis
      const analyzeRes = await fetch("/api/analyze", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ websiteId: website.id, resume: options?.resume ?? false }),
      });

      const result = await analyzeRes.json();

      if (!analyzeRes.ok) {
        throw new Error(result.error || "Analysis failed");
      }

      setAnalysis(result);
      if (result.coins !== undefined) {
        setCoins(result.coins);
      }
      fetchWebsites();

      // Automatically refresh PageSpeed data for the new analysis if the API key is configured
      try {
        const pagespeedRes = await fetch("/api/pagespeed", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ analysisId: result.id }),
        });
        if (pagespeedRes.ok) {
          const pagespeedModule = await pagespeedRes.json();
          setAnalysis((prev) => {
            if (!prev || prev.id !== result.id) return prev;
            const exists = prev.modules.some((m) => m.module === "pagespeed");
            const newModules = exists
              ? prev.modules.map((m) => (m.module === "pagespeed" ? pagespeedModule : m))
              : [...prev.modules, pagespeedModule];
            return {
              ...prev,
              modules: newModules,
            };
          });
        }
      } catch (err) {
        console.warn("[PageSpeed] Automatic background refresh failed:", err);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong");
    } finally {
      setIsAnalyzing(false);
    }
  }, [url, user.email, fetchWebsites]);

  const handleSelectWebsite = useCallback(
    async (websiteId: string) => {
      if (!websiteId) {
        setSavedWebsiteId(null);
        setUrl("");
        setAnalysis(null);
        return;
      }

      const selected = websites.find((w) => w.id === websiteId);
      if (selected) {
        setSavedWebsiteId(selected.id);
        setUrl(selected.url);
        localStorage.setItem(`last_website_${user.email}`, selected.url);

        if (selected.analyses && selected.analyses.length > 0) {
          const latest = selected.analyses[0];
          if (latest.status === "completed") {
            setIsAnalyzing(true);
            try {
              const res = await fetch(`/api/results/${latest.id}`);
              if (res.ok) {
                const fullAnalysis = await res.json();
                setAnalysis(fullAnalysis);
                setError(null);
              }
            } catch (err) {
              console.error("Failed to load selected analysis", err);
            } finally {
              setIsAnalyzing(false);
            }
          } else {
            setAnalysis(null);
          }
        } else {
          setAnalysis(null);
        }
      }
    },
    [websites, user.email]
  );

  const fetchUserProfileStatus = useCallback(async () => {
    try {
      const res = await fetch("/api/user/profile");
      if (res.ok) {
        const data = await res.json();
        if (data.coins !== undefined) {
          setCoins(data.coins);
        }
      }
    } catch (err) {
      console.error("Failed to fetch user profile status in dashboard", err);
    }
  }, []);

  useEffect(() => {
    fetchUserProfileStatus();
    const interval = setInterval(fetchUserProfileStatus, 8000);
    return () => clearInterval(interval);
  }, [fetchUserProfileStatus]);

  const getModuleResult = (name: string): ModuleResult | undefined => {
    return analysis?.modules?.find((m) => m.module === name);
  };

  // Fetch initial websites and load initial/last-selected target on mount
  useEffect(() => {
    const loadInitialWebsite = async () => {
      const landingScannedUrl = localStorage.getItem("seoboostr_last_scanned_url");
      let targetUrl = landingScannedUrl || localStorage.getItem(`last_website_${user.email}`);
      
      if (!targetUrl && user.email === "demo@seoboostr.io") {
        targetUrl = "https://rasid.in";
      }

      if (landingScannedUrl) {
        localStorage.removeItem("seoboostr_last_scanned_url");
      }

      if (targetUrl) {
        // Ensure proper protocol
        if (!/^https?:\/\//i.test(targetUrl)) {
          targetUrl = "https://" + targetUrl;
        }
        setUrl(targetUrl);
      }

      if (!targetUrl) {
        setIsAnalyzing(false);
        return;
      }

      setIsAnalyzing(true);
      try {
        const res = await fetch("/api/websites");
        if (res.ok) {
          const list = await res.json();
          setWebsites(list);

          const matchingSite = list.find(
            (w: any) =>
              w.url.toLowerCase() === targetUrl!.toLowerCase() ||
              w.url.toLowerCase().includes(targetUrl!.toLowerCase()) ||
              targetUrl!.toLowerCase().includes(w.url.toLowerCase())
          );

          if (matchingSite) {
            setSavedWebsiteId(matchingSite.id);
            localStorage.setItem(`last_website_${user.email}`, matchingSite.url);

            if (matchingSite.analyses && matchingSite.analyses.length > 0) {
              const latestAnalysis = matchingSite.analyses[0];
              if (latestAnalysis.status === "completed") {
                const resultsRes = await fetch(`/api/results/${latestAnalysis.id}`);
                if (resultsRes.ok) {
                  const fullAnalysis = await resultsRes.json();
                  setAnalysis(fullAnalysis);
                  setIsAnalyzing(false);
                  return;
                }
              }
            }
          } else {
            // Auto-register and run crawl for the scanned URL if not registered
            const localResultsStr = localStorage.getItem("seoboostr_last_scanned_results");
            let initialResults = null;
            if (localResultsStr) {
              try {
                initialResults = JSON.parse(localResultsStr);
              } catch (e) {
                console.error("Failed to parse local scan results:", e);
              }
            }

            const saveRes = await fetch("/api/websites", {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({ url: targetUrl, initialResults }),
            });

            if (saveRes.ok) {
              const website = await saveRes.json();
              setSavedWebsiteId(website.id);
              localStorage.setItem(`last_website_${user.email}`, website.url);

              if (initialResults) {
                localStorage.removeItem("seoboostr_last_scanned_results");
                const updatedListRes = await fetch("/api/websites");
                if (updatedListRes.ok) {
                  const newList = await updatedListRes.json();
                  setWebsites(newList);
                  const matchingSite = newList.find((w: any) => w.id === website.id);
                  if (matchingSite && matchingSite.analyses && matchingSite.analyses.length > 0) {
                    const latestAnalysis = matchingSite.analyses[0];
                    const resultsRes = await fetch(`/api/results/${latestAnalysis.id}`);
                    if (resultsRes.ok) {
                      const fullAnalysis = await resultsRes.json();
                      setAnalysis(fullAnalysis);
                      setIsAnalyzing(false);
                      return;
                    }
                  }
                }
              }

              const analyzeRes = await fetch("/api/analyze", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ websiteId: website.id }),
              });

              if (analyzeRes.ok) {
                const result = await analyzeRes.json();
                setAnalysis(result);
                // Refresh list
                const updatedListRes = await fetch("/api/websites");
                if (updatedListRes.ok) {
                  setWebsites(await updatedListRes.json());
                }
                setIsAnalyzing(false);
                return;
              } else {
                const errResult = await analyzeRes.json();
                setError(errResult.error || "Analysis failed");
              }
            } else {
              const errResult = await saveRes.json();
              setError(errResult.error || "Failed to save website");
              localStorage.removeItem("seoboostr_last_scanned_results");
              setIsAnalyzing(false);
              return;
            }
          }
        }
      } catch (err) {
        console.error("Mount loading error:", err);
      } finally {
        setIsAnalyzing(false);
      }
    };

    loadInitialWebsite();
  }, [user.email, fetchWebsites]);

  return (
    <div className="h-screen flex flex-col bg-transparent text-foreground font-sans overflow-hidden">
      {/* Premium Header */}
      <header className="border-b border-border bg-white/85 backdrop-blur-md shadow-sm shrink-0 z-50 flex items-center h-16 justify-between relative">
        {/* Brand Container - Aligned with Left Sidebar width */}
        <div
          className={`h-full flex items-center px-4 md:px-6 md:border-r border-border shrink-0 transition-all duration-300 relative ${isSidebarExpanded ? "md:w-64" : "md:w-[68px] md:justify-center md:px-0"
            } w-auto`}
        >
          <div className="flex items-center gap-2.5">
            <img src="/logo.png" alt="SEOBoostr" className="w-9 h-9 rounded-xl shrink-0 object-contain" />
            {isSidebarExpanded && (
              <span className="text-xl font-black tracking-tight text-slate-800 animate-fade-in whitespace-nowrap hidden md:inline">
                SEOBoostr
              </span>
            )}
          </div>

          {/* Premium Collapse/Expand Trigger */}
          <button
            onClick={() => setIsSidebarExpanded(!isSidebarExpanded)}
            className="hidden md:flex items-center justify-center w-6 h-6 rounded-full text-slate-400 hover:text-slate-600 hover:bg-slate-50 border border-slate-200 shadow-sm transition-all cursor-pointer bg-white absolute right-[-12px] top-1/2 -translate-y-1/2 z-50"
            title={isSidebarExpanded ? "Collapse Sidebar" : "Expand Sidebar"}
          >
            <HugeiconsIcon
              icon={isSidebarExpanded ? ArrowLeft01Icon : ArrowRight01Icon}
              size={12}
            />
          </button>
        </div>

        {/* Header Content Bar */}
        <div className="flex-1 h-full px-4 md:px-6 flex items-center justify-end gap-2.5 md:gap-4">

          <div className="flex items-center gap-3 md:gap-4 shrink-0">
            {/* Theme Toggle Button */}
            <button
              onClick={toggleTheme}
              className="flex items-center justify-center w-8 h-8 rounded-full bg-slate-50 hover:bg-slate-100 border border-slate-200 text-slate-500 hover:text-slate-700 shadow-xs transition-all cursor-pointer bg-white"
              title={theme === "light" ? "Switch to Dark Mode" : "Switch to Light Mode"}
            >
              {theme === "light" ? (
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" className="w-4 h-4 text-slate-600">
                  <path d="M12 3a6 6 0 0 0 9 9 9 9 0 1 1-9-9Z" />
                </svg>
              ) : (
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" className="w-4 h-4 text-yellow-500 fill-yellow-500/20">
                  <circle cx="12" cy="12" r="4" />
                  <path d="M12 2v2M12 20v2M4.93 4.93l1.41 1.41M17.66 17.66l1.41 1.41M2 12h2M20 12h2M6.34 17.66l-1.41 1.41M19.07 4.93l-1.41 1.41" />
                </svg>
              )}
            </button>

            {/* Coins Indicator for Header with Tooltip */}
            <div className="relative group">
              <div className="flex items-center gap-2 px-3 py-1.5 bg-gradient-to-r from-amber-50 to-yellow-100/50 border border-amber-200 rounded-full text-xs font-bold text-amber-800 shadow-sm transition-all hover:border-amber-300 select-none cursor-help">
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-4.5 h-4.5 text-amber-500 drop-shadow-xs">
                  <path fillRule="evenodd" d="M12 2.25c-5.385 0-9.75 4.365-9.75 9.75s4.365 9.75 9.75 9.75 9.75-4.365 9.75-9.75S17.385 2.25 12 2.25zM12.75 6a.75.75 0 00-1.5 0v.818a3.987 3.987 0 00-1.847.751.75.75 0 10.96 1.15 2.487 2.487 0 011.387-.419V11.25H10.5a3.75 3.75 0 000 7.5h.75v.75a.75.75 0 001.5 0v-.75h.75a3.75 3.75 0 000-7.5h-.75V8.25h.75a2.487 2.487 0 011.387.419.75.75 0 00.96-1.15A3.987 3.987 0 0012.75 6.818V6zM9 15a2.25 2.25 0 002.25 2.25h.75v-4.5h-.75A2.25 2.25 0 009 15zm4.5 2.25V12.75h.75a2.25 2.25 0 010 4.5h-.75z" clipRule="evenodd" />
                </svg>
                <span className="font-extrabold text-amber-900 font-mono tracking-tight">{coins.toFixed(1)}</span>
              </div>

              {/* Tooltip Content */}
              <div className="absolute right-0 top-full mt-2 w-64 p-4 bg-white border border-slate-200 rounded-xl shadow-lg opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-[100] text-xs text-slate-600 font-normal leading-relaxed pointer-events-auto">
                <div className="font-bold text-slate-850 mb-2 border-b border-slate-100 pb-1 flex justify-between items-center text-amber-800">
                  <span>Credit Usage Guide</span>
                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4 text-amber-500 drop-shadow-xs">
                    <path fillRule="evenodd" d="M12 2.25c-5.385 0-9.75 4.365-9.75 9.75s4.365 9.75 9.75 9.75 9.75-4.365 9.75-9.75S17.385 2.25 12 2.25zM12.75 6a.75.75 0 00-1.5 0v.818a3.987 3.987 0 00-1.847.751.75.75 0 10.96 1.15 2.487 2.487 0 011.387-.419V11.25H10.5a3.75 3.75 0 000 7.5h.75v.75a.75.75 0 001.5 0v-.75h.75a3.75 3.75 0 000-7.5h-.75V8.25h.75a2.487 2.487 0 011.387.419.75.75 0 00.96-1.15A3.987 3.987 0 0012.75 6.818V6zM9 15a2.25 2.25 0 002.25 2.25h.75v-4.5h-.75A2.25 2.25 0 009 15zm4.5 2.25V12.75h.75a2.25 2.25 0 010 4.5h-.75z" clipRule="evenodd" />
                  </svg>
                </div>
                <div className="space-y-1.5">
                  <div className="flex justify-between">
                    <span className="text-slate-500 font-medium">Page Scan</span>
                    <span className="font-semibold text-slate-800">1.0 cr / page</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-500 font-medium">Refresh Audit</span>
                    <span className="font-semibold text-slate-800">0.5 cr / scan</span>
                  </div>
                  <div className="pt-2 mt-1 border-t border-dashed border-slate-100">
                    <span className="block font-bold text-slate-400 text-[10px] uppercase tracking-wider mb-1">AI Auto-Fixes</span>
                    <div className="space-y-1">
                      <div className="flex justify-between">
                        <span className="text-slate-500 font-medium">Critical Issue</span>
                        <span className="font-semibold text-red-600">1.5 cr</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-slate-500 font-medium">High Issue</span>
                        <span className="font-semibold text-orange-600">1.0 cr</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-slate-500 font-medium">Medium Issue</span>
                        <span className="font-semibold text-amber-600">.75 cr</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-slate-500 font-medium">Low Issue</span>
                        <span className="font-semibold text-sky-600">0.5 cr</span>
                      </div>
                    </div>
                  </div>

                  {/* Buy Credits option in tooltip */}
                  <div className="pt-3 mt-3 border-t border-slate-100 relative group/buy text-left">
                    <button
                      type="button"
                      disabled
                      className="w-full py-2 bg-amber-500/10 hover:bg-amber-500/20 text-amber-800 text-[10px] font-extrabold rounded-lg transition-all cursor-not-allowed border border-amber-200/50 flex items-center justify-center gap-1.5"
                    >
                      Buy Credits
                      <span className="text-[8px] font-extrabold bg-amber-500 text-white px-1.5 py-0.5 rounded-md uppercase tracking-wider leading-none">Soon</span>
                    </button>
                    <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-1.5 px-2.5 py-1.5 bg-slate-900 text-white font-medium text-[9px] rounded-lg shadow-lg opacity-0 pointer-events-none group-hover/buy:opacity-100 transition-opacity duration-200 whitespace-nowrap z-50">
                    Payment integration coming soon!
                  </div>
                </div>
              </div>
            </div>
          </div>

            {/* Clickable Profile Tab/Icon */}
            <button
              onClick={() => setIsProfileOpen(true)}
              className="flex items-center hover:opacity-85 transition-opacity shrink-0 cursor-pointer focus:outline-none focus:ring-2 focus:ring-accent/40 rounded-full"
              title="View Profile Details & Credits"
            >
              {user.image ? (
                <img
                  src={user.image}
                  alt={user.name || "User Avatar"}
                  className="w-8 h-8 rounded-full ring-2 ring-slate-100 object-cover"
                  referrerPolicy="no-referrer"
                />
              ) : (
                <div className="w-8 h-8 rounded-full bg-slate-800 text-white flex items-center justify-center font-bold text-xs ring-2 ring-slate-100 shadow-xs">
                  {user.name ? user.name.slice(0, 2).toUpperCase() : user.email?.slice(0, 2).toUpperCase() || "US"}
                </div>
              )}
            </button>
            <button
              onClick={() => signOut({ callbackUrl: "/" })}
              className="flex items-center gap-1.5 px-2 py-1.5 sm:px-3 border border-border rounded-lg text-xs font-semibold text-muted-foreground hover:text-danger hover:border-danger/30 hover:bg-danger/5 transition-all cursor-pointer"
            >
              <HugeiconsIcon icon={Logout01Icon} size={14} />
              <span className="hidden sm:inline">Sign out</span>
            </button>
          </div>
        </div>
      </header>

      {/* Main Workspace */}
      <div className="flex-1 flex overflow-hidden">
        {/* Left Sidebar (Vertical Navigation Tabs) - Desktop Only */}
        <aside
          className={`border-r border-border bg-white shrink-0 hidden md:flex flex-col justify-between overflow-y-auto transition-all duration-300 ${isSidebarExpanded ? "w-64" : "w-[68px]"
            }`}
        >
          <div className="p-3 flex flex-col gap-1.5">
            {/* Website Selector Dropdown in Sidebar */}
            {isSidebarExpanded && (
              <div className="px-3.5 mb-3 mt-1">
                <div className="flex justify-between items-center mb-1.5">
                  <div className="flex items-center gap-1.5">
                    <label className="text-[10px] font-extrabold text-slate-400 uppercase tracking-wider block">
                      Select Website
                    </label>
                    {websites.length > 0 && (
                      <span className="text-[9px] font-bold text-slate-400 bg-slate-100 px-1.5 py-0.5 rounded-md">
                        {websites.length}/10
                      </span>
                    )}
                  </div>
                </div>
                {websites.length > 0 ? (
                  <WebsiteDropdown
                    websites={websites}
                    selectedId={savedWebsiteId}
                    onSelect={handleSelectWebsite}
                    onRenameSuccess={fetchWebsites}
                    onDelete={handleDeleteWebsite}
                    isDemoMode={isDemoMode}
                    onAnalyze={async (targetUrl) => {
                      await handleAnalyze({ targetUrl });
                    }}
                    isAnalyzing={isAnalyzing}
                  />
                ) : (
                  !isDemoMode && (
                    <button
                      onClick={() => {
                        setSavedWebsiteId(null);
                        setUrl("");
                        setAnalysis(null);
                      }}
                      className="w-full py-2.5 bg-slate-50 hover:bg-slate-100 border border-dashed border-slate-350 hover:border-slate-400 rounded-xl text-xs font-bold text-slate-655 transition-all cursor-pointer flex items-center justify-center gap-1"
                    >
                      <span>+ Connect Website</span>
                    </button>
                  )
                )}
              </div>
            )}

            {isSidebarExpanded && (
              <p className="text-[10px] font-extrabold text-slate-400 uppercase tracking-wider px-3.5 mb-2">
                SEO Audit Sections
              </p>
            )}

            {/* Vertical Tabs */}
            {TABS.map((tab) => {
              const Icon = tab.icon;
              const moduleResult =
                tab.id !== "overview" ? getModuleResult(tab.id) : null;
              const isActive = activeTab === tab.id;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  title={!isSidebarExpanded ? tab.label : undefined}
                  className={`w-full relative flex items-center rounded-xl text-sm font-bold transition-all text-left cursor-pointer group ${isSidebarExpanded
                    ? `justify-between px-3.5 py-2.5 ${isActive
                      ? "bg-accent-xlight text-accent border-l-4 border-accent pl-3 shadow-[inset_0_0_0_1px_rgba(15,118,110,0.05)]"
                      : "text-slate-600 hover:text-slate-900 hover:bg-slate-50 pl-4 border-l-4 border-transparent"
                    }`
                    : `justify-center py-3 ${isActive
                      ? "bg-accent-xlight text-accent shadow-[inset_0_0_0_1px_rgba(15,118,110,0.05)]"
                      : "text-slate-600 hover:bg-slate-50"
                    }`
                    }`}
                >
                  <div className="flex items-center gap-2.5">
                    <HugeiconsIcon
                      icon={Icon}
                      size={18}
                      className={
                        isActive
                          ? "text-accent"
                          : "text-slate-400 group-hover:text-slate-600"
                      }
                    />
                    {isSidebarExpanded && (
                      <span className="truncate whitespace-nowrap animate-fade-in">
                        {tab.label}
                      </span>
                    )}
                  </div>
                  {isSidebarExpanded && moduleResult && (
                    <span
                      className={`text-xs px-2 py-0.5 font-extrabold rounded-full border transition-all ${isActive
                        ? "bg-accent-light text-accent border-accent/20"
                        : moduleResult.score >= 80
                          ? "bg-success-light text-success border-success-light"
                          : moduleResult.score >= 60
                            ? "bg-warning-light text-warning border-warning-light"
                            : "bg-danger-light text-danger border-danger-light"
                        }`}
                    >
                      {moduleResult.score}
                    </span>
                  )}
                  {!isSidebarExpanded && moduleResult && (
                    <div
                      className={`w-2 h-2 rounded-full absolute right-2.5 top-1/2 -translate-y-1/2 border-2 border-white ${moduleResult.score >= 80
                        ? "bg-success"
                        : moduleResult.score >= 60
                          ? "bg-warning"
                          : "bg-danger"
                        }`}
                    />
                  )}
                </button>
              );
            })}
          </div>
        </aside>

        {/* Scrollable Content Container */}
        <main className="flex-1 overflow-y-auto bg-slate-50/30 p-4 md:p-8">
          <div className="w-full space-y-6">

            {/* Horizontal Scrollable Tabs - Mobile Only */}
            <div className="md:hidden overflow-x-auto scrollbar-none flex gap-2 pb-3 border-b border-border">
              {TABS.map((tab) => {
                const Icon = tab.icon;
                const moduleResult =
                  tab.id !== "overview" ? getModuleResult(tab.id) : null;
                const isActive = activeTab === tab.id;
                return (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-bold shrink-0 transition-all cursor-pointer ${isActive
                      ? "bg-accent text-white shadow-sm"
                      : "bg-white border border-border text-slate-600 hover:bg-slate-50"
                      }`}
                  >
                    <HugeiconsIcon icon={Icon} size={14} />
                    <span>{tab.label.split(" ")[0]}</span>
                    {moduleResult && (
                      <span className={`text-[10px] px-1.5 py-0.2 rounded-full font-extrabold ${isActive ? "bg-white/20 text-white" : "bg-slate-100 text-slate-600"
                        }`}>
                        {moduleResult.score}
                      </span>
                    )}
                  </button>
                );
              })}
            </div>

            {/* Mobile/Tablet Scan Controls - Visible when Sidebar is Hidden */}
            <div className="md:hidden bg-card border border-border rounded-2xl p-5 shadow-sm space-y-4">
              {/* Coins Balance Indicator (Mobile) */}
              <div className="grid grid-cols-1 gap-3 pb-1">
                <div className="px-3.5 py-2 bg-gradient-to-r from-amber-50 to-yellow-100/50 border border-amber-200 rounded-xl flex items-center gap-2.5 shadow-sm select-none">
                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5 text-amber-500 drop-shadow-xs">
                    <path fillRule="evenodd" d="M12 2.25c-5.385 0-9.75 4.365-9.75 9.75s4.365 9.75 9.75 9.75 9.75-4.365 9.75-9.75S17.385 2.25 12 2.25zM12.75 6a.75.75 0 00-1.5 0v.818a3.987 3.987 0 00-1.847.751.75.75 0 10.96 1.15 2.487 2.487 0 011.387-.419V11.25H10.5a3.75 3.75 0 000 7.5h.75v.75a.75.75 0 001.5 0v-.75h.75a3.75 3.75 0 000-7.5h-.75V8.25h.75a2.487 2.487 0 011.387.419.75.75 0 00.96-1.15A3.987 3.987 0 0012.75 6.818V6zM9 15a2.25 2.25 0 002.25 2.25h.75v-4.5h-.75A2.25 2.25 0 009 15zm4.5 2.25V12.75h.75a2.25 2.25 0 010 4.5h-.75z" clipRule="evenodd" />
                  </svg>
                  <div className="flex flex-col">
                    <span className="text-[9px] font-extrabold text-amber-700 uppercase tracking-wider">Credits</span>
                    <span className="text-xs font-black text-amber-950 font-mono">
                      {coins.toFixed(1)}
                    </span>
                  </div>
                </div>
              </div>

              {/* Dropdown Selector */}
              {websites.length > 0 ? (
                <div className="space-y-1.5">
                  <div className="flex justify-between items-center">
                    <div className="flex items-center gap-1.5">
                      <label className="text-[10px] font-extrabold text-slate-400 uppercase tracking-wider block">
                        Select Website
                      </label>
                      {websites.length > 0 && (
                        <span className="text-[9px] font-bold text-slate-400 bg-slate-100 px-1.5 py-0.5 rounded-md">
                          {websites.length}/10
                        </span>
                      )}
                    </div>
                  </div>
                  <WebsiteDropdown
                    websites={websites}
                    selectedId={savedWebsiteId}
                    onSelect={handleSelectWebsite}
                    onRenameSuccess={fetchWebsites}
                    onDelete={handleDeleteWebsite}
                    isDemoMode={isDemoMode}
                    onAnalyze={async (targetUrl) => {
                      await handleAnalyze({ targetUrl });
                    }}
                    isAnalyzing={isAnalyzing}
                  />
                </div>
              ) : (
                !isDemoMode && (
                  <div className="space-y-1.5">
                    <label className="text-[10px] font-extrabold text-slate-400 uppercase tracking-wider block">
                      Select Website
                    </label>
                    <button
                      onClick={() => {
                        setSavedWebsiteId(null);
                        setUrl("");
                        setAnalysis(null);
                      }}
                      className="w-full py-2 bg-slate-50 hover:bg-slate-100 border border-dashed border-slate-300 rounded-xl text-xs font-bold text-slate-655 transition-all cursor-pointer flex items-center justify-center gap-1"
                    >
                      <span>+ Connect Website</span>
                    </button>
                  </div>
                )
              )}



              {error && (
                <div className="text-xs text-danger bg-danger/5 border border-danger/20 rounded-xl px-3 py-2.5 font-semibold flex items-start gap-2">
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-4 h-4 text-rose-500 shrink-0 mt-0.5">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126ZM12 15.75h.007v.008H12v-.008Z" />
                  </svg>
                  <span>{error}</span>
                </div>
              )}
            </div>

            {/* Desktop Error Banner */}
            {error && (
              <div className="hidden md:flex text-sm text-danger bg-danger/5 border border-danger/20 rounded-xl px-4 py-3 font-semibold shadow-sm items-center gap-2">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-4.5 h-4.5 text-rose-500 shrink-0">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126ZM12 15.75h.007v.008H12v-.008Z" />
                </svg>
                <span>{error}</span>
              </div>
            )}

            {/* Loading Progress State */}
            {isAnalyzing && (
              <div className="bg-card border border-border rounded-2xl p-10 text-center shadow-sm">
                <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-accent/10 text-accent mb-4 border border-accent/20">
                  <svg
                    className="animate-spin w-6 h-6"
                    viewBox="0 0 24 24"
                    fill="none"
                  >
                    <circle
                      cx="12"
                      cy="12"
                      r="10"
                      stroke="currentColor"
                      strokeWidth="3"
                      className="opacity-20"
                    />
                    <path
                      d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"
                      fill="currentColor"
                    />
                  </svg>
                </div>
                <h3 className="text-lg font-bold text-slate-800 mb-1">
                  Analyzing website SEO...
                </h3>
                <p className="text-slate-500 text-sm max-w-sm mx-auto mb-6 font-semibold">
                  Running sitemaps, schemas, metadata, images, and performance audits in parallel.
                </p>
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-3 max-w-3xl mx-auto">
                  {TABS.filter((t) => t.id !== "overview").map((tab) => {
                    const Icon = tab.icon;
                    return (
                      <div
                        key={tab.id}
                        className="bg-slate-50 border border-slate-100 rounded-xl px-4 py-3 text-xs text-slate-500 animate-pulse-soft flex items-center justify-center gap-2 font-bold"
                      >
                        <HugeiconsIcon icon={Icon} size={16} />
                        <span>{tab.label.split(" ")[0]}</span>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}

            {/* Content View */}
            {!isAnalyzing && (
              <>
                {analysis ? (
                  <div className="animate-fade-in">
                    {activeTab === "overview" ? (
                      <OverviewTab
                        analysis={analysis}
                        onRefresh={handleAnalyze}
                        isRefreshing={isAnalyzing}
                        currentCoins={coins}
                        isDemoMode={user.email === "demo@seoboostr.io"}
                      />
                    ) : activeTab === "pagespeed" ? (
                      <PageSpeedTab
                        analysisId={analysis.id}
                        websiteUrl={url}
                        initialResult={getModuleResult("pagespeed")}
                        onUpdateAnalysis={handleUpdateAnalysisModule}
                      />
                    ) : (
                      <ModuleTab
                        result={getModuleResult(activeTab)}
                        moduleName={
                          TABS.find((t) => t.id === activeTab)?.label || activeTab
                        }
                        onRefreshModule={handleRefreshModule}
                        isRefreshing={isRefreshingModule}
                        currentCoins={coins}
                        isDemoMode={user.email === "demo@seoboostr.io"}
                      />
                    )}
                  </div>
                ) : (
                  /* Empty state — Premium Scanner */
                  <div className="max-w-3xl mx-auto my-8 animate-fade-in">
                    {/* Hero Card */}
                    <div className="relative overflow-hidden bg-white rounded-3xl shadow-sm border border-slate-200/80">
                      {/* Subtle dot pattern */}
                      <div className="absolute inset-0 opacity-[0.03]" style={{
                        backgroundImage: `radial-gradient(circle at 1px 1px, var(--dot-grid-dashboard) 0.5px, transparent 0)`,
                        backgroundSize: '20px 20px',
                      }} />
                      {/* Very subtle corner glow */}
                      <div className="absolute -top-20 -right-20 w-48 h-48 bg-teal-100/40 rounded-full blur-[60px]" />

                      <div className="relative z-10 px-8 pt-10 pb-9 sm:px-12">
                        {/* Badge + Title */}
                        <div className="flex items-center gap-2.5 mb-3">
                          <img src="/logo.png" alt="SEOBoostr" className="w-9 h-9 rounded-xl object-contain" />
                          <span className="text-[9px] font-black text-accent uppercase tracking-[0.18em] bg-accent/5 border border-accent/10 px-2.5 py-1 rounded-full">SEO Analyzer</span>
                        </div>
                        <h3 className="text-2xl sm:text-[28px] font-black text-slate-850 mb-2 tracking-tight leading-tight">
                          Analyze Your Website's{" "}
                          <span className="text-accent">SEO Health</span>
                        </h3>
                        <p className="text-[13px] text-slate-500 max-w-lg font-medium leading-relaxed mb-7">
                          Run a comprehensive 15-module audit covering technical SEO, content quality, schema markup, Core Web Vitals, security headers, accessibility, and more.
                        </p>

                        {/* URL Input Area */}
                        <div className="bg-slate-50/80 border border-slate-200/60 rounded-2xl p-2 mb-7">
                          <div className="flex gap-2">
                            <div className="flex-1 relative">
                              <div className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400">
                                <svg xmlns="http://www.w3.org/2000/svg" width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10" /><path d="M2 12h20" /><path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z" /></svg>
                              </div>
                              <input
                                type="url"
                                value={url}
                                onChange={(e) => setUrl(e.target.value)}
                                onKeyDown={(e) => e.key === "Enter" && handleAnalyze()}
                                placeholder="https://example.com"
                                className="w-full bg-white border border-slate-200/80 rounded-xl text-sm font-semibold text-slate-800 placeholder-slate-400 pl-11 pr-4 py-3.5 focus:outline-none focus:ring-2 focus:ring-accent/25 focus:border-accent/40 transition-all hover:border-slate-300"
                                disabled={isAnalyzing || !canAddWebsite}
                              />
                            </div>
                            <button
                              onClick={() => handleAnalyze()}
                              disabled={isAnalyzing || !url.trim()}
                              className="px-7 py-3.5 bg-accent hover:bg-accent-hover text-white font-extrabold rounded-xl text-sm transition-all disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer shrink-0 shadow-sm hover:shadow-md hover:-translate-y-0.5 active:translate-y-0 flex items-center gap-2"
                            >
                              {isAnalyzing ? (
                                <>
                                  <svg className="animate-spin w-4 h-4" fill="none" viewBox="0 0 24 24">
                                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                                  </svg>
                                  <span>Analyzing...</span>
                                </>
                              ) : (
                                <>
                                  <svg xmlns="http://www.w3.org/2000/svg" width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2" /></svg>
                                  <span>Run Analysis</span>
                                </>
                              )}
                            </button>
                          </div>
                        </div>

                        {/* Feature Grid */}
                        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                          {[
                            { icon: Settings01Icon, label: "Technical SEO", desc: "Crawl & index", color: "text-indigo-500" },
                            { icon: FlashIcon, label: "Core Web Vitals", desc: "LCP, CLS, INP", color: "text-amber-500" },
                            { icon: BookOpen01Icon, label: "Content & E-E-A-T", desc: "Quality signals", color: "text-emerald-500" },
                            { icon: ArtificialIntelligence01Icon, label: "AI Visibility", desc: "GEO readiness", color: "text-teal-500" },
                          ].map((f) => {
                            const Icon = f.icon;
                            return (
                              <div key={f.label} className="bg-slate-50/60 hover:bg-slate-50 border border-slate-100 rounded-xl px-3.5 py-3 transition-all cursor-default flex flex-col items-start gap-1">
                                <HugeiconsIcon icon={Icon} size={18} className={`mb-1.5 ${f.color}`} />
                                <p className="text-[11px] font-bold text-slate-700 leading-tight">{f.label}</p>
                                <p className="text-[10px] font-medium text-slate-400 mt-0.5">{f.desc}</p>
                              </div>
                            );
                          })}
                        </div>
                      </div>
                    </div>

                    {/* Bottom Trust Bar */}
                    <div className="flex items-center justify-center gap-6 mt-5 text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                      <span className="flex items-center gap-1.5">
                        <span className="w-1.5 h-1.5 rounded-full bg-accent animate-pulse" />
                        15 Audit Modules
                      </span>
                      <span className="text-slate-300">·</span>
                      <span>Parallel Analysis</span>
                      <span className="text-slate-300">·</span>
                      <span>Comprehensive Audits</span>
                    </div>
                  </div>
                )}
              </>
            )}

            <ProfileModal
              isOpen={isProfileOpen}
              onClose={() => setIsProfileOpen(false)}
              currentCoins={coins}
            />
          </div>
        </main>
      </div>
    </div>
  );
}

/* ---------- Overview Tab ---------- */
function OverviewTab({
  analysis,
  onRefresh,
  isRefreshing,
  currentCoins,
  isDemoMode = false,
}: {
  analysis: AnalysisData;
  onRefresh: (options?: { resume?: boolean }) => void;
  isRefreshing: boolean;
  currentCoins: number;
  isDemoMode?: boolean;
}) {
  const [activeSeverityTab, setActiveSeverityTab] = useState<
    "all" | "critical" | "high" | "medium" | "low"
  >("all");
  const [selectedPage, setSelectedPage] = useState<string>("all");

  const calculatedScore = (() => {
    const completedModules = (analysis.modules || []).filter((m) => m.status === "completed");
    if (completedModules.length === 0) return analysis.overallScore ?? 0;

    const sum = completedModules.reduce((acc, m) => acc + m.score, 0);
    return Math.round(sum / completedModules.length);
  })();

  const allIssues = (analysis.modules || []).flatMap((m) =>
    (m.issues || []).map((i) => ({ ...i, moduleName: m.module }))
  );

  const scannedPages = Array.from(
    new Set(allIssues.map((i) => i.url).filter(Boolean))
  ) as string[];

  const criticalCount = allIssues.filter(
    (i) => i.severity === "critical"
  ).length;
  const highCount = allIssues.filter((i) => i.severity === "high").length;
  const mediumCount = allIssues.filter((i) => i.severity === "medium").length;
  const lowCount = allIssues.filter((i) => i.severity === "low").length;

  const techResult = analysis.modules?.find((m) => m.module === "technical");
  const scannedCount = (techResult?.data as any)?.scannedPages?.length || scannedPages.length || 0;
  const pendingCount = (techResult?.data as any)?.pendingPages?.length || 0;
  const totalCount = (techResult?.data as any)?.discoveredPages?.length || scannedCount + pendingCount || 0;
  const hasPending = pendingCount > 0;

  const minCoinsRequired = hasPending ? 1.0 : (scannedCount > 0 ? 0.2 * scannedCount : 1.0);
  const isCoinsInsufficient = currentCoins < minCoinsRequired || currentCoins <= 0;

  const filteredIssues = allIssues.filter((issue) => {
    if (issue.severity === "info") return false;
    if (activeSeverityTab === "all") return true;
    return issue.severity === activeSeverityTab;
  });

  const pageFilteredIssues = filteredIssues.filter((issue) => {
    if (selectedPage === "all") return true;
    return issue.url === selectedPage;
  });

  const displayIssues = activeSeverityTab === "all" && selectedPage === "all"
    ? pageFilteredIssues.slice(0, 10)
    : pageFilteredIssues;

  // ── Bulk-fix helpers ──────────────────────────────────────────────────────
  const severityCostMap = { critical: 1.5, high: 1.0, medium: 0.75, low: 0.5 } as const;
  const fixableForSeverity = activeSeverityTab !== "all"
    ? allIssues.filter((i) => i.severity === activeSeverityTab && !!i.url)
    : [];
  const fixAllCost = fixableForSeverity.reduce(
    (acc, i) => acc + (severityCostMap[i.severity as keyof typeof severityCostMap] ?? 0.5),
    0
  );
  const severityDotColor: Record<string, string> = {
    critical: "bg-red-500",
    high: "bg-orange-500",
    medium: "bg-amber-500",
    low: "bg-sky-500",
  };
  const severityBtnGradient: Record<string, string> = {
    critical: "from-red-600 to-rose-600 hover:from-red-700 hover:to-rose-700 shadow-red-500/25 hover:shadow-red-500/40",
    high: "from-orange-600 to-amber-600 hover:from-orange-700 hover:to-amber-700 shadow-orange-500/25 hover:shadow-orange-500/40",
    medium: "from-amber-500 to-yellow-500 hover:from-amber-600 hover:to-yellow-600 shadow-amber-500/25 hover:shadow-amber-500/40",
    low: "from-sky-600 to-blue-600 hover:from-sky-700 hover:to-blue-700 shadow-sky-500/25 hover:shadow-sky-500/40",
  };
  // ─────────────────────────────────────────────────────────────────────────

  return (
    <div className="space-y-6">
      {/* Overview Header Area */}
      <div className="flex items-center justify-between border-b border-border pb-4">
        <div>
          <h2 className="text-xl font-bold text-slate-800">Overview</h2>
          <p className="text-xs text-slate-400 font-semibold mt-0.5">
            Key insights and summary metrics from your website scan.
          </p>
        </div>
        <button
          onClick={(e) => {
            if (isDemoMode) {
              e.preventDefault();
              return;
            }
            onRefresh({ resume: false });
          }}
          disabled={isRefreshing || isCoinsInsufficient || isDemoMode}
          title={
            isDemoMode
              ? "Refresh audit is disabled in demo mode."
              : isCoinsInsufficient
                ? `Insufficient coins. Requires at least ${minCoinsRequired.toFixed(1)} coins. Your balance: ${currentCoins.toFixed(1)} coins.`
                : ""
          }
          className={`flex items-center gap-1.5 px-4 py-2 bg-white text-slate-700 font-bold border rounded-xl shadow-sm transition-all text-xs shrink-0 border-slate-200 ${isDemoMode || isCoinsInsufficient || isRefreshing
            ? "opacity-50 cursor-not-allowed pointer-events-none"
            : "hover:bg-slate-50 hover:shadow cursor-pointer"
            }`}
        >
          <HugeiconsIcon
            icon={Refresh01Icon}
            size={14}
            className={isRefreshing ? "animate-spin text-accent" : "text-slate-400"}
          />
          <span>
            {isRefreshing
              ? "Refreshing..."
              : hasPending
                ? `Resume Audit (${pendingCount} pending)`
                : "Refresh Audit"}
          </span>
        </button>
      </div>

      {hasPending && (
        <div className="bg-amber-50/85 border border-amber-200/60 rounded-2xl p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4 shadow-sm animate-fade-in">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-amber-100 flex items-center justify-center border border-amber-200 shrink-0">
              <HugeiconsIcon icon={Alert01Icon} size={20} className="text-amber-600" />
            </div>
            <div>
              <h4 className="text-sm font-bold text-amber-900">Audit Partially Completed</h4>
              <p className="text-xs text-amber-700 font-medium mt-0.5">
                {scannedCount} of {totalCount} pages were successfully analyzed. {pendingCount} page{pendingCount > 1 ? "s" : ""} are currently pending due to insufficient coins.
              </p>
            </div>
          </div>
          {currentCoins >= 1.0 ? (
            <button
              onClick={(e) => {
                if (isDemoMode) {
                  e.preventDefault();
                  return;
                }
                onRefresh({ resume: true });
              }}
              disabled={isDemoMode}
              title={isDemoMode ? "Resume audit is disabled in demo mode." : ""}
              className={`px-4 py-2 text-white font-bold rounded-xl shadow transition-all text-xs shrink-0 ${isDemoMode
                ? "bg-amber-600/50 opacity-50 cursor-not-allowed pointer-events-none"
                : "bg-amber-600 hover:bg-amber-700 cursor-pointer"
                }`}
            >
              Resume Audit ({Math.min(pendingCount, Math.floor(currentCoins))} pages)
            </button>
          ) : (
            <div className="text-xs font-bold text-amber-600 bg-amber-100/60 px-3 py-1.5 rounded-lg border border-amber-200 text-center">
              Add coins to resume
            </div>
          )}
        </div>
      )}

      {/* Score + Summary Row */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Overall Score Card */}
        <div className="bg-card border border-border rounded-2xl p-6 flex flex-col items-center justify-center shadow-sm">
          <ScoreGauge
            score={calculatedScore}
            size={150}
            label="Overall SEO Health"
          />
        </div>

        {/* Issue Summary Card */}
        <div className="bg-card border border-border rounded-2xl p-6 shadow-sm flex flex-col justify-between">
          <div>
            <h3 className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-4">
              Issue Distribution
            </h3>
            <div className="space-y-3">
              <SummaryRow
                label="Critical"
                count={criticalCount}
                color="bg-danger"
              />
              <SummaryRow
                label="High"
                count={highCount}
                color="bg-warning"
              />
              <SummaryRow
                label="Medium"
                count={mediumCount}
                color="bg-amber-500"
              />
              <SummaryRow label="Low" count={lowCount} color="bg-info" />
            </div>
          </div>
          <div className="mt-4 pt-4 border-t border-border flex justify-between items-center text-sm font-semibold">
            <span className="text-slate-500">Total Issues Found</span>
            <span className="text-slate-800 text-base font-extrabold">{allIssues.filter((i) => i.severity !== "info").length}</span>
          </div>
        </div>

        {/* Module Progress Scores */}
        <div className="bg-card border border-border rounded-2xl p-6 shadow-sm">
          <h3 className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-4">
            Performance Index
          </h3>
          <div className="space-y-2.5 max-h-48 overflow-y-auto pr-1">
            {(analysis.modules || []).map((m) => (
              <div key={m.module} className="flex items-center gap-3">
                <span className="text-xs font-bold text-slate-700 w-24 capitalize truncate">
                  {m.module.replace(/([A-Z])/g, " $1").trim()}
                </span>
                <div className="flex-1 bg-slate-100 rounded-full h-1.5">
                  <div
                    className="h-1.5 rounded-full transition-all duration-700"
                    style={{
                      width: `${m.score}%`,
                      backgroundColor:
                        m.score >= 80
                          ? "var(--color-success)"
                          : m.score >= 60
                            ? "var(--color-warning)"
                            : "var(--color-danger)",
                    }}
                  />
                </div>
                <span className="text-xs font-extrabold w-8 text-right text-slate-800">
                  {m.score}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Top Issues Card */}
      <div className="bg-card border border-border rounded-2xl p-6 shadow-sm">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-5 pb-3 border-b border-slate-100/60">
          <div>
            <h3 className="text-xs font-bold text-slate-800 uppercase tracking-wider mb-1">
              Priority Action Items
            </h3>
            <p className="text-[11px] font-semibold text-slate-400">
              Select a severity or page to view specific tasks
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            {/* Page Filter Select Dropdown */}
            {scannedPages.length > 1 && (
              <div className="flex items-center gap-2 shrink-0 whitespace-nowrap">
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider shrink-0">Page:</span>
                <select
                  value={selectedPage}
                  onChange={(e) => setSelectedPage(e.target.value)}
                  className="text-xs font-bold bg-slate-50 border border-slate-200/80 rounded-xl px-3 py-1.5 text-slate-655 focus:outline-none cursor-pointer focus:border-slate-350 max-w-[160px] sm:max-w-[220px] truncate shrink-0"
                >
                  <option value="all">All Pages ({allIssues.filter((i) => i.severity !== "info").length})</option>
                  {scannedPages.map((pageUrl) => {
                    let label = pageUrl;
                    try {
                      const u = new URL(pageUrl);
                      label = u.pathname === "/" ? "Home (/)" : u.pathname;
                    } catch { }
                    const count = allIssues.filter((i) => i.url === pageUrl && i.severity !== "info").length;
                    return (
                      <option key={pageUrl} value={pageUrl}>
                        {label} ({count})
                      </option>
                    );
                  })}
                </select>
              </div>
            )}

            {/* Segmented Control Tabs */}
            <div className="flex items-center gap-1 p-1 bg-slate-50 border border-slate-100/80 rounded-xl overflow-x-auto scrollbar-none">
              {[
                { id: "all", label: "All", count: allIssues.filter((i) => i.severity !== "info").length },
                { id: "critical", label: "Critical", count: criticalCount, activeColor: "text-red-600 bg-red-50/50" },
                { id: "high", label: "High", count: highCount, activeColor: "text-orange-600 bg-orange-50/50" },
                { id: "medium", label: "Medium", count: mediumCount, activeColor: "text-amber-600 bg-amber-50/50" },
                { id: "low", label: "Low", count: lowCount, activeColor: "text-sky-600 bg-sky-50/50" },
              ].map((tab) => {
                const isActive = activeSeverityTab === tab.id;
                return (
                  <button
                    key={tab.id}
                    onClick={() => setActiveSeverityTab(tab.id as any)}
                    className={`px-3 py-1.5 text-xs font-bold rounded-lg transition-all duration-200 cursor-pointer flex items-center gap-1.5 shrink-0 select-none ${isActive
                      ? "bg-white text-slate-800 shadow-sm border border-slate-100"
                      : "text-slate-500 hover:text-slate-800 hover:bg-slate-100/50"
                      }`}
                  >
                    <span>{tab.label}</span>
                    <span
                      className={`px-1.5 py-0.5 rounded-md text-[9px] font-extrabold ${isActive
                        ? tab.activeColor || "bg-slate-100 text-slate-700"
                        : "bg-slate-200/50 text-slate-500"
                        }`}
                    >
                      {tab.count}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>
        </div>

        <IssueList
          issues={displayIssues}
        />
      </div>
    </div>
  );
}

function SummaryRow({
  label,
  count,
  color,
}: {
  label: string;
  count: number;
  color: string;
}) {
  return (
    <div className="flex items-center justify-between text-sm">
      <div className="flex items-center gap-2">
        <div className={`w-2.5 h-2.5 rounded-full ${color}`} />
        <span className="font-semibold text-slate-700">{label}</span>
      </div>
      <span className="font-extrabold text-slate-800">{count}</span>
    </div>
  );
}

/* ---------- Module Tab ---------- */
function ModuleTab({
  result,
  moduleName,
  onRefreshModule,
  isRefreshing,
  currentCoins,
  isDemoMode = false,
}: {
  result: ModuleResult | undefined;
  moduleName: string;
  onRefreshModule?: (moduleName: string) => Promise<void>;
  isRefreshing?: boolean;
  currentCoins?: number;
  isDemoMode?: boolean;
}) {
  const [selectedPage, setSelectedPage] = useState<string>("all");
  const [copied, setCopied] = useState<boolean>(false);
  const [activeSeverityTab, setActiveSeverityTab] = useState<"all" | "critical" | "high" | "medium" | "low">("all");

  const handleCopyIssues = async () => {
    if (!result || !result.issues) return;
    const header = `# SEOBoostr Audit Issues - ${moduleName}\n` +
      `**Target Page**: ${selectedPage === "all" ? "All scanned pages" : selectedPage}\n\n` +
      `Below is a detailed list of technical issues found on the website. Use these as a context prompt in your AI-powered IDE (e.g. Cursor, Copilot, Gemini) to fix them directly in your codebase.\n\n`;

    const formattedIssues = filteredIssues.map((issue, idx) => {
      return `### ${idx + 1}. [${issue.severity.toUpperCase()}] ${issue.title} (ID: ${issue.id})\n` +
        `- **Description**: ${issue.description}\n` +
        `- **Recommendation**: ${issue.recommendation}\n` +
        `- **Target Page URL**: ${issue.url || "Site-wide"}\n` +
        (issue.element ? `- **HTML Element/Selector**: \`${issue.element}\`\n` : "") +
        (issue.value ? `- **Current Value**: \`${issue.value}\`\n` : "");
    }).join("\n");

    const promptContext = `\n---\n*AI IDE Instructions*: Please fix the listed SEO issues in the target project files. Retain all existing features and comments while applying the recommendations.`;

    const fullText = header + formattedIssues + promptContext;

    try {
      await navigator.clipboard.writeText(fullText);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error("Failed to copy issues:", err);
      alert("Could not copy issues automatically. Please try again.");
    }
  };

  if (!result) {
    return (
      <div className="text-center py-12 bg-card border border-border rounded-2xl shadow-sm text-slate-500">
        <p className="font-bold">No data available for {moduleName}</p>
      </div>
    );
  }

  const issues = result.issues || [];
  const activeIssues = issues.filter((i) => i.severity !== "info");
  const scannedPages = Array.from(
    new Set(activeIssues.map((i) => i.url).filter(Boolean))
  ) as string[];

  const filteredIssues = activeIssues.filter((issue) => {
    if (selectedPage !== "all" && issue.url !== selectedPage) return false;
    if (activeSeverityTab !== "all" && issue.severity !== activeSeverityTab) return false;
    return true;
  });

  const scannedPagesCount = (result && result.data && Array.isArray(result.data.scannedPages))
    ? result.data.scannedPages.length
    : 1;
  const estimatedCost = scannedPagesCount * 0.05;
  const isCoinsInsufficient = currentCoins !== undefined && currentCoins < estimatedCost;

  return (
    <div className="space-y-6">
      {/* Module Header Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
        <div className="bg-card border border-border rounded-2xl p-6 flex flex-col items-center justify-center shadow-sm relative">
          <ScoreGauge score={result.score} size={110} label={moduleName} />
          {onRefreshModule && (
            <button
              onClick={(e) => {
                if (isDemoMode) {
                  e.preventDefault();
                  return;
                }
                onRefreshModule(result.module);
              }}
              disabled={isRefreshing || isDemoMode || isCoinsInsufficient}
              title={
                isDemoMode
                  ? "Refresh is disabled in demo mode."
                  : isCoinsInsufficient
                    ? `Insufficient coins. Requires ${estimatedCost.toFixed(2)} coins. Your balance: ${currentCoins?.toFixed(2)} coins.`
                    : `Refresh this section (costs ${estimatedCost.toFixed(2)} coins)`
              }
              className={`mt-4 flex items-center gap-1.5 px-3 py-1.5 bg-white text-slate-700 font-bold border rounded-xl shadow-sm transition-all text-xs border-slate-200 ${isDemoMode || isRefreshing || isCoinsInsufficient
                ? "opacity-50 cursor-not-allowed pointer-events-none"
                : "hover:bg-slate-50 hover:shadow cursor-pointer"
                }`}
            >
              <HugeiconsIcon
                icon={Refresh01Icon}
                size={12}
                className={isRefreshing ? "animate-spin text-accent" : "text-slate-400"}
              />
              <span>{isRefreshing ? "Refreshing..." : "Refresh Section"}</span>
            </button>
          )}
        </div>

        <div className="bg-card border border-border rounded-2xl p-6 sm:col-span-2 shadow-sm flex flex-col justify-between">
          <h3 className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-3">
            {moduleName} Stats & Summary
          </h3>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            <StatCard
              label="Total Issues"
              value={activeIssues.length}
              suffix="found"
            />
            <StatCard
              label="Critical Severity"
              value={
                result.issues.filter((i) => i.severity === "critical").length
              }
              color="text-red-600"
            />
            <StatCard
              label="High Severity"
              value={
                result.issues.filter((i) => i.severity === "high").length
              }
              color="text-orange-600"
            />
            <StatCard
              label="Scan Time"
              value={result.executionTimeMs}
              suffix="ms"
            />
          </div>
        </div>
      </div>

      {/* Structured Details Render Box (ALL data visible) */}
      {result.data && Object.keys(result.data).length > 0 && (
        <div className="space-y-4">
          <h3 className="text-[10px] font-bold text-slate-400 uppercase tracking-wider px-1">
            Analysis Data & Parameters
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {Object.entries(result.data).map(([key, value]) => (
              <RenderDataValue key={key} label={key} value={value} />
            ))}
          </div>
        </div>
      )}

      {/* Module-Specific Issues List */}
      <div className="bg-card border border-border rounded-2xl p-6 shadow-sm">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-4 pb-3 border-b border-slate-100/60">
          <h3 className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">
            Module Issues ({filteredIssues.length})
          </h3>

          <div className="flex flex-wrap items-center gap-3">
            {/* Copy Button */}
            <button
              onClick={handleCopyIssues}
              className={`flex items-center gap-1 px-2.5 py-1.5 border rounded-xl text-[10px] font-extrabold transition-all duration-150 cursor-pointer select-none ${
                copied
                  ? "bg-emerald-50 border-emerald-200 text-emerald-700"
                  : "bg-white border-slate-200 hover:border-slate-350 hover:bg-slate-50 text-slate-655"
              }`}
              title="Copy detailed issues for AI IDE"
            >
              {copied ? (
                <>
                  <svg xmlns="http://www.w3.org/2000/svg" width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="text-emerald-600 shrink-0"><path d="M20 6 9 17l-5-5"/></svg>
                  <span>Copied!</span>
                </>
              ) : (
                <>
                  <svg xmlns="http://www.w3.org/2000/svg" width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-slate-400 shrink-0"><rect width="14" height="14" x="8" y="8" rx="2" ry="2"/><path d="M4 16c-1.1 0-2-.9-2-2V4c0-1.1.9-2 2-2h10c1.1 0 2 .9 2 2"/></svg>
                  <span>Copy</span>
                </>
              )}
            </button>

            {/* Page Filter Select Dropdown */}
            {scannedPages.length > 1 && (
              <div className="flex items-center gap-2 shrink-0 whitespace-nowrap">
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider shrink-0">Page:</span>
                <select
                  value={selectedPage}
                  onChange={(e) => setSelectedPage(e.target.value)}
                  className="text-xs font-bold bg-slate-50 border border-slate-200/80 rounded-xl px-3 py-1.5 text-slate-655 focus:outline-none cursor-pointer focus:border-slate-350 max-w-[160px] sm:max-w-[220px] truncate shrink-0"
                >
                  <option value="all">All Pages ({activeIssues.length})</option>
                  {scannedPages.map((pageUrl) => {
                    let label = pageUrl;
                    try {
                      const u = new URL(pageUrl);
                      label = u.pathname === "/" ? "Home (/)" : u.pathname;
                    } catch { }
                    const count = activeIssues.filter((i) => i.url === pageUrl).length;
                    return (
                      <option key={pageUrl} value={pageUrl}>
                        {label} ({count})
                      </option>
                    );
                  })}
                </select>
              </div>
            )}

            {/* Segmented Control Tabs */}
            <div className="flex items-center gap-1 p-1 bg-slate-50 border border-slate-100/80 rounded-xl overflow-x-auto scrollbar-none">
              {[
                { id: "all", label: "All", count: activeIssues.length },
                { id: "critical", label: "Critical", count: issues.filter((i) => i.severity === "critical").length, activeColor: "text-red-600 bg-red-50/50" },
                { id: "high", label: "High", count: issues.filter((i) => i.severity === "high").length, activeColor: "text-orange-600 bg-orange-50/50" },
                { id: "medium", label: "Medium", count: issues.filter((i) => i.severity === "medium").length, activeColor: "text-amber-600 bg-amber-50/50" },
                { id: "low", label: "Low", count: issues.filter((i) => i.severity === "low").length, activeColor: "text-sky-600 bg-sky-50/50" },
              ].map((tab) => {
                const isActive = activeSeverityTab === tab.id;
                return (
                  <button
                    key={tab.id}
                    onClick={() => setActiveSeverityTab(tab.id as any)}
                    className={`px-3 py-1.5 text-xs font-bold rounded-lg transition-all duration-200 cursor-pointer flex items-center gap-1.5 shrink-0 select-none ${isActive
                      ? "bg-white text-slate-800 shadow-sm border border-slate-100"
                      : "text-slate-500 hover:text-slate-800 hover:bg-slate-100/50"
                      }`}
                  >
                    <span>{tab.label}</span>
                    <span
                      className={`px-1.5 py-0.5 rounded-md text-[9px] font-extrabold ${isActive
                        ? tab.activeColor || "bg-slate-100 text-slate-700"
                        : "bg-slate-200/50 text-slate-500"
                        }`}
                    >
                      {tab.count}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>
        </div>

        <IssueList
          issues={filteredIssues}
        />
      </div>
    </div>
  );
}

function StatCard({
  label,
  value,
  suffix,
  color,
}: {
  label: string;
  value: number;
  suffix?: string;
  color?: string;
}) {
  return (
    <div className="bg-slate-50 border border-slate-100 rounded-xl px-4 py-3">
      <p className="text-[9px] font-bold text-slate-400 uppercase tracking-wider">
        {label}
      </p>
      <p className={`text-lg font-extrabold mt-0.5 ${color || "text-slate-800"}`}>
        {value}
        {suffix && (
          <span className="text-[10px] font-semibold text-slate-400 ml-1">
            {suffix}
          </span>
        )}
      </p>
    </div>
  );
}

/* ---------- Nested Data Renderer Component ---------- */
function RenderDataValue({ label, value }: { label: string; value: any }) {
  const formattedLabel = label
    .replace(/([A-Z])/g, " $1")
    .replace(/_/g, " ")
    .trim();

  // Boolean value formatting
  if (typeof value === "boolean") {
    return (
      <div className="bg-card border border-border rounded-xl px-4 py-3.5 shadow-sm flex items-center justify-between">
        <span className="text-xs font-bold text-slate-500 capitalize">
          {formattedLabel}
        </span>
        <span
          className={`text-xs px-2.5 py-0.5 font-bold rounded-full border ${value
            ? "bg-success-light text-success border-success-light"
            : "bg-danger-light text-danger border-danger-light"
            }`}
        >
          {value ? "Yes" : "No"}
        </span>
      </div>
    );
  }

  if (value === null || value === undefined) {
    return null;
  }

  // Array values (e.g. lists, arrays of objects/strings)
  if (Array.isArray(value)) {
    if (value.length === 0) return null;

    // Check if the array contains objects
    const isArrayOfObjects = typeof value[0] === "object" && value[0] !== null;

    if (isArrayOfObjects) {
      // Get all unique keys in the objects to represent columns
      const cols = Array.from(new Set(value.flatMap((item) => Object.keys(item))));

      return (
        <div className="bg-card border border-border rounded-xl p-4 shadow-sm col-span-full">
          <h4 className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-3 capitalize">
            {formattedLabel} ({value.length})
          </h4>
          <div className="overflow-x-auto border border-slate-100 rounded-lg max-h-96 scrollbar-thin">
            <table className="min-w-full divide-y divide-slate-100 text-left text-xs">
              <thead className="bg-slate-50 font-bold text-slate-600">
                <tr>
                  {cols.map((col) => (
                    <th
                      key={col}
                      className="px-4 py-2.5 border-b border-slate-100 capitalize font-extrabold text-[10px] tracking-wider text-slate-500"
                    >
                      {col.replace(/([A-Z])/g, " $1").trim()}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 font-medium text-slate-700 bg-white">
                {value.map((item, idx) => (
                  <tr key={idx} className="hover:bg-slate-50/50">
                    {cols.map((col) => {
                      const val = item[col];
                      return (
                        <td
                          key={col}
                          className="px-4 py-3 break-all whitespace-pre-wrap max-w-sm"
                        >
                          {typeof val === "boolean"
                            ? val
                              ? <span className="bg-success-light text-success border border-success-light px-2 py-0.5 rounded-full font-bold text-[10px]">Yes</span>
                              : <span className="bg-danger-light text-danger border border-danger-light px-2 py-0.5 rounded-full font-bold text-[10px]">No</span>
                            : String(val ?? "-")}
                        </td>
                      );
                    })}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      );
    }

    return (
      <div className="bg-card border border-border rounded-xl p-4 shadow-sm col-span-full">
        <h4 className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-2.5 capitalize">
          {formattedLabel} ({value.length})
        </h4>
        <ul className="space-y-1.5 max-h-48 overflow-y-auto pr-1">
          {value.map((item, idx) => (
            <li
              key={idx}
              className="text-xs font-medium bg-slate-50 border border-slate-100 rounded-xl px-3 py-2 flex items-start gap-2 text-slate-700"
            >
              <span className="text-accent text-xs mt-0.5">•</span>
              <span className="break-all font-medium">
                {typeof item === "object" && item !== null
                  ? JSON.stringify(item)
                  : String(item)}
              </span>
            </li>
          ))}
        </ul>
      </div>
    );
  }

  // Object values (e.g. metadata dictionary, sub-hashes)
  if (typeof value === "object") {
    const entries = Object.entries(value).filter(
      ([_, v]) => v !== null && v !== undefined && v !== ""
    );
    if (entries.length === 0) return null;
    return (
      <div className="bg-card border border-border rounded-xl p-4 shadow-sm col-span-full">
        <h4 className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-3 capitalize">
          {formattedLabel}
        </h4>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {entries.map(([subKey, subValue]) => (
            <div
              key={subKey}
              className="bg-slate-50 border border-slate-100 rounded-xl p-3 flex flex-col"
            >
              <span className="text-[9px] font-bold text-slate-400 uppercase tracking-wider">
                {subKey}
              </span>
              <span className="text-sm font-semibold text-slate-700 mt-0.5 break-all">
                {typeof subValue === "object" && subValue !== null
                  ? JSON.stringify(subValue)
                  : String(subValue)}
              </span>
            </div>
          ))}
        </div>
      </div>
    );
  }

  // Fallback simple primitive values
  return (
    <div className="bg-card border border-border rounded-xl px-4 py-3.5 shadow-sm flex items-center justify-between gap-4">
      <span className="text-xs font-bold text-slate-500 capitalize shrink-0">
        {formattedLabel}
      </span>
      <span
        className="text-xs font-bold text-slate-700 truncate max-w-[180px] text-right"
        title={String(value)}
      >
        {String(value)}
      </span>
    </div>
  );
}
