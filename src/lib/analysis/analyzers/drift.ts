import type { Analyzer, ModuleResult, Issue, ParsedPage, FetchResult } from "../types";

interface PageSnapshot {
  title: string;
  metaDescription: string;
  statusCode: number;
  canonical: string;
  robots: string;
  h1s: string[];
  responseTimeMs: number;
  schemaTypes: string[];
  hreflangs: string[];
  ogImage: string;
  h2Count: number;
}

export const driftAnalyzer: Analyzer = {
  name: "drift",
  async analyze(page: ParsedPage, fetchResult: FetchResult, previousModule?: ModuleResult): Promise<ModuleResult> {
    const startTime = Date.now();
    const issues: Issue[] = [];
    const data: Record<string, unknown> = {};

    const pageUrl = fetchResult.finalUrl;
    const currentH1s = (page.headings || []).filter((h) => h.level === 1).map((h) => h.text.trim());
    const currentH2s = (page.headings || []).filter((h) => h.level === 2);
    const currentSchemas = (page.schemaMarkup || []).map((s) => s.type).filter(Boolean);
    const currentHreflangs = (page.hreflangTags || []).map((h) => `${h.lang}:${h.href}`);
    const ogImage = page.openGraph?.["image"] || page.openGraph?.["og:image"] || "";

    // Create current snapshot
    const currentSnapshot: PageSnapshot = {
      title: page.title || "",
      metaDescription: page.metaDescription || "",
      statusCode: fetchResult.statusCode,
      canonical: page.canonical || "",
      robots: page.metaRobots || "",
      h1s: currentH1s,
      responseTimeMs: fetchResult.responseTimeMs,
      schemaTypes: currentSchemas,
      hreflangs: currentHreflangs,
      ogImage,
      h2Count: currentH2s.length,
    };

    // Extract previous baselines if available
    const prevBaselines = (previousModule?.data?.baselines as Record<string, PageSnapshot>) || {};
    const baseline = prevBaselines[pageUrl];

    if (!baseline) {
      // First scan: capture this page's current state as the baseline
      data.baselines = {
        [pageUrl]: currentSnapshot,
      };
      data.hasBaseline = false;
    } else {
      // We have a baseline! Compare current state to baseline
      data.baselines = {
        ...prevBaselines,
        [pageUrl]: baseline, // Keep the original baseline to continue checking changes
      };
      data.hasBaseline = true;

      // ── 1. HTTP Status Code drift ─────────────────────────────────────
      if (currentSnapshot.statusCode !== baseline.statusCode) {
        issues.push({
          id: "drift-status-code-changed",
          title: "Page HTTP Status Changed",
          description: `The HTTP status code has changed from ${baseline.statusCode} to ${currentSnapshot.statusCode}.`,
          severity: currentSnapshot.statusCode >= 400 ? "critical" : "medium",
          recommendation: "Verify that this status change is correct. If it was an intentional redirect or page retirement, update the baseline.",
          value: `Previous: ${baseline.statusCode}, Current: ${currentSnapshot.statusCode}`,
          impact: "Changes to HTTP status codes can cause sudden deindexing (for 4xx/5xx) or crawl budget waste.",
        });
      }

      // ── 2. Robots metadata drift ─────────────────────────────────────
      const prevNoIndex = (baseline.robots || "").toLowerCase().includes("noindex");
      const currNoIndex = (currentSnapshot.robots || "").toLowerCase().includes("noindex");
      if (prevNoIndex !== currNoIndex) {
        issues.push({
          id: "drift-robots-changed",
          title: "Robots Indexation Tag Changed",
          description: `Indexation directive changed. Previously: "${baseline.robots || "index"}", Currently: "${currentSnapshot.robots || "index"}".`,
          severity: "critical",
          recommendation: `Check if changing this page to ${currNoIndex ? "noindex" : "index"} was intentional. Accidental noindex tags will remove pages from search results.`,
          value: `Previous: ${baseline.robots || "index"}, Current: ${currentSnapshot.robots || "index"}`,
          impact: currNoIndex 
            ? "This page will be dropped from Google search index and AI search tools." 
            : "This page will now be crawled and indexed, which may expose private content if not intended.",
        });
      }

      // ── 3. Canonical URL drift ───────────────────────────────────────
      if (currentSnapshot.canonical !== baseline.canonical) {
        issues.push({
          id: "drift-canonical-changed",
          title: "Canonical URL Changed",
          description: `The canonical link tag changed from "${baseline.canonical || "none"}" to "${currentSnapshot.canonical || "none"}".`,
          severity: "critical",
          recommendation: `Verify that changing the canonical URL to "${currentSnapshot.canonical || "none"}" is correct and does not create consolidation loops.`,
          value: `Previous: ${baseline.canonical || "none"}, Current: ${currentSnapshot.canonical || "none"}`,
          impact: "Changing canonical URLs changes how Google consolidates link signals, potentially shifting traffic to a different page.",
        });
      }

      // ── 4. Title tag drift ───────────────────────────────────────────
      if (currentSnapshot.title !== baseline.title) {
        issues.push({
          id: "drift-title-changed",
          title: "Page Title Tag Changed",
          description: `The title tag changed from "${baseline.title || "(empty)"}" to "${currentSnapshot.title || "(empty)"}".`,
          severity: "high",
          recommendation: "Ensure this change was intended. Changing high-performing title tags can affect click-through rate and search visibility.",
          value: `Previous: ${baseline.title || "(none)"}, Current: ${currentSnapshot.title || "(none)"}`,
          impact: "Google uses titles to match search intent. Accidental title updates can lead to ranking drops.",
        });
      }

      // ── 5. Meta description drift ────────────────────────────────────
      if (currentSnapshot.metaDescription !== baseline.metaDescription) {
        issues.push({
          id: "drift-description-changed",
          title: "Meta Description Changed",
          description: `The meta description changed from "${baseline.metaDescription || "(empty)"}" to "${currentSnapshot.metaDescription || "(empty)"}".`,
          severity: "medium",
          recommendation: "Review the new meta description to ensure it contains keywords and a call-to-action.",
          value: `Previous: ${baseline.metaDescription || "(none)"}, Current: ${currentSnapshot.metaDescription || "(none)"}`,
          impact: "Changing descriptions alters the search snippet preview, which directly influences user click-through rate.",
        });
      }

      // ── 6. H1 tag changes ────────────────────────────────────────────
      const baselineH1Str = (baseline.h1s || []).join(", ");
      const currentH1Str = currentH1s.join(", ");
      if (baselineH1Str !== currentH1Str) {
        issues.push({
          id: "drift-h1-changed",
          title: "Main H1 Heading Changed",
          description: `H1 heading changed. Previously: "${baselineH1Str || "(none)"}", Currently: "${currentH1Str || "(none)"}".`,
          severity: "medium",
          recommendation: "Check that the new H1 matches the primary topic and keyword strategy of the page.",
          value: `Previous: ${baselineH1Str || "(none)"}, Current: ${currentH1Str || "(none)"}`,
          impact: "H1 is the primary semantic headline of a page. Changes can affect thematic relevance scoring.",
        });
      }

      // ── 7. Structured Data Schema Removal ────────────────────────────
      const prevSchemas = baseline.schemaTypes || [];
      const schemaRemoved = prevSchemas.filter((type) => !currentSchemas.includes(type));
      if (schemaRemoved.length > 0) {
        issues.push({
          id: "drift-schema-removed",
          title: "Structured Data Schema Removed",
          description: `Structured data schemas disappeared from this page: ${schemaRemoved.join(", ")}.`,
          severity: "high",
          recommendation: "Verify that structured JSON-LD schemas were not accidentally removed during updates or compilation steps.",
          value: `Removed: ${schemaRemoved.join(", ")}`,
          impact: "Removing structured schemas causes your site to instantly lose rich snippet displays and search extensions.",
        });
      }

      // ── 8. Performance Latency Regression ───────────────────────────
      const prevResponseTime = baseline.responseTimeMs || 0;
      if (prevResponseTime > 0 && fetchResult.responseTimeMs > prevResponseTime * 2 && fetchResult.responseTimeMs > 1500) {
        issues.push({
          id: "drift-performance-degraded",
          title: "Significant Server Latency Regression",
          description: `Page response time increased from ${prevResponseTime}ms to ${fetchResult.responseTimeMs}ms.`,
          severity: "high",
          recommendation: "Profile server database queries, cache assets, or review backend server load to identify response latency spikes.",
          value: `Baseline: ${prevResponseTime}ms, Current: ${fetchResult.responseTimeMs}ms`,
          impact: "Google uses page loading speed as a ranking factor. Severe latency spikes degrade Core Web Vitals and suppress rankings.",
        });
      }

      // ── 9. OpenGraph social meta image drift ─────────────────────────
      const prevOgImage = baseline.ogImage || "";
      if (prevOgImage && ogImage && prevOgImage !== ogImage) {
        issues.push({
          id: "drift-og-image-changed",
          title: "Social Preview Image Changed",
          description: "The social sharing (OpenGraph) graphic URL changed.",
          severity: "low",
          recommendation: "Verify that the new graphics render correctly on messaging clients and link previews.",
          value: `Previous: ${prevOgImage}, Current: ${ogImage}`,
          impact: "Modified social previews directly influence how links display on feed sites, affecting click rates.",
        });
      }

      // ── 10. Translation hreflang tags drift ─────────────────────────
      const prevHreflangs = baseline.hreflangs || [];
      const hreflangRemoved = prevHreflangs.filter((h) => !currentHreflangs.includes(h));
      if (hreflangRemoved.length > 0) {
        issues.push({
          id: "drift-hreflang-removed",
          title: "International Hreflang Tags Removed",
          description: "One or more translation locales (hreflang) disappeared from the page source.",
          severity: "high",
          recommendation: "Verify that translation locale mappings are generated correctly for international search engines.",
          impact: "Missing hreflangs can cause crawlers to indexing incorrect language targets for localized search results.",
        });
      }

      // ── 11. H2 Subheading Outline drift ──────────────────────────────
      const prevH2Count = baseline.h2Count || 0;
      if (prevH2Count > 0 && Math.abs(currentSnapshot.h2Count - prevH2Count) > 5) {
        issues.push({
          id: "drift-structure-outline-shifted",
          title: "Major Content Structure Shift",
          description: `The page subheading outline (H2) shifted. Count changed from ${prevH2Count} to ${currentSnapshot.h2Count}.`,
          severity: "medium",
          recommendation: "Verify that the outline shift is intentional and page subtopics remain complete.",
          value: `Previous: ${prevH2Count} headings, Current: ${currentSnapshot.h2Count} headings`,
          impact: "Major subheading modifications suggest core outline updates, causing search engines to re-evaluate page search queries.",
        });
      }
    }

    // Calculate score (begins at 100, drops per drift issue detected)
    let score = 100;
    issues.forEach((issue) => {
      if (issue.severity === "critical") score -= 25;
      else if (issue.severity === "high") score -= 15;
      else if (issue.severity === "medium") score -= 8;
      else if (issue.severity === "low") score -= 3;
    });
    score = Math.max(0, Math.min(100, score));

    return {
      module: "drift",
      status: "completed",
      score,
      issues,
      data,
      executionTimeMs: Date.now() - startTime,
    };
  },
};
