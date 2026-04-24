"use client"

import { useState, useEffect } from "react";
import { usePathname } from "next/navigation";
import { Button } from "@/components/ui/button";
import LogoutButton from "@/components/logout-button";
import Link from "next/link";
import Image from "next/image"; 
import { motion, AnimatePresence } from "motion/react";
import { cn } from "@/lib/utils";
import { Menu, X } from "lucide-react";

// Navigation items configuration
const navigationItems: Array<{ href: string; label: string; exact?: boolean }> = [
    { href: "/portal", label: "Beranda", exact: true },
    { href: "/portal/akademik", label: "Akademik" },
    { href: "/portal/laporan", label: "Laporan" },
    { href: "/portal/pengumuman", label: "Pengumuman" },
    { href: "/portal/keuangan", label: "Keuangan" },
    { href: "/portal/testimoni", label: "Testimoni" },
];

export default function PortalNavbar() {
    const [scrolled, setScrolled] = useState(false);
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
    const pathname = usePathname();

    // Handle scroll effect
    useEffect(() => {
        const handleScroll = () => {
            setScrolled(window.scrollY > 20);
        };

        window.addEventListener("scroll", handleScroll);
        return () => window.removeEventListener("scroll", handleScroll);
    }, []);

    // Close mobile menu on route change
    useEffect(() => {
        setIsMobileMenuOpen(false);
    }, [pathname]);

    // Check if navigation item is active
    const isActiveLink = (href: string, exact?: boolean) => {
        if (exact) return pathname === href;
        return pathname?.startsWith(href) && href !== "/portal";
    };

    return (
        <header className={cn(
            "w-full transition-all duration-300",
            scrolled
                ? "bg-white/95 dark:bg-gray-900/95 backdrop-blur-md shadow-lg border-b border-gray-200/20"
                : "bg-transparent"
        )}>
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex items-center justify-between h-16 md:h-20 py-4">
                    {/* Logo Section */}
                    <Link href="/" className="flex items-center gap-3 group">
                        <motion.div
                            className="relative bg-white p-2 rounded-xl shadow-md group-hover:shadow-lg transition-shadow"
                            whileHover={{ rotate: 5, scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                        >
                            <Image
                                src="/Logo-TK-ABA.png"
                                alt="TK ABA Mertosanan"
                                width={40}
                                height={40}
                                className="object-contain"
                                priority
                            />
                        </motion.div>
                        <div className="hidden sm:block">
                            <h1 className="text-xl md:text-2xl font-bold text-gray-900 dark:text-white">
                                Portal TK ABA
                            </h1>
                            <p className="text-sm md:text-base text-gray-600 dark:text-gray-300 font-medium">
                                Mertosanan
                            </p>
                        </div>
                    </Link>

                    {/* Desktop Navigation */}
                    <nav className="hidden lg:flex items-center gap-1">
                        {navigationItems.map(({ href, label, exact }) => (
                            <Link
                                key={href}
                                href={href}
                                className={cn(
                                    "relative px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200",
                                    "hover:bg-gray-100 dark:hover:bg-gray-800",
                                    isActiveLink(href, exact)
                                        ? "text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-950/50"
                                        : "text-gray-700 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white"
                                )}
                            >
                                {label}
                                {isActiveLink(href, exact) && (
                                    <motion.div
                                        className="absolute bottom-0 left-0 right-0 h-0.5 bg-blue-600 dark:bg-blue-400"
                                        layoutId="activeTab"
                                        initial={{ opacity: 0 }}
                                        animate={{ opacity: 1 }}
                                        transition={{ duration: 0.2 }}
                                    />
                                )}
                            </Link>
                        ))}
                    </nav>

                    {/* Right Section */}
                    <div className="flex items-center gap-3">
                        {/* Desktop Logout */}
                        <div className="hidden lg:block">
                            <LogoutButton />
                        </div>

                        {/* Mobile Menu Button */}
                        <Button
                            variant="ghost"
                            size="sm"
                            className="lg:hidden"
                            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                            aria-label="Toggle mobile menu"
                        >
                            <motion.div
                                animate={{ rotate: isMobileMenuOpen ? 180 : 0 }}
                                transition={{ duration: 0.2 }}
                            >
                                {isMobileMenuOpen ? (
                                    <X className="h-5 w-5" />
                                ) : (
                                    <Menu className="h-5 w-5" />
                                )}
                            </motion.div>
                        </Button>
                    </div>
                </div>

                {/* Mobile Menu */}
                <AnimatePresence>
                    {isMobileMenuOpen && (
                        <motion.div
                            initial={{ opacity: 0, height: 0 }}
                            animate={{ opacity: 1, height: "auto" }}
                            exit={{ opacity: 0, height: 0 }}
                            transition={{ duration: 0.2 }}
                            className="lg:hidden border-t border-gray-200/20 bg-white/95 dark:bg-gray-900/95 backdrop-blur-md"
                        >
                            <nav className="py-4 space-y-1">
                                {navigationItems.map(({ href, label, exact }) => (
                                    <Link
                                        key={href}
                                        href={href}
                                        className={cn(
                                            "block px-4 py-3 rounded-lg text-base font-medium transition-colors",
                                            isActiveLink(href, exact)
                                                ? "text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-950/50"
                                                : "text-gray-700 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white hover:bg-gray-100 dark:hover:bg-gray-800"
                                        )}
                                    >
                                        {label}
                                    </Link>
                                ))}
                                <div className="pt-3 border-t border-gray-200/20">
                                    <LogoutButton />
                                </div>
                            </nav>
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>
        </header>
    );
}