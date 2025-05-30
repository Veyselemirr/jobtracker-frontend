// src/components/Navbar.js
import Link from 'next/link';

// Menü elemanlarını burada tanımlayabiliriz
const navLinks = [
    { href: '/', label: 'Ana Sayfa' }, // Ya da Dashboard
    { href: '/applications/new', label: 'Yeni Başvuru' },
    { href: '/applications', label: 'Başvurularım' },
    { href: '/statistics', label: 'İstatistikler' },
    { href: '/calendar', label: 'Takvim' },
];

export default function Navbar() {
    return (
        <nav className="bg-white shadow-md sticky top-0 z-50"> {/* Üstte sabit kalması için sticky, top-0, z-50 */}
            <div className="container mx-auto px-4">
                <div className="flex items-center justify-between h-16">
                    {/* Logo/App Name */}
                    <div className="flex-shrink-0">
                        <Link href="/" className="text-2xl font-bold text-blue-600 hover:text-blue-700">
                            JobTracker
                        </Link>
                    </div>

                    {/* Navigation Links - Ortada */}
                    <div className="hidden md:flex space-x-4">
                        {navLinks.map((link) => (
                            <Link
                                key={link.label}
                                href={link.href}
                                className="text-gray-700 hover:bg-blue-500 hover:text-white px-3 py-2 rounded-md text-sm font-medium transition-colors duration-150"
                            >
                                {link.label}
                            </Link>
                        ))}
                    </div>

                    {/* Action Buttons - Sağda */}
                    <div className="hidden md:flex items-center space-x-3">
                        <Link href="/login" className="text-gray-700 hover:text-blue-600 px-3 py-2 rounded-md text-sm font-medium">
                            Giriş Yap
                        </Link>
                        <Link
                            href="/signup"
                            className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md text-sm font-medium transition-colors duration-150"
                        >
                            Kayıt Ol
                        </Link>
                    </div>

                    {/* Mobile Menu Button (Hamburger) - Daha sonra eklenebilir */}
                    <div className="md:hidden flex items-center">
                        <button className="mobile-menu-button p-2 rounded-md text-gray-700 hover:text-white hover:bg-blue-500 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-white">
                            {/* Hamburger Icon (SVG veya Font Icon) */}
                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 6.75h16.5M3.75 12h16.5m-8.25 5.25h8.25" />
                            </svg>
                        </button>
                    </div>
                </div>
            </div>

            {/* Mobile Menu - Gizli, butona tıklanınca JS ile açılacak (daha sonra eklenebilir) */}
            {/* <div className="mobile-menu hidden md:hidden">
        <nav className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
          {navLinks.map((link) => (
            <Link key={link.label} href={link.href} className="block text-gray-700 hover:bg-blue-500 hover:text-white px-3 py-2 rounded-md text-base font-medium">
              {link.label}
            </Link>
          ))}
          <Link href="/login" className="block text-gray-700 hover:bg-blue-500 hover:text-white px-3 py-2 rounded-md text-base font-medium">Giriş Yap</Link>
          <Link href="/signup" className="block bg-blue-600 hover:bg-blue-700 text-white px-3 py-2 rounded-md text-base font-medium">Kayıt Ol</Link>
        </nav>
      </div> */}
        </nav>
    );
}