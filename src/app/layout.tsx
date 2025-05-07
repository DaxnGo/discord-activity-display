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
  title: "Matthew | Front-End Developer",
  description: "Curious about me?",
  viewport:
    "width=device-width, initial-scale=1, maximum-scale=1, user-scalable=no",
  themeColor: "#000000",
  manifest: "/manifest.json",
  icons: {
    icon: "/images/136311199.jpeg",
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
    url: "https://jpview.vercel.app/",
    title: "Matthew | Front-End Developer",
    description: "Curious about me?",
    siteName: "Matthew | Front-End Developer",
    images: [
      {
        url: "https://jpview.vercel.app/images/136311199.jpeg",
        width: 800,
        height: 600,
        alt: "Matthew | Front-End Developer",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Matthew | Front-End Developer",
    description: "Curious about me?",
    creator: "@hellopassingby",
    images: ["https://jpview.vercel.app/images/136311199.jpeg"],
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
        <style
          dangerouslySetInnerHTML={{
            __html: `
          /* Critical CSS */
          body {
            margin: 0;
            padding: 0;
            background: #000;
            color: #fff;
            font-family: '__Inter_Fallback_725fdb', '__Inter_Fallback_Fallback_725fdb';
          }
          .loading-overlay {
            position: fixed;
            inset: 0;
            display: flex !important;
            align-items: center;
            justify-content: center;
            background: linear-gradient(to bottom, #000, #1a1a1a);
            z-index: 50;
            opacity: 1 !important;
            visibility: visible !important;
          }
          .loading-overlay h1 {
            opacity: 1 !important;
            visibility: visible !important;
            font-weight: bold;
            font-size: 3.5rem;
            color: white;
            text-shadow: 0 0 20px rgba(255, 255, 255, 0.8), 0 0 40px rgba(88, 101, 242, 0.4);
            letter-spacing: 0.02em;
          }
          .loading-overlay .glass-card {
            border: 1px solid rgba(255, 255, 255, 0.2);
            box-shadow: 0 10px 30px rgba(0, 0, 0, 0.5), 0 0 20px rgba(255, 255, 255, 0.1);
          }
          `,
          }}
        />
        {/* Additional meta tags for social media sharing */}
        <meta property="og:image:width" content="800" />
        <meta property="og:image:height" content="600" />
        <meta property="og:image:type" content="image/jpeg" />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="theme-color" content="#000000" />
      </head>
      <body
        className={`${inter.variable} font-sans antialiased`}
        suppressHydrationWarning>
        <AnimationProvider>{children}</AnimationProvider>
        <SpeedInsights />
        <Analytics />
      </body>
    </html>
  );
}
