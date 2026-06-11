import type { Analyzer, ModuleResult, Issue, ParsedPage, FetchResult } from "../types";

// Flesch Reading Ease calculation
function calculateFleschReadingEase(text: string): number {
  const sentences = text.split(/[.!?]+/).filter((s) => s.trim().length > 0);
  const words = text.split(/\s+/).filter((w) => w.length > 0);
  const syllables = words.reduce((count, word) => count + countSyllables(word), 0);

  if (sentences.length === 0 || words.length === 0) return 0;

  const avgSentenceLength = words.length / sentences.length;
  const avgSyllablesPerWord = syllables / words.length;

  return Math.round(206.835 - 1.015 * avgSentenceLength - 84.6 * avgSyllablesPerWord);
}

function countSyllables(word: string): number {
  word = word.toLowerCase().replace(/[^a-z]/g, "");
  if (word.length <= 3) return 1;
  word = word.replace(/(?:[^laeiouy]es|ed|[^laeiouy]e)$/, "");
  word = word.replace(/^y/, "");
  const matches = word.match(/[aeiouy]{1,2}/g);
  return matches ? matches.length : 1;
}

function detectPageType(page: ParsedPage): string {
  const url = page.url.toLowerCase();
  const title = page.title.toLowerCase();
  const text = page.textContent.toLowerCase();

  if (url === "/" || url.endsWith(".com") || url.endsWith(".com/"))
    return "homepage";
  if (url.includes("/blog") || url.includes("/post") || url.includes("/article"))
    return "blog";
  if (url.includes("/product") || url.includes("/shop") || url.includes("/item"))
    return "product";
  if (url.includes("/service") || title.includes("service"))
    return "service";
  if (url.includes("/about") || title.includes("about"))
    return "about";
  if (url.includes("/contact") || title.includes("contact"))
    return "contact";
  if (url.includes("/location") || url.includes("/store-locator"))
    return "location";
  if (text.length > 3000) return "blog";
  return "page";
}

const PAGE_TYPE_MINIMUMS: Record<string, number> = {
  homepage: 500,
  blog: 1500,
  product: 300,
  service: 800,
  location: 500,
  page: 500,
  about: 500,
  contact: 200,
};

