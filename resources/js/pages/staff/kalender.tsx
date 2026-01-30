import { Calendar, momentLocalizer } from 'react-big-calendar';
import moment from 'moment';
import 'moment/locale/id';
import 'react-big-calendar/lib/css/react-big-calendar.css';
import '../../../css/app.css';
import { useState } from 'react';
import { Card } from '@/components/ui/card';
import { FaCamera } from 'react-icons/fa';
import StaffLayout from '@/layouts/staff_layout';

moment.locale('id');
const localizer = momentLocalizer(moment);



const events = [
  {
    title: 'Sewa Mendatang',
    durasi: "24 jam",
    start: new Date(2025, 5, 10),
    end: new Date(2025, 5, 10),
    status: 'upcoming',
    nama: 'sandy s',
    kamera: 'Canon EOS R6 Mark II',
  },
  {
    title: 'Sewa Mendatang',
    durasi: "24 jam",
    start: new Date(2025, 5, 10),
    end: new Date(2025, 5, 10),
    status: 'upcoming',
    nama: 'kevin lius',
    kamera: 'Canon EOS R6 Mark II',
  },
  {
    title: 'Sewa Mendatang',
    durasi: "8 jam",
    start: new Date(2025, 5, 10),
    end: new Date(2025, 5, 10),
    status: 'upcoming',
    nama: 'Nadia',
    kamera: 'Canon EOS R6 Mark II',
  },
  {
    title: 'Sedang Disewa',
    durasi: "24 jam",
    start: new Date(2025, 5, 2),
    end: new Date(2025, 5, 3),
    status: 'active',
    nama: 'Devi',
    kamera: 'Sony A7 III',
  },
];

const eventStyleGetter = (event: any) => {
  let backgroundColor = '';
  if (event.status === 'upcoming') backgroundColor = '#FFEAA7';
  else if (event.status === 'active') backgroundColor = '#AAF7E1';

  return {
    style: {
      backgroundColor,
      borderRadius: '5px',
      opacity: 0.9,
      color: 'black',
      border: '0px',
      display: 'block',
      padding: '2px 5px',
    },
  };
};

// custom notes di kalender
const CustomEvent = ({ event }: { event: any }) => {
  console.log('EVENT DI CUSTOM:', event);

  return (
    <div className="flex items-center gap-1">
      {event.status === 'upcoming' && <FaCamera style={{ color: '#554E38' }} />}
      {event.status === 'active' && <FaCamera style={{ color: '#1C5041' }}  />}

      <span
        style={{
          whiteSpace: 'nowrap',
          overflow: 'hidden',
          textOverflow: 'ellipsis',
          maxWidth: '150px',
          display: 'inline-block',
          // color: '#333', // ubah warna teks
          fontWeight: 'normal', // hilangin bold 
        }}
      >
        {event.nama}
      </span>

    </div>
  );
};

//ambil toolbar asli dari react-big-calendar
import { Navigate } from 'react-big-calendar';

const CustomToolbar = (toolbar: any) => {
  const goToBack = () => {
    toolbar.onNavigate('PREV');
  };

  const goToNext = () => {
    toolbar.onNavigate('NEXT');
  };

  const goToToday = () => {
    toolbar.onNavigate('TODAY');
  };

  const label = moment(toolbar.date).format('MMMM YYYY');

  return (
    <div className="flex justify-between items-center mb-4 px-2">
      {/* Kiri: tombol Hari ini */}
      <div>
        <button
          onClick={goToToday}
          className="bg-blue-500 text-white px-3 py-1 rounded hover:bg-blue-600"
        >
          Hari ini
        </button>
      </div>

      {/* Tengah: label bulan */}
      <div className="text-lg font-semibold">
        {label}
      </div>

      {/* Kanan: panah navigasi style react-big-calendar */}
      <div className="flex items-center space-x-2">
        <button
          onClick={goToBack}
          aria-label="Previous"
          className="rbc-btn-toolbar"
          style={{
            cursor: 'pointer',
            fontSize: '28px',
            padding: '4px 14px',
            fontWeight: 'bold',
            color: '#2c3e50',
            transition: 'color 0.5s ease',
          }}
        >
          ‹
        </button>
        <button
          onClick={goToNext}
          aria-label="Next"
          className="rbc-btn-toolbar"
          style={{
            cursor: 'pointer',
            fontSize: '28px',
            padding: '4px 14px',
            fontWeight: 'bold',
            color: '#2c3e50',
            transition: 'color 0.5s ease',
          }}
        >
          ›
        </button>
      </div>
    </div>
  );
};

