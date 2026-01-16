import { useParams, Link } from 'react-router-dom';
import { useGameStore } from '@/store/gameStore';
import { ArrowLeft, User, Calendar } from 'lucide-react';

const MemoryDetail = () => {
  const { memoryId } = useParams<{ memoryId: string }>();
  const { memories } = useGameStore();

  const memory = memories.find((m) => m.id === memoryId && m.status === 'approved');

  if (!memory) {
    return (
      <div className="min-h-screen pt-20 flex items-center justify-center">
        <div className="text-center">
          <p className="text-foreground text-xl mb-4">Memory not found</p>
          <Link to="/memory-portal" className="np-button-primary">
            Back to Memory Portal
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen pt-20 pb-12">
      <div className="container mx-auto px-4 max-w-3xl">
        {/* Back Button */}
        <div className="py-6">
          <Link
            to="/memory-portal"
            className="inline-flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors"
          >
            <ArrowLeft className="w-5 h-5" />
            Back to Memory Portal
          </Link>
        </div>

        {/* Memory Content */}
        <article className="np-card p-8 animate-fade-in">
          {/* Header */}
          <div className="mb-6">
            <span className="px-4 py-1 bg-primary/20 text-primary text-sm font-medium rounded-full">
              {memory.decade}
            </span>
          </div>

          <h1 className="font-display text-3xl md:text-4xl font-bold text-foreground mb-6">
            {memory.title}
          </h1>

          {/* Image */}
          {memory.imageUrl && (
            <div className="aspect-video rounded-xl bg-muted mb-8 overflow-hidden">
              <img
                src={memory.imageUrl}
                alt={memory.title}
                className="w-full h-full object-cover"
              />
            </div>
          )}

          {/* Story */}
          <div className="prose prose-invert max-w-none mb-8">
            <p className="text-foreground text-lg leading-relaxed whitespace-pre-line">
              {memory.story}
            </p>
          </div>

          {/* Author Info */}
          <div className="flex items-center justify-between pt-6 border-t border-border">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-primary/20 flex items-center justify-center">
                <User className="w-5 h-5 text-primary" />
              </div>
              <div>
                <p className="font-medium text-foreground">
                  {memory.anonymous ? 'Anonymous' : memory.authorName}
                </p>
                <p className="text-sm text-muted-foreground">NP Community Member</p>
              </div>
            </div>
            <div className="flex items-center gap-2 text-muted-foreground">
              <Calendar className="w-4 h-4" />
              <span>{new Date(memory.createdAt).toLocaleDateString('en-US', {
                year: 'numeric',
                month: 'long',
                day: 'numeric',
              })}</span>
            </div>
          </div>
        </article>

        {/* Share CTA */}
        <div className="mt-8 text-center">
          <p className="text-muted-foreground mb-4">
            Inspired by this story? Share your own NP memory!
          </p>
          <Link to="/memory-portal/submit" className="np-button-primary">
            Share Your Memory
          </Link>
        </div>
      </div>
    </div>
  );
};

export default MemoryDetail;
