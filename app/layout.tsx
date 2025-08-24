import "./globals.css";
import { TailwindIndicator } from "../components/TailwindIndicator";
import { ThemeProvider } from "../components/ThemeProvider";
import SiteHeader from "../components/SiteHeader";
import SessionCheck from "../components/SessionCheck";
import LoadingHome from "./loading";
import { Suspense } from "react";
import { Metadata } from "next";
import { siteConfig } from "../constants/siteConfig";
import { GoogleAnalytics } from "@next/third-parties/google";
import { Analytics } from "@vercel/analytics/react";
import { SpeedInsights } from "@vercel/speed-insights/next";

export const metadata: Metadata = {
  title: {
    default: siteConfig.name,
    template: `${siteConfig.name} | %s`,
  },
  description: siteConfig.description,
  icons: [
    {
      rel: "icon",
      type: "image/png",
      sizes: "32x32",
      url: "/favicon-32x32.png",
    },
    {
      rel: "icon",
      type: "image/png",
      sizes: "96x96",
      url: "/favicon-96x96.png",
    },
    {
      rel: "icon",
      type: "image/png",
      sizes: "16x16",
      url: "/favicon-16x16.png",
    },
    { rel: "manifest", url: "/manifest.json" },
    { rel: "apple-touch-icon", sizes: "57x57", url: "/apple-icon-57x57.png" },
    { rel: "apple-touch-icon", sizes: "60x60", url: "/apple-icon-60x60.png" },
    { rel: "apple-touch-icon", sizes: "72x72", url: "/apple-icon-72x72.png" },
    { rel: "apple-touch-icon", sizes: "76x76", url: "/apple-icon-76x76.png" },
    {
      rel: "apple-touch-icon",
      sizes: "114x114",
      url: "/apple-icon-114x114.png",
    },
    {
      rel: "apple-touch-icon",
      sizes: "120x120",
      url: "/apple-icon-120x120.png",
    },
    {
      rel: "apple-touch-icon",
      sizes: "144x144",
      url: "/apple-icon-144x144.png",
    },
    {
      rel: "apple-touch-icon",
      sizes: "152x152",
      url: "/apple-icon-152x152.png",
    },
    {
      rel: "apple-touch-icon",
      sizes: "180x180",
      url: "/apple-icon-180x180.png",
    },
    {
      rel: "icon",
      type: "image/png",
      sizes: "192x192",
      url: "/android-icon-192x192.png",
    },
    {
      rel: "icon",
      type: "image/png",
      sizes: "32x32",
      url: "/favicon-32x32.png",
    },
    {
      rel: "icon",
      type: "image/png",
      sizes: "96x96",
      url: "/favicon-96x96.png",
    },
    {
      rel: "icon",
      type: "image/png",
      sizes: "16x16",
      url: "/favicon-16x16.png",
    },
    { rel: "manifest", url: "/manifest.json" },
  ],
  openGraph: {
    title: {
      default: siteConfig.name,
      template: `${siteConfig.name} | %s`,
    },
    description: siteConfig.description,
    url: `https://${siteConfig.domain}`,
    siteName: siteConfig.name,
    type: "website",
    images: [
      {
        url: `https://${siteConfig.domain}/og-image.png`,
        width: 1200,
        height: 630,
        alt: siteConfig.name,
      },
    ],
  },
  twitter: {
    images: [`https://${siteConfig.domain}/og-image.png`],
    card: "summary_large_image",
    title: {
      default: siteConfig.name,
      template: `${siteConfig.name} | %s`,
    },
    description: siteConfig.description,
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      suppressHydrationWarning
    >
      <head>
        <link
          rel="stylesheet"
          as="style"
          crossOrigin=""
          href="https://cdn.jsdelivr.net/gh/orioncactus/pretendard@v1.3.9/dist/web/variable/pretendardvariable-dynamic-subset.min.css"
        />
        {process.env.NODE_ENV === "production" && (
          <GoogleAnalytics gaId="G-DCEDCJ9EXD" />
        )}
      </head>
      <body className={`antialiased`}>
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          <Suspense fallback={<LoadingHome />}>
            <SessionCheck>
              <div className="relative flex min-h-screen flex-col bg-background">
                <SiteHeader />
                <main className="flex-1 flex">{children}</main>
                <TailwindIndicator />
              </div>
            </SessionCheck>
          </Suspense>
        </ThemeProvider>
        {process.env.NODE_ENV === "production" && <Analytics />}
        {process.env.NODE_ENV === "production" && <SpeedInsights />}
      </body>
    </html>
  );
}
