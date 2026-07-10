import type { Analyzer, ModuleResult, Issue, ParsedPage, FetchResult } from "../types";

export const accessibilityAnalyzer: Analyzer = {
  name: "accessibility",
  async analyze(page: ParsedPage, fetchResult: FetchResult): Promise<ModuleResult> {
    const startTime = Date.now();
    const issues: Issue[] = [];
    const data: Record<string, unknown> = {};
    const html = fetchResult.html;
    const htmlLower = html.toLowerCase();

    // ── 1. Missing lang attribute ───────────────────────────────────
    data.hasLang = !!page.language;

    if (!page.language) {
      issues.push({
        id: "a11y-no-lang",
        title: "Missing lang attribute on <html>",
        description: "The <html> element does not have a lang attribute. Screen readers cannot determine the page language.",
        severity: "high",
        recommendation: "Add a lang attribute to the <html> element, e.g. <html lang=\"en\">.",
      });
    }

    // ── 2. Skip navigation link ─────────────────────────────────────
    const hasSkipLink =
      /skip[\s-]*(to[\s-]*)?(main|content|nav)/i.test(html) ||
      /#(main|content|maincontent)/i.test(html);
    data.hasSkipLink = hasSkipLink;

    if (!hasSkipLink) {
      issues.push({
        id: "a11y-no-skip-link",
        title: "Missing skip navigation link",
        description: "No skip-to-content link detected. Keyboard users must tab through the entire navigation on every page.",
        severity: "medium",
        recommendation: "Add a visually hidden skip link at the top of the page: <a href=\"#main-content\" class=\"sr-only\">Skip to main content</a>.",
      });
    }

    // ── 3. ARIA landmarks / semantic sections ───────────────────────
    const hasLandmarks =
      /role=["'](banner|navigation|main|contentinfo|complementary|search)["']/i.test(html) ||
      /<(main|nav|header|footer|aside|section)\b/i.test(html);
    data.hasLandmarks = hasLandmarks;

    if (!hasLandmarks) {
      issues.push({
        id: "a11y-no-landmark",
        title: "No ARIA landmarks or semantic sections",
        description: "The page has no ARIA landmark roles and no semantic HTML5 sectioning elements (<main>, <nav>, <header>, <footer>).",
        severity: "medium",
        recommendation: "Use semantic HTML5 elements like <main>, <nav>, <header>, <footer> to define page regions for assistive technology.",
      });
    }

    // ── 4. Form inputs without labels ───────────────────────────────
    const inputRegex = /<input\b(?![^>]*type=["'](?:hidden|submit|button|reset|image)["'])[^>]*>/gi;
    const textareaRegex = /<textarea\b[^>]*>/gi;
    const selectRegex = /<select\b[^>]*>/gi;

    const formElements = [
      ...(html.match(inputRegex) || []),
      ...(html.match(textareaRegex) || []),
      ...(html.match(selectRegex) || []),
    ];

    const unlabeledInputs = formElements.filter((el) => {
      const hasAriaLabel = /aria-label(ledby)?=["'][^"']+["']/i.test(el);
      const hasId = /\bid=["']([^"']+)["']/i.exec(el);
      const hasTitle = /\btitle=["'][^"']+["']/i.test(el);
      const hasPlaceholder = /\bplaceholder=["'][^"']+["']/i.test(el);

      if (hasAriaLabel || hasTitle) return false;
      if (hasId) {
        const labelPattern = new RegExp(`for=["']${hasId[1]}["']`, "i");
        if (labelPattern.test(html)) return false;
      }
      // Placeholder alone is not a sufficient label
      if (hasPlaceholder && !hasAriaLabel && !hasTitle) return true;
      if (!hasAriaLabel && !hasTitle && !hasId) return true;
      return false;
    });
    data.unlabeledInputCount = unlabeledInputs.length;

    if (unlabeledInputs.length > 0) {
      issues.push({
        id: "a11y-missing-form-labels",
        title: "Form inputs without accessible labels",
        description: `Found ${unlabeledInputs.length} form input(s) without associated <label>, aria-label, or aria-labelledby. Screen readers cannot describe these inputs.`,
        severity: "high",
        recommendation: "Associate every form input with a <label for=\"id\">, aria-label, or aria-labelledby attribute. Placeholder text alone is insufficient.",
        value: `${unlabeledInputs.length} unlabeled inputs`,
      });
    }

    // ── 5. Buttons without accessible text ──────────────────────────
    const buttonRegex = /<button\b[^>]*>[\s\S]*?<\/button>/gi;
    const buttons = html.match(buttonRegex) || [];

    const emptyButtons = buttons.filter((btn) => {
      const hasAriaLabel = /aria-label(ledby)?=["'][^"']+["']/i.test(btn);
      const hasTitle = /\btitle=["'][^"']+["']/i.test(btn);
      // Strip HTML tags and check for text content
      const textContent = btn.replace(/<[^>]+>/g, "").trim();
      return !textContent && !hasAriaLabel && !hasTitle;
    });
    data.emptyButtonCount = emptyButtons.length;

    if (emptyButtons.length > 0) {
      issues.push({
        id: "a11y-empty-buttons",
        title: "Buttons with no accessible text",
        description: `Found ${emptyButtons.length} button(s) with no text content, aria-label, or title. Screen readers cannot convey the button's purpose.`,
        severity: "high",
        recommendation: "Add visible text, aria-label, or title attribute to all buttons. Icon-only buttons must have aria-label.",
        value: `${emptyButtons.length} empty buttons`,
      });
    }

    // ── 6. Images without alt text ──────────────────────────────────
    const imagesWithoutAlt = page.images.filter((img) => {
      // Decorative images can have alt=""
      if (img.alt === "") return false; // Intentionally empty (decorative)
      return img.alt === undefined || img.alt === null;
    });
    // Also check for images where alt is simply missing (not set at all)
    const imgNoAltRegex = /<img\b(?![^>]*\balt\b)[^>]*>/gi;
    const trueNoAlt = (html.match(imgNoAltRegex) || []).length;
    data.imagesWithoutAlt = trueNoAlt;

    if (trueNoAlt > 0) {
      issues.push({
        id: "a11y-missing-alt",
        title: "Images missing alt attribute",
        description: `Found ${trueNoAlt} image(s) without any alt attribute. Screen readers cannot describe these images to visually impaired users.`,
        severity: "high",
        recommendation: "Add descriptive alt text to all images. Use alt=\"\" only for purely decorative images.",
        value: `${trueNoAlt} images without alt`,
      });
    }

    // ── 7. Positive tabindex ────────────────────────────────────────
    const tabindexRegex = /tabindex=["'](\d+)["']/gi;
    let positiveTabindexCount = 0;
    let match;
    while ((match = tabindexRegex.exec(html)) !== null) {
      if (parseInt(match[1], 10) > 0) {
        positiveTabindexCount++;
      }
    }
    data.positiveTabindexCount = positiveTabindexCount;

    if (positiveTabindexCount > 0) {
      issues.push({
        id: "a11y-tabindex-positive",
        title: "Elements with positive tabindex values",
        description: `Found ${positiveTabindexCount} element(s) with tabindex > 0. Positive tabindex values disrupt the natural tab order and confuse keyboard users.`,
        severity: "medium",
        recommendation: "Use tabindex=\"0\" to include elements in natural tab order, or tabindex=\"-1\" for programmatic focus. Never use positive values.",
        value: `${positiveTabindexCount} elements with positive tabindex`,
      });
    }

    // ── 8. Autoplaying media ────────────────────────────────────────
    const autoplayRegex = /<(video|audio)\b[^>]*\bautoplay\b[^>]*>/gi;
    const autoplayElements = html.match(autoplayRegex) || [];
    const unmutedAutoplay = autoplayElements.filter(
      (el) => !/\bmuted\b/i.test(el)
    );
    data.autoplayMediaCount = autoplayElements.length;
    data.unmutedAutoplayCount = unmutedAutoplay.length;

    if (unmutedAutoplay.length > 0) {
      issues.push({
        id: "a11y-autoplaying-media",
        title: "Auto-playing media without muted attribute",
        description: `Found ${unmutedAutoplay.length} auto-playing media element(s) without the muted attribute. Unexpected audio is disorienting for screen reader users.`,
        severity: "medium",
        recommendation: "Add the `muted` attribute to autoplay media, or remove autoplay entirely and let users control playback.",
        value: `${unmutedAutoplay.length} unmuted autoplay elements`,
      });
    }

    // ── 9. Links with empty text ────────────────────────────────────
    const emptyLinks = page.links.filter((l) => {
      return (!l.text || !l.text.trim()) && l.href && l.href !== "#";
    });

    // Check for aria-label in the HTML for these links
    const linksNoAriaCount = emptyLinks.filter((l) => {
      // Basic heuristic: check if the href appears near an aria-label
      const hrefEscaped = l.href.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
      const linkWithAria = new RegExp(
        `href=["']${hrefEscaped}["'][^>]*aria-label=["'][^"']+["']`,
        "i"
      );
      return !linkWithAria.test(html);
    });

    data.emptyLinkCount = linksNoAriaCount.length;

    if (linksNoAriaCount.length > 3) {
      issues.push({
        id: "a11y-empty-links",
        title: "Links with no accessible text",
        description: `Found ${linksNoAriaCount.length} link(s) with no visible text or aria-label. Screen readers will read only the URL, which provides no context.`,
        severity: "high",
        recommendation: "Add descriptive text or aria-label to all links. For image links, ensure the <img> has meaningful alt text.",
        value: `${linksNoAriaCount.length} empty links`,
      });
    }

    // ── 10. Missing document title ──────────────────────────────────
    if (!page.title) {
      issues.push({
        id: "a11y-no-title",
        title: "Page has no document title",
        description: "The page has no <title> element. Screen readers announce the document title when loading a page.",
        severity: "high",
        recommendation: "Add a descriptive <title> element to every page.",
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
      module: "accessibility",
      status: "completed",
      score,
      issues,
      data,
      executionTimeMs: Date.now() - startTime,
    };
  },
};
