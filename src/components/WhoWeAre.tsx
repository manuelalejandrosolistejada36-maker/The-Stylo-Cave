import Image from 'next/image';
import { FC } from 'react';

const WhoWeAre: FC = () => {
    const openingDate = "14 de noviembre de 2022";

    return (
        <section id="about" className="py-16 sm:py-24 bg-black relative overflow-hidden">
            {/* Fondo decorativo */}
            <div className="absolute inset-0 opacity-10">
              <div className="absolute top-1/2 right-0 w-96 h-96 bg-amber-500 rounded-full blur-[150px]"></div>
            </div>

            <div className="container mx-auto px-4 max-w-6xl relative z-10">
                <div className="flex flex-col md:flex-row items-center gap-8 md:gap-12">
                    {/* Columna de Texto */}
                    <div className="md:w-1/2">
                        <div className="mb-6 sm:mb-8">
                            <h2 className="text-4xl sm:text-3xl md:text-5xl font-bold uppercase tracking-tighter sm:tracking-widest text-white mb-4 sm:mb-6">
                                Quiénes <span className="text-amber-500">Somos</span>
                            </h2>
                        </div>
                        <div className="space-y-4 sm:space-y-6">
                          <p className="text-gray-300 leading-relaxed text-base sm:text-base md:text-lg">
                            Somos "The Stylo Cave", tu destino de estilo minimalista ubicado en el corazón de Socabaya. Desde nuestra apertura el {openingDate}, nos hemos dedicado a ofrecer cortes y afeitados de primera clase.
                          </p>
                          <p className="text-gray-300 leading-relaxed text-base sm:text-base md:text-lg">
                            Fusionamos la tradición de la barbería clásica con técnicas modernas, creando una experiencia única para cada cliente.
                          </p>
                          <div className="pt-4 sm:pt-6 border-t border-white/10">
                            <p className="text-amber-500 italic text-lg sm:text-xl font-semibold">
                                Manuel Alejandro
                            </p>
                            <p className="text-gray-400 text-xs sm:text-sm mt-2">
                                Propietario & Estilista Principal
                            </p>
                          </div>
                        </div>
                    </div>

                    {/* Columna de Imagen */}
                    <div className="md:w-1/2 w-full">
                        <div className="relative">
                          <div className="absolute inset-0 bg-linear-to-br from-amber-500/20 to-amber-600/20 rounded-2xl blur-xl"></div>
                          <Image
                            src="/image/barber-owner.jpg" 
                            alt="Propietario de la barbería"
                            width={500}
                            height={500}
                            className="w-full h-auto object-cover rounded-2xl shadow-2xl relative z-10 border border-amber-500/20"
                          />
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
};

export default WhoWeAre;