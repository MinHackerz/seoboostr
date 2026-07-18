import type { Metadata } from "next";
import { Providers } from "@/components/Providers";
import "./globals.css";

export const metadata: Metadata = {
  title: "SEO Optimised — 18-Module Parallel SEO Audit in Seconds",
  description:
    "Run a free, instant SEO audit across 18 modules simultaneously: technical SEO, schema markup, content E-E-A-T, Core Web Vitals, security headers, accessibility, AI visibility, and more. One URL. One scored report.",
  icons: {
    icon: "/logo.png",
    apple: "/logo.png",
  },
  openGraph: {
    title: "SEO Optimised — 18-Module Parallel SEO Audit in Seconds",
    description: "Run a free, instant SEO audit across 18 modules simultaneously: technical SEO, schema markup, content E-E-A-T, Core Web Vitals, security headers, accessibility, AI visibility, and more.",
    url: "https://seoptimised.com",
    siteName: "SEO Optimised",
    type: "website",
    images: [
      {
        url: "/og-image.png",
        width: 1200,
        height: 630,
        alt: "SEO Optimised — 18-Module Parallel SEO Audit in Seconds. Run free technical SEO, Core Web Vitals, Schema markup, and Content E-E-A-T audits.",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "SEO Optimised — 18-Module Parallel SEO & GEO Audit",
    description: "Run a free, instant SEO audit across 18 modules simultaneously: technical SEO, schema markup, content E-E-A-T, Core Web Vitals, security headers, accessibility, AI visibility, and more.",
    creator: "@menajulm",
    images: ["/og-image.png"],
  }
};

const jsonLd = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "SoftwareApplication",
      "@id": "https://seoptimised.com/#software",
      "name": "SEO Optimised",
      "url": "https://seoptimised.com",
      "applicationCategory": "BusinessApplication",
      "operatingSystem": "All",
      "offers": {
        "@type": "Offer",
        "price": "0.00",
        "priceCurrency": "USD"
      },
      "description": "Run a free, instant SEO audit across 18 modules simultaneously: technical SEO, schema markup, content E-E-A-T, Core Web Vitals, security headers, accessibility, AI visibility, and more."
    },
    {
      "@type": "FAQPage",
      "@id": "https://seoptimised.com/#faq",
      "mainEntity": [
        {
          "@type": "Question",
          "name": "Is this actually free?",
          "acceptedAnswer": {
            "@type": "Answer",
            "text": "Yes. Run unlimited audits, see your overall score and partial results — no card, no trial expiry. The full 18-module report with issue-level detail is behind a free account."
          }
        },
        {
          "@type": "Question",
          "name": "What data do you store?",
          "acceptedAnswer": {
            "@type": "Answer",
            "text": "The URL you submit, the audit results, and your account email if you sign up. We don't install trackers on your site, don't store your page content, and don't sell data."
          }
        },
        {
          "@type": "Question",
          "name": "Can I run it on client sites?",
          "acceptedAnswer": {
            "@type": "Answer",
            "text": "Absolutely. It only needs a public URL — no code access, no DNS changes, no JavaScript snippets. Run it on your clients' sites, competitors' sites, or that side project you haven't touched in months."
          }
        }
      ]
    }
  ]
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link
          rel="preconnect"
          href="https://fonts.gstatic.com"
          crossOrigin="anonymous"
        />
        {/* eslint-disable-next-line @next/next/no-page-custom-font */}
        <link
          href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800;900&family=JetBrains+Mono:wght@400;500;600;700&display=swap"
          rel="stylesheet"
        />
        <link rel="icon" href="/logo.png" type="image/png" />
        <script dangerouslySetInnerHTML={{ __html: `
          (function() {
            try {
              const savedTheme = localStorage.getItem('theme');
              const theme = savedTheme || 'dark';
              if (theme === 'dark') {
                document.documentElement.classList.add('dark');
              } else {
                document.documentElement.classList.remove('dark');
              }
            } catch (e) {}
          })();
        `}} />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
      </head>
      <body className="min-h-screen bg-background text-foreground">
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
