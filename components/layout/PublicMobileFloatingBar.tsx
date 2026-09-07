"use client"

import * as React from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { MessageCircle, GraduationCap, ArrowRight } from "lucide-react"
import { SCHOOL_WHATSAPP, SCHOOL_NAME } from "@/lib/school-config"

export default function PublicMobileFloatingBar() {
  const pathname = usePathname()

  if (
    !pathname ||
    pathname.startsWith("/admin") ||
    pathname.startsWith("/portal") ||
    pathname.startsWith("/auth")
  ) {
    return null
  }

  const cleanPhone = SCHOOL_WHATSAPP.replace(/[^0-9]/g, "")
  const whatsappUrl = `https://wa.me/${cleanPhone}?text=${encodeURIComponent(
    `Halo ${SCHOOL_NAME}, saya ingin konsultasi mengenai informasi madrasah & pendaftaran siswa baru.`
  )}`

  return (
    <aside
      aria-label="Aksi Cepat Mobile"
      className="fixed bottom-4 inset-x-4 z-40 md:hidden max-w-md mx-auto bg-background/90 dark:bg-gray-950/90 backdrop-blur-xl border border-border/60 shadow-2xl rounded-full p-1.5 flex items-center gap-2"
    >
      {/* WhatsApp Consultation Link */}
      <a
        href={whatsappUrl}
        target="_blank"
        rel="noopener noreferrer"
        aria-label="Tanya via WhatsApp"
        className="flex-1 flex items-center justify-center gap-1.5 h-11 px-3.5 rounded-full bg-emerald-50 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-300 border border-emerald-600/25 text-xs font-semibold transition-colors hover:bg-emerald-100 dark:hover:bg-emerald-950/60 active:scale-[0.98] min-h-[44px]"
      >
        <MessageCircle className="size-4 shrink-0 text-emerald-600 dark:text-emerald-400" />
        <span className="truncate">Tanya WhatsApp</span>
      </a>

      {/* Primary PPDB Registration CTA */}
      <Link
        href="/pendaftaran"
        aria-label="Daftar PPDB Online"
        className="flex-1 flex items-center justify-center gap-1.5 h-11 px-3.5 rounded-full bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-semibold shadow-md shadow-emerald-600/25 transition-all active:scale-[0.98] min-h-[44px]"
      >
        <GraduationCap className="size-4 shrink-0" />
        <span className="truncate">Daftar PPDB</span>
        <ArrowRight className="size-3.5 shrink-0 opacity-80" />
      </Link>
    </aside>
  )
}
