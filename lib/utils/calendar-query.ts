// lib/utils/calendar-query.ts

import { createClient } from '@/lib/supabase/client';

export type CalendarEvent = {
  id: number;
  judul: string;
  tanggal: string;
  tanggal_berakhir?: string;
  waktu?: string;
  deskripsi?: string;
  kategori: string;
  warna: string;
};

/**
 * Mendapatkan events kalender untuk bulan tertentu
 * Mencakup semua event yang:
 * 1. Dimulai dalam bulan ini
 * 2. Berakhir dalam bulan ini
 * 3. Merentang melewati bulan ini
 */
export async function fetchCalendarEvents(date: Date): Promise<CalendarEvent[]> {
  const supabase = createClient();
  
  const startOfMonth = new Date(date.getFullYear(), date.getMonth(), 1);
  const endOfMonth = new Date(date.getFullYear(), date.getMonth() + 1, 0);
  
  const startDate = startOfMonth.toISOString().split('T')[0];
  const endDate = endOfMonth.toISOString().split('T')[0];

  try {
    // Query yang lebih sederhana: ambil semua event yang mungkin overlap dengan bulan ini
    const { data, error } = await supabase
      .from('kalender_akademik')
      .select('*')
      .or(
        // Event yang dimulai dalam bulan ini
        `and(tanggal.gte.${startDate},tanggal.lte.${endDate}),` +
        // Event yang berakhir dalam bulan ini (untuk range events)
        `and(tanggal_berakhir.gte.${startDate},tanggal_berakhir.lte.${endDate}),` +
        // Event yang merentang melewati bulan ini
        `and(tanggal.lte.${startDate},tanggal_berakhir.gte.${endDate})`
      )
      .order('tanggal', { ascending: true });

    if (error) {
      console.error('Error fetching calendar events:', error);
      return [];
    }

    return data || [];
  } catch (error) {
    console.error('Error in fetchCalendarEvents:', error);
    return [];
  }
}

/**
 * Alternatif query yang lebih sederhana (jika performa menjadi masalah)
 * Menggunakan filter client-side untuk range events
 */
export async function fetchCalendarEventsSimple(date: Date): Promise<CalendarEvent[]> {
  const supabase = createClient();
  
  const startOfMonth = new Date(date.getFullYear(), date.getMonth(), 1);
  const endOfMonth = new Date(date.getFullYear(), date.getMonth() + 1, 0);

  try {
    // Query sederhana: ambil semua event dalam range yang lebih luas
    const { data, error } = await supabase
      .from('kalender_akademik')
      .select('*')
      .gte('tanggal', startOfMonth.toISOString().split('T')[0])
      .order('tanggal', { ascending: true });

    if (error) {
      console.error('Error fetching calendar events:', error);
      return [];
    }

    if (!data) return [];

    // Filter di client-side untuk events yang overlap dengan bulan ini
    return data.filter(event => {
      const eventStart = new Date(event.tanggal);
      const eventEnd = event.tanggal_berakhir ? new Date(event.tanggal_berakhir) : eventStart;
      
      // Check if event overlaps with current month
      return (eventStart <= endOfMonth && eventEnd >= startOfMonth);
    });
  } catch (error) {
    console.error('Error in fetchCalendarEventsSimple:', error);
    return [];
  }
}
