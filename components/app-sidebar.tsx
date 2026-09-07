"use client"

import * as React from "react"
import { useEffect, useState } from "react"
import {
  LayoutDashboard,
  UserPlus,
  Users,
  CreditCard,
  GraduationCap,
  Calendar,
  Trophy,
  BookOpen,
  Image as ImageIcon,
  MessageSquare,
  Inbox,
  FileText,
  Wrench,
  Globe,
} from "lucide-react"
import Link from "next/link"
import Image from "next/image"
import { User } from "@supabase/supabase-js"

import { NavMain, type NavGroup } from "@/components/nav-main"
import { NavUser } from "@/components/nav-user"
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarRail,
} from "@/components/ui/sidebar"
import { createClient } from "@/lib/supabase/client"
import { SCHOOL_NAME, SCHOOL_LOGO_PATH, SCHOOL_LOGO_ALT } from "@/lib/school-config"

// Struktur 5 grup menu navigasi admin MIM PK Dimoro
const navGroupsData: NavGroup[] = [
  {
    label: "Utama",
    items: [
      {
        title: "Dashboard",
        url: "/admin",
        icon: LayoutDashboard,
      },
    ],
  },
  {
    label: "Kesiswaan & PPDB",
    items: [
      {
        title: "Pendaftar PPDB",
        url: "/admin/pendaftar",
        icon: UserPlus,
        items: [
          {
            title: "Daftar Pendaftar",
            url: "/admin/pendaftar",
          },
        ],
      },
      {
        title: "Data Siswa",
        url: "/admin/siswa",
        icon: Users,
        items: [
          {
            title: "Kelola Siswa",
            url: "/admin/siswa",
          },
        ],
      },
      {
        title: "Biaya & SPP",
        url: "/admin/akademik/edit-biaya",
        icon: CreditCard,
      },
    ],
  },
  {
    label: "Akademik & Agenda",
    items: [
      {
        title: "E-Rapor & Akademik",
        url: "/admin/akademik",
        icon: GraduationCap,
        items: [
          {
            title: "Manajemen Nilai",
            url: "/admin/akademik",
          },
          {
            title: "Laporan Perkembangan",
            url: "/admin/akademik/laporan",
          },
        ],
      },
      {
        title: "Kalender Akademik",
        url: "/admin/kalender",
        icon: Calendar,
        items: [
          {
            title: "Daftar Kalender",
            url: "/admin/kalender",
          },
          {
            title: "Tambah Event",
            url: "/admin/kalender/tambah",
          },
        ],
      },
      {
        title: "Prestasi Siswa",
        url: "/admin/akademik/prestasi",
        icon: Trophy,
        items: [
          {
            title: "Daftar Prestasi",
            url: "/admin/akademik/prestasi",
          },
          {
            title: "Tambah Prestasi",
            url: "/admin/akademik/prestasi/tambah",
          },
        ],
      },
    ],
  },
  {
    label: "Publikasi & Media",
    items: [
      {
        title: "Berita & Artikel",
        url: "/admin/berita",
        icon: BookOpen,
        items: [
          {
            title: "Daftar Berita",
            url: "/admin/berita",
          },
          {
            title: "Tambah Berita",
            url: "/admin/berita/tambah",
          },
        ],
      },
      {
        title: "Galeri Foto",
        url: "/admin/galeri",
        icon: ImageIcon,
        items: [
          {
            title: "Daftar Galeri",
            url: "/admin/galeri",
          },
          {
            title: "Tambah Galeri",
            url: "/admin/galeri/tambah",
          },
        ],
      },
      {
        title: "Testimoni Wali",
        url: "/admin/testimoni",
        icon: MessageSquare,
        items: [
          {
            title: "Daftar Testimoni",
            url: "/admin/testimoni",
          },
        ],
      },
    ],
  },
  {
    label: "Komunikasi & Pengaturan",
    items: [
      {
        title: "Pesan Masuk",
        url: "/admin/pesan",
        icon: Inbox,
        items: [
          {
            title: "Daftar Pesan",
            url: "/admin/pesan",
          },
        ],
      },
      {
        title: "Konten Halaman & Kontak",
        url: "/admin/konten",
        icon: FileText,
        items: [
          {
            title: "Konten Halaman",
            url: "/admin/konten",
          },
          {
            title: "Kontak Sekolah",
            url: "/admin/konten/edit-kontak",
          },
        ],
      },
      {
        title: "Generator Akun / Tools",
        url: "/admin/tools",
        icon: Wrench,
      },
    ],
  },
]

