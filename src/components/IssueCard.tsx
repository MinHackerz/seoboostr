"use client";

import type { Issue } from "@/lib/analysis/types";
import { HugeiconsIcon } from "@hugeicons/react";
import {
  BulbIcon,
  ArrowDown01Icon,
  ArrowUp01Icon,
  CheckmarkCircle02Icon,
} from "@hugeicons/core-free-icons";
import { useState } from "react";

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
        <div className="px-3.5 pb-4 pt-2 border-t border-slate-50 dark:border-slate-800/40 text-xs space-y-4 animate-fade-in">
          {/* Issue Description */}
          <div className="space-y-1">
            <h5 className="text-[9px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider">
              Description
            </h5>
            <p className="text-slate-600 dark:text-slate-350 font-medium leading-relaxed">
              {issue.description}
            </p>
          </div>

          {/* Technical Details */}
          {(issue.element || issue.value || issue.url) && (
            <div className="space-y-1.5 pt-1">
              <h5 className="text-[9px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider">
                Technical Details
              </h5>
              <div className="bg-slate-50/50 dark:bg-slate-950/20 border border-slate-100 dark:border-slate-850 rounded-lg p-2.5 font-mono text-[10px] space-y-1.5">
                {issue.element && (
                  <div className="flex items-start gap-2">
                    <span className="text-slate-400 dark:text-slate-500 font-bold w-14 shrink-0">Element:</span>
                    <span className="text-indigo-650 dark:text-indigo-400 truncate select-all" title={issue.element}>
                      {issue.element}
                    </span>
                  </div>
                )}
                {issue.value && (
                  <div className="flex items-start gap-2">
                    <span className="text-slate-400 dark:text-slate-500 font-bold w-14 shrink-0">Value:</span>
                    <span className="text-pink-650 dark:text-pink-400 truncate select-all" title={issue.value}>
                      {issue.value}
                    </span>
                  </div>
                )}
                {issue.url && (
                  <div className="flex items-start gap-2">
                    <span className="text-slate-400 dark:text-slate-500 font-bold w-14 shrink-0">Page:</span>
                    <a
                      href={issue.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-accent hover:underline truncate"
                      title={issue.url}
                    >
                      {issue.url}
                    </a>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Recommendation Area */}
          <div className="pt-3 flex items-start gap-2 text-slate-650 dark:text-slate-355 leading-relaxed border-t border-slate-100/50 dark:border-slate-800/40">
            <HugeiconsIcon icon={BulbIcon} size={14} className="text-amber-500 shrink-0 mt-0.5" />
            <div>
              <span className="font-bold text-slate-700 dark:text-slate-200 block text-[10px] uppercase tracking-wider mb-0.5">Recommendation</span>
              {issue.recommendation}
            </div>
          </div>
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
