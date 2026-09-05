"use client";

import Link from "next/link";
import Image from "next/image";
import { motion, useReducedMotion } from "motion/react";
import {
  Phone,
  Mail,
  MapPin,
  Facebook,
  Instagram,
  Youtube,
  Clock,
  ChevronRight,
  ArrowUp,
  MessageSquare,
  Compass,
  GraduationCap,
} from "lucide-react";
import { useEffect, useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { formatWhatsAppNumber } from "@/lib/utils/pesan-utils";
import {
  SCHOOL_FULL_NAME,
  SCHOOL_LOGO_PATH,
  SCHOOL_LOGO_ALT,
  SCHOOL_WHATSAPP,
  SCHOOL_EMAIL,
} from "@/lib/school-config";

interface KontakData {
  alamat?: string;
  whatsapp?: string;
  email_utama?: string;
  jam_operasional?: string;
  facebook_url?: string;
  instagram_url?: string;
  youtube_url?: string;
}

export default function Footer() {
  const [kontak, setKontak] = useState<KontakData | null>(null);
  const shouldReduceMotion = useReducedMotion();

  useEffect(() => {
    const supabase = createClient();
    supabase
      .from("kontak_sekolah")
      .select(
        "alamat, whatsapp, email_utama, jam_operasional, facebook_url, instagram_url, youtube_url"
      )
      .maybeSingle()
      .then(({ data, error }) => {
        if (error) {
          console.error("Error fetching kontak_sekolah:", error);
          return;
        }
        if (data) {
          setKontak(data);
        }
      });
  }, []);

  const displayWhatsapp = kontak?.whatsapp || SCHOOL_WHATSAPP;
  const displayEmail = kontak?.email_utama || SCHOOL_EMAIL;
  const displayAddress = kontak?.alamat || "Jl. Raya Dimoro, Sukoharjo, Jawa Tengah";
  const displayHours = kontak?.jam_operasional || "07:00 - 13:30 WIB";

  const waNumberFormatted = formatWhatsAppNumber(displayWhatsapp);
  const consultationUrl = `https://wa.me/${waNumberFormatted}?text=${encodeURIComponent(
    "Assalamu’alaikum, saya ingin konsultasi mengenai program dan pendaftaran di MIM PK Dimoro."
  )}`;
  const directWaUrl = `https://wa.me/${waNumberFormatted}`;
  const mapsUrl = `https://maps.google.com/?q=${encodeURIComponent(
    displayAddress || "MIM PK Dimoro Sukoharjo"
  )}`;

  const exploreLinks = [
    { label: "Beranda", href: "/" },
    { label: "Tentang Kami", href: "/tentang-kami" },
    { label: "Program & Kurikulum", href: "/program" },
    { label: "Galeri Kegiatan", href: "/galeri" },
    { label: "Berita & Aktivitas", href: "/berita" },
  ];

  const academicLinks = [
    { label: "Pendaftaran Siswa Baru", href: "/pendaftaran" },
    { label: "Kalender Akademik", href: "/kalender-akademik" },
    { label: "Portal Wali Murid", href: "/auth/login" },
    { label: "Kontak & Lokasi", href: "/kontak" },
  ];

  const socialLinks = [
    {
      label: "Facebook",
      href: kontak?.facebook_url,
      icon: Facebook,
      className: "hover:bg-blue-600 hover:text-white",
    },
    {
      label: "Instagram",
      href: kontak?.instagram_url,
      icon: Instagram,
      className: "hover:bg-gradient-to-tr hover:from-amber-500 hover:via-pink-500 hover:to-purple-600 hover:text-white",
    },
    {
      label: "YouTube",
      href: kontak?.youtube_url,
      icon: Youtube,
      className: "hover:bg-red-600 hover:text-white",
    },
  ];

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <footer className="bg-gradient-to-b from-card/50 via-background to-secondary/30 dark:from-card/40 dark:via-background dark:to-background border-t border-border/60 pt-16 pb-8 transition-colors">
      <div className="container mx-auto px-4 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 lg:gap-10">
          {/* Column 1: Brand & Identity Hub */}
          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <motion.div
                className="bg-white dark:bg-card p-2 rounded-2xl shadow-sm border border-border/50 shrink-0"
                whileHover={shouldReduceMotion ? undefined : { scale: 1.05, rotate: 2 }}
                whileTap={shouldReduceMotion ? undefined : { scale: 0.95 }}
                transition={{ type: "spring", stiffness: 300, damping: 20 }}
              >
                <Image
                  src={SCHOOL_LOGO_PATH}
                  alt={SCHOOL_LOGO_ALT}
                  width={42}
                  height={42}
                  className="object-contain"
                  unoptimized
                />
              </motion.div>
              <div>
                <h3 className="text-base font-bold text-foreground leading-snug">
                  {SCHOOL_FULL_NAME}
                </h3>
                <div className="mt-1">
                  <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold bg-primary/10 text-primary border border-primary/20">
                    Program Khusus (PK)
                  </span>
                </div>
              </div>
            </div>

            <p className="text-sm text-muted-foreground leading-relaxed">
              Mengintegrasikan Kurikulum Merdeka dengan penguatan nilai-nilai ISMUBA (Al-Islam, Kemuhammadiyahan, dan Bahasa Arab) serta pembentukan karakter generasi Qurani yang unggul dan berprestasi.
            </p>

            <div>
              <motion.a
                href={consultationUrl}
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Konsultasi WhatsApp"
                whileHover={shouldReduceMotion ? undefined : { y: -2 }}
                whileTap={shouldReduceMotion ? undefined : { scale: 0.98 }}
                className="inline-flex items-center justify-center gap-2 w-full sm:w-auto px-4 py-2.5 rounded-xl bg-primary text-primary-foreground font-medium text-sm shadow-sm hover:bg-primary/90 transition-colors"
              >
                <MessageSquare className="w-4 h-4" />
                <span>Konsultasi WhatsApp</span>
              </motion.a>
            </div>
          </div>

          {/* Column 2: Jelajah Madrasah */}
          <div>
            <h4 className="text-sm font-semibold uppercase tracking-wider text-foreground mb-4 flex items-center gap-2">
              <Compass className="w-4 h-4 text-primary" />
              Jelajah Madrasah
            </h4>
            <ul className="space-y-2.5">
              {exploreLinks.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="group flex items-center text-sm text-muted-foreground hover:text-primary transition-colors"
                  >
                    <ChevronRight className="w-3.5 h-3.5 mr-2 text-muted-foreground/50 group-hover:text-primary group-hover:translate-x-1 transition-all" />
                    <span>{link.label}</span>
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Column 3: Layanan & Akademik */}
          <div>
            <h4 className="text-sm font-semibold uppercase tracking-wider text-foreground mb-4 flex items-center gap-2">
              <GraduationCap className="w-4 h-4 text-primary" />
              Layanan & Akademik
            </h4>
            <ul className="space-y-2.5">
              {academicLinks.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="group flex items-center text-sm text-muted-foreground hover:text-primary transition-colors"
                  >
                    <ChevronRight className="w-3.5 h-3.5 mr-2 text-muted-foreground/50 group-hover:text-primary group-hover:translate-x-1 transition-all" />
                    <span>{link.label}</span>
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Column 4: Hubungi Kami & Jam Sekolah */}
          <div>
            <h4 className="text-sm font-semibold uppercase tracking-wider text-foreground mb-4 flex items-center gap-2">
              <Phone className="w-4 h-4 text-primary" />
              Hubungi Kami
            </h4>
            <address className="not-italic space-y-3">
              <div>
                <a
                  href={mapsUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="Alamat Sekolah di Google Maps"
                  className="group flex items-start gap-2.5 text-sm text-muted-foreground hover:text-foreground transition-colors"
                >
                  <MapPin className="w-4 h-4 mt-0.5 shrink-0 text-attention group-hover:scale-110 transition-transform" />
                  <span>{displayAddress}</span>
                </a>
              </div>

              <div>
                <a
                  href={directWaUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={`WhatsApp ${displayWhatsapp}`}
                  className="group flex items-center gap-2.5 text-sm text-muted-foreground hover:text-primary transition-colors"
                >
                  <Phone className="w-4 h-4 shrink-0 text-primary group-hover:scale-110 transition-transform" />
                  <span>{displayWhatsapp}</span>
                </a>
              </div>

              <div>
                <a
                  href={`mailto:${displayEmail}`}
                  aria-label={`Email ${displayEmail}`}
                  className="group flex items-center gap-2.5 text-sm text-muted-foreground hover:text-primary transition-colors"
                >
                  <Mail className="w-4 h-4 shrink-0 text-accent group-hover:scale-110 transition-transform" />
                  <span>{displayEmail}</span>
                </a>
              </div>
            </address>

            {/* Jam Operasional */}
            <div className="mt-4 p-3 rounded-xl bg-card/60 dark:bg-card/40 border border-border/60 text-xs text-muted-foreground space-y-1.5">
              <div className="flex items-center gap-1.5 font-semibold text-foreground">
                <Clock className="w-3.5 h-3.5 text-primary" />
                <span>Jam Operasional</span>
              </div>
              <div className="flex justify-between items-center pt-1 border-t border-border/40 text-xs">
                <span>Senin – Kamis</span>
                <span className="font-medium text-foreground">{displayHours}</span>
              </div>
              <div className="flex justify-between items-center text-xs">
                <span>Jumat</span>
                <span className="font-medium text-foreground">07:00 - 11:00 WIB</span>
              </div>
            </div>

            {/* Media Sosial */}
            <div className="mt-4">
              <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-2">
                Media Sosial
              </p>
              <div className="flex items-center gap-2">
                {socialLinks.map((social) => {
                  const hasUrl =
                    social.href && social.href !== "#" && social.href.trim() !== "";
                  return (
                    <motion.a
                      key={social.label}
                      href={hasUrl ? social.href : "#"}
                      aria-label={social.label}
                      target={hasUrl ? "_blank" : undefined}
                      rel={hasUrl ? "noopener noreferrer" : undefined}
                      whileHover={shouldReduceMotion ? undefined : { scale: 1.1, y: -2 }}
                      whileTap={shouldReduceMotion ? undefined : { scale: 0.95 }}
                      transition={{ type: "spring", stiffness: 400, damping: 17 }}
                      className={`p-2.5 rounded-xl bg-secondary/50 border border-border/50 text-muted-foreground transition-colors ${social.className}`}
                    >
                      <social.icon className="w-4 h-4" />
                    </motion.a>
                  );
                })}
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-border/60 mt-12 pt-6 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-muted-foreground">
          <p className="text-center sm:text-left">
            &copy; {new Date().getFullYear()} {SCHOOL_FULL_NAME}. Semua Hak Dilindungi.
          </p>
          <motion.button
            onClick={scrollToTop}
            whileHover={shouldReduceMotion ? undefined : { y: -2 }}
            whileTap={shouldReduceMotion ? undefined : { scale: 0.95 }}
            aria-label="Kembali ke Atas"
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium text-muted-foreground hover:text-foreground bg-secondary/60 hover:bg-secondary border border-border/60 transition-colors shadow-xs cursor-pointer"
          >
            <span>Kembali ke Atas</span>
            <ArrowUp className="w-3.5 h-3.5" />
          </motion.button>
        </div>
      </div>
    </footer>
  );
}
