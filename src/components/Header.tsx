// header.tsx
"use client";
import { FC } from 'react'; // Necesitas useState para el menú hamburguesa si decides implementarlo
import Link from 'next/link';

const UNIVERSAL_MAPS_URL = "https://maps.google.com/?cid=11482279509598847870&g_mp=Cidnb29nbGUubWFwcy5wbGFjZXMudjEuUGxhY2VzLlNlYXJjaFRleHQ";
const whatsappLink = `https://wa.me/51941554701`;

const Header: FC = () => {
    // Aquí puedes añadir useState para manejar la apertura/cierre del menú móvil, si lo deseas.
    
    return (
       <header className="absolute top-0 left-0 right-0 z-30 text-white p-2 sm:p-4"> 
    <div className="container mx-auto flex justify-between items-center max-w-7xl">
        
        {/* 1. Navegación/Enlaces Principales */}
        <nav className="flex space-x-2 sm:space-x-4 md:space-x-6 text-[0.6rem] sm:text-xs md:text-sm uppercase tracking-widest">
            {/* Reducimos el espacio y el tamaño de la fuente para móvil */}
            <Link href="#about" className="hover:text-amber-500 transition">
                Quiénes Somos
            </Link>
            <Link href="#services" className="hover:text-amber-500 transition">
                Servicios
            </Link>
        </nav>

        {/* 2. Navegación Derecha */}
        <nav className="flex space-x-2 sm:space-x-4 md:space-x-6 text-[0.6rem] sm:text-xs md:text-sm uppercase tracking-widest items-center">
            <Link href={UNIVERSAL_MAPS_URL} target="_blank" rel="noopener noreferrer" className="hover:text-amber-500 transition hidden sm:block">
                Ubicación
            </Link>
            <Link
                href={whatsappLink}
                target="_blank" 
                rel="noopener noreferrer" 
                // Reducimos el padding horizontal a 'px-2' en lugar de 'px-3'
                className="bg-amber-600 text-white py-2 px-2 text-[0.6rem] sm:text-xs tracking-widest hover:bg-amber-700 transition"
            >
                RESERVA
            </Link>
        </nav>
    </div>
</header>
    );
};

export default Header;