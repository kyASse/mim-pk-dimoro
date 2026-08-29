"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { Menu, X, LogIn, Sparkles } from "lucide-react";
import { cn } from "@/lib/utils";
import { motion } from "motion/react";
import { ThemeSwitcher } from "@/components/theme-switcher";
import { Button } from "@/components/ui/button";
import { SCHOOL_NAME, SCHOOL_LOGO_PATH, SCHOOL_LOGO_ALT } from "@/lib/school-config";
import MobileMenuOverlay, { publicNavLinks } from "./MobileMenuOverlay";

export default function Navbar() {
    const [isOpen, setIsOpen] = useState(false);
    const pathname = usePathname();

    // Close mobile menu when route changes
    useEffect(() => {
        setIsOpen(false);
    }, [pathname]);

    return (
        <>
            <header className="sticky top-3 z-50 mx-auto w-[calc(100%-1.5rem)] max-w-7xl rounded-full backdrop-blur-2xl bg-background/85 dark:bg-gray-950/85 border border-border/50 shadow-lg px-4 sm:px-6 py-2 transition-all duration-300">
                <div className="flex items-center justify-between gap-2">
                    {/* School Logo & Brand Name */}
                    <Link href="/" className="flex items-center space-x-2.5 shrink-0 group">
                        <motion.div
                            className="bg-white dark:bg-gray-900 p-1.5 rounded-full overflow-hidden shadow-sm border border-border/40"
                            whileHover={{ rotate: 5, scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                        >
                            <Image
                                src={SCHOOL_LOGO_PATH}
                                alt={SCHOOL_LOGO_ALT}
                                width={28}
                                height={28}
                                className="object-contain size-7"
                                unoptimized
                                priority
                            />
                        </motion.div>
                        <div className="flex flex-col">
                            <span className="text-sm sm:text-base font-bold text-foreground tracking-tight leading-none group-hover:text-primary transition-colors">
                                {SCHOOL_NAME}
                            </span>
                        </div>
                    </Link>

                    {/* Desktop Navigation Links */}
                    <nav className="hidden md:flex items-center space-x-0.5 lg:space-x-1">
                        {publicNavLinks.map((link) => {
                            const isActive =
                                pathname === link.href ||
                                (link.href !== "/" && pathname?.startsWith(link.href));

                            return (
                                <Link
                                    key={link.href}
                                    href={link.href}
                                    className={cn(
                                        "px-2.5 lg:px-3 py-1.5 rounded-full text-xs font-medium transition-colors",
                                        isActive
                                            ? "bg-primary/10 text-primary font-semibold dark:bg-primary/20"
                                            : "text-muted-foreground hover:text-foreground hover:bg-muted/50"
                                    )}
                                >
                                    {link.name}
                                </Link>
                            );
                        })}
                    </nav>

                    {/* Desktop Action Buttons */}
                    <div className="hidden md:flex items-center space-x-2 shrink-0">
                        <ThemeSwitcher />

                        <Link href="/auth/login">
                            <Button
                                variant="ghost"
                                size="sm"
                                className="rounded-full text-xs font-semibold gap-1.5 px-3 h-8"
                            >
                                <LogIn className="w-3.5 h-3.5" />
                                <span>Masuk</span>
                            </Button>
                        </Link>

                        <Link href="/pendaftaran">
                            <Button
                                size="sm"
                                className="rounded-full bg-emerald-600 hover:bg-emerald-700 text-white font-semibold text-xs gap-1.5 px-4 h-8 shadow-sm shadow-emerald-600/30 transition-all hover:shadow-md hover:scale-[1.02] active:scale-[0.98]"
                            >
                                <Sparkles className="w-3.5 h-3.5" />
                                <span>Daftar PPDB</span>
                            </Button>
                        </Link>
                    </div>

                    {/* Mobile Header Controls */}
                    <div className="flex items-center gap-1.5 md:hidden">
                        <ThemeSwitcher />
                        <button
                            type="button"
                            onClick={() => setIsOpen(!isOpen)}
                            className="p-2 rounded-full hover:bg-muted text-foreground transition-colors"
                            aria-label="Toggle Menu"
                            aria-expanded={isOpen}
                        >
                            {isOpen ? (
                                <X className="w-5 h-5" />
                            ) : (
                                <Menu className="w-5 h-5" />
                            )}
                        </button>
                    </div>
                </div>
            </header>

            {/* Mobile Menu Overlay */}
            <MobileMenuOverlay isOpen={isOpen} onClose={() => setIsOpen(false)} />
        </>
    );
}