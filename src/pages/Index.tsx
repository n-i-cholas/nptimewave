import { Link } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import FeatureCard from '@/components/FeatureCard';
import { Flame, Trophy, Target, Sparkles, LogIn } from 'lucide-react';
import memoryPortalIcon from '@/assets/memory-portal-icon.jpg';
import questsIcon from '@/assets/quests-icon.jpg';
import vrGalleryIcon from '@/assets/vr-gallery-icon.jpg';

const Index = () => {
  const { user, profile } = useAuth();

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
      badge: 'Earn Points',
    },
    {
      title: 'VR Gallery',
      description: 'Immerse yourself in the virtual heritage experience of NP.',
      icon: <img src={vrGalleryIcon} alt="VR Gallery" className="w-full h-full object-cover" />,
      to: '/vr-gallery',
    },
  ];

  return (
    <div className="min-h-screen pt-20 pb-12 overflow-hidden relative bg-gradient-to-b from-primary/5 via-background to-background">
      <div className="container mx-auto px-4">
        {/* Hero Section */}
        <section className="py-16 md:py-24 text-center relative">
          {/* Background decoration */}
          <div className="absolute inset-0 -z-10">
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-primary/5 rounded-full blur-3xl" />
            <div className="absolute top-1/4 right-1/4 w-[300px] h-[300px] bg-primary/3 rounded-full blur-2xl" />
          </div>

          <div className="animate-fade-in-up" style={{ opacity: 0 }}>
            <h1 className="font-display text-4xl md:text-6xl lg:text-7xl font-bold mb-6 tracking-tight">
              <span className="text-foreground">DISCOVER OUR</span>
              <br />
              <span className="np-gradient-text">DIGITAL HERITAGE</span>
            </h1>
          </div>

          <p 
            className="text-muted-foreground text-lg md:text-xl max-w-2xl mx-auto mb-10 animate-fade-in-up stagger-1" 
            style={{ opacity: 0 }}
          >
            Explore NP's history and heritage through engaging storytelling experience.
          </p>

          <div 
            className="flex flex-col sm:flex-row justify-center gap-4 animate-fade-in-up stagger-2" 
            style={{ opacity: 0 }}
          >
            <Link to="/quests" className="np-button-primary inline-flex items-center justify-center gap-2">
              <Sparkles className="w-5 h-5" />
              Start Exploring
            </Link>
            {!user && (
              <Link to="/auth" className="np-button-secondary inline-flex items-center justify-center gap-2">
                <LogIn className="w-4 h-4" />
                Sign In
              </Link>
            )}
          </div>
        </section>

        {/* Stats Bar - Only show for logged in users with profile */}
        {profile && (profile.streak > 0 || profile.total_quests_completed > 0) && (
          <section className="py-6 mb-8">
            <div className="flex flex-wrap justify-center gap-4">
              {profile.streak > 0 && (
                <div className="np-streak-badge animate-bounce-in">
                  <Flame className="w-5 h-5" />
                  <span>{profile.streak} Day Streak!</span>
                </div>
              )}
              
              {profile.total_quests_completed > 0 && (
                <Link 
                  to="/quests"
                  className="flex items-center gap-2 px-4 py-2 bg-np-gold/10 text-np-gold rounded-full font-medium hover:bg-np-gold/20 transition-colors animate-fade-in border border-np-gold/20"
                >
                  <Trophy className="w-5 h-5" />
                  <span>{profile.total_quests_completed} Quests Completed</span>
                </Link>
              )}

              <Link 
                to="/quests"
                className="flex items-center gap-2 px-4 py-2 bg-primary/10 text-primary rounded-full font-medium hover:bg-primary/20 transition-colors animate-fade-in border border-primary/20"
              >
                <Target className="w-5 h-5" />
                <span>Daily Challenges</span>
              </Link>
            </div>
          </section>
        )}

        {/* Feature Cards */}
        <section className="py-12">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {features.map((feature, index) => (
              <FeatureCard
                key={feature.title}
                {...feature}
                delay={index * 150}
              />
            ))}
          </div>
        </section>

        {/* About Section */}
        <section className="py-16 text-center">
          <div 
            className="np-card max-w-3xl mx-auto p-8 relative overflow-hidden animate-fade-in-up" 
            style={{ opacity: 0, animationDelay: '0.6s' }}
          >
            <div className="absolute top-0 right-0 w-32 h-32 bg-primary/5 rounded-full blur-2xl" />
            <div className="absolute bottom-0 left-0 w-24 h-24 bg-primary/5 rounded-full blur-2xl" />
            
            <div className="relative">
              <h2 className="font-display text-2xl font-bold mb-4 text-foreground">
                About NP TimeWave
              </h2>
              <p className="text-muted-foreground leading-relaxed">
                NP TimeWave is a digital heritage platform celebrating Ngee Ann Polytechnic's rich history. 
                Explore our virtual gallery, complete quests to test your knowledge, and share your own 
                memories as part of the NP community. Earn points and redeem exciting rewards!
              </p>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
};

export default Index;