'use client';

import React, { useState, useEffect, useMemo, useTransition } from 'react';
import type { CalendarEvent } from '@/lib/utils/calendar-query';
import { fetchCalendarEvents } from '@/lib/utils/calendar-query';
import { downloadICalFile } from '@/lib/utils/calendar-export';
import { availableCategories } from '@/lib/constants/calendar';

import CalendarHeaderBar from './CalendarHeaderBar';
import UpcomingEventsSection from './UpcomingEventsSection';
import CalendarGridView from './CalendarGridView';
import CalendarAgendaView from './CalendarAgendaView';
import EventDetailModal from './EventDetailModal';

export interface KalenderAkademikProps {
  initialEvents?: CalendarEvent[];
}

export default function KalenderAkademik({ initialEvents }: KalenderAkademikProps) {
  const [currentDate, setCurrentDate] = useState<Date>(() => new Date());
  const [events, setEvents] = useState<CalendarEvent[]>(() => initialEvents || []);
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [activeView, setActiveView] = useState<'grid' | 'agenda'>('grid');
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [isDetailModalOpen, setIsDetailModalOpen] = useState<boolean>(false);
  const [_isLoading, setIsLoading] = useState<boolean>(!initialEvents);
  const [, startTransition] = useTransition();

  // Fetch events when initialEvents is not provided or month changes
  useEffect(() => {
    if (initialEvents && initialEvents.length > 0) {
      setEvents(initialEvents);
      return;
    }

    let isMounted = true;
    const loadEvents = async () => {
      setIsLoading(true);
      try {
        const data = await fetchCalendarEvents(currentDate);
        if (isMounted) {
          setEvents(data);
        }
      } catch (err) {
        console.error('Error fetching calendar events:', err);
      } finally {
        if (isMounted) {
          setIsLoading(false);
        }
      }
    };

    loadEvents();
    return () => {
      isMounted = false;
    };
  }, [currentDate, initialEvents]);

  // Compute unique categories present in events, falling back to availableCategories
  const categories = useMemo(() => {
    const set = new Set<string>();
    events.forEach((ev) => {
      if (ev.kategori) set.add(ev.kategori);
    });
    // Add default school categories if none
    if (set.size === 0) {
      availableCategories.forEach((c) => set.add(c));
    }
    return Array.from(set);
  }, [events]);

  // Filter events based on active category and search query
  const filteredEvents = useMemo(() => {
    return events.filter((event) => {
      // Category filter
      if (selectedCategory && event.kategori !== selectedCategory) {
        return false;
      }

      // Search query filter
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase().trim();
        const matchJudul = event.judul?.toLowerCase().includes(q);
        const matchDeskripsi = event.deskripsi?.toLowerCase().includes(q);
        const matchKategori = event.kategori?.toLowerCase().includes(q);
        const matchWaktu = event.waktu?.toLowerCase().includes(q);

        if (!matchJudul && !matchDeskripsi && !matchKategori && !matchWaktu) {
          return false;
        }
      }

      return true;
    });
  }, [events, selectedCategory, searchQuery]);

  // Month navigation handlers
  const handleNavigateMonth = (direction: 'prev' | 'next') => {
    startTransition(() => {
      setCurrentDate((prev) => {
        const next = new Date(prev.getFullYear(), prev.getMonth() + (direction === 'next' ? 1 : -1), 1);
        return next;
      });
    });
  };

  const handleToday = () => {
    startTransition(() => {
      setCurrentDate(new Date());
    });
  };

  const handleSelectDate = (date: Date) => {
    setSelectedDate(date);
    setIsDetailModalOpen(true);
  };

  const handleSelectEvent = (event: CalendarEvent) => {
    setSelectedDate(new Date(event.tanggal));
    setIsDetailModalOpen(true);
  };

  const handleSyncAll = () => {
    const exportList = filteredEvents.length > 0 ? filteredEvents : events;
    if (exportList.length === 0) return;
    downloadICalFile(exportList, 'kalender-akademik-mim-pk-dimoro.ics');
  };

  const handleResetFilter = () => {
    setSearchQuery('');
    setSelectedCategory(null);
  };

  return (
    <div className="space-y-6 sm:space-y-8 max-w-7xl mx-auto">
      {/* 1. Upcoming Events Bento Section */}
      <UpcomingEventsSection
        events={filteredEvents}
        onSelectEvent={handleSelectEvent}
      />

      {/* 2. Calendar Header Controls (Search, Categories, View Toggle, Sync) */}
      <CalendarHeaderBar
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
        selectedCategory={selectedCategory}
        onCategoryChange={setSelectedCategory}
        activeView={activeView}
        onViewChange={setActiveView}
        categories={categories}
        onSyncAll={handleSyncAll}
      />

      {/* 3. Main Calendar View: Grid or Agenda */}
      {activeView === 'grid' ? (
        <CalendarGridView
          currentDate={currentDate}
          onNavigateMonth={handleNavigateMonth}
          onToday={handleToday}
          events={filteredEvents}
          selectedDate={selectedDate}
          onSelectDate={handleSelectDate}
        />
      ) : (
        <CalendarAgendaView
          events={filteredEvents}
          onSelectEvent={handleSelectEvent}
          onResetFilter={handleResetFilter}
        />
      )}

      {/* 4. Event Detail Dialog */}
      <EventDetailModal
        date={selectedDate}
        events={events}
        isOpen={isDetailModalOpen}
        onClose={() => setIsDetailModalOpen(false)}
      />
    </div>
  );
}
