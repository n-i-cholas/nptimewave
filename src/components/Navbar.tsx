import { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { useAchievements } from '@/hooks/useGameData';
import { supabase } from '@/integrations/supabase/client';
import { Heart, Coins, Wallet, Menu, X, Flame, Trophy, Shield, LogIn, LogOut, User } from 'lucide-react';
import ThemeToggle from './ThemeToggle';
import npLogo from '@/assets/np-logo.jpg';
const Navbar = () => {
  const location = useLocation();
  const {
    user,
    profile,
    isAdmin,
    isModerator,
    signOut
  } = useAuth();
  const {
    newAchievements,
    clearNewAchievements
  } = useAchievements();
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [pendingMemoriesCount, setPendingMemoriesCount] = useState(0);
  const [showAchievementBadge, setShowAchievementBadge] = useState(false);

  // Fetch pending memories count for admin
  useEffect(() => {
    const fetchPendingCount = async () => {
      if (!isAdmin && !isModerator) return;
      const {
        count
      } = await supabase.from('memories').select('*', {
        count: 'exact',
        head: true
      }).eq('status', 'pending');
      setPendingMemoriesCount(count || 0);
    };
    fetchPendingCount();

    // Subscribe to realtime updates
    const channel = supabase.channel('pending-memories').on('postgres_changes', {
      event: '*',
      schema: 'public',
      table: 'memories'
    }, () => {
      fetchPendingCount();
    }).subscribe();
    return () => {
      supabase.removeChannel(channel);
    };
  }, [isAdmin, isModerator]);

  // Show badge when new achievements are unlocked
  useEffect(() => {
    if (newAchievements.length > 0) {
      setShowAchievementBadge(true);
    }
  }, [newAchievements]);
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);
  useEffect(() => {
    setIsMobileMenuOpen(false);
  }, [location.pathname]);
  const navItems = [{
    path: '/',
    label: 'Home'
  }, {
    path: '/memory-portal',
    label: 'Memory Portal'
  }, {
    path: '/quests',
    label: 'Quests'
  }, {
    path: '/vr-gallery',
    label: 'VR Gallery'
  }];
  const isActive = (path: string) => {
    if (path === '/') return location.pathname === '/';
    return location.pathname.startsWith(path);
  };
  const handleAchievementClick = () => {
    setShowAchievementBadge(false);
    clearNewAchievements();
  };
  const handleSignOut = async () => {
    await signOut();
  };
  const points = profile?.total_points || 0;
  const lives = profile?.lives || 5;
  const maxLives = profile?.max_lives || 5;
  const streak = profile?.streak || 0;
  return <>
      <nav className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${isScrolled ? 'bg-background/95 backdrop-blur-md shadow-lg shadow-black/5' : 'bg-background/80 backdrop-blur-sm'} border-b border-border/50`}>
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between h-16">
            {/* Logo */}
            <Link to="/" className="flex items-center gap-2 group">
              <div className="w-8 h-8 rounded-lg overflow-hidden bg-white shadow-sm">
                <img src={npLogo} alt="NP Logo" className="w-full h-full object-contain" />
              </div>
              <span className="font-display text-xl font-bold text-foreground transition-all duration-300 group-hover:scale-105">
                <span className="np-gradient-text">Timewave</span>
              </span>
            </Link>

            {/* Navigation Links - Desktop */}
            <div className="hidden md:flex items-center gap-8">
              {navItems.map(item => <Link key={item.path} to={item.path} className={`np-nav-item ${isActive(item.path) ? 'np-nav-item-active' : ''}`}>
                  {item.label}
                </Link>)}
            </div>

            {/* Right side - Stats & Auth */}
            <div className="flex items-center gap-2">
              {/* Theme Toggle */}
              <ThemeToggle />

              {user ? <>
                  {/* Admin Badge with Pending Count */}
                  {(isAdmin || isModerator) && <Link to="/admin" className="relative hidden sm:flex items-center gap-1.5 px-3 py-1.5 bg-primary/10 rounded-full hover:bg-primary/20 transition-colors">
                      <Shield className="w-4 h-4 text-primary" />
                      <span className="text-primary text-sm font-medium">Admin</span>
                      {pendingMemoriesCount > 0 && <span className="absolute -top-1 -right-1 w-5 h-5 bg-destructive text-white text-xs rounded-full flex items-center justify-center font-bold animate-pulse">
                          {pendingMemoriesCount > 9 ? '9+' : pendingMemoriesCount}
                        </span>}
                    </Link>}

                  {/* Streak Badge */}
                  {streak > 0 && <div className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 bg-gradient-to-r from-orange-500/10 to-red-500/10 rounded-full border border-orange-500/20 animate-fade-in">
                      <Flame className="w-4 h-4 text-orange-500" />
                      <span className="font-bold text-orange-500 text-sm">{streak}</span>
                    </div>}

                  {/* Achievements with notification */}
                  <Link to="/quests" onClick={handleAchievementClick} className="relative hidden sm:flex items-center gap-1.5 px-3 py-1.5 bg-secondary rounded-full hover:bg-secondary/80 transition-colors group">
                    <Trophy className="w-4 h-4 text-np-gold group-hover:animate-bounce" />
                    {showAchievementBadge && newAchievements.length > 0 && <span className="absolute -top-1 -right-1 w-5 h-5 bg-np-gold text-np-navy text-xs rounded-full flex items-center justify-center font-bold animate-bounce">
                        {newAchievements.length}
                      </span>}
                  </Link>

                  {/* Lives */}
                  <div className="flex items-center gap-1 px-3 py-1.5 bg-secondary rounded-full">
                    <div className="flex gap-0.5">
                      {Array.from({
                    length: maxLives
                  }).map((_, i) => <Heart key={i} className={`w-4 h-4 transition-all duration-300 ${i < lives ? 'fill-np-red text-np-red' : 'text-muted-foreground'} ${i === lives - 1 && lives <= 1 ? 'animate-pulse' : ''}`} />)}
                    </div>
                  </div>

                  {/* Points */}
                  <div className="flex items-center gap-2 bg-secondary px-3 py-1.5 rounded-full group hover:bg-secondary/80 transition-colors">
                    <Coins className="w-4 h-4 text-np-gold group-hover:animate-bounce" />
                    <span className="font-bold text-foreground text-sm">{points.toLocaleString()}</span>
                  </div>

                  {/* Profile */}
                  <Link to="/profile" className="p-2 rounded-full bg-secondary hover:bg-secondary/80 transition-all duration-200 hover:scale-105 active:scale-95">
                    <User className="w-5 h-5 text-foreground" />
                  </Link>

                  {/* Wallet */}
                  <Link to="/wallet" className="p-2 rounded-full bg-secondary hover:bg-secondary/80 transition-all duration-200 hover:scale-105 active:scale-95">
                    <Wallet className="w-5 h-5 text-foreground" />
                  </Link>

                  {/* Logout */}
                  <button onClick={handleSignOut} className="hidden sm:flex p-2 rounded-full bg-secondary hover:bg-destructive/10 hover:text-destructive transition-all duration-200 hover:scale-105 active:scale-95" title="Sign Out">
                    <LogOut className="w-5 h-5" />
                  </button>
                </> : <Link to="/auth" className="flex items-center gap-2 px-4 py-2 bg-primary text-primary-foreground rounded-full font-medium hover:scale-105 transition-transform">
                  <LogIn className="w-4 h-4" />
                  <span className="hidden sm:inline">Sign In</span>
                </Link>}

              {/* Mobile Menu Toggle */}
              <button onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)} className="md:hidden p-2 rounded-full bg-secondary hover:bg-secondary/80 transition-colors">
                {isMobileMenuOpen ? <X className="w-5 h-5 text-foreground" /> : <Menu className="w-5 h-5 text-foreground" />}
              </button>
            </div>
          </div>
        </div>

        {/* Mobile Navigation */}
        <div className={`md:hidden border-t border-border overflow-hidden transition-all duration-300 ${isMobileMenuOpen ? 'max-h-[500px] opacity-100' : 'max-h-0 opacity-0'}`}>
          <div className="container mx-auto px-4 py-4 space-y-2">
            {navItems.map((item, index) => <Link key={item.path} to={item.path} className={`block px-4 py-3 rounded-xl transition-all duration-200 ${isActive(item.path) ? 'bg-primary/10 text-foreground font-semibold' : 'text-muted-foreground hover:bg-secondary hover:text-foreground'}`} style={{
            animationDelay: `${index * 50}ms`
          }}>
                {item.label}
              </Link>)}
            
            {user && <Link to="/profile" className="flex items-center gap-2 px-4 py-3 rounded-xl text-muted-foreground hover:bg-secondary hover:text-foreground">
                <User className="w-4 h-4" />
                Profile
              </Link>}
            
            {(isAdmin || isModerator) && <Link to="/admin" className="flex items-center justify-between px-4 py-3 rounded-xl bg-primary/10 text-primary font-semibold">
                <div className="flex items-center gap-2">
                  <Shield className="w-4 h-4" />
                  Admin Portal
                </div>
                {pendingMemoriesCount > 0 && <span className="px-2 py-0.5 bg-destructive text-white text-xs rounded-full font-bold">
                    {pendingMemoriesCount}
                  </span>}
              </Link>}
            
            {user ? <button onClick={handleSignOut} className="flex items-center gap-2 w-full px-4 py-3 rounded-xl text-destructive hover:bg-destructive/10 font-semibold">
                <LogOut className="w-4 h-4" />
                Sign Out
              </button> : <Link to="/auth" className="block px-4 py-3 rounded-xl bg-primary text-primary-foreground font-semibold text-center">
                Sign In / Sign Up
              </Link>}
          </div>
        </div>
      </nav>

      {/* Mobile menu overlay */}
      {isMobileMenuOpen && <div className="fixed inset-0 bg-black/50 z-40 md:hidden animate-fade-in" onClick={() => setIsMobileMenuOpen(false)} />}
    </>;
};
export default Navbar;