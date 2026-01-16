import { Link, useLocation } from 'react-router-dom';
import { useGameStore } from '@/store/gameStore';
import { Heart, Coins, User, Wallet } from 'lucide-react';

const Navbar = () => {
  const location = useLocation();
  const { points, lives, maxLives } = useGameStore();

  const navItems = [
    { path: '/', label: 'Home' },
    { path: '/memory-portal', label: 'Memory Portal' },
    { path: '/quests', label: 'Quests' },
    { path: '/vr-gallery', label: 'VR Gallery' },
  ];

  const isActive = (path: string) => {
    if (path === '/') return location.pathname === '/';
    return location.pathname.startsWith(path);
  };

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-background/95 backdrop-blur-sm border-b border-border">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2">
            <span className="font-display text-xl font-bold text-foreground">
              NP <span className="text-primary">TimeWave</span>
            </span>
          </Link>

          {/* Navigation Links */}
          <div className="hidden md:flex items-center gap-8">
            {navItems.map((item) => (
              <Link
                key={item.path}
                to={item.path}
                className={`font-medium transition-colors duration-200 ${
                  isActive(item.path)
                    ? 'text-foreground'
                    : 'text-muted-foreground hover:text-foreground'
                }`}
              >
                {item.label}
              </Link>
            ))}
          </div>

          {/* Right side - Stats and Auth */}
          <div className="flex items-center gap-4">
            {/* Lives */}
            <div className="flex items-center gap-1">
              {Array.from({ length: maxLives }).map((_, i) => (
                <Heart
                  key={i}
                  className={`w-5 h-5 ${
                    i < lives ? 'fill-np-red text-np-red' : 'text-muted-foreground'
                  }`}
                />
              ))}
              <span className="text-sm text-muted-foreground ml-1">{lives}/{maxLives}</span>
            </div>

            {/* Points */}
            <div className="flex items-center gap-2 bg-secondary px-3 py-1.5 rounded-full">
              <Coins className="w-4 h-4 text-np-gold" />
              <span className="font-semibold text-foreground">{points}</span>
            </div>

            {/* Wallet */}
            <Link
              to="/wallet"
              className="p-2 rounded-full bg-secondary hover:bg-secondary/80 transition-colors"
            >
              <Wallet className="w-5 h-5 text-foreground" />
            </Link>

            {/* Login / Sign Up */}
            <div className="hidden md:flex items-center gap-2">
              <button className="np-nav-item px-3 py-1.5">Log in</button>
              <button className="bg-secondary text-foreground px-4 py-1.5 rounded-full font-medium hover:bg-secondary/80 transition-colors">
                Sign up
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Mobile Navigation */}
      <div className="md:hidden border-t border-border">
        <div className="flex justify-around py-2">
          {navItems.map((item) => (
            <Link
              key={item.path}
              to={item.path}
              className={`text-sm font-medium py-1 px-2 ${
                isActive(item.path)
                  ? 'text-foreground'
                  : 'text-muted-foreground'
              }`}
            >
              {item.label}
            </Link>
          ))}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
