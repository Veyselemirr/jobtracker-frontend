// src/app/applications/edit/[id]/page.js
'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation'; // useParams ID'yi almak, useRouter yönlendirme için
import Link from 'next/link'; // Geri dön butonu için

const API_BASE_URL = 'https://localhost:7191'; // KENDİ API ADRESİNLE GÜNCELLE!

// Bu statusMapping ve workModelOptions 'Yeni Başvuru' sayfasındaki ile aynı olabilir
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

export default function EditApplicationPage() {
    const router = useRouter();
    const params = useParams(); // URL'den dinamik parametreleri almak için (örn: params.id)
    const applicationId = params.id;

    const [application, setApplication] = useState(null); // Düzenlenecek başvuru verisi
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);
    // Form alanlarının state'ini tek bir obje içinde tutmak, pre-fill için daha kolay
    const [formData, setFormData] = useState({
        companyName: '',
        position: '',
        appliedDate: '',
        status: '0', // Varsayılan
        location: '',
        workModel: '',
        notes: '',
        userId: 1, // Bu da fetch edilen veriden veya sabit olabilir
    });

    // Başvuru verilerini çekmek için useEffect
    useEffect(() => {
        if (applicationId) {
            const fetchApplicationDetails = async () => {
                setIsLoading(true);
                setError(null);
                try {
                    const response = await fetch(`${API_BASE_URL}/api/JobApplication/${applicationId}`);
                    if (!response.ok) {
                        const errorData = await response.text();
                        throw new Error(`API Hatası (${response.status}): ${errorData || response.statusText}`);
                    }
                    const data = await response.json();
                    setApplication(data); // Ham veriyi de saklayalım (opsiyonel)
                    // Form state'ini backend'den gelen veriyle doldur
                    setFormData({
                        companyName: data.companyName || '',
                        position: data.position || '',
                        // Tarihi YYYY-MM-DD formatına çeviriyoruz input[type="date"] için
                        appliedDate: data.appliedDate ? new Date(data.appliedDate).toISOString().split('T')[0] : '',
                        status: data.status !== undefined ? data.status.toString() : '0', // Backend int döner, select string value bekler
                        location: data.location || '',
                        workModel: data.workModel || '',
                        notes: data.notes || '',
                        userId: data.userId || 1, // Backend'den UserId geliyorsa onu kullan
                    });
                } catch (err) {
                    console.error("Başvuru detayı çekilirken hata:", err);
                    setError(err.message);
                } finally {
                    setIsLoading(false);
                }
            };
            fetchApplicationDetails();
        }
    }, [applicationId]); // applicationId değiştiğinde tekrar çalışır

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prevData => ({
            ...prevData,
            [name]: value,
        }));
    };

    const handleUpdate = async (e) => {
        e.preventDefault();

        // Backend'in JobApplicationUpdateDto'suna uygun payload
        const payloadForBackend = {
            Id: parseInt(applicationId, 10), // ID'yi de göndermen gerekebilir DTO'ya bağlı
            CompanyName: formData.companyName,
            Position: formData.position,
            AppliedDate: formData.appliedDate,
            Status: parseInt(formData.status, 10),
            Notes: formData.notes,
            UserId: formData.userId, // DTO'da UserId varsa
            // DİKKAT: Eğer Location ve WorkModel alanlarını da güncellemek istiyorsan,
            // C# JobApplicationUpdateDto'nuzda ve backend Update mantığınızda bu alanlar olmalı!
            Location: formData.location,
            WorkModel: formData.workModel,
        };

        console.log('Güncellenecek Payload:', payloadForBackend);

        try {
            const response = await fetch(`${API_BASE_URL}/api/JobApplication/${applicationId}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(payloadForBackend),
            });

            if (response.ok) {
                alert('Başvuru başarıyla güncellendi!');
                router.push('/applications'); // Başvurularım sayfasına geri dön
            } else {
                const errorData = await response.text();
                console.error('Güncelleme Hatası (API):', response.status, errorData);
                alert(`Başvuru güncellenemedi: ${errorData || response.statusText}`);
            }
        } catch (err) {
            console.error('Güncelleme Hatası (Fetch):', err);
            alert('Başvuru güncellenirken bir ağ hatası oluştu.');
        }
    };

    if (isLoading) return <div className="text-center py-10"><p className="text-slate-700 text-xl">Başvuru yükleniyor...</p></div>;
    if (error) return <div className="text-center py-10 bg-red-50 p-6 rounded-lg"><p className="text-red-700 text-xl font-semibold">Hata!</p><p className="text-red-600">{error}</p></div>;
    if (!application && !isLoading) return <div className="text-center py-10"><p className="text-slate-700 text-xl">Başvuru bulunamadı.</p></div>;

    return (
        <div className="max-w-2xl mx-auto bg-white p-8 mt-8 mb-8 rounded-xl shadow-xl">
            <h1 className="text-3xl font-bold text-slate-800 mb-2 text-center">
                Başvuruyu Düzenle
            </h1>
            {application && <p className="text-center text-slate-600 mb-8 text-lg">{application.companyName} - {application.position}</p>}

            <form onSubmit={handleUpdate} className="space-y-6">
                {/* Şirket Adı */}
                <div>
                    <label htmlFor="companyName" className="block text-sm font-medium text-slate-700 mb-1">
                        Şirket Adı <span className="text-red-500">*</span>
                    </label>
                    <input
                        type="text"
                        id="companyName"
                        name="companyName" // State'i güncellemek için name attribute'u önemli
                        value={formData.companyName}
                        onChange={handleChange}
                        required
                        className="w-full px-4 py-2 border border-slate-300 rounded-lg shadow-sm focus:ring-blue-500 focus:border-blue-500"
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
                        name="position"
                        value={formData.position}
                        onChange={handleChange}
                        required
                        className="w-full px-4 py-2 border border-slate-300 rounded-lg shadow-sm focus:ring-blue-500 focus:border-blue-500"
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
                        name="applicationDate"
                        value={formData.appliedDate}
                        onChange={handleChange}
                        required
                        className="w-full px-4 py-2 border border-slate-300 rounded-lg shadow-sm focus:ring-blue-500 focus:border-blue-500"
                    />
                </div>

                {/* Durum */}
                <div>
                    <label htmlFor="status" className="block text-sm font-medium text-slate-700 mb-1">
                        Başvuru Durumu <span className="text-red-500">*</span>
                    </label>
                    <select
                        id="status"
                        name="status"
                        value={formData.status}
                        onChange={handleChange}
                        required
                        className="w-full px-4 py-2 border border-slate-300 rounded-lg shadow-sm focus:ring-blue-500 focus:border-blue-500 bg-white"
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
                        name="location"
                        value={formData.location}
                        onChange={handleChange}
                        className="w-full px-4 py-2 border border-slate-300 rounded-lg shadow-sm focus:ring-blue-500 focus:border-blue-500"
                    />
                </div>

                {/* Çalışma Şekli */}
                <div>
                    <label htmlFor="workModel" className="block text-sm font-medium text-slate-700 mb-1">
                        Çalışma Şekli
                    </label>
                    <select
                        id="workModel"
                        name="workModel"
                        value={formData.workModel}
                        onChange={handleChange}
                        className="w-full px-4 py-2 border border-slate-300 rounded-lg shadow-sm focus:ring-blue-500 focus:border-blue-500 bg-white"
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
                        name="notes"
                        value={formData.notes}
                        onChange={handleChange}
                        rows="4"
                        className="w-full px-4 py-2 border border-slate-300 rounded-lg shadow-sm focus:ring-blue-500 focus:border-blue-500"
                    ></textarea>
                </div>

                <div className="flex items-center justify-end space-x-3 pt-4">
                    <Link href="/applications" className="text-slate-600 hover:text-slate-800 font-medium py-2 px-4 rounded-lg border border-slate-300 hover:bg-slate-100 transition duration-150">
                        İptal
                    </Link>
                    <button
                        type="submit"
                        className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2.5 px-6 rounded-lg shadow-md hover:shadow-lg transition duration-300"
                    >
                        Değişiklikleri Kaydet
                    </button>
                </div>
            </form>
        </div>
    );
}