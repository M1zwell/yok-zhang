import type { Metadata, Viewport } from "next";
import { Inter, Space_Grotesk, Geist_Mono, Plus_Jakarta_Sans } from "next/font/google";
import { CommandPalette } from "@/app/components/CommandPalette";
import { CursorGlow } from "@/app/components/CursorGlow";
import { FilmGrain } from "@/app/components/FilmGrain";
import { SiteFooter } from "@/app/components/SiteFooter";
import { SiteHeader } from "@/app/components/SiteHeader";
import { getAllPosts } from "@/lib/posts";
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

const description = "Hong Kong. Builds AI. Lives the rest. m1zwell.";

export const metadata: Metadata = {
  title: {
    default: "Yok Zhang",
    template: "%s · Yok Zhang",
  },
  description,
  applicationName: "Yok Zhang",
  authors: [{ name: "Yok Zhang" }],
  openGraph: {
    title: "Yok Zhang",
    description,
    type: "website",
    locale: "en",
  },
  twitter: {
    card: "summary_large_image",
    title: "Yok Zhang",
    description,
  },
};

export const viewport: Viewport = {
  themeColor: "#0B2422",
  width: "device-width",
  initialScale: 1,
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const posts = getAllPosts();

  return (
    <html
      lang="en"
      className={`dark ${inter.variable} ${space.variable} ${geistMono.variable} ${jakarta.variable}`}
    >
      <body className="min-h-dvh bg-bg font-sans text-fg antialiased">
        <FilmGrain />
        <CursorGlow />
        <a
          href="#content"
          className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-50 focus:rounded-xl focus:bg-accent focus:px-3 focus:py-2 focus:text-bg"
        >
          Skip to content
        </a>
        <SiteHeader />
        <div id="content">{children}</div>
        <SiteFooter />
        <CommandPalette posts={posts} />
      </body>
    </html>
  );
}
