"use client";

import type { Issue } from "@/lib/analysis/types";
import { HugeiconsIcon } from "@hugeicons/react";
import {
  Alert01Icon,
  InformationCircleIcon,
  CheckmarkCircle02Icon,
  BulbIcon,
  ArrowDown01Icon,
  ArrowUp01Icon,
} from "@hugeicons/core-free-icons";
import { useState } from "react";

export interface IssueWithModule extends Issue {
  moduleName?: string;
}

const severityConfig = {
  critical: {
    borderLeft: "border-l-4 border-l-red-500",
    badge: "bg-red-50 text-red-700 border border-red-100 dark:bg-red-950/30 dark:text-red-400 dark:border-red-900/30",
    iconBg: "bg-red-50/80 border border-red-100 dark:bg-red-950/20 dark:border-red-900/20",
    iconColor: "text-red-600 dark:text-red-400",
    icon: Alert01Icon,
  },
  high: {
    borderLeft: "border-l-4 border-l-orange-500",
    badge: "bg-orange-50 text-orange-700 border border-orange-100 dark:bg-orange-950/30 dark:text-orange-400 dark:border-orange-900/30",
    iconBg: "bg-orange-50/80 border border-orange-100 dark:bg-orange-950/20 dark:border-orange-900/20",
    iconColor: "text-orange-600 dark:text-orange-400",
    icon: Alert01Icon,
  },
  medium: {
    borderLeft: "border-l-4 border-l-amber-500",
    badge: "bg-amber-50 text-amber-700 border border-amber-100 dark:bg-amber-950/30 dark:text-amber-400 dark:border-amber-900/30",
    iconBg: "bg-amber-50/80 border border-amber-100 dark:bg-amber-950/20 dark:border-amber-900/20",
    iconColor: "text-amber-600 dark:text-amber-450",
    icon: Alert01Icon,
  },
  low: {
    borderLeft: "border-l-4 border-l-sky-500",
    badge: "bg-sky-50 text-sky-700 border border-sky-100 dark:bg-sky-950/30 dark:text-sky-400 dark:border-sky-900/30",
    iconBg: "bg-sky-50/80 border border-sky-100 dark:bg-sky-950/20 dark:border-sky-900/20",
    iconColor: "text-sky-600 dark:text-sky-400",
    icon: InformationCircleIcon,
  },
  info: {
    borderLeft: "border-l-4 border-l-slate-400",
    badge: "bg-slate-50 text-slate-700 border border-slate-200 dark:bg-slate-800 dark:text-slate-350 dark:border-slate-700",
    iconBg: "bg-slate-50/80 border border-slate-100 dark:bg-slate-850 dark:border-slate-800",
    iconColor: "text-slate-500 dark:text-slate-400",
    icon: InformationCircleIcon,
  },
};

