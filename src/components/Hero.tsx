import Image from 'next/image';
import Link from 'next/link';
import { FC } from 'react';

const Hero: FC = () => {
  const businessName = "THE STYLO CAVE";
  const whatsappLink = `https://wa.me/51941554701`;
  
  return (
    <section className="  w-full overflow-hidden flex flex-col">
      <div className='w-full h-full relative '>
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-100 flex flex-col items-center justify-center text-white p-4 w-full">
        <p className="tracking-[0.3em] uppercase text-sm mb-2">Welcome to</p>
        <h1 className="text-6xl md:text-8xl font-serif tracking-widest uppercase text-white">
          The Stylo Cave
        </h1>
        <p className="mt-4 text-lg border-t-2 border-b-2 border-white py-1 px-4 tracking-widest text-white">
          EST. 2022
        </p>
        <div className="mt-4 flex space-x-4">
        <Link 
            href={whatsappLink} 
            target="_blank" rel="noopener noreferrer" 
            className="bg-transparent border border-white text-white py-2 px-6 uppercase tracking-widest hover:bg-white hover:text-black transition duration-300">
                Reserva Ahora
        </Link>
        </div>
      </div>
        <Image
            src="/image/hero-bg.jpg" 
            width={700}
            height={700}
            alt="Barbero cortando el cabello"
            className="brightness-50 w-full h-full object-cover"
            priority // Esto ayuda a cargar la imagen principal más rápido
          />
      </div>

      
      
      
      
      {/* Navegación Superior (Versión simplificada) */}
      <nav className="absolute top-0 left-0 right-0 z-20 text-white p-4 flex justify-end space-x-6 text-sm uppercase tracking-widest">
        <a href="#about" className="hover:text-amber-500 transition"></a>
        <a href="#services" className="hover:text-amber-500 transition"></a>
        <a href="#prices" className="hover:text-amber-500 transition"></a>
        <a href="#location" className="hover:text-amber-500 transition"></a>
      </nav>
    </section>
  );
};

export default Hero;