"use client"

import * as React from "react"
import {
  BookOpen,
  Users,
  Image as ImageIcon,
  MessageSquare,
  FileText,
  GraduationCap,
  Home,
  Calendar,
} from "lucide-react"

import { NavMain } from "@/components/nav-main"
import { NavUser } from "@/components/nav-user"
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarRail,
} from "@/components/ui/sidebar"
import { createClient } from "@/lib/supabase/client"
import { useEffect, useState } from "react"
import { User } from "@supabase/supabase-js"
import Image from "next/image"

// Data menu admin yang sesuai dengan aplikasi TK ABA
const navMainData = [
  {
    title: "Dashboard",
    url: "/admin",
    icon: Home,
    isActive: true,
  },
  {
    title: "Kelola Berita",
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
    title: "Kelola Pendaftar",
    url: "/admin/pendaftar", 
    icon: Users,
    items: [
      {
        title: "Daftar Pendaftar",
        url: "/admin/pendaftar",
      },
      {
        title: "Kelola Siswa",
        url: "/admin/siswa",
      },
      // {
      //   title: "Detail Pendaftar",
      //   url: "/admin/pendaftar/detail",
      // },
    ],
  },
  {
    title: "Kelola Galeri",
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
    title: "Kelola Kalender Akademik",
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
    title: "Kelola Testimoni",
    url: "/admin/testimoni",
    icon: MessageSquare,
    items: [
      {
        title: "Daftar Testimoni",
        url: "/admin/testimoni",
      },
    ],
  },
  {
    title: "Kelola Konten",
    url: "/admin/konten",
    icon: FileText,
    items: [
      {
        title: "Konten Halaman",
        url: "/admin/konten",
      },
      // {
      //   title: "Edit Konten",
      //   url: "/admin/konten/edit",
      // },
    ],
  },
  {
    title: "Kelola Akademik",
    url: "/admin/akademik",
    icon: GraduationCap,
    items: [
      {
        title: "Manajemen Akademik",
        url: "/admin/akademik",
      },
      {
        title: "Edit Biaya",
        url: "/admin/akademik/edit-biaya",
      },
      {
        title: "Laporan Perkembangan",
        url: "/admin/akademik/laporan",
      },
      {
        title: "Prestasi",
        url: "/admin/akademik/prestasi",
      },
      {
        title: "Tambah Prestasi",
        url: "/admin/akademik/prestasi/tambah",
      },
    ],
  },
]

interface UserProfile {
  nama_lengkap: string;
  role: string;
  avatar_url?: string;
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
        const { data: { user: currentUser }, error: authError } = await supabase.auth.getUser()
        
        if (authError || !currentUser) {
          console.error('Auth error:', authError)
          setLoading(false)
          return
        }

        setUser(currentUser)

        // Try to get user profile from profiles table
        const { data: profileData, error: profileError } = await supabase
          .from('profiles')
          .select('nama_lengkap, role, avatar_url')
          .eq('id', currentUser.id)
          .single()

        if (profileError) {
          console.warn('Profile table not found or user profile not exists:', profileError.message)
          
          // Fallback: Create a default admin profile for existing users
          const defaultProfile: UserProfile = {
            nama_lengkap: currentUser.email?.split('@')[0] || 'Admin',
            role: 'admin', // Default to admin for now
            avatar_url: '/avatar-man-placeholder.png'
          }
          
          setProfile(defaultProfile)
        } else {
          // Check if user has admin role
          if (profileData?.role === 'admin') {
            setProfile(profileData)
          } else {
            console.error('User is not authorized as admin. Role:', profileData?.role)
            
            // For development purposes, we'll still allow access
            // Remove this in production
            if (process.env.NODE_ENV === 'development') {
              const devProfile: UserProfile = {
                nama_lengkap: profileData?.nama_lengkap || currentUser.email?.split('@')[0] || 'Admin',
                role: 'admin',
                avatar_url: profileData?.avatar_url || '/avatar-man-placeholder.png'
              }
              setProfile(devProfile)
            }
          }
        }
      } catch (error) {
        console.error('Error fetching user data:', error)
        
        // Emergency fallback - allow access in development
        if (process.env.NODE_ENV === 'development') {
          const emergencyProfile: UserProfile = {
            nama_lengkap: 'Development Admin',
            role: 'admin',
            avatar_url: '/avatar-man-placeholder.png'
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
          <div className="flex items-center gap-2 px-2 py-2">
            <div className="flex aspect-square size-8 items-center justify-center rounded-lg bg-white overflow-hidden">
              <Image
                src="/Logo-TK-ABA.png"
                alt="TK ABA Mertosanan"
                width={32}
                height={32}
                className="object-contain"
              />
            </div>
            <div className="grid flex-1 text-left text-sm leading-tight">
              <span className="truncate font-semibold">TK ABA Mertosanan</span>
              <span className="truncate text-xs">Admin Panel</span>
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
  if (!user || (!profile && process.env.NODE_ENV === 'production')) {
    return (
      <Sidebar collapsible="icon" {...props}>
        <SidebarHeader>
          <div className="flex items-center gap-2 px-2 py-2">
            <div className="flex aspect-square size-8 items-center justify-center rounded-lg bg-white overflow-hidden">
              <Image
                src="/Logo-TK-ABA.png"
                alt="TK ABA Mertosanan"
                width={32}
                height={32}
                className="object-contain"
              />
            </div>
            <div className="grid flex-1 text-left text-sm leading-tight">
              <span className="truncate font-semibold">TK ABA Mertosanan</span>
              <span className="truncate text-xs">Admin Panel</span>
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
    name: profile?.nama_lengkap || user?.email?.split('@')[0] || 'Admin',
    email: user?.email || 'admin@tkabamertosanan.sch.id',
    avatar: profile?.avatar_url || '/avatar-man-placeholder.png',
  }

  return (
    <Sidebar collapsible="icon" {...props}>
      <SidebarHeader>
        <div className="flex items-center gap-2 px-2 py-2">
          <div className="flex aspect-square size-8 items-center justify-center rounded-lg bg-white overflow-hidden">
            <Image
              src="/Logo-TK-ABA.png"
              alt="TK ABA Mertosanan"
              width={32}
              height={32}
              className="object-contain"
            />
          </div>
          <div className="grid flex-1 text-left text-sm leading-tight">
            <span className="truncate font-semibold">TK ABA Mertosanan</span>
            <span className="truncate text-xs">Admin Panel</span>
          </div>
        </div>
      </SidebarHeader>
      <SidebarContent>
        <NavMain items={navMainData} />
      </SidebarContent>
      <SidebarFooter>
        <NavUser user={userData} />
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  )
}
