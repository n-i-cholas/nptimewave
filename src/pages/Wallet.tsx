import { useGameStore } from '@/store/gameStore';
import { ArrowLeft, Check } from 'lucide-react';
import { Link } from 'react-router-dom';

const WalletPage = () => {
  const { wallet, useVoucher } = useGameStore();

  const unusedItems = wallet.filter((item) => !item.used);
  const usedItems = wallet.filter((item) => item.used);
  const hasItems = wallet.length > 0;
  const hasUnusedItems = unusedItems.length > 0;
  const hasUsedItems = usedItems.length > 0;

  return (
    <div className="min-h-screen pt-20 pb-12">
      <div className="container mx-auto px-4 max-w-2xl">
        {/* Header */}
        <div className="py-8">
          <div className="flex items-center gap-4 mb-8">
            <Link
              to="/quests"
              className="p-2 rounded-full bg-secondary hover:bg-secondary/80 transition-colors"
            >
              <ArrowLeft className="w-5 h-5 text-foreground" />
            </Link>
            <h1 className="font-display text-3xl font-bold text-foreground">
              My Wallet
            </h1>
          </div>
        </div>

        {/* Empty State */}
        {!hasItems && (
          <div className="text-center py-16">
            <p className="text-muted-foreground text-lg mb-4">
              Your wallet is empty
            </p>
            <Link to="/quests" className="np-button-primary">
              Go to Shop
            </Link>
          </div>
        )}

        {/* Active Vouchers */}
        {hasUnusedItems && (
          <section className="mb-8">
            <h2 className="font-display text-xl font-bold text-foreground mb-4">
              Active Vouchers
            </h2>
            <div className="space-y-4">
              {unusedItems.map((item, idx) => (
                <div
                  key={`${item.id}-${idx}`}
                  className="np-shop-card"
                >
                  <div className="w-16 h-16 bg-np-cyan rounded-xl flex items-center justify-center text-2xl">
                    {item.image}
                  </div>
                  <div className="flex-1">
                    <h3 className="font-display font-bold text-np-navy">
                      {item.name}
                    </h3>
                    <p className="text-np-navy/70 text-sm">
                      Purchased on {new Date(item.purchasedAt).toLocaleDateString()}
                    </p>
                  </div>
                  <button
                    onClick={() => useVoucher(item.id)}
                    className="px-4 py-2 rounded-full bg-success text-white font-semibold hover:scale-105 transition-transform"
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
          <section>
            <h2 className="font-display text-xl font-bold text-foreground mb-4">
              Used Vouchers
            </h2>
            <div className="space-y-4">
              {usedItems.map((item, idx) => (
                <div
                  key={`${item.id}-used-${idx}`}
                  className="np-card opacity-60"
                >
                  <div className="flex items-center gap-4">
                    <div className="w-16 h-16 bg-muted rounded-xl flex items-center justify-center text-2xl grayscale">
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
                    <Check className="w-6 h-6 text-success" />
                  </div>
                </div>
              ))}
            </div>
          </section>
        )}
      </div>
    </div>
  );
};

export default WalletPage;
