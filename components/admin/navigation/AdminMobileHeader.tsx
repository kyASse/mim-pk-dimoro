"use client"

import * as React from "react"
import Link from "next/link"
import Image from "next/image"
import { usePathname } from "next/navigation"
import { Globe } from "lucide-react"
import { ThemeSwitcher } from "@/components/theme-switcher"
import { SCHOOL_LOGO_PATH, SCHOOL_LOGO_ALT, SCHOOL_NAME } from "@/lib/school-config"
import { cn } from "@/lib/utils"

export const ROUTE_TITLES: Record<string, string> = {
  "/admin": "Dashboard",
  "/admin/pendaftar": "Pendaftar PPDB",
  "/admin/siswa": "Data Siswa",
  "/admin/akademik/edit-biaya": "Biaya & SPP",
  "/admin/akademik/prestasi": "Prestasi Siswa",
  "/admin/akademik": "E-Rapor & Nilai",
  "/admin/kalender": "Kalender Akademik",
  "/admin/berita": "Berita & Artikel",
  "/admin/galeri": "Galeri Foto",
  "/admin/testimoni": "Testimoni Wali",
  "/admin/pesan": "Pesan Masuk",
  "/admin/konten/edit-kontak": "Kontak Sekolah",
  "/admin/konten": "Konten Halaman",
  "/admin/tools": "Generator Akun / Tools",
}

export function resolvePageTitle(pathname: string): string {
  if (ROUTE_TITLES[pathname]) {
    return ROUTE_TITLES[pathname]
  }

  // Sort keys by descending length to match more specific subroutes first
  const sortedRoutes = Object.keys(ROUTE_TITLES)
    .filter((route) => route !== "/admin")
    .sort((a, b) => b.length - a.length)

  for (const route of sortedRoutes) {
    if (pathname.startsWith(route)) {
      return ROUTE_TITLES[route]
    }
  }

  return "Admin Panel"
}

export interface AdminMobileHeaderProps {
  className?: string
}

export function AdminMobileHeader({ className }: AdminMobileHeaderProps) {
  const pathname = usePathname()
  const pageTitle = resolvePageTitle(pathname || "/admin")

  return (
    <header
      className={cn(
        "sticky top-0 z-30 flex md:hidden items-center justify-between px-4 py-2.5",
        "bg-background/85 dark:bg-gray-950/85 backdrop-blur-xl border-b border-border/50",
        className
      )}
    >
      <div className="flex items-center gap-2.5 min-w-0">
        <div className="flex aspect-square size-8 items-center justify-center rounded-lg bg-white overflow-hidden shrink-0 shadow-xs">
          <Image
            src={SCHOOL_LOGO_PATH}
            alt={SCHOOL_LOGO_ALT}
            width={28}
            height={28}
            className="object-contain"
            unoptimized
          />
        </div>
        <div className="min-w-0">
          <h1 className="text-sm font-bold truncate leading-tight text-foreground">{pageTitle}</h1>
          <p className="text-[10px] text-muted-foreground truncate leading-tight font-medium">{SCHOOL_NAME}</p>
        </div>
      </div>

      <div className="flex items-center gap-2 shrink-0">
        <Link
          href="/"
          className="flex size-8 items-center justify-center rounded-lg border border-border/60 text-muted-foreground hover:text-foreground hover:bg-muted transition-colors"
          title="Lihat Website Publik"
          aria-label="Lihat Website Publik"
        >
          <Globe className="size-4" />
        </Link>
        <ThemeSwitcher />
      </div>
    </header>
  )
}
