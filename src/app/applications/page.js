'use client';

import { useState, useEffect, useMemo } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Edit3, Trash2, Search, Filter, FolderSearch } from 'lucide-react';

const API_BASE_URL = 'https://localhost:7191';
const USER_ID_FOR_TESTING = 1;

const statusMapping = {
    0: { label: 'Beklemede', className: 'bg-yellow-100 text-yellow-800 border-yellow-300' },
    1: { label: 'Mülakat Aşamasında', className: 'bg-blue-100 text-blue-800 border-blue-300' },
    2: { label: 'Kabul Edildi', className: 'bg-green-100 text-green-800 border-green-300' },
    3: { label: 'Reddedildi', className: 'bg-red-100 text-red-800 border-red-300' },
};

function formatDate(dateString) {
    if (!dateString) return 'N/A';
    try {
        const options = { year: 'numeric', month: '2-digit', day: '2-digit' };
        return new Date(dateString).toLocaleDateString('tr-TR', options);
    } catch (error) {
        return 'Geçersiz Tarih';
    }
}

export default function ApplicationsPage() {
    const [applications, setApplications] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);
    const router = useRouter();
    const [searchTermInput, setSearchTermInput] = useState(''); // <-- İŞTE BURADA TANIMLANIYOR
    const [statusFilterInput, setStatusFilterInput] = useState('');
    const [appliedSearchTerm, setAppliedSearchTerm] = useState('');
    const [appliedStatusFilter, setAppliedStatusFilter] = useState('');
    useEffect(() => {
        const fetchApplications = async () => {
            setIsLoading(true);
            setError(null);
            try {
                const response = await fetch(`${API_BASE_URL}/api/JobApplication/user/${USER_ID_FOR_TESTING}`);
                if (!response.ok) {
                    const errorData = await response.text();
                    throw new Error(`API Hatası: ${response.status} - ${errorData || response.statusText}`);
                }
                const data = await response.json();
                setApplications(data || []);
            } catch (err) {
                console.error("Başvurular çekilirken hata:", err);
                setError(err.message);
                setApplications([]);
            } finally {
                setIsLoading(false);
            }
        };
        fetchApplications();
    }, []);

    const handleDelete = async (applicationId) => {
        if (window.confirm('Bu başvuruyu silmek istediğinize emin misiniz?')) {
            try {
                const response = await fetch(`${API_BASE_URL}/api/JobApplication/${applicationId}`, {
                    method: 'DELETE',
                });

                if (response.ok) {
                    setApplications(prevApplications =>
                        prevApplications.filter(app => app.id !== applicationId)
                    );
                    alert('Başvuru başarıyla silindi!');
                } else {
                    const errorData = await response.text();
                    console.error('Silme Hatası (API):', response.status, errorData);
                    alert(`Başvuru silinemedi: ${errorData || response.statusText}`);
                }
            } catch (err) {
                console.error('Silme Hatası (Fetch):', err);
                alert('Başvuru silinirken bir ağ hatası oluştu.');
            }
        }
    };
    const handleEdit = (applicationId) => {
        router.push(`/applications/edit/${applicationId}`);
    }

    // Filtrelenmiş başvuruları hesaplamak için useMemo kullanalım
    const filteredApplications = useMemo(() => {
        if (!applications) return []; // applications henüz yüklenmediyse boş dizi dön

        return applications.filter(app => {
            const companyMatch = appliedSearchTerm
                ? app.companyName.toLowerCase().includes(appliedSearchTerm.toLowerCase())
                : true;
            const positionMatch = appliedSearchTerm
                ? app.position.toLowerCase().includes(appliedSearchTerm.toLowerCase())
                : true;
            const statusMatch = appliedStatusFilter
                ? app.status.toString() === appliedStatusFilter
                : true;

            // Arama terimi şirket veya pozisyonda geçiyorsa VE durum eşleşiyorsa
            return (companyMatch || positionMatch) && statusMatch;
        });
    }, [applications, appliedSearchTerm, appliedStatusFilter]); // Bu bağımlılıklar değiştiğinde yeniden hesapla

    const displayApplications = filteredApplications;

    const handleFilterButtonClick = () => {
        setAppliedSearchTerm(searchTermInput);
        setAppliedStatusFilter(statusFilterInput);
    };

    const handleResetFilters = () => {
        setSearchTermInput('');
        setStatusFilterInput('');
        setAppliedSearchTerm('');
        setAppliedStatusFilter('');
    };

    if (isLoading) {
        return <div className="text-center py-10"><p className="text-slate-700 text-xl">Başvurular yükleniyor...</p></div>;
    }

    if (error) {
        return (
            <div className="text-center py-10 bg-red-50 p-6 rounded-lg">
                <p className="text-red-700 text-xl font-semibold">Hata!</p><p className="text-red-600">{error}</p>
            </div>
        );
    }

    return (
        <div>
            {/* ... (Başlık ve Yeni Başvuru Ekle Butonu) ... */}
            <div className="flex justify-between items-center mb-10 mt-10 ">
                <h1 className="text-3xl md:text-4xl font-bold text-slate-800 mx-auto">
                    İş Başvurularım
                </h1>
                <Link href="/applications/new" className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-4 rounded-lg shadow-md hover:shadow-lg transition duration-300">
                    Yeni Başvuru Ekle
                </Link>
            </div>


            {/* Arama ve Filtreleme Bölümü - Güzelleştirilmiş ve Bağlanmış Hali */}
            <div className="mb-8 p-6 bg-white rounded-xl shadow-lg">
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-x-6 gap-y-4 items-end"> {/* lg:grid-cols-5 yapıldı */}

                    <div className="lg:col-span-2"> {/* Arama kutusu */}
                        <label htmlFor="searchTerm" className="block text-sm font-medium text-slate-700 mb-1">
                            Ara (Şirket, Pozisyon)
                        </label>
                        <div className="relative">
                            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                <Search size={18} className="text-slate-400" />
                            </div>
                            <input
                                type="text"
                                id="searchTerm"
                                value={searchTermInput} // State'e bağlandı
                                onChange={(e) => setSearchTermInput(e.target.value)} // State'i güncelliyor
                                className="w-full pl-10 pr-3 py-2.5 border border-slate-300 rounded-lg shadow-sm focus:ring-blue-500 focus:border-blue-500 transition duration-150 text-sm"
                                placeholder="Anahtar kelime girin..."
                            />
                        </div>
                    </div>

                    <div> {/* Durum filtresi */}
                        <label htmlFor="statusFilter" className="block text-sm font-medium text-slate-700 mb-1">
                            Durum
                        </label>
                        <select
                            id="statusFilter"
                            value={statusFilterInput} // State'e bağlandı
                            onChange={(e) => setStatusFilterInput(e.target.value)} // State'i güncelliyor
                            className="w-full px-3 py-2.5 border border-slate-300 rounded-lg shadow-sm focus:ring-blue-500 focus:border-blue-500 transition duration-150 text-sm bg-white"
                        >
                            <option value="">Tüm Durumlar</option>
                            {Object.entries(statusMapping).map(([key, { label }]) => (
                                <option key={key} value={key}>{label}</option>
                            ))}
                        </select>
                    </div>

                    {/* Filtrele Butonu */}
                    <div className="sm:col-span-1"> {/* Buton için ayrılan alan */}
                        <button
                            onClick={handleFilterButtonClick} // Handler bağlandı
                            className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2.5 px-4 rounded-lg shadow-md hover:shadow-lg transition duration-300 text-sm flex items-center justify-center">
                            <Filter size={16} className="mr-2" /> Filtrele
                        </button>
                    </div>
                    {/* Filtreleri Temizle Butonu */}
                    <div className="sm:col-span-1"> {/* Buton için ayrılan alan */}
                        <button
                            onClick={handleResetFilters}
                            className="w-full bg-slate-200 hover:bg-slate-300 text-slate-700 font-medium py-2.5 px-4 rounded-lg transition duration-300 text-sm flex items-center justify-center">
                            Temizle
                        </button>
                    </div>
                </div>
                {/* Notu kaldırdım, artık işlevsel olacak */}
            </div>

            {/* Başvuru Tablosu (displayApplications kullanıyor) */}
            {displayApplications.length === 0 && !isLoading ? (
                // ... (Boş durum mesajı) ...
                <div className="text-center py-10 bg-white p-8 rounded-xl shadow-lg">
                    <FolderSearch size={64} className="text-slate-400 mx-auto mb-4" />
                    <p className="text-slate-600 text-xl mb-2">
                        {(appliedSearchTerm || appliedStatusFilter) ? "Bu kriterlere uygun başvuru bulunamadı." : "Henüz hiç iş başvurunuz bulunmuyor."}
                    </p>
                    {!(appliedSearchTerm || appliedStatusFilter) &&
                        <p className="text-slate-500">Hemen ilk başvurunuzu ekleyerek takibe başlayın!</p>
                    }
                    {(appliedSearchTerm || appliedStatusFilter) &&
                        <button onClick={handleResetFilters} className="mt-4 text-blue-600 hover:text-blue-800 font-semibold">Filtreleri Temizle</button>
                    }
                </div>
            ) : (
                <div className="bg-white shadow-xl rounded-lg overflow-x-auto mb-10">
                    <table className="w-full text-sm text-left text-slate-700">
                        {/* ... (thead ve tbody displayApplications ile render edilecek - öncekiyle aynı) ... */}
                        <thead className="text-xs text-slate-700 uppercase bg-slate-100">
                            <tr>
                                <th scope="col" className="px-6 py-3">Şirket Adı</th>
                                <th scope="col" className="px-6 py-3">Pozisyon</th>
                                <th scope="col" className="px-6 py-3">Başvuru Tarihi</th>
                                <th scope="col" className="px-6 py-3">Durum</th>
                                <th scope="col" className="px-6 py-3">Lokasyon</th>
                                <th scope="col" className="px-6 py-3">Çalışma Şekli</th>
                                <th scope="col" className="px-6 py-3">Notlar</th>
                                <th scope="col" className="px-6 py-3 text-center">Eylemler</th>
                            </tr>
                        </thead>
                        <tbody>
                            {displayApplications.map((app) => (
                                <tr key={app.id} className="bg-white border-b hover:bg-slate-50 ">
                                    <td className="px-6 py-4 font-medium text-slate-900 whitespace-nowrap">{app.companyName}</td>
                                    <td className="px-6 py-4">{app.position}</td>
                                    <td className="px-6 py-4">{formatDate(app.appliedDate)}</td>
                                    <td className="px-6 py-4">
                                        <span className={`px-2 py-1 rounded-full text-xs font-semibold border ${statusMapping[app.status]?.className || 'bg-gray-100 text-gray-800 border-gray-300'}`}>
                                            {statusMapping[app.status]?.label || `Bilinmeyen (${app.status})`}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4">{app.location || '-'}</td>
                                    <td className="px-6 py-4">{app.workModel || '-'}</td>
                                    <td className="px-6 py-4">
                                        {app.notes ? (
                                            <span title={app.notes} className="cursor-pointer">📝 Gözat</span>
                                        ) : '-'}
                                    </td>
                                    <td className="px-6 py-4 text-center space-x-2">
                                        <button onClick={() => handleEdit(app.id)} title="Düzenle" className="text-blue-600 hover:text-blue-800">
                                            <Edit3 size={18} />
                                        </button>
                                        <button onClick={() => handleDelete(app.id)} title="Sil" className="text-red-600 hover:text-red-800">
                                            <Trash2 size={18} />
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}
        </div>
    );
}
