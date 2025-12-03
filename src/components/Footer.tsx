import Image from 'next/image';
import { FC } from 'react';

const Footer: FC = () => {
    const phone = "+51 941 554 701";

    return (
        <section className="relative h-[400px] w-full overflow-hidden">
            {/* Imagen de Fondo */}
            <Image
                src="/image/footer-bg.jpg" 
                alt="Barbero dando los toques finales a un cliente"
                fill
                style={{ objectFit: 'cover' }}
                className="brightness-50"
            />
            
            {/* Contenido de Contacto */}
            <div className="relative z-10 flex flex-col items-center justify-center h-full text-white p-4 text-center">
                <h2 className="text-4xl font-bold uppercase tracking-widest mb-4">
                    TODO LO QUE NECESITAS
                </h2>
                <p className="text-lg mb-6">
                    Lo hacemos de corazón.
                </p>
                
                <div className="mt-4 space-y-2">
                    <p className="text-xl font-bold">
                        ¡Llámanos!
                    </p>
                    <a href={`tel:${phone}`} className="text-3xl font-serif tracking-wide hover:text-amber-500 transition">
                        {phone}
                    </a>
                </div>
            </div>
        </section>
    );
};

export default Footer;