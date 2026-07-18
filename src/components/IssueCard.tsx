"use client";

import type { Issue } from "@/lib/analysis/types";
import { HugeiconsIcon } from "@hugeicons/react";
import {
  BulbIcon,
  ArrowDown01Icon,
  ArrowUp01Icon,
  CheckmarkCircle02Icon,
  Copy01Icon,
  Tick01Icon,
  ArrowRight01Icon,
  AlertDiamondIcon,
} from "@hugeicons/core-free-icons";
import { useState, useCallback } from "react";

export interface IssueWithModule extends Issue {
  moduleName?: string;
}

const severityConfig = {
  critical: {
    badge: "bg-rose-50 text-rose-600 border border-rose-100/80 dark:bg-rose-950/20 dark:text-rose-450 dark:border-rose-900/30",
    dotColor: "bg-rose-500 dark:bg-rose-450",
  },
  high: {
    badge: "bg-orange-50 text-orange-600 border border-orange-100/80 dark:bg-orange-950/20 dark:text-orange-450 dark:border-orange-900/30",
    dotColor: "bg-orange-500 dark:bg-orange-450",
  },
  medium: {
    badge: "bg-amber-50 text-amber-600 border border-amber-100/80 dark:bg-amber-950/20 dark:text-amber-450 dark:border-amber-900/30",
    dotColor: "bg-amber-500 dark:bg-amber-450",
  },
  low: {
    badge: "bg-slate-50 text-slate-600 border border-slate-200/60 dark:bg-slate-800 dark:text-slate-400 dark:border-slate-700",
    dotColor: "bg-slate-400 dark:bg-slate-500",
  },
  info: {
    badge: "bg-slate-50 text-slate-600 border border-slate-200/60 dark:bg-slate-800 dark:text-slate-400 dark:border-slate-700",
    dotColor: "bg-slate-400 dark:bg-slate-500",
  },
};

