import { NextRequest, NextResponse } from "next/server";

export const maxDuration = 15; // Set 15s timeout for fetching external xml

export async function POST(request: NextRequest) {
  try {
    const { sitemapUrl } = await request.json();
    if (!sitemapUrl) {
      return NextResponse.json({ error: "Sitemap URL is required" }, { status: 400 });
    }

    let formattedUrl = sitemapUrl.trim();
    if (!/^https?:\/\//i.test(formattedUrl)) {
      formattedUrl = `https://${formattedUrl}`;
    }

    const response = await fetch(formattedUrl, {
      headers: {
        "User-Agent": "SEO-Optimised-SitemapBot/1.0",
      },
      next: { revalidate: 60 } // Cache for 1 min
    });

    if (!response.ok) {
      return NextResponse.json({ error: `Failed to fetch sitemap: HTTP ${response.status}` }, { status: 400 });
    }

    const xml = await response.text();
    
    // Regular expression to parse <loc> tags
    const locRegex = /<loc>(https?:\/\/[^\s<]+)<\/loc>/gi;
    const urls: string[] = [];
    let match;
    while ((match = locRegex.exec(xml)) !== null) {
      urls.push(match[1]);
    }

    // Deduplicate URLs
    const uniqueUrls = Array.from(new Set(urls));

    // Extract domain name for brand guess
    let domain = "Website";
    try {
      const parsedUrl = new URL(formattedUrl);
      domain = parsedUrl.hostname.replace("www.", "");
      // Capitalize first letter
      domain = domain.charAt(0).toUpperCase() + domain.slice(1);
    } catch {
      // Fallback
    }

    return NextResponse.json({ urls: uniqueUrls, domain });
  } catch (error) {
    return NextResponse.json({ error: error instanceof Error ? error.message : "Internal Server Error" }, { status: 500 });
  }
}
