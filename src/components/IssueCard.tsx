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
    badge: "bg-red-50 text-red-700 border border-red-100",
    iconBg: "bg-red-50/80 border border-red-100",
    iconColor: "text-red-600",
    icon: Alert01Icon,
  },
  high: {
    borderLeft: "border-l-4 border-l-orange-500",
    badge: "bg-orange-50 text-orange-700 border border-orange-100",
    iconBg: "bg-orange-50/80 border border-orange-100",
    iconColor: "text-orange-600",
    icon: Alert01Icon,
  },
  medium: {
    borderLeft: "border-l-4 border-l-amber-500",
    badge: "bg-amber-50 text-amber-700 border border-amber-100",
    iconBg: "bg-amber-50/80 border border-amber-100",
    iconColor: "text-amber-600",
    icon: Alert01Icon,
  },
  low: {
    borderLeft: "border-l-4 border-l-sky-500",
    badge: "bg-sky-50 text-sky-700 border border-sky-100",
    iconBg: "bg-sky-50/80 border border-sky-100",
    iconColor: "text-sky-600",
    icon: InformationCircleIcon,
  },
  info: {
    borderLeft: "border-l-4 border-l-slate-400",
    badge: "bg-slate-50 text-slate-700 border border-slate-200",
    iconBg: "bg-slate-50/80 border border-slate-100",
    iconColor: "text-slate-500",
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
      className={`rounded-xl border border-slate-100 bg-white ${config.borderLeft} transition-all duration-300 shadow-sm hover:shadow-md hover:border-slate-200/80 flex flex-col overflow-hidden`}
    >
      {/* Clickable Header for Collapsible/Expandable issue details */}
      <div
        onClick={() => setIsExpanded(!isExpanded)}
        className="p-4 flex items-center justify-between gap-4 cursor-pointer select-none hover:bg-slate-50/30 transition-colors"
      >
        <div className="flex items-center gap-3 min-w-0 flex-1">
          <div className={`p-2 rounded-lg ${config.iconBg} shrink-0`}>
            <HugeiconsIcon icon={SeverityIcon} size={16} className={config.iconColor} />
          </div>

          <div className="min-w-0 flex-1">
            <h4 className="text-sm font-bold text-slate-800 truncate pr-2">
              {issue.title}
            </h4>
            {issue.moduleName && (
              <span className="text-[10px] text-slate-400 font-mono mt-0.5 inline-block bg-slate-50 px-2 py-0.5 rounded border border-slate-100/60 uppercase">
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
          <div className="w-5.5 h-5.5 rounded-md flex items-center justify-center bg-slate-50 text-slate-400 hover:text-slate-600 border border-slate-100 transition-colors">
            <HugeiconsIcon
              icon={isExpanded ? ArrowUp01Icon : ArrowDown01Icon}
              size={13}
            />
          </div>
        </div>
      </div>

      {/* Expanded Content Area */}
      {isExpanded && (
        <div className="px-4 pb-4.5 pt-1.5 border-t border-slate-50 bg-slate-50/15 space-y-3.5 animate-fade-in">
          {/* Issue Description */}
          <div className="space-y-1">
            <h5 className="text-[10px] font-extrabold text-slate-400 uppercase tracking-wider">
              Description
            </h5>
            <p className="text-xs text-slate-600 font-medium leading-relaxed">
              {issue.description}
            </p>
          </div>

          {/* Technical Details (Element & Value) */}
          {(issue.element || issue.value || issue.url) && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5 bg-slate-50/50 rounded-xl p-3 border border-slate-100/50">
              {issue.element && (
                <div className="space-y-1 min-w-0">
                  <h5 className="text-[9px] font-extrabold text-slate-450 uppercase tracking-wider">
                    Target Element
                  </h5>
                  <code className="block text-[10.5px] text-indigo-700 bg-indigo-50/30 border border-indigo-100/40 rounded-lg px-2.5 py-1.5 font-mono truncate select-all" title={issue.element}>
                    {formatElement(issue.element)}
                  </code>
                </div>
              )}
              {issue.value && (
                <div className="space-y-1 min-w-0">
                  <h5 className="text-[9px] font-extrabold text-slate-450 uppercase tracking-wider">
                    Current Value
                  </h5>
                  <code className="block text-[10.5px] text-pink-700 bg-pink-50/30 border border-pink-100/40 rounded-lg px-2.5 py-1.5 font-mono truncate select-all" title={issue.value}>
                    {issue.value}
                  </code>
                </div>
              )}
              {issue.url && (
                <div className="space-y-1 min-w-0 md:col-span-2">
                  <h5 className="text-[9px] font-extrabold text-slate-450 uppercase tracking-wider">
                    Source Page URL
                  </h5>
                  <a
                    href={issue.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="block text-[10.5px] text-accent hover:text-accent-hover bg-accent-xlight/30 border border-accent/10 rounded-lg px-2.5 py-1.5 font-mono truncate"
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
            <div className="flex items-start gap-3 bg-teal-50/40 border border-teal-100/50 rounded-xl p-3.5 shadow-sm flex-1 min-w-0">
              <div className="p-1 rounded-md bg-teal-50 text-teal-600 border border-teal-100 shrink-0 mt-0.5">
                <HugeiconsIcon icon={BulbIcon} size={14} />
              </div>
              <div className="text-xs text-teal-800 leading-relaxed min-w-0">
                <strong className="text-teal-900 font-semibold block mb-0.5 text-[11px] uppercase tracking-wide">Recommendation</strong>
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
