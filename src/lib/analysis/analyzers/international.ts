import type { Analyzer, ModuleResult, Issue, ParsedPage, FetchResult } from "../types";

// Valid BCP 47 primary language subtags (ISO 639-1)
const VALID_LANG_CODES = new Set([
  "aa", "ab", "af", "ak", "am", "an", "ar", "as", "av", "ay", "az",
  "ba", "be", "bg", "bh", "bi", "bm", "bn", "bo", "br", "bs",
  "ca", "ce", "ch", "co", "cr", "cs", "cu", "cv", "cy",
  "da", "de", "dv", "dz",
  "ee", "el", "en", "eo", "es", "et", "eu",
  "fa", "ff", "fi", "fj", "fo", "fr", "fy",
  "ga", "gd", "gl", "gn", "gu", "gv",
  "ha", "he", "hi", "ho", "hr", "ht", "hu", "hy", "hz",
  "ia", "id", "ie", "ig", "ii", "ik", "io", "is", "it", "iu",
  "ja", "jv",
  "ka", "kg", "ki", "kj", "kk", "kl", "km", "kn", "ko", "kr", "ks", "ku", "kv", "kw", "ky",
  "la", "lb", "lg", "li", "ln", "lo", "lt", "lu", "lv",
  "mg", "mh", "mi", "mk", "ml", "mn", "mr", "ms", "mt", "my",
  "na", "nb", "nd", "ne", "ng", "nl", "nn", "no", "nr", "nv", "ny",
  "oc", "oj", "om", "or", "os",
  "pa", "pi", "pl", "ps", "pt",
  "qu",
  "rm", "rn", "ro", "ru", "rw",
  "sa", "sc", "sd", "se", "sg", "si", "sk", "sl", "sm", "sn", "so", "sq", "sr", "ss", "st", "su", "sv", "sw",
  "ta", "te", "tg", "th", "ti", "tk", "tl", "tn", "to", "tr", "ts", "tt", "tw", "ty",
  "ug", "uk", "ur", "uz",
  "ve", "vi", "vo",
  "wa", "wo",
  "xh",
  "yi", "yo",
  "za", "zh", "zu",
]);

function isValidLangCode(code: string): boolean {
  if (!code) return false;
  // x-default is valid for hreflang
  if (code === "x-default") return true;
  // BCP 47: language[-script][-region]
  const parts = code.toLowerCase().split("-");
  return VALID_LANG_CODES.has(parts[0]);
}

