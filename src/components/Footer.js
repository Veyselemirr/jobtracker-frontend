// src/components/Footer.js
export default function Footer() {
    return (
        <footer className="bg-gray-700 text-white text-center p-4 mt-auto">
            <div className="container mx-auto">
                <p>&copy; {new Date().getFullYear()} JobTrackerApp. Tüm hakları saklıdır.</p>
            </div>
        </footer>
    );
}