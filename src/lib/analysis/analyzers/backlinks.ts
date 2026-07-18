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

export const backlinksAnalyzer: Analyzer = {
  name: "backlinks",
  async analyze(page: ParsedPage, _fetchResult: FetchResult): Promise<ModuleResult> {
    const startTime = Date.now();
    const issues: Issue[] = [];
    const data: Record<string, unknown> = {};

    const allLinks = page.links || [];
    const internalLinks = allLinks.filter((l) => l.isInternal);
    const externalLinks = allLinks.filter((l) => !l.isInternal);

    data.totalLinks = allLinks.length;
    data.internalLinksCount = internalLinks.length;
    data.externalLinksCount = externalLinks.length;

    // 1. Anchor Text Distribution Check (Over-optimization & Generic anchors)
    const genericAnchorsCount = allLinks.filter((link) => {
      const text = (link.text || "").trim();
      return GENERIC_ANCHOR_PATTERNS.some((pat) => pat.test(text));
    }).length;

    data.genericAnchorsCount = genericAnchorsCount;
    const genericRatio = allLinks.length > 0 ? genericAnchorsCount / allLinks.length : 0;
    data.genericAnchorsRatio = genericRatio;

    if (genericRatio > 0.2) {
      issues.push({
        id: "backlinks-excessive-generic-anchors",
        title: "High Ratio of Generic Anchor Texts",
        description: `Around ${(genericRatio * 100).toFixed(0)}% of the links on this page use generic text like "click here" or "read more".`,
        severity: "medium",
        recommendation: "Replace generic anchor texts with descriptive, keyword-focused phrases that clearly explain what the linked page contains.",
        impact: "Generic anchor texts fail to pass topical contextual signals to search engines and harm accessibility for screen readers.",
        learnMoreUrl: "https://developers.google.com/search/docs/appearance/write-good-link-text"
      });
    }

    // 2. Outbound Authority Links (E-E-A-T trust signals)
    const authorityDomains = [".gov", ".edu", "wikipedia.org", "w3.org", "github.com", "microsoft.com", "google.com", "apple.com", "nih.gov", "science.org"];
    const authorityOutboundLinks = externalLinks.filter((link) => {
      try {
        const url = new URL(link.href);
        return authorityDomains.some((domain) => url.hostname.endsWith(domain) || url.hostname === domain);
      } catch {
        return false;
      }
    });

    data.authorityOutboundLinksCount = authorityOutboundLinks.length;
    if (externalLinks.length > 0 && authorityOutboundLinks.length === 0) {
      issues.push({
        id: "backlinks-no-authoritative-citations",
        title: "No Authoritative External Citations",
        description: "This page links out to external websites, but none of them are recognized high-authority sources (e.g., .gov, .edu, Wikipedia).",
        severity: "info",
        recommendation: "Consider linking to high-trust research sites, official documentation, or trusted databases when citing facts, statistics, or quotes.",
        impact: "Citing trusted authority sources helps establish E-E-A-T (Expertise, Authoritativeness, Trustworthiness) in the eyes of search raters and search systems.",
        learnMoreUrl: "https://developers.google.com/search/docs/fundamentals/creating-helpful-content"
      });
    }

    // 3. Link Equity Ratio (Too many external links relative to internal)
    const externalRatio = allLinks.length > 0 ? externalLinks.length / allLinks.length : 0;
    data.externalLinksRatio = externalRatio;

    if (externalLinks.length > 30 && externalRatio > 0.7) {
      issues.push({
        id: "backlinks-excessive-external-links",
        title: "Excessive Outbound External Links",
        description: `This page has ${externalLinks.length} outbound external links, representing ${(externalRatio * 100).toFixed(0)}% of all links.`,
        severity: "low",
        recommendation: "Ensure all external links are relevant to the page content and use nofollow directives for untrusted user-generated links or sponsored placements.",
        impact: "An excessive number of outgoing follow links dilutes page authority (PageRank) and may look suspicious to search crawlers.",
        learnMoreUrl: "https://developers.google.com/search/docs/crawling-indexing/qualify-outbound-links"
      });
    }

    // 4. Invalid outbound link detection (Syntax errors)
    const invalidOutboundLinks = externalLinks.filter((link) => {
      if (!link.href) return true;
      if (link.href.startsWith("javascript:") || link.href.startsWith("tel:") || link.href.startsWith("mailto:")) return false;
      try {
        new URL(link.href);
        return false;
      } catch {
        return true;
      }
    });

    data.invalidOutboundLinks = invalidOutboundLinks.map(l => l.href);
    if (invalidOutboundLinks.length > 0) {
      issues.push({
        id: "backlinks-invalid-urls",
        title: "Malformed Link URLs Detected",
        description: `Detected ${invalidOutboundLinks.length} links with invalid URL formats (e.g. missing protocol or containing spaces).`,
        severity: "high",
        recommendation: "Review and correct the href attributes of the flagged links to ensure they use valid absolute or relative URL schemas.",
        affectedItems: invalidOutboundLinks.slice(0, 5).map((l) => l.href || "(empty href)"),
        impact: "Malformed URLs cause 404-like error hops or browser errors, degrading user experience and wasting search engine crawling allocation.",
      });
    }

    // 5. Empty Link Anchors Audit
    const emptyAnchors = allLinks.filter((link) => {
      return (link.href || "").trim() !== "" && (link.text || "").trim() === "";
    });
    data.emptyAnchorsCount = emptyAnchors.length;

    if (emptyAnchors.length > 0) {
      issues.push({
        id: "backlinks-empty-anchors",
        title: "Empty Link Anchors Present",
        description: `Detected ${emptyAnchors.length} links that contain no text anchor content.`,
        severity: "medium",
        recommendation: "Add descriptive text or add an 'alt' attribute to images contained within the links, or define an 'aria-label' attribute.",
        affectedItems: emptyAnchors.slice(0, 5).map((l) => l.href),
        impact: "Empty links pass zero anchor text context to search crawlers and represent major accessibility blocks for screen readers.",
        learnMoreUrl: "https://developers.google.com/search/docs/appearance/write-good-link-text"
      });
    }

    // 6. Keyword Stuffing in Anchor Texts
    const stuffedAnchors = allLinks.filter((link) => {
      const words = (link.text || "").split(/\s+/).filter(Boolean);
      return words.length > 15;
    });
    data.stuffedAnchorsCount = stuffedAnchors.length;

    if (stuffedAnchors.length > 0) {
      issues.push({
        id: "backlinks-stuffed-anchors",
        title: "Excessively Long Link Anchors",
        description: `Detected ${stuffedAnchors.length} links containing excessively long anchor texts (greater than 15 words).`,
        severity: "medium",
        recommendation: "Shorten link text anchors to focus on the key descriptive keyword phrase rather than linking entire paragraphs.",
        affectedItems: stuffedAnchors.slice(0, 3).map((l) => l.text.slice(0, 45) + "..."),
        impact: "Excessively long link texts confuse search bots, trigger spam filters resembling keyword stuffing, and create poor visual designs.",
        learnMoreUrl: "https://developers.google.com/search/docs/appearance/write-good-link-text"
      });
    }

    // 7. Duplicate Outbound Destinations (Excessive internal link redundancy)
    const linkCountsByHref = new Map<string, number>();
    allLinks.forEach((l) => {
      if (!l.href || l.href.startsWith("#")) return;
      try {
        const absolute = new URL(l.href, "https://domain-placeholder.com").toString();
        linkCountsByHref.set(absolute, (linkCountsByHref.get(absolute) || 0) + 1);
      } catch {
        linkCountsByHref.set(l.href, (linkCountsByHref.get(l.href) || 0) + 1);
      }
    });

    const duplicateLinks = Array.from(linkCountsByHref.entries()).filter(([_, count]) => count > 2);
    data.duplicateDestinationsCount = duplicateLinks.length;

    if (duplicateLinks.length > 0) {
      issues.push({
        id: "backlinks-redundant-destinations",
        title: "Redundant Links to Same Target URL",
        description: `Detected ${duplicateLinks.length} target URLs that are linked 3 or more times on this single page.`,
        severity: "low",
        recommendation: "Consolidate duplicate links. Ensure you only link to a target destination page once or twice within the main body content.",
        affectedItems: duplicateLinks.slice(0, 3).map(([url, count]) => `${url} (${count} links)`),
        impact: "Multiple redundant links pointing to the same page dilute internal page authority flow (PageRank) and clutter semantic outlines.",
      });
    }

    // 8. Nofollow Link Audit
    const nofollowCount = externalLinks.filter((l) => (l.rel || "").toLowerCase().includes("nofollow")).length;
    data.nofollowExternalLinksCount = nofollowCount;
    data.nofollowRatio = externalLinks.length > 0 ? nofollowCount / externalLinks.length : 0;

    // Calculate score
    let score = 100;
    issues.forEach((issue) => {
      if (issue.severity === "critical") score -= 25;
      else if (issue.severity === "high") score -= 15;
      else if (issue.severity === "medium") score -= 8;
      else if (issue.severity === "low") score -= 3;
    });
    score = Math.max(0, Math.min(100, score));

    return {
      module: "backlinks",
      status: "completed",
      score,
      issues,
      data,
      executionTimeMs: Date.now() - startTime,
    };
  },
};
