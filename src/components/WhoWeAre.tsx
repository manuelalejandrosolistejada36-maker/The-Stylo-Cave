import Image from 'next/image';
import { FC } from 'react';

const WhoWeAre: FC = () => {
    const openingDate = "14 de noviembre de 2022";

    return (
        <section id="about" className="py-20 bg-white">
            <div className="container mx-auto px-4 max-w-6xl">
                <div className="flex flex-col md:flex-row items-center gap-12">
                    {/* Columna de Texto */}
                    <div className="md:w-1/2">
                        <div className="text-center md:text-left">
                            <span className="text-3xl text-gray-700 mb-4 inline-block">
                                
                            </span>
                            <h2 className="text-xl font-bold uppercase tracking-widest text-gray-800 mb-4">
                                QUIENES SOMOS.
                            </h2>
                        </div>
                        <p className="text-gray-600 mb-6 leading-relaxed">
                            Somos "The Stylo Cave", tu destino de estilo en el corazón de Socabaya. Desde nuestra apertura el {openingDate}, nos hemos dedicado a ofrecer cortes y afeitados de primera clase.
                        </p>
                        <p className="text-gray-600 mb-6 leading-relaxed">
                            Ubicados en Socabaya, Arequipa, Perú, fusionamos la tradición de la barbería clásica con técnicas modernas.
                        </p>
                        <p className="text-gray-600 italic text-lg font-serif mt-6">
                            Manuel Alejandro.
                        </p>
                    </div>

                    {/* Columna de Imagen */}
                    <div className="md:w-1/2">
                        <Image
                            src="/image/barber-owner.jpg" 
                            alt="Propietario de la barbería"
                            width={500}
                            height={500}
                            className="w-full h-auto object-cover shadow-2xl"
                        />
                    </div>
                </div>
            </div>
        </section>
    );
};

export default WhoWeAre;