import type { Metadata } from "next";
import { GeistSans } from "geist/font/sans";
import { GeistMono } from "geist/font/mono";
import Script from "next/script";
import "./globals.css";
import ClientLayout from "./clientLayout";

export const metadata: Metadata = {
  title: "Velosta",
  description:
    "Search, compare and book 15,000+ multiday tours all over the world. Plan your trip with Velosta AI — built by travelers, for travelers.",
  icons: {
    icon: "/favicon.ico",
  },
  openGraph: {
    title: "Velosta",
    description:
      "Search, compare and book 15,000+ multiday tours all over the world. Tours and trip packages, globally.",
    url: "https://velosta.com",
    siteName: "Velosta",
    images: [
      {
        url: "https://velosta.com/logo.png", // ✅ your logo or preview image
        width: 800,
        height: 600,
        alt: "Velosta Logo",
      },
    ],
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Velosta",
    description:
      "Search, compare and book 15,000+ multiday tours all over the world. Plan your trip with Velosta AI.",
    images: ["https://velosta.com/logo.png"],
  },
  other: {
    "google-site-verification": "G7OiI7ff-lSIWayJpfgC1so8g5lPdEmAFETV3ZPkShs",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <head>
        {/* ✅ Google Analytics */}
        <Script
          strategy="afterInteractive"
          src="https://www.googletagmanager.com/gtag/js?id=G-Q0RL3N9Q6K"
        />
        <Script id="google-analytics" strategy="afterInteractive">
          {`
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());
            gtag('config', 'G-Q0RL3N9Q6K');
          `}
        </Script>

        {/* ✅ Structured Data for Organization (helps logo appear in search) */}
        <Script
          id="structured-data"
          type="application/ld+json"
          strategy="afterInteractive"
        >
          {`
            {
              "@context": "https://schema.org",
              "@type": "Organization",
              "name": "Velosta",
              "url": "https://velosta.com",
              "logo": "https://velosta.com/logo.png",
              "sameAs": [
                "https://www.instagram.com/velosta",
                "https://www.linkedin.com/company/velosta"
              ]
            }
          `}
        </Script>
      </head>

      <body className={`${GeistSans.variable} ${GeistMono.variable}`}>
        <ClientLayout>{children}</ClientLayout>
      </body>
    </html>
  );
}
