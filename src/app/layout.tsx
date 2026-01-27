import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "RemLab Status",
  description: "Service status and uptime monitoring for RemLab infrastructure",
  icons: {
    icon: "/favicon.ico",
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
        <link
          rel="preconnect"
          href="https://fonts.googleapis.com"
          crossOrigin="anonymous"
        />
        <link
          rel="preconnect"
          href="https://fonts.gstatic.com"
          crossOrigin="anonymous"
        />
        <link
          href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className="min-h-screen">
        <div className="max-w-4xl mx-auto px-4 py-8 sm:px-6 sm:py-12">
          {children}
        </div>
      </body>
    </html>
  );
}
