import Image from 'next/image';
import { FC } from 'react';

const InYourWords: FC = () => {
    return (
        <section className="relative min-h-[600px] w-full overflow-hidden bg-black flex items-center justify-center py-20">
            {/* Fondo decorativo */}
            <div className="absolute inset-0 opacity-20">
                <div className="absolute top-1/2 right-0 w-96 h-96 bg-amber-500 rounded-full blur-[150px] animate-pulse"></div>
                <div className="absolute top-1/2 left-0 w-96 h-96 bg-amber-600 rounded-full blur-[150px]"></div>
            </div>
            
            {/* Contenido */}
            <div className="relative z-10 flex flex-col items-center justify-center text-white p-4 text-center max-w-3xl w-full">
                <div className="mb-6 sm:mb-8">
                  <span className="inline-block text-6xl sm:text-6xl md:text-7xl font-serif text-amber-500 mb-4 sm:mb-6">"</span>
                </div>
                
                <p className="text-2xl sm:text-2xl md:text-4xl font-light italic leading-relaxed mb-6 sm:mb-8 text-gray-100">
                    Tú importas, y lo que tú piensas, es importante para nosotros.
                </p>
                
                <div className="h-1 w-24 sm:w-32 bg-linear-to-r from-amber-500 to-amber-600 rounded-full my-6 sm:my-8"></div>
                
                <p className="text-lg sm:text-lg md:text-xl text-gray-300 mb-4 sm:mb-6">
                    Creamos experiencias, no solo cortes.
                </p>
                
                <p className="text-xs sm:text-sm text-gray-400 font-serif italic">
                    Nuestros servicios especiales son para ti.
                </p>
            </div>
        </section>
    );
};

export default InYourWords;