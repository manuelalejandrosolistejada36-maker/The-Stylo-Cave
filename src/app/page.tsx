import Header from '../components/Header';
import Hero from '../components/Hero';
import WhoWeAre from '../components/WhoWeAre';
import Features from '../components/Features';
import InYourWords from '../components/InYourWords';
import Services from '../components/Services';
import Footer from '../components/Footer';
import { FC } from 'react';

const Home: FC = () => {
  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      <main>
        <Hero />
        <WhoWeAre />
        {/* Usaremos el componente Features.tsx para la sección de 3 columnas */}
        <Features /> 
        <InYourWords />
        <Services />
        <Footer />
      </main>
    </div>
  );
};

export default Home;