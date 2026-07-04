import type { Analyzer, ModuleResult, Issue, ParsedPage } from "../types";

export const imagesAnalyzer: Analyzer = {
  name: "images",
  async analyze(page: ParsedPage): Promise<ModuleResult> {
    const startTime = Date.now();
    const issues: Issue[] = [];
    const data: Record<string, unknown> = {};

    data.totalImages = page.images.length;

    if (page.images.length === 0) {
      data.hasImages = false;
      return {
        module: "images",
        status: "completed",
        score: 100,
        issues: [{
          id: "images-none",
          title: "No images found",
          description: "The page contains no images. Consider adding relevant visual content.",
          severity: "info",
          recommendation: "Add relevant images to improve engagement and visual appeal.",
        }],
        data,
        executionTimeMs: Date.now() - startTime,
      };
    }

    // 1. Alt text analysis
    const missingAlt = page.images.filter((img) => !img.alt);
    const badAlt = page.images.filter(
      (img) =>
        img.alt &&
        (/^(image|photo|picture|img|screenshot|untitled)\s*\d*$/i.test(img.alt.trim()) ||
          /\.(jpg|jpeg|png|gif|webp|svg|avif)$/i.test(img.alt.trim()) ||
          img.alt.trim().length < 5)
    );
    data.missingAltCount = missingAlt.length;
    data.badAltCount = badAlt.length;

    if (missingAlt.length > 0) {
      issues.push({
        id: "images-missing-alt",
        title: "Images missing alt text",
        description: `${missingAlt.length} of ${page.images.length} images have no alt attribute.`,
        severity: missingAlt.length > page.images.length / 2 ? "critical" : "high",
        recommendation: "Add descriptive alt text to all images (10-125 characters).",
        value: missingAlt.slice(0, 5).map((i) => i.src).join(", "),
      });
    }

    if (badAlt.length > 0) {
      issues.push({
        id: "images-bad-alt",
        title: "Images with non-descriptive alt text",
        description: `${badAlt.length} images have generic or filename-based alt text.`,
        severity: "medium",
        recommendation: "Replace generic alt text with descriptive text that explains the image content.",
        value: badAlt.slice(0, 5).map((i) => `"${i.alt}"`).join(", "),
      });
    }

    // 2. Format analysis
    const formatCounts: Record<string, number> = {};
    page.images.forEach((img) => {
      const ext = img.src.split(".").pop()?.split("?")[0]?.toLowerCase() || "unknown";
      formatCounts[ext] = (formatCounts[ext] || 0) + 1;
    });
    data.formatDistribution = formatCounts;

    const legacyFormats = (formatCounts["jpg"] || 0) + (formatCounts["jpeg"] || 0) + (formatCounts["png"] || 0);
    const modernFormats = (formatCounts["webp"] || 0) + (formatCounts["avif"] || 0);

    if (legacyFormats > 0 && modernFormats === 0) {
      issues.push({
        id: "images-no-modern-format",
        title: "No modern image formats used",
        description: `All ${legacyFormats} images use legacy formats (JPEG/PNG). No WebP or AVIF detected.`,
        severity: "medium",
        recommendation: "Convert images to WebP (97%+ browser support) or AVIF (92%+ support) for better compression.",
      });
    }

    // 3. Picture element usage
    const inPicture = page.images.filter((img) => img.isInPicture).length;
    data.pictureElements = inPicture;

    // 4. Lazy loading
    const lazyMethods: Record<string, number> = {};
    page.images.forEach((img) => {
      lazyMethods[img.lazyMethod] = (lazyMethods[img.lazyMethod] || 0) + 1;
    });
    data.lazyLoadMethods = lazyMethods;

    const nonLazyBelowFold = page.images.filter(
      (_, idx) => idx > 0 && page.images[idx].lazyMethod === "none"
    );
    if (nonLazyBelowFold.length > 3) {
      issues.push({
        id: "images-no-lazy-loading",
        title: "Images not lazy-loaded",
        description: `${nonLazyBelowFold.length} below-fold images are not lazy-loaded.`,
        severity: "medium",
        recommendation: 'Add loading="lazy" to below-fold images to improve initial page load.',
      });
    }

    // Check if first image is lazy-loaded (bad for LCP)
    if (page.images.length > 0 && page.images[0].loading === "lazy") {
      issues.push({
        id: "images-hero-lazy",
        title: "Hero/LCP image is lazy-loaded",
        description: "The first image on the page has loading=\"lazy\" which hurts LCP performance.",
        severity: "high",
        recommendation: 'Remove loading="lazy" from the hero/above-fold image and add fetchpriority="high" instead.',
        element: page.images[0].src,
      });
    }

    // 5. Fetchpriority
    const heroWithPriority = page.images.length > 0 && page.images[0].fetchpriority === "high";
    data.heroHasFetchpriority = heroWithPriority;

    if (page.images.length > 0 && !heroWithPriority && page.images[0].loading !== "lazy") {
      issues.push({
        id: "images-no-fetchpriority",
        title: "Hero image missing fetchpriority",
        description: "The main image does not have fetchpriority=\"high\" set.",
        severity: "low",
        recommendation: 'Add fetchpriority="high" to your hero/LCP image for faster loading.',
      });
    }

    // 6. CLS prevention (width/height)
    const noDimensions = page.images.filter((img) => !img.width && !img.height);
    data.noDimensionsCount = noDimensions.length;

    if (noDimensions.length > 0) {
      issues.push({
        id: "images-no-dimensions",
        title: "Images missing width/height attributes",
        description: `${noDimensions.length} images have no width/height set, risking CLS.`,
        severity: noDimensions.length > page.images.length / 2 ? "high" : "medium",
        recommendation: "Add explicit width and height attributes to all images to prevent Cumulative Layout Shift.",
      });
    }

    // 7. Decoding attribute
    const noDecoding = page.images.filter(
      (img, idx) => idx > 0 && img.decoding !== "async"
    );
    if (noDecoding.length > 3) {
      issues.push({
        id: "images-no-async-decoding",
        title: "Non-LCP images missing decoding=\"async\"",
        description: `${noDecoding.length} non-hero images don't have decoding="async".`,
        severity: "low",
        recommendation: 'Add decoding="async" to non-LCP images to prevent blocking the main thread.',
      });
    }

    // 8. Responsive images
    const hasSrcset = page.images.filter((img) => img.srcset).length;
    data.responsiveImages = hasSrcset;

    if (hasSrcset === 0 && page.images.length > 2) {
      issues.push({
        id: "images-no-srcset",
        title: "No responsive images detected",
        description: "No images use srcset for responsive delivery.",
        severity: "medium",
        recommendation: "Use srcset and sizes attributes to serve appropriately sized images for each device.",
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
      module: "images",
      status: "completed",
      score,
      issues,
      data,
      executionTimeMs: Date.now() - startTime,
    };
  },
};