export default function BookingCalendar() {
  const [view, setView] = useState<'month' | 'week'>('month');
  const [selectedEvent, setSelectedEvent] = useState<any>(null);
  const [showModal, setShowModal] = useState(false);
  const [selectedDateEvents, setSelectedDateEvents] = useState<any[]>([]);
  const [showListModal, setShowListModal] = useState(false);

  


  const handleSelectSlot = (slotInfo: any) => {
    const clickedDate = moment(slotInfo.start).startOf('day');

    const filteredEvents = events.filter((e) =>
      moment(e.start).startOf('day').isSame(clickedDate)
    );

    if (filteredEvents.length > 0) {
      setSelectedDateEvents(filteredEvents);
      setShowListModal(true);
    }
  };

  const handleSelectEvent = (event: any) => {
    setSelectedEvent(event);
  };

  const closeModal = () => {
    setSelectedEvent(null);
  };

  return (
    <StaffLayout title="Kalender">
      <div className="grid grid-cols-4 gap-4 p-6 mt-2">
        {/* Kalender utama */}
        <div className="col-span-3">
          <Calendar
            localizer={localizer}
            events={events}
            startAccessor="start"
            endAccessor="end"
            style={{ height: 600 }}
            view={view}
            views={['month']}
            onView={(v) => setView(v as 'month')}
            eventPropGetter={eventStyleGetter}
            selectable
            onSelectSlot={handleSelectSlot}
            onSelectEvent={handleSelectEvent}
            titleAccessor={(event) => `${event.title} - ${event.durasi}`}
            components={{
              event: CustomEvent,
              toolbar: CustomToolbar,
            }}
            messages={{
              today: 'Hari ini',
              month: 'Bulan',
              week: 'Minggu',
              day: 'Hari',
              agenda: 'Agenda',
              date: 'Tanggal',
              time: 'Waktu',
              event: 'Acara',
              noEventsInRange: 'Tidak ada acara dalam rentang ini.',
              next: '→',
              previous: '←',
            }}
            formats={{
              dayFormat: (date) => moment(date).format('dddd'),
              weekdayFormat: (date) => moment(date).format('dddd'),
              monthHeaderFormat: (date) => moment(date).format('MMMM YYYY'),
              dayHeaderFormat: (date) => moment(date).format('dddd, D MMMM YYYY'),
            }}
          />
        </div>

        {/* Keterangan */}
        <div className="col-span-1 space-y-6">
          <Card className="p-4">
            <h3 className="font-semibold mb-2">Keterangan</h3>
            <div className="space-y-2 text-sm">
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full bg-[#FFEAA7]" />
                <span>Sewa Mendatang</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full bg-[#AAF7E1]" />
                <span>Sedang Disewa</span>
              </div>
            </div>
          </Card>
          <Card className="p-4">
            <h3 className="font-semibold mb-2">Sedang Disewa</h3>
            <div className="space-y-2 text-sm">
              {events.filter(e => e.status === 'active').map((event, idx) => (
                <div key={idx} className="flex items-start gap-2 border p-2 rounded bg-[#f0fff8]">
                  <FaCamera style={{ color: '#1C5041' }} />
                  <div className="flex flex-col">
                    <span className="font-medium">{event.nama}</span>
                    <span className="text-xs text-gray-600">
                      {moment(event.start).format('D MMM')} - {moment(event.end).format('D MMM YYYY')}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </Card>
        </div>
      </div>

      {/* Modal Pop-up */}
      {selectedEvent && (
        <div className="fixed inset-0 bg-black/80 bg-opacity-40 flex justify-center items-center z-50">
          <div className="p-6 rounded-xl shadow-lg w-[350px] relative bg-white">
            <div className="flex items-center gap-2 mb-4">
              {selectedEvent.status === 'upcoming' && (
                <FaCamera className="text-2xl" style={{ color: '#D4C38B' }} />
              )}
              {selectedEvent.status === 'active' && (
                <FaCamera className="text-2xl" style={{ color: '#1C5041' }} />
              )}
              <h2 className="text-xl font-bold">
                {selectedEvent.status === 'upcoming'
                  ? 'Sewa Mendatang'
                  : 'Sedang Disewa'}
              </h2>
            </div>
            <hr className="border-t border-gray-300 mb-4" />
            <div className="text-sm space-y-2 text-black">
              <p className="font-semibold">{selectedEvent.nama}</p>
              <div className="flex justify-between">
                <span className="font-semibold">Barang</span>
                <span>: {selectedEvent.kamera}</span>
              </div>
              <div className="flex justify-between">
                <span className="font-semibold">Durasi</span>
                <span>: {selectedEvent.durasi}</span>
              </div>
              <div className="flex justify-between">
                <span className="font-semibold">Tanggal Sewa</span>
                <span>: {moment(selectedEvent.start).format('D MMMM YYYY')}</span>
              </div>
              <div className="flex justify-between">
                <span className="font-semibold">Tanggal Kembali</span>
                <span>: {moment(selectedEvent.end).format('D MMMM YYYY')}</span>
              </div>
            </div>
            <div className="flex justify-end mt-6">
              <button
                className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-1 rounded"
                onClick={closeModal}
              >
                Tutup
              </button>
            </div>
          </div>
        </div>
      )}

  {/* showlist modal */}
  {showListModal && (
  <div className="fixed inset-0 bg-black/60 flex justify-center items-center z-50">
    <div className="bg-white p-6 rounded-lg w-[400px]">
      <h2 className="text-xl font-bold mb-4">Daftar Penyewa</h2>
      <div className="space-y-3">
        {selectedDateEvents.map((event, idx) => {
          const now = moment();
          const start = moment(event.start);
          const end = moment(event.end);

          const isActive = now.isSameOrAfter(start) && now.isSameOrBefore(end);

          console.log('start:', start.toISOString());
          console.log('end:', end.toISOString());
          console.log('now:', now.toISOString());
          console.log('isActive:', isActive);

          const bgColor = isActive ? '#AAF7E1' : '#FFF1C4';

          return (
            <button
              key={idx}
              onClick={() => {
                setSelectedEvent(event);
                setShowModal(true);
                setShowListModal(false);
              }}
              className="w-full text-left border p-2 rounded hover:brightness-95"
              style={{ backgroundColor: bgColor }}
            >
              {event.nama}
            </button>
          );
        })}
      </div>
        <div className="mt-6 flex justify-end">
          <button
            onClick={() => setShowListModal(false)}
            className="bg-blue-500 text-white px-4 py-1 rounded hover:bg-blue-600"
          >
            Tutup
          </button>
        </div>
      </div>
    </div>
  )}
    </StaffLayout>
  );
}
