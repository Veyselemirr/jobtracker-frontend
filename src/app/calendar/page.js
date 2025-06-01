'use client';

import { useState, useEffect, useCallback } from 'react';
import { Calendar, dateFnsLocalizer, Views } from 'react-big-calendar';
import format from 'date-fns/format';
import parse from 'date-fns/parse';
import startOfWeek from 'date-fns/startOfWeek';
import getDay from 'date-fns/getDay';
import tr from 'date-fns/locale/tr';
import { X } from 'lucide-react';
import { useRouter } from 'next/navigation'; // Eğer zaten yoksa


import 'react-big-calendar/lib/css/react-big-calendar.css';

// --- Localizer, Sabitler, Helper Fonksiyonlar (öncekiyle aynı) ---
const locales = { 'tr': tr };
const localizer = dateFnsLocalizer({
    format, parse, startOfWeek: (date) => startOfWeek(date, { weekStartsOn: 1 }), getDay, locales,
});
const API_BASE_URL = 'https://localhost:7191';
const USER_ID_FOR_TESTING = 1;
const currentYear = new Date().getFullYear();
const yearOptions = Array.from({ length: 11 }, (_, i) => currentYear - 5 + i);
const monthOptions = [
    { value: 0, label: 'Ocak' }, { value: 1, label: 'Şubat' }, { value: 2, label: 'Mart' },
    { value: 3, label: 'Nisan' }, { value: 4, label: 'Mayıs' }, { value: 5, label: 'Haziran' },
    { value: 6, label: 'Temmuz' }, { value: 7, label: 'Ağustos' }, { value: 8, label: 'Eylül' },
    { value: 9, label: 'Ekim' }, { value: 10, label: 'Kasım' }, { value: 11, label: 'Aralık' }
];
const calendarMessages = { /* ... önceki mesajlar ... */
    allDay: 'Tüm Gün', previous: 'Önceki', next: 'Sonraki', today: 'Bugün',
    month: 'Ay', week: 'Hafta', day: 'Gün', agenda: 'Ajanda',
    date: 'Tarih', time: 'Saat', event: 'Etkinlik',
    noEventsInRange: 'Bu aralıkta gösterilecek mülakat bulunmuyor.',
    showMore: total => `+${total} daha göster`,
};
// statusMapping'i de buraya alalım, modal içinde durumu göstermek için
const statusMapping = {
    0: { label: 'Beklemede', className: 'bg-yellow-100 text-yellow-800 border-yellow-300' },
    1: { label: 'Mülakat Aşamasında', className: 'bg-blue-100 text-blue-800 border-blue-300' },
    2: { label: 'Kabul Edildi', className: 'bg-green-100 text-green-800 border-green-300' },
    3: { label: 'Reddedildi', className: 'bg-red-100 text-red-800 border-red-300' },
};
function formatDate(dateString, includeTime = false) {
    if (!dateString) return 'Belirtilmemiş';
    try {
        const options = { year: 'numeric', month: 'long', day: 'numeric' };
        if (includeTime) {
            options.hour = '2-digit';
            options.minute = '2-digit';
        }
        return new Date(dateString).toLocaleDateString('tr-TR', options);
    } catch (error) {
        return 'Geçersiz Tarih';
    }
}


