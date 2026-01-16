import { Link } from 'react-router-dom';
import { useGameStore } from '@/store/gameStore';
import FeatureCard from '@/components/FeatureCard';
import { Flame, Trophy, Target, ChevronRight, Sparkles } from 'lucide-react';
import memoryPortalIcon from '@/assets/memory-portal-icon.jpg';
import questsIcon from '@/assets/quests-icon.jpg';
import vrGalleryIcon from '@/assets/vr-gallery-icon.jpg';

const Index = () => {
  const { streak, unlockedAchievements, dailyChallenges, updateStreak } = useGameStore();

  // Update streak on visit
  if (typeof window !== 'undefined') {
    updateStreak();
  }

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

  const activeChallenges = dailyChallenges.filter(c => !c.completed);

  return (
    <div className="min-h-screen pt-20 pb-12 overflow-hidden">
      <div className="container mx-auto px-4">
        {/* Hero Section */}
        <section className="py-16 md:py-24 text-center relative">
          {/* Background decoration */}
          <div className="absolute inset-0 -z-10">
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-primary/5 rounded-full blur-3xl" />
          </div>

          <div className="animate-fade-in-up" style={{ opacity: 0 }}>
            <h1 className="font-display text-4xl md:text-6xl lg:text-7xl font-bold mb-6">
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
            <Link to="/vr-gallery" className="np-button-secondary inline-flex items-center justify-center gap-2">
              View Gallery
              <ChevronRight className="w-4 h-4" />
            </Link>
          </div>
        </section>

        {/* Stats Bar */}
        {(streak > 0 || unlockedAchievements.length > 0 || activeChallenges.length > 0) && (
          <section className="py-6 mb-8">
            <div className="flex flex-wrap justify-center gap-4">
              {streak > 0 && (
                <div className="np-streak-badge animate-bounce-in">
                  <Flame className="w-5 h-5" />
                  <span>{streak} Day Streak!</span>
                </div>
              )}
              
              {unlockedAchievements.length > 0 && (
                <Link 
                  to="/quests"
                  className="flex items-center gap-2 px-4 py-2 bg-np-gold/20 text-np-gold rounded-full font-medium hover:bg-np-gold/30 transition-colors animate-fade-in"
                >
                  <Trophy className="w-5 h-5" />
                  <span>{unlockedAchievements.length} Achievements</span>
                </Link>
              )}

              {activeChallenges.length > 0 && (
                <Link 
                  to="/quests"
                  className="flex items-center gap-2 px-4 py-2 bg-primary/20 text-primary rounded-full font-medium hover:bg-primary/30 transition-colors animate-fade-in"
                >
                  <Target className="w-5 h-5" />
                  <span>{activeChallenges.length} Active Challenges</span>
                </Link>
              )}
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

        {/* Daily Challenges Preview */}
        {activeChallenges.length > 0 && (
          <section className="py-12">
            <div className="np-card p-6 max-w-2xl mx-auto animate-fade-in-up" style={{ opacity: 0, animationDelay: '0.5s' }}>
              <div className="flex items-center justify-between mb-4">
                <h2 className="font-display text-xl font-bold text-foreground flex items-center gap-2">
                  <Target className="w-5 h-5 text-primary" />
                  Today's Challenges
                </h2>
                <Link to="/quests" className="text-primary text-sm font-medium hover:underline">
                  View All
                </Link>
              </div>
              
              <div className="space-y-3">
                {activeChallenges.slice(0, 2).map((challenge) => (
                  <div key={challenge.id} className="flex items-center gap-4 p-3 bg-secondary/50 rounded-xl">
                    <div className="flex-1">
                      <p className="font-medium text-foreground text-sm">{challenge.title}</p>
                      <p className="text-muted-foreground text-xs">{challenge.description}</p>
                    </div>
                    <div className="text-right">
                      <p className="text-primary font-bold text-sm">+{challenge.reward}</p>
                      <div className="w-16 h-1.5 bg-secondary rounded-full overflow-hidden mt-1">
                        <div 
                          className="h-full bg-primary rounded-full transition-all duration-500"
                          style={{ width: `${(challenge.progress / challenge.target) * 100}%` }}
                        />
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </section>
        )}

        {/* About Section */}
        <section className="py-16 text-center">
          <div 
            className="np-card max-w-3xl mx-auto p-8 relative overflow-hidden animate-fade-in-up" 
            style={{ opacity: 0, animationDelay: '0.6s' }}
          >
            <div className="absolute top-0 right-0 w-32 h-32 bg-primary/10 rounded-full blur-2xl" />
            <div className="absolute bottom-0 left-0 w-24 h-24 bg-cyan-400/10 rounded-full blur-2xl" />
            
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