function CodeSnippetBlock({ snippet }: { snippet: NonNullable<Issue["codeSnippet"]> }) {
  const [copied, setCopied] = useState(false);

  const handleCopy = useCallback(async () => {
    try {
      await navigator.clipboard.writeText(snippet.code);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // Fallback for older browsers
      const textarea = document.createElement("textarea");
      textarea.value = snippet.code;
      textarea.style.position = "fixed";
      textarea.style.opacity = "0";
      document.body.appendChild(textarea);
      textarea.select();
      document.execCommand("copy");
      document.body.removeChild(textarea);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  }, [snippet.code]);

  return (
    <div className="space-y-1.5">
      <div className="flex items-center justify-between">
        <h5 className="text-[9px] font-bold text-emerald-600 dark:text-emerald-400 uppercase tracking-wider flex items-center gap-1.5">
          <span className="w-1 h-1 rounded-full bg-emerald-500" />
          How to Fix
        </h5>
        <span className="text-[9px] text-slate-400 dark:text-slate-500 font-mono uppercase">
          {snippet.language}
        </span>
      </div>
      {snippet.label && (
        <p className="text-[10px] text-slate-500 dark:text-slate-400 font-medium">
          {snippet.label}
        </p>
      )}
      <div className="relative group">
        <pre className="bg-slate-900 dark:bg-slate-950 text-slate-100 rounded-lg p-3 text-[10px] leading-relaxed font-mono overflow-x-auto border border-slate-800 dark:border-slate-800/60 scrollbar-thin">
          <code>{snippet.code}</code>
        </pre>
        <button
          onClick={(e) => {
            e.stopPropagation();
            handleCopy();
          }}
          className="absolute top-2 right-2 p-1.5 rounded-md bg-slate-800/80 hover:bg-slate-700 border border-slate-700/50 text-slate-400 hover:text-slate-200 transition-all opacity-0 group-hover:opacity-100 cursor-pointer"
          title="Copy to clipboard"
        >
          <HugeiconsIcon
            icon={copied ? Tick01Icon : Copy01Icon}
            size={11}
            className={copied ? "text-emerald-400" : ""}
          />
        </button>
        {copied && (
          <span className="absolute top-2 right-10 text-[9px] text-emerald-400 font-bold animate-fade-in">
            Copied!
          </span>
        )}
      </div>
    </div>
  );
}

function AffectedItemsList({ items }: { items: string[] }) {
  const [showAll, setShowAll] = useState(false);
  const displayItems = showAll ? items : items.slice(0, 5);
  const hasMore = items.length > 5;

  return (
    <div className="space-y-1.5">
      <h5 className="text-[9px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider">
        Affected Items ({items.length})
      </h5>
      <ul className="space-y-1">
        {displayItems.map((item, idx) => (
          <li
            key={idx}
            className="flex items-start gap-2 text-[10px] text-slate-600 dark:text-slate-400 font-mono"
          >
            <span className="text-slate-300 dark:text-slate-600 mt-0.5 shrink-0">›</span>
            <span className="truncate select-all" title={item}>
              {item}
            </span>
          </li>
        ))}
      </ul>
      {hasMore && (
        <button
          onClick={(e) => {
            e.stopPropagation();
            setShowAll(!showAll);
          }}
          className="text-[9px] text-accent font-bold hover:underline cursor-pointer"
        >
          {showAll ? "Show less" : `+ ${items.length - 5} more`}
        </button>
      )}
    </div>
  );
}

function AffectedPagesList({ pages }: { pages: string[] }) {
  const [showAll, setShowAll] = useState(false);
  const displayPages = showAll ? pages : pages.slice(0, 5);
  const hasMore = pages.length > 5;

  return (
    <div className="space-y-1.5">
      <h5 className="text-[9px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider">
        Affected Pages ({pages.length})
      </h5>
      <ul className="space-y-1">
        {displayPages.map((pageUrl, idx) => {
          let label = pageUrl;
          try {
            const u = new URL(pageUrl);
            label = u.pathname === "/" ? "Home (/)" : u.pathname;
          } catch { }
          return (
            <li
              key={idx}
              className="flex items-center gap-2 text-[10px]"
            >
              <span className="text-slate-300 dark:text-slate-600 mt-0.5 shrink-0">›</span>
              <a
                href={pageUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="issue-card-url-link text-accent hover:underline truncate select-all font-mono px-1 py-0.5 rounded"
                title={pageUrl}
              >
                {label}
              </a>
            </li>
          );
        })}
      </ul>
      {hasMore && (
        <button
          onClick={(e) => {
            e.stopPropagation();
            setShowAll(!showAll);
          }}
          className="text-[9px] text-accent font-bold hover:underline cursor-pointer"
        >
          {showAll ? "Show less" : `+ ${pages.length - 5} more`}
        </button>
      )}
    </div>
  );
}

export function IssueCard({
  issue,
}: {
  issue: IssueWithModule;
}) {
  const [isExpanded, setIsExpanded] = useState(false);
  const config = severityConfig[issue.severity] || severityConfig.info;

  return (
    <div
      className="rounded-xl border border-slate-100 dark:border-slate-800/80 bg-white dark:bg-slate-900/60 transition-all duration-200 hover:bg-slate-50/20 dark:hover:bg-slate-850/20 hover:border-slate-200/80 dark:hover:border-slate-750"
    >
      {/* Clickable Header */}
      <div
        onClick={() => setIsExpanded(!isExpanded)}
        className="p-3.5 flex items-center justify-between gap-4 cursor-pointer select-none"
      >
        <div className="flex items-center gap-3 min-w-0 flex-1">
          {/* Elegant mini severity dot */}
          <span className={`w-2 h-2 rounded-full ${config.dotColor} shrink-0`} />
          
          <div className="min-w-0 flex-1 flex flex-wrap items-center gap-x-2 gap-y-1">
            <h4 className="text-xs font-bold text-slate-800 dark:text-slate-200 truncate max-w-full">
              {issue.title}
            </h4>
            {issue.moduleName && (
              <span className="text-[9px] text-slate-400 dark:text-slate-550 font-mono bg-slate-50 dark:bg-slate-850 px-1.5 py-0.5 rounded border border-slate-100 dark:border-slate-800/60 uppercase tracking-wider">
                {issue.moduleName}
              </span>
            )}
          </div>
        </div>

        {/* Severity badge & Collapse toggle */}
        <div className="flex items-center gap-3 shrink-0">
          <span
            className={`px-2 py-0.5 rounded-md text-[9px] font-bold uppercase tracking-wider ${config.badge}`}
          >
            {issue.severity}
          </span>
          <div className="text-slate-400 hover:text-slate-650 dark:hover:text-slate-350 transition-colors">
            <HugeiconsIcon
              icon={isExpanded ? ArrowUp01Icon : ArrowDown01Icon}
              size={12}
            />
          </div>
        </div>
      </div>

      {/* Expanded Content Area */}
      {isExpanded && (
        <div className="issue-card-expanded px-3.5 pb-4 pt-2 border-t border-slate-50 dark:border-slate-800/40 text-xs space-y-4 animate-fade-in">
          {/* Issue Description */}
          <div className="space-y-1">
            <h5 className="issue-card-desc-title text-[9px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider">
              Description
            </h5>
            <p className="issue-card-desc-text text-slate-650 dark:text-slate-305 font-medium leading-relaxed">
              {issue.description}
            </p>
          </div>

          {/* Impact Badge */}
          {issue.impact && (
            <div className="issue-card-impact-box flex items-start gap-2 bg-violet-50/60 dark:bg-violet-950/15 border border-violet-100/80 dark:border-violet-900/25 rounded-lg px-3 py-2">
              <HugeiconsIcon icon={AlertDiamondIcon} size={13} className="issue-card-impact-icon text-violet-500 dark:text-violet-400 shrink-0 mt-px" />
              <div>
                <span className="issue-card-impact-title text-[9px] font-bold text-violet-600 dark:text-violet-400 uppercase tracking-wider block">Impact</span>
                <span className="issue-card-impact-text text-[10px] text-violet-700 dark:text-violet-300 font-medium leading-relaxed">
                  {issue.impact}
                </span>
              </div>
            </div>
          )}

          {/* Affected Pages */}
          {issue.affectedPages && issue.affectedPages.length > 0 && (
            <AffectedPagesList pages={issue.affectedPages} />
          )}

          {/* Affected Items */}
          {issue.affectedItems && issue.affectedItems.length > 0 && (
            <AffectedItemsList items={issue.affectedItems} />
          )}

          {/* Technical Details */}
          {(issue.element || issue.value || issue.url) && (
            <div className="space-y-1.5 pt-1">
              <h5 className="issue-card-tech-title text-[9px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider">
                Technical Details
              </h5>
              <div className="issue-card-tech-box bg-slate-50/50 dark:bg-slate-950/20 border border-slate-100 dark:border-slate-850 rounded-lg p-2.5 font-mono text-[10px] space-y-1.5">
                {issue.element && (
                  <div className="flex items-start gap-2">
                    <span className="issue-card-tech-title text-slate-400 dark:text-slate-500 font-bold w-14 shrink-0">Element:</span>
                    <span className="issue-card-code-element text-indigo-650 dark:text-indigo-400 truncate select-all" title={issue.element}>
                      {issue.element}
                    </span>
                  </div>
                )}
                {issue.value && (
                  <div className="flex items-start gap-2">
                    <span className="issue-card-tech-title text-slate-400 dark:text-slate-500 font-bold w-14 shrink-0">Value:</span>
                    <span className="issue-card-code-value text-pink-650 dark:text-pink-400 truncate select-all" title={issue.value}>
                      {issue.value}
                    </span>
                  </div>
                )}
                {issue.url && (
                  <div className="flex items-start gap-2">
                    <span className="issue-card-tech-title text-slate-400 dark:text-slate-500 font-bold w-14 shrink-0">Page:</span>
                    <a
                      href={issue.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="issue-card-url-link text-accent hover:underline truncate"
                      title={issue.url}
                    >
                      {issue.url}
                    </a>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Code Snippet (How to Fix) */}
          {issue.codeSnippet && (
            <CodeSnippetBlock snippet={issue.codeSnippet} />
          )}

          {/* Recommendation Area */}
          <div className="issue-card-rec-box flex items-start gap-3 bg-teal-50/40 dark:bg-teal-950/20 border border-teal-100/50 dark:border-teal-900/30 rounded-xl p-3.5 shadow-sm">
            <div className="issue-card-rec-icon p-1 rounded-md bg-teal-50 dark:bg-teal-900/30 text-teal-600 dark:text-teal-400 border border-teal-100 dark:border-teal-900/45 shrink-0 mt-0.5">
              <HugeiconsIcon icon={BulbIcon} size={14} />
            </div>
            <div className="issue-card-rec-text text-xs text-teal-800 dark:text-teal-300 leading-relaxed min-w-0">
              <strong className="issue-card-rec-title text-teal-900 dark:text-teal-200 font-bold block mb-0.5 text-[10px] uppercase tracking-wider">Recommendation</strong>
              {issue.recommendation}
            </div>
          </div>

          {/* Learn More Link */}
          {issue.learnMoreUrl && (
            <div className="pt-1">
              <a
                href={issue.learnMoreUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1 text-[10px] font-bold text-accent hover:underline transition-colors"
              >
                Learn more
                <HugeiconsIcon icon={ArrowRight01Icon} size={10} />
              </a>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

export function IssueList({
  issues,
}: {
  issues: IssueWithModule[];
}) {
  const sorted = [...issues].sort((a, b) => {
    const order = { critical: 0, high: 1, medium: 2, low: 3, info: 4 };
    return order[a.severity] - order[b.severity];
  });

  if (sorted.length === 0) {
    return (
      <div className="text-center py-8 bg-slate-50 border border-slate-100 rounded-xl flex flex-col items-center">
        <div className="w-8 h-8 rounded-full bg-emerald-50 text-emerald-600 flex items-center justify-center border border-emerald-100 mb-2.5">
          <HugeiconsIcon icon={CheckmarkCircle02Icon} size={16} />
        </div>
        <p className="text-xs font-bold text-slate-800">No issues found</p>
        <p className="text-[11px] text-slate-500 mt-0.5 font-semibold">
          Your page matches all primary checks in this module.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-2 stagger-children">
      {sorted.map((issue, i) => (
        <IssueCard
          key={`${issue.id}-${i}`}
          issue={issue}
        />
      ))}
    </div>
  );
}