export function IssueCard({
  issue,
}: {
  issue: IssueWithModule;
}) {
  const [isExpanded, setIsExpanded] = useState(false);
  const config = severityConfig[issue.severity] || severityConfig.info;
  const SeverityIcon = config.icon;

  // Helper to format HTML elements
  const formatElement = (el: string) => {
    if (el.length > 50) return el.slice(0, 47) + "...";
    return el;
  };

  return (
    <div
      className={`rounded-xl border border-slate-100 dark:border-slate-800/80 bg-white dark:bg-slate-900/60 ${config.borderLeft} transition-all duration-300 shadow-sm hover:shadow-md hover:border-slate-200/80 dark:hover:border-slate-700/80 flex flex-col overflow-hidden`}
    >
      {/* Clickable Header for Collapsible/Expandable issue details */}
      <div
        onClick={() => setIsExpanded(!isExpanded)}
        className="p-4 flex items-center justify-between gap-4 cursor-pointer select-none hover:bg-slate-50/30 dark:hover:bg-slate-800/20 transition-colors"
      >
        <div className="flex items-center gap-3 min-w-0 flex-1">
          <div className={`p-2 rounded-lg ${config.iconBg} shrink-0`}>
            <HugeiconsIcon icon={SeverityIcon} size={16} className={config.iconColor} />
          </div>

          <div className="min-w-0 flex-1">
            <h4 className="text-sm font-bold text-slate-800 dark:text-slate-200 truncate pr-2">
              {issue.title}
            </h4>
            {issue.moduleName && (
              <span className="text-[10px] text-slate-400 dark:text-slate-500 font-mono mt-0.5 inline-block bg-slate-50 dark:bg-slate-850 px-2 py-0.5 rounded border border-slate-100/60 dark:border-slate-800/60 uppercase">
                {issue.moduleName}
              </span>
            )}
          </div>
        </div>

        {/* Severity & Collapse indicators */}
        <div className="flex items-center gap-3 shrink-0">
          <span
            className={`px-2 py-0.5 rounded-full text-[10px] font-black uppercase font-mono tracking-wider ${config.badge}`}
          >
            {issue.severity}
          </span>
          <div className="w-5.5 h-5.5 rounded-md flex items-center justify-center bg-slate-50 dark:bg-slate-800 text-slate-400 hover:text-slate-600 dark:hover:text-slate-350 border border-slate-100 dark:border-slate-800 transition-colors">
            <HugeiconsIcon
              icon={isExpanded ? ArrowUp01Icon : ArrowDown01Icon}
              size={13}
            />
          </div>
        </div>
      </div>

      {/* Expanded Content Area */}
      {isExpanded && (
        <div className="issue-card-expanded px-4 pb-4.5 pt-1.5 border-t border-slate-50 dark:border-slate-800/60 bg-slate-50/15 dark:bg-slate-900/30 space-y-3.5 animate-fade-in">
          {/* Issue Description */}
          <div className="space-y-1">
            <h5 className="issue-card-desc-title text-[10px] font-extrabold text-slate-400 dark:text-slate-500 uppercase tracking-wider">
              Description
            </h5>
            <p className="issue-card-desc-text text-xs text-slate-600 dark:text-slate-300 font-medium leading-relaxed">
              {issue.description}
            </p>
          </div>

          {/* Technical Details (Element & Value) */}
          {(issue.element || issue.value || issue.url) && (
            <div className="issue-card-tech-box grid grid-cols-1 md:grid-cols-2 gap-3.5 bg-slate-50/50 dark:bg-slate-950/40 rounded-xl p-3 border border-slate-100/50 dark:border-slate-850/50">
              {issue.element && (
                <div className="space-y-1 min-w-0">
                  <h5 className="issue-card-tech-title text-[9px] font-extrabold text-slate-450 dark:text-slate-500 uppercase tracking-wider">
                    Target Element
                  </h5>
                  <code className="issue-card-code-element block text-[10.5px] text-indigo-700 dark:text-indigo-300 bg-indigo-50/30 dark:bg-indigo-950/30 border border-indigo-100/40 dark:border-indigo-900/35 rounded-lg px-2.5 py-1.5 font-mono truncate select-all" title={issue.element}>
                    {formatElement(issue.element)}
                  </code>
                </div>
              )}
              {issue.value && (
                <div className="space-y-1 min-w-0">
                  <h5 className="issue-card-tech-title text-[9px] font-extrabold text-slate-450 dark:text-slate-500 uppercase tracking-wider">
                    Current Value
                  </h5>
                  <code className="issue-card-code-value block text-[10.5px] text-pink-700 dark:text-pink-300 bg-pink-50/30 dark:bg-pink-950/30 border border-pink-100/40 dark:border-pink-900/35 rounded-lg px-2.5 py-1.5 font-mono truncate select-all" title={issue.value}>
                    {issue.value}
                  </code>
                </div>
              )}
              {issue.url && (
                <div className="space-y-1 min-w-0 md:col-span-2">
                  <h5 className="issue-card-tech-title text-[9px] font-extrabold text-slate-450 dark:text-slate-500 uppercase tracking-wider">
                    Source Page URL
                  </h5>
                  <a
                    href={issue.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="issue-card-url-link block text-[10.5px] text-accent hover:text-accent-hover dark:text-accent dark:hover:text-accent-hover bg-accent-xlight/30 dark:bg-accent/5 border border-accent/10 dark:border-accent/10 rounded-lg px-2.5 py-1.5 font-mono truncate"
                    title={issue.url}
                  >
                    {issue.url}
                  </a>
                </div>
              )}
            </div>
          )}

          {/* Recommendation Area */}
          <div className="flex flex-col sm:flex-row sm:items-start gap-3 pt-1">
            <div className="issue-card-rec-box flex items-start gap-3 bg-teal-50/40 dark:bg-teal-950/20 border border-teal-100/50 dark:border-teal-900/30 rounded-xl p-3.5 shadow-sm flex-1 min-w-0">
              <div className="issue-card-rec-icon p-1 rounded-md bg-teal-50 dark:bg-teal-900/30 text-teal-600 dark:text-teal-400 border border-teal-100 dark:border-teal-900/45 shrink-0 mt-0.5">
                <HugeiconsIcon icon={BulbIcon} size={14} />
              </div>
              <div className="issue-card-rec-text text-xs text-teal-800 dark:text-teal-300 leading-relaxed min-w-0">
                <strong className="issue-card-rec-title text-teal-900 dark:text-teal-200 font-semibold block mb-0.5 text-[11px] uppercase tracking-wide">Recommendation</strong>
                {issue.recommendation}
              </div>
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
      <div className="text-center py-10 bg-slate-50 border border-slate-100 rounded-2xl shadow-inner flex flex-col items-center">
        <div className="w-10 h-10 rounded-full bg-emerald-50 text-emerald-600 flex items-center justify-center border border-emerald-100 mb-3">
          <HugeiconsIcon icon={CheckmarkCircle02Icon} size={20} />
        </div>
        <p className="text-sm font-bold text-slate-800">No issues found</p>
        <p className="text-xs text-slate-500 mt-0.5 font-semibold">
          Your page matches all primary checks in this module.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-3 stagger-children">
      {sorted.map((issue, i) => (
        <IssueCard
          key={`${issue.id}-${i}`}
          issue={issue}
        />
      ))}
    </div>
  );
}
