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
  GithubIcon,
  GitPullRequestIcon,
  Tick02Icon,
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
  onFixIssue,
  isFixing,
  isFixingInBackground,
  isCompleted,
  isVerifying,
  onVerifyFix,
  hasGithubLinked,
  onOpenGithubSettings,
}: {
  issue: IssueWithModule;
  onFixIssue?: (issue: any) => Promise<void>;
  isFixing?: boolean;
  isFixingInBackground?: boolean;
  isCompleted?: boolean;
  isVerifying?: boolean;
  onVerifyFix?: (issue: any) => Promise<void>;
  hasGithubLinked?: boolean;
  onOpenGithubSettings?: () => void;
}) {
  const [isExpanded, setIsExpanded] = useState(false);
  const config = severityConfig[issue.severity] || severityConfig.info;
  const SeverityIcon = config.icon;

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
            {!isExpanded && (
              <p className="text-xs text-slate-400 font-medium truncate mt-0.5">
                {issue.description}
              </p>
            )}
          </div>
        </div>

        <div className="flex items-center gap-2.5 shrink-0">
          {/* Severity Badge */}
          <span
            className={`px-2.5 py-0.5 rounded-full text-[9px] font-bold uppercase tracking-wider ${config.badge} hidden xs:inline-block`}
          >
            {issue.severity}
          </span>

          {/* Optional Module Name Badge */}
          {issue.moduleName && (
            <span className="px-2.5 py-0.5 rounded-full text-[9px] font-bold uppercase tracking-wider bg-slate-50 text-slate-500 border border-slate-100 capitalize">
              {issue.moduleName.replace(/([A-Z])/g, " $1").trim()}
            </span>
          )}

          {/* Optional Page URL Badge — clickable link */}
          {issue.url && (
            <a
              href={issue.url}
              target="_blank"
              rel="noopener noreferrer"
              onClick={(e) => e.stopPropagation()}
              className="px-2.5 py-0.5 rounded-full text-[9px] font-bold bg-slate-100 text-slate-600 border border-slate-200/60 font-mono truncate max-w-[140px] inline-flex items-center gap-1 hover:bg-accent/10 hover:text-accent hover:border-accent/30 transition-colors duration-150 no-underline"
              title={`Open ${issue.url} in new tab`}
            >
              <span className="truncate">
                {(() => {
                  try {
                    const u = new URL(issue.url);
                    return u.pathname === "/" ? "Home (/)" : u.pathname;
                  } catch {
                    return issue.url;
                  }
                })()}
              </span>
              <svg xmlns="http://www.w3.org/2000/svg" width="8" height="8" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="shrink-0 opacity-50"><path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"/><polyline points="15 3 21 3 21 9"/><line x1="10" y1="14" x2="21" y2="3"/></svg>
            </a>
          )}

          {/* Action Trigger Chevron */}
          <div
            className="p-1 hover:bg-slate-100 rounded-lg transition-colors duration-200 text-slate-400 hover:text-slate-600"
          >
            <HugeiconsIcon
              icon={isExpanded ? ArrowUp01Icon : ArrowDown01Icon}
              size={16}
            />
          </div>
        </div>
      </div>

      {/* Expanded view */}
      {isExpanded && (
        <div className="border-t border-slate-100/60 p-4 bg-slate-50/20 space-y-4 animate-fade-in">
          <div className="space-y-1">
            <span className="text-[9px] font-bold text-slate-400 uppercase tracking-wider block">Description</span>
            <p className="text-xs text-slate-600 leading-relaxed font-semibold">
              {issue.description}
            </p>
          </div>

          {issue.value && (
            <div className="space-y-1.5">
              <span className="text-[9px] font-bold text-slate-400 uppercase tracking-wider block">Detected Value / Context</span>
              <div className="text-xs font-mono bg-white border border-slate-100 rounded-lg p-2.5 text-slate-600 break-all select-all max-h-32 overflow-y-auto font-medium">
                {issue.value}
              </div>
            </div>
          )}

          {issue.element && issue.element !== issue.value && (
            <div className="space-y-1.5">
              <span className="text-[9px] font-bold text-slate-400 uppercase tracking-wider block">Affected HTML Element</span>
              <div className="text-xs font-mono bg-white border border-slate-100 rounded-lg p-2.5 text-slate-600 break-all select-all max-h-32 overflow-y-auto font-medium">
                {issue.element}
              </div>
            </div>
          )}

          {/* Recommendation + Action Button Area */}
          <div className="flex flex-col sm:flex-row sm:items-start gap-3 pt-1">
            {/* Recommendation block */}
            <div className="flex items-start gap-3 bg-teal-50/40 border border-teal-100/50 rounded-xl p-3.5 shadow-sm flex-1 min-w-0">
              <div className="p-1 rounded-md bg-teal-50 text-teal-600 border border-teal-100 shrink-0 mt-0.5">
                <HugeiconsIcon icon={BulbIcon} size={14} />
              </div>
              <div className="text-xs text-teal-800 leading-relaxed min-w-0">
                <strong className="text-teal-900 font-semibold block mb-0.5 text-[11px] uppercase tracking-wide">Recommendation</strong>
                {issue.recommendation}
              </div>
            </div>

            {/* Action button stack */}
            {onFixIssue && (
              <div className="flex flex-col gap-1.5 shrink-0 w-full sm:w-[156px]">
                {/* Primary action button — morphs through all fix states */}
                {hasGithubLinked ? (
                  <button
                    disabled={true}
                    className="w-full flex items-center justify-center gap-2 h-9 px-4 rounded-lg text-[11px] font-semibold bg-slate-100 text-slate-400 border border-slate-200 cursor-not-allowed select-none"
                  >
                    <HugeiconsIcon
                      icon={GitPullRequestIcon}
                      size={13}
                      className="shrink-0 text-slate-400"
                    />
                    <span>AI Fix: Coming Soon</span>
                  </button>
                ) : (
                  <button
                    onClick={(e) => { e.stopPropagation(); onOpenGithubSettings?.(); }}
                    className="w-full flex items-center justify-center gap-2 h-9 px-4 rounded-lg text-[11px] font-semibold bg-white border border-slate-200 hover:border-slate-300 hover:bg-slate-50 text-slate-600 transition-all duration-150 cursor-pointer select-none"
                  >
                    <HugeiconsIcon icon={GithubIcon} size={13} className="shrink-0 text-slate-400" />
                    <span>Connect GitHub</span>
                  </button>
                )}

                {/* Secondary: Verify Fix — only appears once fix is applied */}
                {isCompleted && onVerifyFix && (
                  <button
                    onClick={(e) => { e.stopPropagation(); onVerifyFix(issue); }}
                    disabled={isVerifying}
                    className="w-full flex items-center justify-center gap-2 h-9 px-4 rounded-lg text-[11px] font-semibold bg-white border border-slate-200 hover:border-slate-300 hover:bg-slate-50 text-slate-600 transition-all duration-150 cursor-pointer select-none disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {isVerifying ? (
                      <>
                        <svg className="animate-spin w-3.5 h-3.5 shrink-0 text-slate-400" fill="none" viewBox="0 0 24 24">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                        </svg>
                        <span>Verifying…</span>
                      </>
                    ) : (
                      <>
                        <HugeiconsIcon icon={Tick02Icon} size={13} className="shrink-0 text-slate-400" />
                        <span>Verify Fix</span>
                      </>
                    )}
                  </button>
                )}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

export function IssueList({
  issues,
  onFixIssue,
  isFixingMap = {},
  fixingInBackgroundMap = {},
  completedFixesMap = {},
  isVerifyingMap = {},
  onVerifyFix,
  hasGithubLinked,
  onOpenGithubSettings,
}: {
  issues: IssueWithModule[];
  onFixIssue?: (issue: any) => Promise<void>;
  isFixingMap?: Record<string, boolean>;
  fixingInBackgroundMap?: Record<string, boolean>;
  completedFixesMap?: Record<string, boolean>;
  isVerifyingMap?: Record<string, boolean>;
  onVerifyFix?: (issue: any) => Promise<void>;
  hasGithubLinked?: boolean;
  onOpenGithubSettings?: () => void;
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
          onFixIssue={onFixIssue}
          isFixing={isFixingMap[issue.id]}
          isFixingInBackground={fixingInBackgroundMap[issue.id]}
          isCompleted={completedFixesMap[issue.id]}
          isVerifying={isVerifyingMap[issue.id]}
          onVerifyFix={onVerifyFix}
          hasGithubLinked={hasGithubLinked}
          onOpenGithubSettings={onOpenGithubSettings}
        />
      ))}
    </div>
  );
}
