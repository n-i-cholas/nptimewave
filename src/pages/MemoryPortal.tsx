import { useState, useMemo, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { useMemories, Memory } from '@/hooks/useGameData';
import { Plus, Calendar, User, Filter, Search, Heart, Star, Sparkles, X } from 'lucide-react';
import npCampus from '@/assets/np-campus.jpg';

type DecadeFilter = 'all' | '1960s' | '1970s' | '1980s' | '1990s' | '2000s' | '2010s' | '2020s';

const memoryThemes = ['Campus Life', 'Friendships', 'Achievements', 'Traditions', 'Learning', 'Events', 'Teachers', 'Other'];
const memoryRoles = ['Student', 'Alumni', 'Staff', 'Faculty', 'Visitor'];

const MemoryPortal = () => {
  const { user } = useAuth();
  const { memories, loading, resonateWithMemory, getUserResonances } = useMemories();
  const [resonatedMemories, setResonatedMemories] = useState<string[]>([]);
  const [selectedDecade, setSelectedDecade] = useState<DecadeFilter>('all');
  const [selectedTheme, setSelectedTheme] = useState<string>('all');
  const [selectedRole, setSelectedRole] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [showFilters, setShowFilters] = useState(false);

  useEffect(() => {
    if (user) {
      getUserResonances().then(setResonatedMemories);
    }
  }, [user]);

  const decades: DecadeFilter[] = ['all', '1960s', '1970s', '1980s', '1990s', '2000s', '2010s', '2020s'];

  const approvedMemories = memories.filter((m) => m.status === 'approved');
  
  const featuredMemories = useMemo(() => 
    approvedMemories.filter((m) => m.featured || m.resonance_count > 20).slice(0, 2),
    [approvedMemories]
  );

  const filteredMemories = useMemo(() => {
    return approvedMemories.filter((m) => {
      if (selectedDecade !== 'all' && m.decade !== selectedDecade) return false;
      if (selectedTheme !== 'all' && m.theme !== selectedTheme) return false;
      if (selectedRole !== 'all' && m.role !== selectedRole) return false;
      if (searchQuery) {
        const query = searchQuery.toLowerCase();
        return (
          m.title.toLowerCase().includes(query) ||
          m.story.toLowerCase().includes(query) ||
          m.author_name?.toLowerCase().includes(query)
        );
      }
      return true;
    });
  }, [approvedMemories, selectedDecade, selectedTheme, selectedRole, searchQuery]);

  const clearFilters = () => {
    setSelectedDecade('all');
    setSelectedTheme('all');
    setSelectedRole('all');
    setSearchQuery('');
  };

  const hasActiveFilters = selectedDecade !== 'all' || selectedTheme !== 'all' || selectedRole !== 'all' || searchQuery;

  const handleResonate = async (memoryId: string) => {
    if (!user) return;
    if (resonatedMemories.includes(memoryId)) return;
    
    await resonateWithMemory(memoryId);
    setResonatedMemories(prev => [...prev, memoryId]);
  };

  if (loading) {
    return (
      <div className="min-h-screen pt-20 pb-12 flex items-center justify-center bg-background">
        <div className="animate-spin w-8 h-8 border-2 border-primary border-t-transparent rounded-full" />
      </div>
    );
  }

  return (
    <div className="min-h-screen pt-20 pb-12 bg-background">
      <div className="container mx-auto px-4">
        {/* Hero Section with Image */}
        <div className="relative py-12 text-center animate-fade-in rounded-2xl overflow-hidden mb-8">
          <div className="absolute inset-0 -z-10">
            <img src={npCampus} alt="NP Campus" className="w-full h-full object-cover opacity-20" />
            <div className="absolute inset-0 bg-gradient-to-b from-background/50 to-background" />
          </div>
          
          <h1 className="font-display text-4xl md:text-5xl font-bold text-foreground mb-4">
            Memory Portal
          </h1>
          <p className="text-muted-foreground text-lg max-w-2xl mx-auto mb-8">
            Explore personal stories from the NP community. Students, alumni, and staff share their
            cherished memories and experiences.
          </p>
          <Link
            to="/memory-portal/submit"
            className="np-button-primary inline-flex items-center gap-2"
          >
            <Plus className="w-5 h-5" />
            Share Your Memory
          </Link>
        </div>

        {/* Onboarding Banner */}
        <div className="np-card p-6 mb-8 bg-gradient-to-r from-primary/5 to-primary/10 border-primary/20 animate-fade-in-up" style={{ opacity: 0, animationDelay: '0.1s' }}>
          <div className="flex flex-col md:flex-row items-center gap-4 text-center md:text-left">
            <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center flex-shrink-0">
              <Sparkles className="w-8 h-8 text-primary" />
            </div>
            <div className="flex-1">
              <h3 className="font-display text-lg font-bold text-foreground mb-1">
                Your Story Matters
              </h3>
              <p className="text-muted-foreground text-sm">
                Every NP journey is unique. Share your favorite campus moments, friendships, achievements, 
                or lessons learned. Your memory becomes part of our collective heritage.
              </p>
            </div>
            <Link to="/memory-portal/submit" className="np-button-secondary whitespace-nowrap">
              Get Started
            </Link>
          </div>
        </div>

        {/* Featured Memories */}
        {featuredMemories.length > 0 && (
          <section className="mb-12 animate-fade-in-up" style={{ opacity: 0, animationDelay: '0.2s' }}>
            <div className="flex items-center gap-2 mb-6">
              <Star className="w-5 h-5 text-np-gold" />
              <h2 className="font-display text-xl font-bold text-foreground">Featured Stories</h2>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {featuredMemories.map((memory, index) => (
                <FeaturedMemoryCard 
                  key={memory.id} 
                  memory={memory} 
                  index={index}
                  isResonated={resonatedMemories.includes(memory.id)}
                  onResonate={() => handleResonate(memory.id)}
                  isLoggedIn={!!user}
                />
              ))}
            </div>
          </section>
        )}

        {/* Search and Filter */}
        <div className="mb-8 space-y-4">
          {/* Search Bar */}
          <div className="flex gap-3 animate-fade-in-up" style={{ opacity: 0, animationDelay: '0.3s' }}>
            <div className="relative flex-1">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
              <input
                type="text"
                placeholder="Search memories..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="np-input pl-12"
              />
            </div>
            <button
              onClick={() => setShowFilters(!showFilters)}
              className={`px-4 py-3 rounded-xl font-medium transition-all duration-200 flex items-center gap-2 ${
                showFilters || hasActiveFilters
                  ? 'bg-primary text-primary-foreground'
                  : 'bg-secondary text-foreground hover:bg-secondary/80'
              }`}
            >
              <Filter className="w-5 h-5" />
              <span className="hidden sm:inline">Filters</span>
              {hasActiveFilters && (
                <span className="w-2 h-2 bg-white rounded-full" />
              )}
            </button>
          </div>

          {/* Filter Panel */}
          {showFilters && (
            <div className="np-card p-6 space-y-4 animate-fade-in">
              {/* Decade Filter */}
              <div>
                <label className="block text-sm font-medium text-muted-foreground mb-2">Decade</label>
                <div className="flex flex-wrap gap-2">
                  {decades.map((decade) => (
                    <button
                      key={decade}
                      onClick={() => setSelectedDecade(decade)}
                      className={`px-3 py-1.5 rounded-full text-sm font-medium transition-all ${
                        selectedDecade === decade
                          ? 'bg-primary text-primary-foreground'
                          : 'bg-secondary text-foreground hover:bg-secondary/80'
                      }`}
                    >
                      {decade === 'all' ? 'All' : decade}
                    </button>
                  ))}
                </div>
              </div>

              {/* Theme Filter */}
              <div>
                <label className="block text-sm font-medium text-muted-foreground mb-2">Theme</label>
                <div className="flex flex-wrap gap-2">
                  <button
                    onClick={() => setSelectedTheme('all')}
                    className={`px-3 py-1.5 rounded-full text-sm font-medium transition-all ${
                      selectedTheme === 'all'
                        ? 'bg-primary text-primary-foreground'
                        : 'bg-secondary text-foreground hover:bg-secondary/80'
                    }`}
                  >
                    All Themes
                  </button>
                  {memoryThemes.map((theme) => (
                    <button
                      key={theme}
                      onClick={() => setSelectedTheme(theme)}
                      className={`px-3 py-1.5 rounded-full text-sm font-medium transition-all ${
                        selectedTheme === theme
                          ? 'bg-primary text-primary-foreground'
                          : 'bg-secondary text-foreground hover:bg-secondary/80'
                      }`}
                    >
                      {theme}
                    </button>
                  ))}
                </div>
              </div>

              {/* Role Filter */}
              <div>
                <label className="block text-sm font-medium text-muted-foreground mb-2">Role</label>
                <div className="flex flex-wrap gap-2">
                  <button
                    onClick={() => setSelectedRole('all')}
                    className={`px-3 py-1.5 rounded-full text-sm font-medium transition-all ${
                      selectedRole === 'all'
                        ? 'bg-primary text-primary-foreground'
                        : 'bg-secondary text-foreground hover:bg-secondary/80'
                    }`}
                  >
                    All Roles
                  </button>
                  {memoryRoles.map((role) => (
                    <button
                      key={role}
                      onClick={() => setSelectedRole(role)}
                      className={`px-3 py-1.5 rounded-full text-sm font-medium transition-all ${
                        selectedRole === role
                          ? 'bg-primary text-primary-foreground'
                          : 'bg-secondary text-foreground hover:bg-secondary/80'
                      }`}
                    >
                      {role}
                    </button>
                  ))}
                </div>
              </div>

              {/* Clear Filters */}
              {hasActiveFilters && (
                <button
                  onClick={clearFilters}
                  className="text-primary text-sm font-medium hover:underline flex items-center gap-1"
                >
                  <X className="w-4 h-4" />
                  Clear all filters
                </button>
              )}
            </div>
          )}
        </div>

        {/* Memory Grid */}
        {filteredMemories.length === 0 ? (
          <div className="text-center py-16 animate-fade-in">
            <div className="w-16 h-16 bg-muted rounded-full flex items-center justify-center mx-auto mb-4">
              <Search className="w-8 h-8 text-muted-foreground" />
            </div>
            <p className="text-muted-foreground text-lg mb-4">
              {hasActiveFilters ? 'No memories match your filters.' : 'No memories found for this period.'}
            </p>
            {hasActiveFilters ? (
              <button onClick={clearFilters} className="text-primary font-medium hover:underline">
                Clear filters
              </button>
            ) : (
              <Link to="/memory-portal/submit" className="text-primary font-medium hover:underline">
                Be the first to share a memory!
              </Link>
            )}
          </div>
        ) : (
          <>
            <p className="text-muted-foreground text-sm mb-4">
              Showing {filteredMemories.length} {filteredMemories.length === 1 ? 'memory' : 'memories'}
            </p>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredMemories.map((memory, index) => (
                <MemoryCard 
                  key={memory.id} 
                  memory={memory} 
                  index={index}
                  isResonated={resonatedMemories.includes(memory.id)}
                  onResonate={() => handleResonate(memory.id)}
                  isLoggedIn={!!user}
                />
              ))}
            </div>
          </>
        )}

        {/* Info Section */}
        <section className="mt-16">
          <div className="np-card p-8 max-w-2xl mx-auto text-center animate-fade-in-up" style={{ opacity: 0, animationDelay: '0.5s' }}>
            <h2 className="font-display text-2xl font-bold text-foreground mb-4">
              Share Your NP Story
            </h2>
            <p className="text-muted-foreground mb-6">
              Every memory matters. Whether it's your first day at NP, a memorable project,
              or a special moment with friends – your story is part of our heritage.
            </p>
            <p className="text-sm text-muted-foreground italic">
              Note: All submissions are reviewed before publishing to ensure quality.
            </p>
          </div>
        </section>
      </div>
    </div>
  );
};

