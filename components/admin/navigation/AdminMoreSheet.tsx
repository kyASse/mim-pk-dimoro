"use client"

import * as React from "react"
import Link from "next/link"
import { usePathname, useRouter } from "next/navigation"
import {
  GraduationCap,
  Calendar,
  Trophy,
  CreditCard,
  BookOpen,
  Image as ImageIcon,
  MessageSquare,
  FileText,
  PhoneCall,
  Wrench,
  Globe,
  LogOut,
  ChevronRight,
} from "lucide-react"
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetDescription,
} from "@/components/ui/sheet"
import { cn } from "@/lib/utils"
import { createClient } from "@/lib/supabase/client"

export interface AdminMoreSheetProps {
  open: boolean
  onOpenChange: (open: boolean) => void
}

interface MenuModuleItem {
  title: string
  desc: string
  url: string
  icon: React.ComponentType<{ className?: string }>
}

interface MenuSection {
  title: string
  items: MenuModuleItem[]
}

const SECTIONS: MenuSection[] = [
  {
    title: "Akademik & Agenda",
    items: [
      {
        title: "E-Rapor & Nilai",
        desc: "Manajemen nilai & capaian",
        url: "/admin/akademik",
        icon: GraduationCap,
      },
      {
        title: "Biaya & SPP",
        desc: "Tarif masuk & SPP siswa",
        url: "/admin/akademik/edit-biaya",
        icon: CreditCard,
      },
      {
        title: "Kalender Akademik",
        desc: "Agenda kegiatan sekolah",
        url: "/admin/kalender",
        icon: Calendar,
      },
      {
        title: "Prestasi Siswa",
        desc: "Daftar juara & piagam",
        url: "/admin/akademik/prestasi",
        icon: Trophy,
      },
    ],
  },
  {
    title: "Publikasi & Media",
    items: [
      {
        title: "Berita & Artikel",
        desc: "Kelola artikel madrasah",
        url: "/admin/berita",
        icon: BookOpen,
      },
      {
        title: "Galeri Foto",
        desc: "Dokumentasi kegiatan",
        url: "/admin/galeri",
        icon: ImageIcon,
      },
      {
        title: "Testimoni Wali",
        desc: "Ulasan dari orang tua",
        url: "/admin/testimoni",
        icon: MessageSquare,
      },
    ],
  },
  {
    title: "Pengaturan & Tools",
    items: [
      {
        title: "Konten Halaman",
        desc: "Teks profil & sambutan",
        url: "/admin/konten",
        icon: FileText,
      },
      {
        title: "Kontak Sekolah",
        desc: "Info telepon & alamat",
        url: "/admin/konten/edit-kontak",
        icon: PhoneCall,
      },
      {
        title: "Generator Akun / Tools",
        desc: "Utilitas akun & setup",
        url: "/admin/tools",
        icon: Wrench,
      },
    ],
  },
]

export function AdminMoreSheet({ open, onOpenChange }: AdminMoreSheetProps) {
  const pathname = usePathname()
  const router = useRouter()
  const supabase = createClient()

  const handleLogout = async () => {
    onOpenChange(false)
    await supabase.auth.signOut()
    router.push("/auth/login")
    router.refresh()
  }

  const isLinkActive = (url: string) => {
    if (!pathname) return false
    return pathname === url || pathname.startsWith(`${url}/`)
  }

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent
        side="bottom"
        className="rounded-t-[2rem] max-h-[85vh] p-0 flex flex-col bg-background/95 backdrop-blur-2xl border-t border-border/60"
      >
        <SheetHeader className="sr-only">
          <SheetTitle>Menu Lengkap Admin</SheetTitle>
          <SheetDescription>Pusat modul operasional madrasah</SheetDescription>
        </SheetHeader>

        {/* Drag Handle Indicator */}
        <div className="pt-3 pb-1 flex justify-center shrink-0">
          <div className="w-12 h-1.5 rounded-full bg-muted-foreground/25" />
        </div>

        {/* Header Bar in Sheet */}
        <div className="px-5 py-2 flex items-center justify-between border-b border-border/40 shrink-0">
          <div>
            <h3 className="text-base font-bold text-foreground">Menu Lengkap</h3>
            <p className="text-xs text-muted-foreground">Pilih modul administrasi madrasah</p>
          </div>
          <Link
            href="/"
            onClick={() => onOpenChange(false)}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-muted/60 hover:bg-muted text-xs font-medium text-muted-foreground hover:text-foreground transition-colors mr-6"
          >
            <Globe className="size-3.5" />
            <span>Web Publik</span>
          </Link>
        </div>

        {/* Scrollable Content */}
        <div className="flex-1 overflow-y-auto px-4 py-4 space-y-5 pb-[max(2rem,env(safe-area-inset-bottom))]">
          {SECTIONS.map((section) => (
            <div key={section.title} className="space-y-2">
              <h4 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground px-1">
                {section.title}
              </h4>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                {section.items.map((item) => {
                  const active = isLinkActive(item.url)
                  const Icon = item.icon

                  return (
                    <Link
                      key={item.url}
                      href={item.url}
                      onClick={() => onOpenChange(false)}
                      className={cn(
                        "flex items-center gap-3 p-3 rounded-xl border transition-all duration-200",
                        "active:scale-[0.98] min-h-[56px] touch-manipulation",
                        active
                          ? "bg-primary/10 border-primary/30 text-primary dark:bg-primary/20 dark:text-primary-foreground font-medium shadow-sm"
                          : "bg-card hover:bg-muted/50 border-border/50 text-card-foreground hover:border-border"
                      )}
                    >
                      <div
                        className={cn(
                          "flex size-9 shrink-0 items-center justify-center rounded-lg transition-colors",
                          active
                            ? "bg-primary text-primary-foreground"
                            : "bg-muted text-muted-foreground"
                        )}
                      >
                        <Icon className="size-4" />
                      </div>
                      <div className="min-w-0 flex-1">
                        <div className="text-sm font-semibold truncate leading-tight">
                          {item.title}
                        </div>
                        <div className="text-xs text-muted-foreground truncate leading-tight mt-0.5">
                          {item.desc}
                        </div>
                      </div>
                      <ChevronRight className="size-4 text-muted-foreground/50 shrink-0" />
                    </Link>
                  )
                })}
              </div>
            </div>
          ))}

          {/* Quick Logout Row */}
          <div className="pt-2">
            <button
              type="button"
              onClick={handleLogout}
              className="flex items-center justify-center gap-2 w-full h-11 rounded-xl bg-destructive/10 hover:bg-destructive/20 text-destructive font-semibold text-sm transition-colors active:scale-[0.98]"
            >
              <LogOut className="size-4" />
              <span>Keluar dari Admin</span>
            </button>
          </div>
        </div>
      </SheetContent>
    </Sheet>
  )
}
