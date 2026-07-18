import type { Analyzer, ModuleResult, Issue, ParsedPage, FetchResult } from "../types";
import { isCrawlerBlocked } from "../parser";

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
        recommendation: "Allow the SEO Optimised User-Agent (SEOOptimized/1.0) in your hosting firewall (Vercel / Cloudflare) to enable full audits.",
        value: `Status ${fetchResult.statusCode}: ${page.title}`,
        impact: "Blocks all search engine and AI crawlers from indexing your site, causing zero organic visibility.",
        learnMoreUrl: "https://developers.cloudflare.com/bots/get-started/",
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
        impact: "Google uses HTTPS as a ranking signal. Non-HTTPS sites show 'Not Secure' warnings in browsers, reducing trust and click-through rates by up to 50%.",
        learnMoreUrl: "https://developers.google.com/search/docs/crawling-indexing/http-https",
      });
    }

    // 2. Robots.txt (Only checked on site root/homepage)
    // Note: Security headers are fully audited by the dedicated Security Headers module
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
        const isBlocked = fetchResult.statusCode === 429 || 
                          (fetchResult.headers && (
                            fetchResult.headers["x-vercel-mitigated"] || 
                            fetchResult.headers["server"]?.toLowerCase().includes("cloudflare")
                          ));

        issues.push({
          id: "tech-no-robots",
          title: isBlocked ? "robots.txt blocked by Firewall" : "Missing robots.txt",
          description: isBlocked 
            ? "The request to fetch robots.txt was blocked by Vercel/Cloudflare Attack Mitigation (returned HTTP 429 Challenge)."
            : "No robots.txt file found at the root of the site.",
          severity: isBlocked ? "medium" : "high",
          recommendation: isBlocked 
            ? "Whitelist the SEO Optimised crawler User-Agent ('SEOOptimized/1.0') or configure your WAF to allow automated crawler requests."
            : "Create a robots.txt file to control search engine crawling.",
          impact: "Without robots.txt, search engines may crawl unnecessary pages, wasting crawl budget and potentially indexing sensitive areas.",
          codeSnippet: isBlocked ? undefined : {
            language: "text",
            label: "Create a robots.txt file at your site root with this starter template:",
            code: `User-agent: *\nAllow: /\n\n# Block admin and private areas\nDisallow: /admin/\nDisallow: /api/\nDisallow: /private/\n\n# Sitemap location\nSitemap: ${fetchResult.finalUrl.replace(/\/$/, "")}/sitemap.xml`,
          },
          learnMoreUrl: "https://developers.google.com/search/docs/crawling-indexing/robots/intro",
        });
      } else {
        // Check for AI crawler rules
        const aiCrawlers = ["GPTBot", "ChatGPT-User", "ClaudeBot", "PerplexityBot", "Bytespider", "Google-Extended", "CCBot"];
        const blockedAiCrawlers: string[] = [];
        const allowedAiCrawlers: string[] = [];

        aiCrawlers.forEach((crawler) => {
          if (fetchResult.robotsTxt && isCrawlerBlocked(fetchResult.robotsTxt, crawler)) {
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
          impact: "Helps search engines discover your sitemap faster, improving crawl efficiency for new and updated pages.",
          codeSnippet: {
            language: "text",
            label: "Add this line to the end of your robots.txt file:",
            code: `Sitemap: ${fetchResult.finalUrl.replace(/\/$/, "")}/sitemap.xml`,
          },
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
        impact: "Without a canonical tag, search engines may split ranking signals across duplicate URLs, diluting your page authority.",
        codeSnippet: {
          language: "html",
          label: "Add this tag inside your <head> element:",
          code: `<link rel="canonical" href="${fetchResult.finalUrl}" />`,
        },
        learnMoreUrl: "https://developers.google.com/search/docs/crawling-indexing/canonicalization",
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
        impact: "This page is completely excluded from search engine results. No organic traffic is possible.",
        codeSnippet: {
          language: "html",
          label: "Replace your current meta robots tag with:",
          code: `<meta name="robots" content="index, follow" />`,
        },
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
        impact: "Google uses mobile-first indexing. Without a viewport tag, your page renders at desktop width on mobile, severely harming mobile rankings.",
        codeSnippet: {
          language: "html",
          label: "Add this tag inside your <head> element:",
          code: `<meta name="viewport" content="width=device-width, initial-scale=1" />`,
        },
        learnMoreUrl: "https://developer.chrome.com/docs/lighthouse/pwa/viewport",
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
        impact: "Helps search engines serve the right language version and improves accessibility for screen readers.",
        codeSnippet: {
          language: "html",
          label: "Update your opening <html> tag:",
          code: `<html lang="en">`,
        },
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
        codeSnippet: {
          language: "html",
          label: "Add this as the very first element inside <head>:",
          code: `<meta charset="UTF-8" />`,
        },
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
        impact: "Each redirect adds ~100-300ms latency and wastes crawl budget. Long chains may cause Googlebot to stop following.",
        affectedItems: fetchResult.redirectChain.map((r) => `${r.statusCode} → ${r.url}`),
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
        impact: "TTFB above 600ms directly harms Largest Contentful Paint (LCP), a Core Web Vital ranking factor.",
      });
    } else if (fetchResult.responseTimeMs > 600) {
      issues.push({
        id: "tech-moderate-response",
        title: "Moderate server response time",
        description: `Server responded in ${fetchResult.responseTimeMs}ms (target: <600ms).`,
        severity: "medium",
        recommendation: "Consider optimizing server response time for better Core Web Vitals.",
        value: `${fetchResult.responseTimeMs}ms`,
        impact: "Improving TTFB to under 600ms can boost your LCP score and improve rankings.",
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
        impact: "Compression reduces transfer size by 60-80%, significantly improving page load speed.",
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
