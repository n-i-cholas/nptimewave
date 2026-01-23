import { useParams, Link } from 'react-router-dom';
import { useMemories } from '@/hooks/useGameData';
import { useAuth } from '@/contexts/AuthContext';
import { useState, useEffect } from 'react';
import { ArrowLeft, User, Calendar, Heart, Tag } from 'lucide-react';
import SocialShare from '@/components/SocialShare';

const MemoryDetail = () => {
  const { memoryId } = useParams<{ memoryId: string }>();
  const { user } = useAuth();
  const { memories, loading, resonateWithMemory, getUserResonances } = useMemories();
  const [resonatedMemories, setResonatedMemories] = useState<string[]>([]);

  useEffect(() => {
    if (user) {
      getUserResonances().then(setResonatedMemories);
    }
  }, [user]);

  const memory = memories.find((m) => m.id === memoryId && m.status === 'approved');
  const isResonated = memory ? resonatedMemories.includes(memory.id) : false;

  if (loading) {
    return (
      <div className="min-h-screen pt-20 flex items-center justify-center">
        <div className="animate-spin w-8 h-8 border-2 border-primary border-t-transparent rounded-full" />
      </div>
    );
  }

  if (!memory) {
    return (
      <div className="min-h-screen pt-20 flex items-center justify-center">
        <div className="text-center animate-fade-in">
          <div className="w-16 h-16 bg-muted rounded-full flex items-center justify-center mx-auto mb-4">
            <User className="w-8 h-8 text-muted-foreground" />
          </div>
          <p className="text-foreground text-xl mb-4">Memory not found</p>
          <Link to="/memory-portal" className="np-button-primary">
            Back to Memory Portal
          </Link>
        </div>
      </div>
    );
  }

  const handleResonate = async () => {
    if (!user) return;
    if (resonatedMemories.includes(memory.id)) return;
    
    await resonateWithMemory(memory.id);
    setResonatedMemories(prev => [...prev, memory.id]);
  };

  return (
    <div className="min-h-screen pt-20 pb-12">
      <div className="container mx-auto px-4 max-w-3xl">
        {/* Back Button */}
        <div className="py-6 animate-fade-in">
          <Link
            to="/memory-portal"
            className="inline-flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors group"
          >
            <ArrowLeft className="w-5 h-5 group-hover:-translate-x-1 transition-transform" />
            Back to Memory Portal
          </Link>
        </div>

        {/* Memory Content */}
        <article className="np-card p-8 animate-fade-in-up" style={{ opacity: 0 }}>
          {/* Tags */}
          <div className="flex items-center gap-2 mb-6 flex-wrap">
            <span className="np-badge-primary">
              {memory.decade}
            </span>
            {memory.theme && (
              <span className="np-badge bg-secondary text-muted-foreground">
                <Tag className="w-3 h-3" />
                {memory.theme}
              </span>
            )}
            {memory.role && (
              <span className="np-badge bg-secondary text-muted-foreground">
                {memory.role}
              </span>
            )}
          </div>

          <h1 className="font-display text-3xl md:text-4xl font-bold text-foreground mb-6">
            {memory.title}
          </h1>

          {/* Image */}
          {memory.image_url && (
            <div className="aspect-video rounded-xl bg-muted mb-8 overflow-hidden">
              <img
                src={memory.image_url}
                alt={memory.title}
                className="w-full h-full object-cover"
              />
            </div>
          )}

          {/* Story */}
          <div className="mb-8">
            <p className="text-foreground text-lg leading-relaxed whitespace-pre-line">
              {memory.story}
            </p>
          </div>

          {/* Action Bar */}
          <div className="flex items-center gap-3 mb-8">
            <button
              onClick={handleResonate}
              disabled={!user}
              className={`flex-1 sm:flex-none np-resonance-btn py-3 px-6 rounded-xl ${
                isResonated ? 'np-resonance-btn-active bg-primary/20' : 'np-resonance-btn-inactive bg-secondary'
              } ${!user ? 'opacity-50 cursor-not-allowed' : ''}`}
              title={user ? 'Resonate with this memory' : 'Sign in to resonate'}
            >
              <Heart className={`w-5 h-5 ${isResonated ? 'fill-current' : ''}`} />
              <span>{isResonated ? 'Resonated!' : 'This resonates with me'}</span>
              <span className="font-bold">({memory.resonance_count})</span>
            </button>

            <SocialShare
              title={memory.title}
              text={memory.story.slice(0, 100) + '...'}
              url={window.location.href}
            />
          </div>

          {/* Author Info */}
          <div className="flex items-center justify-between pt-6 border-t border-border">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-full bg-gradient-to-br from-primary/30 to-accent/30 flex items-center justify-center">
                <User className="w-6 h-6 text-primary" />
              </div>
              <div>
                <p className="font-medium text-foreground">
                  {memory.anonymous ? 'Anonymous' : memory.author_name}
                </p>
                <p className="text-sm text-muted-foreground">NP Community Member</p>
              </div>
            </div>
            <div className="flex items-center gap-2 text-muted-foreground text-sm">
              <Calendar className="w-4 h-4" />
              <span>{new Date(memory.created_at).toLocaleDateString('en-US', {
                year: 'numeric',
                month: 'long',
                day: 'numeric',
              })}</span>
            </div>
          </div>
        </article>

        {/* Share CTA */}
        <div className="mt-8 text-center animate-fade-in-up" style={{ opacity: 0, animationDelay: '0.2s' }}>
          <div className="np-card p-6 bg-gradient-to-r from-primary/10 to-accent/10 border-primary/20">
            <p className="text-muted-foreground mb-4">
              Inspired by this story? Share your own NP memory!
            </p>
            <Link to="/memory-portal/submit" className="np-button-primary">
              Share Your Memory
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MemoryDetail;
