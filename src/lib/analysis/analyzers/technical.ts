import type { Analyzer, ModuleResult, Issue, ParsedPage, FetchResult } from "../types";

export const technicalAnalyzer: Analyzer = {
  name: "technical",
  async analyze(page: ParsedPage, fetchResult: FetchResult): Promise<ModuleResult> {
    const startTime = Date.now();
    const issues: Issue[] = [];
    const data: Record<string, unknown> = {};

    // Check if request was blocked by security checkpoint/challenge or rate limiting
    const isBlocked = fetchResult.statusCode === 429 || fetchResult.statusCode === 403 || 
                      page.title.includes("Security Checkpoint") || page.title.includes("Cloudflare");
    if (isBlocked) {
      issues.push({
        id: "tech-bot-blocked",
        title: "Crawler Blocked by Security Firewall",
        description: `The website hosting provider returned status ${fetchResult.statusCode} ("${page.title}"). Firewall bot mitigation is preventing crawling.`,
        severity: "critical",
        recommendation: "Allow the SEOBoostr User-Agent (SEOBoostr/1.0) in your hosting firewall (Vercel / Cloudflare) to enable full audits.",
        value: `Status ${fetchResult.statusCode}: ${page.title}`,
      });
    }

    // 1. HTTPS check
    const isHttps = fetchResult.finalUrl.startsWith("https://");
    data.isHttps = isHttps;
    if (!isHttps) {
      issues.push({
        id: "tech-no-https",
        title: "Site not using HTTPS",
        description: "The website is not served over HTTPS.",
        severity: "critical",
        recommendation: "Install an SSL certificate and enforce HTTPS for all pages.",
      });
    }

    // 2. Security headers
    const securityHeaders = {
      "content-security-policy": fetchResult.headers["content-security-policy"],
      "strict-transport-security": fetchResult.headers["strict-transport-security"],
      "x-frame-options": fetchResult.headers["x-frame-options"],
      "x-content-type-options": fetchResult.headers["x-content-type-options"],
      "referrer-policy": fetchResult.headers["referrer-policy"],
    };
    data.securityHeaders = securityHeaders;

    const headerChecks = [
      { key: "strict-transport-security", name: "HSTS", severity: "high" as const },
      { key: "x-content-type-options", name: "X-Content-Type-Options", severity: "medium" as const },
      { key: "x-frame-options", name: "X-Frame-Options", severity: "medium" as const },
      { key: "content-security-policy", name: "Content-Security-Policy", severity: "medium" as const },
      { key: "referrer-policy", name: "Referrer-Policy", severity: "low" as const },
    ];

    headerChecks.forEach(({ key, name, severity }) => {
      if (!securityHeaders[key as keyof typeof securityHeaders]) {
        issues.push({
          id: `tech-missing-${key}`,
          title: `Missing ${name} header`,
          description: `The ${name} security header is not set.`,
          severity,
          recommendation: `Add the ${name} header to your server configuration.`,
        });
      }
    });

    // 3. Robots.txt (Only checked on site root/homepage)
    let isRoot = false;
    try {
      isRoot = new URL(fetchResult.url).pathname === "/";
    } catch {
      isRoot = fetchResult.url.endsWith("/") || !fetchResult.url.includes("/", 9);
    }

    if (isRoot) {
      const hasRobotsTxt = !!fetchResult.robotsTxt;
      data.hasRobotsTxt = hasRobotsTxt;
      if (!hasRobotsTxt) {
        issues.push({
          id: "tech-no-robots",
          title: "Missing robots.txt",
          description: "No robots.txt file found at the root of the site.",
          severity: "high",
          recommendation: "Create a robots.txt file to control search engine crawling.",
        });
      } else {
        // Check for AI crawler rules
        const aiCrawlers = ["GPTBot", "ChatGPT-User", "ClaudeBot", "PerplexityBot", "Bytespider", "Google-Extended", "CCBot"];
        const blockedAiCrawlers: string[] = [];
        const allowedAiCrawlers: string[] = [];

        aiCrawlers.forEach((crawler) => {
          const regex = new RegExp(`User-agent:\\s*${crawler}[\\s\\S]*?Disallow:\\s*/`, "i");
          if (fetchResult.robotsTxt && regex.test(fetchResult.robotsTxt)) {
            blockedAiCrawlers.push(crawler);
          } else {
            allowedAiCrawlers.push(crawler);
          }
        });

        data.aiCrawlers = { blocked: blockedAiCrawlers, allowed: allowedAiCrawlers };
      }

      // 4. Sitemap reference in robots.txt
      const hasSitemapInRobots = fetchResult.robotsTxt?.toLowerCase().includes("sitemap:") || false;
      data.hasSitemapInRobots = hasSitemapInRobots;
      if (hasRobotsTxt && !hasSitemapInRobots) {
        issues.push({
          id: "tech-no-sitemap-in-robots",
          title: "Sitemap not referenced in robots.txt",
          description: "Your robots.txt does not reference a sitemap.",
          severity: "medium",
          recommendation: "Add a Sitemap: directive to your robots.txt file.",
        });
      }
    }

    // 5. Canonical tag
    data.canonical = page.canonical;
    if (!page.canonical) {
      issues.push({
        id: "tech-no-canonical",
        title: "Missing canonical tag",
        description: "No canonical link element found.",
        severity: "high",
        recommendation: "Add a self-referencing canonical tag to prevent duplicate content issues.",
      });
    }

    // 6. Meta robots
    data.metaRobots = page.metaRobots;
    if (page.metaRobots.includes("noindex")) {
      issues.push({
        id: "tech-noindex",
        title: "Page is set to noindex",
        description: `Meta robots tag contains "noindex": ${page.metaRobots}`,
        severity: "critical",
        recommendation: "Remove noindex if this page should appear in search results.",
        value: page.metaRobots,
      });
    }

    // 7. Viewport meta tag (mobile)
    data.hasViewport = !!page.viewport;
    if (!page.viewport) {
      issues.push({
        id: "tech-no-viewport",
        title: "Missing viewport meta tag",
        description: "No viewport meta tag found. This is critical for mobile-first indexing.",
        severity: "critical",
        recommendation: 'Add <meta name="viewport" content="width=device-width, initial-scale=1">',
      });
    }

    // 8. Language attribute
    data.language = page.language;
    if (!page.language) {
      issues.push({
        id: "tech-no-lang",
        title: "Missing lang attribute",
        description: "The <html> element is missing a lang attribute.",
        severity: "medium",
        recommendation: 'Add lang attribute to the <html> element (e.g., <html lang="en">).',
      });
    }

    // 9. Charset
    data.charset = page.charset;
    if (!page.charset) {
      issues.push({
        id: "tech-no-charset",
        title: "Missing charset declaration",
        description: "No character encoding is specified.",
        severity: "medium",
        recommendation: 'Add <meta charset="UTF-8"> as the first element in <head>.',
      });
    }

    // 10. Redirect chain
    data.redirectChain = fetchResult.redirectChain;
    if (fetchResult.redirectChain.length > 1) {
      issues.push({
        id: "tech-redirect-chain",
        title: "Redirect chain detected",
        description: `${fetchResult.redirectChain.length} redirects before reaching the final URL.`,
        severity: "medium",
        recommendation: "Reduce redirect chains to a single hop maximum.",
        value: fetchResult.redirectChain.map((r) => `${r.statusCode}: ${r.url}`).join(" → "),
      });
    }

    // 11. URL structure
    const urlObj = new URL(fetchResult.finalUrl);
    data.urlLength = fetchResult.finalUrl.length;
    if (fetchResult.finalUrl.length > 100) {
      issues.push({
        id: "tech-long-url",
        title: "URL is too long",
        description: `URL is ${fetchResult.finalUrl.length} characters (recommended: <100).`,
        severity: "low",
        recommendation: "Shorten the URL to improve readability and click-through rates.",
        value: fetchResult.finalUrl,
      });
    }

    if (urlObj.search) {
      issues.push({
        id: "tech-url-params",
        title: "URL contains query parameters",
        description: "Content URLs should use clean paths without query parameters.",
        severity: "low",
        recommendation: "Use clean, descriptive URLs without query parameters for content pages.",
      });
    }

    // 12. Response time
    data.responseTimeMs = fetchResult.responseTimeMs;
    if (fetchResult.responseTimeMs > 3000) {
      issues.push({
        id: "tech-slow-response",
        title: "Slow server response time",
        description: `Server responded in ${fetchResult.responseTimeMs}ms (target: <600ms).`,
        severity: "high",
        recommendation: "Optimize server response time. Consider caching, CDN, or server upgrades.",
        value: `${fetchResult.responseTimeMs}ms`,
      });
    } else if (fetchResult.responseTimeMs > 600) {
      issues.push({
        id: "tech-moderate-response",
        title: "Moderate server response time",
        description: `Server responded in ${fetchResult.responseTimeMs}ms (target: <600ms).`,
        severity: "medium",
        recommendation: "Consider optimizing server response time for better Core Web Vitals.",
        value: `${fetchResult.responseTimeMs}ms`,
      });
    }

    // 13. Compression
    const encoding = fetchResult.headers["content-encoding"] || "";
    data.compression = encoding || "none";
    if (!encoding) {
      issues.push({
        id: "tech-no-compression",
        title: "No compression detected",
        description: "Response is not compressed with gzip or brotli.",
        severity: "medium",
        recommendation: "Enable gzip or brotli compression on your server.",
      });
    }

    // Score calculation
    const criticalCount = issues.filter((i) => i.severity === "critical").length;
    const highCount = issues.filter((i) => i.severity === "high").length;
    const mediumCount = issues.filter((i) => i.severity === "medium").length;
    const lowCount = issues.filter((i) => i.severity === "low").length;

    const score = Math.max(
      0,
      100 - criticalCount * 20 - highCount * 10 - mediumCount * 5 - lowCount * 2
    );

    return {
      module: "technical",
      status: "completed",
      score,
      issues,
      data,
      executionTimeMs: Date.now() - startTime,
    };
  },
};
