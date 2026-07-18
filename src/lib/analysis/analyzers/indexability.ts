import type { Analyzer, ModuleResult, Issue, ParsedPage, FetchResult } from "../types";

function isUrlBlockedByRobotsTxt(urlPath: string, robotsTxtContent: string): boolean {
  try {
    const lines = robotsTxtContent.split(/\r?\n/);
    let currentUserAgentMatches = false;
    let isBlocked = false;
    let highestMatchLength = -1;

    for (let line of lines) {
      line = line.trim();
      if (line.startsWith("#") || line === "") continue;

      // Parse directive
      const colonIdx = line.indexOf(":");
      if (colonIdx === -1) continue;

      const key = line.substring(0, colonIdx).trim().toLowerCase();
      const val = line.substring(colonIdx + 1).trim();

      if (key === "user-agent") {
        const ua = val.toLowerCase();
        currentUserAgentMatches = (ua === "*" || ua === "googlebot");
      } else if (currentUserAgentMatches) {
        if (key === "disallow") {
          const rulePath = val;
          if (rulePath && urlPath.startsWith(rulePath)) {
            if (rulePath.length > highestMatchLength) {
              highestMatchLength = rulePath.length;
              isBlocked = true;
            }
          }
        } else if (key === "allow") {
          const rulePath = val;
          if (rulePath && urlPath.startsWith(rulePath)) {
            if (rulePath.length > highestMatchLength) {
              highestMatchLength = rulePath.length;
              isBlocked = false; // Allow overrides Disallow if match length is longer/more specific
            }
          }
        }
      }
    }
    return isBlocked;
  } catch (e) {
    return false;
  }
}

