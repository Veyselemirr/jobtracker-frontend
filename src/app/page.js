// src/app/page.js
export default function HomePage() {
  return (
    <>
      {/* Hero Section */}
      <section className="text-center py-20 bg-white shadow-lg rounded-lg">
        <div className="container mx-auto px-6">
          <h1 className="text-5xl font-bold text-gray-800 mb-6">
            Kariyer Yolculuğunuzda <span className="text-blue-600">Kontrol Sizde</span>
          </h1>
          <p className="text-xl text-gray-600 mb-10 max-w-2xl mx-auto">
            JobTracker ile iş başvurularınızı kolayca yönetin, mülakatlarınızı planlayın ve hayalinizdeki kariyere emin adımlarla ilerleyin. Yeni mezunların iş arama sürecindeki en büyük yardımcısı!
          </p>
          <a
            href="/register" // Veya /dashboard gibi bir hedef
            className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-4 px-8 rounded-lg text-lg transition duration-300 ease-in-out transform hover:scale-105"
          >
            Hemen Ücretsiz Başla
          </a>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20">
        <div className="container mx-auto px-6">
          <h2 className="text-3xl font-bold text-center text-gray-800 mb-12">
            Neden JobTracker?
          </h2>
          <div className="grid md:grid-cols-3 gap-8 text-center">
            {/* Feature 1 */}
            <div className="bg-white p-8 rounded-lg shadow-md hover:shadow-xl transition-shadow duration-300">
              {/* İkon için bir placeholder - sonradan SVG veya font ikonu eklenebilir */}
              <div className="text-blue-500 text-4xl mb-4">◉</div>
              <h3 className="text-2xl font-semibold text-gray-700 mb-3">Tüm Başvurular Tek Yerde</h3>
              <p className="text-gray-600">
                Farklı platformlardaki tüm iş başvurularınızı merkezi bir noktadan takip edin, hiçbir fırsatı kaçırmayın.
              </p>
            </div>
            {/* Feature 2 */}
            <div className="bg-white p-8 rounded-lg shadow-md hover:shadow-xl transition-shadow duration-300">
              <div className="text-blue-500 text-4xl mb-4">📅</div>
              <h3 className="text-2xl font-semibold text-gray-700 mb-3">Mülakat Takvimi & Notlar</h3>
              <p className="text-gray-600">
                Mülakatlarınızı takviminize ekleyin, hatırlatıcılar alın ve her mülakat için özel notlarınızı tutun.
              </p>
            </div>
            {/* Feature 3 */}
            <div className="bg-white p-8 rounded-lg shadow-md hover:shadow-xl transition-shadow duration-300">
              <div className="text-blue-500 text-4xl mb-4">📊</div>
              <h3 className="text-2xl font-semibold text-gray-700 mb-3">İlerlemeni Görselleştir</h3>
              <p className="text-gray-600">
                Başvuru durumlarınızı ve ilerlemenizi şık grafiklerle analiz ederek motivasyonunuzu yüksek tutun.
              </p>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}