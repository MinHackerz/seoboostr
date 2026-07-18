import type { Analyzer, ModuleResult, Issue, ParsedPage } from "../types";

export const onpageAnalyzer: Analyzer = {
  name: "onpage",
  async analyze(page: ParsedPage): Promise<ModuleResult> {
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
        impact: "The title tag is the single most important on-page SEO element. Missing titles result in Google auto-generating one, often poorly.",
        codeSnippet: {
          language: "html",
          label: "Add a descriptive title tag inside your <head>:",
          code: `<title>Your Primary Keyword — Brand Name</title>`,
        },
        learnMoreUrl: "https://developers.google.com/search/docs/appearance/title-link",
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
          impact: "Short titles miss keyword opportunities and have lower click-through rates in search results.",
        });
      } else if (page.title.length > 60) {
        issues.push({
          id: "onpage-title-long",
          title: "Title tag too long",
          description: `Title is ${page.title.length} characters (recommended: 50-60). It may be truncated in search results.`,
          severity: "medium",
          recommendation: "Shorten your title to 50-60 characters.",
          value: page.title,
          impact: "Titles over 60 characters get truncated in Google SERPs with '...', reducing click-through rates.",
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
        impact: "Google uses meta descriptions as snippet text. Without one, Google auto-generates a snippet that may not be compelling.",
        codeSnippet: {
          language: "html",
          label: "Add a meta description inside your <head>:",
          code: `<meta name="description" content="A compelling 150-160 character description that includes your target keywords and a clear value proposition to encourage clicks." />`,
        },
        learnMoreUrl: "https://developers.google.com/search/docs/appearance/snippet",
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
          impact: "Longer meta descriptions fill more SERP space, increasing visibility and click-through rates.",
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
        impact: "The H1 is the primary heading signal for search engines. Missing it weakens topical relevance.",
        codeSnippet: {
          language: "html",
          label: "Add a single H1 heading with your primary keyword:",
          code: `<h1>Your Primary Keyword or Page Topic</h1>`,
        },
      });
    } else if (h1s.length > 1) {
      issues.push({
        id: "onpage-multiple-h1",
        title: "Multiple H1 tags",
        description: `Found ${h1s.length} H1 tags. Best practice is to use exactly one.`,
        severity: "medium",
        recommendation: "Use only one H1 tag per page. Convert extras to H2.",
        value: h1s.map((h) => h.text).join(", "),
        affectedItems: h1s.map((h) => `H1: "${h.text}"`),
        impact: "Multiple H1s dilute the primary heading signal, making it harder for search engines to determine the page's main topic.",
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
          impact: "Broken heading hierarchy confuses screen readers and weakens content structure signals for SEO.",
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
        impact: "Internal links distribute PageRank and help search engines discover and understand your site structure.",
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
        affectedItems: emptyAnchors.slice(0, 5).map((l) => l.href || "(empty href)"),
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
        impact: "Pages shared on Facebook, LinkedIn, and other platforms will show generic previews instead of rich cards.",
        codeSnippet: {
          language: "html",
          label: "Add these Open Graph meta tags inside your <head>:",
          code: missingOg.map((tag) => {
            const prop = tag.replace("og:", "");
            const examples: Record<string, string> = {
              title: page.title || "Your Page Title",
              description: page.metaDescription || "A compelling description of your page content",
              image: "https://yourdomain.com/images/og-image.jpg",
              url: page.url || "https://yourdomain.com/page",
            };
            return `<meta property="${tag}" content="${examples[prop] || ""}" />`;
          }).join("\n"),
        },
        learnMoreUrl: "https://ogp.me/",
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
        codeSnippet: {
          language: "html",
          label: "Add these Twitter Card meta tags inside your <head>:",
          code: `<meta name="twitter:card" content="summary_large_image" />\n<meta name="twitter:title" content="${page.title || "Your Page Title"}" />\n<meta name="twitter:description" content="${page.metaDescription || "Page description"}" />\n<meta name="twitter:image" content="https://yourdomain.com/images/twitter-card.jpg" />`,
        },
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
        codeSnippet: {
          language: "html",
          label: "Add a favicon link inside your <head>:",
          code: `<link rel="icon" href="/favicon.ico" sizes="32x32" />\n<link rel="icon" href="/icon.svg" type="image/svg+xml" />\n<link rel="apple-touch-icon" href="/apple-touch-icon.png" />`,
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
      module: "onpage",
      status: "completed",
      score,
      issues,
      data,
      executionTimeMs: Date.now() - startTime,
    };
  },
};
