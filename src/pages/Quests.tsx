import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useGameStore, quests, shopItems, achievements } from '@/store/gameStore';
import { Heart, Coins, ChevronRight, Wallet, Store, Trophy, Target, Flame, CheckCircle2, Lock, Sparkles, BarChart3 } from 'lucide-react';
import questTimelineIcon from '@/assets/quest-timeline-icon.jpg';
import questCampusIcon from '@/assets/quest-campus-icon.jpg';
import questLecturersIcon from '@/assets/quest-lecturers-icon.jpg';
import Leaderboard from '@/components/Leaderboard';

type QuestsView = 'main' | 'shop' | 'achievements' | 'challenges' | 'leaderboard';

const QuestsPage = () => {
  const { 
    points, 
    lives, 
    maxLives, 
    completedQuests, 
    streak,
    unlockedAchievements,
    dailyChallenges,
    questProgress,
    updateStreak,
  } = useGameStore();
  
  const [view, setView] = useState<QuestsView>('main');
  const [showAchievementUnlock, setShowAchievementUnlock] = useState<string | null>(null);

  useEffect(() => {
    updateStreak();
  }, []);

  const questIcons: Record<string, string> = {
    'timeline-history': questTimelineIcon,
    'campus': questCampusIcon,
    'lecturers': questLecturersIcon,
  };

  const getQuestProgress = (questId: string) => {
    const progress = questProgress[questId];
    const quest = quests.find(q => q.id === questId);
    if (!progress || !quest) return 0;
    return Math.round((progress.answered / quest.questions.length) * 100);
  };

  const tabs = [
    { key: 'main', label: 'Quests', icon: ChevronRight },
    { key: 'challenges', label: 'Challenges', icon: Target },
    { key: 'achievements', label: 'Badges', icon: Trophy },
    { key: 'leaderboard', label: 'Leaderboard', icon: BarChart3 },
    { key: 'shop', label: 'Shop', icon: Store },
  ] as const;

  return (
    <div className="min-h-screen pt-20 pb-12">
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
              <div className="flex items-center gap-2 bg-secondary px-4 py-2 rounded-xl">
                <Coins className="w-5 h-5 text-np-gold" />
                <span className="font-bold text-foreground">{points.toLocaleString()}</span>
              </div>

              {/* Lives */}
              <div className="flex items-center gap-2 bg-secondary px-4 py-2 rounded-xl">
                <div className="flex gap-1">
                  {Array.from({ length: maxLives }).map((_, i) => (
                    <Heart
                      key={i}
                      className={`w-5 h-5 transition-all duration-300 ${
                        i < lives ? 'fill-np-red text-np-red' : 'text-muted-foreground'
                      }`}
                    />
                  ))}
                </div>
                <span className="text-muted-foreground text-sm">{lives}/{maxLives}</span>
              </div>

              {/* Wallet */}
              <Link
                to="/wallet"
                className="p-3 rounded-xl bg-secondary text-foreground hover:bg-secondary/80 transition-all duration-200 hover:scale-105"
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
                      ? 'bg-primary text-primary-foreground shadow-lg shadow-primary/30'
                      : 'bg-secondary text-foreground hover:bg-secondary/80'
                  }`}
                >
                  <Icon className="w-4 h-4" />
                  {tab.label}
                  {tab.key === 'challenges' && dailyChallenges.filter(c => !c.completed).length > 0 && (
                    <span className="w-2 h-2 bg-np-red rounded-full animate-pulse" />
                  )}
                </button>
              );
            })}
          </div>
        </div>

        {/* Content */}
        {view === 'main' && (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {quests.map((quest, index) => {
              const isCompleted = completedQuests.includes(quest.id);
              const progress = getQuestProgress(quest.id);
              
              return (
                <Link
                  key={quest.id}
                  to={lives > 0 ? `/quests/${quest.id}` : '#'}
                  className={`np-quest-card group animate-fade-in-up ${lives === 0 ? 'opacity-50 cursor-not-allowed' : ''}`}
                  style={{ animationDelay: `${index * 100}ms`, opacity: 0 }}
                  onClick={(e) => lives === 0 && e.preventDefault()}
                >
                  <div className="aspect-square rounded-xl overflow-hidden bg-card mb-4 relative">
                    <img
                      src={questIcons[quest.id]}
                      alt={quest.category}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                    {/* Overlay gradient */}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                    
                    {/* Quest icon */}
                    <div className="absolute top-3 left-3 text-2xl bg-black/30 backdrop-blur-sm rounded-lg p-2">
                      {quest.icon}
                    </div>
                    
                    {/* Completion badge */}
                    {isCompleted && (
                      <div className="absolute top-3 right-3 bg-success text-white px-3 py-1 rounded-full text-sm font-bold flex items-center gap-1">
                        <CheckCircle2 className="w-4 h-4" />
                        Done
                      </div>
                    )}
                  </div>
                  
                  <div className="p-4">
                    <h3 className="font-display text-lg font-bold text-foreground mb-2 group-hover:text-primary transition-colors">
                      {quest.category}
                    </h3>
                    
                    {/* Progress bar */}
                    <div className="mb-3">
                      <div className="flex justify-between text-xs text-muted-foreground mb-1">
                        <span>{quest.questions.length} questions</span>
                        <span>{progress}% complete</span>
                      </div>
                      <div className="np-progress-bar">
                        <div className="np-progress-fill" style={{ width: `${progress}%` }} />
                      </div>
                    </div>
                    
                    <div className="flex items-center justify-between">
                      <span className="text-primary text-sm font-medium">
                        +{quest.questions.length * 100} pts possible
                      </span>
                      <ChevronRight className="w-5 h-5 text-muted-foreground group-hover:text-primary group-hover:translate-x-1 transition-all" />
                    </div>
                  </div>
                </Link>
              );
            })}
          </div>
        )}

        {view === 'challenges' && (
          <div className="max-w-2xl mx-auto space-y-4">
            <div className="text-center mb-8 animate-fade-in">
              <h2 className="font-display text-2xl font-bold text-foreground mb-2">Daily Challenges</h2>
              <p className="text-muted-foreground">Complete challenges to earn bonus points!</p>
            </div>

            {dailyChallenges.length === 0 ? (
              <div className="text-center py-12 text-muted-foreground">
                <Target className="w-12 h-12 mx-auto mb-4 opacity-50" />
                <p>No active challenges. Check back tomorrow!</p>
              </div>
            ) : (
              dailyChallenges.map((challenge, index) => (
                <div
                  key={challenge.id}
                  className={`np-card p-5 animate-fade-in-up ${challenge.completed ? 'border-success/50 bg-success/5' : ''}`}
                  style={{ animationDelay: `${index * 100}ms`, opacity: 0 }}
                >
                  <div className="flex items-start gap-4">
                    <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${
                      challenge.completed ? 'bg-success/20' : 'bg-primary/20'
                    }`}>
                      {challenge.completed ? (
                        <CheckCircle2 className="w-6 h-6 text-success" />
                      ) : (
                        <Target className="w-6 h-6 text-primary" />
                      )}
                    </div>
                    
                    <div className="flex-1">
                      <div className="flex items-center justify-between mb-1">
                        <h3 className="font-display font-bold text-foreground">{challenge.title}</h3>
                        <span className={`font-bold ${challenge.completed ? 'text-success' : 'text-primary'}`}>
                          +{challenge.reward} pts
                        </span>
                      </div>
                      <p className="text-muted-foreground text-sm mb-3">{challenge.description}</p>
                      
                      {/* Progress */}
                      <div className="flex items-center gap-3">
                        <div className="flex-1 np-progress-bar">
                          <div 
                            className={`np-progress-fill ${challenge.completed ? 'bg-success' : ''}`}
                            style={{ width: `${(challenge.progress / challenge.target) * 100}%` }}
                          />
                        </div>
                        <span className="text-sm font-medium text-muted-foreground">
                          {challenge.progress}/{challenge.target}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        )}

        {view === 'achievements' && (
          <div className="max-w-3xl mx-auto">
            <div className="text-center mb-8 animate-fade-in">
              <h2 className="font-display text-2xl font-bold text-foreground mb-2">Achievement Badges</h2>
              <p className="text-muted-foreground">
                {unlockedAchievements.length} of {achievements.length} unlocked
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {achievements.map((achievement, index) => {
                const isUnlocked = unlockedAchievements.includes(achievement.id);
                
                return (
                  <div
                    key={achievement.id}
                    className={`${isUnlocked ? 'np-achievement-unlocked' : 'np-achievement-locked'} animate-fade-in-up`}
                    style={{ animationDelay: `${index * 50}ms`, opacity: 0 }}
                  >
                    <div className={`w-14 h-14 rounded-xl flex items-center justify-center text-2xl ${
                      isUnlocked ? 'bg-np-gold/20' : 'bg-muted'
                    }`}>
                      {isUnlocked ? achievement.icon : <Lock className="w-6 h-6 text-muted-foreground" />}
                    </div>
                    <div className="flex-1">
                      <h3 className={`font-display font-bold ${isUnlocked ? 'text-foreground' : 'text-muted-foreground'}`}>
                        {achievement.name}
                      </h3>
                      <p className="text-sm text-muted-foreground">{achievement.description}</p>
                    </div>
                    {isUnlocked && (
                      <Sparkles className="w-5 h-5 text-np-gold" />
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {view === 'leaderboard' && (
          <div className="max-w-2xl mx-auto animate-fade-in">
            <Leaderboard currentUserPoints={points} />
          </div>
        )}

        {view === 'shop' && (
          <div className="max-w-2xl mx-auto">
            <div className="text-center mb-8 animate-fade-in">
              <h2 className="font-display text-2xl font-bold text-foreground mb-2">Rewards Shop</h2>
              <p className="text-muted-foreground">Redeem your points for exciting rewards!</p>
            </div>
            
            <div className="space-y-4">
              {shopItems.map((item, index) => (
                <ShopItemCard key={item.id} item={item} index={index} />
              ))}
            </div>
          </div>
        )}

        {/* No lives warning */}
        {lives === 0 && view === 'main' && (
          <div className="mt-8 p-4 bg-destructive/10 border border-destructive/20 rounded-xl text-center animate-fade-in">
            <p className="text-destructive font-medium">
              You've run out of lives! They will reset tomorrow.
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

interface ShopItemCardProps {
  item: typeof shopItems[0];
  index: number;
}

const ShopItemCard = ({ item, index }: ShopItemCardProps) => {
  const { points, purchaseItem } = useGameStore();
  const [showConfirm, setShowConfirm] = useState(false);
  const [justPurchased, setJustPurchased] = useState(false);
  const canAfford = points >= item.points;

  const handlePurchase = () => {
    if (canAfford) {
      purchaseItem(item);
      setShowConfirm(false);
      setJustPurchased(true);
      setTimeout(() => setJustPurchased(false), 2000);
    }
  };

  return (
    <>
      <div
        className={`np-shop-card animate-fade-in-up ${justPurchased ? 'ring-2 ring-success animate-bounce-in' : ''}`}
        style={{ animationDelay: `${index * 100}ms`, opacity: 0 }}
      >
        <div className="w-20 h-20 bg-np-cyan/30 rounded-xl flex items-center justify-center text-4xl">
          {item.image}
        </div>
        <div className="flex-1">
          <h3 className="font-display font-bold text-np-navy text-lg">{item.name}</h3>
          <p className="text-np-navy/70 text-sm">{item.description}</p>
        </div>
        <div className="text-right">
          <p className="font-bold text-np-navy mb-2 flex items-center gap-1 justify-end">
            <Coins className="w-4 h-4 text-np-gold" />
            {item.points}
          </p>
          <button
            onClick={() => setShowConfirm(true)}
            disabled={!canAfford}
            className={`px-5 py-2 rounded-full font-semibold transition-all duration-300 ${
              canAfford
                ? 'bg-np-navy text-white hover:scale-105 hover:shadow-lg active:scale-95'
                : 'bg-gray-300 text-gray-500 cursor-not-allowed'
            }`}
          >
            {justPurchased ? '✓ Added!' : 'Redeem'}
          </button>
        </div>
      </div>

      {/* Confirmation Modal */}
      {showConfirm && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 animate-fade-in">
          <div className="bg-card rounded-2xl p-6 max-w-md w-full mx-4 animate-scale-in border border-border">
            <div className="text-center mb-6">
              <div className="w-16 h-16 bg-primary/20 rounded-full flex items-center justify-center mx-auto mb-4 text-3xl">
                {item.image}
              </div>
              <h3 className="font-display text-xl font-bold text-foreground mb-2">
                Confirm Redemption
              </h3>
              <p className="text-muted-foreground">
                Redeem <strong className="text-foreground">{item.name}</strong> for{' '}
                <strong className="text-primary">{item.points} points</strong>?
              </p>
            </div>
            <div className="flex gap-3">
              <button
                onClick={() => setShowConfirm(false)}
                className="flex-1 py-3 rounded-full bg-secondary text-foreground font-medium hover:bg-secondary/80 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handlePurchase}
                className="flex-1 py-3 rounded-full bg-primary text-primary-foreground font-medium hover:scale-105 transition-transform"
              >
                Confirm
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default QuestsPage;
