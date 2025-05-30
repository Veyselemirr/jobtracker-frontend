// src/components/Navbar.js
import Link from 'next/link';

export default function Navbar() {
    return (
        <nav className="bg-gray-800 text-white p-4 shadow-md">
            <div className="container mx-auto flex justify-between items-center">
                <Link href="/" className="text-2xl font-bold hover:text-gray-300">
                    JobTracker
                </Link>
                <div>
                    <Link href="/login" className="mr-4 hover:text-gray-300">
                        Giriş Yap
                    </Link>
                    <Link href="/signup" className="bg-blue-500 hover:bg-blue-600 text-white py-2 px-4 rounded">
                        Kayıt Ol
                    </Link>
                </div>
            </div>
        </nav>
    );
}