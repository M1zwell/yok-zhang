import type { Metadata, Viewport } from "next";
import { Inter, Space_Grotesk, Geist_Mono } from "next/font/google";
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

const description =
  "Hong Kong. Builds AI. Lives the rest. m1zwell.";

export const metadata: Metadata = {
  title: "Yok Zhang",
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
  return (
    <html
      lang="en"
      className={`dark ${inter.variable} ${space.variable} ${geistMono.variable}`}
    >
      <body className="min-h-dvh bg-bg font-sans text-fg antialiased">
        {children}
      </body>
    </html>
  );
}
