import type { ModuleResult, FetchResult, ParsedPage, AnalysisResult } from "./types";
import { fetchPage, fetchSubpage } from "./fetcher";
import { parsePage } from "./parser";
import { technicalAnalyzer } from "./analyzers/technical";
import { onpageAnalyzer } from "./analyzers/onpage";
import { contentAnalyzer } from "./analyzers/content";
import { schemaAnalyzer } from "./analyzers/schema";
import { imagesAnalyzer } from "./analyzers/images";
import { sitemapAnalyzer } from "./analyzers/sitemap";
import { geoAnalyzer } from "./analyzers/geo";
import { sxoAnalyzer } from "./analyzers/sxo";
import { performanceAnalyzer } from "./analyzers/performance";
import { securityAnalyzer } from "./analyzers/security";
import { linksAnalyzer } from "./analyzers/links";
import { accessibilityAnalyzer } from "./analyzers/accessibility";
import { internationalAnalyzer } from "./analyzers/international";
import { mobileAnalyzer } from "./analyzers/mobile";

const ALL_ANALYZERS = [
  technicalAnalyzer,
  onpageAnalyzer,
  contentAnalyzer,
  schemaAnalyzer,
  imagesAnalyzer,
  sitemapAnalyzer,
  geoAnalyzer,
  sxoAnalyzer,
  performanceAnalyzer,
  securityAnalyzer,
  linksAnalyzer,
  accessibilityAnalyzer,
  internationalAnalyzer,
  mobileAnalyzer,
];

// Simple average scoring for overall SEO health
export function calculateOverallScore(modules: { module: string; status: string; score: number }[]): number {
  const completedModules = modules.filter((m) => m.status === "completed");
  if (completedModules.length === 0) return 0;

  const sum = completedModules.reduce((acc, m) => acc + m.score, 0);
  return Math.round(sum / completedModules.length);
}


// Discover all unique page URLs on the site using the homepage links and sitemap.xml
function discoverAllPages(homepageUrl: string, parsedHomepage: ParsedPage, sitemapXml?: string): string[] {
  const normalizedHomepage = new URL(homepageUrl).toString();
  const origin = new URL(homepageUrl).origin;
  const urls = new Set<string>();
  urls.add(normalizedHomepage);

  // 1. Add links from parsed homepage
  for (const link of parsedHomepage.links) {
    if (!link.isInternal || !link.href) continue;
    try {
      const resolved = new URL(link.href, normalizedHomepage);
      resolved.hash = "";
      resolved.search = "";
      let path = resolved.pathname;
      if (path.length > 1 && path.endsWith("/")) {
        path = path.slice(0, -1);
      }
      resolved.pathname = path;
      const cleanUrl = resolved.toString();
      if (resolved.origin === origin) {
        if (!/\.(png|jpe?g|gif|svg|pdf|zip|xml|txt|css|js|woff2?|json|ico)$/i.test(resolved.pathname)) {
          urls.add(cleanUrl);
        }
      }
    } catch {}
  }

  // 2. Add URLs from sitemap if available
  if (sitemapXml) {
    const matches = sitemapXml.match(/<loc>([^<]+)<\/loc>/gi);
    if (matches) {
      for (const match of matches) {
        try {
          const rawUrl = match.replace(/<\/?loc>/gi, "").trim();
          const resolved = new URL(rawUrl, normalizedHomepage);
          resolved.hash = "";
          resolved.search = "";
          let path = resolved.pathname;
          if (path.length > 1 && path.endsWith("/")) {
            path = path.slice(0, -1);
          }
          resolved.pathname = path;
          const cleanUrl = resolved.toString();
          if (resolved.origin === origin) {
            if (!/\.(png|jpe?g|gif|svg|pdf|zip|xml|txt|css|js|woff2?|json|ico)$/i.test(resolved.pathname)) {
              urls.add(cleanUrl);
            }
          }
        } catch {}
      }
    }
  }

  return Array.from(urls);
}