interface MemoryCardProps {
  memory: Memory;
  index: number;
  isResonated: boolean;
  onResonate: () => void;
  isLoggedIn: boolean;
}

const MemoryCard = ({ memory, index, isResonated, onResonate, isLoggedIn }: MemoryCardProps) => {
  const handleResonate = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (isLoggedIn) {
      onResonate();
    }
  };

  return (
    <div
      className="np-card-interactive p-6 animate-fade-in-up flex flex-col"
      style={{ animationDelay: `${index * 50}ms`, opacity: 0 }}
    >
      <Link to={`/memory-portal/${memory.id}`} className="flex-1">
        {memory.image_url && (
          <div className="aspect-video rounded-xl bg-muted mb-4 overflow-hidden">
            <img
              src={memory.image_url}
              alt={memory.title}
              className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
            />
          </div>
        )}

        <div className="flex items-center gap-2 mb-3 flex-wrap">
          <span className="np-badge-primary">
            {memory.decade}
          </span>
          {memory.theme && (
            <span className="np-badge bg-secondary text-muted-foreground">
              {memory.theme}
            </span>
          )}
        </div>

        <h3 className="font-display text-xl font-bold text-foreground mb-2 hover:text-primary transition-colors">
          {memory.title}
        </h3>

        <p className="text-muted-foreground text-sm line-clamp-3 mb-4">
          {memory.story}
        </p>
      </Link>

      <div className="flex items-center justify-between text-sm pt-4 border-t border-border">
        <div className="flex items-center gap-2 text-muted-foreground">
          <User className="w-4 h-4" />
          <span>{memory.anonymous ? 'Anonymous' : memory.author_name}</span>
        </div>
        
        <button
          onClick={handleResonate}
          disabled={!isLoggedIn}
          className={`np-resonance-btn ${isResonated ? 'np-resonance-btn-active' : 'np-resonance-btn-inactive'} ${!isLoggedIn ? 'opacity-50 cursor-not-allowed' : ''}`}
          title={isLoggedIn ? 'Resonate with this memory' : 'Sign in to resonate'}
        >
          <Heart className={`w-4 h-4 ${isResonated ? 'fill-current' : ''}`} />
          <span>{memory.resonance_count}</span>
        </button>
      </div>
    </div>
  );
};

