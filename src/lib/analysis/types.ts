// Core types for the SEO analysis engine

export type Severity = 'critical' | 'high' | 'medium' | 'low' | 'info';

export type AnalysisStatus = 'pending' | 'running' | 'completed' | 'failed';

export type ModuleName =
  | 'technical'
  | 'onpage'
  | 'content'
  | 'schema'
  | 'images'
  | 'sitemap'
  | 'geo'
  | 'sxo'
  | 'performance'
  | 'pagespeed'
  | 'security'
  | 'links'
  | 'accessibility'
  | 'international'
  | 'mobile';

export interface Issue {
  id: string;
  title: string;
  description: string;
  severity: Severity;
  recommendation: string;
  element?: string; // The HTML element/selector related to the issue
  value?: string;   // The current value that caused the issue
  url?: string;     // The absolute URL of the page this issue was found on

  // Rich fix guidance fields
  codeSnippet?: {
    language: 'html' | 'css' | 'javascript' | 'json' | 'text' | 'http';
    label: string;      // e.g. "Add this to your <head>"
    code: string;        // The actual fix code
  };
  learnMoreUrl?: string;       // External documentation link
  impact?: string;             // e.g. "Improves LCP by ~200ms"
  affectedItems?: string[];    // List of specific items (up to 5 shown)
  affectedPages?: string[];    // List of page URLs where this issue occurred (when grouped)
}

export interface ModuleResult {
  module: ModuleName;
  status: AnalysisStatus;
  score: number; // 0-100
  issues: Issue[];
  data: Record<string, unknown>;
  executionTimeMs: number;
}

export interface AnalysisResult {
  id: string;
  url: string;
  status: AnalysisStatus;
  overallScore: number;
  modules: ModuleResult[];
  startedAt: string;
  completedAt?: string;
}

// Fetcher output types
export interface FetchResult {
  url: string;
  finalUrl: string; // After redirects
  statusCode: number;
  headers: Record<string, string>;
  html: string;
  redirectChain: RedirectHop[];
  responseTimeMs: number;
  robotsTxt?: string;
  sitemapXml?: string;
  llmsTxt?: string;
}

export interface RedirectHop {
  url: string;
  statusCode: number;
}

// Parser output types
export interface ParsedPage {
  url: string;
  title: string;
  metaDescription: string;
  metaRobots: string;
  canonical: string;
  viewport: string;
  charset: string;
  language: string;
  headings: HeadingInfo[];
  images: ImageInfo[];
  links: LinkInfo[];
  scripts: ScriptInfo[];
  stylesheets: StylesheetInfo[];
  schemaMarkup: SchemaInfo[];
  openGraph: Record<string, string>;
  twitterCard: Record<string, string>;
  wordCount: number;
  textContent: string;
  hreflangTags: HreflangTag[];
  favicon: string;
  generator: string;
  author: string;
  publishedDate: string;
  modifiedDate: string;
}

export interface HeadingInfo {
  level: number; // 1-6
  text: string;
}

export interface ImageInfo {
  src: string;
  alt: string;
  width: string;
  height: string;
  loading: string;
  decoding: string;
  fetchpriority: string;
  srcset: string;
  sizes: string;
  isInPicture: boolean;
  lazyMethod: 'native' | 'perfmatters' | 'ewww' | 'js-generic' | 'none';
  classes: string;
}

export interface LinkInfo {
  href: string;
  text: string;
  rel: string;
  isInternal: boolean;
  isNofollow: boolean;
  target: string;
}

export interface ScriptInfo {
  src: string;
  isAsync: boolean;
  isDefer: boolean;
  isModule: boolean;
  isInline: boolean;
  size: number;
}

export interface StylesheetInfo {
  href: string;
  media: string;
  isInline: boolean;
  size: number;
}

export interface SchemaInfo {
  type: string;
  format: 'json-ld' | 'microdata' | 'rdfa';
  raw: string;
  parsed?: Record<string, unknown>;
  errors: string[];
}

export interface HreflangTag {
  lang: string;
  href: string;
}

// Analyzer interface - all analyzers implement this
export interface Analyzer {
  name: ModuleName;
  analyze(page: ParsedPage, fetchResult: FetchResult): Promise<ModuleResult>;
}