// --- CustomToolbar (öncekiyle aynı) ---
const CustomToolbar = (toolbarProps) => { /* ... önceki CustomToolbar kodu ... */
    const { date, label, view, views, onNavigate, onView, messages } = toolbarProps;
    // ... (içindeki fonksiyonlar aynı)
    const navigate = (action) => { if (onNavigate) onNavigate(action); };
    const handleViewChange = (newView) => { if (onView) onView(newView); };
    const handleMonthChange = (e) => { /*...*/ if (onNavigate) onNavigate(new Date(date.getFullYear(), parseInt(e.target.value, 10), 1)); };
    const handleYearChange = (e) => { /*...*/ if (onNavigate) onNavigate(new Date(parseInt(e.target.value, 10), date.getMonth(), 1)); };

    return (
        <div className="rbc-toolbar mb-4 p-3 bg-slate-100 rounded-lg shadow-sm">
            <div className="flex flex-wrap items-center justify-between gap-2 sm:gap-4">
                <div className="flex items-center gap-x-1 sm:gap-x-2">
                    <button type="button" onClick={() => navigate('TODAY')} className="px-3 py-1.5 text-xs sm:text-sm font-medium text-slate-700 bg-white border border-slate-300 rounded-md hover:bg-slate-50 transition">
                        {messages?.today || 'Bugün'}
                    </button>
                    <button type="button" onClick={() => navigate('PREV')} className="px-2.5 py-1.5 text-xs sm:text-sm text-slate-700 bg-white border border-slate-300 rounded-md hover:bg-slate-50 transition">
                        {messages?.previous || 'Önceki'}
                    </button>
                    <button type="button" onClick={() => navigate('NEXT')} className="px-2.5 py-1.5 text-xs sm:text-sm text-slate-700 bg-white border border-slate-300 rounded-md hover:bg-slate-50 transition">
                        {messages?.next || 'Sonraki'}
                    </button>
                    <select aria-label="Ay Seçimi" value={date ? date.getMonth() : new Date().getMonth()} onChange={handleMonthChange} className="px-2 sm:px-3 py-1.5 text-xs sm:text-sm text-slate-700 bg-white border border-slate-300 rounded-md focus:ring-blue-500 focus:border-blue-500 transition">
                        {monthOptions.map(opt => (<option key={opt.value} value={opt.value}>{opt.label}</option>))}
                    </select>
                    <select aria-label="Yıl Seçimi" value={date ? date.getFullYear() : currentYear} onChange={handleYearChange} className="px-2 sm:px-3 py-1.5 text-xs sm:text-sm text-slate-700 bg-white border border-slate-300 rounded-md focus:ring-blue-500 focus:border-blue-500 transition">
                        {yearOptions.map(year => (<option key={year} value={year}>{year}</option>))}
                    </select>
                </div>
                <div className="rbc-toolbar-label text-base sm:text-xl font-semibold text-slate-800 order-first sm:order-none w-full sm:w-auto text-center sm:text-left">
                    {label || ''}
                </div>
                <div className="rbc-btn-group flex items-center gap-x-1">
                    {views && views.includes('month') && (<button type="button" className={`px-3 py-1.5 text-xs sm:text-sm font-medium border rounded-md transition ${view === 'month' ? 'bg-blue-600 text-white border-blue-600' : 'text-slate-700 bg-white border-slate-300 hover:bg-slate-50'}`} onClick={() => handleViewChange('month')}>{messages?.month || 'Ay'}</button>)}
                    {views && views.includes('week') && (<button type="button" className={`px-3 py-1.5 text-xs sm:text-sm font-medium border rounded-md transition ${view === 'week' ? 'bg-blue-600 text-white border-blue-600' : 'text-slate-700 bg-white border-slate-300 hover:bg-slate-50'}`} onClick={() => handleViewChange('week')}>{messages?.week || 'Hafta'}</button>)}
                    {views && views.includes('day') && (<button type="button" className={`px-3 py-1.5 text-xs sm:text-sm font-medium border rounded-md transition ${view === 'day' ? 'bg-blue-600 text-white border-blue-600' : 'text-slate-700 bg-white border-slate-300 hover:bg-slate-50'}`} onClick={() => handleViewChange('day')}>{messages?.day || 'Gün'}</button>)}
                </div>
            </div>
        </div>
    );
};

