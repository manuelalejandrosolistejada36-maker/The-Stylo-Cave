import Image from 'next/image';
import { FC } from 'react';

const InYourWords: FC = () => {
    return (
        <section className="relative h-[500px] w-full overflow-hidden">
            {/* Imagen de Fondo (Barbero con el cliente) */}
            <Image
                src="/image/in-your-words-bg.jpg" // Necesitas esta imagen en /public
                alt="Barbero y cliente conversando"
                fill
                style={{ objectFit: 'cover' }}
                className="brightness-50" // Oscurece la imagen
            />
            
            {/* Contenido de la Cita */}
            <div className="relative z-10 flex flex-col items-center justify-center h-full text-white p-4 text-center max-w-3xl mx-auto">
                <h2 className="text-2xl font-bold uppercase tracking-widest mb-4">
                    EN POCAS PALABRAS
                </h2>
                <span className="text-5xl font-serif mb-6 block">"</span>
                <p className="text-3xl font-light italic leading-relaxed">
                    Tú importas, y lo que tu piensas, es importante para nosotros.
                </p>
                <p className="text-xl mt-6">
                    Nuestros servicios especiales son para ti.
                </p>
            </div>
        </section>
    );
};

export default InYourWords;