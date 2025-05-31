// src/app/statistics/page.js
'use client';

import { useState, useEffect } from 'react';
import { Line } from 'react-chartjs-2';
import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    Title,
    Tooltip,
    Legend,
    Filler,
} from 'chart.js';

ChartJS.register(
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    Title,
    Tooltip,
    Legend,
    Filler
);

const API_BASE_URL = 'https://localhost:7191'; // KENDİ API ADRESİNLE GÜNCELLE!
const USER_ID_FOR_TESTING = 1;

const STATUS_ENUM = {
    PENDING: 0,
    INTERVIEW: 1,
    ACCEPTED: 2,
    REJECTED: 3,
};

// Haftanın başlangıç tarihini (Pazartesi) YYYY-MM-DD formatında döndüren helper fonksiyonu
function getStartOfWeek(dateString) {
    const date = new Date(dateString);
    const day = date.getDay(); // Pazar = 0, Pazartesi = 1, ..., Cumartesi = 6
    // Pazartesiye olan farkı hesapla. Eğer Pazar ise (0), 6 gün geri git. Diğer günler için (1-day) kadar geri git.
    const diff = date.getDate() - day + (day === 0 ? -6 : 1);
    const monday = new Date(date.setDate(diff));
    return monday.toISOString().substring(0, 10); // YYYY-MM-DD
}