interface FeaturedMemoryCardProps {
  memory: Memory;
  index: number;
  isResonated: boolean;
  onResonate: () => void;
  isLoggedIn: boolean;
}

const FeaturedMemoryCard = ({ memory, index, isResonated, onResonate, isLoggedIn }: FeaturedMemoryCardProps) => {
  const handleResonate = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (isLoggedIn) {
      onResonate();
    }
  };

  return (
    <Link
      to={`/memory-portal/${memory.id}`}
      className="np-card group p-6 border-np-gold/20 bg-gradient-to-br from-np-gold/5 to-transparent hover:shadow-lg hover:shadow-np-gold/10 transition-all duration-300"
      style={{ animationDelay: `${index * 100}ms` }}
    >
      <div className="flex items-start gap-2 mb-3">
        <Star className="w-4 h-4 text-np-gold fill-np-gold" />
        <span className="text-np-gold text-xs font-medium">Featured Story</span>
      </div>

      <h3 className="font-display text-xl font-bold text-foreground mb-2 group-hover:text-primary transition-colors">
        {memory.title}
      </h3>

      <p className="text-muted-foreground text-sm line-clamp-2 mb-4">
        {memory.story}
      </p>

      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3 text-sm text-muted-foreground">
          <span className="np-badge-primary text-xs">{memory.decade}</span>
          <span>{memory.anonymous ? 'Anonymous' : memory.author_name}</span>
        </div>
        
        <button
          onClick={handleResonate}
          disabled={!isLoggedIn}
          className={`np-resonance-btn ${isResonated ? 'np-resonance-btn-active' : 'np-resonance-btn-inactive'} ${!isLoggedIn ? 'opacity-50 cursor-not-allowed' : ''}`}
        >
          <Heart className={`w-4 h-4 ${isResonated ? 'fill-current' : ''}`} />
          <span>{memory.resonance_count}</span>
        </button>
      </div>
    </Link>
  );
};

export default MemoryPortal;