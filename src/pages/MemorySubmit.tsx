import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useGameStore } from '@/store/gameStore';
import { ArrowLeft, Upload, Check } from 'lucide-react';

const MemorySubmit = () => {
  const navigate = useNavigate();
  const { addMemory } = useGameStore();

  const [formData, setFormData] = useState({
    title: '',
    story: '',
    decade: '',
    authorName: '',
    anonymous: false,
    imageUrl: '',
  });

  const [submitted, setSubmitted] = useState(false);

  const decades = ['1960s', '1970s', '1980s', '1990s', '2000s', '2010s', '2020s'];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    addMemory({
      title: formData.title,
      story: formData.story,
      decade: formData.decade,
      imageUrl: formData.imageUrl || undefined,
      anonymous: formData.anonymous,
      authorName: formData.anonymous ? undefined : formData.authorName,
    });

    setSubmitted(true);
  };

  if (submitted) {
    return (
      <div className="min-h-screen pt-20 flex items-center justify-center">
        <div className="text-center max-w-md mx-auto px-4 animate-fade-in">
          <div className="w-20 h-20 bg-success/20 rounded-full flex items-center justify-center mx-auto mb-6">
            <Check className="w-10 h-10 text-success" />
          </div>
          <h2 className="font-display text-2xl font-bold text-foreground mb-4">
            Thank You for Sharing!
          </h2>
          <p className="text-muted-foreground mb-8">
            Your memory has been submitted for review. It will appear in the Memory Portal
            once approved.
          </p>
          <div className="flex gap-4 justify-center">
            <Link to="/memory-portal" className="np-button-secondary">
              Browse Memories
            </Link>
            <button
              onClick={() => {
                setSubmitted(false);
                setFormData({
                  title: '',
                  story: '',
                  decade: '',
                  authorName: '',
                  anonymous: false,
                  imageUrl: '',
                });
              }}
              className="np-button-primary"
            >
              Submit Another
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen pt-20 pb-12">
      <div className="container mx-auto px-4 max-w-2xl">
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

        {/* Form */}
        <div className="np-card p-8 animate-fade-in">
          <h1 className="font-display text-3xl font-bold text-foreground mb-2">
            Share Your Memory
          </h1>
          <p className="text-muted-foreground mb-8">
            Tell us about your NP experience. Your story becomes part of our heritage.
          </p>

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Title */}
            <div>
              <label className="block text-foreground font-medium mb-2">
                Memory Title *
              </label>
              <input
                type="text"
                required
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                placeholder="Give your memory a title"
                className="w-full px-4 py-3 bg-secondary rounded-xl border border-border text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary"
              />
            </div>

            {/* Story */}
            <div>
              <label className="block text-foreground font-medium mb-2">
                Your Story *
              </label>
              <textarea
                required
                rows={6}
                value={formData.story}
                onChange={(e) => setFormData({ ...formData, story: e.target.value })}
                placeholder="Share the details of your memory..."
                className="w-full px-4 py-3 bg-secondary rounded-xl border border-border text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary resize-none"
              />
            </div>

            {/* Decade */}
            <div>
              <label className="block text-foreground font-medium mb-2">
                Time Period *
              </label>
              <select
                required
                value={formData.decade}
                onChange={(e) => setFormData({ ...formData, decade: e.target.value })}
                className="w-full px-4 py-3 bg-secondary rounded-xl border border-border text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
              >
                <option value="">Select a decade</option>
                {decades.map((decade) => (
                  <option key={decade} value={decade}>
                    {decade}
                  </option>
                ))}
              </select>
            </div>

            {/* Image URL (Optional) */}
            <div>
              <label className="block text-foreground font-medium mb-2">
                Image URL (Optional)
              </label>
              <div className="flex gap-2">
                <input
                  type="url"
                  value={formData.imageUrl}
                  onChange={(e) => setFormData({ ...formData, imageUrl: e.target.value })}
                  placeholder="https://example.com/your-image.jpg"
                  className="flex-1 px-4 py-3 bg-secondary rounded-xl border border-border text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                />
              </div>
              <p className="text-sm text-muted-foreground mt-1">
                Add a photo to bring your memory to life
              </p>
            </div>

            {/* Anonymous Toggle */}
            <div className="flex items-center gap-3">
              <button
                type="button"
                onClick={() => setFormData({ ...formData, anonymous: !formData.anonymous })}
                className={`w-12 h-6 rounded-full transition-colors ${
                  formData.anonymous ? 'bg-primary' : 'bg-muted'
                }`}
              >
                <div
                  className={`w-5 h-5 rounded-full bg-white transition-transform ${
                    formData.anonymous ? 'translate-x-6' : 'translate-x-0.5'
                  }`}
                />
              </button>
              <span className="text-foreground">Post anonymously</span>
            </div>

            {/* Author Name */}
            {!formData.anonymous && (
              <div className="animate-fade-in">
                <label className="block text-foreground font-medium mb-2">
                  Your Name *
                </label>
                <input
                  type="text"
                  required={!formData.anonymous}
                  value={formData.authorName}
                  onChange={(e) => setFormData({ ...formData, authorName: e.target.value })}
                  placeholder="How should we credit you?"
                  className="w-full px-4 py-3 bg-secondary rounded-xl border border-border text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                />
              </div>
            )}

            {/* Review Notice */}
            <div className="bg-primary/10 border border-primary/20 rounded-xl p-4">
              <p className="text-sm text-muted-foreground">
                <strong className="text-foreground">Note:</strong> All submissions are reviewed before publishing
                to ensure they align with our community guidelines.
              </p>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              className="w-full np-button-primary py-4 text-lg"
            >
              Submit Memory
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default MemorySubmit;
