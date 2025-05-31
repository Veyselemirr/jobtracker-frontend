'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Edit3, Trash2, Search, Filter, FolderSearch } from 'lucide-react'; // FolderSearch ikonu eklendi

const API_BASE_URL = 'https://localhost:7191'; // KENDİ API ADRESİNLE GÜNCELLE!
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
    // Arama ve filtreleme için state'ler (ileride kullanılacak)
    // const [searchTerm, setSearchTerm] = useState('');
    // const [statusFilterValue, setStatusFilterValue] = useState(''); // Örnek filtre state'i

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
                    // Gerekirse ek header'lar (örn: Authorization)
                });

                if (response.ok) { // Backend genellikle 200 OK veya 204 No Content döner
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

    // İleride filtrelenmiş başvurular burada olacak
    // const filteredApplications = applications.filter(app => {
    //   // Arama terimi kontrolü
    //   const matchesSearchTerm = searchTerm ? 
    //     (app.companyName.toLowerCase().includes(searchTerm.toLowerCase()) || 
    //      app.position.toLowerCase().includes(searchTerm.toLowerCase())) 
    //     : true;
    //   // Durum filtresi kontrolü
    //   const matchesStatus = statusFilterValue ? app.status.toString() === statusFilterValue : true;
    //   return matchesSearchTerm && matchesStatus;
    // });
    // const displayApplications = searchTerm || statusFilterValue ? filteredApplications : applications;
    const displayApplications = applications; // Şimdilik tüm başvuruları göster


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
            <div className="flex justify-between items-center mb-8 mt-8">
                <h1 className="text-3xl md:text-4xl font-bold text-slate-800">
                    İş Başvurularım
                </h1>
                <Link href="/applications/new" className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-4 rounded-lg shadow-md hover:shadow-lg transition duration-300">
                    Yeni Başvuru Ekle
                </Link>
            </div>

            {/* Arama ve Filtreleme Bölümü - Güzelleştirilmiş Hali */}
            <div className="mb-10 p-6 bg-white rounded-xl shadow-lg">
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-x-6 gap-y-4 items-end">

                    <div className="lg:col-span-2">
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
                                // value={searchTerm}
                                // onChange={(e) => setSearchTerm(e.target.value)}
                                className="w-full pl-10 pr-3 py-2.5 border border-slate-300 rounded-lg shadow-sm focus:ring-blue-500 focus:border-blue-500 transition duration-150 text-sm"
                                placeholder="Anahtar kelime girin..."
                            />
                        </div>
                    </div>

                    <div>
                        <label htmlFor="statusFilter" className="block text-sm font-medium text-slate-700 mb-1">
                            Durum
                        </label>
                        <select
                            id="statusFilter"
                            // value={statusFilterValue}
                            // onChange={(e) => setStatusFilterValue(e.target.value)}
                            className="w-full px-3 py-2.5 border border-slate-300 rounded-lg shadow-sm focus:ring-blue-500 focus:border-blue-500 transition duration-150 text-sm bg-white"
                        >
                            <option value="">Tüm Durumlar</option>
                            {Object.entries(statusMapping).map(([key, { label }]) => (
                                <option key={key} value={key}>{label}</option>
                            ))}
                        </select>
                    </div>

                    <div className="flex space-x-2">
                        <button
                            // onClick={handleFilter} // İleride eklenecek
                            className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2.5 px-4 rounded-lg shadow-md hover:shadow-lg transition duration-300 text-sm flex items-center justify-center">
                            <Filter size={16} className="mr-2" /> Filtrele
                        </button>
                    </div>
                </div>
                <p className="text-xs text-slate-500 mt-4 text-center">
                    Not: Arama ve filtreleme işlevselliği ilerleyen aşamalarda eklenecektir.
                </p>
            </div>

            {displayApplications.length === 0 && !isLoading ? ( // isLoading kontrolü eklendi
                <div className="text-center py-10 bg-white p-8 rounded-xl shadow-lg">
                    <FolderSearch size={64} className="text-slate-400 mx-auto mb-4" />
                    <p className="text-slate-600 text-xl mb-2">Henüz hiç iş başvurunuz bulunmuyor.</p>
                    <p className="text-slate-500">Hemen ilk başvurunuzu ekleyerek takibe başlayın!</p>
                </div>
            ) : (
                <div className="bg-white shadow-xl rounded-lg overflow-x-auto">
                    <table className="w-full text-sm text-left text-slate-700">
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
                                <tr key={app.id} className="bg-white border-b hover:bg-slate-50">
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