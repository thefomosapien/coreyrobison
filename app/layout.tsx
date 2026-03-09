import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  metadataBase: new URL("https://coreyrobison.com"),
  title: "Corey Robison — Product Design & Strategy Leader",
  description:
    "Product Design & Strategy Leader with 9 years building brand, product, and design systems for the military community. Now shipping AI-powered products.",
  openGraph: {
    images: [
      {
        url: "/og.jpg",
        width: 1200,
        height: 630,
        alt: "Corey Robison — Product Design & Strategy Leader",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    images: ["/og.jpg"],
  },
  icons: {
    icon: "/favicon.jpg",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Noto+Serif:ital,wght@0,400;0,500;0,600;0,700;1,400;1,600&family=Noto+Sans:ital,wght@0,300;0,400;0,500;0,600;1,400&family=Silkscreen:wght@400;700&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className="font-sans font-normal leading-relaxed">{children}</body>
    </html>
  );
}
