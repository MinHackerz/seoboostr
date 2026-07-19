import { NextRequest, NextResponse } from "next/server";

const CRAWLERS = [
  { id: "gptbot", name: "GPTBot", ua: "Mozilla/5.0 (compatible; GPTBot/1.2; +https://openai.com/gptbot)" },
  { id: "oai_searchbot", name: "OAI-SearchBot", ua: "Mozilla/5.0 (compatible; OAI-SearchBot/1.0; +https://openai.com/oai-searchbot)" },
  { id: "perplexitybot", name: "PerplexityBot", ua: "Mozilla/5.0 (compatible; PerplexityBot/1.0; +https://perplexity.ai/perplexitybot)" },
  { id: "claudebot", name: "ClaudeBot", ua: "Mozilla/5.0 (compatible; ClaudeBot/1.0; +https://anthropic.com/claudebot)" },
  { id: "google_extended", name: "Google-Extended", ua: "Mozilla/5.0 (compatible; Google-Extended; +https://google.com/google-extended)" }
];

async function fetchWithTimeout(url: string, options: RequestInit, timeoutMs = 5000): Promise<Response> {
  const controller = new AbortController();
  const id = setTimeout(() => controller.abort(), timeoutMs);
  try {
    const response = await fetch(url, {
      ...options,
      signal: controller.signal
    });
    clearTimeout(id);
    return response;
  } catch (error) {
    clearTimeout(id);
    throw error;
  }
}

// Simple robots.txt parser to see if a bot is disallowed
function parseRobotsTxt(robotsText: string, botUa: string, path: string): boolean {
  if (!robotsText) return false;
  
  const lines = robotsText.split(/\r?\n/);
  let currentAgents: string[] = [];
  let isDisallowed = false;
  
  const cleanPath = path.toLowerCase() || "/";

  for (const line of lines) {
    const cleanLine = line.trim();
    if (!cleanLine || cleanLine.startsWith("#")) continue;

    const parts = cleanLine.split(":");
    if (parts.length < 2) continue;

    const directive = parts[0].trim().toLowerCase();
    const value = parts.slice(1).join(":").trim();

    if (directive === "user-agent") {
      // If we were in an agent block and see a new User-agent directive,
      // reset agent tracking unless it's a consecutive User-agent line.
      if (currentAgents.length > 0 && !cleanLine.toLowerCase().startsWith("user-agent")) {
        currentAgents = [];
      }
      currentAgents.push(value.toLowerCase());
    } else if (directive === "disallow") {
      // Check if the current block applies to our bot or *
      const applies = currentAgents.some(agent => agent === "*" || botUa.toLowerCase().includes(agent));
      if (applies) {
        const disallowPath = value.toLowerCase();
        if (disallowPath === "/" || disallowPath === "/*" || cleanPath.startsWith(disallowPath)) {
          isDisallowed = true;
        }
      }
    } else if (directive === "allow") {
      const applies = currentAgents.some(agent => agent === "*" || botUa.toLowerCase().includes(agent));
      if (applies) {
        const allowPath = value.toLowerCase();
        if (allowPath === "/" || allowPath === "/*" || cleanPath.startsWith(allowPath)) {
          isDisallowed = false; // Allow overrides Disallow in standard robots specifications
        }
      }
    }
  }

  return isDisallowed;
}

export async function POST(req: NextRequest) {
  try {
    const { url } = await req.json();
    
    if (!url || typeof url !== "string") {
      return NextResponse.json({ error: "Invalid URL provided" }, { status: 400 });
    }

    // Standardize URL
    let targetUrl = url.trim();
    if (!/^https?:\/\//i.test(targetUrl)) {
      targetUrl = "https://" + targetUrl;
    }

    let parsedUrl: URL;
    try {
      parsedUrl = new URL(targetUrl);
    } catch {
      return NextResponse.json({ error: "Malformed URL syntax" }, { status: 400 });
    }

    const domain = parsedUrl.origin;
    const path = parsedUrl.pathname + parsedUrl.search;

    // 1. Fetch robots.txt first
    let robotsText = "";
    try {
      const robotsRes = await fetchWithTimeout(`${domain}/robots.txt`, {
        headers: { "User-Agent": "SEO-Optimised-BotChecker/1.0" }
      }, 4000);
      if (robotsRes.ok) {
        robotsText = await robotsRes.text();
      }
    } catch {
      console.log("No robots.txt found or request timed out");
    }

    // 2. Fetch target URL in parallel with simulated user-agent headers
    const crawlerChecks = await Promise.all(
      CRAWLERS.map(async (crawler) => {
        const isRobotsBlocked = parseRobotsTxt(robotsText, crawler.id, path);
        
        try {
          const res = await fetchWithTimeout(targetUrl, {
            method: "GET",
            headers: {
              "User-Agent": crawler.ua,
              "Accept": "text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8",
              "Accept-Language": "en-US,en;q=0.5"
            }
          }, 5000);

          const serverHeader = res.headers.get("server") || "";
          const isCloudflare = serverHeader.toLowerCase().includes("cloudflare") || res.headers.has("cf-ray");
          
          let status: "allowed" | "blocked_cdn" | "blocked_robots" | "failed" = "allowed";
          if (isRobotsBlocked) {
            status = "blocked_robots";
          } else if (res.status === 403 || res.status === 401) {
            status = "blocked_cdn";
          } else if (!res.ok) {
            status = "failed";
          }

          return {
            id: crawler.id,
            name: crawler.name,
            status,
            httpCode: res.status,
            isCloudflare,
            isRobotsBlocked
          };
        } catch (error: any) {
          // If request was aborted (timeout) or network error occurred
          return {
            id: crawler.id,
            name: crawler.name,
            status: isRobotsBlocked ? "blocked_robots" : "failed",
            httpCode: error.name === "AbortError" ? 408 : 500,
            isCloudflare: false,
            isRobotsBlocked
          };
        }
      })
    );

    return NextResponse.json({
      url: targetUrl,
      domain: parsedUrl.hostname,
      hasRobotsTxt: robotsText.length > 0,
      checks: crawlerChecks
    });

  } catch (error: any) {
    return NextResponse.json({ error: error.message || "Server Error" }, { status: 500 });
  }
}
