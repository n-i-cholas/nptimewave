import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useGameStore, Memory } from '@/store/gameStore';
import { Plus, Calendar, User, Filter } from 'lucide-react';

type DecadeFilter = 'all' | '1960s' | '1970s' | '1980s' | '1990s' | '2000s' | '2010s' | '2020s';

const MemoryPortal = () => {
  const { memories } = useGameStore();
  const [selectedDecade, setSelectedDecade] = useState<DecadeFilter>('all');

  const decades: DecadeFilter[] = ['all', '1960s', '1970s', '1980s', '1990s', '2000s', '2010s', '2020s'];

  const approvedMemories = memories.filter((m) => m.status === 'approved');
  const filteredMemories = selectedDecade === 'all'
    ? approvedMemories
    : approvedMemories.filter((m) => m.decade === selectedDecade);

  return (
    <div className="min-h-screen pt-20 pb-12">
      <div className="container mx-auto px-4">
        {/* Hero Section */}
        <div className="py-12 text-center">
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

        {/* Filter */}
        <div className="mb-8">
          <div className="flex items-center gap-4 flex-wrap justify-center">
            <Filter className="w-5 h-5 text-muted-foreground" />
            {decades.map((decade) => (
              <button
                key={decade}
                onClick={() => setSelectedDecade(decade)}
                className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${
                  selectedDecade === decade
                    ? 'bg-primary text-primary-foreground'
                    : 'bg-secondary text-foreground hover:bg-secondary/80'
                }`}
              >
                {decade === 'all' ? 'All Decades' : decade}
              </button>
            ))}
          </div>
        </div>

        {/* Memory Grid */}
        {filteredMemories.length === 0 ? (
          <div className="text-center py-16">
            <p className="text-muted-foreground text-lg mb-4">
              No memories found for this period.
            </p>
            <Link to="/memory-portal/submit" className="text-primary font-medium hover:underline">
              Be the first to share a memory!
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredMemories.map((memory, index) => (
              <MemoryCard key={memory.id} memory={memory} index={index} />
            ))}
          </div>
        )}

        {/* Info Section */}
        <section className="mt-16">
          <div className="np-card p-8 max-w-2xl mx-auto text-center">
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
}

const MemoryCard = ({ memory, index }: MemoryCardProps) => {
  return (
    <Link
      to={`/memory-portal/${memory.id}`}
      className="np-card-interactive p-6 animate-slide-up"
      style={{ animationDelay: `${index * 100}ms` }}
    >
      {memory.imageUrl && (
        <div className="aspect-video rounded-xl bg-muted mb-4 overflow-hidden">
          <img
            src={memory.imageUrl}
            alt={memory.title}
            className="w-full h-full object-cover"
          />
        </div>
      )}

      <div className="flex items-center gap-2 mb-3">
        <span className="px-3 py-1 bg-primary/20 text-primary text-xs font-medium rounded-full">
          {memory.decade}
        </span>
      </div>

      <h3 className="font-display text-xl font-bold text-foreground mb-2">
        {memory.title}
      </h3>

      <p className="text-muted-foreground text-sm line-clamp-3 mb-4">
        {memory.story}
      </p>

      <div className="flex items-center justify-between text-sm text-muted-foreground">
        <div className="flex items-center gap-2">
          <User className="w-4 h-4" />
          <span>{memory.anonymous ? 'Anonymous' : memory.authorName}</span>
        </div>
        <div className="flex items-center gap-2">
          <Calendar className="w-4 h-4" />
          <span>{new Date(memory.createdAt).toLocaleDateString()}</span>
        </div>
      </div>
    </Link>
  );
};

export default MemoryPortal;
