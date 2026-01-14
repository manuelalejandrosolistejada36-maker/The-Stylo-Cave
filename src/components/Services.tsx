import { FC } from 'react';

interface ServiceData {
    title: string;
    description: string;
}

const ServiceItem: FC<ServiceData> = ({ title, description }) => (
    <div className="group">
        <div className="bg-white/5 backdrop-blur-lg border border-white/10 rounded-2xl p-6 hover:bg-white/10 hover:border-amber-500/50 transition-all duration-300 h-full">
            <div className="flex items-start gap-4">
              <div className="w-12 h-12 rounded-full bg-amber-500/20 flex items-center justify-center shrink-0 group-hover:bg-amber-500/40 transition-colors duration-300">
                <div className="w-2 h-2 bg-amber-500 rounded-full"></div>
              </div>
              <div className="flex-1">
                <h3 className="text-lg font-bold uppercase text-white mb-2 group-hover:text-amber-500 transition-colors duration-300">{title}</h3>
                <p className="text-sm text-gray-300">{description}</p>
              </div>
            </div>
        </div>
    </div>
);

const Services: FC = () => {
    const servicesData: ServiceData[] = [
        { title: "Corte Clásico", description: "El corte clásico perfecto para el hombre moderno." },
        { title: "Delineado de barba", description: "Cuidado y delineado profesional de barba." },
        { title: "Afeitado tradicional", description: "Afeitado tradicional con toallas calientes." },
        { title: "Delineado preciso", description: "Llevamos las líneas más finas a tu cabeza." },
        { title: "Haircut Fade", description: "Técnica de degradado de alta precisión." },
        { title: "Lavado capilar", description: "Lavado y masaje capilar con productos premium." },
    ];

    return (
        <section id="services" className="py-24 bg-black relative overflow-hidden">
            {/* Fondo decorativo */}
            <div className="absolute inset-0 opacity-10">
              <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-amber-500 rounded-full blur-[150px]"></div>
            </div>
            
            <div className="container mx-auto px-4 max-w-6xl relative z-10">
                <div className="text-center mb-12 sm:mb-16">
                  <h2 className="text-4xl sm:text-3xl md:text-5xl font-bold uppercase tracking-tighter sm:tracking-widest text-white mb-4 sm:mb-4">
                    Nuestros <span className="text-amber-500">Servicios</span>
                  </h2>
                  <p className="text-gray-400 text-base sm:text-base md:text-lg">
                    Diseñados para tu estilo
                  </p>
                </div>
                
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
                    {servicesData.map((service, index) => (
                        <ServiceItem key={index} title={service.title} description={service.description} />
                    ))}
                </div>
            </div>
        </section>
    );
};

export default Services;