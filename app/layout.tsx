import type { Metadata } from "next";
import { Geist } from "next/font/google";
import ClientLayoutContent from "@/components/layout/ClientLayoutContent";
import { Toaster } from "@/components/ui/sonner";
import "./globals.css";
import Script from "next/script";
import { SCHOOL_NAME, SCHOOL_DESCRIPTION } from "@/lib/school-config";

export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000"),
  title: SCHOOL_NAME,
  description: SCHOOL_DESCRIPTION,
};

const geistSans = Geist({
  variable: "--font-geist-sans",
  display: "swap",
  subsets: ["latin"],
});

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        {process.env.NODE_ENV !== 'production' && (
          <Script
            crossOrigin="anonymous"
            src="//unpkg.com/react-scan/dist/auto.global.js"
          />
        )}
      </head>
      <body className={`${geistSans.className} antialiased`}>
        <ClientLayoutContent>{children}</ClientLayoutContent>
        <Toaster
          position="top-center"
          swipeDirections={["top", "right"]}
          closeButton={true}
        />
      </body>
    </html>
  );
}
