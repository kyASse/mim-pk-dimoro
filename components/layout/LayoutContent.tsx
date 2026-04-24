import { usePathname } from "next/navigation";
import Navbar from "./Navbar";
import Footer from "./Footer";
import { ThemeProvider } from "next-themes";

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
            {children}
            {!hideNavbar && <Footer />}
        </ThemeProvider>
    );
}