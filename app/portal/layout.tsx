import type { Metadata } from "next";
import { Geist } from "next/font/google";
import { ThemeProvider } from "next-themes";
import PortalNavbar from "@/components/portal/portalNavbar";

const defaultUrl = process.env.VERCEL_URL
    ? `https://${process.env.VERCEL_URL}/portal/`
    : "http://localhost:3000/portal/";

export const metadata: Metadata = {
    metadataBase: new URL(defaultUrl),
    title: "Portal TK ABA Mertosanan",
    description: "Portal untuk orang tua murid TK ABA Mertosanan",
}

const geistSans = Geist({
    variable: "--font-geist-sans",
    display: "swap",
    subsets: ["latin"],
});

export default function PortalLayout({
    children,
}: Readonly<{
    children: React.ReactNode
}>) {
    return (
        <div className={`${geistSans.className} antialiased scroll-smooth`}>
            <ThemeProvider
                attribute="class"
                defaultTheme="system"
                enableSystem
                disableTransitionOnChange
            >
                <PortalNavbar />
                <div className="min-h-screen">
                    <main>
                        {children}
                    </main>
                </div>
            </ThemeProvider>
        </div>
    );
}

