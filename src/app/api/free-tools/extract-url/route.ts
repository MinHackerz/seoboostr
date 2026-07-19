import { NextRequest, NextResponse } from "next/server";
import { fetchPage } from "@/lib/analysis/fetcher";
import { parsePage } from "@/lib/analysis/parser";

export const maxDuration = 30; // Set 30s timeout

export async function POST(request: NextRequest) {
  try {
    const { url } = await request.json();
    if (!url) {
      return NextResponse.json({ error: "URL is required" }, { status: 400 });
    }

    let formattedUrl = url.trim();
    if (!/^https?:\/\//i.test(formattedUrl)) {
      formattedUrl = `https://${formattedUrl}`;
    }

    console.log(`[GEO Grader Fetch] Fetching target URL: ${formattedUrl}`);
    const fetchResult = await fetchPage(formattedUrl);

    if (fetchResult.statusCode >= 400) {
      return NextResponse.json(
        { error: `Failed to load page: HTTP ${fetchResult.statusCode}` },
        { status: 400 }
      );
    }

    const parsedPage = parsePage(fetchResult.html, fetchResult.finalUrl);
    const text = parsedPage.textContent || "";

    if (!text.trim()) {
      return NextResponse.json(
        { error: "Could not extract any visible text content from the body of this URL." },
        { status: 400 }
      );
    }

    return NextResponse.json({ text });
  } catch (error) {
    console.error("[GEO Grader Fetch] Error:", error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Failed to fetch or parse URL" },
      { status: 500 }
    );
  }
}
