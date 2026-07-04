import type { FetchResult, RedirectHop } from "./types";

const USER_AGENT =
  "SEOBoostr/1.0 (SEO Analysis Bot; +https://seoboostr.com/bot)";
const BROWSER_USER_AGENT =
  "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/122.0.0.0 Safari/537.36";
const MAX_REDIRECTS = 3;
const TIMEOUT_MS = 30000;

async function fetchWithTimeout(
  url: string,
  options: RequestInit = {}
): Promise<Response> {
  const controller = new AbortController();
  const id = setTimeout(() => controller.abort(), TIMEOUT_MS);
  
  const headers = {
    "User-Agent": USER_AGENT,
    Accept: "text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8",
    "Accept-Language": "en-US,en;q=0.5",
    ...options.headers,
  };

  try {
    const response = await fetch(url, {
      ...options,
      signal: controller.signal,
      headers,
      redirect: "manual", // Handle redirects manually for chain tracking
    });

    // If blocked or unauthorized, retry with standard browser user-agent
    if ((response.status === 403 || response.status === 401) && headers["User-Agent"] === USER_AGENT) {
      clearTimeout(id);
      const retryController = new AbortController();
      const retryId = setTimeout(() => retryController.abort(), TIMEOUT_MS);
      try {
        const retryResponse = await fetch(url, {
          ...options,
          signal: retryController.signal,
          headers: {
            ...headers,
            "User-Agent": BROWSER_USER_AGENT,
          },
          redirect: "manual",
        });
        if (retryResponse.ok || retryResponse.status < 400) {
          return retryResponse;
        }
      } catch {
        // Fall back to original response if retry fails
      } finally {
        clearTimeout(retryId);
      }
    }

    return response;
  } catch (err) {
    // If fetch failed completely, try retrying once with browser user agent
    if (headers["User-Agent"] === USER_AGENT) {
      clearTimeout(id);
      const retryController = new AbortController();
      const retryId = setTimeout(() => retryController.abort(), TIMEOUT_MS);
      try {
        return await fetch(url, {
          ...options,
          signal: retryController.signal,
          headers: {
            ...headers,
            "User-Agent": BROWSER_USER_AGENT,
          },
          redirect: "manual",
        });
      } catch {
        throw err;
      } finally {
        clearTimeout(retryId);
      }
    }
    throw err;
  } finally {
    clearTimeout(id);
  }
}

export async function fetchPage(url: string): Promise<FetchResult> {
  const startTime = Date.now();
  const redirectChain: RedirectHop[] = [];
  let currentUrl = url;

  // Ensure URL has protocol
  if (!currentUrl.startsWith("http://") && !currentUrl.startsWith("https://")) {
    currentUrl = "https://" + currentUrl;
  }

  // Follow redirects manually
  for (let i = 0; i < MAX_REDIRECTS; i++) {
    const response = await fetchWithTimeout(currentUrl);

    if (response.status >= 300 && response.status < 400) {
      const location = response.headers.get("location");
      if (!location) break;

      redirectChain.push({ url: currentUrl, statusCode: response.status });
      // Handle relative redirects
      currentUrl = new URL(location, currentUrl).toString();
      continue;
    }

    // Extract headers
    const headers: Record<string, string> = {};
    response.headers.forEach((value, key) => {
      headers[key] = value;
    });

    const html = await response.text();

    // Fetch auxiliary resources in parallel
    const baseUrl = new URL(currentUrl).origin;
    const [robotsResult, sitemapResult, llmsResult] = await Promise.allSettled([
      fetchTextResource(`${baseUrl}/robots.txt`),
      fetchTextResource(`${baseUrl}/sitemap.xml`),
      fetchTextResource(`${baseUrl}/llms.txt`),
    ]);

    const robotsTxt = robotsResult.status === "fulfilled" ? robotsResult.value : undefined;
    let sitemapXml = sitemapResult.status === "fulfilled" ? sitemapResult.value : undefined;
    const llmsTxt = llmsResult.status === "fulfilled" ? llmsResult.value : undefined;

    // Helper to extract Sitemap URLs from robots.txt content
    const extractSitemapUrls = (txt: string): string[] => {
      const urls: string[] = [];
      const lines = txt.split("\n");
      for (const line of lines) {
        const match = line.match(/^\s*Sitemap:\s*(https?:\/\/\S+)/i);
        if (match) {
          urls.push(match[1].trim());
        }
      }
      return urls;
    };

    // If sitemap was not found at standard /sitemap.xml, check if it's referenced in robots.txt
    if (!sitemapXml && robotsTxt) {
      const referencedSitemaps = extractSitemapUrls(robotsTxt);
      for (const sitemapUrl of referencedSitemaps) {
        try {
          const fetched = await fetchTextResource(sitemapUrl);
          if (fetched) {
            sitemapXml = fetched;
            break;
          }
        } catch (e) {
          console.warn(`Failed to fetch referenced sitemap at ${sitemapUrl}:`, e);
        }
      }
    }

    // Try /sitemap_index.xml if it's still not found
    if (!sitemapXml) {
      try {
        const fetched = await fetchTextResource(`${baseUrl}/sitemap_index.xml`);
        if (fetched) {
          sitemapXml = fetched;
        }
      } catch {}
    }

    return {
      url,
      finalUrl: currentUrl,
      statusCode: response.status,
      headers,
      html,
      redirectChain,
      responseTimeMs: Date.now() - startTime,
      robotsTxt,
      sitemapXml,
      llmsTxt,
    };
  }

  throw new Error(`Too many redirects (>${MAX_REDIRECTS}) for ${url}`);
}

export async function fetchSubpage(url: string): Promise<FetchResult> {
  const startTime = Date.now();
  const redirectChain: RedirectHop[] = [];
  let currentUrl = url;

  // Ensure URL has protocol
  if (!currentUrl.startsWith("http://") && !currentUrl.startsWith("https://")) {
    currentUrl = "https://" + currentUrl;
  }

  // Follow redirects manually
  for (let i = 0; i < MAX_REDIRECTS; i++) {
    const response = await fetchWithTimeout(currentUrl);

    if (response.status >= 300 && response.status < 400) {
      const location = response.headers.get("location");
      if (!location) break;

      redirectChain.push({ url: currentUrl, statusCode: response.status });
      // Handle relative redirects
      currentUrl = new URL(location, currentUrl).toString();
      continue;
    }

    // Extract headers
    const headers: Record<string, string> = {};
    response.headers.forEach((value, key) => {
      headers[key] = value;
    });

    const html = await response.text();

    return {
      url,
      finalUrl: currentUrl,
      statusCode: response.status,
      headers,
      html,
      redirectChain,
      responseTimeMs: Date.now() - startTime,
    };
  }

  throw new Error(`Too many redirects (>${MAX_REDIRECTS}) for ${url}`);
}


async function fetchTextResource(url: string): Promise<string | undefined> {
  let currentUrl = url;
  try {
    for (let i = 0; i < MAX_REDIRECTS; i++) {
      const response = await fetchWithTimeout(currentUrl);
      if (response.status >= 300 && response.status < 400) {
        const location = response.headers.get("location");
        if (!location) break;
        currentUrl = new URL(location, currentUrl).toString();
        continue;
      }
      if (response.ok) {
        return await response.text();
      }
      break;
    }
    return undefined;
  } catch {
    return undefined;
  }
}