export async function runAnalysis(
  url: string,
  options?: {
    userCoins?: number;
    previouslyScannedPages?: string[];
    previousModules?: ModuleResult[];
    onModuleComplete?: (moduleResult: ModuleResult) => Promise<void>;
  }
): Promise<AnalysisResult & { pendingPages?: string[]; discoveredPages?: string[]; crawledInThisRun?: string[] }> {
  const startedAt = new Date().toISOString();
  const id = crypto.randomUUID();

  try {
    // Step 1: Fetch and parse the home page
    const homepageFetch: FetchResult = await fetchPage(url);
    const homepageParsed: ParsedPage = parsePage(homepageFetch.html, homepageFetch.finalUrl);
    const homepageUrl = new URL(homepageFetch.finalUrl).toString();

    // Step 2: Discover internal pages
    const discovered = discoverAllPages(homepageFetch.finalUrl, homepageParsed, homepageFetch.sitemapXml);

    const previouslyScanned = options?.previouslyScannedPages || [];
    const userCoins = options?.userCoins ?? 200.0;

    // Filter discovered pages to find the actual list of pending pages
    const currentPending = discovered.filter((p) => !previouslyScanned.includes(p));

    let crawledInThisRun: string[] = [];
    let nextPending: string[] = [];
    let nextScanned: string[] = [];

    const isHomepageScanned = previouslyScanned.includes(homepageUrl);
    const homepageCost = isHomepageScanned ? 0.2 : 1.0;

    if (currentPending.length > 0) {
      // Prioritize pending pages
      const remainingCoins = userCoins - homepageCost;
      const allowedPendingCount = Math.max(0, Math.floor(remainingCoins));
      
      const pendingSubpages = currentPending.filter((p) => p !== homepageUrl);
      const subpagesToCrawl = pendingSubpages.slice(0, allowedPendingCount);

      crawledInThisRun = [homepageUrl, ...subpagesToCrawl];
      nextPending = currentPending.filter((p) => !crawledInThisRun.includes(p));
      nextScanned = Array.from(new Set([...previouslyScanned, ...crawledInThisRun]));
    } else {
      // Full refresh mode
      const maxRefresh = Math.max(1, Math.floor(userCoins / 0.2));
      const pagesToCrawl = discovered.slice(0, maxRefresh);
      const subpagesToCrawl = pagesToCrawl.filter((p) => p !== homepageUrl);

      crawledInThisRun = [homepageUrl, ...subpagesToCrawl];
      nextPending = [];
      nextScanned = discovered;
    }

    // Step 3: Fetch and parse subpages in parallel
    const subpagesFetchAndParse = await Promise.all(
      crawledInThisRun.slice(1).map(async (subpageUrl) => {
        try {
          const fetchResult = await fetchSubpage(subpageUrl);
          const parsedPage = parsePage(fetchResult.html, fetchResult.finalUrl);
          return { url: subpageUrl, fetchResult, parsedPage, success: true };
        } catch (err) {
          console.error(`Failed to crawl subpage ${subpageUrl}:`, err);
          return { url: subpageUrl, fetchResult: null, parsedPage: null, success: false };
        }
      })
    );

    // Combine all successfully parsed pages
    const allPages = [
      { url: homepageUrl, fetchResult: homepageFetch, parsedPage: homepageParsed },
      ...subpagesFetchAndParse
        .filter((p) => p.success)
        .map((p) => ({ url: p.url, fetchResult: p.fetchResult!, parsedPage: p.parsedPage! })),
    ];

    // Step 4: Run all analyzers across crawled pages and merge with previous results if necessary
    const modules: ModuleResult[] = await Promise.all(
      ALL_ANALYZERS.map(async (analyzer) => {
        const isSiteWide = analyzer.name === "sitemap";

        if (isSiteWide) {
          try {
            const run = await analyzer.analyze(homepageParsed, homepageFetch);
            // Label sitemap issues with homepage URL
            const issuesWithUrl = (run.issues || []).map((issue) => ({
              ...issue,
              url: homepageUrl,
            }));
            const res = {
              ...run,
              issues: issuesWithUrl,
            };
            if (options?.onModuleComplete) {
              await options.onModuleComplete(res);
            }
            return res;
          } catch (err) {
            console.error(`Site-wide analyzer ${analyzer.name} failed:`, err);
            const res = {
              module: analyzer.name,
              status: "failed" as const,
              score: 0,
              issues: [],
              data: { error: err instanceof Error ? err.message : "Unknown error" },
              executionTimeMs: 0,
            };
            if (options?.onModuleComplete) {
              await options.onModuleComplete(res);
            }
            return res;
          }
        } else {
          // Page-specific analyzer: execute on all pages crawled in this run
          const startTime = Date.now();
          const pageRuns = await Promise.all(
            allPages.map(async (page) => {
              try {
                const run = await analyzer.analyze(page.parsedPage, page.fetchResult);
                return {
                  ...run,
                  url: page.url,
                  success: true,
                };
              } catch (err) {
                console.error(`Page-specific analyzer ${analyzer.name} failed on ${page.url}:`, err);
                return {
                  module: analyzer.name,
                  status: "failed" as const,
                  score: 0,
                  issues: [],
                  data: {},
                  executionTimeMs: 0,
                  url: page.url,
                  success: false,
                };
              }
            })
          );

          const successfulRuns = pageRuns.filter((r) => r.success);
          if (successfulRuns.length === 0) {
            const res = {
              module: analyzer.name,
              status: "failed" as const,
              score: 0,
              issues: [],
              data: { error: "Failed to execute analyzer on all pages" },
              executionTimeMs: Date.now() - startTime,
            };
            if (options?.onModuleComplete) {
              await options.onModuleComplete(res);
            }
            return res;
          }

          // Average score of pages crawled in this run
          const runScore = Math.round(
            successfulRuns.reduce((sum, r) => sum + r.score, 0) / successfulRuns.length
          );

          // Combined issues for crawled pages in this run
          const runIssues = successfulRuns.flatMap((run) =>
            (run.issues || []).map((issue) => ({
              ...issue,
              url: run.url,
            }))
          );

          // Aggregate statistics data for crawled pages in this run
          const aggregatedData: Record<string, any> = {};
          successfulRuns.forEach((run) => {
            if (!run.data) return;
            Object.entries(run.data).forEach(([key, val]) => {
              if (typeof val === "number") {
                aggregatedData[key] = (aggregatedData[key] || 0) + val;
              } else if (typeof val === "boolean") {
                aggregatedData[key] = aggregatedData[key] || val;
              } else if (Array.isArray(val)) {
                aggregatedData[key] = [...(aggregatedData[key] || []), ...val];
              } else {
                aggregatedData[key] = val;
              }
            });
          });

          // Average out stats for this run
          Object.keys(aggregatedData).forEach((key) => {
            const shouldAverage = /time|ms|duration|score|density|fre|ratio/i.test(key);
            if (shouldAverage && typeof aggregatedData[key] === "number") {
              aggregatedData[key] = Math.round(aggregatedData[key] / successfulRuns.length);
            }
          });

          // --- Merge with previously scanned, uncrawled pages ---
          const previousModule = options?.previousModules?.find((m) => m.module === analyzer.name);
          const uncrawledPages = previouslyScanned.filter((p) => !crawledInThisRun.includes(p));

          const prevUncrawledIssues = (previousModule?.issues || [])
            .map((issue) => ({ ...issue, url: issue.url || homepageUrl }))
            .filter((issue) => uncrawledPages.includes(issue.url!));

          const combinedIssues = [...runIssues, ...prevUncrawledIssues];

          const totalAudited = crawledInThisRun.length + uncrawledPages.length;
          const combinedScore = totalAudited > 0
            ? Math.round(
                (runScore * crawledInThisRun.length +
                  (previousModule?.score || 0) * uncrawledPages.length) /
                  totalAudited
              )
            : runScore;

          const nextAggregatedData: Record<string, any> = {
            scannedPages: nextScanned,
            pendingPages: nextPending,
            discoveredPages: discovered,
          };

          const allDataKeys = new Set([
            ...Object.keys(aggregatedData),
            ...Object.keys(previousModule?.data || {}),
          ]);

          for (const key of allDataKeys) {
            if (key === "scannedPages" || key === "pendingPages" || key === "discoveredPages") continue;

            const newVal = aggregatedData[key];
            const prevVal = previousModule?.data?.[key];

            const hasNew = newVal !== undefined;
            const hasPrev = prevVal !== undefined;

            if (hasNew && hasPrev) {
              if (typeof newVal === "number" && typeof prevVal === "number") {
                const shouldAverage = /time|ms|duration|score|density|fre|ratio/i.test(key);
                if (shouldAverage) {
                  nextAggregatedData[key] = Math.round(
                    (newVal * crawledInThisRun.length + prevVal * uncrawledPages.length) /
                      totalAudited
                  );
                } else {
                  const prevScale = previouslyScanned.length > 0 
                    ? (uncrawledPages.length / previouslyScanned.length) 
                    : 0;
                  nextAggregatedData[key] = newVal + Math.round(prevVal * prevScale);
                }
              } else if (Array.isArray(newVal) && Array.isArray(prevVal)) {
                nextAggregatedData[key] = Array.from(new Set([...newVal, ...prevVal]));
              } else {
                nextAggregatedData[key] = newVal;
              }
            } else if (hasNew) {
              nextAggregatedData[key] = newVal;
            } else if (hasPrev) {
              nextAggregatedData[key] = prevVal;
            }
          }

          const res = {
            module: analyzer.name,
            status: "completed" as const,
            score: combinedScore,
            issues: combinedIssues,
            data: nextAggregatedData,
            executionTimeMs: Date.now() - startTime,
          };
          if (options?.onModuleComplete) {
            await options.onModuleComplete(res);
          }
          return res;
        }
      })
    );

    // Step 5: Calculate overall score
    const overallScore = calculateOverallScore(modules);

    return {
      id,
      url,
      status: "completed",
      overallScore,
      modules,
      startedAt,
      completedAt: new Date().toISOString(),
      pendingPages: nextPending,
      discoveredPages: discovered,
      crawledInThisRun,
    };
  } catch {
    return {
      id,
      url,
      status: "failed",
      overallScore: 0,
      modules: [],
      startedAt,
      completedAt: new Date().toISOString(),
      pendingPages: [],
      discoveredPages: [],
      crawledInThisRun: [],
    };
  }
}

