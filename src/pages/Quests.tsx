import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useGameStore, quests, shopItems } from '@/store/gameStore';
import { Heart, Coins, ChevronRight, Wallet, Store, ArrowLeft } from 'lucide-react';
import questTimelineIcon from '@/assets/quest-timeline-icon.jpg';
import questCampusIcon from '@/assets/quest-campus-icon.jpg';
import questLecturersIcon from '@/assets/quest-lecturers-icon.jpg';

type QuestsView = 'main' | 'shop';

const QuestsPage = () => {
  const { points, lives, maxLives, completedQuests } = useGameStore();
  const [view, setView] = useState<QuestsView>('main');

  const questIcons: Record<string, string> = {
    'timeline-history': questTimelineIcon,
    'campus': questCampusIcon,
    'lecturers': questLecturersIcon,
  };

  return (
    <div className="min-h-screen pt-20 pb-12">
      <div className="container mx-auto px-4">
        {/* Header */}
        <div className="py-8">
          <div className="flex items-center justify-between mb-8">
            <h1 className="font-display text-4xl md:text-5xl font-bold text-foreground">
              Quests
            </h1>
            
            {/* Stats Panel */}
            <div className="flex items-center gap-6">
              {/* Navigation Icons */}
              <div className="flex gap-2">
                <button
                  onClick={() => setView('main')}
                  className={`p-3 rounded-xl transition-colors ${
                    view === 'main' ? 'bg-primary text-primary-foreground' : 'bg-secondary text-foreground hover:bg-secondary/80'
                  }`}
                >
                  <ChevronRight className="w-5 h-5" />
                </button>
                <button
                  onClick={() => setView('shop')}
                  className={`p-3 rounded-xl transition-colors ${
                    view === 'shop' ? 'bg-primary text-primary-foreground' : 'bg-secondary text-foreground hover:bg-secondary/80'
                  }`}
                >
                  <Store className="w-5 h-5" />
                </button>
                <Link
                  to="/wallet"
                  className="p-3 rounded-xl bg-secondary text-foreground hover:bg-secondary/80 transition-colors"
                >
                  <Wallet className="w-5 h-5" />
                </Link>
              </div>

              {/* Points */}
              <div className="flex items-center gap-2 bg-secondary px-4 py-2 rounded-xl">
                <Coins className="w-5 h-5 text-np-gold" />
                <span className="font-bold text-foreground">{points}</span>
              </div>

              {/* Lives */}
              <div className="flex items-center gap-2 bg-secondary px-4 py-2 rounded-xl">
                <div className="flex gap-1">
                  {Array.from({ length: maxLives }).map((_, i) => (
                    <Heart
                      key={i}
                      className={`w-5 h-5 ${
                        i < lives ? 'fill-np-red text-np-red' : 'text-muted-foreground'
                      }`}
                    />
                  ))}
                </div>
                <span className="text-muted-foreground text-sm">{lives}/{maxLives}</span>
              </div>
            </div>
          </div>
        </div>

        {view === 'main' ? (
          /* Quest Categories */
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {quests.map((quest, index) => {
              const isCompleted = completedQuests.includes(quest.id);
              return (
                <Link
                  key={quest.id}
                  to={`/quests/${quest.id}`}
                  className="np-quest-card group animate-slide-up"
                  style={{ animationDelay: `${index * 100}ms` }}
                >
                  <div className="aspect-square rounded-xl overflow-hidden bg-card mb-4">
                    <img
                      src={questIcons[quest.id]}
                      alt={quest.category}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                  </div>
                  <div className="p-4">
                    <h3 className="font-display text-lg font-bold text-foreground mb-2">
                      {quest.category}
                    </h3>
                    <div className="flex items-center gap-2">
                      <span className={`text-sm ${isCompleted ? 'text-success' : 'text-muted-foreground'}`}>
                        {isCompleted ? '✓ Completed' : `${quest.questions.length} questions`}
                      </span>
                    </div>
                  </div>
                </Link>
              );
            })}
          </div>
        ) : (
          /* Shop View */
          <div>
            <h2 className="font-display text-2xl font-bold text-foreground mb-6">Shop</h2>
            <p className="text-primary mb-8">That's all we have for now!!</p>
            
            <div className="grid grid-cols-1 gap-4">
              {shopItems.map((item, index) => (
                <ShopItemCard key={item.id} item={item} index={index} />
              ))}
            </div>
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
  const canAfford = points >= item.points;

  const handlePurchase = () => {
    if (canAfford) {
      purchaseItem(item);
      setShowConfirm(false);
    }
  };

  return (
    <>
      <div
        className="np-shop-card animate-slide-up"
        style={{ animationDelay: `${index * 100}ms` }}
      >
        <div className="w-24 h-24 bg-np-cyan rounded-xl flex items-center justify-center text-4xl">
          {item.image}
        </div>
        <div className="flex-1">
          <h3 className="font-display font-bold text-np-navy text-lg">{item.name}</h3>
          <p className="text-np-navy/70 text-sm">{item.description}</p>
        </div>
        <div className="text-right">
          <p className="font-bold text-np-navy mb-2">{item.points} Points</p>
          <button
            onClick={() => setShowConfirm(true)}
            disabled={!canAfford}
            className={`px-6 py-2 rounded-full font-semibold transition-all ${
              canAfford
                ? 'bg-np-cyan text-np-navy hover:scale-105'
                : 'bg-gray-300 text-gray-500 cursor-not-allowed'
            }`}
          >
            Purchase
          </button>
        </div>
      </div>

      {/* Confirmation Modal */}
      {showConfirm && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-card rounded-2xl p-6 max-w-md w-full mx-4 animate-slide-up">
            <h3 className="font-display text-xl font-bold text-foreground mb-4">
              Confirm Purchase
            </h3>
            <p className="text-muted-foreground mb-6">
              Are you sure you want to purchase <strong>{item.name}</strong> for{' '}
              <strong>{item.points} points</strong>?
            </p>
            <div className="flex gap-4">
              <button
                onClick={() => setShowConfirm(false)}
                className="flex-1 py-3 rounded-full bg-secondary text-foreground font-medium"
              >
                Cancel
              </button>
              <button
                onClick={handlePurchase}
                className="flex-1 py-3 rounded-full bg-primary text-primary-foreground font-medium"
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
