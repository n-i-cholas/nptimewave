import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { useQuests, useShopItems, useUserProgress, useAchievements, useWallet } from '@/hooks/useGameData';
import { Heart, Coins, ChevronRight, Wallet, Store, Trophy, Target, Flame, CheckCircle2, Lock, Sparkles, LogIn } from 'lucide-react';
import npTimelineIcon from '@/assets/np-timeline-history.png';
import npCampusIcon from '@/assets/np-campus-quest.webp';
import npLecturerIcon from '@/assets/np-lecturer.jpg';
import { toast } from 'sonner';

// Achievement definitions
const achievementsList = [
  {
    id: 'history-explorer',
    name: 'History Explorer',
    description: 'Complete the Timeline quest',
    icon: '🏛️',
    requirement: { type: 'quests_completed' as const, value: 1 },
  },
  {
    id: 'campus-expert',
    name: 'Campus Expert',
    description: 'Complete all quest categories',
    icon: '🎓',
    requirement: { type: 'quests_completed' as const, value: 3 },
  },
  {
    id: 'streak-starter',
    name: 'Streak Starter',
    description: 'Play for 3 days in a row',
    icon: '🔥',
    requirement: { type: 'streak' as const, value: 3 },
  },
  {
    id: 'streak-master',
    name: 'Streak Master',
    description: 'Play for 7 days in a row',
    icon: '⚡',
    requirement: { type: 'streak' as const, value: 7 },
  },
  {
    id: 'point-collector',
    name: 'Point Collector',
    description: 'Earn 1000 points total',
    icon: '💰',
    requirement: { type: 'points_earned' as const, value: 1000 },
  },
  {
    id: 'memory-keeper',
    name: 'Memory Keeper',
    description: 'Share your first memory',
    icon: '📝',
    requirement: { type: 'memories_shared' as const, value: 1 },
  },
  {
    id: 'quiz-champion',
    name: 'Quiz Champion',
    description: 'Answer 20 questions correctly',
    icon: '🏆',
    requirement: { type: 'correct_answers' as const, value: 20 },
  },
];

type QuestsView = 'main' | 'shop' | 'achievements' | 'challenges';

