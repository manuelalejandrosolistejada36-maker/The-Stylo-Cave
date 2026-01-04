// header.tsx
"use client";
import { FC, useState, useEffect } from 'react';
import Link from 'next/link';

const UNIVERSAL_MAPS_URL = "https://maps.google.com/?cid=11482279509598847870&g_mp=Cidnb29nbGUubWFwcy5wbGFjZXMudjEuUGxhY2VzLlNlYXJjaFRleHQ";
const whatsappLink = `https://wa.me/51941554701`;

const Header: FC = () => {
    const [scrolled, setScrolled] = useState(false);

    useEffect(() => {
        const handleScroll = () => {
            const isScrolled = window.scrollY > 50;
            if (isScrolled !== scrolled) {
                setScrolled(isScrolled);
            }
        };

        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, [scrolled]);
    
    return (
       <header className={`fixed top-0 left-0 right-0 z-30 transition-all duration-500 ease-in-out ${
           scrolled 
               ? 'py-4 sm:py-5 text-gray-900' 
               : 'py-6 sm:py-8 text-white'
       }`}> 
    <div className={`mx-auto flex justify-between items-center transition-all duration-500 ease-in-out ${
        scrolled 
            ? 'backdrop-blur-xl bg-white/15 border border-white/30 shadow-xl rounded-full px-4 sm:px-6 md:px-8 py-2 sm:py-2 max-w-6xl' 
            : 'px-4 sm:px-8 max-w-7xl'
    }`}>
        
        {/* 1. Navegación/Enlaces Principales */}
        <nav className={`flex space-x-1 sm:space-x-4 md:space-x-6 uppercase tracking-widest transition-all duration-300 ${
            scrolled ? 'text-[0.55rem] sm:text-[0.65rem] md:text-xs text-gray-800' : 'text-[0.6rem] sm:text-xs md:text-sm text-white'
        }`}>
            <Link href="#about" className={`transition-colors duration-300 ${scrolled ? 'hover:text-amber-600' : 'hover:text-amber-400'}`}>
                Quiénes Somos
            </Link>
            <Link href="#services" className={`transition-colors duration-300 ${scrolled ? 'hover:text-amber-600' : 'hover:text-amber-400'}`}>
                Servicios
            </Link>
        </nav>

        {/* 2. Navegación Derecha */}
        <nav className={`flex space-x-1 sm:space-x-4 md:space-x-6 uppercase tracking-widest items-center transition-all duration-300 ${
            scrolled ? 'text-[0.55rem] sm:text-[0.65rem] md:text-xs text-gray-800' : 'text-[0.6rem] sm:text-xs md:text-sm text-white'
        }`}>
            <Link href="/admin" className={`transition-colors duration-300 ${scrolled ? 'hover:text-amber-600' : 'hover:text-amber-400'}`}>
                Manager
            </Link>
            <Link
                href={whatsappLink}
                target="_blank" 
                rel="noopener noreferrer" 
                className={`text-white tracking-widest transition-all duration-300 ${
                    scrolled ? 'bg-amber-600 hover:bg-amber-700 py-1.5 px-3 text-[0.55rem] sm:text-[0.65rem] rounded-full' : 'bg-amber-600 hover:bg-amber-700 py-2 px-2 text-[0.6rem] sm:text-xs'
                }`}
            >
                RESERVA
            </Link>
        </nav>
    </div>
</header>
    );
};

export default Header;