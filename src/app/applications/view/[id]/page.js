// src/app/applications/view/[id]/page.js
'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { Edit3, Trash2, ArrowLeft } from 'lucide-react'; // İkonlar

const API_BASE_URL = 'https://localhost:7191'; // KENDİ API ADRESİNLE GÜNCELLE!

// Bu yardımcı fonksiyonlar ve mapping'ler diğer sayfalardan alınabilir veya merkezi bir yerde tutulabilir
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
            options.hour12 = false; // 24 saat formatı
        }
        return new Date(dateString).toLocaleDateString('tr-TR', options);
    } catch (error) {
        return 'Geçersiz Tarih';
    }
}

export default function ApplicationDetailPage() {
    const router = useRouter();
    const params = useParams();
    const applicationId = params.id;

    const [application, setApplication] = useState(null);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        if (applicationId) {
            const fetchApplicationDetail = async () => {
                setIsLoading(true);
                setError(null);
                try {
                    const response = await fetch(`${API_BASE_URL}/api/JobApplication/${applicationId}`);
                    if (!response.ok) {
                        const errorData = await response.text();
                        throw new Error(`API Hatası (${response.status}): ${errorData || response.statusText}`);
                    }
                    const data = await response.json();
                    setApplication(data);
                } catch (err) {
                    console.error("Başvuru detayı çekilirken hata:", err);
                    setError(err.message);
                } finally {
                    setIsLoading(false);
                }
            };
            fetchApplicationDetail();
        }
    }, [applicationId]);

    const handleDelete = async () => {
        if (!application) return;
        if (window.confirm(`'${application.companyName} - ${application.position}' başlıklı başvuruyu silmek istediğinize emin misiniz?`)) {
            try {
                const response = await fetch(`${API_BASE_URL}/api/JobApplication/${application.id}`, {
                    method: 'DELETE',
                });
                if (response.ok) {
                    alert('Başvuru başarıyla silindi!');
                    router.push('/applications'); // Başvurular listesine yönlendir
                } else {
                    const errorData = await response.text();
                    alert(`Başvuru silinemedi: ${errorData || response.statusText}`);
                }
            } catch (err) {
                alert('Başvuru silinirken bir ağ hatası oluştu.');
                console.error("Silme hatası:", err);
            }
        }
    };

    if (isLoading) return <div className="text-center py-20"><p className="text-slate-700 text-xl">Başvuru detayları yükleniyor...</p></div>;
    if (error) return <div className="text-center py-20 bg-red-50 p-6 rounded-lg"><p className="text-red-700 text-xl font-semibold">Hata!</p><p className="text-red-600">{error}</p></div>;
    if (!application) return <div className="text-center py-20"><p className="text-slate-700 text-xl">Başvuru bulunamadı.</p></div>;

    const currentStatus = statusMapping[application.status] || { label: `Bilinmeyen (${application.status})`, className: 'bg-gray-100 text-gray-800 border-gray-300' };

    return (
        <div className="max-w-3xl mx-auto p-4 md:p-8">
            <div className="mb-6">
                <button onClick={() => router.back()} className="flex items-center text-blue-600 hover:text-blue-800 font-medium transition-colors">
                    <ArrowLeft size={20} className="mr-2" />
                    Geri Dön
                </button>
            </div>

            <div className="bg-white p-6 md:p-8 rounded-xl shadow-2xl">
                <div className="flex flex-col sm:flex-row justify-between items-start mb-6 pb-6 border-b border-slate-200">
                    <div>
                        <h1 className="text-3xl md:text-4xl font-bold text-slate-800">{application.companyName}</h1>
                        <p className="text-xl md:text-2xl text-blue-600 font-medium">{application.position}</p>
                    </div>
                    <div className="mt-4 sm:mt-0 flex space-x-3">
                        <Link href={`/applications/edit/${application.id}`} className="bg-blue-500 hover:bg-blue-600 text-white font-medium py-2 px-4 rounded-lg shadow hover:shadow-md transition-all flex items-center text-sm">
                            <Edit3 size={16} className="mr-2" /> Düzenle
                        </Link>
                        <button onClick={handleDelete} className="bg-red-500 hover:bg-red-600 text-white font-medium py-2 px-4 rounded-lg shadow hover:shadow-md transition-all flex items-center text-sm">
                            <Trash2 size={16} className="mr-2" /> Sil
                        </button>
                    </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-4 text-sm">
                    <div>
                        <p className="text-slate-500 font-medium">Başvuru Tarihi:</p>
                        <p className="text-slate-700 text-base">{formatDate(application.appliedDate)}</p>
                    </div>
                    <div>
                        <p className="text-slate-500 font-medium">Durum:</p>
                        <p className={`text-base inline-block px-3 py-1 rounded-full text-xs font-semibold border ${currentStatus.className}`}>
                            {currentStatus.label}
                        </p>
                    </div>
                    {application.interviewDate && (
                        <div>
                            <p className="text-slate-500 font-medium">Mülakat Zamanı:</p>
                            <p className="text-slate-700 text-base font-semibold">{formatDate(application.interviewDate, true)}</p>
                        </div>
                    )}
                    {application.location && (
                        <div>
                            <p className="text-slate-500 font-medium">Lokasyon:</p>
                            <p className="text-slate-700 text-base">{application.location}</p>
                        </div>
                    )}
                    {application.workModel && (
                        <div className="md:col-span-2"> {/* Geniş alana yayılabilir */}
                            <p className="text-slate-500 font-medium">Çalışma Şekli:</p>
                            <p className="text-slate-700 text-base">{application.workModel}</p>
                        </div>
                    )}
                </div>

                {application.notes && (
                    <div className="mt-8 pt-6 border-t border-slate-200">
                        <h3 className="text-xl font-semibold text-slate-800 mb-3">Notlar</h3>
                        <div className="bg-slate-50 p-4 rounded-lg prose prose-sm max-w-none whitespace-pre-wrap text-slate-700">
                            {application.notes}
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}