import type { Analyzer, ModuleResult, Issue, ParsedPage, FetchResult } from "../types";

export const mobileAnalyzer: Analyzer = {
  name: "mobile",
  async analyze(page: ParsedPage, fetchResult: FetchResult): Promise<ModuleResult> {
    const startTime = Date.now();
    const issues: Issue[] = [];
    const data: Record<string, unknown> = {};
    const html = fetchResult.html;

    // ── 1. Viewport meta tag ────────────────────────────────────────
    const viewport = page.viewport;
    data.viewport = viewport || null;

    if (!viewport) {
      issues.push({
        id: "mobile-no-viewport",
        title: "Missing viewport meta tag",
        description: "No viewport meta tag detected. Without it, mobile browsers render pages at desktop width and scale down.",
        severity: "critical",
        recommendation: "Add <meta name=\"viewport\" content=\"width=device-width, initial-scale=1\"> to the <head>.",
      });
    } else {
      // ── 1a. Fixed width viewport ──────────────────────────────────
      if (/width=\d+/i.test(viewport) && !/width=device-width/i.test(viewport)) {
        const widthMatch = viewport.match(/width=(\d+)/i);
        issues.push({
          id: "mobile-fixed-width-viewport",
          title: "Viewport uses fixed pixel width",
          description: `The viewport is set to a fixed width of ${widthMatch?.[1] || "unknown"}px instead of device-width. This prevents proper responsive behavior.`,
          severity: "high",
          recommendation: "Replace fixed width with `width=device-width` in the viewport meta tag.",
          value: viewport,
        });
      }

      // ── 1b. Zoom blocked ─────────────────────────────────────────
      const blocksZoom =
        /user-scalable\s*=\s*(no|0)/i.test(viewport) ||
        /maximum-scale\s*=\s*1(\.0)?\b/i.test(viewport);
      data.blocksZoom = blocksZoom;

      if (blocksZoom) {
        issues.push({
          id: "mobile-no-scaling",
          title: "Viewport disables user scaling/zoom",
          description: "The viewport uses `user-scalable=no` or `maximum-scale=1`, preventing users from zooming. This is an accessibility barrier.",
          severity: "medium",
          recommendation: "Remove `user-scalable=no` and set `maximum-scale=5` or higher to allow zooming.",
          value: viewport,
        });
      }
    }

    // ── 2. Small touch targets ──────────────────────────────────────
    // Heuristic: look for inline styles with small explicit dimensions on interactive elements
    const smallTargetRegex = /<(?:a|button|input|select)\b[^>]*style=["'][^"']*(?:width|height)\s*:\s*(\d+)(?:px)[^"']*["'][^>]*>/gi;
    let smallTargetCount = 0;
    let match;

    while ((match = smallTargetRegex.exec(html)) !== null) {
      const size = parseInt(match[1], 10);
      if (size > 0 && size < 44) {
        smallTargetCount++;
      }
    }

    // Also check width/height attributes on buttons and links
    const attrSmallRegex = /<(?:a|button|input)\b[^>]*(?:width|height)=["'](\d+)["'][^>]*>/gi;
    while ((match = attrSmallRegex.exec(html)) !== null) {
      const size = parseInt(match[1], 10);
      if (size > 0 && size < 44) {
        smallTargetCount++;
      }
    }

    data.smallTouchTargets = smallTargetCount;

    if (smallTargetCount > 0) {
      issues.push({
        id: "mobile-small-touch-targets",
        title: "Small touch targets detected",
        description: `Found ${smallTargetCount} interactive element(s) with explicit dimensions smaller than 44px. Google recommends a minimum of 48x48px for touch targets.`,
        severity: "high",
        recommendation: "Ensure all clickable/tappable elements are at least 48x48 CSS pixels with at least 8px spacing between targets.",
        value: `${smallTargetCount} small targets`,
      });
    }

    // ── 3. Horizontal scroll indicators ─────────────────────────────
    // Check for elements with very large fixed widths
    const fixedWidthRegex = /style=["'][^"']*width\s*:\s*(\d{4,})px[^"']*["']/gi;
    let oversizedElements = 0;
    while ((match = fixedWidthRegex.exec(html)) !== null) {
      const width = parseInt(match[1], 10);
      if (width > 500) {
        oversizedElements++;
      }
    }

    // Check for width attributes > 500px
    const widthAttrRegex = /\bwidth=["'](\d{4,})["']/gi;
    while ((match = widthAttrRegex.exec(html)) !== null) {
      const width = parseInt(match[1], 10);
      if (width > 500) {
        oversizedElements++;
      }
    }

    data.oversizedElements = oversizedElements;

    if (oversizedElements > 0) {
      issues.push({
        id: "mobile-horizontal-scroll",
        title: "Elements may cause horizontal scrolling on mobile",
        description: `Found ${oversizedElements} element(s) with fixed widths exceeding 500px. These likely cause horizontal scrolling on mobile devices.`,
        severity: "high",
        recommendation: "Use relative units (%, vw, rem) or max-width instead of fixed pixel widths. Apply `overflow-x: hidden` on the body as a safety net.",
        value: `${oversizedElements} oversized elements`,
      });
    }

    // ── 4. Small font sizes ─────────────────────────────────────────
    const smallFontRegex = /style=["'][^"']*font-size\s*:\s*(\d+)px[^"']*["']/gi;
    let smallFontCount = 0;
    while ((match = smallFontRegex.exec(html)) !== null) {
      const size = parseInt(match[1], 10);
      if (size > 0 && size < 12) {
        smallFontCount++;
      }
    }
    data.smallFontElements = smallFontCount;

    if (smallFontCount > 0) {
      issues.push({
        id: "mobile-small-font",
        title: "Elements with small font sizes",
        description: `Found ${smallFontCount} element(s) with inline font-size smaller than 12px. Google Lighthouse flags text smaller than 12px as hard to read on mobile.`,
        severity: "medium",
        recommendation: "Use a minimum font size of 16px for body text and 12px for secondary text. Use relative units (rem, em) for better scaling.",
        value: `${smallFontCount} elements with font < 12px`,
      });
    }

    // ── 5. Non-mobile-friendly content (Flash, etc.) ────────────────
    const hasFlash =
      /<object\b[^>]*type=["']application\/x-shockwave-flash["']/i.test(html) ||
      /<embed\b[^>]*type=["']application\/x-shockwave-flash["']/i.test(html) ||
      /\.swf["']/i.test(html);
    const hasApplet = /<applet\b/i.test(html);
    const hasSilverlight = /silverlight/i.test(html);
    data.hasFlash = hasFlash;
    data.hasApplet = hasApplet;

    if (hasFlash || hasApplet || hasSilverlight) {
      issues.push({
        id: "mobile-unplayable-content",
        title: "Non-mobile-friendly embedded content",
        description: `Page contains ${hasFlash ? "Flash" : hasApplet ? "Java Applet" : "Silverlight"} content that cannot play on mobile devices.`,
        severity: "medium",
        recommendation: "Replace Flash, Applets, and Silverlight with modern HTML5, CSS3, and JavaScript alternatives.",
        value: [hasFlash && "Flash", hasApplet && "Applet", hasSilverlight && "Silverlight"].filter(Boolean).join(", "),
      });
    }

    // ── 6. Too-wide images ──────────────────────────────────────────
    const wideImages = page.images.filter((img) => {
      const w = parseInt(img.width, 10);
      return w > 1200 && !img.srcset && !img.sizes;
    });
    data.wideImageCount = wideImages.length;

    if (wideImages.length > 0) {
      issues.push({
        id: "mobile-too-wide-images",
        title: "Large fixed-width images without responsive markup",
        description: `Found ${wideImages.length} image(s) with width > 1200px and no srcset/sizes attributes. These may cause layout issues on mobile.`,
        severity: "medium",
        recommendation: "Add srcset and sizes attributes for responsive images, or use CSS max-width: 100% to constrain images.",
        element: wideImages.slice(0, 3).map((i) => i.src).join(", "),
        value: `${wideImages.length} wide images`,
      });
    }

    // ── 7. Text content readability (word count vs font sizing) ─────
    const hasResponsiveText = /font-size\s*:\s*[\d.]+(?:rem|em|vw|%)/i.test(html) ||
      /@media\s*\(/i.test(html);
    data.hasResponsiveText = hasResponsiveText;

    // Only flag if page has significant content but no responsive text patterns
    if (page.wordCount > 200 && !hasResponsiveText && smallFontCount > 3) {
      issues.push({
        id: "mobile-no-responsive-text",
        title: "No responsive typography detected",
        description: "Page has significant content but uses only fixed pixel font sizes with no media queries for responsive scaling.",
        severity: "low",
        recommendation: "Use relative font units (rem, em) and implement responsive typography with CSS media queries or clamp().",
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
      module: "mobile",
      status: "completed",
      score,
      issues,
      data,
      executionTimeMs: Date.now() - startTime,
    };
  },
};