export default function StatisticsPage() {
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);

    const [counts, setCounts] = useState({
        rejected: 0,
        accepted: 0,
        interview: 0,
        totalApplied: 0,
    });
    const [applicationsOverTimeData, setApplicationsOverTimeData] = useState({
        labels: [],
        datasets: [
            {
                label: 'Haftalık Başvuru Sayısı', // Etiket güncellendi
                data: [],
                fill: true,
                borderColor: 'rgb(75, 192, 192)', // Farklı bir renk deneyebiliriz
                backgroundColor: 'rgba(75, 192, 192, 0.2)',
                tension: 0.3,
                pointBackgroundColor: 'rgb(75, 192, 192)',
                pointBorderColor: '#fff',
                pointHoverRadius: 7,
                pointHoverBackgroundColor: 'rgb(75, 192, 192)',
            },
        ],
    });

    useEffect(() => {
        const fetchAndProcessData = async () => {
            setIsLoading(true);
            setError(null);
            try {
                const response = await fetch(`${API_BASE_URL}/api/JobApplication/user/${USER_ID_FOR_TESTING}`);
                if (!response.ok) {
                    const errorData = await response.text();
                    throw new Error(`API Hatası: ${response.status} - ${errorData || response.statusText}`);
                }
                const rawApplications = await response.json() || [];

                // Sayısal istatistikleri hesapla (Bu kısım aynı kalıyor)
                let rejectedCount = 0;
                let acceptedCount = 0;
                let interviewCount = 0;
                rawApplications.forEach(app => {
                    if (app.status === STATUS_ENUM.REJECTED) rejectedCount++;
                    if (app.status === STATUS_ENUM.ACCEPTED) acceptedCount++;
                    if (app.status === STATUS_ENUM.INTERVIEW) interviewCount++;
                });
                setCounts({
                    rejected: rejectedCount,
                    accepted: acceptedCount,
                    interview: interviewCount,
                    totalApplied: rawApplications.length,
                });

                // Zamana göre başvuru sayısı için veriyi işle (HAFTALIK bazda)
                const weeklyData = {}; // { 'YYYY-MM-DD (Pazartesi)': count }
                rawApplications.forEach(app => {
                    if (app.appliedDate) {
                        try {
                            const weekStartDate = getStartOfWeek(app.appliedDate);
                            weeklyData[weekStartDate] = (weeklyData[weekStartDate] || 0) + 1;
                        } catch (e) {
                            console.warn("Geçersiz tarih formatı veya hesaplama hatası:", app.appliedDate, e);
                        }
                    }
                });

                const sortedWeekStarts = Object.keys(weeklyData).sort();

                const chartLabels = sortedWeekStarts.map(weekStartDate => {
                    // Haftanın başlangıç tarihini daha okunaklı bir etikete çevir (örn: 26 May)
                    const date = new Date(weekStartDate);
                    // Haftanın sonunu da ekleyebiliriz: örn "26 May - 01 Haz"
                    const weekEnd = new Date(date);
                    weekEnd.setDate(date.getDate() + 6);
                    return `${date.toLocaleDateString('tr-TR', { day: '2-digit', month: 'short' })} - ${weekEnd.toLocaleDateString('tr-TR', { day: '2-digit', month: 'short', year: 'numeric' })}`;
                });
                const chartDataPoints = sortedWeekStarts.map(weekStartDate => weeklyData[weekStartDate]);

                setApplicationsOverTimeData(prevData => ({
                    ...prevData,
                    labels: chartLabels,
                    datasets: [
                        {
                            ...prevData.datasets[0],
                            label: 'Haftalık Başvuru Sayısı', // Etiket güncellendi
                            data: chartDataPoints,
                        },
                    ],
                }));

            } catch (err) {
                console.error("Veri çekilirken veya işlenirken hata:", err);
                setError(err.message);
            } finally {
                setIsLoading(false);
            }
        };

        fetchAndProcessData();
    }, []);

    // chartOptions objesi (öncekiyle aynı kalabilir, gerekirse küçük ayarlar yapılabilir)
    const chartOptions = {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
            legend: {
                position: 'top',
                labels: { font: { size: 14, family: 'inherit' } }
            },
            title: {
                display: true,
                text: 'Zamana Göre Başvuru Dağılımı (Haftalık)',
                font: { size: 18, family: 'inherit' }
            },
            tooltip: {
                backgroundColor: 'rgba(0,0,0,0.7)',
                titleFont: { size: 14, family: 'inherit' },
                bodyFont: { size: 12, family: 'inherit' },
                intersect: false,
                mode: 'index',
            }
        },
        scales: {
            y: {
                beginAtZero: true,
                ticks: {
                    stepSize: 1, // Adım büyüklüğü 1 olarak kalmalı
                    font: { family: 'inherit' },
                    // YENİ EKLENEN CALLBACK FONKSİYONU
                    callback: function (value, index, values) {
                        if (Math.floor(value) === value) { // Değerin tam sayı olup olmadığını kontrol et
                            return value; // Eğer tam sayı ise göster
                        }
                        // Tam sayı değilse bir şey döndürme (etiket boş olur)
                        // Veya null döndürerek Chart.js'in bazı durumlarda etiketi atlamasını sağlayabilirsin.
                    }
                },
                grid: { color: 'rgba(200, 200, 200, 0.2)' }
            },
            x: {
                ticks: { font: { family: 'inherit' } },
                grid: { display: true, color: 'rgba(200, 200, 200, 0.1)' }
            }
        },
        interaction: {
            mode: 'nearest',
            axis: 'x',
            intersect: false
        }
    };

    // ... (isLoading, error JSX return'leri burada - değişiklik yok)
    if (isLoading) { /* ... */ }
    if (error) { /* ... */ }

    return (
        <div>
            <h1 className="text-3xl md:text-4xl font-bold text-slate-800 mb-10 mt-10 text-center">
                Başvuru İstatistikleri
            </h1>

            {/* Sayısal İstatistikler (öncekiyle aynı) */}
            {/* ... */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
                <div className="bg-white p-6 rounded-xl shadow-lg text-center">
                    <h2 className="text-4xl font-bold text-blue-600">{counts.totalApplied}</h2>
                    <p className="text-slate-600 mt-1">Toplam Başvuru</p>
                </div>
                <div className="bg-white p-6 rounded-xl shadow-lg text-center">
                    <h2 className="text-4xl font-bold text-green-500">{counts.accepted}</h2>
                    <p className="text-slate-600 mt-1">Kabul Edilen</p>
                </div>
                <div className="bg-white p-6 rounded-xl shadow-lg text-center">
                    <h2 className="text-4xl font-bold text-yellow-500">{counts.interview}</h2>
                    <p className="text-slate-600 mt-1">Mülakattakiler</p>
                </div>
                <div className="bg-white p-6 rounded-xl shadow-lg text-center">
                    <h2 className="text-4xl font-bold text-red-500">{counts.rejected}</h2>
                    <p className="text-slate-600 mt-1">Reddedilen</p>
                </div>
            </div>

            {/* Zamana Göre Grafik */}
            <div className="bg-white p-4 md:p-6 rounded-xl mb-10 shadow-lg">
                <h2 className="text-xl md:text-2xl font-semibold text-slate-700 mb-6 text-center">
                    Haftalık Başvuru Sayısı Grafiği
                </h2>
                <div className="relative h-[300px] md:h-[400px] w-full">
                    {applicationsOverTimeData.labels.length > 0 ? (
                        <Line options={chartOptions} data={applicationsOverTimeData} />
                    ) : (
                        <p className="text-center text-slate-500 flex items-center justify-center h-full">
                            Grafik için yeterli veri bulunmuyor.
                        </p>
                    )}
                </div>
            </div>
        </div>
    );
}