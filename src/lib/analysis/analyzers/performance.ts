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
        impact: "Large HTML blocks rendering until fully downloaded. Every 100KB adds ~50ms on 3G connections.",
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
        impact: "Excessive DOM size increases memory usage, slows style recalculations, and directly harms Interaction to Next Paint (INP).",
        learnMoreUrl: "https://developer.chrome.com/docs/lighthouse/performance/dom-size",
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
        affectedItems: renderBlockingCSS.slice(0, 5).map((s) => s.href || "(unknown stylesheet)"),
        impact: "Each render-blocking CSS file adds a network round-trip before first paint, directly increasing LCP.",
        codeSnippet: {
          language: "html",
          label: "Defer non-critical CSS using the media attribute trick:",
          code: `<!-- Load non-critical CSS without blocking render -->\n<link rel="stylesheet" href="non-critical.css" media="print" onload="this.media='all'" />\n<noscript><link rel="stylesheet" href="non-critical.css" /></noscript>`,
        },
      });
    }

    if (renderBlockingJS.length > 3) {
      issues.push({
        id: "perf-blocking-js",
        title: "Multiple render-blocking scripts",
        description: `${renderBlockingJS.length} scripts lack async/defer attributes.`,
        severity: "high",
        recommendation: "Add async or defer to non-critical scripts to prevent render blocking.",
        affectedItems: renderBlockingJS.slice(0, 5).map((s) => s.src),
        impact: "Each render-blocking script pauses HTML parsing. Adding defer can improve LCP by 100-500ms.",
        codeSnippet: {
          language: "html",
          label: "Add defer or async to script tags:",
          code: `<!-- Use defer for scripts that need DOM (most scripts) -->\n<script src="app.js" defer></script>\n\n<!-- Use async for independent scripts (analytics, ads) -->\n<script src="analytics.js" async></script>`,
        },
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
        impact: "Without font-display, text is invisible during font loading (FOIT), creating a poor user experience and potentially harming LCP.",
        codeSnippet: {
          language: "css",
          label: "Add font-display to your @font-face declarations:",
          code: `@font-face {\n  font-family: 'Your Font';\n  src: url('font.woff2') format('woff2');\n  font-display: swap; /* Shows fallback text immediately */\n}`,
        },
      });
    }

    if (fontLinks.length > 3) {
      issues.push({
        id: "perf-too-many-fonts",
        title: "Too many font resources",
        description: `${fontLinks.length} font stylesheets detected.`,
        severity: "medium",
        recommendation: "Reduce the number of font variants to minimize network requests.",
        affectedItems: fontLinks.slice(0, 5).map((s) => s.href),
        impact: "Each font file adds 20-100KB and a network request. Limit to 2-3 font files maximum.",
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
        codeSnippet: {
          language: "html",
          label: "Add resource hints inside your <head>:",
          code: `<!-- Preconnect to third-party origins -->\n<link rel="preconnect" href="https://fonts.googleapis.com" />\n<link rel="preconnect" href="https://cdn.example.com" crossorigin />\n\n<!-- Preload critical resources -->\n<link rel="preload" href="/fonts/main.woff2" as="font" type="font/woff2" crossorigin />`,
        },
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
        affectedItems: thirdPartyScripts.slice(0, 8).map((s) => s.src),
        impact: "Third-party scripts are the #1 cause of poor INP scores. Each adds DNS + TCP + TLS latency (~200ms on 3G).",
      });
    } else if (thirdPartyScripts.length > 5) {
      issues.push({
        id: "perf-many-third-party",
        title: "Many third-party scripts",
        description: `${thirdPartyScripts.length} third-party scripts detected.`,
        severity: "medium",
        recommendation: "Review third-party scripts for necessity and load non-essential ones asynchronously.",
        affectedItems: thirdPartyScripts.slice(0, 5).map((s) => s.src),
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
        impact: "Inline scripts can't be cached separately and increase HTML document size, slowing every page load.",
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
