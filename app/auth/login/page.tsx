'use client'

import { LoginForm } from '@/components/login-form'
import PageHeader from '@/components/shared/PageHeader'
import { Users, FileText, BarChart3 } from 'lucide-react'

export default function LoginPage() {
  return (
    <div className="min-h-screen">
      <PageHeader
        title="Login Admin"
        description="Akses panel administrasi TK ABA Mertosanan"
        background="bg-accent/20"
      />

      <section className="flex justify-center bg-background">
        <div className='container mx-auto px-4'>
          <div className=' max-w-4xl mx-auto'>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
              
              <LoginForm className="w-full max-w-md" />
              
              <div className='bg-highlight/10 rounded-xl p-6'>
                <h3 className='text-xl font-bold mb-4'>Panel Admin</h3>
                <p className='text-muted-foreground mb-6'>
                  Panel administrasi TK ABA Mertosanan untuk mengelola data sekolah, 
                  siswa, konten website, dan berbagai aspek operasional sekolah.
                </p>
                
                <div className='space-y-4'>
                  <div className='flex items-start bg-background p-4 rounded-lg'>
                    <div className='bg-primary/20 p-2 rounded-full mr-3'>
                      <Users className='h-5 w-5 text-primary-foreground' />
                    </div>
                    <div>
                      <h4 className='font-semibold'>Manajemen Siswa</h4>
                      <p className='text-sm text-muted-foreground'>
                        Kelola data pendaftar, siswa aktif, dan laporan perkembangan.
                      </p>
                    </div>
                  </div>
                  
                  <div className='flex items-start bg-background p-4 rounded-lg'>
                    <div className='bg-accent/20 p-2 rounded-full mr-3'>
                      <FileText className='h-5 w-5 text-accent-foreground' />
                    </div>
                    <div>
                      <h4 className='font-semibold'>Konten Website</h4>
                      <p className='text-sm text-muted-foreground'>
                        Kelola berita, galeri, dan konten informasi sekolah.
                      </p>
                    </div>
                  </div>
                  
                  <div className='flex items-start bg-background p-4 rounded-lg'>
                    <div className='bg-attention/20 p-2 rounded-full mr-3'>
                      <BarChart3 className='h-5 w-5 text-accent-foreground' />
                    </div>
                    <div>
                      <h4 className='font-semibold'>Laporan & Statistik</h4>
                      <p className='text-sm text-muted-foreground'>
                        Akses laporan pendaftaran dan statistik sekolah.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}
