import { Layers, CalendarDays, BarChart3 } from "lucide-react";

export default function HomePage() {
  return (
    <>
      <section className="text-center py-16 md:py-4 mt-8"> {/* Arka plan class'ı kaldırıldı, padding ayarlandı */}
        <div className="container mx-auto px-6">
          <h1 className="text-5xl md:text-6xl font-bold text-slate-800 mb-6">
            Kariyer Yolculuğunuzda <span className="text-blue-600">Kontrol Sizde</span>
          </h1>
          <p className="text-xl text-slate-600 mb-10 max-w-2xl mx-auto">
            JobTracker ile iş başvurularınızı kolayca yönetin, mülakatlarınızı planlayın ve hayalinizdeki kariyere emin adımlarla ilerleyin. Yeni mezunların iş arama sürecindeki en büyük yardımcısı!
          </p>
          <a
            href="/register"
            className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-8 rounded-lg text-lg md:text-xl transition duration-300 ease-in-out transform hover:scale-105 shadow-md hover:shadow-lg"
          >
            Hemen Ücretsiz Başla
          </a>
        </div>
      </section>
      <section className="py-16 md:py-10 bg-slate-200 mb-8"> {/* Ana sayfa arka planıyla aynı veya çok hafif farklı olabilir */}
        <div className="container mx-auto px-6">
          <h2 className="text-3xl md:text-4xl font-bold text-center text-slate-800 mb-16 md:mb-12">
            Neden JobTracker?
          </h2>
          <div className="grid md:grid-cols-3 gap-8">
            {/* Feature 1 */}
            <div className="bg-white p-8 rounded-xl shadow-lg hover:shadow-2xl transition-shadow duration-300 flex flex-col items-center text-center">
              <div className="bg-blue-100 p-4 rounded-full mb-6 inline-block"> {/* İkon için arka plan */}
                <Layers size={40} className="text-blue-600" strokeWidth={1.5} />
              </div>
              <h3 className="text-2xl font-semibold text-slate-800 mb-3">
                Tüm Başvurular Tek Yerde
              </h3>
              <p className="text-slate-600 leading-relaxed">
                Farklı platformlardaki tüm iş başvurularınızı merkezi bir noktadan takip edin, hiçbir fırsatı kaçırmayın.
              </p>
            </div>

            {/* Feature 2 */}
            <div className="bg-white p-8 rounded-xl shadow-lg hover:shadow-2xl transition-shadow duration-300 flex flex-col items-center text-center">
              <div className="bg-blue-100 p-4 rounded-full mb-6 inline-block">
                <CalendarDays size={40} className="text-blue-600" strokeWidth={1.5} />
              </div>
              <h3 className="text-2xl font-semibold text-slate-800 mb-3">
                Mülakat Takvimi & Notlar
              </h3>
              <p className="text-slate-600 leading-relaxed">
                Mülakatlarınızı takviminize ekleyin, hatırlatıcılar alın ve her mülakat için özel notlarınızı tutun.
              </p>
            </div>

            {/* Feature 3 */}
            <div className="bg-white p-8 rounded-xl shadow-lg hover:shadow-2xl transition-shadow duration-300 flex flex-col items-center text-center">
              <div className="bg-blue-100 p-4 rounded-full mb-6 inline-block">
                <BarChart3 size={40} className="text-blue-600" strokeWidth={1.5} />
              </div>
              <h3 className="text-2xl font-semibold text-slate-800 mb-3">
                İlerlemeni Görselleştir
              </h3>
              <p className="text-slate-600 leading-relaxed">
                Başvuru durumlarınızı ve ilerlemenizi şık grafiklerle analiz ederek motivasyonunuzu yüksek tutun.
              </p>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}