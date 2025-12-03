import { FC } from 'react';
import Link from 'next/link';

const UNIVERSAL_MAPS_URL = "https://maps.google.com/?cid=11482279509598847870&g_mp=Cidnb29nbGUubWFwcy5wbGFjZXMudjEuUGxhY2VzLlNlYXJjaFRleHQ";
const whatsappLink = `https://wa.me/51941554701`;
const Header: FC = () => {

    return (
        // Usamos 'absolute' para que flote sobre el Hero o 'fixed' si quieres que siempre esté visible
        // Si usas 'absolute' o 'fixed', asegúrate que el Hero tenga suficiente padding superior.
        <header className="absolute top-0 left-0 right-0 z-30 text-white p-4">
            <div className="container mx-auto flex justify-between items-center max-w-7xl">
                {/* 1. Navegación Izquierda (Menú) */}
                <nav className="hidden md:flex space-x-6 text-sm uppercase tracking-widest">
                    <Link href="#about" className="hover:text-amber-500 transition">
                        Quiénes Somos
                    </Link>
                    <Link href="#services" className="hover:text-amber-500 transition">
                        Servicios
                    </Link>
                </nav>

                {/* 2. Título o Logo Central (Si no está en el Hero) */}
                {/* Lo mantendremos en el Hero para replicar el diseño de la imagen */}
                <div className="flex-grow flex justify-center">
                    {/* Placeholder para mantener el equilibrio si el logo estuviera aquí */}
                </div>

                {/* 3. Navegación Derecha (Información y Reserva) */}
                <nav className="flex space-x-6 text-sm uppercase tracking-widest items-center">
                    <Link href={UNIVERSAL_MAPS_URL} target="_blank" rel="noopener noreferrer" className="hover:text-amber-500 transition">
                        Ubicación
                    </Link>
                    {/* Botón de Reserva Rápida */}
                    <Link
                        // Usamos la URL de WhatsApp. El 'target="_blank"' lo abrirá en una nueva pestaña.
                        href={whatsappLink}
                        target="_blank" 
                        rel="noopener noreferrer" // Mejora la seguridad al usar target="_blank"
                        className="bg-amber-600 text-white py-2 px-4 text-xs tracking-widest hover:bg-amber-700 transition hidden lg:block"
                    >
                        RESERVA AHORA
                    </Link>
                </nav>
            </div>
        </header>
    );
};

export default Header;