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
        impact: "Mobile users will see a tiny, zoomed-out version of your site, making navigation extremely difficult. Google will penalize the page heavily under mobile-first indexing.",
        codeSnippet: {
          language: "html",
          label: "Add this viewport meta tag inside the <head> element:",
          code: `<meta name="viewport" content="width=device-width, initial-scale=1" />`,
        },
        learnMoreUrl: "https://developer.mozilla.org/en-US/docs/Web/HTML/Viewport_meta_tag",
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
          impact: "Prevents the page from scaling correctly on modern mobile screens, causing content overflow or forced scaling.",
          codeSnippet: {
            language: "html",
            label: "Update the viewport meta tag:",
            code: `<meta name="viewport" content="width=device-width, initial-scale=1" />`,
          },
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
          impact: "Blocks visually impaired users from magnifying page text, failing WCAG compliance guidelines.",
          codeSnippet: {
            language: "html",
            label: "Use a standard viewport configuration that permits scaling:",
            code: `<meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=5" />`,
          },
          learnMoreUrl: "https://www.w3.org/WAI/WCAG22/Understanding/resize-text.html",
        });
      }
    }

    // ── 2. Small touch targets ──────────────────────────────────────
    // Heuristic: look for inline styles with small explicit dimensions on interactive elements
    const smallTargetRegex = /<(?:a|button|input|select)\b[^>]*style=["'][^"']*(?:width|height)\s*:\s*(\d+)(?:px)[^"']*["'][^>]*>/gi;
    const smallTargetsList: string[] = [];
    let smallTargetCount = 0;
    let match;

    while ((match = smallTargetRegex.exec(html)) !== null) {
      const size = parseInt(match[1], 10);
      if (size > 0 && size < 44) {
        smallTargetCount++;
        smallTargetsList.push(match[0].substring(0, 100) + "...");
      }
    }

    // Also check width/height attributes on buttons and links
    const attrSmallRegex = /<(?:a|button|input)\b[^>]*(?:width|height)=["'](\d+)["'][^>]*>/gi;
    while ((match = attrSmallRegex.exec(html)) !== null) {
      const size = parseInt(match[1], 10);
      if (size > 0 && size < 44) {
        smallTargetCount++;
        smallTargetsList.push(match[0].substring(0, 100) + "...");
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
        impact: "Causes accidental clicks and user frustration on mobile devices. Directly affects Core Web Vitals mobile usability assessments.",
        affectedItems: smallTargetsList,
        codeSnippet: {
          language: "css",
          label: "Apply minimum target sizes to interactive classes in CSS:",
          code: `.btn, .nav-link, button, a {\n  min-width: 48px;\n  min-height: 48px;\n  display: inline-flex;\n  align-items: center;\n  justify-content: center;\n}`,
        },
        learnMoreUrl: "https://web.dev/articles/accessible-tap-targets",
      });
    }

    // ── 3. Horizontal scroll indicators ─────────────────────────────
    // Check for elements with very large fixed widths
    const fixedWidthRegex = /style=["'][^"']*width\s*:\s*(\d{4,})px[^"']*["']/gi;
    const oversizedList: string[] = [];
    let oversizedElements = 0;
    while ((match = fixedWidthRegex.exec(html)) !== null) {
      const width = parseInt(match[1], 10);
      if (width > 500) {
        oversizedElements++;
        oversizedList.push(`Element style width: ${width}px`);
      }
    }

    // Check for width attributes > 500px
    const widthAttrRegex = /\bwidth=["'](\d{4,})["']/gi;
    while ((match = widthAttrRegex.exec(html)) !== null) {
      const width = parseInt(match[1], 10);
      if (width > 500) {
        oversizedElements++;
        oversizedList.push(`Attribute width: ${width}`);
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
        impact: "Forces horizontal scrolling, which breaks mobile UX layout stability and causes a poor user experience.",
        affectedItems: oversizedList,
        codeSnippet: {
          language: "css",
          label: "Add responsive properties in your stylesheet:",
          code: `.oversized-element {\n  max-width: 100%;\n  height: auto;\n  box-sizing: border-box;\n}`,
        },
      });
    }

    // ── 4. Small font sizes ─────────────────────────────────────────
    const smallFontRegex = /style=["'][^"']*font-size\s*:\s*(\d+)px[^"']*["']/gi;
    const smallFontsList: string[] = [];
    let smallFontCount = 0;
    while ((match = smallFontRegex.exec(html)) !== null) {
      const size = parseInt(match[1], 10);
      if (size > 0 && size < 12) {
        smallFontCount++;
        smallFontsList.push(`Inline font-size: ${size}px`);
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
        impact: "Hinder mobile readability, forcing users to pinch-zoom to read text, which triggers mobile usability warnings in search consoles.",
        affectedItems: smallFontsList,
        codeSnippet: {
          language: "css",
          label: "Configure responsive font sizes:",
          code: `body {\n  font-size: 16px; /* Ideal mobile body size */\n}\n\n@media (max-width: 768px) {\n  .small-text {\n    font-size: 0.875rem; /* ~14px */\n  }\n}`,
        },
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
        impact: "Renders as broken boxes on modern mobile platforms (iOS and Android do not support these runtimes).",
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
        impact: "Unconstrained large images break page containers on small phone screens, causing ugly horizontal overflow.",
        affectedItems: wideImages.map((i) => i.src),
        codeSnippet: {
          language: "css",
          label: "Add global CSS rules for responsive images:",
          code: `img {\n  max-width: 100%;\n  height: auto;\n}`,
        },
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
        codeSnippet: {
          language: "css",
          label: "Implement fluid typography utilizing CSS clamp():",
          code: `h1 {\n  font-size: clamp(1.8rem, 4vw + 1rem, 3rem);\n}`,
        },
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
      module: "mobile",
      status: "completed",
      score,
      issues,
      data,
      executionTimeMs: Date.now() - startTime,
    };
  },
};
