import { Link } from 'react-router-dom';
import FeatureCard from '@/components/FeatureCard';
import memoryPortalIcon from '@/assets/memory-portal-icon.jpg';
import questsIcon from '@/assets/quests-icon.jpg';
import vrGalleryIcon from '@/assets/vr-gallery-icon.jpg';

const Index = () => {
  const features = [
    {
      title: 'Memory Portal',
      description: 'Share and explore personal NP stories from students, alumni, and staff.',
      icon: <img src={memoryPortalIcon} alt="Memory Portal" className="w-full h-full object-cover" />,
      to: '/memory-portal',
    },
    {
      title: 'Quests',
      description: 'Test your knowledge about NP history and earn points for rewards!',
      icon: <img src={questsIcon} alt="Quests" className="w-full h-full object-cover" />,
      to: '/quests',
    },
    {
      title: 'VR Gallery',
      description: 'Immerse yourself in the virtual heritage experience of NP.',
      icon: <img src={vrGalleryIcon} alt="VR Gallery" className="w-full h-full object-cover" />,
      to: '/vr-gallery',
    },
  ];

  return (
    <div className="min-h-screen pt-20 pb-12">
      <div className="container mx-auto px-4">
        {/* Hero Section */}
        <section className="py-16 md:py-24 text-center">
          <h1 className="font-display text-4xl md:text-6xl font-bold mb-4 animate-fade-in">
            <span className="text-foreground">DISCOVER OUR</span>
            <br />
            <span className="np-gradient-text">DIGITAL HERITAGE</span>
          </h1>
          <p className="text-muted-foreground text-lg md:text-xl max-w-2xl mx-auto mb-8 animate-fade-in" style={{ animationDelay: '200ms' }}>
            Explore NP's history and heritage through engaging storytelling experience.
          </p>
          <div className="flex justify-center gap-4 animate-fade-in" style={{ animationDelay: '400ms' }}>
            <Link
              to="/quests"
              className="np-button-primary"
            >
              Start Exploring
            </Link>
            <Link
              to="/vr-gallery"
              className="np-button-secondary"
            >
              View Gallery
            </Link>
          </div>
        </section>

        {/* Feature Cards */}
        <section className="py-12">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {features.map((feature, index) => (
              <FeatureCard
                key={feature.title}
                {...feature}
                delay={index * 100}
              />
            ))}
          </div>
        </section>

        {/* About Section */}
        <section className="py-16 text-center">
          <div className="np-card max-w-3xl mx-auto p-8">
            <h2 className="font-display text-2xl font-bold mb-4 text-foreground">
              About NP TimeWave
            </h2>
            <p className="text-muted-foreground leading-relaxed">
              NP TimeWave is a digital heritage platform celebrating Ngee Ann Polytechnic's rich history. 
              Explore our virtual gallery, complete quests to test your knowledge, and share your own 
              memories as part of the NP community. Earn points and redeem exciting rewards!
            </p>
          </div>
        </section>
      </div>
    </div>
  );
};

export default Index;
