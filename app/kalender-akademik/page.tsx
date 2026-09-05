import type { Metadata } from 'next';
import { createClient } from '@/lib/supabase/server';
import PageHeader from '@/components/shared/PageHeader';
import KalenderAkademik from '@/components/kalender/KalenderAkademik';
import { SCHOOL_NAME, SCHOOL_FULL_NAME, SCHOOL_DOMAIN } from '@/lib/school-config';
import type { CalendarEvent } from '@/lib/utils/calendar-query';

export const dynamic = 'force-dynamic';

export const metadata: Metadata = {
  title: `Kalender Akademik - ${SCHOOL_NAME}`,
  description: 'Jadwal kegiatan belajar mengajar, asesmen, libur semester, dan agenda penting madrasah',
  alternates: {
    canonical: '/kalender-akademik',
  },
  openGraph: {
    title: `Kalender Akademik - ${SCHOOL_NAME}`,
    description: 'Jadwal kegiatan belajar mengajar, asesmen, libur semester, dan agenda penting madrasah',
    url: '/kalender-akademik',
    siteName: SCHOOL_NAME,
    locale: 'id_ID',
    type: 'website',
  },
};

export default async function KalenderAkademikPage() {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from('kalender_akademik')
    .select('*')
    .order('tanggal', { ascending: true });

  if (error) {
    console.error('Error fetching kalender akademik:', error);
  }

  const events: CalendarEvent[] = (data || []) as CalendarEvent[];

  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'ItemList',
    name: `Kalender Akademik - ${SCHOOL_NAME}`,
    description: 'Jadwal kegiatan belajar mengajar, asesmen, libur semester, dan agenda penting madrasah',
    itemListElement: events.map((event, index) => ({
      '@type': 'ListItem',
      position: index + 1,
      item: {
        '@type': 'EducationEvent',
        name: event.judul,
        description: event.deskripsi || event.judul,
        startDate: event.tanggal,
        endDate: event.tanggal_berakhir || event.tanggal,
        eventStatus: 'https://schema.org/EventScheduled',
        eventAttendanceMode: 'https://schema.org/OfflineEventAttendanceMode',
        location: {
          '@type': 'Place',
          name: SCHOOL_FULL_NAME,
          url: SCHOOL_DOMAIN,
        },
        organizer: {
          '@type': 'EducationalOrganization',
          name: SCHOOL_FULL_NAME,
          url: SCHOOL_DOMAIN,
        },
      },
    })),
  };

  return (
    <div className="min-h-screen bg-background">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <PageHeader
        title="Kalender Akademik"
        description="Jadwal kegiatan belajar mengajar, asesmen, libur semester, dan agenda penting madrasah"
        background="bg-primary/10"
      />
      <div className="container mx-auto px-4 pb-16">
        <KalenderAkademik initialEvents={events} />
      </div>
    </div>
  );
}