export const internationalAnalyzer: Analyzer = {
  name: "international",
  async analyze(page: ParsedPage, fetchResult: FetchResult): Promise<ModuleResult> {
    const startTime = Date.now();
    const issues: Issue[] = [];
    const data: Record<string, unknown> = {};

    const hreflangTags = page.hreflangTags || [];
    data.hreflangCount = hreflangTags.length;

    // ── Early exit: No hreflang tags ────────────────────────────────
    if (hreflangTags.length === 0) {
      // Only report as info — not all sites need hreflang
      issues.push({
        id: "intl-no-hreflang",
        title: "No hreflang tags found",
        description: "This page has no hreflang tags. If your site targets multiple languages or regions, hreflang tells Google which version to show each audience.",
        severity: "info",
        recommendation: "If your site serves content in multiple languages or regions, add hreflang link elements to indicate language/region variants.",
      });

      return {
        module: "international",
        status: "completed",
        score: 100, // Not penalized if no hreflang is needed
        issues,
        data,
        executionTimeMs: Date.now() - startTime,
      };
    }

    // ── 1. Missing self-referencing hreflang ────────────────────────
    const currentUrl = fetchResult.finalUrl;
    const hasSelfRef = hreflangTags.some((tag) => {
      try {
        const tagUrl = new URL(tag.href, currentUrl).toString();
        return tagUrl === currentUrl || tagUrl.replace(/\/$/, "") === currentUrl.replace(/\/$/, "");
      } catch {
        return false;
      }
    });
    data.hasSelfRefHreflang = hasSelfRef;

    if (!hasSelfRef) {
      issues.push({
        id: "intl-missing-self-ref",
        title: "Missing self-referencing hreflang tag",
        description: "The page does not include a hreflang tag pointing to itself. Google requires every page in a hreflang set to include a self-referencing tag.",
        severity: "high",
        recommendation: `Add a self-referencing hreflang tag: <link rel="alternate" hreflang="YOUR_LANG" href="${currentUrl}" />`,
        value: `Current URL: ${currentUrl}`,
      });
    }

    // ── 2. Missing x-default ────────────────────────────────────────
    const hasXDefault = hreflangTags.some((tag) => tag.lang === "x-default");
    data.hasXDefault = hasXDefault;

    if (!hasXDefault) {
      issues.push({
        id: "intl-no-x-default",
        title: "Missing x-default hreflang",
        description: "No x-default hreflang tag found. The x-default tells search engines which page to show when no language match is found.",
        severity: "high",
        recommendation: "Add an x-default hreflang tag pointing to your primary language page or language selector page.",
      });
    }

    // ── 3. Invalid language codes ───────────────────────────────────
    const invalidLangs = hreflangTags.filter(
      (tag) => tag.lang !== "x-default" && !isValidLangCode(tag.lang)
    );
    data.invalidLangCodes = invalidLangs.map((t) => t.lang);

    if (invalidLangs.length > 0) {
      issues.push({
        id: "intl-invalid-lang-code",
        title: "Invalid hreflang language code",
        description: `Found ${invalidLangs.length} hreflang tag(s) with invalid BCP 47 language codes: ${invalidLangs.map((t) => `"${t.lang}"`).join(", ")}.`,
        severity: "medium",
        recommendation: "Use valid ISO 639-1 language codes (e.g., 'en', 'fr', 'de') optionally combined with ISO 3166-1 region codes (e.g., 'en-US', 'pt-BR').",
        value: invalidLangs.map((t) => t.lang).join(", "),
      });
    }

    // ── 4. Duplicate language codes ─────────────────────────────────
    const langCounts = new Map<string, number>();
    hreflangTags.forEach((tag) => {
      const lang = tag.lang.toLowerCase();
      langCounts.set(lang, (langCounts.get(lang) || 0) + 1);
    });
    const duplicateLangs = Array.from(langCounts.entries())
      .filter(([, count]) => count > 1)
      .map(([lang]) => lang);
    data.duplicateLangs = duplicateLangs;

    if (duplicateLangs.length > 0) {
      issues.push({
        id: "intl-duplicate-lang",
        title: "Duplicate hreflang language codes",
        description: `Found duplicate hreflang entries for: ${duplicateLangs.map((l) => `"${l}"`).join(", ")}. Each language-region pair should appear only once.`,
        severity: "medium",
        recommendation: "Remove duplicate hreflang entries. Each language-region combination should have exactly one URL.",
        value: duplicateLangs.join(", "),
      });
    }

    // ── 5. Relative URLs in hreflang ────────────────────────────────
    const relativeUrls = hreflangTags.filter(
      (tag) => !tag.href.startsWith("http://") && !tag.href.startsWith("https://")
    );
    data.relativeHreflangCount = relativeUrls.length;

    if (relativeUrls.length > 0) {
      issues.push({
        id: "intl-relative-url",
        title: "Hreflang tags use relative URLs",
        description: `Found ${relativeUrls.length} hreflang tag(s) with relative URLs. Google requires fully qualified absolute URLs in hreflang attributes.`,
        severity: "medium",
        recommendation: "Replace relative URLs with fully qualified absolute URLs including the protocol and domain.",
        element: relativeUrls.slice(0, 3).map((t) => `${t.lang}: ${t.href}`).join("; "),
        value: `${relativeUrls.length} relative URLs`,
      });
    }

    // ── 6. Page lang mismatch with hreflang ─────────────────────────
    if (page.language && hasSelfRef) {
      const pageLang = page.language.toLowerCase().split("-")[0];
      const selfRefTag = hreflangTags.find((tag) => {
        try {
          const tagUrl = new URL(tag.href, currentUrl).toString();
          return (
            tag.lang !== "x-default" &&
            (tagUrl === currentUrl || tagUrl.replace(/\/$/, "") === currentUrl.replace(/\/$/, ""))
          );
        } catch {
          return false;
        }
      });

      if (selfRefTag) {
        const hreflangLang = selfRefTag.lang.toLowerCase().split("-")[0];
        data.pageLang = pageLang;
        data.selfRefLang = hreflangLang;

        if (pageLang !== hreflangLang) {
          issues.push({
            id: "intl-lang-mismatch",
            title: "Page lang attribute doesn't match hreflang",
            description: `The page's lang attribute is "${page.language}" but the self-referencing hreflang declares "${selfRefTag.lang}". These should match.`,
            severity: "medium",
            recommendation: "Ensure the <html lang> attribute matches the hreflang value for the current page.",
            value: `Page: ${page.language}, Hreflang: ${selfRefTag.lang}`,
          });
        }
      }
    }

    // ── 7. Mixed protocols in hreflang ──────────────────────────────
    const hasHttp = hreflangTags.some((t) => t.href.startsWith("http://"));
    const hasHttps = hreflangTags.some((t) => t.href.startsWith("https://"));
    data.mixedProtocols = hasHttp && hasHttps;

    if (hasHttp && hasHttps) {
      issues.push({
        id: "intl-mixed-protocols",
        title: "Hreflang tags mix HTTP and HTTPS",
        description: "Some hreflang URLs use HTTP while others use HTTPS. Inconsistent protocols can cause indexing issues.",
        severity: "low",
        recommendation: "Use HTTPS consistently across all hreflang URLs.",
      });
    }

    // ── Score ────────────────────────────────────────────────────────
    const criticalCount = issues.filter((i) => i.severity === "critical").length;
    const highCount = issues.filter((i) => i.severity === "high").length;
    const mediumCount = issues.filter((i) => i.severity === "medium").length;
    const lowCount = issues.filter((i) => i.severity === "low").length;

    const score = Math.max(
      0,
      100 - criticalCount * 20 - highCount * 10 - mediumCount * 5 - lowCount * 2
    );

    return {
      module: "international",
      status: "completed",
      score,
      issues,
      data,
      executionTimeMs: Date.now() - startTime,
    };
  },
};
