import type { Analyzer, ModuleResult, Issue, ParsedPage } from "../types";


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

function detectPageTypeForSchema(page: ParsedPage): string {
  const url = page.url.toLowerCase();
  const text = page.textContent.toLowerCase();

  if (url === "/" || url.endsWith(".com") || url.endsWith(".com/")) return "homepage";
  if (url.includes("/blog") || url.includes("/article") || url.includes("/post")) return "article";
  if (url.includes("/product") || url.includes("/shop")) return "product";
  if (url.includes("/service")) return "service";
  if (url.includes("/about")) return "about";
  if (url.includes("/contact")) return "contact";
  if (text.length > 3000) return "article";
  return "page";
}

function getSchemaTemplate(pageType: string, page: ParsedPage): string {
  const templates: Record<string, string> = {
    homepage: `<script type="application/ld+json">
{
  "@context": "https://schema.org",
  "@type": "WebSite",
  "name": "${page.title || "Your Site Name"}",
  "url": "${page.url}",
  "potentialAction": {
    "@type": "SearchAction",
    "target": "${page.url}search?q={search_term_string}",
    "query-input": "required name=search_term_string"
  }
}
</script>`,
    article: `<script type="application/ld+json">
{
  "@context": "https://schema.org",
  "@type": "Article",
  "headline": "${page.title || "Article Headline"}",
  "author": {
    "@type": "Person",
    "name": "${page.author || "Author Name"}"
  },
  "datePublished": "${page.publishedDate || new Date().toISOString().split("T")[0]}",
  "dateModified": "${page.modifiedDate || new Date().toISOString().split("T")[0]}",
  "image": "https://yourdomain.com/images/article-image.jpg",
  "publisher": {
    "@type": "Organization",
    "name": "Your Organization"
  }
}
</script>`,
    product: `<script type="application/ld+json">
{
  "@context": "https://schema.org",
  "@type": "Product",
  "name": "${page.title || "Product Name"}",
  "description": "${page.metaDescription || "Product description"}",
  "image": "https://yourdomain.com/images/product.jpg",
  "offers": {
    "@type": "Offer",
    "price": "0.00",
    "priceCurrency": "USD",
    "availability": "https://schema.org/InStock"
  }
}
</script>`,
  };

  return templates[pageType] || templates.homepage;
}

export const schemaAnalyzer: Analyzer = {
  name: "schema",
  async analyze(page: ParsedPage): Promise<ModuleResult> {
    const startTime = Date.now();
    const issues: Issue[] = [];
    const data: Record<string, unknown> = {};

    const pageType = detectPageTypeForSchema(page);

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
        impact: "Structured data enables rich results (stars, images, FAQs) in search, increasing CTR by 20-30%.",
        codeSnippet: {
          language: "html",
          label: `Add this ${pageType} schema as JSON-LD inside your <head> or before </body>:`,
          code: getSchemaTemplate(pageType, page),
        },
        learnMoreUrl: "https://developers.google.com/search/docs/appearance/structured-data/intro-structured-data",
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
        impact: "JSON-LD is decoupled from HTML, making it easier to maintain and less prone to breaking when page layout changes.",
        learnMoreUrl: "https://developers.google.com/search/docs/appearance/structured-data/intro-structured-data#json-ld",
      });
    }

    // 3. Validate each schema
    page.schemaMarkup.forEach((schema, idx) => {
      // Check for deprecated types
      if (DEPRECATED_TYPES[schema.type]) {
        issues.push({
          id: `schema-deprecated-${idx}`,
          title: `Schema deprecated for Google Rich Results: ${schema.type}`,
          description: `${DEPRECATED_TYPES[schema.type]}. Although it no longer generates visual rich results in Google, it remains a valid schema format useful for general semantic parsing and AI search crawlers.`,
          severity: "low",
          recommendation: `Decide whether to keep or remove ${schema.type}. While it won't display visual rich results on Google, keeping it helps AI models (like ChatGPT, Gemini, and Claude) accurately understand your step-by-step or structured content.`,
        });
      }

      // Check for restricted types
      if (RESTRICTED_TYPES[schema.type]) {
        issues.push({
          id: `schema-restricted-${idx}`,
          title: `Restricted Google Rich Result: ${schema.type}`,
          description: `${RESTRICTED_TYPES[schema.type]}. Note that it remains valid structured data parsed by search engines and AI crawlers.`,
          severity: "low",
          recommendation: `${schema.type} schema only generates visual rich results for specific site types. Keep it if it helps semantic understanding for AI crawlers, or remove if you want to minimize page payload.`,
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
          impact: "Invalid structured data is ignored by Google, wasting the effort of adding it and missing rich result opportunities.",
          learnMoreUrl: "https://search.google.com/test/rich-results",
        });
      });
    });

    // 4. Missing opportunities
    const existingTypes = page.schemaMarkup.map((s) => s.type);
    const recommendations: { condition: boolean; type: string; reason: string; snippet: string }[] = [
      {
        condition: !existingTypes.includes("WebSite") && !existingTypes.includes("WebPage"),
        type: "WebSite",
        reason: "Every website should have WebSite schema with SearchAction for sitelinks search.",
        snippet: `{\n  "@context": "https://schema.org",\n  "@type": "WebSite",\n  "name": "${page.title || "Site Name"}",\n  "url": "${page.url}"\n}`,
      },
      {
        condition: !existingTypes.includes("BreadcrumbList") && page.links.some((l) => l.href.includes("/")),
        type: "BreadcrumbList",
        reason: "BreadcrumbList helps Google understand site hierarchy and shows breadcrumbs in SERPs.",
        snippet: `{\n  "@context": "https://schema.org",\n  "@type": "BreadcrumbList",\n  "itemListElement": [\n    { "@type": "ListItem", "position": 1, "name": "Home", "item": "${page.url}" }\n  ]\n}`,
      },
      {
        condition: !existingTypes.includes("Organization") && !existingTypes.includes("LocalBusiness"),
        type: "Organization",
        reason: "Organization schema helps establish entity identity and knowledge panel eligibility.",
        snippet: `{\n  "@context": "https://schema.org",\n  "@type": "Organization",\n  "name": "Your Organization",\n  "url": "${page.url}",\n  "logo": "https://yourdomain.com/logo.png"\n}`,
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
        affectedItems: missing.map((m) => `${m.type} — ${m.reason}`),
        codeSnippet: {
          language: "json",
          label: `Add ${missing[0].type} schema (highest priority):`,
          code: missing[0].snippet,
        },
        learnMoreUrl: "https://developers.google.com/search/docs/appearance/structured-data/search-gallery",
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
