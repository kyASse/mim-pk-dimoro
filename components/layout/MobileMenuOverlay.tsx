"use client"

import * as React from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { motion, AnimatePresence } from "motion/react"
import {
  School,
  BookOpen,
  GraduationCap,
  Newspaper,
  Calendar,
  Image as ImageIcon,
  Phone,
  ArrowRight,
  MessageCircle,
  LogIn,
} from "lucide-react"
import { cn } from "@/lib/utils"
import { SCHOOL_WHATSAPP, SCHOOL_NAME } from "@/lib/school-config"

export interface MobileMenuOverlayProps {
  isOpen: boolean
  onClose: () => void
}

export const publicNavLinks = [
  { name: "Beranda", href: "/", icon: School },
  { name: "Tentang Kami", href: "/tentang-kami", icon: BookOpen },
  { name: "Program & Kurikulum", href: "/program", icon: GraduationCap },
  { name: "Berita & Artikel", href: "/berita", icon: Newspaper },
  { name: "Kalender Akademik", href: "/kalender-akademik", icon: Calendar },
  { name: "Galeri Foto", href: "/galeri", icon: ImageIcon },
  { name: "Kontak & Lokasi", href: "/kontak", icon: Phone },
]

export default function MobileMenuOverlay({ isOpen, onClose }: MobileMenuOverlayProps) {
  const pathname = usePathname()
  const cleanPhone = SCHOOL_WHATSAPP.replace(/[^0-9]/g, "")
  const whatsappUrl = `https://wa.me/${cleanPhone}?text=${encodeURIComponent(
    `Halo ${SCHOOL_NAME}, saya ingin konsultasi mengenai informasi madrasah & pendaftaran siswa baru.`
  )}`

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0, y: -8 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -8 }}
          transition={{ duration: 0.25, ease: [0.32, 0.72, 0, 1] }}
          className="fixed inset-x-0 top-[68px] bottom-0 z-40 md:hidden bg-background/95 dark:bg-gray-950/95 backdrop-blur-3xl overflow-y-auto px-4 py-4 flex flex-col justify-between"
        >
          <div className="space-y-4">
            {/* Primary Nav Links */}
            <div className="space-y-1">
              <p className="text-[11px] font-semibold uppercase tracking-wider text-muted-foreground px-3 mb-2">
                Menu Utama
              </p>
              {publicNavLinks.map((link) => {
                const isActive =
                  pathname === link.href ||
                  (link.href !== "/" && pathname?.startsWith(link.href))
                const Icon = link.icon

                return (
                  <Link
                    key={link.href}
                    href={link.href}
                    onClick={onClose}
                    className={cn(
                      "flex items-center justify-between px-3.5 py-2.5 rounded-xl text-sm font-medium transition-all duration-150",
                      "active:scale-[0.98] touch-manipulation min-h-[44px]",
                      isActive
                        ? "bg-primary/10 text-primary dark:bg-primary/20 dark:text-primary-foreground font-semibold"
                        : "text-foreground hover:bg-muted/60"
                    )}
                  >
                    <div className="flex items-center gap-3">
                      <div
                        className={cn(
                          "flex size-8 items-center justify-center rounded-lg transition-colors",
                          isActive
                            ? "bg-primary text-primary-foreground"
                            : "bg-muted text-muted-foreground"
                        )}
                      >
                        <Icon className="size-4" />
                      </div>
                      <span>{link.name}</span>
                    </div>
                    {isActive && (
                      <span className="size-1.5 rounded-full bg-primary" />
                    )}
                  </Link>
                )
              })}
            </div>

            {/* High-Converting Action Stack */}
            <div className="pt-2 space-y-2">
              {/* Primary PPDB Action Button */}
              <Link
                href="/pendaftaran"
                onClick={onClose}
                aria-label="Daftar PPDB Online"
                className="group flex items-center justify-between w-full p-3 rounded-2xl bg-emerald-600 hover:bg-emerald-700 text-white font-semibold shadow-lg shadow-emerald-600/20 transition-all duration-200 active:scale-[0.98] min-h-[52px]"
              >
                <div className="flex items-center gap-3">
                  <div className="flex size-8 items-center justify-center rounded-xl bg-white/20">
                    <GraduationCap className="size-4 text-white" />
                  </div>
                  <div className="text-left">
                    <div className="text-sm font-bold leading-tight">
                      Daftar PPDB Online
                    </div>
                    <div className="text-[11px] text-emerald-100 font-normal leading-tight mt-0.5">
                      Penerimaan Siswa Baru
                    </div>
                  </div>
                </div>
                <div className="flex size-7 items-center justify-center rounded-full bg-white/20 group-hover:translate-x-0.5 transition-transform">
                  <ArrowRight className="size-3.5" />
                </div>
              </Link>

              {/* WhatsApp Consultation Link */}
              <a
                href={whatsappUrl}
                target="_blank"
                rel="noopener noreferrer"
                onClick={onClose}
                aria-label="Tanya via WhatsApp"
                className="flex items-center justify-center gap-2 w-full h-11 rounded-xl border border-emerald-600/30 bg-emerald-50 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-300 font-semibold text-xs transition-colors hover:bg-emerald-100 dark:hover:bg-emerald-950/60 active:scale-[0.98]"
              >
                <MessageCircle className="size-4" />
                <span>Tanya via WhatsApp ({SCHOOL_WHATSAPP})</span>
              </a>

              {/* Portal Login Link */}
              <Link
                href="/auth/login"
                onClick={onClose}
                aria-label="Masuk Portal Siswa & Wali Murid"
                className="flex items-center justify-center gap-2 w-full h-11 rounded-xl bg-muted hover:bg-muted/80 text-foreground font-medium text-xs transition-colors active:scale-[0.98]"
              >
                <LogIn className="size-4 text-muted-foreground" />
                <span>Masuk Portal Siswa & Wali Murid</span>
              </Link>
            </div>
          </div>

          <div className="pt-4 pb-2 text-center text-[11px] text-muted-foreground">
            {SCHOOL_NAME} • Unggul, Islami, Berprestasi
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
