import Image from 'next/image';
import Link from 'next/link';
import { FC } from 'react';

const Hero: FC = () => {
  return (
    <section className="w-full overflow-hidden flex flex-col relative mt-14 sm:mt-20">
      <div className="relative w-full min-h-[500px] sm:min-h-screen bg-black flex flex-col items-center justify-center p-4 overflow-hidden">
        {/* Fondo animado con degradados */}
        <div className="absolute inset-0 opacity-20">
          <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-amber-500 rounded-full blur-[150px] animate-pulse"></div>
          <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-amber-600 rounded-full blur-[150px]"></div>
        </div>

        {/* Contenido */}
        <div className="relative z-10 flex flex-col items-center justify-center text-white max-w-3xl w-full px-4">
          <p className="tracking-[0.2em] sm:tracking-[0.3em] uppercase text-sm sm:text-sm md:text-base mb-4 sm:mb-4 text-amber-500">Welcome to</p>
          
          <h1 className="text-5xl sm:text-4xl md:text-6xl lg:text-8xl font-bold tracking-tighter sm:tracking-widest uppercase text-white text-center leading-tight mb-6 sm:mb-6">
            The <span className="text-amber-500">Stylo</span> <br className="sm:hidden" /> Cave
          </h1>
          
          <p className="text-lg sm:text-lg md:text-2xl text-gray-300 text-center mb-8 sm:mb-8 max-w-2xl">
            Barbería de lujo con estilo minimalista
          </p>
          
          <div className="h-1 w-24 sm:w-24 bg-linear-to-r from-amber-500 to-amber-600 rounded-full mb-8 sm:mb-8"></div>
          
          <Link 
            href="/cita" 
            className="bg-amber-500 text-black font-bold py-4 px-8 sm:py-4 sm:px-8 text-sm sm:text-sm uppercase tracking-widest hover:bg-amber-400 transition-all duration-300 hover:scale-105 sm:hover:scale-110 rounded-full shadow-lg shadow-amber-500/50 whitespace-nowrap"
          >
            Reserva tu Cita
          </Link>
        </div>

        {/* Línea decorativa al pie */}
        <div className="absolute bottom-0 left-0 right-0 h-px bg-linear-to-r from-transparent via-amber-500 to-transparent opacity-50"></div>
      </div>
    </section>
  );
};

export default Hero;