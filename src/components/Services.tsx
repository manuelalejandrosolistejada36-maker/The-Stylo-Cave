import { FC } from 'react';

interface ServiceData {
    title: string;
    description: string;
}

const ServiceItem: FC<ServiceData> = ({ title, description }) => (
    <div className="w-full md:w-1/3 p-4">
        <div className="border-b-2 border-gray-200 pb-4">
            <h3 className="text-lg font-bold uppercase text-gray-800 mb-1">{title}</h3>
            <p className="text-sm text-gray-500">{description}</p>
        </div>
    </div>
);

const Services: FC = () => {
    const servicesData: ServiceData[] = [
        { title: "Corte Clásico", description: "El corte clásico perfecto para el hombre moderno." },
        { title: "Delineado de barba & Afeitado", description: "Cuidado y delineado profesional de barba." },
        { title: "Afeitado tradicional", description: "Afeitado tradicional con toallas calientes." },
        { title: "Delineado preciso", description: "Llevamos las lienas mas finas a tu cabeza." },
        { title: "Haircut with Fade", description: "Técnica de degradado de alta precisión." },
        { title: "Lavado y masaje capilar", description: "Lavado y masaje capilar con productos premium." },
    ];

    return (
        <section id="services" className="py-20 bg-white">
            <div className="container mx-auto px-4 max-w-6xl">
                <h2 className="text-2xl font-bold uppercase tracking-widest text-gray-800 text-center mb-10">
                    Nuestros Servicios
                </h2>
                <p className="text-center text-gray-500 mb-12">
                    ¿Qué servicios ofrecemos?
                </p>
                
                <div className="flex flex-wrap -mx-4">
                    {servicesData.map((service, index) => (
                        // La key debe ser única. Usar el índice es aceptable si la lista es estática.
                        <ServiceItem key={index} title={service.title} description={service.description} />
                    ))}
                </div>
            </div>
        </section>
    );
};

export default Services;