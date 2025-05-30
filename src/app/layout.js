// src/app/layout.js
import Navbar from '@/components/Navbar'; // '@' src klasörünü işaret eder
import Footer from '@/components/Footer';
import './globals.css'; // Tailwind CSS için

export const metadata = {
  title: 'JobTracker - İş Takip Uygulaması',
  description: 'Yeni mezunlar için iş başvurularını takip etme uygulaması',
};

export default function RootLayout({ children }) {
  return (
    <html lang="tr">
      <body className="flex flex-col min-h-screen bg-gray-100">
        <Navbar />
        <main className="flex-grow container mx-auto px-4 py-8">
          {children}
        </main>
        <Footer />
      </body>
    </html>
  );
}