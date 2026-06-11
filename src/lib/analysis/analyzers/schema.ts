import type { Analyzer, ModuleResult, Issue, ParsedPage, FetchResult } from "../types";

const ACTIVE_TYPES = [
  "Organization", "LocalBusiness", "SoftwareApplication", "WebApplication",
  "Product", "ProductGroup", "Offer", "Service", "Article", "BlogPosting",
  "NewsArticle", "Review", "AggregateRating", "BreadcrumbList", "WebSite",
  "WebPage", "Person", "ProfilePage", "ContactPage", "VideoObject",
  "ImageObject", "Event", "JobPosting", "Course", "DiscussionForumPosting",
  "BroadcastEvent", "Clip", "SeekToAction", "SoftwareSourceCode",
];

const DEPRECATED_TYPES: Record<string, string> = {
  HowTo: "Rich results removed September 2023",
  SpecialAnnouncement: "Deprecated July 31, 2025",
  ClaimReview: "Retired from rich results June 2025",
  VehicleListing: "Retired from rich results June 2025",
  Dataset: "Retired from rich results late 2025",
};

const RESTRICTED_TYPES: Record<string, string> = {
  FAQ: "Only for government and healthcare authority sites (restricted Aug 2023)",
};

export const schemaAnalyzer: Analyzer = {
  name: "schema",
  async analyze(page: ParsedPage, _fetchResult: FetchResult): Promise<ModuleResult> {
    const startTime = Date.now();
    const issues: Issue[] = [];
    const data: Record<string, unknown> = {};

    // 1. Schema presence
    data.schemaCount = page.schemaMarkup.length;
    data.schemas = page.schemaMarkup.map((s) => ({
      type: s.type,
      format: s.format,
      errors: s.errors,
    }));

    if (page.schemaMarkup.length === 0) {
      issues.push({
        id: "schema-none",
        title: "No structured data found",
        description: "No JSON-LD, Microdata, or RDFa markup detected.",
        severity: "high",
        recommendation: "Add JSON-LD structured data (Google's preferred format) relevant to your page type.",
      });
    }

    // 2. Format check
    const hasJsonLd = page.schemaMarkup.some((s) => s.format === "json-ld");
    const hasMicrodata = page.schemaMarkup.some((s) => s.format === "microdata");
    data.hasJsonLd = hasJsonLd;
    data.hasMicrodata = hasMicrodata;

    if (hasMicrodata && !hasJsonLd) {
      issues.push({
        id: "schema-no-jsonld",
        title: "Using Microdata instead of JSON-LD",
        description: "Microdata is detected but JSON-LD (Google's stated preference) is not.",
        severity: "medium",
        recommendation: "Migrate to JSON-LD format for structured data. It's easier to maintain and Google's preferred format.",
      });
    }

    // 3. Validate each schema
    page.schemaMarkup.forEach((schema, idx) => {
      // Check for deprecated types
      if (DEPRECATED_TYPES[schema.type]) {
        issues.push({
          id: `schema-deprecated-${idx}`,
          title: `Deprecated schema: ${schema.type}`,
          description: DEPRECATED_TYPES[schema.type],
          severity: "high",
          recommendation: `Remove ${schema.type} schema markup — it no longer generates rich results.`,
        });
      }

      // Check for restricted types
      if (RESTRICTED_TYPES[schema.type]) {
        issues.push({
          id: `schema-restricted-${idx}`,
          title: `Restricted schema: ${schema.type}`,
          description: RESTRICTED_TYPES[schema.type],
          severity: "medium",
          recommendation: `${schema.type} schema only generates rich results for specific site types.`,
        });
      }

      // Check for validation errors from parser
      schema.errors.forEach((error, errIdx) => {
        issues.push({
          id: `schema-error-${idx}-${errIdx}`,
          title: `Schema validation error`,
          description: error,
          severity: "high",
          recommendation: "Fix the structured data error to ensure proper rich result generation.",
          element: schema.type,
        });
      });
    });

    // 4. Missing opportunities
    const existingTypes = page.schemaMarkup.map((s) => s.type);
    const recommendations: { condition: boolean; type: string; reason: string }[] = [
      {
        condition: !existingTypes.includes("WebSite") && !existingTypes.includes("WebPage"),
        type: "WebSite",
        reason: "Every website should have WebSite schema with SearchAction for sitelinks search.",
      },
      {
        condition: !existingTypes.includes("BreadcrumbList") && page.links.some((l) => l.href.includes("/")),
        type: "BreadcrumbList",
        reason: "BreadcrumbList helps Google understand site hierarchy and shows breadcrumbs in SERPs.",
      },
      {
        condition: !existingTypes.includes("Organization") && !existingTypes.includes("LocalBusiness"),
        type: "Organization",
        reason: "Organization schema helps establish entity identity and knowledge panel eligibility.",
      },
    ];

    const missing = recommendations.filter((r) => r.condition);
    data.missingSchemaOpportunities = missing.map((m) => m.type);

    if (missing.length > 0) {
      issues.push({
        id: "schema-missing-opportunities",
        title: "Missing schema opportunities",
        description: `Consider adding: ${missing.map((m) => m.type).join(", ")}`,
        severity: "medium",
        recommendation: missing.map((m) => `${m.type}: ${m.reason}`).join("\n"),
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
      module: "schema",
      status: "completed",
      score,
      issues,
      data,
      executionTimeMs: Date.now() - startTime,
    };
  },
};
