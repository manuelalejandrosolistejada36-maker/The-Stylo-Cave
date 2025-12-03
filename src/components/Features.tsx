import Image from 'next/image';
import { FC } from 'react';

// Interfaz para tipar cada característica
interface FeatureProps {
    title: string;
    description: string;
    imageSrc: string; // La ruta a la imagen en la carpeta public
}

// Componente individual de la tarjeta de característica
const FeatureCard: FC<FeatureProps> = ({ title, description, imageSrc }) => (
    <div className="w-full md:w-1/3 p-4">
        <div className="bg-white shadow-lg">
            <Image
                src={imageSrc}
                alt={title}
                width={400}
                height={300}
                className="w-full h-auto object-cover"
            />
            <div className="p-6 text-center">
                <h3 className="text-xl font-bold uppercase text-gray-800 mb-3">
                    {title}
                </h3>
                <p className="text-sm text-gray-600">
                    {description}
                </p>
            </div>
        </div>
    </div>
);

// Componente principal de la sección
const Features: FC = () => {
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
        <section className="py-10 bg-gray-50">
            <div className="container mx-auto px-4 max-w-7xl">
                <div className="flex flex-wrap -mx-4 justify-center">
                    {featuresData.map((feature, index) => (
                        <FeatureCard key={index} {...feature} />
                    ))}
                </div>
            </div>
        </section>
    );
};

export default Features;