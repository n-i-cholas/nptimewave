import { useGameStore } from '@/store/gameStore';
import { ArrowLeft, Check, Wallet, Gift, ShoppingBag } from 'lucide-react';
import { Link } from 'react-router-dom';

const WalletPage = () => {
  const { wallet, useVoucher, points } = useGameStore();

  const unusedItems = wallet.filter((item) => !item.used);
  const usedItems = wallet.filter((item) => item.used);
  const hasItems = wallet.length > 0;
  const hasUnusedItems = unusedItems.length > 0;
  const hasUsedItems = usedItems.length > 0;

  return (
    <div className="min-h-screen pt-20 pb-12">
      <div className="container mx-auto px-4 max-w-2xl">
        {/* Header */}
        <div className="py-8 animate-fade-in">
          <div className="flex items-center gap-4 mb-6">
            <Link
              to="/quests"
              className="p-2 rounded-full bg-secondary hover:bg-secondary/80 transition-all duration-200 hover:scale-105 active:scale-95"
            >
              <ArrowLeft className="w-5 h-5 text-foreground" />
            </Link>
            <div className="flex-1">
              <h1 className="font-display text-3xl font-bold text-foreground flex items-center gap-3">
                <Wallet className="w-8 h-8 text-primary" />
                My Wallet
              </h1>
            </div>
          </div>

          {/* Points Summary */}
          <div className="np-card p-6 bg-gradient-to-r from-primary/10 to-cyan-400/10 border-primary/20 mb-8">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-muted-foreground text-sm mb-1">Available Points</p>
                <p className="font-display text-3xl font-bold text-foreground">{points.toLocaleString()}</p>
              </div>
              <Link to="/quests" className="np-button-secondary flex items-center gap-2">
                <ShoppingBag className="w-4 h-4" />
                Visit Shop
              </Link>
            </div>
          </div>
        </div>

        {/* Empty State */}
        {!hasItems && (
          <div className="text-center py-16 animate-fade-in">
            <div className="w-20 h-20 bg-muted rounded-full flex items-center justify-center mx-auto mb-6">
              <Gift className="w-10 h-10 text-muted-foreground" />
            </div>
            <h2 className="font-display text-xl font-bold text-foreground mb-2">
              Your wallet is empty
            </h2>
            <p className="text-muted-foreground mb-6">
              Complete quests to earn points and redeem exciting rewards!
            </p>
            <Link to="/quests" className="np-button-primary">
              Start Earning Points
            </Link>
          </div>
        )}

        {/* Active Vouchers */}
        {hasUnusedItems && (
          <section className="mb-8 animate-fade-in-up" style={{ opacity: 0 }}>
            <h2 className="font-display text-xl font-bold text-foreground mb-4 flex items-center gap-2">
              <span className="w-2 h-2 bg-success rounded-full animate-pulse" />
              Active Vouchers
            </h2>
            <div className="space-y-4">
              {unusedItems.map((item, idx) => (
                <div
                  key={`${item.id}-${idx}`}
                  className="np-shop-card animate-fade-in-up"
                  style={{ animationDelay: `${idx * 100}ms`, opacity: 0 }}
                >
                  <div className="w-16 h-16 bg-np-cyan/30 rounded-xl flex items-center justify-center text-3xl">
                    {item.image}
                  </div>
                  <div className="flex-1">
                    <h3 className="font-display font-bold text-np-navy">
                      {item.name}
                    </h3>
                    <p className="text-np-navy/70 text-sm">
                      Redeemed on {new Date(item.purchasedAt).toLocaleDateString()}
                    </p>
                  </div>
                  <button
                    onClick={() => useVoucher(item.id)}
                    className="px-5 py-2.5 rounded-full bg-success text-white font-semibold hover:scale-105 transition-all duration-200 active:scale-95 shadow-lg shadow-success/20"
                  >
                    Mark as Used
                  </button>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* Used Vouchers */}
        {hasUsedItems && (
          <section className="animate-fade-in-up" style={{ opacity: 0, animationDelay: '0.2s' }}>
            <h2 className="font-display text-xl font-bold text-foreground mb-4">
              Used Vouchers
            </h2>
            <div className="space-y-3">
              {usedItems.map((item, idx) => (
                <div
                  key={`${item.id}-used-${idx}`}
                  className="np-card opacity-60 p-4"
                >
                  <div className="flex items-center gap-4">
                    <div className="w-14 h-14 bg-muted rounded-xl flex items-center justify-center text-2xl grayscale">
                      {item.image}
                    </div>
                    <div className="flex-1">
                      <h3 className="font-display font-bold text-foreground">
                        {item.name}
                      </h3>
                      <p className="text-muted-foreground text-sm">
                        Used
                      </p>
                    </div>
                    <div className="w-8 h-8 bg-success/20 rounded-full flex items-center justify-center">
                      <Check className="w-5 h-5 text-success" />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* Tip */}
        {hasItems && (
          <div className="mt-8 p-4 bg-secondary/50 rounded-xl text-center animate-fade-in">
            <p className="text-muted-foreground text-sm">
              💡 Show your voucher to the staff when making a purchase
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default WalletPage;
