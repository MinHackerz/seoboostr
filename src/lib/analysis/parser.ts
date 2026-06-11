import * as cheerio from "cheerio";
import type {
  ParsedPage,
  HeadingInfo,
  ImageInfo,
  LinkInfo,
  ScriptInfo,
  StylesheetInfo,
  SchemaInfo,
  HreflangTag,
} from "./types";

export function parsePage(html: string, url: string): ParsedPage {
  const $ = cheerio.load(html);
  const baseUrl = new URL(url).origin;

  return {
    url,
    title: $("title").first().text().trim(),
    metaDescription: $('meta[name="description"]').attr("content")?.trim() || "",
    metaRobots: $('meta[name="robots"]').attr("content")?.trim() || "",
    canonical: $('link[rel="canonical"]').attr("href")?.trim() || "",
    viewport: $('meta[name="viewport"]').attr("content")?.trim() || "",
    charset:
      $("meta[charset]").attr("charset")?.trim() ||
      $('meta[http-equiv="Content-Type"]').attr("content")?.trim() ||
      "",
    language: $("html").attr("lang")?.trim() || "",
    headings: extractHeadings($),
    images: extractImages($),
    links: extractLinks($, baseUrl, url),
    scripts: extractScripts($),
    stylesheets: extractStylesheets($),
    schemaMarkup: extractSchemaMarkup($),
    openGraph: extractMetaGroup($, "og:"),
    twitterCard: extractMetaGroup($, "twitter:"),
    wordCount: extractWordCount($),
    textContent: extractTextContent($),
    hreflangTags: extractHreflang($),
    favicon:
      $('link[rel="icon"], link[rel="shortcut icon"]').first().attr("href") || "",
    generator: $('meta[name="generator"]').attr("content")?.trim() || "",
    author: $('meta[name="author"]').attr("content")?.trim() || "",
    publishedDate:
      $('meta[property="article:published_time"]').attr("content")?.trim() ||
      $('time[datetime]').first().attr("datetime")?.trim() ||
      "",
    modifiedDate:
      $('meta[property="article:modified_time"]').attr("content")?.trim() || "",
  };
}

function extractHeadings($: cheerio.CheerioAPI): HeadingInfo[] {
  const headings: HeadingInfo[] = [];
  $("h1, h2, h3, h4, h5, h6").each((_, el) => {
    const tagName = $(el).prop("tagName")?.toLowerCase() || "";
    const level = parseInt(tagName.replace("h", ""), 10);
    headings.push({ level, text: $(el).text().trim() });
  });
  return headings;
}

function extractImages($: cheerio.CheerioAPI): ImageInfo[] {
  const images: ImageInfo[] = [];
  $("img").each((_, el) => {
    const $el = $(el);
    const classes = $el.attr("class") || "";

    let lazyMethod: ImageInfo["lazyMethod"] = "none";
    if ($el.attr("loading") === "lazy") lazyMethod = "native";
    else if ($el.attr("data-perfmatters-src") || classes.includes("perfmatters-lazy"))
      lazyMethod = "perfmatters";
    else if ($el.attr("data-ewww-src") || $el.attr("data-eio") || classes.includes("lazyload-eio"))
      lazyMethod = "ewww";
    else if (
      $el.attr("data-src") ||
      $el.attr("data-lazy-src") ||
      $el.attr("data-original") ||
      $el.attr("data-srcset") ||
      classes.includes("lazyload") ||
      classes.includes("lazyloaded") ||
      classes.includes("lazy")
    )
      lazyMethod = "js-generic";

    images.push({
      src: $el.attr("src") || $el.attr("data-src") || "",
      alt: $el.attr("alt") || "",
      width: $el.attr("width") || "",
      height: $el.attr("height") || "",
      loading: $el.attr("loading") || "",
      decoding: $el.attr("decoding") || "",
      fetchpriority: $el.attr("fetchpriority") || "",
      srcset: $el.attr("srcset") || "",
      sizes: $el.attr("sizes") || "",
      isInPicture: $el.closest("picture").length > 0,
      lazyMethod,
      classes,
    });
  });
  return images;
}

function extractLinks(
  $: cheerio.CheerioAPI,
  baseUrl: string,
  pageUrl: string
): LinkInfo[] {
  const links: LinkInfo[] = [];
  const pageDomain = new URL(pageUrl).hostname;

  $("a[href]").each((_, el) => {
    const $el = $(el);
    const href = $el.attr("href") || "";
    const rel = $el.attr("rel") || "";

    let isInternal = false;
    try {
      const linkUrl = new URL(href, pageUrl);
      isInternal = linkUrl.hostname === pageDomain;
    } catch {
      isInternal = href.startsWith("/") || href.startsWith("#");
    }

    links.push({
      href,
      text: $el.text().trim(),
      rel,
      isInternal,
      isNofollow: rel.includes("nofollow"),
      target: $el.attr("target") || "",
    });
  });
  return links;
}

