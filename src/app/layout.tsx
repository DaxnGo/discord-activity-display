import "./globals.css";
import type { Metadata } from "next";
import { Inter } from "next/font/google";
import { AnimationProvider } from "@/context/AnimationContext";
import { SpeedInsights } from "@vercel/speed-insights/next";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
});

export const metadata: Metadata = {
  title: "Matthew | Front-End Developer",
  description: "Personal portfolio website showcasing my work and skills.",
  icons: {
    icon: [{ url: "/favicon.ico", sizes: "any" }],
    shortcut: "/favicon.ico",
  },
  manifest: "/site.webmanifest",
  themeColor: "#000000",
  viewport: {
    width: "device-width",
    initialScale: 1,
    minimumScale: 1,
    maximumScale: 1,
    userScalable: false,
    viewportFit: "cover",
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
    <html lang="en" suppressHydrationWarning>
      <head>
        {/* Simplify the favicon implementation */}
        <link href="/favicon.ico" rel="icon" type="image/x-icon" />
        <meta name="mobile-web-app-capable" content="yes" />
      </head>
      <body className={`${inter.variable} font-sans antialiased`}>
        <AnimationProvider>{children}</AnimationProvider>
        <SpeedInsights />
      </body>
    </html>
  );
}
