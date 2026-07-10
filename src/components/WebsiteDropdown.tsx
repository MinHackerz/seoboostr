"use client";

import { useState, useRef, useEffect } from "react";
import { HugeiconsIcon } from "@hugeicons/react";
import {
  CompassIcon,
  ArrowDown01Icon,
  ArrowUp01Icon,
  PencilEdit01Icon,
  Tick01Icon,
  Cancel01Icon,
  Delete01Icon,
  SearchIcon,
  Add01Icon,
} from "@hugeicons/core-free-icons";

interface WebsiteDropdownProps {
  websites: any[];
  selectedId: string | null;
  onSelect: (websiteId: string) => void;
  onRenameSuccess?: () => void;
  onDelete?: (websiteId: string) => void;
  isDemoMode?: boolean;
  onAnalyze?: (url: string) => Promise<void>;
  isAnalyzing?: boolean;
}

export function WebsiteDropdown({
  websites,
  selectedId,
  onSelect,
  onRenameSuccess,
  onDelete,
  isDemoMode = false,
  onAnalyze,
  isAnalyzing = false,
}: WebsiteDropdownProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editName, setEditName] = useState("");
  const [newUrl, setNewUrl] = useState("");
  const modalRef = useRef<HTMLDivElement>(null);

  // Close modal on escape key
  useEffect(() => {
    function handleKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") {
        setIsOpen(false);
        setEditingId(null);
      }
    }
    if (isOpen) {
      document.addEventListener("keydown", handleKeyDown);
    }
    return () => {
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [isOpen]);

  const selectedWebsite = websites.find((w) => w.id === selectedId);

  let selectedLabel = "Select Website";
  if (selectedWebsite) {
    if (selectedWebsite.name) {
      selectedLabel = selectedWebsite.name;
    } else {
      try {
        selectedLabel = new URL(selectedWebsite.url).hostname;
      } catch {
        selectedLabel = selectedWebsite.url;
      }
    }
  }

  // Get the latest score for the selected website
  const selectedAnalysis = selectedWebsite?.analyses?.[0];
  const selectedScore =
    selectedAnalysis?.status === "completed" &&
    typeof selectedAnalysis?.overallScore === "number"
      ? selectedAnalysis.overallScore
      : null;

  const getScoreColor = (score: number) => {
    if (score >= 80) return { bg: "bg-emerald-500/10", text: "text-emerald-600 dark:text-emerald-400", border: "border-emerald-500/20", pill: "bg-emerald-500 text-white" };
    if (score >= 60) return { bg: "bg-amber-500/10", text: "text-amber-600 dark:text-amber-400", border: "border-amber-500/20", pill: "bg-amber-500 text-white" };
    return { bg: "bg-rose-500/10", text: "text-rose-600 dark:text-rose-400", border: "border-rose-500/20", pill: "bg-rose-500 text-white" };
  };

  const handleSaveName = async (websiteId: string) => {
    if (!editName.trim()) return;

    try {
      const res = await fetch("/api/websites", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id: websiteId, name: editName.trim() }),
      });
      if (res.ok) {
        setEditingId(null);
        if (onRenameSuccess) {
          onRenameSuccess();
        }
      } else {
        const err = await res.json();
        alert(err.error || "Failed to update name");
      }
    } catch (err) {
      console.error("Failed to rename website", err);
      alert("An error occurred while renaming the website.");
    }
  };

  // Filtered websites based on search query
  const filteredWebsites = websites.filter((w) => {
    const name = w.name?.toLowerCase() || "";
    const url = w.url.toLowerCase();
    const query = searchQuery.toLowerCase();
    return name.includes(query) || url.includes(query);
  });

  // Dynamically adjust font size based on name length to ensure visibility
  const labelLength = selectedLabel.length;
  let fontSizeClass = "text-[13px]";
  if (labelLength > 25) {
    fontSizeClass = "text-[10px]";
  } else if (labelLength > 18) {
    fontSizeClass = "text-[11px]";
  } else if (labelLength > 14) {
    fontSizeClass = "text-xs";
  }

  return (
    <div className="w-full font-sans">
      {/* ─── Trigger Button ──────────────────────────────────────── */}
      <button
        type="button"
        onClick={() => setIsOpen(true)}
        className="w-full flex items-center justify-between gap-3 px-4 py-2.5 border rounded-xl text-sm transition-all duration-200 focus:outline-none cursor-pointer select-none bg-white border-slate-200 hover:border-slate-350 hover:shadow-sm"
      >
        <span className={`break-words whitespace-normal font-bold text-left min-w-0 flex-1 leading-tight ${fontSizeClass} ${
          selectedWebsite ? "text-slate-800" : "text-slate-400"
        }`}>
          {selectedLabel}
        </span>

        <div className="flex items-center gap-2 shrink-0">
          {selectedScore !== null && (
            <span className={`px-2 py-0.5 rounded-lg text-[10px] font-black font-mono border ${
              getScoreColor(selectedScore).bg
            } ${getScoreColor(selectedScore).text} ${getScoreColor(selectedScore).border}`}>
              {selectedScore}
            </span>
          )}
          <div className="w-6 h-6 rounded-lg flex items-center justify-center bg-slate-100 text-slate-400">
            <HugeiconsIcon icon={ArrowDown01Icon} size={14} />
          </div>
        </div>
      </button>

      {/* ─── Detailed Popup Modal Overlay ───────────────────────── */}
      {isOpen && (
        <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-fade-in">
          {/* Modal Container */}
          <div
            ref={modalRef}
            className="w-full max-w-2xl bg-white border border-slate-150 rounded-3xl shadow-2xl overflow-hidden flex flex-col max-h-[85vh] animate-scale-up"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Modal Header */}
            <div className="px-6 py-5 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
              <div>
                <h3 className="text-lg font-black text-slate-800">
                  Select Website
                </h3>
                <p className="text-xs text-slate-400 font-semibold mt-0.5">
                  Manage and switch between your connected properties ({websites.length}/10)
                </p>
              </div>
              <button
                type="button"
                onClick={() => {
                  setIsOpen(false);
                  setEditingId(null);
                }}
                className="w-8 h-8 rounded-xl flex items-center justify-center hover:bg-slate-100 text-slate-400 hover:text-slate-600 transition-all border border-slate-200/40 cursor-pointer"
              >
                <HugeiconsIcon icon={Cancel01Icon} size={16} />
              </button>
            </div>

            {/* Search Bar area */}
            {websites.length > 0 && (
              <div className="px-6 pt-4 pb-2">
                <div className="relative">
                  <div className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-450">
                    <HugeiconsIcon icon={SearchIcon} size={16} />
                  </div>
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Search websites by name or URL..."
                    className="w-full bg-slate-50 border border-slate-200/80 rounded-2xl text-sm font-semibold text-slate-800 placeholder-slate-400 pl-10 pr-4 py-3 focus:outline-none focus:ring-2 focus:ring-accent/25 focus:border-accent/40 transition-all"
                  />
                </div>
              </div>
            )}

            {/* Scan New URL Section */}
            {!isDemoMode && onAnalyze && (
              <div className="px-6 py-4 border-b border-slate-100 bg-slate-50/30">
                <label className="text-[10px] font-extrabold text-slate-400 uppercase tracking-wider block mb-2">
                  Scan New URL
                </label>
                <div className="flex gap-2">
                  <input
                    type="url"
                    value={newUrl}
                    onChange={(e) => setNewUrl(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === "Enter" && newUrl.trim() && !isAnalyzing) {
                        onAnalyze(newUrl.trim());
                        setNewUrl("");
                        setIsOpen(false);
                      }
                    }}
                    placeholder="https://example.com"
                    className="flex-1 bg-white border border-slate-200/80 rounded-xl text-xs font-semibold text-slate-700 px-3.5 py-2.5 focus:outline-none focus:ring-2 focus:ring-accent/25 focus:border-accent/40 transition-all hover:border-slate-350"
                    disabled={isAnalyzing}
                  />
                  <button
                    type="button"
                    onClick={() => {
                      if (newUrl.trim()) {
                        onAnalyze(newUrl.trim());
                        setNewUrl("");
                        setIsOpen(false);
                      }
                    }}
                    disabled={isAnalyzing || !newUrl.trim()}
                    className="px-4 py-2.5 bg-accent hover:bg-accent-hover text-white font-bold rounded-xl text-xs transition-all disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer shrink-0"
                  >
                    {isAnalyzing ? "..." : "Scan"}
                  </button>
                </div>
              </div>
            )}

            {/* Website List Content */}
            <div className="flex-1 overflow-y-auto p-6 space-y-3.5 scrollbar-thin">
              {websites.length === 0 ? (
                <div className="py-12 text-center">
                  <div className="w-14 h-14 rounded-2xl bg-slate-100 border border-slate-200/60 flex items-center justify-center mx-auto mb-4 text-slate-350">
                    <HugeiconsIcon icon={CompassIcon} size={28} />
                  </div>
                  <h4 className="text-base font-extrabold text-slate-700">No websites added yet</h4>
                  <p className="text-xs text-slate-400 mt-1 max-w-sm mx-auto">
                    Type a URL in the scan field in your dashboard to audit your first website. You can add up to 10.
                  </p>
                </div>
              ) : filteredWebsites.length === 0 ? (
                <div className="py-8 text-center text-slate-450 text-sm font-semibold">
                  No websites match your search query
                </div>
              ) : (
                <div className="grid grid-cols-1 gap-3">
                  {filteredWebsites.map((w) => {
                    let defaultLabel = w.url;
                    try {
                      defaultLabel = new URL(w.url).hostname;
                    } catch {}

                    const label = w.name || defaultLabel;
                    const isSelected = w.id === selectedId;
                    const isEditing = editingId === w.id;

                    const latestAnalysis = w.analyses && w.analyses[0];
                    const scoreValue =
                      latestAnalysis &&
                      latestAnalysis.status === "completed" &&
                      typeof latestAnalysis.overallScore === "number"
                        ? latestAnalysis.overallScore
                        : null;
                    const scoreStyle = scoreValue !== null ? getScoreColor(scoreValue) : null;

                    const lastScanned = latestAnalysis?.completedAt
                      ? new Date(latestAnalysis.completedAt).toLocaleString("en-US", {
                          month: "short",
                          day: "numeric",
                          hour: "2-digit",
                          minute: "2-digit",
                        })
                      : "Never audited";

                    if (isEditing) {
                      return (
                        <div
                          key={w.id}
                          className="p-4 border border-slate-200 rounded-2xl bg-slate-55 flex flex-col gap-3 shadow-xs"
                        >
                          <div className="flex items-center gap-2">
                            <input
                              type="text"
                              value={editName}
                              onChange={(e) => setEditName(e.target.value)}
                              onKeyDown={(e) => {
                                if (e.key === "Enter") {
                                  handleSaveName(w.id);
                                } else if (e.key === "Escape") {
                                  setEditingId(null);
                                }
                              }}
                              className="flex-1 min-w-0 px-3.5 py-2 text-sm font-semibold border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-accent/30 focus:border-accent bg-white"
                              placeholder="Website Nickname"
                              autoFocus
                            />
                            <button
                              type="button"
                              onClick={() => handleSaveName(w.id)}
                              className="w-9 h-9 flex items-center justify-center bg-emerald-50 hover:bg-emerald-100 text-emerald-600 rounded-xl border border-emerald-200/60 transition-colors cursor-pointer shrink-0"
                              title="Save"
                            >
                              <HugeiconsIcon icon={Tick01Icon} size={16} />
                            </button>
                            <button
                              type="button"
                              onClick={() => setEditingId(null)}
                              className="w-9 h-9 flex items-center justify-center bg-slate-50 hover:bg-slate-100 text-slate-500 rounded-xl border border-slate-200/60 transition-colors cursor-pointer shrink-0"
                              title="Cancel"
                            >
                              <HugeiconsIcon icon={Cancel01Icon} size={16} />
                            </button>
                          </div>
                          <div className="text-[10px] text-slate-400 font-mono select-none">
                            URL: {w.url}
                          </div>
                        </div>
                      );
                    }

                    return (
                      <div
                        key={w.id}
                        onClick={() => {
                          onSelect(w.id);
                          setIsOpen(false);
                        }}
                        className={`flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-4 border rounded-2xl cursor-pointer transition-all duration-200 group relative ${
                          isSelected
                            ? "bg-accent/[0.03] border-accent/30 ring-1 ring-accent/30"
                            : "bg-white border-slate-200/80 hover:border-slate-300 hover:shadow-md hover:-translate-y-0.5"
                        }`}
                      >
                        {/* Left Content */}
                        <div className="flex items-start gap-3.5 min-w-0 flex-1">
                          <div className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 border transition-all ${
                            isSelected
                              ? "bg-accent/10 border-accent/20 text-accent shadow-sm"
                              : "bg-slate-50 border-slate-100 text-slate-400"
                          }`}>
                            <HugeiconsIcon icon={CompassIcon} size={18} />
                          </div>

                          <div className="flex flex-col min-w-0 flex-1">
                            <div className="flex items-center gap-2 min-w-0 flex-wrap">
                              <span className={`text-[14px] leading-tight truncate ${
                                isSelected ? "font-black text-slate-900" : "font-extrabold text-slate-800"
                              }`}>
                                {label}
                              </span>
                              
                              {/* Edit/Rename & Delete triggers */}
                              {!isDemoMode && (
                                <div className="flex items-center gap-0.5 opacity-0 group-hover:opacity-100 transition-opacity">
                                  <button
                                    type="button"
                                    onClick={(e) => {
                                      e.stopPropagation();
                                      setEditingId(w.id);
                                      setEditName(w.name || defaultLabel);
                                    }}
                                    className="p-1 hover:bg-slate-100 text-slate-400 hover:text-slate-600 rounded-lg transition-all cursor-pointer"
                                    title="Rename"
                                  >
                                    <HugeiconsIcon icon={PencilEdit01Icon} size={12} />
                                  </button>
                                  {onDelete && (
                                    <button
                                      type="button"
                                      onClick={(e) => {
                                        e.stopPropagation();
                                        if (confirm(`Remove "${label}" and all its audit data? This cannot be undone.`)) {
                                          onDelete(w.id);
                                        }
                                      }}
                                      className="p-1 hover:bg-rose-50 text-slate-400 hover:text-rose-500 rounded-lg transition-all cursor-pointer"
                                      title="Delete Website"
                                    >
                                      <HugeiconsIcon icon={Delete01Icon} size={12} />
                                    </button>
                                  )}
                                </div>
                              )}
                            </div>
                            <span className="text-xs text-slate-400 font-mono truncate mt-0.5 block">
                              {w.url}
                            </span>
                            <span className="text-[10px] text-slate-400 mt-2 block font-semibold">
                              Last Scan: {lastScanned}
                            </span>
                          </div>
                        </div>

                        {/* Right Content */}
                        <div className="flex items-center justify-between sm:justify-end gap-3.5 border-t sm:border-t-0 border-slate-100 pt-3 sm:pt-0 shrink-0">
                          {scoreValue !== null && scoreStyle && (
                            <div className="flex flex-col items-end gap-0.5">
                              <span className="text-[9px] font-black text-slate-400 uppercase tracking-wider block">
                                SEO Score
                              </span>
                              <span className={`px-2.5 py-1 rounded-lg text-xs font-black font-mono border ${scoreStyle.bg} ${scoreStyle.text} ${scoreStyle.border} shadow-sm`}>
                                {scoreValue}
                              </span>
                            </div>
                          )}

                          {isSelected && (
                            <div className="w-6 h-6 rounded-full bg-accent text-white flex items-center justify-center shadow-md shadow-accent/25">
                              <svg
                                xmlns="http://www.w3.org/2000/svg"
                                viewBox="0 0 20 20"
                                fill="currentColor"
                                className="w-4 h-4"
                              >
                                <path
                                  fillRule="evenodd"
                                  d="M16.704 4.153a.75.75 0 01.143 1.052l-8 10.5a.75.75 0 01-1.127.075l-4.5-4.5a.75.75 0 011.06-1.06l3.894 3.893 7.48-9.817a.75.75 0 011.05-.143z"
                                  clipRule="evenodd"
                                />
                              </svg>
                            </div>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>

            {/* Modal Footer */}
            <div className="px-6 py-4 border-t border-slate-100 bg-slate-50/50 flex justify-end">
              <button
                type="button"
                onClick={() => {
                  setIsOpen(false);
                  setEditingId(null);
                }}
                className="px-5 py-2.5 bg-slate-800 hover:bg-slate-900 text-white font-bold rounded-xl text-xs transition-all cursor-pointer shadow-sm hover:shadow"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Style Overrides */}
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
