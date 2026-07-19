import { MetadataRoute } from "next";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: "*",
        allow: "/",
        disallow: ["/api/", "/dashboard/"],
      },
      // OpenAI ChatGPT Search Agent
      {
        userAgent: "OAI-SearchBot",
        allow: "/",
      },
      // Perplexity AI Search Agent
      {
        userAgent: "PerplexityBot",
        allow: "/",
      },
      // OpenAI Core Training Crawler
      {
        userAgent: "GPTBot",
        allow: "/",
      },
      // Anthropic Claude Crawler
      {
        userAgent: "ClaudeBot",
        allow: "/",
      },
      // Anthropic Claude Web Search Agent
      {
        userAgent: "Claude-Web",
        allow: "/",
      },
      // Google Gemini/AI Model Training Control
      {
        userAgent: "Google-Extended",
        allow: "/",
      },
      // Apple Intelligence Training Control
      {
        userAgent: "Applebot-Extended",
        allow: "/",
      },
      // Meta Llama/AI Training Agent
      {
        userAgent: "Meta-ExternalAgent",
        allow: "/",
      },
    ],
    sitemap: "https://seoptimised.com/sitemap.xml",
  };
}
