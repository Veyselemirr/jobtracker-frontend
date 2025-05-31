// src/app/layout.js
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import './globals.css';

export const metadata = {
  title: 'JobTracker - İş Takip Uygulaması',
  description: 'Yeni mezunlar için iş başvurularını takip etme uygulaması',
};

export default function RootLayout({ children }) {
  return (
    <html lang="tr">
      <body className="flex flex-col min-h-screen bg-slate-200 text-slate-800"> {/* ANA ARKA PLAN BURASI: bg-slate-50 */}
        <Navbar />
        <main className="flex-grow container mx-auto px-4">
          {children}
        </main>
        <Footer />
      </body>
    </html>
  );
}