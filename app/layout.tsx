import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Corey Robison — Product Designer",
  description:
    "Sr. Product Designer with 9 years of deep product ownership at WeSalute. I design things that make life easier for people.",
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
          href="https://fonts.googleapis.com/css2?family=DM+Serif+Display:ital@0;1&family=DM+Sans:ital,opsz,wght@0,9..40,300;0,9..40,400;0,9..40,500;1,9..40,300;1,9..40,400&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className="font-sans font-normal leading-relaxed">{children}</body>
    </html>
  );
}