export async function runSingleModuleAnalysis(
  url: string,
  moduleName: string,
  options?: {
    previouslyScannedPages?: string[];
  }
): Promise<ModuleResult & { crawledInThisRun: string[] }> {
  // Step 1: Fetch and parse the home page
  const homepageFetch: FetchResult = await fetchPage(url);
  const homepageParsed: ParsedPage = parsePage(homepageFetch.html, homepageFetch.finalUrl);
  const homepageUrl = new URL(homepageFetch.finalUrl).toString();

  // Step 2: Determine pages to crawl (up to 5 pages)
  let crawledInThisRun: string[] = [];
  if (options?.previouslyScannedPages && options.previouslyScannedPages.length > 0) {
    crawledInThisRun = options.previouslyScannedPages;
  } else {
    const discovered = discoverAllPages(homepageFetch.finalUrl, homepageParsed, homepageFetch.sitemapXml);
    crawledInThisRun = discovered.slice(0, 5);
  }

  // Step 3: Fetch subpages in parallel (excluding homepage)
  const subpagesFetchAndParse = await Promise.all(
    crawledInThisRun.filter(p => p !== homepageUrl).map(async (subpageUrl) => {
      try {
        const fetchResult = await fetchSubpage(subpageUrl);
        const parsedPage = parsePage(fetchResult.html, fetchResult.finalUrl);
        return { url: subpageUrl, fetchResult, parsedPage, success: true };
      } catch (err) {
        console.error(`Failed to crawl subpage ${subpageUrl}:`, err);
        return { url: subpageUrl, fetchResult: null, parsedPage: null, success: false };
      }
    })
  );

  const allPages = [
    { url: homepageUrl, fetchResult: homepageFetch, parsedPage: homepageParsed },
    ...subpagesFetchAndParse
      .filter((p) => p.success)
      .map((p) => ({ url: p.url, fetchResult: p.fetchResult!, parsedPage: p.parsedPage! })),
  ];

  // Step 4: Find analyzer
  const analyzer = ALL_ANALYZERS.find((a) => a.name === moduleName);
  if (!analyzer) {
    throw new Error(`Analyzer not found for module ${moduleName}`);
  }

  const isSiteWide = analyzer.name === "sitemap";
  if (isSiteWide) {
    const startTime = Date.now();
    const run = await analyzer.analyze(homepageParsed, homepageFetch);
    const issuesWithUrl = (run.issues || []).map((issue) => ({
      ...issue,
      url: homepageUrl,
    }));
    return {
      module: analyzer.name,
      status: "completed" as const,
      score: run.score,
      issues: issuesWithUrl,
      data: run.data,
      executionTimeMs: Date.now() - startTime,
      crawledInThisRun: [homepageUrl],
    };
  } else {
    const startTime = Date.now();
    const pageRuns = await Promise.all(
      allPages.map(async (page) => {
        try {
          const run = await analyzer.analyze(page.parsedPage, page.fetchResult);
          return {
            ...run,
            url: page.url,
            success: true,
          };
        } catch (err) {
          console.error(`Page-specific analyzer ${analyzer.name} failed on ${page.url}:`, err);
          return {
            module: analyzer.name,
            status: "failed" as const,
            score: 0,
            issues: [],
            data: {},
            executionTimeMs: 0,
            url: page.url,
            success: false,
          };
        }
      })
    );

    const successfulRuns = pageRuns.filter((r) => r.success);
    if (successfulRuns.length === 0) {
      throw new Error(`Failed to execute analyzer on all pages`);
    }

    const runScore = Math.round(
      successfulRuns.reduce((sum, r) => sum + r.score, 0) / successfulRuns.length
    );

    const runIssues = successfulRuns.flatMap((run) =>
      (run.issues || []).map((issue) => ({
        ...issue,
        url: run.url,
      }))
    );

    const aggregatedData: Record<string, any> = {};
    successfulRuns.forEach((run) => {
      if (!run.data) return;
      Object.entries(run.data).forEach(([key, val]) => {
        if (typeof val === "number") {
          aggregatedData[key] = (aggregatedData[key] || 0) + val;
        } else if (typeof val === "boolean") {
          aggregatedData[key] = aggregatedData[key] || val;
        } else if (Array.isArray(val)) {
          aggregatedData[key] = [...(aggregatedData[key] || []), ...val];
        } else {
          aggregatedData[key] = val;
        }
      });
    });

    Object.keys(aggregatedData).forEach((key) => {
      const shouldAverage = /time|ms|duration|score|density|fre|ratio/i.test(key);
      if (shouldAverage && typeof aggregatedData[key] === "number") {
        aggregatedData[key] = Math.round(aggregatedData[key] / successfulRuns.length);
      }
    });

    aggregatedData.scannedPages = crawledInThisRun;

    return {
      module: analyzer.name,
      status: "completed" as const,
      score: runScore,
      issues: runIssues,
      data: aggregatedData,
      executionTimeMs: Date.now() - startTime,
      crawledInThisRun,
    };
  }
}