export const indexabilityAnalyzer: Analyzer = {
  name: "indexability",
  async analyze(page: ParsedPage, fetchResult: FetchResult): Promise<ModuleResult> {
    const startTime = Date.now();
    const issues: Issue[] = [];
    const data: Record<string, unknown> = {};

    const pageUrl = fetchResult.finalUrl;

    // 1. Robots directive inspection (meta + HTTP headers)
    const robots = (page.metaRobots || "").toLowerCase();
    const headersRobots = ((fetchResult.headers || {})["x-robots-tag"] || "").toLowerCase();
    
    const hasNoIndex = robots.includes("noindex") || headersRobots.includes("noindex");
    const hasNoFollow = robots.includes("nofollow") || headersRobots.includes("nofollow");

    data.metaRobots = page.metaRobots || "None";
    data.xRobotsTag = (fetchResult.headers || {})["x-robots-tag"] || "None";
    data.isIndexed = !hasNoIndex;

    if (hasNoIndex) {
      issues.push({
        id: "index-noindex-present",
        title: "Page is set to Noindex",
        description: "This page has a noindex directive in meta tags or HTTP headers, instructing search engines not to index it.",
        severity: "medium",
        recommendation: "Remove the 'noindex' directive from your HTML meta tags or X-Robots-Tag headers if you want this page to appear in search results.",
        value: `robots: "${page.metaRobots || 'none'}", x-robots-tag: "${(fetchResult.headers || {})["x-robots-tag"] || 'none'}"`,
        impact: "This page will be completely excluded from Google, Bing, and AI search engine indexes, receiving zero search traffic.",
        learnMoreUrl: "https://developers.google.com/search/docs/crawling-indexing/block-indexing"
      });
    }

    // 2. robots.txt Crawl Blocks & Contradictory Directives
    let isBlockedByRobotsTxt = false;
    if (fetchResult.robotsTxt) {
      try {
        const urlObj = new URL(pageUrl);
        isBlockedByRobotsTxt = isUrlBlockedByRobotsTxt(urlObj.pathname, fetchResult.robotsTxt);
      } catch (e) {
        // Safe fallback
      }
    }
    data.isBlockedByRobotsTxt = isBlockedByRobotsTxt;

    if (isBlockedByRobotsTxt) {
      issues.push({
        id: "index-blocked-by-robots-txt",
        title: "Page Crawling Blocked by robots.txt",
        description: "This page matches a Disallow directive in your robots.txt file, preventing search bots from crawling it.",
        severity: "high",
        recommendation: "Remove or adjust the Disallow rule in your robots.txt file if this page contains indexable contents.",
        impact: "Search bots cannot crawl the page's HTML, meaning they cannot update page scores, identify link structures, or crawl nested internal paths.",
        learnMoreUrl: "https://developers.google.com/search/docs/crawling-indexing/robots/intro"
      });

      // Noindex + robots.txt contradiction
      if (hasNoIndex) {
        issues.push({
          id: "index-robots-noindex-conflict",
          title: "Robots.txt Block and Noindex Contradiction",
          description: "This page is blocked in robots.txt but also has a 'noindex' tag.",
          severity: "high",
          recommendation: "If you want this page dropped from index, remove it from robots.txt Disallow rule so search bots can crawl and read the noindex tag. If you want it crawled, remove noindex.",
          impact: "Google cannot read the noindex tag if the page is blocked in robots.txt. If other sites link to this page, Google might still index it as a placeholder link.",
          learnMoreUrl: "https://developers.google.com/search/docs/crawling-indexing/block-indexing"
        });
      }
    }

    // 3. Sitemap Indexation Conflict
    let isPageInSitemap = false;
    if (fetchResult.sitemapXml) {
      try {
        const cleanPageUrl = pageUrl.replace(/\/$/, "");
        isPageInSitemap = fetchResult.sitemapXml.includes(pageUrl) || fetchResult.sitemapXml.includes(cleanPageUrl);
      } catch {
        // Safe fallback
      }
    }
    data.isPageInSitemap = isPageInSitemap;

    if (isPageInSitemap && hasNoIndex) {
      issues.push({
        id: "index-sitemap-noindex-conflict",
        title: "Noindex Page Listed in Sitemap",
        description: "This page is marked as 'noindex' to hide from search results, but it is listed in your active sitemap.xml.",
        severity: "high",
        recommendation: "Remove this page URL from your sitemap.xml. Sitemaps should only contain pages you actively want indexed.",
        impact: "Listing noindexed pages in sitemaps wastes crawl allocation and sends conflicting signals to search engine algorithms.",
        learnMoreUrl: "https://developers.google.com/search/docs/crawling-indexing/sitemaps/build-sitemap"
      });
    }

    // 4. Redirect Chain Warnings
    const redirectLength = (fetchResult.redirectChain || []).length;
    data.redirectChainLength = redirectLength;
    if (redirectLength > 1) {
      issues.push({
        id: "index-redirect-chain",
        title: "Page Accessed via Redirect Chain",
        description: `This page URL was reached after a redirect chain of ${redirectLength} hops.`,
        severity: "medium",
        recommendation: "Update internal links to point directly to the final destination URL instead of going through multiple redirects.",
        value: fetchResult.redirectChain.map(hop => `${hop.url} (${hop.statusCode})`).join(" ➔ ") + " ➔ " + pageUrl,
        impact: "Multiple hops consume server requests, degrade page speed latency, and dilute internal link equity.",
        learnMoreUrl: "https://developers.google.com/search/docs/crawling-indexing/301-redirects"
      });
    }

    // 5. Canonical Audit (Missing, Non-Self-Ref, Duplicate canonicals, Invalid url formats)
    const canonical = (page.canonical || "").trim();
    data.canonicalUrl = canonical;

    const canonicalTagsCount = (fetchResult.html.match(/<link[^>]*rel=["']canonical["'][^>]*>/gi) || []).length;
    data.canonicalTagsCount = canonicalTagsCount;

    if (canonicalTagsCount > 1) {
      issues.push({
        id: "index-multiple-canonical-tags",
        title: "Multiple Canonical Tags Present",
        description: `This page defines ${canonicalTagsCount} canonical URLs in its HTML source.`,
        severity: "critical",
        recommendation: "Remove any duplicate canonical link element declarations. Only one canonical tag should be output per page.",
        impact: "When multiple canonical tags exist, search engines ignore all of them, leading to unpredictable duplicate content indexing.",
        learnMoreUrl: "https://developers.google.com/search/docs/crawling-indexing/consolidate-duplicate-urls"
      });
    }

    if (!canonical) {
      issues.push({
        id: "index-missing-canonical",
        title: "Missing Canonical Tag",
        description: "The page is missing a canonical URL tag, which consolidates ranking parameters.",
        severity: "high",
        recommendation: "Add a self-referencing <link rel=\"canonical\" href=\"...\" /> to the head section of this page.",
        impact: "Without canonicals, variations of this URL (with search query params, tracking parameters) can get indexed separately, causing content duplication.",
        codeSnippet: {
          language: "html",
          label: "Add this canonical tag inside your HTML head:",
          code: `<link rel="canonical" href="${pageUrl}" />`
        },
        learnMoreUrl: "https://developers.google.com/search/docs/crawling-indexing/consolidate-duplicate-urls"
      });
    } else {
      try {
        const canonicalUrlObj = new URL(canonical);
        const pageUrlObj = new URL(pageUrl);
        const isSelfReferencing = canonicalUrlObj.origin + canonicalUrlObj.pathname === pageUrlObj.origin + pageUrlObj.pathname;
        data.isCanonicalSelfReferencing = isSelfReferencing;

        if (!isSelfReferencing) {
          issues.push({
            id: "index-non-self-referencing-canonical",
            title: "Non-Self-Referencing Canonical",
            description: `The canonical URL points to a different target page: "${canonical}".`,
            severity: "medium",
            recommendation: "Verify that this page is intended to be consolidated. If this is a primary page, make the canonical tag self-referencing.",
            value: canonical,
            impact: "Search engine link authority will flow to the target canonical page, and this URL will likely be excluded from search index.",
            learnMoreUrl: "https://developers.google.com/search/docs/crawling-indexing/consolidate-duplicate-urls"
          });
        }

        // Canonical contradiction (Canonical exists but page is noindex)
        if (hasNoIndex && isSelfReferencing) {
          issues.push({
            id: "index-canonical-noindex-contradiction",
            title: "Canonical and Noindex Contradiction",
            description: "The page has a self-referencing canonical tag but is also configured with a 'noindex' directive.",
            severity: "critical",
            recommendation: "If you want this page indexed, remove the 'noindex' tag. If not, consider keeping 'noindex' and removing the canonical tag.",
            impact: "Crawlers receive conflicting directives (Index vs Noindex), resulting in indexing issues and wasted crawl resource allocation.",
            learnMoreUrl: "https://developers.google.com/search/docs/crawling-indexing/consolidate-duplicate-urls"
          });
        }
      } catch (e) {
        issues.push({
          id: "index-invalid-canonical-url",
          title: "Invalid Canonical URL Format",
          description: `The canonical URL is not a valid absolute URL: "${canonical}".`,
          severity: "critical",
          recommendation: "Ensure the canonical tag uses a fully qualified, absolute URL structure (including protocol).",
          value: canonical,
          impact: "Invalid canonical URLs are ignored by search bots, leaving the page with no canonical consolidation.",
          learnMoreUrl: "https://developers.google.com/search/docs/crawling-indexing/consolidate-duplicate-urls"
        });
      }
    }

    // 6. Thin Content Detection
    const wordCount = page.wordCount || 0;
    data.wordCount = wordCount;

    if (!hasNoIndex && wordCount < 250 && wordCount > 0) {
      issues.push({
        id: "index-thin-content",
        title: "Thin Content Detected",
        description: `This page contains only ${wordCount} words, which falls below helpful content thresholds.`,
        severity: "medium",
        recommendation: "Expand the page content with informative, original descriptions and high-quality structured sections.",
        value: `${wordCount} words`,
        impact: "Thin content pages struggle to demonstrate authority or semantic depth, resulting in low search ranking relevance.",
        learnMoreUrl: "https://developers.google.com/search/docs/fundamentals/creating-helpful-content"
      });
    }

    // 7. Duplicate/Empty Metadata titles/descriptions check
    if (!hasNoIndex) {
      if (!page.title || page.title.trim() === "") {
        issues.push({
          id: "index-empty-title",
          title: "Empty Title Tag",
          description: "The HTML title tag is empty or missing, which prevents proper search link construction.",
          severity: "critical",
          recommendation: "Add a descriptive, unique title tag between 30 and 60 characters.",
          impact: "Pages without titles suffer from extremely low search click-through rates and poor keyword relevance categorization.",
          learnMoreUrl: "https://developers.google.com/search/docs/appearance/title-link"
        });
      }

      if (!page.metaDescription || page.metaDescription.trim() === "") {
        issues.push({
          id: "index-empty-description",
          title: "Empty Meta Description",
          description: "The page is missing a meta description tag.",
          severity: "high",
          recommendation: "Create a unique meta description between 120 and 160 characters to summarize page content.",
          impact: "Without a meta description, search engine crawlers extract default text chunks from the page, which are rarely optimized to encourage user clicks.",
          learnMoreUrl: "https://developers.google.com/search/docs/appearance/snippet"
        });
      }
    }

    // 8. Index Blocked via HTTP Status Codes
    const statusCode = fetchResult.statusCode;
    data.statusCode = statusCode;
    if (statusCode >= 400 && !hasNoIndex) {
      issues.push({
        id: "index-status-error",
        title: `Indexable page returning HTTP status ${statusCode}`,
        description: `This page returns an error status code (${statusCode}) but has no indexing blocks.`,
        severity: "critical",
        recommendation: "Resolve server connection issues, fix broken redirect rules, or add a 'noindex' tag if this path is no longer active.",
        value: `Status ${statusCode}`,
        impact: "Pages returning server error codes are systematically deindexed by search engines, removing them from all rankings.",
        learnMoreUrl: "https://developers.google.com/search/docs/crawling-indexing/http-status-codes"
      });
    }

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
      module: "indexability",
      status: "completed",
      score,
      issues,
      data,
      executionTimeMs: Date.now() - startTime,
    };
  },
};
