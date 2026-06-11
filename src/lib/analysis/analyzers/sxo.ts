import type { Analyzer, ModuleResult, Issue, ParsedPage, FetchResult } from "../types";

function classifyPageType(page: ParsedPage): string {
  const url = page.url.toLowerCase();
  const text = page.textContent.toLowerCase();
  const hasProducts = page.schemaMarkup.some((s) => ["Product", "Offer"].includes(s.type));
  const hasPricing = /(\$|€|£|price|buy|cart|add to cart)/i.test(text);

  if (hasProducts || hasPricing) return "product";
  if (url.includes("/blog") || url.includes("/article") || url.includes("/post")) return "blog";
  if (url.includes("/service")) return "service";
  if (url.includes("/compare") || url.includes("/vs") || url.includes("comparison")) return "comparison";
  if (url.includes("/how-to") || url.includes("/guide") || url.includes("/tutorial")) return "how-to";
  if (url.includes("/tool") || url.includes("/calculator")) return "tool";
  if (url === "/" || url.endsWith(".com/")) return "homepage";
  return "general";
}

export const sxoAnalyzer: Analyzer = {
  name: "sxo",
  async analyze(page: ParsedPage, fetchResult: FetchResult): Promise<ModuleResult> {
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
        module: "sxo",
        status: "completed",
        score: 100,
        issues: [],
        data: { isAuthPage: true, message: "Search Experience Optimization (SXO) not applicable for authentication pages." },
        executionTimeMs: Date.now() - startTime,
      };
    }

    const issues: Issue[] = [];
    const data: Record<string, unknown> = {};

    const pageType = classifyPageType(page);
    data.pageType = pageType;

    // 1. CTA Analysis
    const ctaPatterns = /\b(buy|order|sign up|subscribe|get started|try free|download|contact|request|book|schedule|learn more|see demo|start|register)\b/gi;
    const ctaMatches = page.textContent.match(ctaPatterns) || [];
    const ctaLinks = page.links.filter((l) =>
      ctaPatterns.test(l.text)
    );
    data.ctaCount = ctaMatches.length;
    data.ctaLinks = ctaLinks.length;

    if (ctaMatches.length === 0) {
      issues.push({
        id: "sxo-no-cta",
        title: "No clear call-to-action",
        description: "No CTA elements detected on the page.",
        severity: "high",
        recommendation: "Add clear calls-to-action that guide users toward conversion goals.",
      });
    }

    // 2. Trust signals
    const trustSignals = {
      hasContactInfo: /\b(phone|email|address|contact|call us)\b/i.test(page.textContent),
      hasPrivacyPolicy: page.links.some((l) => /privacy/i.test(l.href) || /privacy/i.test(l.text)),
      hasTerms: page.links.some((l) => /terms|tos/i.test(l.href) || /terms/i.test(l.text)),
      hasTestimonials: /\b(testimonial|review|rating|customer says|what .* say)\b/i.test(page.textContent),
      hasSecureBadge: page.images.some((img) => /secure|trust|verified|ssl|badge/i.test(img.alt + img.src)),
      hasSocialProof: /\b(\d+[k+]?\s*(customers|users|clients|reviews|ratings|downloads))\b/i.test(page.textContent),
    };
    data.trustSignals = trustSignals;

    const trustScore = Object.values(trustSignals).filter(Boolean).length;
    data.trustScore = trustScore;

    if (trustScore < 2) {
      issues.push({
        id: "sxo-low-trust",
        title: "Low trust signals",
        description: `Only ${trustScore}/6 trust signals detected.`,
        severity: "high",
        recommendation: "Add trust signals: contact info, privacy policy, testimonials, social proof.",
      });
    } else if (trustScore < 4) {
      issues.push({
        id: "sxo-moderate-trust",
        title: "Trust signals could improve",
        description: `${trustScore}/6 trust signals detected.`,
        severity: "medium",
        recommendation: "Add more trust signals to increase user confidence and conversion rates.",
      });
    }

    // 3. Above-fold content assessment
    const firstH1 = page.headings.find((h) => h.level === 1);
    data.hasH1AboveFold = !!firstH1;

    if (!firstH1) {
      issues.push({
        id: "sxo-no-h1-above-fold",
        title: "No H1 in above-fold content",
        description: "Primary heading should be visible without scrolling.",
        severity: "medium",
        recommendation: "Ensure the H1 tag appears in the above-fold area of the page.",
      });
    }

    // 4. Media richness
    const mediaScore = {
      images: Math.min(page.images.length, 5),
      hasVideo: page.links.some((l) => /youtube|vimeo|wistia/.test(l.href)) ? 2 : 0,
      hasSchema: page.schemaMarkup.length > 0 ? 1 : 0,
    };
    const totalMediaScore = Object.values(mediaScore).reduce((a, b) => a + b, 0);
    data.mediaRichness = mediaScore;

    if (totalMediaScore < 2) {
      issues.push({
        id: "sxo-low-media",
        title: "Low media richness",
        description: "Page lacks visual content variety.",
        severity: "medium",
        recommendation: "Add diverse media: images, videos, infographics, or interactive elements.",
      });
    }

    // 5. Mobile UX signals
    const hasViewport = !!page.viewport;
    const hasMobileClasses = page.textContent.includes("responsive") ||
      page.stylesheets.some((s) => s.media.includes("max-width"));
    data.mobileUx = { hasViewport, hasMobileClasses };

    // 6. Page load and UX indicators
    const renderBlockingScripts = page.scripts.filter(
      (s) => !s.isAsync && !s.isDefer && !s.isModule && s.src
    );
    data.renderBlockingScripts = renderBlockingScripts.length;

    if (renderBlockingScripts.length > 3) {
      issues.push({
        id: "sxo-render-blocking",
        title: "Too many render-blocking scripts",
        description: `${renderBlockingScripts.length} scripts may block page rendering.`,
        severity: "medium",
        recommendation: "Add async or defer attributes to non-critical scripts.",
      });
    }

    // 7. Navigation clarity
    const navLinks = page.links.filter((l) => l.isInternal);
    const hasNavigation = navLinks.length >= 3;
    data.hasNavigation = hasNavigation;

    if (!hasNavigation) {
      issues.push({
        id: "sxo-poor-navigation",
        title: "Limited navigation detected",
        description: "Very few internal navigation links found.",
        severity: "medium",
        recommendation: "Ensure clear site navigation for better user experience and crawlability.",
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
      module: "sxo",
      status: "completed",
      score,
      issues,
      data,
      executionTimeMs: Date.now() - startTime,
    };
  },
};
