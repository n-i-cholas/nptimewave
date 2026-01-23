import { useState, useEffect } from 'react';
import { X, ArrowRight, ArrowLeft, Sparkles, BookOpen, Gamepad2, Image, Gift } from 'lucide-react';

type TourStep = {
  title: string;
  description: string;
  icon: React.ReactNode;
  target?: string;
};

const TOUR_STEPS: TourStep[] = [
  {
    title: 'Welcome to NP Timewave! 🎓',
    description: 'Explore Ngee Ann Polytechnic\'s rich heritage through an interactive digital experience. Let us show you around!',
    icon: <Sparkles className="w-8 h-8" />,
  },
  {
    title: 'Memory Portal 📝',
    description: 'Share and discover personal stories from NP students, alumni, and staff across decades. Your memories become part of our collective history!',
    icon: <BookOpen className="w-8 h-8" />,
    target: '/memory-portal',
  },
  {
    title: 'Quests & Challenges 🎮',
    description: 'Test your knowledge about NP\'s history, campus, and legacy. Answer correctly to earn points and climb the leaderboard!',
    icon: <Gamepad2 className="w-8 h-8" />,
    target: '/quests',
  },
  {
    title: 'VR Gallery 🏛️',
    description: 'Experience NP\'s heritage in immersive virtual reality. Walk through history like never before!',
    icon: <Image className="w-8 h-8" />,
    target: '/vr-gallery',
  },
  {
    title: 'Rewards & Achievements 🎁',
    description: 'Earn points from quests to redeem vouchers and exclusive items. Collect achievements and build your legacy!',
    icon: <Gift className="w-8 h-8" />,
    target: '/wallet',
  },
];

const TOUR_STORAGE_KEY = 'np-timewave-tour-completed';

const OnboardingTour = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [currentStep, setCurrentStep] = useState(0);

  useEffect(() => {
    // Check if tour has been completed
    const completed = localStorage.getItem(TOUR_STORAGE_KEY);
    if (!completed) {
      // Show tour after a short delay
      const timer = setTimeout(() => setIsOpen(true), 1500);
      return () => clearTimeout(timer);
    }
  }, []);

  const handleNext = () => {
    if (currentStep < TOUR_STEPS.length - 1) {
      setCurrentStep(prev => prev + 1);
    } else {
      completeTour();
    }
  };

  const handlePrev = () => {
    if (currentStep > 0) {
      setCurrentStep(prev => prev - 1);
    }
  };

  const completeTour = () => {
    localStorage.setItem(TOUR_STORAGE_KEY, 'true');
    setIsOpen(false);
  };

  const skipTour = () => {
    localStorage.setItem(TOUR_STORAGE_KEY, 'true');
    setIsOpen(false);
  };

  if (!isOpen) return null;

  const step = TOUR_STEPS[currentStep];

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-background/80 backdrop-blur-sm"
        onClick={skipTour}
      />
      
      {/* Modal */}
      <div className="relative bg-card border border-border rounded-2xl shadow-2xl max-w-md w-full animate-fade-in-up overflow-hidden">
        {/* Progress bar */}
        <div className="h-1 bg-muted">
          <div 
            className="h-full bg-primary transition-all duration-300"
            style={{ width: `${((currentStep + 1) / TOUR_STEPS.length) * 100}%` }}
          />
        </div>

        {/* Close button */}
        <button
          onClick={skipTour}
          className="absolute top-4 right-4 p-2 hover:bg-muted rounded-lg transition-colors text-muted-foreground"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Content */}
        <div className="p-8">
          {/* Icon */}
          <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-primary/20 to-cyan-400/20 flex items-center justify-center text-primary mb-6 mx-auto">
            {step.icon}
          </div>

          {/* Step counter */}
          <div className="text-center mb-4">
            <span className="text-sm text-muted-foreground">
              Step {currentStep + 1} of {TOUR_STEPS.length}
            </span>
          </div>

          {/* Title & Description */}
          <h2 className="font-display text-2xl font-bold text-center text-foreground mb-3">
            {step.title}
          </h2>
          <p className="text-muted-foreground text-center leading-relaxed mb-8">
            {step.description}
          </p>

          {/* Navigation */}
          <div className="flex items-center justify-between gap-4">
            <button
              onClick={handlePrev}
              disabled={currentStep === 0}
              className="flex items-center gap-2 px-4 py-2 text-muted-foreground hover:text-foreground disabled:opacity-0 transition-all"
            >
              <ArrowLeft className="w-4 h-4" />
              Back
            </button>

            <div className="flex gap-1.5">
              {TOUR_STEPS.map((_, idx) => (
                <div
                  key={idx}
                  className={`w-2 h-2 rounded-full transition-colors ${
                    idx === currentStep ? 'bg-primary' : 'bg-muted'
                  }`}
                />
              ))}
            </div>

            <button
              onClick={handleNext}
              className="flex items-center gap-2 px-6 py-2.5 bg-primary text-primary-foreground rounded-xl font-medium hover:bg-primary/90 transition-colors"
            >
              {currentStep === TOUR_STEPS.length - 1 ? 'Get Started' : 'Next'}
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Skip link */}
        <div className="pb-6 text-center">
          <button
            onClick={skipTour}
            className="text-sm text-muted-foreground hover:text-foreground transition-colors"
          >
            Skip tour
          </button>
        </div>
      </div>
    </div>
  );
};

export default OnboardingTour;

// Export a function to restart the tour
export const restartOnboardingTour = () => {
  localStorage.removeItem(TOUR_STORAGE_KEY);
  window.location.reload();
};
