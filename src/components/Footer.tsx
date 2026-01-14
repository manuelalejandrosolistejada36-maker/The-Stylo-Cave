import Image from 'next/image';
import { FC } from 'react';

const Footer: FC = () => {
    const phone = "+51 941 554 701";

    return (
        <section className="relative min-h-[500px] w-full overflow-hidden bg-black flex items-center justify-center py-20">
            {/* Fondo decorativo */}
            <div className="absolute inset-0 opacity-15">
                <div className="absolute top-1/2 left-1/4 w-96 h-96 bg-amber-500 rounded-full blur-[150px] animate-pulse"></div>
                <div className="absolute bottom-0 right-1/3 w-96 h-96 bg-amber-600 rounded-full blur-[150px]"></div>
            </div>
            
            {/* Contenido de Contacto */}
            <div className="relative z-10 flex flex-col items-center justify-center text-white p-4 text-center max-w-2xl w-full">
                <h2 className="text-4xl sm:text-3xl md:text-5xl font-bold uppercase tracking-tighter sm:tracking-widest mb-4 sm:mb-6 text-white">
                    Todo lo que <span className="text-amber-500">necesitas</span>
                </h2>
                <p className="text-lg sm:text-lg md:text-xl text-gray-300 mb-8 sm:mb-12">
                    Lo hacemos de corazón
                </p>
                
                <div className="mb-8 sm:mb-12 border-t border-b border-white/10 py-6 sm:py-8 w-full">
                    <p className="text-xs sm:text-sm text-gray-400 uppercase tracking-widest mb-3 sm:mb-4">
                        Contáctanos
                    </p>
                    <a href={`tel:${phone}`} className="text-4xl sm:text-3xl md:text-4xl font-bold text-amber-500 hover:text-amber-400 transition-all duration-300 hover:scale-105 sm:hover:scale-110 inline-block break-all sm:break-normal">
                        {phone}
                    </a>
                </div>
                
                <div className="space-y-2 sm:space-y-3">
                    <p className="text-gray-400 text-xs sm:text-sm">
                        📍 Socabaya, Arequipa - Perú
                    </p>
                    <p className="text-gray-400 text-xs sm:text-sm">
                        Estamos listos para cuidar tu estilo
                    </p>
                </div>
                
                {/* Copyright */}
                <div className="mt-12 sm:mt-16 pt-6 sm:pt-8 border-t border-white/10 w-full">
                  <p className="text-xs text-gray-500 uppercase tracking-tighter sm:tracking-widest">
                    © 2024 The Stylo Cave. Todos los derechos reservados.
                  </p>
                </div>
            </div>
        </section>
    );
};

export default Footer;