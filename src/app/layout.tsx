import "./globals.css";
import type { Metadata } from "next";
import { Inter } from "next/font/google";
import { AnimationProvider } from "@/context/AnimationContext";
import { SpeedInsights } from "@vercel/speed-insights/next";
import { Analytics } from "@vercel/analytics/next";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
});

export const metadata: Metadata = {
  title: "Matthew's Portfolio",
  description: "Personal portfolio and space",
  viewport:
    "width=device-width, initial-scale=1, maximum-scale=1, user-scalable=no",
  themeColor: "#000000",
  manifest: "/manifest.json",
  icons: {
    icon: "/favicon.ico",
  },
  appleWebApp: {
    capable: true,
    statusBarStyle: "black-translucent",
    title: "Matthew | Developer",
  },
  other: {
    "mobile-web-app-capable": "yes",
  },
  openGraph: {
    type: "website",
    locale: "en_US",
    url: "https://matthew-dev.io/",
    title: "Matthew | Front-End Developer",
    description: "Personal portfolio website showcasing my work and skills.",
    siteName: "Matthew | Front-End Developer",
  },
  twitter: {
    card: "summary_large_image",
    title: "Matthew | Front-End Developer",
    description: "Personal portfolio website showcasing my work and skills.",
    creator: "@hellopassingby",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="scroll-smooth" suppressHydrationWarning>
      <head>
        <link
          rel="preload"
          href="https://avatars.githubusercontent.com/u/83614613?v=4"
          as="image"
          type="image/jpeg"
        />
        <link
          rel="preload"
          href="/images/poster.jpg"
          as="image"
          type="image/jpeg"
        />
        <style>{`
          /* Critical CSS */
          body {
            margin: 0;
            padding: 0;
            background: #000;
            color: #fff;
            font-family: ${inter.style.fontFamily};
          }
          .loading-overlay {
            position: fixed;
            inset: 0;
            display: flex;
            align-items: center;
            justify-content: center;
            background: linear-gradient(to bottom, #000, #1a1a1a);
            z-index: 50;
          }
        `}</style>
      </head>
      <body className={`${inter.variable} font-sans antialiased`}>
        <AnimationProvider>{children}</AnimationProvider>
        <SpeedInsights />
        <Analytics />
      </body>
    </html>
  );
}
