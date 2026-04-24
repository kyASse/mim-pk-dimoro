"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import {
    Menu,
    X,
    School,
    BookOpen,
    Image as ImageIcon,
    Phone,
    UserPlus,
    LogIn
} from "lucide-react";
import { cn } from "@/lib/utils";
import { motion, AnimatePresence } from "motion/react";
import { ThemeSwitcher } from "../theme-switcher";
import { Button } from "../ui/button";

const navLinks = [
    { name: 'Beranda', href: '/', icon: <School className="w-5 h-5" /> },
    { name: 'Tentang Kami', href: '/tentang-kami', icon: <BookOpen className="w-5 h-5" /> },
    { name: 'Program & Kurikulum', href: '/program', icon: <BookOpen className="w-5 h-5" /> },
    { name: 'Galeri', href: '/galeri', icon: <ImageIcon className="w-5 h-5" /> },
    { name: 'Pendaftaran', href: '/pendaftaran', icon: <UserPlus className="w-5 h-5" /> },
    { name: 'Kontak', href: '/kontak', icon: <Phone className="w-5 h-5" /> },
    // { name: 'Masuk', href: '/auth/login', icon: <LogIn className="w-5 h-5" /> }
];

export default function Navbar() {
    const [isOpen, setIsOpen] = useState(false);
    const [scrolled, setScrolled] = useState(false);
    const pathname = usePathname();

    useEffect(() => {
        const handleScroll = () => {
            if (window.scrollY > 20) {
                setScrolled(true);
            } else {
                setScrolled(false);
            }
        };

        window.addEventListener("scroll", handleScroll);
        return () => window.removeEventListener("scroll", handleScroll);
    }, []);

    // close mobile menu when route changes
    useEffect(() => {
        setIsOpen(false);
    }, [pathname]);

    return (
        <header className={cn(
            "sticky top-0 z-50 w-full transition-all duration-300",
            scrolled
                ? "bg-white/95 dark:bg-gray-900/45 backdrop-blur-md shadow-md py-2"
                : "bg-transparent py-4"
        )}>
            <div className="container mx-auto px-4 flex items-center justify-between">
                {/* Logo */}
                <Link href="/" className="flex items-center space-x-2">
                    <motion.div
                        className="bg-white p-2 rounded-full overflow-hidden shadow-lg"
                        whileHover={{rotate: 5}}
                        whileTap={{ scale: 0.95 }}
                    >
                        <Image
                            src="/Logo-TK-ABA.png"
                            alt="TK ABA Mertosanan"
                            width={32}
                            height={32}
                            className="object-contain"
                        />
                    </motion.div>
                    <div>
                        <h1 className="text-xl font-bold text-primary-foreground">TK ABA</h1>
                        <p className="text-sm font-medium -mt-1">Mertosanan</p>
                    </div>
                </Link>

                {/* Desktop Navigation */}
                <nav className="hidden md:flex items-center space-x-1">
                    {navLinks.map((link) => (
                        <Link
                            key={link.href}
                            href={link.href}
                            className={cn(
                                "flex items-center space-x-2 px-3 py-2 transition-colors",
                                "text-primary-foreground hover:text-primary",
                                pathname === link.href && "active text-primary font-bold"
                            )}
                        >
                            {link.name}
                        </Link>
                    ))}

                    <ThemeSwitcher/>

                    <Link
                        href="/auth/login"
                        className={cn(
                            pathname === "/auth/login" && "active text-primary font-semibold"
                        )}
                    >
                        <Button className="ml-2 flex items-center space-x-1 rounded-full">
                            <LogIn className="w-4 h-4" />
                            <span>Masuk</span>
                        </Button>
                    </Link>
                </nav>

                {/* Mobile Menu Button */}
                <button
                    onClick={() => setIsOpen(!isOpen)}
                    className="md:hidden p-2 rounded-md"
                    aria-label="Toggle Menu"
                >
                    {isOpen ?
                        <X className="w-6 h-6 text-primary-foreground" /> :
                        <Menu className="w-6 h-6 text-primary-foreground" />
                    }
                </button>
            </div>

            {/* Mobile Navigation */}
            <AnimatePresence>
                {isOpen && (
                    <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: "auto" }}
                        exit={{ opacity: 0, height: 0 }}
                        transition={{ duration: 0.3 }}
                        className="md:hidden bg-white shadow-md rounded-lg mt-2"
                    >
                        <div className="container mx-auto px-4 py-4 flex-col space-y-3">
                            {navLinks.map((link) => (
                                <Link
                                    key={link.href}
                                    href={link.href}
                                    className={cn(
                                        "flex items-center space-x-2 p-2 rounded-lg transition-colors",
                                        pathname === link.href
                                            ? "bg-primary/20 text-primary font-semibold"
                                            : "hover:bg-muted text-primary-foreground"
                                    )}
                                >
                                    {link.icon}
                                    <span>{link.name}</span>
                                </Link>
                            ))}

                            <Link
                                href="/auth/login"
                                className="flex items-center space-x-2 p-2 rounded-lg bg-primary text-primary-foreground hover:bg-primary/90"
                            >
                                <LogIn className="w-5 h-5" />
                                <span>Masuk Orang Tua</span>
                            </Link>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </header>
    );
}