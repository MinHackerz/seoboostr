import type { Analyzer, ModuleResult, Issue, ParsedPage, FetchResult } from "../types";

export const performanceAnalyzer: Analyzer = {
  name: "performance",
  async analyze(page: ParsedPage, fetchResult: FetchResult): Promise<ModuleResult> {
    const startTime = Date.now();
    const issues: Issue[] = [];
    const data: Record<string, unknown> = {};

    // 1. Server response time (TTFB proxy)
    data.responseTimeMs = fetchResult.responseTimeMs;

    // 2. HTML size
    const htmlSize = new Blob([fetchResult.html]).size;
    data.htmlSizeBytes = htmlSize;
    data.htmlSizeKb = Math.round(htmlSize / 1024);

    if (htmlSize > 1000000) {
      issues.push({
        id: "perf-html-too-large",
        title: "HTML document is very large",
        description: `HTML is ${Math.round(htmlSize / 1024)}KB (target: <100KB).`,
        severity: "high",
        recommendation: "Reduce HTML size by removing inline styles/scripts, unnecessary comments, and whitespace.",
        value: `${Math.round(htmlSize / 1024)}KB`,
      });
    } else if (htmlSize > 200000) {
      issues.push({
        id: "perf-html-large",
        title: "HTML document is large",
        description: `HTML is ${Math.round(htmlSize / 1024)}KB (target: <100KB).`,
        severity: "medium",
        recommendation: "Consider reducing HTML size for faster page loads.",
        value: `${Math.round(htmlSize / 1024)}KB`,
      });
    }

    // 3. DOM complexity
    const domElements = (fetchResult.html.match(/<[a-z]/gi) || []).length;
    data.domElements = domElements;

    if (domElements > 3000) {
      issues.push({
        id: "perf-dom-too-complex",
        title: "Excessive DOM complexity",
        description: `~${domElements} DOM elements detected (target: <1500).`,
        severity: "high",
        recommendation: "Simplify the DOM structure. Consider lazy rendering or virtual scrolling for complex pages.",
        value: `~${domElements} elements`,
      });
    } else if (domElements > 1500) {
      issues.push({
        id: "perf-dom-complex",
        title: "Complex DOM structure",
        description: `~${domElements} DOM elements detected (target: <1500).`,
        severity: "medium",
        recommendation: "Consider reducing DOM complexity for better rendering performance.",
        value: `~${domElements} elements`,
      });
    }

    // 4. Render-blocking resources
    const renderBlockingCSS = page.stylesheets.filter(
      (s) => !s.isInline && s.media === "all"
    );
    const renderBlockingJS = page.scripts.filter(
      (s) => !s.isAsync && !s.isDefer && !s.isModule && s.src
    );
    data.renderBlockingCSS = renderBlockingCSS.length;
    data.renderBlockingJS = renderBlockingJS.length;

    if (renderBlockingCSS.length > 3) {
      issues.push({
        id: "perf-blocking-css",
        title: "Multiple render-blocking stylesheets",
        description: `${renderBlockingCSS.length} external stylesheets block rendering.`,
        severity: "medium",
        recommendation: "Inline critical CSS and defer non-critical stylesheets with media queries.",
        value: renderBlockingCSS.map((s) => s.href).join(", "),
      });
    }

    if (renderBlockingJS.length > 3) {
      issues.push({
        id: "perf-blocking-js",
        title: "Multiple render-blocking scripts",
        description: `${renderBlockingJS.length} scripts lack async/defer attributes.`,
        severity: "high",
        recommendation: "Add async or defer to non-critical scripts to prevent render blocking.",
        value: renderBlockingJS.map((s) => s.src).join(", "),
      });
    }

    // 5. Font loading
    const fontLinks = page.stylesheets.filter((s) =>
      s.href.includes("fonts.googleapis.com") || s.href.includes("fonts.gstatic.com")
    );
    const hasFontDisplay = fetchResult.html.includes("font-display");
    data.externalFonts = fontLinks.length;
    data.hasFontDisplay = hasFontDisplay;

    if (fontLinks.length > 0 && !hasFontDisplay) {
      issues.push({
        id: "perf-no-font-display",
        title: "Missing font-display property",
        description: "Web fonts detected but no font-display strategy found.",
        severity: "medium",
        recommendation: 'Use font-display: swap or optional to prevent FOIT (Flash of Invisible Text).',
      });
    }

    if (fontLinks.length > 3) {
      issues.push({
        id: "perf-too-many-fonts",
        title: "Too many font resources",
        description: `${fontLinks.length} font stylesheets detected.`,
        severity: "medium",
        recommendation: "Reduce the number of font variants to minimize network requests.",
      });
    }

    // 6. Preload/prefetch usage
    const hasPreload = fetchResult.html.includes('rel="preload"');
    const hasPrefetch = fetchResult.html.includes('rel="prefetch"');
    const hasPreconnect = fetchResult.html.includes('rel="preconnect"');
    data.resourceHints = { preload: hasPreload, prefetch: hasPrefetch, preconnect: hasPreconnect };

    if (!hasPreload && !hasPreconnect) {
      issues.push({
        id: "perf-no-resource-hints",
        title: "No resource hints detected",
        description: "No preload, prefetch, or preconnect hints found.",
        severity: "low",
        recommendation: "Add preload for critical resources and preconnect for third-party origins.",
      });
    }

    // 7. Third-party scripts
    const thirdPartyScripts = page.scripts.filter((s) => {
      if (!s.src) return false;
      try {
        const scriptHost = new URL(s.src, page.url).hostname;
        const pageHost = new URL(page.url).hostname;
        return scriptHost !== pageHost;
      } catch {
        return false;
      }
    });
    data.thirdPartyScripts = thirdPartyScripts.length;

    if (thirdPartyScripts.length > 10) {
      issues.push({
        id: "perf-too-many-third-party",
        title: "Excessive third-party scripts",
        description: `${thirdPartyScripts.length} third-party scripts detected.`,
        severity: "high",
        recommendation: "Audit and reduce third-party scripts. Each adds latency and potential single points of failure.",
      });
    } else if (thirdPartyScripts.length > 5) {
      issues.push({
        id: "perf-many-third-party",
        title: "Many third-party scripts",
        description: `${thirdPartyScripts.length} third-party scripts detected.`,
        severity: "medium",
        recommendation: "Review third-party scripts for necessity and load non-essential ones asynchronously.",
      });
    }

    // 8. Compression
    const encoding = fetchResult.headers["content-encoding"] || "";
    data.compression = encoding || "none";

    // 9. Inline script/style size
    const totalInlineJS = page.scripts
      .filter((s) => s.isInline)
      .reduce((sum, s) => sum + s.size, 0);
    const totalInlineCSS = page.stylesheets
      .filter((s) => s.isInline)
      .reduce((sum, s) => sum + s.size, 0);
    data.inlineJsSize = totalInlineJS;
    data.inlineCssSize = totalInlineCSS;

    if (totalInlineJS > 50000) {
      issues.push({
        id: "perf-large-inline-js",
        title: "Large inline JavaScript",
        description: `${Math.round(totalInlineJS / 1024)}KB of inline JavaScript detected.`,
        severity: "medium",
        recommendation: "Move large inline scripts to external files for better caching.",
        value: `${Math.round(totalInlineJS / 1024)}KB`,
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
      module: "performance",
      status: "completed",
      score,
      issues,
      data,
      executionTimeMs: Date.now() - startTime,
    };
  },
};
