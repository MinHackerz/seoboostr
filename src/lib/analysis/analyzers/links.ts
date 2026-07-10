import type { Analyzer, ModuleResult, Issue, ParsedPage, FetchResult } from "../types";

const GENERIC_ANCHOR_PATTERNS = [
  /^click\s*here$/i,
  /^here$/i,
  /^read\s*more$/i,
  /^learn\s*more$/i,
  /^more$/i,
  /^link$/i,
  /^this$/i,
  /^go$/i,
  /^see\s*more$/i,
  /^continue$/i,
  /^details$/i,
  /^view$/i,
];

export const linksAnalyzer: Analyzer = {
  name: "links",
  async analyze(page: ParsedPage, fetchResult: FetchResult): Promise<ModuleResult> {
    const startTime = Date.now();
    const issues: Issue[] = [];
    const data: Record<string, unknown> = {};

    const allLinks = page.links || [];
    const internalLinks = allLinks.filter((l) => l.isInternal);
    const externalLinks = allLinks.filter((l) => !l.isInternal);

    data.totalLinks = allLinks.length;
    data.internalLinkCount = internalLinks.length;
    data.externalLinkCount = externalLinks.length;

    // ── 1. Too many internal links (link equity dilution) ───────────
    if (internalLinks.length > 100) {
      issues.push({
        id: "links-too-many-links",
        title: "Excessive internal links on page",
        description: `Page has ${internalLinks.length} internal links. Google may devalue links when there are too many, diluting PageRank flow.`,
        severity: "medium",
        recommendation: "Reduce internal links to under 100 per page. Prioritize the most important pages and use navigation wisely.",
        value: `${internalLinks.length} internal links`,
      });
    }

    // ── 2. Nofollow on internal links ───────────────────────────────
    const nofollowInternal = internalLinks.filter((l) => l.isNofollow);
    data.nofollowInternalCount = nofollowInternal.length;

    if (nofollowInternal.length > 0) {
      issues.push({
        id: "links-nofollow-internal",
        title: "Internal links with rel=\"nofollow\"",
        description: `Found ${nofollowInternal.length} internal link(s) with rel="nofollow". This wastes crawl budget and prevents PageRank from flowing to your own pages.`,
        severity: "high",
        recommendation: "Remove rel=\"nofollow\" from internal links. Use robots.txt or meta robots to control crawling if needed.",
        element: nofollowInternal.slice(0, 3).map((l) => l.href).join(", "),
        value: `${nofollowInternal.length} nofollow internal links`,
      });
    }

    // ── 3. Empty href links ─────────────────────────────────────────
    const emptyHrefLinks = allLinks.filter(
      (l) => !l.href || l.href === "#" || l.href === "javascript:void(0)" || l.href === "javascript:;"
    );
    data.emptyHrefCount = emptyHrefLinks.length;

    if (emptyHrefLinks.length > 0) {
      issues.push({
        id: "links-empty-href",
        title: "Links with empty or placeholder href",
        description: `Found ${emptyHrefLinks.length} link(s) with empty, "#", or "javascript:void(0)" href values. These provide no SEO value and confuse crawlers.`,
        severity: "medium",
        recommendation: "Replace empty hrefs with actual URLs, or use <button> elements for non-navigation interactive elements.",
        value: `${emptyHrefLinks.length} empty/placeholder links`,
      });
    }

    // ── 4. Generic anchor text ──────────────────────────────────────
    const genericAnchors = internalLinks.filter((l) => {
      const text = l.text.trim();
      if (!text) return false;
      return GENERIC_ANCHOR_PATTERNS.some((pat) => pat.test(text));
    });
    data.genericAnchorCount = genericAnchors.length;

    if (genericAnchors.length > 0) {
      issues.push({
        id: "links-generic-anchor",
        title: "Generic anchor text used for internal links",
        description: `Found ${genericAnchors.length} internal link(s) with generic text like "click here" or "read more". Descriptive anchor text helps search engines understand linked page content.`,
        severity: "medium",
        recommendation: "Use descriptive, keyword-relevant anchor text that describes the linked page content.",
        element: genericAnchors.slice(0, 5).map((l) => `"${l.text}" → ${l.href}`).join("; "),
        value: `${genericAnchors.length} generic anchors`,
      });
    }

    // ── 5. No outbound links (island page) ──────────────────────────
    if (externalLinks.length === 0 && page.wordCount > 300) {
      issues.push({
        id: "links-no-outbound",
        title: "No outbound links on the page",
        description: "This content page has no external links. Pages that cite authoritative sources tend to rank better.",
        severity: "low",
        recommendation: "Link to authoritative external sources to demonstrate expertise and provide value to users.",
        value: "0 outbound links",
      });
    }

    // ── 6. Excessive nofollow on external links ─────────────────────
    const nofollowExternal = externalLinks.filter((l) => l.isNofollow);
    if (externalLinks.length > 0) {
      const nofollowRatio = nofollowExternal.length / externalLinks.length;
      data.externalNofollowRatio = Math.round(nofollowRatio * 100);

      if (nofollowRatio > 0.5 && externalLinks.length >= 5) {
        issues.push({
          id: "links-excessive-nofollow-external",
          title: "Majority of external links are nofollow",
          description: `${Math.round(nofollowRatio * 100)}% of external links (${nofollowExternal.length}/${externalLinks.length}) are nofollow. Excessive nofollowing may appear manipulative to search engines.`,
          severity: "low",
          recommendation: "Only use rel=\"nofollow\" for truly untrusted links (user-generated content, paid links). Editorial links to authoritative sources should be followed.",
          value: `${nofollowExternal.length}/${externalLinks.length} nofollow`,
        });
      }
    }

    // ── 7. Links with empty anchor text (no text, no aria-label) ────
    const emptyTextLinks = allLinks.filter((l) => {
      const hasText = l.text && l.text.trim().length > 0;
      return !hasText && l.href && l.href !== "#";
    });
    data.emptyTextLinkCount = emptyTextLinks.length;

    if (emptyTextLinks.length > 0) {
      issues.push({
        id: "links-empty-text",
        title: "Links without visible anchor text",
        description: `Found ${emptyTextLinks.length} link(s) with no visible text. Search engines cannot determine the topic of the linked page without anchor text.`,
        severity: "medium",
        recommendation: "Add descriptive text to all links. For image links, use alt text on the image. For icon links, use aria-label.",
        element: emptyTextLinks.slice(0, 5).map((l) => l.href).join(", "),
        value: `${emptyTextLinks.length} empty text links`,
      });
    }

    // ── 8. Links opening in same window (external) ──────────────────
    const externalSameWindow = externalLinks.filter(
      (l) => l.target !== "_blank" && l.href && !l.href.startsWith("#")
    );

    if (externalSameWindow.length > 3) {
      issues.push({
        id: "links-external-same-window",
        title: "External links open in the same window",
        description: `${externalSameWindow.length} external link(s) open in the same tab/window, navigating users away from your site.`,
        severity: "low",
        recommendation: "Consider adding target=\"_blank\" with rel=\"noopener noreferrer\" to external links to keep users on your site.",
        value: `${externalSameWindow.length} external links without target="_blank"`,
      });
    }

    // ── Score ────────────────────────────────────────────────────────
    const criticalCount = issues.filter((i) => i.severity === "critical").length;
    const highCount = issues.filter((i) => i.severity === "high").length;
    const mediumCount = issues.filter((i) => i.severity === "medium").length;
    const lowCount = issues.filter((i) => i.severity === "low").length;

    const score = Math.max(
      0,
      100 - criticalCount * 20 - highCount * 10 - mediumCount * 5 - lowCount * 2
    );

    return {
      module: "links",
      status: "completed",
      score,
      issues,
      data,
      executionTimeMs: Date.now() - startTime,
    };
  },
};
