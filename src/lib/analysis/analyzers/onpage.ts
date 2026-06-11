import type { Analyzer, ModuleResult, Issue, ParsedPage, FetchResult } from "../types";

export const onpageAnalyzer: Analyzer = {
  name: "onpage",
  async analyze(page: ParsedPage, _fetchResult: FetchResult): Promise<ModuleResult> {
    const startTime = Date.now();
    const issues: Issue[] = [];
    const data: Record<string, unknown> = {};

    // 1. Title tag
    data.title = page.title;
    data.titleLength = page.title.length;

    if (!page.title) {
      issues.push({
        id: "onpage-no-title",
        title: "Missing title tag",
        description: "No title tag found on the page.",
        severity: "critical",
        recommendation: "Add a unique, descriptive title tag (50-60 characters).",
      });
    } else {
      if (page.title.length < 30) {
        issues.push({
          id: "onpage-title-short",
          title: "Title tag too short",
          description: `Title is ${page.title.length} characters (recommended: 50-60).`,
          severity: "medium",
          recommendation: "Expand your title to 50-60 characters for better SEO.",
          value: page.title,
        });
      } else if (page.title.length > 60) {
        issues.push({
          id: "onpage-title-long",
          title: "Title tag too long",
          description: `Title is ${page.title.length} characters (recommended: 50-60). It may be truncated in search results.`,
          severity: "medium",
          recommendation: "Shorten your title to 50-60 characters.",
          value: page.title,
        });
      }
    }

    // 2. Meta description
    data.metaDescription = page.metaDescription;
    data.metaDescriptionLength = page.metaDescription.length;

    if (!page.metaDescription) {
      issues.push({
        id: "onpage-no-meta-desc",
        title: "Missing meta description",
        description: "No meta description tag found.",
        severity: "high",
        recommendation: "Add a compelling meta description (150-160 characters).",
      });
    } else {
      if (page.metaDescription.length < 120) {
        issues.push({
          id: "onpage-meta-desc-short",
          title: "Meta description too short",
          description: `Meta description is ${page.metaDescription.length} characters (recommended: 150-160).`,
          severity: "low",
          recommendation: "Expand your meta description to 150-160 characters.",
          value: page.metaDescription,
        });
      } else if (page.metaDescription.length > 160) {
        issues.push({
          id: "onpage-meta-desc-long",
          title: "Meta description too long",
          description: `Meta description is ${page.metaDescription.length} characters (recommended: 150-160). It may be truncated.`,
          severity: "low",
          recommendation: "Shorten your meta description to 150-160 characters.",
          value: page.metaDescription,
        });
      }
    }

    // 3. H1 tag
    const h1s = page.headings.filter((h) => h.level === 1);
    data.h1Count = h1s.length;
    data.h1Text = h1s.map((h) => h.text);

    if (h1s.length === 0) {
      issues.push({
        id: "onpage-no-h1",
        title: "Missing H1 tag",
        description: "No H1 heading found on the page.",
        severity: "critical",
        recommendation: "Add exactly one H1 tag that describes the main topic of the page.",
      });
    } else if (h1s.length > 1) {
      issues.push({
        id: "onpage-multiple-h1",
        title: "Multiple H1 tags",
        description: `Found ${h1s.length} H1 tags. Best practice is to use exactly one.`,
        severity: "medium",
        recommendation: "Use only one H1 tag per page. Convert extras to H2.",
        value: h1s.map((h) => h.text).join(", "),
      });
    }

    // 4. Heading hierarchy
    data.headingStructure = page.headings.map((h) => `H${h.level}: ${h.text}`);
    let previousLevel = 0;
    for (const heading of page.headings) {
      if (heading.level > previousLevel + 1 && previousLevel > 0) {
        issues.push({
          id: "onpage-heading-skip",
          title: "Skipped heading level",
          description: `Heading jumps from H${previousLevel} to H${heading.level}.`,
          severity: "medium",
          recommendation: "Use a logical heading hierarchy without skipping levels (H1→H2→H3).",
          value: `H${previousLevel} → H${heading.level}: "${heading.text}"`,
        });
        break; // Only flag once
      }
      previousLevel = heading.level;
    }

    // 5. Internal links
    const internalLinks = page.links.filter((l) => l.isInternal);
    const externalLinks = page.links.filter((l) => !l.isInternal);
    data.internalLinkCount = internalLinks.length;
    data.externalLinkCount = externalLinks.length;

    if (internalLinks.length < 3) {
      issues.push({
        id: "onpage-few-internal-links",
        title: "Too few internal links",
        description: `Only ${internalLinks.length} internal links found.`,
        severity: "medium",
        recommendation: "Add more internal links (3-5 per 1000 words) to related content.",
      });
    }

    // Check for empty anchor text
    const emptyAnchors = page.links.filter((l) => !l.text.trim() && l.href !== "#");
    if (emptyAnchors.length > 0) {
      issues.push({
        id: "onpage-empty-anchors",
        title: "Links with empty anchor text",
        description: `${emptyAnchors.length} links have no anchor text.`,
        severity: "medium",
        recommendation: "Add descriptive anchor text to all links for accessibility and SEO.",
      });
    }

    // 6. Open Graph
    const requiredOg = ["og:title", "og:description", "og:image", "og:url"];
    const missingOg = requiredOg.filter((key) => !page.openGraph[key]);
    data.openGraph = page.openGraph;
    data.missingOg = missingOg;

    if (missingOg.length > 0) {
      issues.push({
        id: "onpage-missing-og",
        title: "Missing Open Graph tags",
        description: `Missing: ${missingOg.join(", ")}`,
        severity: "medium",
        recommendation: "Add all required Open Graph tags for better social media sharing.",
        value: missingOg.join(", "),
      });
    }

    // 7. Twitter Card
    const requiredTwitter = ["twitter:card", "twitter:title", "twitter:description"];
    const missingTwitter = requiredTwitter.filter((key) => !page.twitterCard[key]);
    data.twitterCard = page.twitterCard;

    if (missingTwitter.length > 0) {
      issues.push({
        id: "onpage-missing-twitter",
        title: "Missing Twitter Card tags",
        description: `Missing: ${missingTwitter.join(", ")}`,
        severity: "low",
        recommendation: "Add Twitter Card meta tags for better Twitter/X sharing previews.",
        value: missingTwitter.join(", "),
      });
    }

    // 8. Favicon
    data.hasFavicon = !!page.favicon;
    if (!page.favicon) {
      issues.push({
        id: "onpage-no-favicon",
        title: "Missing favicon",
        description: "No favicon link element found.",
        severity: "low",
        recommendation: "Add a favicon for brand recognition in browser tabs and bookmarks.",
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
      module: "onpage",
      status: "completed",
      score,
      issues,
      data,
      executionTimeMs: Date.now() - startTime,
    };
  },
};
