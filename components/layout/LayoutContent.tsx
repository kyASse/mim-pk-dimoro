import { usePathname } from "next/navigation";
import Navbar from "./Navbar";
import Footer from "./Footer";
import { ThemeProvider } from "next-themes";
import PublicMobileFloatingBar from "./PublicMobileFloatingBar";

export default function LayoutContent({ children }: { children: React.ReactNode }) {
    const pathname = usePathname();
    const hideNavbar = pathname.startsWith("/portal") || pathname.startsWith("/admin");

    return (
        <ThemeProvider
            attribute="class"
            defaultTheme="system"
            enableSystem
            disableTransitionOnChange
        >
            {!hideNavbar && <Navbar />}
            <div className={!hideNavbar ? "pb-20 md:pb-0" : ""}>
                {children}
            </div>
            {!hideNavbar && <Footer />}
            {!hideNavbar && <PublicMobileFloatingBar />}
        </ThemeProvider>
    );
}