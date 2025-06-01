// src/app/applications/new/page.js
'use client';

import { useState, useEffect } from 'react';

// API_BASE_URL'i projenize uygun şekilde tanımlamanız gerekecek.
const API_BASE_URL = 'https://localhost:7191';
// Ya da bir environment variable'dan alabilirsiniz.
// Şimdilik fetch kısmı yorumlu olduğu için bu tanımlama kritik değil ama API'ye bağlanırken gerekecek.

export default function NewApplicationPage() {
    const [companyName, setCompanyName] = useState('');
    const [position, setPosition] = useState('');
    const [applicationDate, setApplicationDate] = useState(new Date().toISOString().split('T')[0]);
    const [status, setStatus] = useState('0'); // Varsayılan 'Beklemede'
    const [location, setLocation] = useState('');
    const [workModel, setWorkModel] = useState('');
    const [interviewDate, setInterviewDate] = useState(''); // Mülakat zamanı için state
    const [notes, setNotes] = useState('');
    const [userId, setUserId] = useState(1); // Test için varsayılan UserId

    // Durum değiştiğinde, eğer "Mülakat Aşamasında" değilse mülakat tarihini temizle
    useEffect(() => {
        if (status !== '1') { // '1', statusOptions'da "Mülakat Aşamasında"nın değeri
            setInterviewDate('');
        }
    }, [status]); // Sadece status değiştiğinde çalışır

    const handleSubmit = async (e) => {
        e.preventDefault();

        const payloadForBackend = {
            CompanyName: companyName,
            Position: position,
            AppliedDate: applicationDate,
            Status: parseInt(status, 10),
            Location: location,
            WorkModel: workModel,
            InterviewDate: interviewDate || null, // interviewDate boşsa null gönder
            Notes: notes,
            UserId: userId,
        };

        console.log('Yeni Başvuru Payload (Backend DTO):', payloadForBackend);


        const API_BASE_URL = 'https://localhost:7191'; // Burayı kendi API adresinizle değiştirin
        try {
            const response = await fetch(`${API_BASE_URL}/api/JobApplication`, { // Endpoint'inizi kontrol edin
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    // Gerekirse diğer header'lar (örn: Authorization)
                },
                body: JSON.stringify(payloadForBackend),
            });

            if (response.ok) {
                alert('Başvuru başarıyla kaydedildi!');
                // Formu sıfırlama
                setCompanyName('');
                setPosition('');
                setApplicationDate(new Date().toISOString().split('T')[0]);
                setStatus('0');
                setLocation('');
                setWorkModel('');
                setInterviewDate('');
                setNotes('');
                setUserId(1); // veya kullanıcıya göre ayarla
            } else {
                const errorData = await response.text(); // ya da .json()
                console.error('API Hatası:', response.status, errorData);
                alert(`Başvuru kaydedilemedi: ${errorData || response.statusText}`);
            }
        } catch (error) {
            console.error('API isteği sırasında hata:', error);
            alert('Bir hata oluştu. Lütfen konsolu kontrol edin.');
        }

        alert('Başvuru payload hazırlandı (konsola bak)! API bağlantısı için kodu aktif etmeyi ve API_BASE_URL\'i tanımlamayı unutma.');
    };

    const statusOptions = [
        { value: '0', label: 'Beklemede (Pending)' },
        { value: '1', label: 'Mülakat Aşamasında (Interview)' },
        { value: '2', label: 'Kabul Edildi (Accepted)' },
        { value: '3', label: 'Reddedildi (Rejected)' },
        // İsterseniz 'Süreç Devam Ediyor', 'Geri Çekildi' gibi durumları da ekleyebilirsiniz.
        // Backend'deki ApplicationStatus enum'unuzla uyumlu olmalı.
    ];

    const workModelOptions = [
        { value: '', label: 'Seçiniz...' }, // Varsayılan boş seçenek
        { value: 'Şirketten', label: 'Şirketten' },
        { value: 'Uzaktan', label: 'Uzaktan' },
        { value: 'Hibrit', label: 'Hibrit' },
    ];

    return (
        <div className="max-w-2xl mx-auto bg-white p-6 md:p-8 rounded-xl shadow-xl my-8">
            <h1 className="text-2xl md:text-3xl font-bold text-slate-800 mb-8 text-center">
                Yeni İş Başvurusu Ekle
            </h1>
            <form onSubmit={handleSubmit} className="space-y-6">
                {/* Şirket Adı */}
                <div>
                    <label htmlFor="companyName" className="block text-sm font-medium text-slate-700 mb-1">
                        Şirket Adı <span className="text-red-500">*</span>
                    </label>
                    <input
                        type="text"
                        id="companyName"
                        value={companyName}
                        onChange={(e) => setCompanyName(e.target.value)}
                        required
                        className="w-full px-4 py-2 border border-slate-300 rounded-lg shadow-sm focus:ring-blue-500 focus:border-blue-500 transition-colors duration-150"
                        placeholder="Örn: Google"
                    />
                </div>

                {/* Pozisyon */}
                <div>
                    <label htmlFor="position" className="block text-sm font-medium text-slate-700 mb-1">
                        Pozisyon <span className="text-red-500">*</span>
                    </label>
                    <input
                        type="text"
                        id="position"
                        value={position}
                        onChange={(e) => setPosition(e.target.value)}
                        required
                        className="w-full px-4 py-2 border border-slate-300 rounded-lg shadow-sm focus:ring-blue-500 focus:border-blue-500 transition-colors duration-150"
                        placeholder="Örn: Frontend Developer"
                    />
                </div>

                {/* Başvuru Tarihi */}
                <div>
                    <label htmlFor="applicationDate" className="block text-sm font-medium text-slate-700 mb-1">
                        Başvuru Tarihi <span className="text-red-500">*</span>
                    </label>
                    <input
                        type="date"
                        id="applicationDate"
                        value={applicationDate}
                        onChange={(e) => setApplicationDate(e.target.value)}
                        required
                        className="w-full px-4 py-2 border border-slate-300 rounded-lg shadow-sm focus:ring-blue-500 focus:border-blue-500 transition-colors duration-150"
                    />
                </div>

                {/* Durum */}
                <div>
                    <label htmlFor="status" className="block text-sm font-medium text-slate-700 mb-1">
                        Başvuru Durumu <span className="text-red-500">*</span>
                    </label>
                    <select
                        id="status"
                        value={status}
                        onChange={(e) => setStatus(e.target.value)}
                        required
                        className="w-full px-4 py-2 border border-slate-300 rounded-lg shadow-sm focus:ring-blue-500 focus:border-blue-500 bg-white transition-colors duration-150"
                    >
                        {statusOptions.map(option => (
                            <option key={option.value} value={option.value}>{option.label}</option>
                        ))}
                    </select>
                </div>

                {/* Mülakat Zamanı (Koşullu Gösterim) */}
                {status === '1' && ( // Sadece Durum "Mülakat Aşamasında" (value='1') ise göster
                    <div>
                        <label htmlFor="interviewDate" className="block text-sm font-medium text-slate-700 mb-1">
                            Mülakat Zamanı (Tarih ve Saat)
                            {/* Mülakat durumunda zorunlu yapmak istersen: <span className="text-red-500">*</span> */}
                        </label>
                        <input
                            type="datetime-local"
                            id="interviewDate"
                            value={interviewDate}
                            onChange={(e) => setInterviewDate(e.target.value)}
                            // required // Mülakat durumunda bu alanın zorunlu olmasını isteyebilirsin
                            className="w-full px-4 py-2 border border-slate-300 rounded-lg shadow-sm focus:ring-blue-500 focus:border-blue-500 transition-colors duration-150"
                        />
                    </div>
                )}

                {/* Lokasyon */}
                <div>
                    <label htmlFor="location" className="block text-sm font-medium text-slate-700 mb-1">Lokasyon</label>
                    <input
                        type="text"
                        id="location"
                        value={location}
                        onChange={(e) => setLocation(e.target.value)}
                        className="w-full px-4 py-2 border border-slate-300 rounded-lg shadow-sm focus:ring-blue-500 focus:border-blue-500 transition-colors duration-150"
                        placeholder="Örn: Ankara, Türkiye / Remote"
                    />
                </div>

                {/* Çalışma Şekli */}
                <div>
                    <label htmlFor="workModel" className="block text-sm font-medium text-slate-700 mb-1">Çalışma Şekli</label>
                    <select
                        id="workModel"
                        value={workModel}
                        onChange={(e) => setWorkModel(e.target.value)}
                        className="w-full px-4 py-2 border border-slate-300 rounded-lg shadow-sm focus:ring-blue-500 focus:border-blue-500 bg-white transition-colors duration-150"
                    >
                        {workModelOptions.map(option => (
                            <option key={option.value} value={option.value}>{option.label}</option>
                        ))}
                    </select>
                </div>

                {/* Notlar */}
                <div>
                    <label htmlFor="notes" className="block text-sm font-medium text-slate-700 mb-1">Notlar</label>
                    <textarea
                        id="notes"
                        value={notes}
                        onChange={(e) => setNotes(e.target.value)}
                        rows="4"
                        className="w-full px-4 py-2 border border-slate-300 rounded-lg shadow-sm focus:ring-blue-500 focus:border-blue-500 transition-colors duration-150"
                        placeholder="Bu başvuruyla ilgili önemli notlar, mülakat soruları, geri bildirimler..."
                    ></textarea>
                </div>

                {/* Kaydet Butonu */}
                <div>
                    <button
                        type="submit"
                        className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-6 rounded-lg shadow-md hover:shadow-lg transition duration-300 ease-in-out focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50"
                    >
                        Başvuruyu Kaydet
                    </button>
                </div>
            </form>
        </div>
    );
}