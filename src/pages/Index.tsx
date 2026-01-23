import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { Flame, Trophy, Target, Sparkles, ArrowRight, BookOpen, Gamepad2, Compass } from 'lucide-react';
import npBackground from '@/assets/np-background.jpg';
import npCampus from '@/assets/np-campus.jpg';
import npHistory from '@/assets/np-history.jpg';
import npVision from '@/assets/np-vision.jpg';
import npLogo from '@/assets/np-logo.jpg';
import Leaderboard from '@/components/Leaderboard';
import OnboardingTour from '@/components/OnboardingTour';

const Index = () => {
  const {
    user,
    profile
  } = useAuth();
  const navigate = useNavigate();
  const handleStartExploring = () => {
    if (user) {
      navigate('/quests');
    } else {
      navigate('/auth');
    }
  };
  const features = [{
    title: 'Memory Portal',
    description: 'Share and explore personal NP stories from students, alumni, and staff across decades.',
    image: npCampus,
    icon: <BookOpen className="w-6 h-6" />,
    to: '/memory-portal',
    color: 'from-blue-500/20 to-cyan-500/20'
  }, {
    title: 'Quests',
    description: 'Test your knowledge about NP history and earn points for exciting rewards!',
    image: npHistory,
    icon: <Gamepad2 className="w-6 h-6" />,
    to: '/quests',
    badge: 'Earn Points',
    color: 'from-amber-500/20 to-orange-500/20'
  }, {
    title: 'VR Gallery',
    description: 'Immerse yourself in the virtual heritage experience of NP.',
    image: npVision,
    icon: <Compass className="w-6 h-6" />,
    to: '/vr-gallery',
    color: 'from-purple-500/20 to-pink-500/20'
  }];
  return <div className="min-h-screen">
      {/* Hero Section with Background */}
      <section className="relative min-h-[85vh] flex items-center justify-center pt-20" style={{
      backgroundImage: `linear-gradient(to bottom, rgba(0,0,0,0.5), rgba(0,0,0,0.7)), url(${npBackground})`,
      backgroundSize: 'cover',
      backgroundPosition: 'center',
      backgroundAttachment: 'fixed'
    }}>
        <div className="container mx-auto px-4 text-center relative z-10">
          <div className="animate-fade-in-up" style={{
          opacity: 0
        }}>
            <h1 className="font-display text-5xl md:text-7xl lg:text-8xl font-bold mb-6 tracking-tight text-white leading-tight">
              <span className="block">Discover Our</span>
              <span className="block bg-gradient-to-r from-cyan-400 via-blue-400 to-cyan-400 bg-clip-text text-transparent">
                Digital Heritage
              </span>
            </h1>
          </div>

          <p className="text-white/80 text-lg md:text-xl max-w-2xl mx-auto mb-10 animate-fade-in-up stagger-1 leading-relaxed" style={{
          opacity: 0
        }}>
            Explore Ngee Ann Polytechnic's rich history through engaging quests, 
            personal stories, and immersive experiences.
          </p>

          <div className="animate-fade-in-up stagger-2" style={{
          opacity: 0
        }}>
            <button onClick={handleStartExploring} className="group inline-flex items-center gap-3 bg-white text-primary px-8 py-4 rounded-full font-bold text-lg hover:scale-105 transition-all duration-300 hover:shadow-2xl hover:shadow-white/20">
              <Sparkles className="w-5 h-5" />
              Start Exploring
              <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </button>
          </div>

        </div>
      </section>

      {/* Stats Bar - Only show for logged in users with profile */}
      {profile && (profile.streak > 0 || profile.total_quests_completed > 0) && <section className="py-8 bg-gradient-to-r from-primary/5 via-background to-primary/5">
          <div className="container mx-auto px-4">
            <div className="flex flex-wrap justify-center gap-4">
              {profile.streak > 0 && <div className="np-streak-badge animate-bounce-in">
                  <Flame className="w-5 h-5" />
                  <span>{profile.streak} Day Streak!</span>
                </div>}
              
              {profile.total_quests_completed > 0 && <Link to="/quests" className="flex items-center gap-2 px-5 py-2.5 bg-np-gold/10 text-np-gold rounded-full font-medium hover:bg-np-gold/20 transition-colors animate-fade-in border border-np-gold/20">
                  <Trophy className="w-5 h-5" />
                  <span>{profile.total_quests_completed} Quests Completed</span>
                </Link>}

              <Link to="/quests" className="flex items-center gap-2 px-5 py-2.5 bg-primary/10 text-primary rounded-full font-medium hover:bg-primary/20 transition-colors animate-fade-in border border-primary/20">
                <Target className="w-5 h-5" />
                <span>Daily Challenges</span>
              </Link>
            </div>
          </div>
        </section>}

      {/* Feature Cards Section */}
      <section className="py-20 bg-background">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="font-display text-3xl md:text-4xl font-bold text-foreground mb-4">
              Explore Our Platform
            </h2>
            <p className="text-muted-foreground max-w-xl mx-auto">
              Discover the many ways to connect with NP's rich heritage
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {features.map((feature, index) => <Link key={feature.title} to={feature.to} className="group relative bg-card rounded-2xl overflow-hidden border border-border hover:border-primary/30 transition-all duration-500 hover:shadow-2xl hover:shadow-primary/10 hover:-translate-y-2 animate-fade-in-up" style={{
            animationDelay: `${index * 150}ms`,
            opacity: 0
          }}>
                {/* Badge */}
                {feature.badge && <div className="absolute top-4 right-4 z-10 px-3 py-1 bg-primary text-primary-foreground text-xs font-bold rounded-full">
                    {feature.badge}
                  </div>}

                {/* Image */}
                <div className="relative h-48 overflow-hidden">
                  <img src={feature.image} alt={feature.title} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" />
                  <div className={`absolute inset-0 bg-gradient-to-t ${feature.color} opacity-60`} />
                  <div className="absolute inset-0 bg-gradient-to-t from-card via-transparent to-transparent" />
                  
                  {/* Icon */}
                  <div className="absolute bottom-4 left-4 w-12 h-12 bg-card/90 backdrop-blur-sm rounded-xl flex items-center justify-center text-primary shadow-lg">
                    {feature.icon}
                  </div>
                </div>

                {/* Content */}
                <div className="p-6">
                  <h3 className="font-display text-xl font-bold text-foreground mb-2 group-hover:text-primary transition-colors">
                    {feature.title}
                  </h3>
                  <p className="text-muted-foreground text-sm leading-relaxed mb-4">
                    {feature.description}
                  </p>
                  
                  <div className="flex items-center gap-2 text-primary font-medium group-hover:gap-3 transition-all">
                    <span>Explore</span>
                    <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                  </div>
                </div>
              </Link>)}
          </div>
        </div>
      </section>

      {/* Leaderboard Section */}
      <section className="py-16 bg-background">
        <div className="container mx-auto px-4">
          <div className="max-w-2xl mx-auto">
            <Leaderboard />
          </div>
        </div>
      </section>

      {/* About Section */}
      <section className="py-20 bg-gradient-to-b from-background to-primary/5">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center animate-fade-in-up" style={{
          opacity: 0,
          animationDelay: '0.6s'
        }}>
            <div className="np-card p-10 relative overflow-hidden">
              <div className="absolute top-0 right-0 w-40 h-40 bg-primary/5 rounded-full blur-3xl" />
              <div className="absolute bottom-0 left-0 w-32 h-32 bg-primary/5 rounded-full blur-3xl" />
              
              <div className="relative">
                <div className="w-24 h-24 rounded-2xl flex items-center justify-center mx-auto mb-6 overflow-hidden bg-white shadow-lg">
                  <img src={npLogo} alt="NP Logo" className="w-full h-full object-contain p-2" />
                </div>
                
                <h2 className="font-display text-3xl font-bold mb-4 text-foreground">About NP Timewave</h2>
                <p className="text-muted-foreground leading-relaxed text-lg max-w-2xl mx-auto">NP Timewave is a digital heritage platform celebrating Ngee Ann Polytechnic's rich history. Explore our virtual gallery, complete quests to test your knowledge, and share your own memories as part of the NP community. Earn points and redeem exciting rewards!</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Onboarding Tour */}
      <OnboardingTour />
    </div>;
};
export default Index;