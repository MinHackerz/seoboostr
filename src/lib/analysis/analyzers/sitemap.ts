import type { Analyzer, ModuleResult, Issue, ParsedPage, FetchResult } from "../types";

export const sitemapAnalyzer: Analyzer = {
  name: "sitemap",
  async analyze(page: ParsedPage, fetchResult: FetchResult): Promise<ModuleResult> {
    const startTime = Date.now();
    const issues: Issue[] = [];
    const data: Record<string, unknown> = {};

    // 1. Sitemap existence
    const hasSitemap = !!fetchResult.sitemapXml;
    data.hasSitemap = hasSitemap;

    if (!hasSitemap) {
      const isBlocked = fetchResult.statusCode === 429 || 
                        (fetchResult.headers && (
                          fetchResult.headers["x-vercel-mitigated"] || 
                          fetchResult.headers["server"]?.toLowerCase().includes("cloudflare")
                        ));

      issues.push({
        id: "sitemap-missing",
        title: isBlocked ? "Sitemap access blocked by Firewall" : "No XML sitemap found",
        description: isBlocked 
          ? "The request was blocked by Vercel/Cloudflare Attack Mitigation (returned HTTP 429 Challenge). The automated bot could not read the sitemap."
          : "No sitemap.xml found at the standard location (/sitemap.xml).",
        severity: isBlocked ? "medium" : "high",
        recommendation: isBlocked 
          ? "Whitelist the SEO Optimised crawler User-Agent ('SEOOptimized/1.0') or configure your WAF to allow automated crawler requests."
          : "Create an XML sitemap and submit it to Google Search Console.",
      });

      return {
        module: "sitemap",
        status: "completed",
        score: isBlocked ? 50 : 30, // Give slightly higher score if it exists but is just blocked by a firewall
        issues,
        data,
        executionTimeMs: Date.now() - startTime,
      };
    }

    const xml = fetchResult.sitemapXml!;

    // 2. Valid XML check
    const isValidXml = xml.includes("<?xml") || xml.includes("<urlset") || xml.includes("<sitemapindex");
    data.isValidXml = isValidXml;

    if (!isValidXml) {
      issues.push({
        id: "sitemap-invalid",
        title: "Invalid sitemap format",
        description: "The sitemap does not appear to be valid XML.",
        severity: "critical",
        recommendation: "Fix the sitemap XML to conform to the sitemap protocol specification.",
      });
    }

    // 3. Is it a sitemap index?
    const isSitemapIndex = xml.includes("<sitemapindex");
    data.isSitemapIndex = isSitemapIndex;

    // 4. URL count
    const urlMatches = xml.match(/<loc>/gi);
    const urlCount = urlMatches ? urlMatches.length : 0;
    data.urlCount = urlCount;

    if (urlCount > 50000) {
      issues.push({
        id: "sitemap-too-large",
        title: "Sitemap exceeds 50,000 URL limit",
        description: `Sitemap contains ${urlCount.toLocaleString()} URLs (protocol limit: 50,000).`,
        severity: "critical",
        recommendation: "Split the sitemap using a sitemap index file.",
        value: `${urlCount.toLocaleString()} URLs`,
      });
    }

    // 5. HTTPS URLs check
    const httpUrls = xml.match(/<loc>\s*http:\/\//gi);
    if (httpUrls && httpUrls.length > 0) {
      issues.push({
        id: "sitemap-http-urls",
        title: "Sitemap contains HTTP URLs",
        description: `${httpUrls.length} URLs in the sitemap use HTTP instead of HTTPS.`,
        severity: "high",
        recommendation: "Update all sitemap URLs to use HTTPS.",
        value: `${httpUrls.length} HTTP URLs`,
      });
    }

    // 6. Deprecated tags
    const hasPriority = /<priority>/i.test(xml);
    const hasChangefreq = /<changefreq>/i.test(xml);
    data.hasPriority = hasPriority;
    data.hasChangefreq = hasChangefreq;

    if (hasPriority || hasChangefreq) {
      issues.push({
        id: "sitemap-deprecated-tags",
        title: "Sitemap uses deprecated tags",
        description: `Uses ${[hasPriority && "priority", hasChangefreq && "changefreq"].filter(Boolean).join(" and ")} — these are ignored by Google.`,
        severity: "info",
        recommendation: "You can safely remove <priority> and <changefreq> tags — Google ignores them.",
      });
    }

    // 7. Lastmod analysis
    const lastmodMatches = xml.match(/<lastmod>([^<]+)<\/lastmod>/gi);
    if (lastmodMatches) {
      const dates = lastmodMatches.map((m) => m.replace(/<\/?lastmod>/gi, ""));
      const uniqueDates = new Set(dates);
      data.lastmodCount = dates.length;
      data.uniqueLastmodDates = uniqueDates.size;

      if (uniqueDates.size === 1 && dates.length > 5) {
        issues.push({
          id: "sitemap-identical-lastmod",
          title: "All lastmod dates are identical",
          description: "All URLs have the same lastmod date — this suggests they aren't actual modification dates.",
          severity: "low",
          recommendation: "Use actual modification dates for lastmod, not a bulk-generated timestamp.",
        });
      }
    }

    // 8. Sitemap referenced in robots.txt
    const sitemapInRobots = fetchResult.robotsTxt?.toLowerCase().includes("sitemap:");
    data.sitemapInRobots = sitemapInRobots;

    if (!sitemapInRobots) {
      issues.push({
        id: "sitemap-not-in-robots",
        title: "Sitemap not referenced in robots.txt",
        description: "The sitemap is not listed in robots.txt.",
        severity: "medium",
        recommendation: "Add 'Sitemap: https://yourdomain.com/sitemap.xml' to robots.txt.",
      });
    }

    // Score
    const criticalCount = issues.filter((i) => i.severity === "critical").length;
    const highCount = issues.filter((i) => i.severity === "high").length;
    const mediumCount = issues.filter((i) => i.severity === "medium").length;
    const lowCount = issues.filter((i) => i.severity === "low").length;

    const score = Math.max(
      0,
      100 - criticalCount * 20 - highCount * 10 - mediumCount * 5 - lowCount * 2
    );

    return {
      module: "sitemap",
      status: "completed",
      score,
      issues,
      data,
      executionTimeMs: Date.now() - startTime,
    };
  },
};