function extractScripts($: cheerio.CheerioAPI): ScriptInfo[] {
  const scripts: ScriptInfo[] = [];
  $("script").each((_, el) => {
    const $el = $(el);
    const src = $el.attr("src") || "";
    const isInline = !src;
    const content = isInline ? $el.html() || "" : "";

    scripts.push({
      src,
      isAsync: $el.attr("async") !== undefined,
      isDefer: $el.attr("defer") !== undefined,
      isModule: $el.attr("type") === "module",
      isInline,
      size: isInline ? content.length : 0,
    });
  });
  return scripts;
}

function extractStylesheets($: cheerio.CheerioAPI): StylesheetInfo[] {
  const stylesheets: StylesheetInfo[] = [];

  $('link[rel="stylesheet"]').each((_, el) => {
    stylesheets.push({
      href: $(el).attr("href") || "",
      media: $(el).attr("media") || "all",
      isInline: false,
      size: 0,
    });
  });

  $("style").each((_, el) => {
    const content = $(el).html() || "";
    stylesheets.push({
      href: "",
      media: $(el).attr("media") || "all",
      isInline: true,
      size: content.length,
    });
  });

  return stylesheets;
}

function extractSchemaMarkup($: cheerio.CheerioAPI): SchemaInfo[] {
  const schemas: SchemaInfo[] = [];

  // JSON-LD
  $('script[type="application/ld+json"]').each((_, el) => {
    const raw = $(el).html() || "";
    try {
      const parsed = JSON.parse(raw);
      const types = Array.isArray(parsed)
        ? parsed.map((p) => p["@type"]).filter(Boolean)
        : [parsed["@type"]].filter(Boolean);

      types.forEach((type) => {
        schemas.push({
          type: String(type),
          format: "json-ld",
          raw,
          parsed,
          errors: validateSchema(parsed, String(type)),
        });
      });

      if (types.length === 0) {
        schemas.push({
          type: "Unknown",
          format: "json-ld",
          raw,
          parsed,
          errors: ["Missing @type property"],
        });
      }
    } catch (e) {
      schemas.push({
        type: "Invalid",
        format: "json-ld",
        raw,
        errors: [`Invalid JSON: ${e instanceof Error ? e.message : "parse error"}`],
      });
    }
  });

  // Microdata
  $("[itemscope]").each((_, el) => {
    const type = $(el).attr("itemtype") || "";
    schemas.push({
      type: type.split("/").pop() || "Unknown",
      format: "microdata",
      raw: $.html(el)?.substring(0, 500) || "",
      errors: [],
    });
  });

  return schemas;
}

function validateSchema(data: Record<string, unknown>, type: string): string[] {
  const errors: string[] = [];

  if (!data["@context"]) errors.push("Missing @context");
  if (!data["@type"]) errors.push("Missing @type");

  // Deprecated type checks
  const deprecated = ["HowTo", "SpecialAnnouncement", "ClaimReview", "VehicleListing"];
  if (deprecated.includes(type)) {
    errors.push(`${type} is deprecated — rich results have been removed`);
  }
  if (type === "FAQ") {
    errors.push("FAQ schema is restricted to government and healthcare authority sites only");
  }

  return errors;
}

function extractMetaGroup(
  $: cheerio.CheerioAPI,
  prefix: string
): Record<string, string> {
  const result: Record<string, string> = {};
  $(`meta[property^="${prefix}"], meta[name^="${prefix}"]`).each((_, el) => {
    const key =
      $(el).attr("property") || $(el).attr("name") || "";
    result[key] = $(el).attr("content") || "";
  });
  return result;
}

function extractWordCount($: cheerio.CheerioAPI): number {
  const text = extractTextContent($);
  return text
    .split(/\s+/)
    .filter((word) => word.length > 0).length;
}

function extractTextContent($: cheerio.CheerioAPI): string {
  // Remove scripts, styles, and non-content elements
  const $clone = cheerio.load($.html() || "");
  $clone("script, style, nav, footer, header, aside, noscript").remove();
  return $clone("body").text().replace(/\s+/g, " ").trim();
}

function extractHreflang($: cheerio.CheerioAPI): HreflangTag[] {
  const tags: HreflangTag[] = [];
  $('link[rel="alternate"][hreflang]').each((_, el) => {
    tags.push({
      lang: $(el).attr("hreflang") || "",
      href: $(el).attr("href") || "",
    });
  });
  return tags;
}
