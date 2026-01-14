'use client';

import Image from 'next/image';
import { FC, useState } from 'react';

// Interfaz para tipar cada característica
interface FeatureProps {
    title: string;
    description: string;
    imageSrc: string; // La ruta a la imagen en la carpeta public
}

// Componente individual de la tarjeta de característica
const FeatureCard: FC<FeatureProps & { onImageClick: (src: string) => void }> = ({ title, description, imageSrc, onImageClick }) => (
    <div className="w-full md:w-1/3 p-4 group cursor-pointer">
        <div className="relative h-full bg-white/5 backdrop-blur-lg border border-white/10 rounded-2xl overflow-hidden hover:border-amber-500/50 transition-all duration-300 hover:bg-white/10" onClick={() => onImageClick(imageSrc)}>
            <div className="relative h-56">
              <Image
                src={imageSrc}
                alt={title}
                width={400}
                height={300}
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-linear-to-t from-black/60 to-transparent"></div>
            </div>
            <div className="p-6 text-center">
                <h3 className="text-2xl font-bold uppercase text-white mb-3 group-hover:text-amber-500 transition-colors duration-300">
                    {title}
                </h3>
                <p className="text-base text-gray-300">
                    {description}
                </p>
            </div>
        </div>
    </div>
);

// Componente principal de la sección
const Features: FC = () => {
    const [selectedImage, setSelectedImage] = useState<string | null>(null);

    const featuresData: FeatureProps[] = [
        { 
            title: "Cómodo", 
            description: "Un ambiente relajado donde puedes desconectarte y disfrutar de tu momento.",
            imageSrc: "/image/feature-comfortable.jpg" 
        },
        { 
            title: "Profesional", 
            description: "Expertos dedicados a brindarte el mejor corte y afeitado con resultados impecables.",
            imageSrc: "/image/feature-professional.jpg" 
        },
        { 
            title: "Preciso", 
            description: "Atención al detalle en cada trazo, garantizando la exactitud que tu estilo requiere.",
            imageSrc: "/image/feature-precise.jpg" 
        },
    ];

    return (
        <section className="py-20 bg-black relative overflow-hidden">
            {/* Fondo decorativo */}
            <div className="absolute inset-0 opacity-10">
              <div className="absolute top-0 left-1/4 w-96 h-96 bg-amber-500 rounded-full blur-[150px]"></div>
            </div>
            <div className="container mx-auto px-4 max-w-7xl relative z-10">
                <div className="text-center mb-16">
                  <h2 className="text-5xl md:text-5xl font-bold uppercase tracking-widest text-white mb-4">
                    Nuestros <span className="text-amber-500">Valores</span>
                  </h2>
                  <p className="text-gray-400 text-lg">
                    Lo que nos define
                  </p>
                </div>
                <div className="flex flex-wrap -mx-4 justify-center">
                    {featuresData.map((feature, index) => (
                        <FeatureCard key={index} {...feature} onImageClick={setSelectedImage} />
                    ))}
                </div>
            </div>

            {/* Modal de imagen ampliada */}
            {selectedImage && (
                <div 
                    className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-50 p-2 sm:p-4"
                    onClick={() => setSelectedImage(null)}
                >
                    <div className="relative w-full h-auto flex items-center justify-center">
                        <button
                            onClick={(e) => {
                                e.stopPropagation();
                                setSelectedImage(null);
                            }}
                            className="absolute top-2 right-2 sm:top-4 sm:right-4 bg-amber-500 hover:bg-amber-400 text-black w-8 h-8 sm:w-10 sm:h-10 rounded-full flex items-center justify-center font-bold transition-all duration-300 z-10 text-sm sm:text-base"
                        >
                            ✕
                        </button>
                        <Image
                            src={selectedImage}
                            alt="Imagen ampliada"
                            width={1200}
                            height={800}
                            className="w-full max-w-full h-auto rounded-2xl"
                        />
                    </div>
                </div>
            )}
        </section>
    );
};

export default Features;