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
       <header className={`fixed top-0 left-0 right-0 z-30 transition-all duration-500 ease-in-out py-3 sm:py-4 text-white`}> 
    <div className={`mx-auto flex justify-between items-center transition-all duration-500 ease-in-out w-full gap-2 sm:gap-4 ${
        scrolled 
            ? 'backdrop-blur-xl bg-white/5 border border-white/10 shadow-xl rounded-full px-4 sm:px-6 md:px-8 py-2 sm:py-3 max-w-6xl mx-4 sm:mx-auto' 
            : 'px-4 sm:px-6 md:px-8 max-w-7xl'
    }`}>
        
        {/* Logo/Nombre */}
        <Link href="/" className="text-white font-bold tracking-tight sm:tracking-widest text-[0.6rem] sm:text-sm md:text-lg hover:text-amber-500 transition-colors duration-300 whitespace-nowrap shrink-0">
            THE STYLO <span className="text-amber-500">CAVE</span>
        </Link>

        {/* Navegación Central */}
        <nav className="hidden md:flex space-x-6 uppercase tracking-widest text-[0.65rem] md:text-sm text-white grow">
            <Link href="#about" className="hover:text-amber-500 transition-colors duration-300">
                Quiénes Somos
            </Link>
            <Link href="#services" className="hover:text-amber-500 transition-colors duration-300">
                Servicios
            </Link>
        </nav>

        {/* Navegación Derecha */}
        <nav className="flex space-x-2 sm:space-x-4 uppercase tracking-widest items-center text-[0.65rem] md:text-sm shrink-0">
            <Link href="/admin" className="text-white hover:text-amber-500 transition-colors duration-300 hidden sm:block">
                Manager
            </Link>
            <Link
                href="/cita"
                className="bg-amber-500 text-black font-bold py-2 px-3 sm:px-4 text-[0.65rem] sm:text-xs rounded-full hover:bg-amber-400 transition-all duration-300 hover:scale-105 whitespace-nowrap"
            >
                Reserva
            </Link>
        </nav>
    </div>
</header>
    );
};

export default Header;