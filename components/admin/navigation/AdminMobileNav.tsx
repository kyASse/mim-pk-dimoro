"use client"

import * as React from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import {
  LayoutDashboard,
  UserPlus,
  Users,
  Inbox,
  Grid2X2,
} from "lucide-react"
import { cn } from "@/lib/utils"

export interface AdminMobileNavProps {
  onOpenMore: () => void
  isMoreOpen?: boolean
  className?: string
}

interface NavTabItem {
  title: string
  url: string
  icon: React.ComponentType<{ className?: string }>
  matchPrefix?: string
}

const NAV_TABS: NavTabItem[] = [
  {
    title: "Dashboard",
    url: "/admin",
    icon: LayoutDashboard,
  },
  {
    title: "PPDB",
    url: "/admin/pendaftar",
    icon: UserPlus,
    matchPrefix: "/admin/pendaftar",
  },
  {
    title: "Siswa",
    url: "/admin/siswa",
    icon: Users,
    matchPrefix: "/admin/siswa",
  },
  {
    title: "Pesan",
    url: "/admin/pesan",
    icon: Inbox,
    matchPrefix: "/admin/pesan",
  },
]

export function AdminMobileNav({
  onOpenMore,
  isMoreOpen = false,
  className,
}: AdminMobileNavProps) {
  const pathname = usePathname()

  const isTabActive = (item: NavTabItem) => {
    if (!pathname) return false
    if (item.url === "/admin") {
      return pathname === "/admin"
    }
    if (item.matchPrefix) {
      return pathname === item.matchPrefix || pathname.startsWith(`${item.matchPrefix}/`)
    }
    return pathname === item.url || pathname.startsWith(`${item.url}/`)
  }

  return (
    <nav
      aria-label="Admin Mobile Navigation"
      className={cn(
        "fixed bottom-0 left-0 right-0 z-40 md:hidden",
        "bg-background/85 dark:bg-gray-950/85 backdrop-blur-xl",
        "border-t border-border/50 shadow-[0_-4px_20px_rgba(0,0,0,0.06)]",
        "px-2 pt-1 pb-[max(0.5rem,env(safe-area-inset-bottom))]",
        className
      )}
    >
      <div className="flex items-center justify-around gap-1 max-w-lg mx-auto">
        {NAV_TABS.map((tab) => {
          const active = !isMoreOpen && isTabActive(tab)
          const Icon = tab.icon

          return (
            <Link
              key={tab.url}
              href={tab.url}
              data-active={active ? "true" : "false"}
              aria-label={tab.title}
              className={cn(
                "relative flex flex-col items-center justify-center flex-1 h-12 rounded-xl text-[11px] font-medium transition-all duration-200",
                "active:scale-95 touch-manipulation min-w-0",
                active
                  ? "text-primary font-semibold bg-primary/10 dark:bg-primary/20 dark:text-primary-foreground"
                  : "text-muted-foreground hover:text-foreground hover:bg-muted/40"
              )}
            >
              <Icon className={cn("size-5 mb-0.5 transition-transform", active && "scale-110")} />
              <span className="truncate max-w-[64px] text-center leading-none">{tab.title}</span>
            </Link>
          )
        })}

        {/* Lainnya (More) Trigger Button */}
        <button
          type="button"
          onClick={onOpenMore}
          data-active={isMoreOpen ? "true" : "false"}
          aria-label="Lainnya"
          className={cn(
            "relative flex flex-col items-center justify-center flex-1 h-12 rounded-xl text-[11px] font-medium transition-all duration-200",
            "active:scale-95 touch-manipulation min-w-0",
            isMoreOpen
              ? "text-primary font-semibold bg-primary/10 dark:bg-primary/20 dark:text-primary-foreground"
              : "text-muted-foreground hover:text-foreground hover:bg-muted/40"
          )}
        >
          <Grid2X2 className={cn("size-5 mb-0.5 transition-transform", isMoreOpen && "scale-110")} />
          <span className="truncate max-w-[64px] text-center leading-none">Lainnya</span>
        </button>
      </div>
    </nav>
  )
}