// --- Ana Takvim Sayfası Component'i ---
export default function CalendarPage() {
    const router = useRouter();
    const [calendarEvents, setCalendarEvents] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);
    const [currentDate, setCurrentDate] = useState(new Date());
    const [currentView, setCurrentView] = useState(Views.MONTH);

    // Modal için state'ler
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [selectedApplication, setSelectedApplication] = useState(null);

    useEffect(() => {
        const fetchApplicationsAndSetEvents = async () => {
            // ... (önceki veri çekme ve event oluşturma mantığı aynı)
            setIsLoading(true);
            setError(null);
            try {
                const response = await fetch(`${API_BASE_URL}/api/JobApplication/user/${USER_ID_FOR_TESTING}`);
                if (!response.ok) {
                    const errorData = await response.text();
                    throw new Error(`API Hatası: ${response.status} - ${errorData || response.statusText}`);
                }
                const applications = await response.json() || [];
                const events = applications
                    .filter(app => app.interviewDate)
                    .map(app => {
                        const interviewDateTime = new Date(app.interviewDate);
                        let allDayEvent = true;
                        if (app.interviewDate.includes('T') && !app.interviewDate.endsWith('T00:00:00') && !app.interviewDate.endsWith('T00:00')) {
                            allDayEvent = false;
                        }
                        return {
                            id: app.id.toString(),
                            title: `${app.companyName} - ${app.position || 'Mülakat'}`,
                            start: interviewDateTime,
                            end: allDayEvent ? interviewDateTime : new Date(interviewDateTime.getTime() + (60 * 60 * 1000)),
                            allDay: allDayEvent,
                            resource: app,
                        };
                    });
                setCalendarEvents(events);
            } catch (err) {
                console.error("Takvim verisi çekilirken hata:", err);
                setError(err.message);
            } finally {
                setIsLoading(false);
            }
        };
        fetchApplicationsAndSetEvents();
    }, []);

    const handleSelectEvent = useCallback((event) => {
        // event.resource içinde tüm başvuru objemiz vardı, onun id'sini alalım
        if (event.resource && event.resource.id) {
            router.push(`/applications/view/${event.resource.id}`);
        } else {
            console.error("Olayda başvuru ID'si bulunamadı!", event);
            alert("Başvuru detayı yüklenemedi.");
        }
    }, [router]); // router'ı bağımlılıklara ekle

    const handleNavigate = useCallback((newDate) => { setCurrentDate(newDate); }, []);
    const handleViewChange = useCallback((newView) => { setCurrentView(newView); }, []);
    const onSelectSlot = useCallback((slotInfo) => {
        if ((currentView === Views.MONTH || currentView === 'month') && slotInfo.action === 'click' && slotInfo.slots.length === 1) {
            setCurrentDate(slotInfo.start);
            setCurrentView(Views.DAY);
        }
    }, [currentView]);


    if (isLoading) {
        return <div className="text-center py-10"><p className="text-slate-700 text-xl">Takvim yükleniyor...</p></div>;
    }
    if (error) {
        return (
            <div className="text-center py-10 bg-red-50 p-6 rounded-lg">
                <p className="text-red-700 text-xl font-semibold">Hata!</p><p className="text-red-600">{error}</p>
            </div>
        );
    }

    return (
        <div className="p-4">
            <h1 className="text-3xl md:text-4xl font-bold text-slate-800 mb-8 text-center">
                Mülakat Takvimim
            </h1>
            <div className="bg-white p-2 sm:p-4 md:p-6 rounded-xl shadow-xl relative" style={{ height: 'auto', minHeight: '75vh' }}>
                <Calendar
                    localizer={localizer}
                    events={calendarEvents}
                    startAccessor="start"
                    endAccessor="end"
                    titleAccessor="title"
                    allDayAccessor="allDay"
                    style={{ height: 'calc(75vh - 80px)' }}
                    date={currentDate}
                    view={currentView}
                    onNavigate={handleNavigate}
                    onView={handleViewChange}
                    components={{ toolbar: CustomToolbar }}
                    selectable={true}
                    onSelectEvent={handleSelectEvent} // GÜNCELLENDİ
                    onSelectSlot={onSelectSlot}
                    culture='tr'
                    messages={calendarMessages}
                    views={['month', 'week', 'day']}
                />
            </div>

            {/* Başvuru Detay Modalı */}
            {isModalOpen && selectedApplication && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
                    <div className="bg-white p-6 rounded-lg shadow-xl max-w-lg w-full max-h-[80vh] overflow-y-auto">
                        <div className="flex justify-between items-center mb-4">
                            <h2 className="text-2xl font-semibold text-slate-800">Başvuru Detayları</h2>
                            <button onClick={() => setIsModalOpen(false)} className="text-slate-500 hover:text-slate-700">
                                <X size={24} />
                            </button>
                        </div>
                        <div className="space-y-3 text-sm">
                            <p><strong>Şirket:</strong> <span className="text-slate-700">{selectedApplication.companyName}</span></p>
                            <p><strong>Pozisyon:</strong> <span className="text-slate-700">{selectedApplication.position}</span></p>
                            <p><strong>Başvuru Tarihi:</strong> <span className="text-slate-700">{formatDate(selectedApplication.appliedDate)}</span></p>
                            <p><strong>Mülakat Tarihi:</strong> <span className="text-slate-700 font-semibold">{formatDate(selectedApplication.interviewDate, true)}</span></p>
                            <p><strong>Durum:</strong>
                                <span className={`ml-2 px-2 py-0.5 rounded-full text-xs font-semibold border ${statusMapping[selectedApplication.status]?.className || 'bg-gray-100 text-gray-800 border-gray-300'}`}>
                                    {statusMapping[selectedApplication.status]?.label || `Bilinmeyen (${selectedApplication.status})`}
                                </span>
                            </p>
                            {selectedApplication.location && <p><strong>Lokasyon:</strong> <span className="text-slate-700">{selectedApplication.location}</span></p>}
                            {selectedApplication.workModel && <p><strong>Çalışma Şekli:</strong> <span className="text-slate-700">{selectedApplication.workModel}</span></p>}
                            {selectedApplication.notes && (
                                <div>
                                    <p className="font-medium text-slate-800">Notlar:</p>
                                    <p className="text-slate-700 bg-slate-50 p-2 rounded whitespace-pre-wrap">{selectedApplication.notes}</p>
                                </div>
                            )}
                        </div>
                        <div className="mt-6 text-right">
                            <button
                                onClick={() => setIsModalOpen(false)}
                                className="bg-slate-500 hover:bg-slate-600 text-white font-medium py-2 px-4 rounded-lg transition-colors"
                            >
                                Kapat
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}