const QuestsPage = () => {
  const { user, profile, refreshProfile } = useAuth();
  const { quests, loading: questsLoading } = useQuests();
  const { items: shopItems, loading: shopLoading } = useShopItems();
  const { unlockedAchievements } = useAchievements();
  const { updateStreak, getCompletedQuests, removePoints } = useUserProgress();
  const { purchaseItem } = useWallet();
  
  const [view, setView] = useState<QuestsView>('main');
  const [completedQuests, setCompletedQuests] = useState<(string | null)[]>([]);

  useEffect(() => {
    if (user) {
      updateStreak();
      getCompletedQuests().then(setCompletedQuests);
    }
  }, [user]);

  // Map quest categories to images
  const getQuestIcon = (category: string) => {
    const categoryLower = category.toLowerCase();
    if (categoryLower.includes('timeline') || categoryLower.includes('history')) {
      return npTimelineIcon;
    } else if (categoryLower.includes('campus')) {
      return npCampusIcon;
    } else if (categoryLower.includes('lecturer')) {
      return npLecturerIcon;
    }
    return npTimelineIcon; // default
  };

  // Calculate achievement progress
  const getAchievementProgress = (achievement: typeof achievementsList[0]) => {
    if (!profile) return 0;
    
    switch (achievement.requirement.type) {
      case 'quests_completed':
        return Math.min(profile.total_quests_completed / achievement.requirement.value, 1);
      case 'streak':
        return Math.min(profile.streak / achievement.requirement.value, 1);
      case 'points_earned':
        return Math.min(profile.total_points / achievement.requirement.value, 1);
      case 'correct_answers':
        return Math.min(profile.total_correct_answers / achievement.requirement.value, 1);
      default:
        return 0;
    }
  };

  const getProgressText = (achievement: typeof achievementsList[0]) => {
    if (!profile) return '0 / ' + achievement.requirement.value;
    
    switch (achievement.requirement.type) {
      case 'quests_completed':
        return `${profile.total_quests_completed} / ${achievement.requirement.value}`;
      case 'streak':
        return `${profile.streak} / ${achievement.requirement.value} days`;
      case 'points_earned':
        return `${profile.total_points} / ${achievement.requirement.value} pts`;
      case 'correct_answers':
        return `${profile.total_correct_answers} / ${achievement.requirement.value}`;
      default:
        return '0 / ' + achievement.requirement.value;
    }
  };

  const handlePurchase = async (item: any) => {
    if (!profile) return;
    
    if (profile.total_points < item.points) {
      toast.error('Not enough points!');
      return;
    }

    await removePoints(item.points);
    await purchaseItem(item);
    await refreshProfile();
    toast.success(`${item.name} added to your wallet!`);
  };

  const points = profile?.total_points || 0;
  const lives = profile?.lives || 3;
  const maxLives = profile?.max_lives || 3;
  const streak = profile?.streak || 0;

  const tabs = [
    { key: 'main', label: 'Quests', icon: ChevronRight },
    { key: 'challenges', label: 'Challenges', icon: Target },
    { key: 'achievements', label: 'Badges', icon: Trophy },
    { key: 'shop', label: 'Shop', icon: Store },
  ] as const;

  if (!user) {
    return (
      <div className="min-h-screen pt-20 pb-12 bg-background">
        <div className="container mx-auto px-4">
          <div className="max-w-md mx-auto text-center py-16">
            <div className="w-20 h-20 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-6">
              <LogIn className="w-10 h-10 text-primary" />
            </div>
            <h1 className="font-display text-3xl font-bold text-foreground mb-4">
              Sign In to Play
            </h1>
            <p className="text-muted-foreground mb-8">
              Create an account or sign in to start your quest journey, earn points, and unlock achievements!
            </p>
            <Link to="/auth" className="np-button-primary inline-flex items-center gap-2">
              <LogIn className="w-5 h-5" />
              Sign In / Sign Up
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen pt-20 pb-12 bg-background">
      <div className="container mx-auto px-4">
        {/* Header */}
        <div className="py-8 animate-fade-in">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
            <div>
              <h1 className="font-display text-4xl md:text-5xl font-bold text-foreground mb-2">
                Quests
              </h1>
              <p className="text-muted-foreground">Test your knowledge and earn rewards</p>
            </div>
            
            {/* Stats Panel */}
            <div className="flex items-center gap-3 flex-wrap">
              {/* Streak */}
              {streak > 0 && (
                <div className="np-streak-badge">
                  <Flame className="w-4 h-4" />
                  <span>{streak}</span>
                </div>
              )}

              {/* Points */}
              <div className="flex items-center gap-2 bg-card px-4 py-2 rounded-xl border border-border shadow-sm">
                <Coins className="w-5 h-5 text-np-gold" />
                <span className="font-bold text-foreground">{points.toLocaleString()}</span>
              </div>

              {/* Lives */}
              <div className="flex items-center gap-2 bg-card px-4 py-2 rounded-xl border border-border shadow-sm">
                <div className="flex gap-1">
                  {Array.from({ length: maxLives }).map((_, i) => (
                    <Heart
                      key={i}
                      className={`w-5 h-5 transition-all duration-300 ${
                        i < lives ? 'fill-destructive text-destructive' : 'text-muted-foreground'
                      }`}
                    />
                  ))}
                </div>
                <span className="text-muted-foreground text-sm">{lives}/{maxLives}</span>
              </div>

              {/* Wallet */}
              <Link
                to="/wallet"
                className="p-3 rounded-xl bg-card text-foreground hover:bg-secondary transition-all duration-200 hover:scale-105 border border-border shadow-sm"
              >
                <Wallet className="w-5 h-5" />
              </Link>
            </div>
          </div>

          {/* Tab Navigation */}
          <div className="flex gap-2 mb-8 overflow-x-auto pb-2">
            {tabs.map((tab) => {
              const Icon = tab.icon;
              return (
                <button
                  key={tab.key}
                  onClick={() => setView(tab.key)}
                  className={`flex items-center gap-2 px-4 py-2.5 rounded-xl font-medium transition-all duration-200 whitespace-nowrap ${
                    view === tab.key
                      ? 'bg-primary text-primary-foreground shadow-lg shadow-primary/20'
                      : 'bg-card text-foreground hover:bg-secondary border border-border'
                  }`}
                >
                  <Icon className="w-4 h-4" />
                  {tab.label}
                </button>
              );
            })}
          </div>
        </div>

        {/* Content */}
        {view === 'main' && (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {questsLoading ? (
              <div className="col-span-3 text-center py-12">
                <div className="animate-spin w-8 h-8 border-2 border-primary border-t-transparent rounded-full mx-auto" />
              </div>
            ) : quests.length === 0 ? (
              <div className="col-span-3 text-center py-12 text-muted-foreground">
                No quests available yet. Check back soon!
              </div>
            ) : (
              quests.map((quest, index) => {
                const isCompleted = completedQuests.includes(quest.id);
                const totalQuestions = quest.questions.length;
                
                return (
                  <Link
                    key={quest.id}
                    to={lives > 0 ? `/quests/${quest.id}` : '#'}
                    className={`np-quest-card group animate-fade-in-up ${lives === 0 ? 'opacity-50 cursor-not-allowed' : ''}`}
                    style={{ animationDelay: `${index * 100}ms`, animationFillMode: 'forwards' }}
                    onClick={(e) => lives === 0 && e.preventDefault()}
                  >
                    <div className="aspect-square rounded-xl overflow-hidden bg-card mb-4 relative">
                      <img
                        src={getQuestIcon(quest.category)}
                        alt={quest.category}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                      />
                      {/* Overlay gradient */}
                      <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                      
                      {/* Quest icon */}
                      <div className="absolute top-3 left-3 text-2xl bg-white/90 backdrop-blur-sm rounded-lg p-2 shadow-sm">
                        {quest.icon}
                      </div>
                      
                      {/* Completion badge */}
                      {isCompleted && (
                        <div className="absolute top-3 right-3 bg-success text-white px-3 py-1 rounded-full text-sm font-bold flex items-center gap-1 shadow-lg">
                          <CheckCircle2 className="w-4 h-4" />
                          Done
                        </div>
                      )}
                    </div>
                    
                    <div className="p-4">
                      <h3 className="font-display text-lg font-bold text-foreground mb-2 group-hover:text-primary transition-colors">
                        {quest.category}
                      </h3>
                      
                      {/* Progress info */}
                      <div className="mb-3">
                        <div className="flex justify-between text-xs text-muted-foreground mb-1">
                          <span>{totalQuestions} questions</span>
                          <span>{isCompleted ? '100%' : '0%'} complete</span>
                        </div>
                        <div className="np-progress-bar">
                          <div className="np-progress-fill" style={{ width: isCompleted ? '100%' : '0%' }} />
                        </div>
                      </div>
                      
                      <div className="flex items-center justify-between">
                        <span className="text-primary text-sm font-medium">
                          +{totalQuestions * 100} pts possible
                        </span>
                        <ChevronRight className="w-5 h-5 text-muted-foreground group-hover:text-primary group-hover:translate-x-1 transition-all" />
                      </div>
                    </div>
                  </Link>
                );
              })
            )}
          </div>
        )}

        {view === 'challenges' && (
          <div className="max-w-2xl mx-auto space-y-4">
            <div className="text-center mb-8 animate-fade-in">
              <h2 className="font-display text-2xl font-bold text-foreground mb-2">Daily Challenges</h2>
              <p className="text-muted-foreground">Complete challenges to earn bonus points!</p>
            </div>

            <div className="text-center py-12 text-muted-foreground">
              <Target className="w-12 h-12 mx-auto mb-4 opacity-50" />
              <p>Daily challenges coming soon!</p>
              <p className="text-sm mt-2">Complete quests to earn points in the meantime.</p>
            </div>
          </div>
        )}

        {view === 'achievements' && (
          <div className="max-w-3xl mx-auto">
            <div className="text-center mb-8 animate-fade-in">
              <h2 className="font-display text-2xl font-bold text-foreground mb-2">Achievement Badges</h2>
              <p className="text-muted-foreground">
                {unlockedAchievements.length} of {achievementsList.length} unlocked
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {achievementsList.map((achievement, index) => {
                const isUnlocked = unlockedAchievements.includes(achievement.id);
                const progress = getAchievementProgress(achievement);
                const progressText = getProgressText(achievement);
                
                return (
                  <div
                    key={achievement.id}
                    className={`${isUnlocked ? 'np-achievement-unlocked' : 'np-achievement-locked'} animate-fade-in-up`}
                    style={{ animationDelay: `${index * 50}ms`, animationFillMode: 'forwards' }}
                  >
                    <div className={`w-14 h-14 rounded-xl flex items-center justify-center text-2xl flex-shrink-0 ${
                      isUnlocked ? 'bg-np-gold/10' : 'bg-muted'
                    }`}>
                      {isUnlocked ? achievement.icon : <Lock className="w-6 h-6 text-muted-foreground" />}
                    </div>
                    <div className="flex-1 min-w-0">
                      <h3 className={`font-display font-bold ${isUnlocked ? 'text-foreground' : 'text-muted-foreground'}`}>
                        {achievement.name}
                      </h3>
                      <p className="text-sm text-muted-foreground mb-2">{achievement.description}</p>
                      
                      {/* Progress bar for locked achievements */}
                      {!isUnlocked && (
                        <div className="space-y-1">
                          <div className="np-progress-bar h-2">
                            <div 
                              className="np-progress-fill bg-primary/60"
                              style={{ width: `${progress * 100}%` }}
                            />
                          </div>
                          <p className="text-xs text-muted-foreground">{progressText}</p>
                        </div>
                      )}
                    </div>
                    {isUnlocked && (
                      <Sparkles className="w-5 h-5 text-np-gold flex-shrink-0" />
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {view === 'shop' && (
          <div className="max-w-2xl mx-auto">
            <div className="text-center mb-8 animate-fade-in">
              <h2 className="font-display text-2xl font-bold text-foreground mb-2">Rewards Shop</h2>
              <p className="text-muted-foreground">Redeem your points for exciting rewards!</p>
            </div>
            
            {shopLoading ? (
              <div className="text-center py-12">
                <div className="animate-spin w-8 h-8 border-2 border-primary border-t-transparent rounded-full mx-auto" />
              </div>
            ) : shopItems.length === 0 ? (
              <div className="text-center py-12 text-muted-foreground">
                <Store className="w-12 h-12 mx-auto mb-4 opacity-50" />
                <p>No items available yet. Check back soon!</p>
              </div>
            ) : (
              <div className="space-y-4">
                {shopItems.map((item, index) => {
                  const canAfford = points >= item.points;
                  return (
                    <div
                      key={item.id}
                      className="np-shop-card animate-fade-in-up"
                      style={{ animationDelay: `${index * 100}ms`, animationFillMode: 'forwards' }}
                    >
                      <div className="w-16 h-16 bg-primary/10 rounded-xl flex items-center justify-center text-3xl">
                        {item.image}
                      </div>
                      <div className="flex-1">
                        <h3 className="font-display font-bold text-foreground">{item.name}</h3>
                        <p className="text-muted-foreground text-sm">{item.description}</p>
                      </div>
                      <div className="text-right">
                        <p className="text-primary font-bold text-lg">{item.points} pts</p>
                        <button
                          onClick={() => handlePurchase(item)}
                          disabled={!canAfford}
                          className={`mt-2 px-4 py-2 rounded-xl text-sm font-medium transition-all ${
                            canAfford
                              ? 'bg-primary text-primary-foreground hover:scale-105'
                              : 'bg-muted text-muted-foreground cursor-not-allowed'
                          }`}
                        >
                          {canAfford ? 'Redeem' : 'Not enough'}
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        )}

        {/* No lives warning */}
        {lives === 0 && view === 'main' && (
          <div className="mt-8 p-4 bg-destructive/10 border border-destructive/20 rounded-xl text-center animate-fade-in">
            <p className="text-destructive font-medium">
              ❤️ You're out of lives! They'll reset tomorrow.
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default QuestsPage;
