// src/app/applications/new/page.js
'use client';

import { useState } from 'react';

export default function NewApplicationPage() {
    // Form alanları için state'leri tanımlayalım
    const [companyName, setCompanyName] = useState('');
    const [position, setPosition] = useState('');
    const [applicationDate, setApplicationDate] = useState(new Date().toISOString().split('T')[0]);
    const [workModel, setWorkModel] = useState(''); const [location, setLocation] = useState('');
    const [status, setStatus] = useState('0');
    const [notes, setNotes] = useState('');

    const handleSubmit = (e) => {
        e.preventDefault();
        const newApplication = {
            companyName,
            position,
            applicationDate,
            location,
            workModel,
            notes,
        };
        console.log('Yeni Başvuru Bilgileri:', newApplication);
        alert('Başvuru eklendi (konsola bak)!');
        // Formu sıfırlama veya başka işlemler eklenebilir
        setCompanyName('');
        setPosition('');
        setApplicationDate(new Date().toISOString().split('T')[0]);
        setLocation('');
        setWorkModel('');
        setNotes('');
    };

    const statusOptions = [
        { value: '0', label: 'Beklemede (Pending)' },
        { value: '1', label: 'Mülakat Aşamasında (Interview)' },
        { value: '2', label: 'Kabul Edildi (Accepted)' },
        { value: '3', label: 'Reddedildi (Rejected)' },
    ];

    const workModelOptions = [
        'Seçiniz...',
        'Yüz Yüze',
        'Uzaktan',
        'Hibrit',
    ];
    return (
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

                {/* Lokasyon - Yeni Eklendi */}
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
                        placeholder="Örn: Ankara, Türkiye"
                    />
                </div>
                <div>
                    <label htmlFor="workModel" className="block text-sm font-medium text-slate-700 mb-1">
                        Çalışma Şekli
                    </label>
                    <select
                        id="workModel"
                        value={workModel}
                        onChange={(e) => setWorkModel(e.target.value)}
                        // İstersen required yapabilirsin
                        className="w-full px-4 py-2 border border-slate-300 rounded-lg shadow-sm focus:ring-blue-500 focus:border-blue-500 transition duration-150 bg-white"
                    >
                        {workModelOptions.map(option => (
                            <option key={option} value={option === 'Seçiniz...' ? '' : option}>
                                {option}
                            </option>
                        ))}
                    </select>
                </div>
                <div>
                    <label htmlFor="status" className="block text-sm font-medium text-slate-700 mb-1">
                        Başvuru Durumu <span className="text-red-500">*</span>
                    </label>
                    <select
                        id="status"
                        value={status} // String olarak tutuluyor (enum value'su)
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
                        placeholder="Bu başvuruyla ilgili önemli notlar"
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