export const contentAnalyzer: Analyzer = {
  name: "content",
  async analyze(page: ParsedPage, _fetchResult: FetchResult): Promise<ModuleResult> {
    const startTime = Date.now();
    
    // Bypass for sign in, sign up, login, register, and other auth-related pages
    const urlLower = page.url.toLowerCase();
    const titleLower = (page.title || "").toLowerCase();
    const isAuth = [
      "/signin", "/sign-in", "/signup", "/sign-up", 
      "/login", "/log-in", "/log_in", "/register", 
      "/registration", "/password", "/forgot-password", 
      "/reset-password", "/auth", "/logout", "/signout", "/sign-out"
    ].some(pattern => urlLower.includes(pattern)) ||
    [
      "sign in", "sign up", "log in", "login", 
      "register", "create account", "forgot password", 
      "reset password", "logout", "sign out"
    ].some(pattern => titleLower.includes(pattern));

    if (isAuth) {
      return {
        module: "content",
        status: "completed",
        score: 100,
        issues: [],
        data: { isAuthPage: true, message: "Content analysis not applicable for authentication pages." },
        executionTimeMs: Date.now() - startTime,
      };
    }

    const issues: Issue[] = [];
    const data: Record<string, unknown> = {};

    const pageType = detectPageType(page);
    data.pageType = pageType;

    // 1. Word count
    data.wordCount = page.wordCount;
    const minimum = PAGE_TYPE_MINIMUMS[pageType] || 500;
    data.wordCountMinimum = minimum;

    if (page.wordCount < minimum) {
      issues.push({
        id: "content-thin",
        title: "Thin content detected",
        description: `Page has ${page.wordCount} words. Minimum for ${pageType} pages: ${minimum}.`,
        severity: page.wordCount < minimum / 2 ? "high" : "medium",
        recommendation: `Add more substantive content to reach at least ${minimum} words for a ${pageType} page.`,
        value: `${page.wordCount} words`,
      });
    }

    // 2. Readability
    const readabilityScore = calculateFleschReadingEase(page.textContent);
    data.readabilityScore = readabilityScore;

    if (readabilityScore < 30) {
      issues.push({
        id: "content-hard-read",
        title: "Content is very difficult to read",
        description: `Flesch Reading Ease: ${readabilityScore} (target: 60-70 for general audience).`,
        severity: "medium",
        recommendation: "Simplify sentences, use shorter words, and break up complex paragraphs.",
        value: `Score: ${readabilityScore}/100`,
      });
    } else if (readabilityScore < 50) {
      issues.push({
        id: "content-moderate-read",
        title: "Content readability could improve",
        description: `Flesch Reading Ease: ${readabilityScore} (target: 60-70 for general audience).`,
        severity: "low",
        recommendation: "Consider simplifying some sentences for broader accessibility.",
        value: `Score: ${readabilityScore}/100`,
      });
    }

    // 3. Content structure
    const h2Count = page.headings.filter((h) => h.level === 2).length;
    const h3Count = page.headings.filter((h) => h.level === 3).length;
    data.h2Count = h2Count;
    data.h3Count = h3Count;

    if (page.wordCount > 500 && h2Count < 2) {
      issues.push({
        id: "content-few-headings",
        title: "Insufficient content structure",
        description: `Only ${h2Count} H2 headings for ${page.wordCount} words.`,
        severity: "medium",
        recommendation: "Add more H2 headings to break content into scannable sections.",
      });
    }

    // 4. E-E-A-T signals
    const eatSignals = {
      hasAuthor: !!page.author || page.textContent.toLowerCase().includes("author"),
      hasDate: !!page.publishedDate || !!page.modifiedDate,
      hasCredentials: /\b(ph\.?d|m\.?d|certified|licensed|expert|specialist|years? of experience)\b/i.test(page.textContent),
      hasExternalCitations: page.links.filter((l) => !l.isInternal).length > 0,
      hasAboutPage: page.links.some((l) => l.href.includes("/about")),
      hasContactInfo: /\b(email|phone|address|contact us|@)\b/i.test(page.textContent),
    };
    data.eatSignals = eatSignals;

    const eatScore = Object.values(eatSignals).filter(Boolean).length;
    data.eatScore = eatScore;

    if (eatScore < 2) {
      issues.push({
        id: "content-weak-eat",
        title: "Weak E-E-A-T signals",
        description: `Only ${eatScore}/6 E-E-A-T signals detected.`,
        severity: "high",
        recommendation: "Add author information, credentials, dates, and citations to demonstrate expertise and trustworthiness.",
      });
    } else if (eatScore < 4) {
      issues.push({
        id: "content-moderate-eat",
        title: "E-E-A-T signals could improve",
        description: `${eatScore}/6 E-E-A-T signals detected.`,
        severity: "medium",
        recommendation: "Strengthen E-E-A-T by adding more author credentials, first-hand experience markers, and authoritative citations.",
      });
    }

    // 5. Internal link density
    const internalLinks = page.links.filter((l) => l.isInternal);
    const linksPerThousand = page.wordCount > 0 ? (internalLinks.length / page.wordCount) * 1000 : 0;
    data.internalLinkDensity = Math.round(linksPerThousand * 10) / 10;

    if (page.wordCount > 500 && linksPerThousand < 3) {
      issues.push({
        id: "content-low-interlinking",
        title: "Low internal linking density",
        description: `${Math.round(linksPerThousand * 10) / 10} internal links per 1000 words (target: 3-5).`,
        severity: "medium",
        recommendation: "Add more relevant internal links to distribute link equity and help navigation.",
      });
    }

    // 6. Date freshness
    data.publishedDate = page.publishedDate;
    data.modifiedDate = page.modifiedDate;

    if (!page.publishedDate && !page.modifiedDate) {
      issues.push({
        id: "content-no-dates",
        title: "No publication or modification dates",
        description: "No date stamps found on the page.",
        severity: "medium",
        recommendation: "Add publication and last-modified dates for content freshness signals.",
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
      module: "content",
      status: "completed",
      score,
      issues,
      data,
      executionTimeMs: Date.now() - startTime,
    };
  },
};
