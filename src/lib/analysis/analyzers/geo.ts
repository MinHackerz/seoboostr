import type { Analyzer, ModuleResult, Issue, ParsedPage, FetchResult } from "../types";
import { isCrawlerBlocked } from "../parser";

export const geoAnalyzer: Analyzer = {
  name: "geo",
  async analyze(page: ParsedPage, fetchResult: FetchResult): Promise<ModuleResult> {
    const startTime = Date.now();
    const issues: Issue[] = [];
    const data: Record<string, unknown> = {};

    let isRoot = false;
    try {
      isRoot = new URL(fetchResult.url).pathname === "/";
    } catch {
      isRoot = fetchResult.url.endsWith("/") || !fetchResult.url.includes("/", 9);
    }

    // 1. AI Crawler accessibility (Only checked on site root/homepage)
    if (isRoot && fetchResult.robotsTxt) {
      const aiCrawlers = [
        { name: "GPTBot", token: "GPTBot", company: "OpenAI" },
        { name: "ChatGPT-User", token: "ChatGPT-User", company: "OpenAI" },
        { name: "ClaudeBot", token: "ClaudeBot", company: "Anthropic" },
        { name: "PerplexityBot", token: "PerplexityBot", company: "Perplexity" },
        { name: "Google-Extended", token: "Google-Extended", company: "Google" },
        { name: "Bytespider", token: "Bytespider", company: "ByteDance" },
        { name: "CCBot", token: "CCBot", company: "Common Crawl" },
      ];

      const crawlerStatus: Record<string, string> = {};
      aiCrawlers.forEach((crawler) => {
        crawlerStatus[crawler.name] = isCrawlerBlocked(fetchResult.robotsTxt!, crawler.token)
          ? "blocked"
          : "allowed";
      });
      data.aiCrawlerStatus = crawlerStatus;

      const blockedCount = Object.values(crawlerStatus).filter((s) => s === "blocked").length;
      const crawlerDetails = aiCrawlers.map((c) => {
        const status = crawlerStatus[c.name];
        return `${status === "blocked" ? "✗" : "✓"} ${c.name} (${c.company}) — ${status}`;
      });

      if (blockedCount === aiCrawlers.length) {
        issues.push({
          id: "geo-all-ai-blocked",
          title: "All AI crawlers blocked",
          description: "All major AI crawlers are blocked in robots.txt.",
          severity: "high",
          recommendation:
            "Consider allowing at least some AI crawlers — being cited by AI systems drives brand awareness and referral traffic.",
          impact: "Blocking all AI crawlers means your content cannot be cited by ChatGPT, Claude, Perplexity, or Google AI Overviews, losing significant emerging traffic.",
          affectedItems: crawlerDetails,
        });
      } else if (blockedCount > 0) {
        issues.push({
          id: "geo-some-ai-blocked",
          title: "Some AI crawlers blocked",
          description: `${blockedCount} of ${aiCrawlers.length} AI crawlers are blocked.`,
          severity: "info",
          recommendation: "Review your AI crawler strategy — ensure intentional blocking aligns with your AI visibility goals.",
          affectedItems: crawlerDetails,
        });
      }
    }

    // 2. llms.txt check (Only checked on site root/homepage)
    if (isRoot) {
      data.hasLlmsTxt = !!fetchResult.llmsTxt;
      if (fetchResult.llmsTxt) {
        issues.push({
          id: "geo-has-llms-txt",
          title: "llms.txt file found",
          description: "Your site has an llms.txt file for AI system guidance.",
          severity: "info",
          recommendation: "Note: Google has confirmed llms.txt is not a ranking factor. Maintain it if useful for other AI systems.",
        });
      } else {
        // Suggest creating llms.txt
        issues.push({
          id: "geo-no-llms-txt",
          title: "No llms.txt file detected",
          description: "Your site does not have an llms.txt file. This file helps AI models understand your site's content structure.",
          severity: "low",
          recommendation: "Consider creating an llms.txt file to help AI systems better understand and cite your content.",
          codeSnippet: {
            language: "text",
            label: "Create an llms.txt file at your site root with this structure:",
            code: `# ${page.title || "Your Site Name"}\n\n> ${page.metaDescription || "Brief description of your site and what it offers."}\n\n## Key Pages\n\n- [Home](${page.url}): Main landing page\n- [About](/about): About the organization\n- [Blog](/blog): Latest articles and insights\n\n## Topics We Cover\n\n- Topic 1\n- Topic 2\n- Topic 3`,
          },
          learnMoreUrl: "https://llmstxt.org/",
        });
      }
    }

    // 3. Citability scoring
    const paragraphs = page.textContent.split(/\n+/).filter((p) => p.trim().length > 20);
    const wordCounts = paragraphs.map((p) => p.split(/\s+/).length);
    const optimalPassages = wordCounts.filter((w) => w >= 134 && w <= 167);
    data.totalParagraphs = paragraphs.length;
    data.optimalLengthPassages = optimalPassages.length;

    // Check for quotable sentences (facts, statistics, definitions)
    const factPatterns = [
      /\d+%/g,            // percentages
      /\$\d+/g,           // dollar amounts
      /\d{4}/g,           // years
      /according to/gi,   // citations
      /study|research|data|survey/gi, // research references
      /\bis\s+defined\s+as\b/gi, // definitions
      /\brefers?\s+to\b/gi, // definitions
    ];

    let factCount = 0;
    factPatterns.forEach((pattern) => {
      const matches = page.textContent.match(pattern);
      factCount += matches ? matches.length : 0;
    });
    data.factDensity = factCount;

    if (factCount < 3) {
      issues.push({
        id: "geo-low-facts",
        title: "Low fact density for AI citation",
        description: "Very few specific facts, statistics, or data points detected.",
        severity: "medium",
        recommendation: "Add specific statistics, data points, and cited facts to improve AI citability.",
        impact: "Content with 5+ statistics, data points, or cited facts is 2.3x more likely to be cited by AI assistants like ChatGPT and Claude.",
      });
    }

    // 4. Structural readability for AI
    const hasQuestionHeadings = page.headings.some((h) => h.text.includes("?"));
    const hasTables = page.textContent.includes("|") || page.schemaMarkup.some((s) => s.raw.includes("Table"));
    const hasLists = page.headings.length >= 3;
    data.questionHeadings = hasQuestionHeadings;
    data.hasTables = hasTables;
    data.hasLists = hasLists;

    if (!hasQuestionHeadings) {
      issues.push({
        id: "geo-no-question-headings",
        title: "No question-based headings",
        description: "No headings are phrased as questions.",
        severity: "low",
        recommendation: "Use question-based headings (e.g., 'What is X?', 'How does Y work?') to match AI query patterns.",
        impact: "Question-based headings directly match how users query AI assistants, making your content more likely to be surfaced as an answer.",
      });
    }

    // 5. Author/brand authority signals
    const authoritySignals = {
      hasAuthorByline: !!page.author,
      hasPublicationDate: !!page.publishedDate,
      hasLastModified: !!page.modifiedDate,
      hasCitations: page.links.filter((l) => !l.isInternal).length > 0,
      hasCredentials: /\b(ph\.?d|m\.?d|certified|licensed|expert)\b/i.test(page.textContent),
      hasOrganizationSchema: page.schemaMarkup.some((s) => s.type === "Organization"),
    };
    data.authoritySignals = authoritySignals;

    const authorityScore = Object.values(authoritySignals).filter(Boolean).length;

    const authorityDetails = [
      `${authoritySignals.hasAuthorByline ? "✓" : "✗"} Author byline`,
      `${authoritySignals.hasPublicationDate ? "✓" : "✗"} Publication date`,
      `${authoritySignals.hasLastModified ? "✓" : "✗"} Last modified date`,
      `${authoritySignals.hasCitations ? "✓" : "✗"} External citations`,
      `${authoritySignals.hasCredentials ? "✓" : "✗"} Author credentials`,
      `${authoritySignals.hasOrganizationSchema ? "✓" : "✗"} Organization schema`,
    ];

    if (authorityScore < 3) {
      issues.push({
        id: "geo-weak-authority",
        title: "Weak authority signals for AI citation",
        description: `Only ${authorityScore}/6 authority signals detected.`,
        severity: "medium",
        recommendation: "Strengthen authority signals: add author bylines, credentials, dates, and external citations.",
        impact: "AI models weigh source authority when deciding which content to cite. More authority signals = higher citation probability.",
        affectedItems: authorityDetails,
      });
    }

    // 6. Multi-modal content check
    const hasImages = page.images.length > 0;
    const hasVideo = page.links.some((l) =>
      /youtube|vimeo|wistia|loom/.test(l.href)
    ) || page.schemaMarkup.some((s) => s.type === "VideoObject");
    data.hasImages = hasImages;
    data.hasVideo = hasVideo;

    if (!hasImages && !hasVideo) {
      issues.push({
        id: "geo-no-multimedia",
        title: "No multi-modal content",
        description: "Pages with multi-modal content see 156% higher AI citation rates.",
        severity: "medium",
        recommendation: "Add relevant images, videos, or infographics to boost AI visibility.",
        impact: "Multi-modal content (text + images + video) gets cited 156% more by AI assistants vs text-only pages.",
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
      module: "geo",
      status: "completed",
      score,
      issues,
      data,
      executionTimeMs: Date.now() - startTime,
    };
  },
};
