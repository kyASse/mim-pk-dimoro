'use client';

import { useState, useEffect } from 'react';
import { ChevronLeft, ChevronRight, Calendar, Clock } from 'lucide-react';
import { categoryColors } from '@/lib/constants/calendar';
import { fetchCalendarEvents, type CalendarEvent } from '@/lib/utils/calendar-query';

type KalenderEvent = CalendarEvent;

const bulanIndonesia = [
  'Januari', 'Februari', 'Maret', 'April', 'Mei', 'Juni',
  'Juli', 'Agustus', 'September', 'Oktober', 'November', 'Desember'
];

const hariIndonesia = ['Min', 'Sen', 'Sel', 'Rab', 'Kam', 'Jum', 'Sab'];

// (unused helper removed)

export default function KalenderAkademik() {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [events, setEvents] = useState<KalenderEvent[]>([]);
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [_loading, setLoading] = useState(true);

  useEffect(() => {
    fetchEvents();
  }, [currentDate]);

  const fetchEvents = async () => {
    setLoading(true);
    try {
      const eventData = await fetchCalendarEvents(currentDate);
      setEvents(eventData);
    } catch (error) {
      console.error('Error loading calendar events:', error);
    } finally {
      setLoading(false);
    }
  };

  const getDaysInMonth = () => {
    const year = currentDate.getFullYear();
    const month = currentDate.getMonth();
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    const daysInMonth = lastDay.getDate();
    const startingDayOfWeek = firstDay.getDay();

    const days = [];

    // Tambahkan hari kosong untuk minggu pertama
    for (let i = 0; i < startingDayOfWeek; i++) {
      days.push(null);
    }

    // Tambahkan hari dalam bulan
    for (let day = 1; day <= daysInMonth; day++) {
      days.push(new Date(year, month, day));
    }

    return days;
  };
  
  const getEventsForDate = (date: Date) => {
    const dateStr = date.toISOString().split('T')[0];
    return events.filter(event => {
      const eventStart = new Date(event.tanggal);
      const eventEnd = event.tanggal_berakhir ? new Date(event.tanggal_berakhir) : eventStart;
      const currentDate = new Date(dateStr);
      
      return currentDate >= eventStart && currentDate <= eventEnd;
    });
  };

  const isEventInRange = (event: KalenderEvent, date: Date) => {
    const eventStart = new Date(event.tanggal);
    const eventEnd = event.tanggal_berakhir ? new Date(event.tanggal_berakhir) : eventStart;
    return date >= eventStart && date <= eventEnd;
  };

  const getEventPosition = (event: KalenderEvent, date: Date) => {
    const eventStart = new Date(event.tanggal);
    const eventEnd = event.tanggal_berakhir ? new Date(event.tanggal_berakhir) : eventStart;
    const isStart = date.toDateString() === eventStart.toDateString();
    const isEnd = date.toDateString() === eventEnd.toDateString();
    const isMiddle = date > eventStart && date < eventEnd;
    
    return { isStart, isEnd, isMiddle, isSingleDay: !event.tanggal_berakhir };
  };

  const navigateMonth = (direction: 'prev' | 'next') => {
    setCurrentDate(prev => {
      const newDate = new Date(prev);
      if (direction === 'prev') {
        newDate.setMonth(prev.getMonth() - 1);
      } else {
        newDate.setMonth(prev.getMonth() + 1);
      }
      return newDate;
    });
  };

  const days = getDaysInMonth();
  const selectedEvents = selectedDate ? getEventsForDate(selectedDate) : [];

  return (
    <div className="max-w-6xl mx-auto grid lg:grid-cols-3 gap-8">
      {/* Kalender */}
      <div className="lg:col-span-2">
        <div className="bg-white rounded-lg shadow-lg p-6">
          {/* Header Kalender */}
          <div className="flex items-center justify-between mb-6">
            <button
              onClick={() => navigateMonth('prev')}
              className="flex items-center justify-center w-10 h-10 bg-orange-200 hover:bg-orange-300 rounded-lg transition-colors"
            >
              <ChevronLeft className="w-5 h-5 text-orange-700" />
            </button>
            <div className="bg-orange-200 px-6 py-2 rounded-lg">
              <h2 className="text-lg font-semibold text-orange-800">
                {bulanIndonesia[currentDate.getMonth()]} {currentDate.getFullYear()}
              </h2>
            </div>
            <button
              onClick={() => navigateMonth('next')}
              className="flex items-center justify-center w-10 h-10 bg-orange-200 hover:bg-orange-300 rounded-lg transition-colors"
            >
              <ChevronRight className="w-5 h-5 text-orange-700" />
            </button>
          </div>

          {/* Header Hari */}
          <div className="grid grid-cols-7 gap-1 mb-2">
            {hariIndonesia.map(hari => (
              <div key={hari} className="p-2 text-center font-medium text-gray-700 text-sm bg-orange-100 rounded">
                {hari}
              </div>
            ))}
          </div>

          {/* Grid Tanggal */}
          <div className="grid grid-cols-7 gap-1">
            {days.map((day, index) => {
              if (!day) {
                return <div key={`empty-${index}`} className="p-2 h-16 text-gray-400 text-sm flex items-start justify-start">
                  {/* Tampilkan tanggal bulan sebelumnya */}
                  {index < 7 && currentDate.getMonth() > 0 ? (
                    new Date(currentDate.getFullYear(), currentDate.getMonth(), -6 + index).getDate()
                  ) : ''}
                </div>;
              }

              const _dayEvents = getEventsForDate(day);
              const isToday = day.toDateString() === new Date().toDateString();
              const isSelected = selectedDate?.toDateString() === day.toDateString();

              return (
                <div
                  key={`${day.getFullYear()}-${day.getMonth()}-${day.getDate()}`}
                  onClick={() => setSelectedDate(day)}
                  className={`p-2 h-16 border border-gray-100 cursor-pointer hover:bg-gray-50 transition-colors relative ${
                    isToday ? 'bg-blue-50 border-blue-300' : ''
                  } ${isSelected ? 'bg-blue-100 border-blue-400' : ''}`}
                >
                  <div className={`text-sm font-medium mb-1 ${isToday ? 'text-blue-600' : 'text-gray-900'}`}>
                    {day.getDate()}
                  </div>
                  
                  {/* Render events untuk tanggal ini */}
                  <div className="space-y-0.5">
                    {events.map(event => {
                      if (!isEventInRange(event, day)) return null;
                      
                      const position = getEventPosition(event, day);
                      const categoryColor = categoryColors[event.kategori] || '#6B7280';
                      
                      let eventStyle = '';
                      let textStyle = '';
                      
                      if (position.isSingleDay) {
                        // Event satu hari - tampil penuh dengan rounded corners
                        eventStyle = `rounded text-xs px-1 py-0.5 text-center font-medium`;
                        textStyle = event.judul;
                      } else if (position.isStart) {
                        // Awal range - rounded kiri, kotak kanan
                        eventStyle = `rounded-l text-xs px-1 py-0.5 text-left font-medium`;
                        textStyle = event.judul;
                      } else if (position.isEnd) {
                        // Akhir range - kotak kiri, rounded kanan
                        eventStyle = `rounded-r text-xs px-1 py-0.5 text-right font-medium`;
                        textStyle = '';
                      } else if (position.isMiddle) {
                        // Tengah range - kotak penuh
                        eventStyle = `text-xs px-1 py-0.5 font-medium`;
                        textStyle = '';
                      }
                      
                      return (
                        <div
                          key={`${event.id}-${day.getDate()}`}
                          className={`${eventStyle} truncate`}
                          style={{ 
                            backgroundColor: categoryColor,
                            color: 'white'
                          }}
                          title={event.judul}
                        >
                          {textStyle}
                        </div>
                      );
                    })}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Panel Detail Event */}
      <div className="lg:col-span-1">
        <div className="bg-white rounded-lg shadow-lg p-6">
          <h3 className="text-lg font-semibold mb-4 flex items-center">
            <Calendar className="w-5 h-5 mr-2" />
            {selectedDate 
              ? `Kegiatan ${selectedDate.getDate()} ${bulanIndonesia[selectedDate.getMonth()]}`
              : 'Pilih Tanggal'
            }
          </h3>

          {selectedDate ? (
            selectedEvents.length > 0 ? (
              <div className="space-y-4">
                {selectedEvents.map(event => {
                  const categoryColor = categoryColors[event.kategori] || '#6B7280';
                  const eventStart = new Date(event.tanggal);
                  const eventEnd = event.tanggal_berakhir ? new Date(event.tanggal_berakhir) : null;
                  
                  return (
                    <div key={event.id} className="border-l-4 pl-4 py-2" style={{ borderColor: categoryColor }}>
                      <h4 className="font-medium text-gray-900">{event.judul}</h4>
                      
                      {/* Tampilkan range tanggal jika ada */}
                      <div className="text-sm text-gray-600 mt-1">
                        {eventEnd ? (
                          <div className="flex items-center">
                            <Calendar className="w-4 h-4 mr-1" />
                            {eventStart.toLocaleDateString('id-ID', { 
                              day: 'numeric', 
                              month: 'short',
                              year: eventStart.getFullYear() !== eventEnd.getFullYear() ? 'numeric' : undefined
                            })} - {eventEnd.toLocaleDateString('id-ID', { 
                              day: 'numeric', 
                              month: 'short',
                              year: 'numeric'
                            })}
                          </div>
                        ) : (
                          <div className="flex items-center">
                            <Calendar className="w-4 h-4 mr-1" />
                            {eventStart.toLocaleDateString('id-ID', { 
                              day: 'numeric', 
                              month: 'long',
                              year: 'numeric'
                            })}
                          </div>
                        )}
                      </div>

                      {event.waktu && (
                        <div className="flex items-center mt-1 text-sm text-gray-600">
                          <Clock className="w-4 h-4 mr-1" />
                          {event.waktu}
                        </div>
                      )}
                      <div className="text-sm text-gray-600 mt-1">
                        <span className="inline-block px-2 py-1 rounded-full text-xs" 
                              style={{ backgroundColor: categoryColor + '20', color: categoryColor }}>
                          {event.kategori}
                        </span>
                      </div>
                      {event.deskripsi && (
                        <p className="text-sm text-gray-700 mt-2">{event.deskripsi}</p>
                      )}
                    </div>
                  );
                })}
              </div>
            ) : (
              <p className="text-gray-500 text-center py-8">Tidak ada kegiatan pada tanggal ini</p>
            )
          ) : (
            <p className="text-gray-500 text-center py-8">Klik tanggal untuk melihat detail kegiatan</p>
          )}
        </div>

        {/* Legenda Kategori */}

        {/* <div className="bg-white rounded-lg shadow-lg p-6 mt-6">
          <h3 className="text-lg font-semibold mb-4">Legenda</h3>
          <div className="space-y-2">
            <div className="flex items-center">
              <div className="w-4 h-4 rounded bg-blue-500 mr-2"></div>
              <span className="text-sm">Kegiatan</span>
            </div>
            <div className="flex items-center">
              <div className="w-4 h-4 rounded bg-red-500 mr-2"></div>
              <span className="text-sm">Libur</span>
            </div>
            <div className="flex items-center">
              <div className="w-4 h-4 rounded bg-yellow-500 mr-2"></div>
              <span className="text-sm">Ujian</span>
            </div>
            <div className="flex items-center">
              <div className="w-4 h-4 rounded bg-purple-500 mr-2"></div>
              <span className="text-sm">Acara Khusus</span>
            </div>
          </div>
        </div> */}
        
        <div className="bg-white rounded-lg shadow-lg p-6 mt-6">
          <h3 className="text-lg font-semibold mb-4">Legenda Kategori</h3>
          <div className="space-y-2">
            {Object.entries(categoryColors).map(([kategori, warna]) => (
              <div key={kategori} className="flex items-center">
                <div
                  className="w-4 h-4 rounded mr-3"
                  style={{ backgroundColor: warna }}
                ></div>
                <span className="text-sm text-gray-700">{kategori}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
