import type { Analyzer, ModuleResult, Issue, ParsedPage, FetchResult } from "../types";
import { isCrawlerBlocked } from "../parser";

export const geoAnalyzer: Analyzer = {
  name: "geo",
  async analyze(page: ParsedPage, fetchResult: FetchResult): Promise<ModuleResult> {
    const startTime = Date.now();
    const issues: Issue[] = [];
    const data: Record<string, unknown> = {};

    // 1. AI Crawler accessibility
    if (fetchResult.robotsTxt) {
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
      if (blockedCount === aiCrawlers.length) {
        issues.push({
          id: "geo-all-ai-blocked",
          title: "All AI crawlers blocked",
          description: "All major AI crawlers are blocked in robots.txt.",
          severity: "high",
          recommendation:
            "Consider allowing at least some AI crawlers — being cited by AI systems drives brand awareness and referral traffic.",
        });
      } else if (blockedCount > 0) {
        issues.push({
          id: "geo-some-ai-blocked",
          title: "Some AI crawlers blocked",
          description: `${blockedCount} of ${aiCrawlers.length} AI crawlers are blocked.`,
          severity: "info",
          recommendation: "Review your AI crawler strategy — ensure intentional blocking aligns with your AI visibility goals.",
        });
      }
    }

    // 2. llms.txt check
    data.hasLlmsTxt = !!fetchResult.llmsTxt;
    if (fetchResult.llmsTxt) {
      issues.push({
        id: "geo-has-llms-txt",
        title: "llms.txt file found",
        description: "Your site has an llms.txt file for AI system guidance.",
        severity: "info",
        recommendation: "Note: Google has confirmed llms.txt is not a ranking factor. Maintain it if useful for other AI systems.",
      });
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
    if (authorityScore < 3) {
      issues.push({
        id: "geo-weak-authority",
        title: "Weak authority signals for AI citation",
        description: `Only ${authorityScore}/6 authority signals detected.`,
        severity: "medium",
        recommendation: "Strengthen authority signals: add author bylines, credentials, dates, and external citations.",
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
