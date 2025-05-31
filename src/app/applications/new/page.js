'use client';

import { useState } from 'react';


const API_BASE_URL = 'https://localhost:7191';

export default function NewApplicationPage() {
    const [companyName, setCompanyName] = useState('');
    const [position, setPosition] = useState('');
    const [applicationDate, setApplicationDate] = useState(new Date().toISOString().split('T')[0]);
    const [status, setStatus] = useState('0');
    const [location, setLocation] = useState('');
    const [workModel, setWorkModel] = useState('');
    const [notes, setNotes] = useState('');
    const [userId, setUserId] = useState(1); // Test için varsayılan UserId

    const handleSubmit = async (e) => {
        e.preventDefault();

        const payloadForBackend = {
            CompanyName: companyName,
            Position: position,
            AppliedDate: applicationDate,
            Status: parseInt(status, 10),
            Notes: notes,
            UserId: userId,
            Location: location,
            WorkModel: workModel,
        };

        console.log('Backend API\'ye gönderilecek payload:', payloadForBackend);

        try {
            const response = await fetch(`${API_BASE_URL}/api/JobApplication`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(payloadForBackend),
            });

            if (response.ok) { // Genellikle 200-299 arası durum kodları
                const result = await response.json(); // Backend'den dönen veriyi al (oluşturulan başvuru gibi)
                console.log('API Başarılı Cevap:', result);
                alert('Başvuru başarıyla kaydedildi!');

                // Formu sıfırla
                setCompanyName('');
                setPosition('');
                setApplicationDate(new Date().toISOString().split('T')[0]);
                setStatus('0');
                setLocation('');
                setWorkModel('');
                setNotes('');
                // setUserId(1); // Gerekirse
            } else {
                // API'den hata cevabı geldiyse
                const errorData = await response.text(); // Hata mesajını metin olarak almayı dene
                console.error('API Hata Cevabı:', response.status, response.statusText, errorData);
                alert(`Başvuru kaydedilemedi. Sunucu hatası: ${response.status} - ${errorData || response.statusText}`);
            }
        } catch (error) {
            // Network hatası veya fetch sırasında başka bir sorun oluştuysa
            console.error('İstek Gönderilirken Hata Oluştu (Fetch):', error);
            alert('Başvuru gönderilirken bir ağ hatası oluştu. Lütfen konsolu kontrol edin veya API\'nizin çalıştığından emin olun.');
        }
    };

    const statusOptions = [
        { value: '0', label: 'Beklemede (Pending)' },
        { value: '1', label: 'Mülakat Aşamasında (Interview)' },
        { value: '2', label: 'Kabul Edildi (Accepted)' },
        { value: '3', label: 'Reddedildi (Rejected)' },
    ];

    const workModelOptions = [
        { value: '', label: 'Seçiniz...' },
        { value: 'Şirketten', label: 'Şirketten' },
        { value: 'Uzaktan', label: 'Uzaktan' },
        { value: 'Hibrit', label: 'Hibrit' },
    ];

    return (
        // JSX yapısı burada (öncekiyle aynı, değişiklik yok)
        <div className="max-w-2xl mx-auto bg-white p-8 rounded-xl shadow-xl">
            <h1 className="text-3xl font-bold text-slate-800 mb-8 text-center">
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
                        className="w-full px-4 py-2 border border-slate-300 rounded-lg shadow-sm focus:ring-blue-500 focus:border-blue-500 transition duration-150"
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
                        className="w-full px-4 py-2 border border-slate-300 rounded-lg shadow-sm focus:ring-blue-500 focus:border-blue-500 transition duration-150"
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
                        className="w-full px-4 py-2 border border-slate-300 rounded-lg shadow-sm focus:ring-blue-500 focus:border-blue-500 transition duration-150"
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
                        className="w-full px-4 py-2 border border-slate-300 rounded-lg shadow-sm focus:ring-blue-500 focus:border-blue-500 transition duration-150 bg-white"
                    >
                        {statusOptions.map(option => (
                            <option key={option.value} value={option.value}>
                                {option.label}
                            </option>
                        ))}
                    </select>
                </div>

                {/* Lokasyon */}
                <div>
                    <label htmlFor="location" className="block text-sm font-medium text-slate-700 mb-1">
                        Lokasyon
                    </label>
                    <input
                        type="text"
                        id="location"
                        value={location}
                        onChange={(e) => setLocation(e.target.value)}
                        className="w-full px-4 py-2 border border-slate-300 rounded-lg shadow-sm focus:ring-blue-500 focus:border-blue-500 transition duration-150"
                        placeholder="Örn: Ankara, Türkiye / Remote"
                    />
                </div>

                {/* Çalışma Şekli */}
                <div>
                    <label htmlFor="workModel" className="block text-sm font-medium text-slate-700 mb-1">
                        Çalışma Şekli
                    </label>
                    <select
                        id="workModel"
                        value={workModel}
                        onChange={(e) => setWorkModel(e.target.value)}
                        className="w-full px-4 py-2 border border-slate-300 rounded-lg shadow-sm focus:ring-blue-500 focus:border-blue-500 transition duration-150 bg-white"
                    >
                        {workModelOptions.map(option => (
                            <option key={option.value} value={option.value}>
                                {option.label}
                            </option>
                        ))}
                    </select>
                </div>

                {/* Notlar */}
                <div>
                    <label htmlFor="notes" className="block text-sm font-medium text-slate-700 mb-1">
                        Notlar
                    </label>
                    <textarea
                        id="notes"
                        value={notes}
                        onChange={(e) => setNotes(e.target.value)}
                        rows="4"
                        className="w-full px-4 py-2 border border-slate-300 rounded-lg shadow-sm focus:ring-blue-500 focus:border-blue-500 transition duration-150"
                        placeholder="Bu başvuruyla ilgili önemli notlar..."
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