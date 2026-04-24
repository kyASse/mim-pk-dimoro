"use client";
import Link from "next/link";
import Image from "next/image";
import { motion } from "motion/react";
import {
    Phone, Mail, MapPin,
    Facebook, Instagram, Youtube,
    Clock, Calendar, BookOpen
} from "lucide-react";
import { useEffect, useState } from "react";
import { createClient } from "@/lib/supabase/client";


export default function Footer() {
    const [kontak, setKontak] = useState<{
        alamat?: string;
        whatsapp?: string;
        email_utama?: string;
        jam_operasional?: string;
    } | null>(null);

    useEffect(() => {
        const supabase = createClient();
        supabase
            .from('kontak_sekolah')
            .select('alamat, whatsapp, email_utama, jam_operasional')
            .single()
            .then(({ data, error }) => {
                if (error) {
                    console.error("Error fetching kontak_sekolah:", error);
                    return;
                }
                setKontak(data);
            });
    }, []);
    return (
        <footer className="bg-secondary/40 pt-12 pb-6">
            <div className="container mx-auto px-4">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                    {/* About */}
                    <div>
                        <div className="flex items-center space-x-2 mb-4">
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
                                <h3 className="text-lg font-bold">TK ABA Mertosanan</h3>
                                <p className="text-sm">Pendidikan Anak Islami</p>
                            </div>
                        </div>
                        <p className="text-muted-foreground mb-4">
                            Mewujudkan generasi Muslim yang cerdas, ceria, kreatif, mandiri dan bberakhlak mulia.
                        </p>
                    </div>

                    {/* Quick Links */}
                    <div>
                        <h3 className="text-lg font-bold mb-4 flex items-center">
                            <BookOpen className="w-5 h-5 mr-2" />
                            Halaman
                        </h3>
                        <ul className="space-y-2">
                            <li>
                                <Link href="/" className="hover:text-primary transition-colors">
                                Beranda
                                </Link>
                            </li>
                            <li>
                                <Link href="/tentang" className="hover:text-primary transition-colors">
                                Tentang Kami
                                </Link>
                            </li>
                            <li>
                                <Link href="/program" className="hover:text-primary transition-colors">
                                Program & kurikulum
                                </Link>
                            </li>
                            <li>
                                <Link href="/galeri" className="hover:text-primary transition-colors">
                                Galeri
                                </Link>
                            </li>
                            <li>
                                <Link href="/pendaftaran" className="hover:text-primary transition-colors">
                                Pendaftaran
                                </Link>
                            </li>
                            <li>
                                <Link href="/kontak" className="hover:text-primary transition-colors">
                                Kontak
                                </Link>
                            </li>
                        </ul>
                    </div>

                    {/* Contact */}
                    <div>
                        <h3 className="text-lg font-bold mb-4 flex items-center">
                            <Phone className="w-5 h-5 mr-2" />
                            Kontak
                        </h3>
                        <ul className="space-y-3">
                            <li className="flex items-start">
                                <MapPin className="w-5 h-5 mr-2 mt-0.5 text-attention" />
                                <span>{kontak?.alamat || "Alamat tidak tersedia"}</span>
                            </li>
                            <li className="flex items-center">
                                <Phone className="w-5 h-5 mr-2 text-primary" />
                                <span>{kontak?.whatsapp || "Nomor tidak tersedia"}</span>
                            </li >
                            <li className="flex items-center">
                                <Mail className="w-5 h-5 mr-2 text-accent" />
                                <span>{kontak?.email_utama || "Email tidak tersedia"}</span>
                            </li>
                        </ul>
                    </div>

                    {/* Hours */}
                    <div>
                        <h3 className="text-lg font-bold mb-4 flex items-center">
                            <Clock className="w-5 h-5 mr-2" /> 
                            Jam Sekolah
                        </h3>
                        <ul className="space-y-3">
                            <li className="flex items-start">
                                <Calendar className="w-5 h-5 mr-2 mt-0.5 text-secondary-foreground" />
                                <div>
                                    <p className="font-medium">Senin - Kamis</p>
                                    <p className="text-muted-foreground">07:30 - 11:00 WIB</p>
                                </div>
                            </li>
                            <li className="flex items-start">
                                <Calendar className="w-5 h-5 mr-2 mt-0.5 text-secondary-foreground" />
                                <div>
                                    <p className="font-medium">Jumat</p>
                                    <p className="text-muted-foreground">07:30 - 10:30 WIB</p>
                                </div>
                            </li>
                        </ul>
                        
                        <div className="mt-4">
                            <h4 className="font-medium mb-2">Ikuti Kami:</h4>
                            <div className="flex space-x-3">
                                <a href="#" className="bg-highlight hover:bg-highlight/80 p-2 rounded-full transition-colors">
                                    <Facebook className="w-5 h-5 text-highlight-foreground" />
                                </a>
                                <a href="#" className="bg-highlight hover:bg-highlight/80 p-2 rounded-full transition-colors">
                                    <Instagram className="w-5 h-5 text-highlight-foreground" />
                                </a>
                                <a href="#" className="bg-highlight hover:bg-highlight/80 p-2 rounded-full transition-colors">
                                    <Youtube className="w-5 h-5 text-highlight-foreground" />
                                </a>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="border-t border-muted mt-8 pt-6 text-center text-sm text-muted-foreground">
                    <p>
                        &copy; {new Date().getFullYear()} TK ABA Mertosanan. Semua Hak Dilindungi.
                    </p>
                </div>
            </div>
        </footer>
    )
}