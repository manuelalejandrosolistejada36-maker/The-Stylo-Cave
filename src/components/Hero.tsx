import Image from 'next/image';
import Link from 'next/link';
import { FC } from 'react';

const Hero: FC = () => {
  const businessName = "THE STYLO CAVE";
  const whatsappLink = `https://wa.me/51941554701`;
  
  return (
    <section className="w-full overflow-hidden flex flex-col">
      <div className='w-full h-screen relative'>
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-10 flex flex-col items-center justify-center text-white p-4 w-full max-w-2xl">
        <p className="tracking-[0.3em] uppercase text-xs sm:text-sm md:text-base mb-2 sm:mb-4">Welcome to</p>
        <h1 className="text-2xl sm:text-4xl md:text-6xl lg:text-8xl font-serif tracking-widest uppercase text-white text-center leading-tight">
          The Stylo Cave
        </h1>
        <p className="mt-4 text-xs sm:text-base md:text-lg border-t-2 border-b-2 border-white py-1 px-4 tracking-widest text-white">
          EST. 2022
        </p>
        <div className="mt-4 sm:mt-6 flex space-x-3 sm:space-x-4">
        <Link 
            href="/cita" 
            className="bg-transparent border border-white text-white py-2 px-4 sm:py-2 sm:px-6 text-xs sm:text-sm uppercase tracking-widest hover:bg-white hover:text-black transition duration-300">
                Reserva Cita
        </Link>
        </div>
      </div>
        <Image
            src="/image/hero-bg.jpg" 
            width={1200}
            height={800}
            alt="Barbero cortando el cabello"
            className="brightness-50 w-full h-full object-cover"
            priority // Esto ayuda a cargar la imagen principal más rápido
          />
      </div>
    </section>
  );
};

export default Hero;