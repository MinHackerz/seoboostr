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
} from "@hugeicons/core-free-icons";

interface WebsiteDropdownProps {
  websites: any[];
  selectedId: string | null;
  onSelect: (websiteId: string) => void;
  onRenameSuccess?: () => void;
  isDemoMode?: boolean;
}

export function WebsiteDropdown({
  websites,
  selectedId,
  onSelect,
  onRenameSuccess,
  isDemoMode = false,
}: WebsiteDropdownProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editName, setEditName] = useState("");
  const containerRef = useRef<HTMLDivElement>(null);

  // Close dropdown on click outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        containerRef.current &&
        !containerRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
        setEditingId(null);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const selectedWebsite = websites.find((w) => w.id === selectedId);
  
  let selectedLabel = "Choose Website";
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

  // Get score color styling helper
  const getScoreBadgeClass = (score: number) => {
    if (score >= 80) return "bg-emerald-50 text-emerald-700 border-emerald-100/60";
    if (score >= 60) return "bg-amber-50 text-amber-700 border-amber-100/60";
    return "bg-rose-50 text-rose-700 border-rose-100/60";
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

  return (
    <div className="relative w-full text-left font-sans" ref={containerRef}>
      {/* Trigger Button */}
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className="w-full flex items-center justify-between gap-2.5 px-3.5 py-3 bg-slate-50 hover:bg-slate-100 border border-slate-200/80 hover:border-slate-350 rounded-xl text-sm font-bold text-slate-800 transition-all focus:outline-none focus:ring-2 focus:ring-accent/20 cursor-pointer select-none"
      >
        <div className="flex items-center gap-2 min-w-0">
          <div className="w-5.5 h-5.5 rounded-lg bg-slate-200/50 border border-slate-300/20 flex items-center justify-center shrink-0 text-slate-500">
            <HugeiconsIcon icon={CompassIcon} size={14} />
          </div>
          <span className="truncate pr-2 font-bold text-slate-800">
            {selectedLabel}
          </span>
        </div>
        <HugeiconsIcon
          icon={isOpen ? ArrowUp01Icon : ArrowDown01Icon}
          size={15}
          className="text-slate-400 shrink-0 transition-transform duration-200"
        />
      </button>

      {/* Dropdown Options List */}
      {isOpen && (
        <div className="absolute left-0 right-0 mt-2 bg-white border border-slate-200/80 rounded-2xl shadow-xl z-[100] py-2 max-h-64 overflow-y-auto scrollbar-thin animate-fade-in">
          {websites.length === 0 ? (
            <div className="px-4 py-2.5 text-sm font-bold text-slate-400 italic">
              No websites found
            </div>
          ) : (
            <>
              {websites.map((w) => {
                let defaultLabel = w.url;
                try {
                  defaultLabel = new URL(w.url).hostname;
                } catch {}

                const label = w.name || defaultLabel;
                const isSelected = w.id === selectedId;
                const isEditing = editingId === w.id;
                
                // Get latest analysis score if available
                const latestAnalysis = w.analyses && w.analyses[0];
                const hasScore = latestAnalysis && latestAnalysis.status === "completed" && typeof latestAnalysis.overallScore === "number";
                const scoreValue = hasScore ? latestAnalysis.overallScore : null;

                if (isEditing) {
                  return (
                    <div
                      key={w.id}
                      className="px-4 py-2.5 flex flex-col gap-1.5 border-b border-slate-50 last:border-0"
                      onClick={(e) => e.stopPropagation()}
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
                          className="flex-1 min-w-0 px-2 py-1 text-sm font-semibold border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-accent/30 focus:border-accent bg-slate-50"
                          placeholder="Website Nickname"
                          autoFocus
                        />
                        <button
                          type="button"
                          onClick={() => handleSaveName(w.id)}
                          className="p-1 hover:bg-emerald-50 text-emerald-600 rounded-md border border-slate-100 transition-colors cursor-pointer shrink-0"
                          title="Save"
                        >
                          <HugeiconsIcon icon={Tick01Icon} size={14} />
                        </button>
                        <button
                          type="button"
                          onClick={() => setEditingId(null)}
                          className="p-1 hover:bg-rose-50 text-rose-600 rounded-md border border-slate-100 transition-colors cursor-pointer shrink-0"
                          title="Cancel"
                        >
                          <HugeiconsIcon icon={Cancel01Icon} size={14} />
                        </button>
                      </div>
                      <span className="text-xs text-slate-400 font-mono pl-1 truncate select-none">
                        Link: {w.url} (Not editable)
                      </span>
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
                    className={`w-full group flex items-center justify-between gap-3 px-4 py-2.5 text-sm text-left cursor-pointer transition-all hover:bg-slate-50 select-none ${
                      isSelected
                        ? "bg-accent-xlight/40 text-accent font-extrabold"
                        : "text-slate-650 hover:text-slate-900 font-bold"
                    }`}
                  >
                    <div className="flex items-center gap-2.5 min-w-0 flex-1">
                      {/* Left icon indicator */}
                      <div className={`w-6 h-6 rounded-lg flex items-center justify-center shrink-0 border transition-all ${
                        isSelected
                          ? "bg-accent/10 border-accent/20 text-accent"
                          : "bg-slate-50 border-slate-100 text-slate-400"
                      }`}>
                        <HugeiconsIcon icon={CompassIcon} size={13} />
                      </div>
                      <div className="flex flex-col min-w-0 flex-1">
                        <div className="flex items-center gap-1.5 min-w-0">
                          <span className="truncate leading-tight text-sm font-semibold">{label}</span>
                          {!isDemoMode && (
                            <button
                              type="button"
                              onClick={(e) => {
                                e.stopPropagation();
                                setEditingId(w.id);
                                setEditName(w.name || defaultLabel);
                              }}
                              className="p-1 opacity-0 group-hover:opacity-100 hover:bg-slate-100 text-slate-400 hover:text-slate-600 rounded-md transition-all cursor-pointer border border-transparent hover:border-slate-200 shrink-0"
                              title="Rename website"
                            >
                              <HugeiconsIcon icon={PencilEdit01Icon} size={12} />
                            </button>
                          )}
                        </div>
                        <span className="text-xs text-slate-400 truncate font-mono leading-none mt-1">
                          {w.url}
                        </span>
                      </div>
                    </div>

                    {/* Right indicators */}
                    <div className="flex items-center gap-2 shrink-0">
                      {/* Score Badge */}
                      {scoreValue !== null && (
                        <span className={`px-1.5 py-0.5 rounded-md text-[10px] font-black border font-mono ${getScoreBadgeClass(scoreValue)}`}>
                          {scoreValue}
                        </span>
                      )}
                      
                      {/* Checked visual marker */}
                      {isSelected && (
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          viewBox="0 0 20 20"
                          fill="currentColor"
                          className="w-4.5 h-4.5 text-accent"
                        >
                          <path
                            fillRule="evenodd"
                            d="M16.704 4.153a.75.75 0 01.143 1.052l-8 10.5a.75.75 0 01-1.127.075l-4.5-4.5a.75.75 0 011.06-1.06l3.894 3.893 7.48-9.817a.75.75 0 011.05-.143z"
                            clipRule="evenodd"
                          />
                        </svg>
                      )}
                    </div>
                  </div>
                );
              })}
            </>
          )}
        </div>
      )}
    </div>
  );
}

