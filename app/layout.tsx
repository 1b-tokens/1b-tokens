import type { Metadata } from "next";
import { ClerkProvider } from "@clerk/nextjs";
import { Inter } from "next/font/google";
import { SiteHeader } from "@/components/SiteHeader";
import {
  getMetadataBase,
  getSiteOrigin,
  siteDescription,
  siteTitle,
  siteTitleShort,
} from "@/lib/site";
import "./globals.css";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  weight: ["400", "500", "700"],
});

const origin = getSiteOrigin();

export const metadata: Metadata = {
  metadataBase: getMetadataBase(),
  title: {
    default: siteTitle,
    template: `%s | ${siteTitle}`,
  },
  description: siteDescription,
  robots: {
    index: true,
    follow: true,
  },
  openGraph: {
    type: "website",
    locale: "en_US",
    url: "/",
    siteName: siteTitle,
    title: siteTitle,
    description: siteDescription,
    images: [
      {
        url: "/social-sharing-thumbnail.jpg",
        width: 1774,
        height: 887,
        alt: siteTitle,
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: siteTitle,
    description: siteDescription,
    images: ["/social-sharing-thumbnail.jpg"],
  },
};

const organizationJsonLd = {
  "@context": "https://schema.org",
  "@type": "Organization",
  name: siteTitle,
  alternateName: [siteTitleShort, "One Billion Tokens"],
  url: origin,
  description: siteDescription,
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${inter.variable} h-full scroll-smooth`}>
      <body className="min-h-full antialiased">
        <ClerkProvider
          appearance={{
            elements: {
              footerAction: "hidden",
            },
          }}
        >
          <a
            href="#main"
            className="sr-only focus:not-sr-only focus:absolute focus:left-4 focus:top-4 focus:z-50 focus:border focus:border-orange focus:bg-paper focus:px-3 focus:py-2 focus:text-sm focus:font-bold focus:text-midnight"
          >
            Skip to content
          </a>
          <SiteHeader />
          {children}
          <footer className="border-t border-white/10 bg-midnight px-5 py-8 text-paper sm:px-8">
            <div className="mx-auto flex max-w-[var(--content-max)] flex-col gap-3 text-xs font-bold uppercase tracking-[0.16em] text-paper/55 sm:flex-row sm:items-center sm:justify-between">
              <p>Copyright Juhas Digital Services s.r.o. 2026</p>
              <a
                href="https://michaljuhas.com"
                className="text-orange underline decoration-orange/40 underline-offset-4 transition-colors hover:text-paper"
                target="_blank"
                rel="noopener noreferrer"
              >
                Contact: michaljuhas.com
              </a>
            </div>
          </footer>
          <script
            type="application/ld+json"
            dangerouslySetInnerHTML={{
              __html: JSON.stringify(organizationJsonLd),
            }}
          />
        </ClerkProvider>
      </body>
    </html>
  );
}