interface UserProfile {
  nama_lengkap: string
  role: string
  avatar_url?: string
}

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  const [user, setUser] = useState<User | null>(null)
  const [profile, setProfile] = useState<UserProfile | null>(null)
  const [loading, setLoading] = useState(true)
  const supabase = createClient()

  useEffect(() => {
    async function fetchUserData() {
      try {
        // Get current user
        const {
          data: { user: currentUser },
          error: authError,
        } = await supabase.auth.getUser()

        if (authError || !currentUser) {
          console.error("Auth error:", authError)
          setLoading(false)
          return
        }

        setUser(currentUser)

        // Try to get user profile from profiles table
        const { data: profileData, error: profileError } = await supabase
          .from("profiles")
          .select("nama_lengkap, role, avatar_url")
          .eq("id", currentUser.id)
          .single()

        if (profileError) {
          console.warn("Profile table not found or user profile not exists:", profileError.message)

          // Fallback: Create a default admin profile for existing users
          const defaultProfile: UserProfile = {
            nama_lengkap: currentUser.email?.split("@")[0] || "Admin",
            role: "admin",
            avatar_url: "/avatar-man-placeholder.png",
          }

          setProfile(defaultProfile)
        } else {
          // Check if user has admin role
          if (profileData?.role === "admin") {
            setProfile(profileData)
          } else {
            console.error("User is not authorized as admin. Role:", profileData?.role)

            // For development purposes, we'll still allow access
            if (process.env.NODE_ENV === "development") {
              const devProfile: UserProfile = {
                nama_lengkap: profileData?.nama_lengkap || currentUser.email?.split("@")[0] || "Admin",
                role: "admin",
                avatar_url: profileData?.avatar_url || "/avatar-man-placeholder.png",
              }
              setProfile(devProfile)
            }
          }
        }
      } catch (error) {
        console.error("Error fetching user data:", error)

        // Emergency fallback - allow access in development
        if (process.env.NODE_ENV === "development") {
          const emergencyProfile: UserProfile = {
            nama_lengkap: "Development Admin",
            role: "admin",
            avatar_url: "/avatar-man-placeholder.png",
          }
          setProfile(emergencyProfile)
        }
      } finally {
        setLoading(false)
      }
    }

    fetchUserData()
  }, [supabase])

  // Show loading state
  if (loading) {
    return (
      <Sidebar collapsible="icon" {...props}>
        <SidebarHeader>
          <div className="flex items-center justify-between gap-2 px-2 py-2">
            <div className="flex items-center gap-2 min-w-0">
              <div className="flex aspect-square size-8 items-center justify-center rounded-lg bg-white overflow-hidden shrink-0">
                <Image
                  src={SCHOOL_LOGO_PATH}
                  alt={SCHOOL_LOGO_ALT}
                  width={32}
                  height={32}
                  className="object-contain"
                  unoptimized
                />
              </div>
              <div className="grid flex-1 text-left text-sm leading-tight min-w-0">
                <span className="truncate font-semibold">{SCHOOL_NAME}</span>
                <span className="truncate text-xs text-muted-foreground">Admin Panel</span>
              </div>
            </div>
          </div>
        </SidebarHeader>
        <SidebarContent>
          <div className="p-4 text-center text-sm text-muted-foreground">
            Loading...
          </div>
        </SidebarContent>
        <SidebarRail />
      </Sidebar>
    )
  }

  // Show unauthorized message if user is not admin (only in production)
  if (!user || (!profile && process.env.NODE_ENV === "production")) {
    return (
      <Sidebar collapsible="icon" {...props}>
        <SidebarHeader>
          <div className="flex items-center justify-between gap-2 px-2 py-2">
            <div className="flex items-center gap-2 min-w-0">
              <div className="flex aspect-square size-8 items-center justify-center rounded-lg bg-white overflow-hidden shrink-0">
                <Image
                  src={SCHOOL_LOGO_PATH}
                  alt={SCHOOL_LOGO_ALT}
                  width={32}
                  height={32}
                  className="object-contain"
                  unoptimized
                />
              </div>
              <div className="grid flex-1 text-left text-sm leading-tight min-w-0">
                <span className="truncate font-semibold">{SCHOOL_NAME}</span>
                <span className="truncate text-xs text-muted-foreground">Admin Panel</span>
              </div>
            </div>
          </div>
        </SidebarHeader>
        <SidebarContent>
          <div className="p-4 text-center text-sm text-red-500">
            <p>Unauthorized Access</p>
            <p className="text-xs mt-2">Contact administrator for access</p>
          </div>
        </SidebarContent>
        <SidebarRail />
      </Sidebar>
    )
  }

  const userData = {
    name: profile?.nama_lengkap || user?.email?.split("@")[0] || "Admin",
    email: user?.email || "admin@mimpkdimoro.sch.id",
    avatar: profile?.avatar_url || "/avatar-man-placeholder.png",
  }

  return (
    <Sidebar collapsible="icon" {...props}>
      <SidebarHeader>
        <div className="flex items-center justify-between gap-2 px-2 py-2">
          <div className="flex items-center gap-2 min-w-0">
            <div className="flex aspect-square size-8 items-center justify-center rounded-lg bg-white overflow-hidden shrink-0">
              <Image
                src={SCHOOL_LOGO_PATH}
                alt={SCHOOL_LOGO_ALT}
                width={32}
                height={32}
                className="object-contain"
                unoptimized
              />
            </div>
            <div className="grid flex-1 text-left text-sm leading-tight min-w-0 group-data-[collapsible=icon]:hidden">
              <span className="truncate font-semibold">{SCHOOL_NAME}</span>
              <span className="truncate text-xs text-muted-foreground">Admin Panel</span>
            </div>
          </div>
          <Link
            href="/"
            className="flex size-7 items-center justify-center rounded-md border text-muted-foreground hover:text-foreground hover:bg-sidebar-accent transition-colors shrink-0 group-data-[collapsible=icon]:hidden"
            title="Lihat Website Publik"
            aria-label="Lihat Website Publik"
          >
            <Globe className="size-3.5" />
          </Link>
        </div>
      </SidebarHeader>
      <SidebarContent>
        <NavMain groups={navGroupsData} />
      </SidebarContent>
      <SidebarFooter>
        <NavUser user={userData} />
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  )
}
