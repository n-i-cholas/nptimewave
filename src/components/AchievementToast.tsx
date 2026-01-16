import { useEffect } from 'react';
import { Sparkles, X } from 'lucide-react';
import { soundManager } from '@/lib/sounds';
import { celebrateAchievement } from '@/lib/confetti';

interface AchievementToastProps {
  achievement: {
    id: string;
    name: string;
    description: string;
    icon: string;
  };
  onClose: () => void;
}

const AchievementToast = ({ achievement, onClose }: AchievementToastProps) => {
  useEffect(() => {
    soundManager.playAchievement();
    celebrateAchievement();

    const timer = setTimeout(onClose, 5000);
    return () => clearTimeout(timer);
  }, [onClose]);

  return (
    <div className="fixed top-24 left-1/2 -translate-x-1/2 z-[100] animate-bounce-in">
      <div className="bg-gradient-to-r from-np-gold/20 via-card to-np-gold/20 border border-np-gold/50 rounded-2xl p-4 shadow-2xl shadow-np-gold/20 backdrop-blur-xl min-w-[300px]">
        <button 
          onClick={onClose}
          className="absolute top-2 right-2 p-1 text-muted-foreground hover:text-foreground transition-colors"
        >
          <X className="w-4 h-4" />
        </button>

        <div className="flex items-center gap-4">
          <div className="relative">
            <div className="w-16 h-16 rounded-xl bg-np-gold/20 flex items-center justify-center text-3xl animate-bounce-in">
              {achievement.icon}
            </div>
            <Sparkles className="absolute -top-1 -right-1 w-5 h-5 text-np-gold animate-pulse" />
          </div>

          <div>
            <p className="text-xs font-medium text-np-gold uppercase tracking-wider mb-1">
              🏆 Achievement Unlocked!
            </p>
            <h4 className="font-display text-lg font-bold text-foreground">
              {achievement.name}
            </h4>
            <p className="text-sm text-muted-foreground">
              {achievement.description}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AchievementToast;
