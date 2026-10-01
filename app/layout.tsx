import type { Metadata, Viewport } from "next";
import {
  Inter,
  Space_Grotesk,
  Geist_Mono,
  Plus_Jakarta_Sans,
  Noto_Sans_SC,
  Noto_Sans_TC,
  Noto_Sans_JP,
  Noto_Sans_KR,
  Noto_Sans_Thai,
} from "next/font/google";
import { CommandPalette } from "@/app/components/CommandPalette";
import { CursorGlow } from "@/app/components/CursorGlow";
import { SiteAtmosphere } from "@/app/components/SiteAtmosphere";
import { FilmGrain } from "@/app/components/FilmGrain";
import { JoinModal } from "@/app/components/JoinFlow";
import { LocaleSync } from "@/app/components/LocaleSync";
import { ThemeSync } from "@/app/components/ThemeSync";
import { SiteFooter } from "@/app/components/SiteFooter";
import { SiteHeader } from "@/app/components/SiteHeader";
import { links } from "@/lib/site";
import { getAllPosts } from "@/lib/posts";
import { seo, siteUrl } from "@/lib/seo";
import "./globals.css";

const inter = Inter({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-inter",
});

const space = Space_Grotesk({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-space",
});

const geistMono = Geist_Mono({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-geist-mono",
});

const jakarta = Plus_Jakarta_Sans({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-jakarta",
});

const notoSc = Noto_Sans_SC({
  subsets: ["latin"],
  weight: ["400", "600", "700"],
  display: "swap",
  variable: "--font-noto-sc",
  preload: false,
  adjustFontFallback: false,
});

const notoTc = Noto_Sans_TC({
  subsets: ["latin"],
  weight: ["400", "600", "700"],
  display: "swap",
  variable: "--font-noto-tc",
  preload: false,
  adjustFontFallback: false,
});

const notoJp = Noto_Sans_JP({
  subsets: ["latin"],
  weight: ["400", "600", "700"],
  display: "swap",
  variable: "--font-noto-jp",
  preload: false,
  adjustFontFallback: false,
});

const notoKr = Noto_Sans_KR({
  subsets: ["latin"],
  weight: ["400", "600", "700"],
  display: "swap",
  variable: "--font-noto-kr",
  preload: false,
  adjustFontFallback: false,
});

const notoThai = Noto_Sans_Thai({
  subsets: ["latin", "thai"],
  weight: ["400", "600", "700"],
  display: "swap",
  variable: "--font-noto-thai",
  preload: false,
  adjustFontFallback: false,
});

const description = "Hong Kong. Builds AI. Walks the rest. m1zwell.";

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  applicationName: "Yok Zhang",
  authors: [{ name: "Yok Zhang" }],
  ...seo({
    title: "Yok Zhang",
    description,
    path: "/",
  }),
  title: {
    default: "Yok Zhang",
    template: "%s · Yok Zhang",
  },
};

export const viewport: Viewport = {
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#F3EFE6" },
    { media: "(prefers-color-scheme: dark)", color: "#0A1F1D" },
  ],
  width: "device-width",
  initialScale: 1,
  viewportFit: "cover",
};

const jsonLd = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "WebSite",
      "@id": `${siteUrl}/#website`,
      url: siteUrl,
      name: "ichina.co",
      alternateName: ["Yok Zhang", "m1zwell"],
      description,
      inLanguage: ["en", "zh-Hans", "zh-Hant", "ja", "ko", "th", "nl"],
      publisher: { "@id": `${siteUrl}/#person` },
    },
    {
      "@type": "Person",
      "@id": `${siteUrl}/#person`,
      name: "Yok Zhang",
      alternateName: "m1zwell",
      url: siteUrl,
      sameAs: [links.github],
      jobTitle: "Builder",
      homeLocation: {
        "@type": "Place",
        name: "Hong Kong",
      },
    },
  ],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const posts = getAllPosts();
  const fontVars = [
    inter.variable,
    space.variable,
    geistMono.variable,
    jakarta.variable,
    notoSc.variable,
    notoTc.variable,
    notoJp.variable,
    notoKr.variable,
    notoThai.variable,
  ].join(" ");

  return (
    <html lang="en" className={`dark ${fontVars}`} data-atmosphere="harbour-night">
      <head>
        <script
          dangerouslySetInnerHTML={{
            __html: `(function(){try{var t=localStorage.getItem("theme");if(t!=="light")t="dark";var a=localStorage.getItem("atmosphere");if(a!=="peak-mist"&&a!=="neon-terminal"&&a!=="bone-day")a="harbour-night";var r=document.documentElement;r.classList.remove("light","dark");r.classList.add(t);r.style.colorScheme=t;r.dataset.atmosphere=a;}catch(e){}})();`,
          }}
        />
        <link rel="alternate" type="application/rss+xml" title="Yok Zhang" href={`${siteUrl}/feed.xml`} />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
      </head>
      <body className="min-h-dvh font-sans text-fg antialiased">
        <SiteAtmosphere />
        <ThemeSync />
        <LocaleSync />
        <div className="relative z-10">
          <a
            href="#content"
            className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-50 focus:rounded-xl focus:bg-accent focus:px-3 focus:py-2 focus:text-bg"
          >
            Skip to content
          </a>
          <SiteHeader />
          <div id="content">{children}</div>
          <SiteFooter />
        </div>
        <FilmGrain />
        <CursorGlow />
        <JoinModal />
        <CommandPalette posts={posts} />
      </body>
    </html>
  );
}
