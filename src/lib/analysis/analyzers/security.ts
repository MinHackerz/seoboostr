import type { Analyzer, ModuleResult, Issue, ParsedPage, FetchResult } from "../types";

export const securityAnalyzer: Analyzer = {
  name: "security",
  async analyze(page: ParsedPage, fetchResult: FetchResult): Promise<ModuleResult> {
    const startTime = Date.now();
    const issues: Issue[] = [];
    const data: Record<string, unknown> = {};
    const headers = fetchResult.headers;

    // ── 1. HSTS (Strict-Transport-Security) ─────────────────────────
    const hsts = headers["strict-transport-security"];
    data.hsts = hsts || null;

    if (!hsts) {
      issues.push({
        id: "sec-no-hsts",
        title: "Missing HSTS header",
        description: "The Strict-Transport-Security header is not set. Browsers may allow HTTP downgrade attacks.",
        severity: "high",
        recommendation: "Add `Strict-Transport-Security: max-age=31536000; includeSubDomains; preload` to enforce HTTPS.",
        impact: "Without HSTS, users can be tricked into connecting over insecure HTTP via man-in-the-middle attacks.",
        codeSnippet: {
          language: "http",
          label: "Add this header to your server response:",
          code: `Strict-Transport-Security: max-age=31536000; includeSubDomains; preload`,
        },
        learnMoreUrl: "https://developer.mozilla.org/en-US/docs/Web/HTTP/Reference/Headers/Strict-Transport-Security",
      });
    } else {
      const maxAgeMatch = hsts.match(/max-age=(\d+)/i);
      const maxAge = maxAgeMatch ? parseInt(maxAgeMatch[1], 10) : 0;

      if (maxAge < 31536000) {
        issues.push({
          id: "sec-hsts-short-max-age",
          title: "HSTS max-age is too short",
          description: `HSTS max-age is ${maxAge} seconds (${Math.round(maxAge / 86400)} days). Google recommends at least 1 year (31536000 seconds).`,
          severity: "medium",
          recommendation: "Set `max-age=31536000` (1 year) or higher for effective HSTS protection.",
          value: hsts,
          codeSnippet: {
            language: "http",
            label: "Update your HSTS header:",
            code: `Strict-Transport-Security: max-age=31536000; includeSubDomains; preload`,
          },
        });
      }

      if (!/includeSubDomains/i.test(hsts)) {
        issues.push({
          id: "sec-no-hsts-subdomains",
          title: "HSTS missing includeSubDomains",
          description: "The HSTS header does not include the `includeSubDomains` directive, leaving subdomains unprotected.",
          severity: "low",
          recommendation: "Add `includeSubDomains` to your HSTS header to protect all subdomains.",
          value: hsts,
        });
      }

      if (!/preload/i.test(hsts)) {
        issues.push({
          id: "sec-no-hsts-preload",
          title: "HSTS missing preload directive",
          description: "The HSTS header does not include the `preload` directive. The site cannot be submitted to the HSTS preload list.",
          severity: "info",
          recommendation: "Add `preload` to your HSTS header and submit to hstspreload.org for browser-level enforcement.",
          value: hsts,
          learnMoreUrl: "https://hstspreload.org/",
        });
      }
    }

    // ── 2. Content-Security-Policy ──────────────────────────────────
    const csp = headers["content-security-policy"];
    data.csp = csp || null;

    if (!csp) {
      issues.push({
        id: "sec-no-csp",
        title: "Missing Content-Security-Policy header",
        description: "No CSP header detected. The site is vulnerable to XSS, clickjacking, and data injection attacks.",
        severity: "high",
        recommendation: "Implement a Content-Security-Policy header. Start with a report-only policy to avoid breakage, then enforce.",
        impact: "CSP is the most effective defense against XSS attacks, which are the #1 web vulnerability. Without it, injected scripts run unrestricted.",
        codeSnippet: {
          language: "http",
          label: "Start with a report-only policy to test without breaking your site:",
          code: `Content-Security-Policy-Report-Only: default-src 'self'; script-src 'self'; style-src 'self' 'unsafe-inline'; img-src 'self' data: https:; font-src 'self'; connect-src 'self'; report-uri /csp-report`,
        },
        learnMoreUrl: "https://developer.mozilla.org/en-US/docs/Web/HTTP/CSP",
      });
    } else {
      if (/unsafe-inline/i.test(csp)) {
        issues.push({
          id: "sec-csp-unsafe-inline",
          title: "CSP allows 'unsafe-inline'",
          description: "The Content-Security-Policy includes 'unsafe-inline', which significantly weakens XSS protection.",
          severity: "medium",
          recommendation: "Replace 'unsafe-inline' with nonce-based or hash-based CSP directives for scripts and styles.",
          value: csp.substring(0, 200),
          impact: "'unsafe-inline' allows any injected inline script to execute, negating most of CSP's XSS protection.",
        });
      }

      if (/unsafe-eval/i.test(csp)) {
        issues.push({
          id: "sec-csp-unsafe-eval",
          title: "CSP allows 'unsafe-eval'",
          description: "The Content-Security-Policy includes 'unsafe-eval', allowing dynamic code execution via eval().",
          severity: "medium",
          recommendation: "Remove 'unsafe-eval' from your CSP. Refactor code to avoid eval(), new Function(), and setTimeout with strings.",
          value: csp.substring(0, 200),
        });
      }
    }

    // ── 3. X-Content-Type-Options ───────────────────────────────────
    const xcto = headers["x-content-type-options"];
    data.xContentTypeOptions = xcto || null;

    if (!xcto) {
      issues.push({
        id: "sec-no-xcto",
        title: "Missing X-Content-Type-Options header",
        description: "Without `nosniff`, browsers may MIME-sniff responses, potentially executing malicious content.",
        severity: "medium",
        recommendation: "Add `X-Content-Type-Options: nosniff` to prevent MIME-type sniffing attacks.",
        codeSnippet: {
          language: "http",
          label: "Add this header to your server response:",
          code: `X-Content-Type-Options: nosniff`,
        },
      });
    }

    // ── 4. X-Frame-Options ──────────────────────────────────────────
    const xfo = headers["x-frame-options"];
    data.xFrameOptions = xfo || null;

    if (!xfo) {
      issues.push({
        id: "sec-no-xfo",
        title: "Missing X-Frame-Options header",
        description: "The site can be embedded in iframes on other domains, making it vulnerable to clickjacking attacks.",
        severity: "medium",
        recommendation: "Add `X-Frame-Options: DENY` or `SAMEORIGIN` to prevent clickjacking. Also consider using CSP `frame-ancestors`.",
        codeSnippet: {
          language: "http",
          label: "Add this header to prevent iframe embedding:",
          code: `X-Frame-Options: SAMEORIGIN`,
        },
      });
    }

    // ── 5. Referrer-Policy ──────────────────────────────────────────
    const referrerPolicy = headers["referrer-policy"];
    data.referrerPolicy = referrerPolicy || null;

    if (!referrerPolicy) {
      issues.push({
        id: "sec-no-referrer-policy",
        title: "Missing Referrer-Policy header",
        description: "Without a Referrer-Policy, the full URL (including query parameters) may be sent to third-party sites.",
        severity: "medium",
        recommendation: "Add `Referrer-Policy: strict-origin-when-cross-origin` or `no-referrer-when-downgrade`.",
        codeSnippet: {
          language: "http",
          label: "Add this header to control referrer information:",
          code: `Referrer-Policy: strict-origin-when-cross-origin`,
        },
      });
    }

    // ── 6. Permissions-Policy ───────────────────────────────────────
    const permPolicy = headers["permissions-policy"] || headers["feature-policy"];
    data.permissionsPolicy = permPolicy || null;

    if (!permPolicy) {
      issues.push({
        id: "sec-no-permissions-policy",
        title: "Missing Permissions-Policy header",
        description: "No Permissions-Policy (formerly Feature-Policy) is set. Browser features like camera, microphone, and geolocation are unrestricted.",
        severity: "medium",
        recommendation: "Add a `Permissions-Policy` header to restrict browser API access, e.g. `camera=(), microphone=(), geolocation=()`.",
        codeSnippet: {
          language: "http",
          label: "Add this header to restrict sensitive browser APIs:",
          code: `Permissions-Policy: camera=(), microphone=(), geolocation=(), payment=(), usb=()`,
        },
        learnMoreUrl: "https://developer.mozilla.org/en-US/docs/Web/HTTP/Reference/Headers/Permissions-Policy",
      });
    }

    // ── 7. Server information leakage ───────────────────────────────
    const serverHeader = headers["server"];
    data.serverHeader = serverHeader || null;

    if (serverHeader && /\d/.test(serverHeader)) {
      issues.push({
        id: "sec-server-info-leak",
        title: "Server header reveals version information",
        description: `The Server header exposes "${serverHeader}", which helps attackers identify known vulnerabilities.`,
        severity: "low",
        recommendation: "Remove version numbers from the Server header or suppress it entirely.",
        value: serverHeader,
        impact: "Exposing server software versions helps attackers target specific CVEs for your server/framework version.",
      });
    }

    // ── 8. X-Powered-By leakage ─────────────────────────────────────
    const xPoweredBy = headers["x-powered-by"];
    data.xPoweredBy = xPoweredBy || null;

    if (xPoweredBy) {
      issues.push({
        id: "sec-x-powered-by-leak",
        title: "X-Powered-By header exposes technology stack",
        description: `The X-Powered-By header reveals "${xPoweredBy}". This information helps attackers target known framework vulnerabilities.`,
        severity: "low",
        recommendation: "Remove the X-Powered-By header. In Express.js use `app.disable('x-powered-by')`. In Next.js set `poweredByHeader: false` in next.config.",
        value: xPoweredBy,
        codeSnippet: xPoweredBy.toLowerCase().includes("next") ? {
          language: "javascript",
          label: "Disable in your next.config.js:",
          code: `/** @type {import('next').NextConfig} */\nconst nextConfig = {\n  poweredByHeader: false,\n};\n\nmodule.exports = nextConfig;`,
        } : xPoweredBy.toLowerCase().includes("express") ? {
          language: "javascript",
          label: "Disable in your Express app:",
          code: `app.disable('x-powered-by');`,
        } : undefined,
      });
    }

    // ── 9. Mixed content detection ──────────────────────────────────
    const isHttps = fetchResult.finalUrl.startsWith("https://");
    if (isHttps) {
      const html = fetchResult.html;
      // Check for HTTP resources in the HTML (basic heuristic)
      const httpResourcePatterns = [
        /src=["']http:\/\//gi,
        /href=["']http:\/\/[^"']*\.(css|js)/gi,
        /url\(["']?http:\/\//gi,
      ];

      let mixedContentCount = 0;
      for (const pattern of httpResourcePatterns) {
        const matches = html.match(pattern);
        if (matches) mixedContentCount += matches.length;
      }

      data.mixedContentCount = mixedContentCount;

      if (mixedContentCount > 0) {
        issues.push({
          id: "sec-mixed-content",
          title: "Mixed content detected",
          description: `Found ${mixedContentCount} HTTP resource(s) on an HTTPS page. Browsers may block these resources or show security warnings.`,
          severity: "high",
          recommendation: "Update all resource URLs to use HTTPS. Use protocol-relative URLs or update CDN references.",
          value: `${mixedContentCount} HTTP resources on HTTPS page`,
          impact: "Browsers block mixed content by default, causing broken images, scripts, or styles. Chrome shows a 'Not Secure' warning.",
        });
      }
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
      module: "security",
      status: "completed",
      score,
      issues,
      data,
      executionTimeMs: Date.now() - startTime,
    };
  },
};
